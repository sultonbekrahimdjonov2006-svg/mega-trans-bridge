import test from "node:test";
import assert from "node:assert/strict";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
import {
  CartService,
  FavoriteService,
  ReservationService,
} from "../services/commerce.ts";
import { MockConsultantHandoff } from "../handoff/MockConsultantHandoff.ts";
import { AiCommerceTools } from "./AiCommerceTools.ts";
const catalog = new MockCatalogRepository();
const favorites = new FavoriteService();
const tools = new AiCommerceTools(
  catalog,
  favorites,
  new CartService(catalog),
  new ReservationService(catalog),
  new MockConsultantHandoff(),
);
test("guest commerce mutations require authentication", async () => {
  await assert.rejects(
    tools.addFavorite({ conversationId: "c1" }, "midnight-dress"),
    /AUTH_REQUIRED/,
  );
  await assert.rejects(
    tools.addToCart({ conversationId: "c1" }, "midnight-M", 1),
    /AUTH_REQUIRED/,
  );
});
test("authenticated commerce actions use grounded variants", async () => {
  const context = { userId: "u1", conversationId: "c1" };
  await tools.addFavorite(context, "midnight-dress");
  assert.equal(await favorites.has("u1", "midnight-dress"), true);
  assert.equal(
    (await tools.addToCart(context, "midnight-M", 1)).subtotal,
    890000,
  );
  assert.equal(
    (await tools.reserve(context, "midnight-M", 1)).status,
    "active",
  );
  await assert.rejects(
    tools.addToCart(context, "fake-variant", 1),
    /VARIANT_NOT_FOUND/,
  );
});
test("consultant payload is grounded and identifies user", async () => {
  const result = await tools.callConsultant(
    { userId: "u1", conversationId: "c1" },
    "Нужна помощь",
    ["midnight-dress"],
  );
  assert.equal(result.payload.userId, "u1");
  assert.deepEqual(result.payload.selectedProductIds, ["midnight-dress"]);
});
