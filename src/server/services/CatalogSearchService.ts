import type { SearchService } from "../../types/search";
import type { CatalogRepository } from "../domain/catalog.ts";
import { parseCatalogIntent } from "./intent.ts";
export class CatalogSearchService implements SearchService {
  private readonly catalog: CatalogRepository;

  constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }
  async searchText(query: string, storeId?: string) {
    const filters = { ...parseCatalogIntent(query), storeId };
    return {
      status: "completed" as const,
      products: await this.catalog.list(filters),
      filters,
    };
  }
  async searchImage() {
    return {
      status: "not_connected" as const,
      message: "Поиск по изображению ещё не подключён; файлы не отправлялись.",
    };
  }
  async searchVoice() {
    return {
      status: "transcription_required" as const,
      message:
        "Для голосового поиска сначала требуется безопасная транскрибация.",
    };
  }
}
