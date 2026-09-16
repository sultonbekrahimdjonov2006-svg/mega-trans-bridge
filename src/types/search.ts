import type { CatalogProduct, CatalogSearchFilters } from "@/types/catalog";
export type SearchResult = {
  status: "completed";
  products: CatalogProduct[];
  filters: CatalogSearchFilters;
};
export type DeferredSearchResult = {
  status: "not_connected" | "transcription_required";
  message: string;
};
export interface SearchService {
  searchText(query: string, storeId?: string): Promise<SearchResult>;
  searchImage(imageReference: string): Promise<DeferredSearchResult>;
  searchVoice(audioReference: string): Promise<DeferredSearchResult>;
}
