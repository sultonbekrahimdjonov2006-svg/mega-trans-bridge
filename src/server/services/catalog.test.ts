import test from "node:test";
import assert from "node:assert/strict";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
import { parseCatalogIntent } from "./intent.ts";
import { AiSellerOrchestrator } from "./AiSellerOrchestrator.ts";
import { MockAiProvider } from "../ai/MockAiProvider.ts";
import { MockConsultantHandoff } from "../handoff/MockConsultantHandoff.ts";
const repo = new MockCatalogRepository();
test("catalog filters by price and color", async () => {
  const products = await repo.list({ color: "чёрный", maxPrice: 1000000 });
  assert.deepEqual(
    products.map((item) => item.id),
    ["midnight-dress"],
  );
});
test("catalog filters products with size M", async () => {
  const products = await repo.list({ size: "M" });
  assert.ok(
    products.every((item) =>
      item.variants.some(
        (variant) => variant.size.code === "M" && variant.stock > 0,
      ),
    ),
  );
});
test("catalog resolves a product by id", async () => {
  assert.equal(
    (await repo.getById("urban-runner"))?.name,
    "Кроссовки Urban Runner",
  );
});
test("intent parser extracts relevant catalog filters", () => {
  assert.deepEqual(
    parseCatalogIntent("Мне нужно чёрное платье до 1 000 000 сум"),
    {
      maxPrice: 1000000,
      size: undefined,
      color: "чёрный",
      category: "women",
      tags: ["платье"],
    },
  );
});
test("orchestrator returns catalog recommendations", async () => {
  const orchestrator = new AiSellerOrchestrator(new MockAiProvider(repo));
  const response = await orchestrator.respond(
    { type: "text", text: "Покажи мужские кроссовки" },
    {
      id: "conversation",
      messages: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  );
  assert.equal(response.recommendations[0]?.product.id, "urban-runner");
});
test("consultant handoff preserves payload", async () => {
  const payload = {
    conversationId: "c-1",
    selectedProductIds: ["midnight-dress"],
    requestedSizes: ["M"],
    preferences: ["чёрный"],
    summary: "Ищет платье",
    reason: "Нужна помощь с выбором",
  };
  const result = await new MockConsultantHandoff().request(payload);
  assert.equal(result.status, "queued");
  assert.deepEqual(result.payload, payload);
});
import { catalogQuery, productId } from "./validation.ts";
test("validation accepts safe catalog requests and rejects malformed values", () => {
  assert.equal(
    catalogQuery(new URLSearchParams("maxPrice=500000&size=M")).success,
    true,
  );
  assert.equal(catalogQuery(new URLSearchParams("maxPrice=-1")).success, false);
  assert.equal(productId("midnight-dress").success, true);
  assert.equal(productId("../private").success, false);
});
