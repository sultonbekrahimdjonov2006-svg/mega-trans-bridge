export type Currency = "UZS";
export type ProductAvailability = "in_stock" | "low_stock" | "out_of_stock";

export type Store = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  location: { city: string; address: string };
  contact: { phone?: string; email?: string };
  isActive: boolean;
};

export type ProductColor = { id: string; name: string; hex: string };
export type ProductSize = { code: string; label: string; sortOrder: number };
export type ProductImage = {
  id: string;
  alt: string;
  placeholderColor: string;
  url?: string;
};
export type Money = { amount: number; currency: Currency };

export type ProductVariant = {
  id: string;
  sku: string;
  color: ProductColor;
  size: ProductSize;
  price: Money;
  stock: number;
};

export type CatalogProduct = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: Money;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  variants: ProductVariant[];
  stock: number;
  availability: ProductAvailability;
  tags: string[];
};

export type CatalogSearchFilters = {
  query?: string;
  storeId?: string;
  category?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
};
