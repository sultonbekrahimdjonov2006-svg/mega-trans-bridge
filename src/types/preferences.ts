export type GarmentSizePreference = {
  category: "tops" | "trousers" | "shoes";
  value: string;
  guidanceOnly: true;
};
export type FashionPreferenceProfile = {
  userId: string;
  preferredCategories: string[];
  preferredColors: string[];
  dislikedColors: string[];
  budget?: { min?: number; max?: number; currency: "UZS" };
  sizes: GarmentSizePreference[];
  styleTags: string[];
  updatedAt: string;
};
export type PreferenceConsent = {
  explicit: boolean;
  source: "PROFILE" | "CONVERSATION_CONFIRMATION";
};
