import type { CatalogProduct, CatalogSearchFilters } from "../../types/catalog";

export interface CatalogRepository {
  list(filters?: CatalogSearchFilters): Promise<CatalogProduct[]>;
  getById(id: string, storeId?: string): Promise<CatalogProduct | null>;
  findSimilar(productId: string, storeId?: string): Promise<CatalogProduct[]>;
  hasStock(productId: string, sizeCode?: string): Promise<boolean>;
}

export function filterCatalog(
  products: CatalogProduct[],
  filters: CatalogSearchFilters = {},
) {
  const terms =
    filters.query?.toLocaleLowerCase("ru-RU").split(/\s+/).filter(Boolean) ??
    [];
  return products.filter((product) => {
    const searchable = [
      product.name,
      product.description,
      product.category,
      product.subcategory,
      product.brand,
      ...product.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("ru-RU");
    return (
      (!filters.storeId || product.storeId === filters.storeId) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.color ||
        product.colors.some(
          (color) =>
            color.name.toLocaleLowerCase("ru-RU") ===
            filters.color?.toLocaleLowerCase("ru-RU"),
        )) &&
      (!filters.size ||
        product.variants.some(
          (variant) =>
            variant.size.code.toUpperCase() === filters.size?.toUpperCase() &&
            variant.stock > 0,
        )) &&
      (!filters.minPrice || product.price.amount >= filters.minPrice) &&
      (!filters.maxPrice || product.price.amount <= filters.maxPrice) &&
      (!filters.tags?.length ||
        filters.tags.some((tag) => product.tags.includes(tag))) &&
      terms.every((term) => searchable.includes(term))
    );
  });
}
