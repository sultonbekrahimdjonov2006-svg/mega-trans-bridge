import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { favoriteService } from "@/server/bootstrap";
import { authRequired, apiError } from "@/server/services/api";
import { productId } from "@/server/services/validation";
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const user = await requireUser();
    const id = productId((await params).productId);
    if (!id.success) return apiError("VALIDATION_ERROR", id.error, 400);
    await favoriteService.remove(user.id, id.data);
    return new NextResponse(null, { status: 204 });
  } catch {
    return authRequired();
  }
}
