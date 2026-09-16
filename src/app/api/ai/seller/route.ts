import { NextRequest, NextResponse } from "next/server";
import { aiSellerOrchestrator } from "@/server/bootstrap";
import type { AiConversation, AiInput } from "@/types/ai";
import { defaultAiUsageGuard } from "@/server/ai/AiUsageGuard";
export async function POST(request: NextRequest) {
  const body: { input?: AiInput; conversation?: AiConversation } =
    await request.json();
  if (
    !body.input ||
    !body.conversation ||
    body.input.type !== "text" ||
    !body.input.text.trim() ||
    body.input.text.length > 1200 ||
    body.conversation.messages.length > 40
  )
    return NextResponse.json(
      { error: "A text input and conversation are required." },
      { status: 400 },
    );
  const requestId = crypto.randomUUID();
  try {
    defaultAiUsageGuard.assertRequest(
      body.conversation.userId ?? body.conversation.id,
      body.input.text,
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "AI_RATE_LIMIT";
    return NextResponse.json(
      {
        error: {
          code,
          message: "Слишком много запросов. Попробуйте немного позже.",
        },
      },
      { status: 429 },
    );
  }
  const startedAt = Date.now();
  try {
    const response = await aiSellerOrchestrator.respond(
      body.input,
      body.conversation,
    );
    console.info("ai_seller.completed", {
      requestId,
      latencyMs: Date.now() - startedAt,
      toolCalls: response.toolCalls.map((call) => call.name),
    });
    return NextResponse.json(response);
  } catch (error) {
    const code = error instanceof Error ? error.message : "AI_UNAVAILABLE";
    console.warn("ai_seller.failed", {
      requestId,
      code,
      latencyMs: Date.now() - startedAt,
    });
    const message =
      code === "AI_RATE_LIMIT"
        ? "AI Продавец временно перегружен. Попробуйте чуть позже."
        : "AI Продавец временно недоступен. Каталог остаётся доступен.";
    return NextResponse.json(
      { error: { code, message } },
      { status: code === "AI_RATE_LIMIT" ? 429 : 503 },
    );
  }
}
