import { createAiProvider } from "./ai/providerFactory.ts";
import { MockConsultantHandoff } from "./handoff/MockConsultantHandoff.ts";
import { MockCatalogRepository } from "./repositories/MockCatalogRepository.ts";
import { AiSellerOrchestrator } from "./services/AiSellerOrchestrator.ts";
import { CatalogSearchService } from "./services/CatalogSearchService.ts";
import {
  CartService,
  FavoriteService,
  ReservationService,
} from "./services/commerce.ts";

const catalogRepository = new MockCatalogRepository();
export const aiSellerOrchestrator = new AiSellerOrchestrator(
  createAiProvider(catalogRepository),
);
export const catalogSearchService = new CatalogSearchService(catalogRepository);
export const consultantHandoff = new MockConsultantHandoff();
export const cartService = new CartService(catalogRepository);
export const favoriteService = new FavoriteService();
export const reservationService = new ReservationService(catalogRepository);
export { catalogRepository };
