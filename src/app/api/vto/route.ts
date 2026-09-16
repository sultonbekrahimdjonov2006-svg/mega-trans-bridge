import { NextRequest, NextResponse } from "next/server";
import { imageStorage } from "@/server/images/bootstrap";
import { validateImage } from "@/server/images/ImageValidation";
import { virtualTryOnService } from "@/server/vto/bootstrap";
import { apiError } from "@/server/services/api";
import { requireUser } from "@/server/auth/session";
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("image"),
      productId = form.get("productId"),
      consent = form.get("consent") === "true";
    if (!(file instanceof File) || typeof productId !== "string")
      return apiError("VTO_INPUT_REQUIRED", "Нужны фото и товар.", 400);
    if (!consent)
      return apiError(
        "VTO_CONSENT_REQUIRED",
        "Нужно согласие на обработку фото.",
        400,
      );
    const image = {
      bytes: new Uint8Array(await file.arrayBuffer()),
      claimedMime: file.type,
    };
    const valid = validateImage(image);
    if (!valid.valid)
      return apiError(valid.code, "Изображение не прошло проверку.", 422);
    const asset = await imageStorage.put(
      image,
      "VIRTUAL_TRY_ON_INPUT",
      valid.mime,
      86400000,
    );
    const job = await virtualTryOnService.create({
      productId,
      userImageAssetId: asset.id,
      consent: true,
      userId: user.id,
    });
    const completed = await virtualTryOnService.refresh(job.id);
    return NextResponse.json(
      {
        job: completed,
        notice:
          "Демонстрационная mock-примерка. Реальное изображение AI не генерировалось.",
      },
      { status: 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "VTO_FAILED";
    return apiError(
      code,
      code === "AUTH_REQUIRED"
        ? "Требуется вход в аккаунт."
        : "Не удалось выполнить демонстрационную примерку.",
      code === "AUTH_REQUIRED" ? 401 : 422,
    );
  }
}
