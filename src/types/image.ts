export type ImagePurpose =
  | "PRODUCT_SEARCH"
  | "USER_PHOTO"
  | "VIRTUAL_TRY_ON_INPUT"
  | "VIRTUAL_TRY_ON_RESULT";
export type UploadedImage = {
  bytes: Uint8Array;
  claimedMime?: string;
  originalName?: string;
};
export type ImageAsset = {
  id: string;
  purpose: ImagePurpose;
  mime: "image/jpeg" | "image/png" | "image/webp";
  bytes: number;
  createdAt: string;
  expiresAt: string;
  private: true;
};
export type ImageValidationResult =
  | { valid: true; mime: ImageAsset["mime"] }
  | {
      valid: false;
      code:
        | "IMAGE_EMPTY"
        | "IMAGE_TOO_LARGE"
        | "IMAGE_UNSUPPORTED"
        | "IMAGE_CORRUPT"
        | "IMAGE_DIMENSIONS_INVALID";
    };
export type DetectedFashionItem = {
  category: string;
  subcategory?: string;
  color?: string;
  pattern?: string;
  estimatedMaterial?: string;
  style?: string;
  tags: string[];
  confidence: number;
  visualEstimate: true;
};
export type ClothingImageAnalysis = {
  items: DetectedFashionItem[];
  ignoredEmbeddedText: true;
};
export type ImageSearchQuery = {
  image: UploadedImage;
  consent: boolean;
  text?: string;
  color?: string;
  size?: string;
  maxPrice?: number;
  storeId?: string;
};
export type ImageSearchResult = {
  asset: ImageAsset;
  analysis: ClothingImageAnalysis;
  matches: Array<{ item: DetectedFashionItem; productIds: string[] }>;
};
