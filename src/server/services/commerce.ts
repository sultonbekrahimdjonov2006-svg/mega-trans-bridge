import type { CatalogRepository } from "../domain/catalog.ts";
export type CartItem = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};
export class CartService {
  private readonly carts = new Map<string, CartItem[]>();
  private readonly catalog: CatalogRepository;
  constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }
  async add(userId: string, productId: string, size: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1)
      throw new Error("INVALID_QUANTITY");
    const product = await this.catalog.getById(productId);
    const variant = product?.variants.find((item) => item.size.code === size);
    if (!variant || variant.stock < quantity)
      throw new Error("INSUFFICIENT_STOCK");
    const items = this.carts.get(userId) ?? [];
    const existing = items.find((item) => item.variantId === variant.id);
    if (existing) existing.quantity += quantity;
    else
      items.push({
        variantId: variant.id,
        quantity,
        unitPrice: variant.price.amount,
      });
    this.carts.set(userId, items);
    return this.get(userId);
  }
  async get(userId: string) {
    const items = this.carts.get(userId) ?? [];
    return {
      items,
      subtotal: items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    };
  }
  async remove(userId: string, variantId: string) {
    const items = this.carts.get(userId) ?? [];
    this.carts.set(
      userId,
      items.filter((item) => item.variantId !== variantId),
    );
    return this.get(userId);
  }
  async clear(userId: string) {
    this.carts.set(userId, []);
    return this.get(userId);
  }
  async setQuantity(userId: string, variantId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1)
      throw new Error("INVALID_QUANTITY");
    const items = this.carts.get(userId) ?? [];
    const item = items.find((candidate) => candidate.variantId === variantId);
    if (!item) throw new Error("NOT_FOUND");
    item.quantity = quantity;
    return this.get(userId);
  }
}
export class FavoriteService {
  private readonly favorites = new Map<string, Set<string>>();
  async add(userId: string, productId: string) {
    const values = this.favorites.get(userId) ?? new Set<string>();
    values.add(productId);
    this.favorites.set(userId, values);
  }
  async remove(userId: string, productId: string) {
    this.favorites.get(userId)?.delete(productId);
  }
  async list(userId: string) {
    return [...(this.favorites.get(userId) ?? [])];
  }
  async has(userId: string, productId: string) {
    return (this.favorites.get(userId) ?? new Set()).has(productId);
  }
}
export class ReservationService {
  private readonly reservations = new Map<
    string,
    { expiresAt: Date; quantity: number; userId?: string }
  >();
  private readonly catalog: CatalogRepository;
  constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }
  async create(
    productId: string,
    size: string,
    quantity: number,
    userId?: string,
  ) {
    if (!Number.isInteger(quantity) || quantity < 1)
      throw new Error("INVALID_QUANTITY");
    if (!(await this.catalog.hasStock(productId, size)))
      throw new Error("INSUFFICIENT_STOCK");
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.reservations.set(id, { expiresAt, quantity, userId });
    return { id, expiresAt, status: "active" as const };
  }
  async list(userId?: string) {
    return [...this.reservations.entries()]
      .filter(([, value]) => !userId || value.userId === userId)
      .map(([id, value]) => ({
        id,
        ...value,
        status: this.isExpired(id) ? "expired" : "active",
      }));
  }
  async cancel(id: string, userId?: string) {
    const reservation = this.reservations.get(id);
    if (!reservation || (userId && reservation.userId !== userId)) return false;
    return this.reservations.delete(id);
  }
  isExpired(id: string, now = new Date()) {
    const reservation = this.reservations.get(id);
    return !reservation || reservation.expiresAt <= now;
  }
}
