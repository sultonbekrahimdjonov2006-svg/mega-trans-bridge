import test from "node:test";
import assert from "node:assert/strict";
import { requireStoreRole, validateStock } from "./authorization.ts";
const memberships = [
  { userId: "staff", storeId: "s1", role: "STORE_STAFF" as const },
];
test("store authorization prevents cross-tenant access", () => {
  requireStoreRole({ userId: "staff", storeId: "s1", memberships }, [
    "STORE_STAFF",
  ]);
  assert.throws(
    () =>
      requireStoreRole({ userId: "staff", storeId: "s2", memberships }, [
        "STORE_STAFF",
      ]),
    /DENIED/,
  );
});
test("inventory never accepts negative stock", () => {
  assert.equal(validateStock(2), 2);
  assert.throws(() => validateStock(-1), /INVALID_STOCK/);
});
