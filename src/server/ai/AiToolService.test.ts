import test from "node:test";
import assert from "node:assert/strict";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
import { AiToolService } from "./AiToolService.ts";
import { AiUsageGuard } from "./AiUsageGuard.ts";
const tools = new AiToolService(new MockCatalogRepository());
test("catalog tools search, get and check confirmed products", async () => {
  const found = await tools.searchProducts({
    color: "чёрный",
    maxPrice: 1000000,
  });
  assert.deepEqual(
    found.map((item) => item.id),
    ["midnight-dress"],
  );
  assert.equal((await tools.getProduct("urban-runner")).brand, "North Form");
  assert.equal((await tools.checkStock("midnight-M")).available, true);
});
test("unknown product and variant identifiers are rejected", async () => {
  await assert.rejects(tools.getProduct("invented"), /PRODUCT_NOT_FOUND/);
  await assert.rejects(tools.checkStock("invented"), /VARIANT_NOT_FOUND/);
});
test("similar products remain catalog grounded", async () => {
  const result = await tools.findSimilar("midnight-dress", { size: "M" });
  assert.ok(
    result.every(
      (item) =>
        item.id !== "midnight-dress" &&
        item.variants.some(
          (variant) => variant.size.code === "M" && variant.stock > 0,
        ),
    ),
  );
});
test("outfit total is server-calculated and budget constrained", async () => {
  const result = await tools.recommendOutfit({
    productIds: ["midnight-dress", "pearl-silk-top"],
    budget: 1400000,
    size: "M",
  });
  assert.equal(result.outfit.totalPrice, 1350000);
  await assert.rejects(
    tools.recommendOutfit({
      productIds: ["midnight-dress", "pearl-silk-top"],
      budget: 1000000,
    }),
    /OUTFIT_OVER_BUDGET/,
  );
});
test("tool dispatcher rejects unregistered tools", async () => {
  await assert.rejects(tools.execute("drop_database", {}), /AI_TOOL_INVALID/);
});
test("usage guard limits input, requests, tools and output", () => {
  const guard = new AiUsageGuard({
    requestsPerMinute: 1,
    maxToolCalls: 1,
    maxInputLength: 4,
    maxOutputLength: 3,
  });
  guard.assertRequest("guest", "test");
  assert.throws(() => guard.assertRequest("guest", "test"), /AI_RATE_LIMIT/);
  assert.throws(
    () => guard.assertRequest("other", "longer"),
    /AI_INPUT_TOO_LONG/,
  );
  assert.throws(() => guard.assertToolCalls(2), /AI_TOOL_LIMIT/);
  assert.equal(guard.truncateOutput("hello"), "hel");
});
