import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { reservationService } from "@/server/bootstrap";
import { authRequired, apiError } from "@/server/services/api";
import { productId } from "@/server/services/validation";
export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({
      reservations: await reservationService.list(user.id),
    });
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
      return apiError("VALIDATION_ERROR", "Некорректные данные резерва.", 400);
    return NextResponse.json(
      await reservationService.create(
        id.data,
        body.size,
        body.quantity,
        user.id,
      ),
      { status: 201 },
    );
  } catch (error) {
    return error instanceof Error
      ? apiError(error.message, "Резерв недоступен.", 409)
      : authRequired();
  }
}
