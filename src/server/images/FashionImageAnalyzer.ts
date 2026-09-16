import type { ClothingImageAnalysis, ImageAsset } from "../../types/image";
export interface FashionImageAnalyzer {
  analyze(asset: ImageAsset): Promise<ClothingImageAnalysis>;
}
export class MockFashionImageAnalyzer implements FashionImageAnalyzer {
  private items: ClothingImageAnalysis["items"];
  constructor(
    items: ClothingImageAnalysis["items"] = [
      {
        category: "women",
        subcategory: "dresses",
        color: "чёрный",
        tags: ["платье"],
        confidence: 0.9,
        visualEstimate: true,
      },
    ],
  ) {
    this.items = items;
  }
  async analyze() {
    return {
      items: this.items.slice(0, 3),
      ignoredEmbeddedText: true as const,
    };
  }
}
