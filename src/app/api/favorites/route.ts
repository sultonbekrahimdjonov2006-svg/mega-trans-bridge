import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { favoriteService } from "@/server/bootstrap";
import { authRequired, apiError } from "@/server/services/api";
import { productId } from "@/server/services/validation";
export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({
      productIds: await favoriteService.list(user.id),
    });
  } catch {
    return authRequired();
  }
}
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body: { productId?: string } = await request.json();
    const id = productId(body.productId ?? null);
    if (!id.success) return apiError("VALIDATION_ERROR", id.error, 400);
    await favoriteService.add(user.id, id.data);
    return NextResponse.json({ productId: id.data }, { status: 201 });
  } catch {
    return authRequired();
  }
}
