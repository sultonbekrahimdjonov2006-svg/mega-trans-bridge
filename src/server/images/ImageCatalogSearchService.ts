import type { CatalogRepository } from "../domain/catalog.ts";
import type { FashionImageAnalyzer } from "./FashionImageAnalyzer.ts";
import type { ImageStorage } from "./ImageStorage.ts";
import { validateImage } from "./ImageValidation.ts";
import type { ImageSearchQuery } from "../../types/image";
export class ImageCatalogSearchService {
  private catalog: CatalogRepository;
  private storage: ImageStorage;
  private analyzer: FashionImageAnalyzer;
  constructor(
    catalog: CatalogRepository,
    storage: ImageStorage,
    analyzer: FashionImageAnalyzer,
  ) {
    this.catalog = catalog;
    this.storage = storage;
    this.analyzer = analyzer;
  }
  async search(query: ImageSearchQuery) {
    if (!query.consent) throw new Error("IMAGE_CONSENT_REQUIRED");
    const valid = validateImage(query.image);
    if (!valid.valid) throw new Error(valid.code);
    const asset = await this.storage.put(
      query.image,
      "PRODUCT_SEARCH",
      valid.mime,
      86400000,
    );
    const analysis = await this.analyzer.analyze(asset);
    const matches = [];
    for (const item of analysis.items.slice(0, 3)) {
      const products = await this.catalog.list({
        query: query.text,
        category: item.category,
        color: query.color ?? item.color,
        size: query.size,
        maxPrice: query.maxPrice,
        storeId: query.storeId,
        tags: item.tags,
      });
      matches.push({ item, productIds: products.map((p) => p.id) });
    }
    return { asset, analysis, matches };
  }
}
