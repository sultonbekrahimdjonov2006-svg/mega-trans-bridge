export type VirtualTryOnStatus =
  "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "EXPIRED";
export type VirtualTryOnRequest = {
  productId: string;
  userImageAssetId: string;
  consent: boolean;
  userId?: string;
  garmentCategory?: string;
};
export type VirtualTryOnResult = {
  assetId: string;
  expiresAt: string;
  private: true;
  disclaimer: string;
};
export type VirtualTryOnJob = {
  id: string;
  productId: string;
  userImageAssetId: string;
  userId?: string;
  status: VirtualTryOnStatus;
  providerRequestId?: string;
  result?: VirtualTryOnResult;
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
};
