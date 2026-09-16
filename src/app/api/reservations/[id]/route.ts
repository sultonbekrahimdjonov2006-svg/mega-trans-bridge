import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { reservationService } from "@/server/bootstrap";
import { authRequired } from "@/server/services/api";
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const canceled = await reservationService.cancel(
      (await params).id,
      user.id,
    );
    return canceled
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Резерв не найден." } },
          { status: 404 },
        );
  } catch {
    return authRequired();
  }
}
