import type {
  AiConversation,
  AiHandoffRequest,
  AiInput,
  AiResponse,
} from "../../types/ai";
import type { CatalogSearchFilters } from "../../types/catalog";

export interface AiProvider {
  respond(
    input: AiInput,
    conversation: AiConversation,
    filters: CatalogSearchFilters,
  ): Promise<AiResponse>;
  analyzeImage(
    imageReference: string,
  ): Promise<{ status: "not_connected"; message: string }>;
  createOutfit(
    productIds: string[],
  ): Promise<{ status: "not_connected"; message: string }>;
  requestHandoff(
    request: AiHandoffRequest,
  ): Promise<{ status: "accepted"; reference: string }>;
}
