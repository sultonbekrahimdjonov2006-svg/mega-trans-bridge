import type { CatalogRepository } from "../domain/catalog.ts";
import type { CatalogProduct, CatalogSearchFilters } from "../../types/catalog";
import type { AiOutfit } from "../../types/ai";

export type StockResult = {
  available: boolean;
  status: "in_stock" | "out_of_stock";
  size?: string;
  color?: string;
};
export class AiToolService {
  private readonly catalog: CatalogRepository;
  constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }
  async execute(name: string, args: Record<string, unknown>) {
    if (name === "search_products")
      return { products: await this.searchProducts(this.filters(args)) };
    if (name === "get_product") {
      const product = await this.getProduct(
        this.string(args.productId, "productId"),
      );
      return { products: [product], data: product };
    }
    if (name === "check_stock")
      return {
        products: [],
        data: await this.checkStock(this.string(args.variantId, "variantId")),
      };
    if (name === "find_similar_products")
      return {
        products: await this.findSimilar(
          this.string(args.productId, "productId"),
          this.filters(args),
        ),
      };
    if (name === "recommend_outfit") {
      const ids =
        Array.isArray(args.productIds) &&
        args.productIds.every((id) => typeof id === "string")
          ? args.productIds
          : [];
      return this.recommendOutfit({
        productIds: ids,
        occasion: typeof args.occasion === "string" ? args.occasion : undefined,
        style: typeof args.style === "string" ? args.style : undefined,
        budget: typeof args.budget === "number" ? args.budget : undefined,
        size: typeof args.size === "string" ? args.size : undefined,
        color: typeof args.color === "string" ? args.color : undefined,
      });
    }
    throw new Error("AI_TOOL_INVALID");
  }
  private string(value: unknown, field: string) {
    if (typeof value !== "string" || !value)
      throw new Error(`AI_TOOL_INVALID_${field}`);
    return value;
  }
  private filters(args: Record<string, unknown>): CatalogSearchFilters {
    return {
      query: typeof args.query === "string" ? args.query : undefined,
      category: typeof args.category === "string" ? args.category : undefined,
      color: typeof args.color === "string" ? args.color : undefined,
      size: typeof args.size === "string" ? args.size : undefined,
      minPrice:
        typeof args.minPrice === "number" && args.minPrice >= 0
          ? args.minPrice
          : undefined,
      maxPrice:
        typeof args.maxPrice === "number" && args.maxPrice >= 0
          ? args.maxPrice
          : undefined,
      storeId: typeof args.storeId === "string" ? args.storeId : undefined,
      tags:
        Array.isArray(args.tags) &&
        args.tags.every((tag) => typeof tag === "string")
          ? (args.tags as string[])
          : undefined,
    };
  }
  async searchProducts(filters: CatalogSearchFilters) {
    return this.catalog.list(filters);
  }
  async getProduct(productId: string, storeId?: string) {
    const product = await this.catalog.getById(productId, storeId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    return product;
  }
  async checkStock(variantId: string): Promise<StockResult> {
    const products = await this.catalog.list();
    const variant = products
      .flatMap((product) => product.variants)
      .find((item) => item.id === variantId);
    if (!variant) throw new Error("VARIANT_NOT_FOUND");
    return {
      available: variant.stock > 0,
      status: variant.stock > 0 ? "in_stock" : "out_of_stock",
      size: variant.size.label,
      color: variant.color.name,
    };
  }
  async findSimilar(
    productId: string,
    filters: Pick<CatalogSearchFilters, "maxPrice" | "color" | "size"> = {},
  ) {
    await this.getProduct(productId);
    const similar = await this.catalog.findSimilar(productId);
    return similar.filter((product) => this.matches(product, filters));
  }
  async recommendOutfit(input: {
    productIds: string[];
    occasion?: string;
    style?: string;
    budget?: number;
    size?: string;
    color?: string;
  }): Promise<{ outfit: AiOutfit; products: CatalogProduct[] }> {
    if (!input.productIds.length) throw new Error("OUTFIT_PRODUCTS_REQUIRED");
    const products = await Promise.all(
      input.productIds.map((id) => this.getProduct(id)),
    );
    if (
      input.size &&
      products.some(
        (product) =>
          !product.variants.some(
            (variant) => variant.size.code === input.size && variant.stock > 0,
          ),
      )
    )
      throw new Error("OUTFIT_SIZE_UNAVAILABLE");
    if (
      input.color &&
      products.some(
        (product) =>
          !product.colors.some((color) => color.name === input.color),
      )
    )
      throw new Error("OUTFIT_COLOR_UNAVAILABLE");
    const totalPrice = products.reduce(
      (total, product) => total + product.price.amount,
      0,
    );
    if (input.budget !== undefined && totalPrice > input.budget)
      throw new Error("OUTFIT_OVER_BUDGET");
    const roles: AiOutfit["products"][number]["role"][] = [
      "top",
      "bottom",
      "shoes",
      "outerwear",
      "accent",
    ];
    return {
      products,
      outfit: {
        products: products.map((product, index) => ({
          productId: product.id,
          role: roles[index] ?? "accent",
        })),
        totalPrice,
        currency: "UZS",
        occasion: input.occasion,
        style: input.style,
      },
    };
  }
  private matches(
    product: CatalogProduct,
    filters: Pick<CatalogSearchFilters, "maxPrice" | "color" | "size">,
  ) {
    return (
      (!filters.maxPrice || product.price.amount <= filters.maxPrice) &&
      (!filters.color ||
        product.colors.some((color) => color.name === filters.color)) &&
      (!filters.size ||
        product.variants.some(
          (variant) => variant.size.code === filters.size && variant.stock > 0,
        ))
    );
  }
}
