import { NextRequest, NextResponse } from "next/server";
import { imageCatalogSearchService } from "@/server/images/bootstrap";
import { catalogRepository } from "@/server/bootstrap";
import { apiError } from "@/server/services/api";
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File))
      return apiError("IMAGE_REQUIRED", "Выберите изображение.", 400);
    const consent = form.get("consent") === "true";
    const maxPriceValue = form.get("maxPrice");
    const result = await imageCatalogSearchService.search({
      image: {
        bytes: new Uint8Array(await file.arrayBuffer()),
        claimedMime: file.type,
        originalName: file.name,
      },
      consent,
      text: String(form.get("text") ?? "") || undefined,
      color: String(form.get("color") ?? "") || undefined,
      size: String(form.get("size") ?? "") || undefined,
      maxPrice: maxPriceValue ? Number(maxPriceValue) : undefined,
      storeId: String(form.get("storeId") ?? "") || undefined,
    });
    const ids = [
      ...new Set(result.matches.flatMap((match) => match.productIds)),
    ];
    const products = (
      await Promise.all(ids.map((id) => catalogRepository.getById(id)))
    ).filter((product) => product !== null);
    return NextResponse.json({
      products,
      analysis: result.analysis,
      notice:
        "Используется демонстрационный анализатор одежды; совпадения подтверждены каталогом.",
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "IMAGE_SEARCH_FAILED";
    return apiError(
      code,
      "Не удалось обработать изображение.",
      code === "IMAGE_CONSENT_REQUIRED" ? 400 : 422,
    );
  }
}
