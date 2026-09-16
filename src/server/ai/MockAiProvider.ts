import type { AiProvider } from "./contracts.ts";
import type { CatalogRepository } from "../domain/catalog.ts";
import type { AiConversation, AiInput, AiResponse } from "../../types/ai";
import type { CatalogSearchFilters } from "../../types/catalog";

export class MockAiProvider implements AiProvider {
  private readonly catalog: CatalogRepository;

  constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }
  async respond(
    _input: AiInput,
    conversation: AiConversation,
    filters: CatalogSearchFilters,
  ): Promise<AiResponse> {
    const products = await this.catalog.list(filters);
    const content = products.length
      ? "Нашла подходящие варианты из текущего mock-каталога. Можно уточнить цвет, размер или повод — я сузлю подборку."
      : "Пока не нашла точного совпадения в mock-каталоге. Попробуйте изменить бюджет, размер или категорию — с радостью подберу альтернативу.";
    return {
      message: {
        id: `assistant-${conversation.messages.length + 1}`,
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
      recommendations: products.map((product) => ({
        product,
        reason: "Соответствует запросу и доступно в mock-каталоге.",
      })),
      toolCalls: [
        {
          id: "catalog-search",
          name: "catalog.search",
          arguments: filters,
          status: "completed",
        },
      ],
      actions: products.slice(0, 3).flatMap((product) => [
        {
          type: "VIEW_PRODUCT" as const,
          productId: product.id,
          label: "Подробнее",
        },
        { type: "TRY_ON" as const, productId: product.id, label: "Примерить" },
      ]),
      followUp: products.length
        ? "Показать похожие или более доступные варианты?"
        : "Уточним цвет, размер или бюджет?",
      notice: "mock_response",
    };
  }
  async analyzeImage() {
    return {
      status: "not_connected" as const,
      message:
        "Поиск по фотографии будет подключён позже; изображение не анализируется.",
    };
  }
  async createOutfit() {
    return {
      status: "not_connected" as const,
      message: "Создание образа пока не подключено.",
    };
  }
  async requestHandoff() {
    return {
      status: "accepted" as const,
      reference: `handoff-${crypto.randomUUID()}`,
    };
  }
}
