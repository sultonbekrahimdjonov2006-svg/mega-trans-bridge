import type { PlatformRole, StoreMembership } from "../../types/admin";
export function requireStoreRole(
  input: {
    userId: string;
    storeId: string;
    platformRole?: PlatformRole;
    memberships: StoreMembership[];
  },
  allowed: Array<StoreMembership["role"]>,
) {
  if (input.platformRole === "PLATFORM_ADMIN") return;
  const membership = input.memberships.find(
    (m) => m.userId === input.userId && m.storeId === input.storeId,
  );
  if (!membership || !allowed.includes(membership.role))
    throw new Error("STORE_ACCESS_DENIED");
}
export function validateStock(stock: number) {
  if (!Number.isInteger(stock) || stock < 0) throw new Error("INVALID_STOCK");
  return stock;
}
