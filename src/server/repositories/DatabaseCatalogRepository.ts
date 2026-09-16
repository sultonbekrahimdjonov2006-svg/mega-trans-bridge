import type { CatalogProduct, CatalogSearchFilters } from "../../types/catalog";
import type { CatalogRepository } from "../domain/catalog.ts";
import { filterCatalog } from "../domain/catalog.ts";
import { products } from "../db/schema";

type ProductRow = typeof products.$inferSelect;
type ProductLoader = {
  select: () => { from: (table: typeof products) => Promise<ProductRow[]> };
};
function mapProduct(row: ProductRow): CatalogProduct {
  return {
    id: row.id,
    storeId: row.storeId,
    name: row.name,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    brand: row.brand,
    price: { amount: row.priceAmount, currency: row.currency as "UZS" },
    colors: row.colors as CatalogProduct["colors"],
    sizes: row.sizes as CatalogProduct["sizes"],
    images: row.images as CatalogProduct["images"],
    variants: [],
    stock: 0,
    availability: "out_of_stock",
    tags: row.tags as string[],
  };
}
/** PostgreSQL/Drizzle-backed catalog adapter. Inventory variants are joined in the next database iteration. */
export class DatabaseCatalogRepository implements CatalogRepository {
  private readonly db: ProductLoader;
  constructor(db: ProductLoader) {
    this.db = db;
  }
  async list(filters: CatalogSearchFilters = {}) {
    return filterCatalog(
      (await this.db.select().from(products)).map(mapProduct),
      filters,
    );
  }
  async getById(id: string, storeId?: string) {
    return (
      (await this.list({ storeId })).find((product) => product.id === id) ??
      null
    );
  }
  async findSimilar(productId: string, storeId?: string) {
    const product = await this.getById(productId, storeId);
    return product
      ? (await this.list({ storeId, category: product.category })).filter(
          (item) => item.id !== productId,
        )
      : [];
  }
  async hasStock(productId: string, sizeCode?: string) {
    const product = await this.getById(productId);
    return Boolean(
      product &&
      (sizeCode
        ? product.variants.some(
            (variant) => variant.size.code === sizeCode && variant.stock > 0,
          )
        : product.stock > 0),
    );
  }
}
