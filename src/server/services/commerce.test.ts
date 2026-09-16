import test from "node:test";
import assert from "node:assert/strict";
import { MockCatalogRepository } from "../repositories/MockCatalogRepository.ts";
import {
  CartService,
  FavoriteService,
  ReservationService,
} from "./commerce.ts";
const catalog = new MockCatalogRepository();
test("cart uses server product price and changes quantity", async () => {
  const cart = new CartService(catalog);
  const added = await cart.add("u1", "midnight-dress", "M", 1);
  assert.equal(added.subtotal, 890000);
  const changed = await cart.setQuantity("u1", "midnight-M", 2);
  assert.equal(changed.subtotal, 1780000);
});
test("cart rejects unavailable quantity", async () => {
  await assert.rejects(
    new CartService(catalog).add("u1", "midnight-dress", "L", 3),
    /INSUFFICIENT_STOCK/,
  );
});
test("favorites are user-owned", async () => {
  const favorites = new FavoriteService();
  await favorites.add("u1", "midnight-dress");
  assert.equal(await favorites.has("u2", "midnight-dress"), false);
  await favorites.remove("u1", "midnight-dress");
  assert.deepEqual(await favorites.list("u1"), []);
});
test("reservations validate quantity and expire", async () => {
  const reservations = new ReservationService(catalog);
  const reservation = await reservations.create("midnight-dress", "M", 1);
  assert.equal(
    reservations.isExpired(
      reservation.id,
      new Date(reservation.expiresAt.getTime() - 1),
    ),
    false,
  );
  await assert.rejects(
    reservations.create("midnight-dress", "M", 0),
    /INVALID_QUANTITY/,
  );
});
test("reservation ownership prevents cross-user cancellation", async () => {
  const reservations = new ReservationService(catalog);
  const reservation = await reservations.create(
    "midnight-dress",
    "M",
    1,
    "owner",
  );
  assert.equal(await reservations.cancel(reservation.id, "attacker"), false);
  assert.equal((await reservations.list("owner")).length, 1);
  assert.equal((await reservations.list("attacker")).length, 0);
});
