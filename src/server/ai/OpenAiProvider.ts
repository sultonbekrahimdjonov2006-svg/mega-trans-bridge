import type { AiProvider } from "./contracts.ts";
import type { CatalogRepository } from "../domain/catalog.ts";
import type {
  AiConversation,
  AiInput,
  AiResponse,
  AiOutfit,
} from "../../types/ai";
import type { CatalogSearchFilters } from "../../types/catalog";
import { AiToolService } from "./AiToolService.ts";
import { catalogToolNames, openAiCatalogTools } from "./tools.ts";
const systemPrompt =
  "Ты AI Fashion Seller. Помогай находить и покупать одежду: уточняй только необходимое, сравнивай подтверждённые факты, уважай размер и бюджет, предлагай альтернативы и собирай образы через инструменты. Никогда не придумывай товары, цены, скидки, наличие, размеры, магазин, доставку или резерв. Не критикуй внешность, не делай чувствительных выводов и не дави на покупку. Общайся тепло, кратко и естественно на русском. " +
  "Ты AI Fashion Seller: тёплый, краткий русскоязычный консультант по одежде. Не оценивай тело, внешность или чувствительные характеристики, не дави на покупку. Коммерческие факты называй только из результата инструментов. Для поиска каталога используй search_products.";

type ResponsePayload = {
  id?: string;
  output?: Array<{
    type?: string;
    name?: string;
    call_id?: string;
    arguments?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export class OpenAiProvider implements AiProvider {
  constructor(
    private readonly catalog: CatalogRepository,
    private readonly apiKey: string,
    private readonly model: string,
    private readonly timeoutMs: number,
  ) {
    this.toolService = new AiToolService(catalog);
  }
  private readonly toolService: AiToolService;
  async respond(
    input: AiInput,
    conversation: AiConversation,
    fallbackFilters: CatalogSearchFilters,
  ): Promise<AiResponse> {
    if (input.type !== "text") throw new Error("AI_INPUT_UNSUPPORTED");
    const history = conversation.messages.slice(-12).map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));
    const first = await this.request({
      model: this.model,
      instructions: systemPrompt,
      input: [...history, { role: "user", content: input.text }],
      tools: openAiCatalogTools,
      tool_choice: "auto",
    });
    const call = first.output?.find(
      (item) =>
        item.type === "function_call" &&
        Boolean(item.name && catalogToolNames.has(item.name)),
    );
    let products = await this.catalog.list(fallbackFilters);
    let outfit: AiOutfit | undefined;
    const toolCalls = [];
    let final = first;
    if (call?.name) {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(call.arguments ?? "{}");
      } catch {
        throw new Error("AI_TOOL_INVALID");
      }
      const result = await this.toolService.execute(call.name, args);
      products = result.products;
      outfit = "outfit" in result ? result.outfit : undefined;
      toolCalls.push({
        id: call.call_id ?? crypto.randomUUID(),
        name: "catalog.search" as const,
        arguments: this.safeToolArguments(args),
        status: "completed" as const,
      });
      if (first.id)
        final = await this.request({
          model: this.model,
          previous_response_id: first.id,
          input: [
            {
              type: "function_call_output",
              call_id: call.call_id,
              output: JSON.stringify(result),
            },
          ],
        });
    }
    const content =
      final.output
        ?.flatMap((item) => item.content ?? [])
        .map((item) => item.text)
        .filter(Boolean)
        .join("\n") ||
      (products.length
        ? "Подобрала подтверждённые варианты из каталога."
        : "Пока не нашла точного совпадения. Могу подобрать альтернативу по цвету, размеру или бюджету.");
    return {
      message: {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
      recommendations: products.map((product) => ({
        product,
        reason: "Подтверждено каталогом.",
      })),
      toolCalls,
      outfit,
      followUp: products.length
        ? "Показать похожие варианты?"
        : "Уточним размер, цвет или бюджет?",
      actions: products.slice(0, 3).map((product) => ({
        type: "VIEW_PRODUCT",
        productId: product.id,
        label: "Подробнее",
      })),
    };
  }
  async analyzeImage() {
    return {
      status: "not_connected" as const,
      message: "Анализ фото пока не подключён.",
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
  private safeToolArguments(args: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(args).filter(
        (entry): entry is [string, string | number | boolean | string[]] =>
          typeof entry[1] === "string" ||
          typeof entry[1] === "number" ||
          typeof entry[1] === "boolean" ||
          (Array.isArray(entry[1]) &&
            entry[1].every((value) => typeof value === "string")),
      ),
    );
  }
  private async request(body: unknown): Promise<ResponsePayload> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(
          response.status === 429 ? "AI_RATE_LIMIT" : "AI_PROVIDER_UNAVAILABLE",
        );
      return (await response.json()) as ResponsePayload;
    } finally {
      clearTimeout(timer);
    }
  }
}
