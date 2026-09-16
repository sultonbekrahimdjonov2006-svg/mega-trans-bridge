import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { cartService } from "@/server/bootstrap";
import { authRequired, apiError } from "@/server/services/api";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const user = await requireUser();
    const body: { quantity?: number } = await request.json();
    if (!Number.isInteger(body.quantity) || !body.quantity || body.quantity < 1)
      return apiError("VALIDATION_ERROR", "Некорректное количество.", 400);
    return NextResponse.json(
      await cartService.setQuantity(
        user.id,
        (await params).itemId,
        body.quantity,
      ),
    );
  } catch (error) {
    return error instanceof Error
      ? apiError("NOT_FOUND", "Товар в корзине не найден.", 404)
      : authRequired();
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const user = await requireUser();
    return NextResponse.json(
      await cartService.remove(user.id, (await params).itemId),
    );
  } catch {
    return authRequired();
  }
}
