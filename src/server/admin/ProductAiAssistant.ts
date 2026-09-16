export type ProductDraftSuggestion = {
  category?: string;
  color?: string;
  tags: string[];
  description?: string;
  requiresHumanReview: true;
};
export interface ProductImageAssistant {
  suggest(privateImageAssetId: string): Promise<ProductDraftSuggestion>;
}
export class MockProductImageAssistant implements ProductImageAssistant {
  async suggest() {
    return { tags: [], requiresHumanReview: true as const };
  }
}
