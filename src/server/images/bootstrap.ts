import { catalogRepository } from "../bootstrap.ts";
import { MockFashionImageAnalyzer } from "./FashionImageAnalyzer.ts";
import { ImageCatalogSearchService } from "./ImageCatalogSearchService.ts";
import { MemoryImageStorage } from "./ImageStorage.ts";
export const imageStorage = new MemoryImageStorage();
export const imageCatalogSearchService = new ImageCatalogSearchService(
  catalogRepository,
  imageStorage,
  new MockFashionImageAnalyzer(),
);
