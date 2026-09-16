import type { CatalogRepository } from "../domain/catalog.ts";
import type {
  CartService,
  FavoriteService,
  ReservationService,
} from "../services/commerce.ts";
import type { ConsultantHandoff } from "../handoff/MockConsultantHandoff.ts";
export type AiCommerceContext = { userId?: string; conversationId: string };
export class AiCommerceTools {
  private readonly catalog: CatalogRepository;
  private readonly favorites: FavoriteService;
  private readonly cart: CartService;
  private readonly reservations: ReservationService;
  private readonly handoff: ConsultantHandoff;
  constructor(
    catalog: CatalogRepository,
    favorites: FavoriteService,
    cart: CartService,
    reservations: ReservationService,
    handoff: ConsultantHandoff,
  ) {
    this.catalog = catalog;
    this.favorites = favorites;
    this.cart = cart;
    this.reservations = reservations;
    this.handoff = handoff;
  }
  async addFavorite(context: AiCommerceContext, productId: string) {
    const userId = this.requireUser(context);
    await this.requireProduct(productId);
    await this.favorites.add(userId, productId);
    return { status: "completed" as const, productId };
  }
  async removeFavorite(context: AiCommerceContext, productId: string) {
    const userId = this.requireUser(context);
    await this.favorites.remove(userId, productId);
    return { status: "completed" as const, productId };
  }
  async addToCart(
    context: AiCommerceContext,
    variantId: string,
    quantity: number,
  ) {
    const userId = this.requireUser(context);
    const located = await this.findVariant(variantId);
    return this.cart.add(userId, located.productId, located.size, quantity);
  }
  async reserve(
    context: AiCommerceContext,
    variantId: string,
    quantity: number,
  ) {
    this.requireUser(context);
    const located = await this.findVariant(variantId);
    return this.reservations.create(located.productId, located.size, quantity);
  }
  async callConsultant(
    context: AiCommerceContext,
    summary: string,
    productIds: string[],
  ) {
    await Promise.all(productIds.map((id) => this.requireProduct(id)));
    return this.handoff.request({
      conversationId: context.conversationId,
      userId: context.userId,
      selectedProductIds: productIds,
      requestedSizes: [],
      preferences: [],
      summary,
      reason: "Пользователь запросил консультанта через AI Продавца.",
    });
  }
  private requireUser(context: AiCommerceContext) {
    if (!context.userId) throw new Error("AUTH_REQUIRED");
    return context.userId;
  }
  private async requireProduct(productId: string) {
    const product = await this.catalog.getById(productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    return product;
  }
  private async findVariant(variantId: string) {
    for (const product of await this.catalog.list()) {
      const variant = product.variants.find((item) => item.id === variantId);
      if (variant) return { productId: product.id, size: variant.size.code };
    }
    throw new Error("VARIANT_NOT_FOUND");
  }
}
