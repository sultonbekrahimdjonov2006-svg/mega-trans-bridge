import test from "node:test";
import assert from "node:assert/strict";
import { validateImage } from "./ImageValidation.ts";
import { MemoryImageStorage } from "./ImageStorage.ts";
import { MockFashionImageAnalyzer } from "./FashionImageAnalyzer.ts";
import { ImageCatalogSearchService } from "./ImageCatalogSearchService.ts";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
const jpeg = { bytes: new Uint8Array([0xff, 0xd8, 1, 0xff, 0xd9]) };
test("validates bytes not client mime", () => {
  assert.equal(
    validateImage({ ...jpeg, claimedMime: "text/html" }).valid,
    true,
  );
  assert.equal(validateImage({ bytes: new Uint8Array([1, 2]) }).valid, false);
  assert.equal(
    validateImage({ bytes: new Uint8Array(10) }, { maxBytes: 2, maxCount: 1 })
      .valid,
    false,
  );
});
test("private storage uses random ids and deletion", async () => {
  const s = new MemoryImageStorage();
  const a = await s.put(jpeg, "PRODUCT_SEARCH", "image/jpeg", 100);
  const b = await s.put(jpeg, "PRODUCT_SEARCH", "image/jpeg", 100);
  assert.notEqual(a.id, b.id);
  assert.equal(a.private, true);
  assert.equal(await s.delete(a.id), true);
});
test("image search requires consent and grounds matches", async () => {
  const service = new ImageCatalogSearchService(
    new MockCatalogRepository(),
    new MemoryImageStorage(),
    new MockFashionImageAnalyzer(),
  );
  await assert.rejects(
    service.search({ image: jpeg, consent: false }),
    /CONSENT/,
  );
  const result = await service.search({
    image: jpeg,
    consent: true,
    color: "чёрный",
    maxPrice: 1000000,
  });
  assert.deepEqual(result.matches[0].productIds, ["midnight-dress"]);
  assert.equal(result.analysis.ignoredEmbeddedText, true);
});

test("rejects excessive decoded image dimensions", () => {
  const png = new Uint8Array(24);
  png.set([0x89, 0x50, 0x4e, 0x47]);
  new DataView(png.buffer).setUint32(16, 10000);
  new DataView(png.buffer).setUint32(20, 10000);
  assert.deepEqual(validateImage({ bytes: png }), {
    valid: false,
    code: "IMAGE_DIMENSIONS_INVALID",
  });
});
