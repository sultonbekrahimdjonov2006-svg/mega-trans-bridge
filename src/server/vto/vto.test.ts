import test from "node:test";
import assert from "node:assert/strict";
import { MemoryImageStorage } from "../images/ImageStorage.ts";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
import { MockVirtualTryOnProvider } from "./VirtualTryOnProvider.ts";
import { VirtualTryOnService } from "./VirtualTryOnService.ts";
test("grounds VTO job and stores private expiring result", async () => {
  const storage = new MemoryImageStorage();
  const image = await storage.put(
    { bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]) },
    "VIRTUAL_TRY_ON_INPUT",
    "image/jpeg",
    1000,
  );
  const service = new VirtualTryOnService(
    new MockCatalogRepository(),
    storage,
    new MockVirtualTryOnProvider(),
  );
  await assert.rejects(
    service.create({
      productId: "fake",
      userImageAssetId: image.id,
      consent: true,
    }),
    /PRODUCT/,
  );
  await assert.rejects(
    service.create({
      productId: "midnight-dress",
      userImageAssetId: image.id,
      consent: false,
    }),
    /CONSENT/,
  );
  const job = await service.create({
    productId: "midnight-dress",
    userImageAssetId: image.id,
    consent: true,
  });
  const done = await service.refresh(job.id);
  assert.equal(done.result?.private, true);
  assert.equal(await service.delete(job.id), true);
});
test("provider failure is not presented as success", async () => {
  const storage = new MemoryImageStorage();
  const image = await storage.put(
    { bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]) },
    "USER_PHOTO",
    "image/jpeg",
    100,
  );
  await assert.rejects(
    new VirtualTryOnService(
      new MockCatalogRepository(),
      storage,
      new MockVirtualTryOnProvider(true),
    ).create({
      productId: "midnight-dress",
      userImageAssetId: image.id,
      consent: true,
    }),
    /FAILED/,
  );
});
test("VTO deletion enforces owner", async () => {
  const storage = new MemoryImageStorage();
  const image = await storage.put(
    { bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]) },
    "VIRTUAL_TRY_ON_INPUT",
    "image/jpeg",
    1000,
  );
  const service = new VirtualTryOnService(
    new MockCatalogRepository(),
    storage,
    new MockVirtualTryOnProvider(),
  );
  const job = await service.create({
    productId: "midnight-dress",
    userImageAssetId: image.id,
    consent: true,
    userId: "owner",
  });
  await assert.rejects(service.delete(job.id, "attacker"), /ACCESS_DENIED/);
  assert.equal(await service.delete(job.id, "owner"), true);
});
