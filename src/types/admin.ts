export type PlatformRole =
  "CUSTOMER" | "STORE_STAFF" | "STORE_ADMIN" | "PLATFORM_ADMIN";
export type StoreMembership = {
  userId: string;
  storeId: string;
  role: Exclude<PlatformRole, "CUSTOMER">;
};
export type AnalyticsEventType =
  | "PRODUCT_VIEW"
  | "FAVORITE"
  | "CART_ADD"
  | "RESERVATION"
  | "ORDER"
  | "TRY_ON"
  | "AI_RECOMMENDATION";
export type AnalyticsEvent = {
  id: string;
  storeId: string;
  type: AnalyticsEventType;
  productId?: string;
  createdAt: string;
};
