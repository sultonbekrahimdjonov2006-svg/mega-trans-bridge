import { NextRequest, NextResponse } from "next/server";
import { consultantHandoff } from "@/server/bootstrap";
import type { AiHandoffRequest } from "@/types/ai";
export async function POST(request: NextRequest) {
  const payload: AiHandoffRequest = await request.json();
  if (!payload.conversationId || !payload.reason)
    return NextResponse.json(
      { error: "conversationId and reason are required." },
      { status: 400 },
    );
  return NextResponse.json(await consultantHandoff.request(payload));
}
