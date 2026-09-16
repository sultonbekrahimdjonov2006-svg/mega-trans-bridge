import type { CatalogProduct } from "@/types/catalog";

export type AiMessageRole = "user" | "assistant" | "system";
export type AiInput =
  | { type: "text"; text: string }
  | { type: "voice"; transcription: string }
  | { type: "image"; imageReference: string; caption?: string };
export type AiMessage = {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
  input?: AiInput;
};
export type AiConversation = {
  id: string;
  storeId?: string;
  userId?: string;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
};
export type AiToolArgument = string | number | boolean | string[] | undefined;
export type AiToolCall = {
  id: string;
  name: "catalog.search" | "try_on.request" | "consultant.handoff";
  arguments: Record<string, AiToolArgument>;
  status: "completed" | "pending";
};
export type AiProductRecommendation = {
  product: CatalogProduct;
  reason: string;
};
export type AiHandoffRequest = {
  conversationId: string;
  userId?: string;
  selectedProductIds: string[];
  requestedSizes: string[];
  preferences: string[];
  summary: string;
  reason: string;
};
export type AiSellerAction = {
  type:
    | "VIEW_PRODUCT"
    | "TRY_ON"
    | "ADD_TO_FAVORITES"
    | "ADD_TO_CART"
    | "RESERVE"
    | "CALL_CONSULTANT"
    | "SEARCH_MORE"
    | "VIEW_STORE"
    | "AUTH_REQUIRED";
  productId?: string;
  label: string;
};
export type AiOutfit = {
  products: Array<{
    productId: string;
    role: "top" | "bottom" | "shoes" | "outerwear" | "accent";
  }>;
  totalPrice: number;
  currency: "UZS";
  occasion?: string;
  style?: string;
};
export type AiResponse = {
  message: AiMessage;
  recommendations: AiProductRecommendation[];
  toolCalls: AiToolCall[];
  notice?: "mock_response";
  actions?: AiSellerAction[];
  outfit?: AiOutfit;
  followUp?: string;
};
