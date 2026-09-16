import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { cartService } from "@/server/bootstrap";
import { authRequired, apiError } from "@/server/services/api";
import { productId } from "@/server/services/validation";
export async function GET() {
  try {
    return NextResponse.json(await cartService.get((await requireUser()).id));
  } catch {
    return authRequired();
  }
}
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body: { productId?: string; size?: string; quantity?: number } =
      await request.json();
    const id = productId(body.productId ?? null);
    if (
      !id.success ||
      !body.size ||
      typeof body.quantity !== "number" ||
      !Number.isInteger(body.quantity)
    )
      return apiError("VALIDATION_ERROR", "Некорректные данные корзины.", 400);
    return NextResponse.json(
      await cartService.add(user.id, id.data, body.size, body.quantity),
      { status: 201 },
    );
  } catch (error) {
    return error instanceof Error &&
      ["INVALID_QUANTITY", "INSUFFICIENT_STOCK"].includes(error.message)
      ? apiError(error.message, "Товар недоступен в выбранном количестве.", 409)
      : authRequired();
  }
}
