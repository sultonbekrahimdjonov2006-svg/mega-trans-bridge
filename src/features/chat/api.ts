import type { AiConversation, AiInput, AiResponse } from "@/types/ai";
export async function requestSellerResponse(
  input: AiInput,
  conversation: AiConversation,
): Promise<AiResponse> {
  const response = await fetch("/api/ai/seller", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ input, conversation }),
  });
  if (!response.ok) throw new Error("Не удалось получить ответ AI Продавца.");
  return response.json() as Promise<AiResponse>;
}
export async function requestConsultantHandoff(
  conversationId: string,
  selectedProductIds: string[],
) {
  const response = await fetch("/api/handoff", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      conversationId,
      selectedProductIds,
      requestedSizes: [],
      preferences: [],
      summary: "Пользователь запросил помощь консультанта в AI Продавце.",
      reason: "Пользователь выбрал действие «Позвать консультанта»",
    }),
  });
  if (!response.ok) throw new Error("Не удалось передать запрос консультанту.");
  return response.json() as Promise<{ message: string }>;
}
