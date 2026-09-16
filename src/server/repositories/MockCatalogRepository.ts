import type { CatalogProduct } from "../../types/catalog";
import { filterCatalog, type CatalogRepository } from "../domain/catalog.ts";

const uzs = (amount: number) => ({ amount, currency: "UZS" as const });
const size = (code: string, sortOrder: number) => ({
  code,
  label: code,
  sortOrder,
});
const black = { id: "black", name: "чёрный", hex: "#1c1917" };
const beige = { id: "beige", name: "бежевый", hex: "#d5c6b5" };
const white = { id: "white", name: "молочный", hex: "#ebe7e0" };

export const mockCatalog: CatalogProduct[] = [
  {
    id: "midnight-dress",
    storeId: "atelier-north",
    name: "Платье Midnight",
    description: "Лаконичное чёрное платье миди для вечера и особых случаев.",
    category: "women",
    subcategory: "dresses",
    brand: "AI Fashion Atelier",
    price: uzs(890000),
    colors: [black],
    sizes: [size("S", 2), size("M", 3), size("L", 4)],
    images: [
      {
        id: "midnight-main",
        alt: "Чёрное платье Midnight",
        placeholderColor: "#27211f",
      },
    ],
    variants: ["S", "M", "L"].map((code, index) => ({
      id: `midnight-${code}`,
      sku: `AF-MD-${code}`,
      color: black,
      size: size(code, index + 2),
      price: uzs(890000),
      stock: index === 2 ? 2 : 5,
    })),
    stock: 12,
    availability: "in_stock",
    tags: ["осень", "вечер", "платье", "чёрный"],
  },
  {
    id: "urban-runner",
    storeId: "atelier-north",
    name: "Кроссовки Urban Runner",
    description:
      "Мужские кроссовки для городского ритма и комфортных прогулок.",
    category: "men",
    subcategory: "sneakers",
    brand: "North Form",
    price: uzs(720000),
    colors: [white],
    sizes: [size("M", 3), size("L", 4), size("XL", 5)],
    images: [
      {
        id: "runner-main",
        alt: "Мужские кроссовки Urban Runner",
        placeholderColor: "#e4e1db",
      },
    ],
    variants: ["M", "L", "XL"].map((code, index) => ({
      id: `runner-${code}`,
      sku: `NF-UR-${code}`,
      color: white,
      size: size(code, index + 3),
      price: uzs(720000),
      stock: 4,
    })),
    stock: 12,
    availability: "in_stock",
    tags: ["мужское", "кроссовки", "осень", "спорт"],
  },
  {
    id: "soft-sand-trench",
    storeId: "atelier-north",
    name: "Тренч Soft Sand",
    description:
      "Бежевый тренч свободного силуэта для многослойных осенних образов.",
    category: "women",
    subcategory: "outerwear",
    brand: "AI Fashion Atelier",
    price: uzs(980000),
    colors: [beige],
    sizes: [size("S", 2), size("M", 3)],
    images: [
      {
        id: "trench-main",
        alt: "Бежевый тренч Soft Sand",
        placeholderColor: "#d5c6b5",
      },
    ],
    variants: ["S", "M"].map((code, index) => ({
      id: `trench-${code}`,
      sku: `AF-SS-${code}`,
      color: beige,
      size: size(code, index + 2),
      price: uzs(980000),
      stock: index === 0 ? 1 : 3,
    })),
    stock: 4,
    availability: "low_stock",
    tags: ["осень", "тренч", "верхняя одежда", "бежевый"],
  },
  {
    id: "pearl-silk-top",
    storeId: "atelier-north",
    name: "Шёлковый топ Pearl",
    description: "Молочный топ для мягких базовых сочетаний.",
    category: "women",
    subcategory: "tops",
    brand: "AI Fashion Atelier",
    price: uzs(460000),
    colors: [white],
    sizes: [size("S", 2), size("M", 3), size("L", 4)],
    images: [
      {
        id: "top-main",
        alt: "Молочный шёлковый топ Pearl",
        placeholderColor: "#ebe7e0",
      },
    ],
    variants: ["S", "M", "L"].map((code, index) => ({
      id: `top-${code}`,
      sku: `AF-PS-${code}`,
      color: white,
      size: size(code, index + 2),
      price: uzs(460000),
      stock: 6,
    })),
    stock: 18,
    availability: "in_stock",
    tags: ["база", "топ", "офис"],
  },
];

export class MockCatalogRepository implements CatalogRepository {
  async list(filters = {}) {
    return filterCatalog(mockCatalog, filters);
  }
  async getById(id: string, storeId?: string) {
    return (
      mockCatalog.find(
        (product) =>
          product.id === id && (!storeId || product.storeId === storeId),
      ) ?? null
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
            (item) => item.size.code === sizeCode && item.stock > 0,
          )
        : product.stock > 0),
    );
  }
}
