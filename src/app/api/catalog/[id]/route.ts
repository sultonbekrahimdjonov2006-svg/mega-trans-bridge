import { NextRequest, NextResponse } from "next/server";
import { catalogRepository } from "@/server/bootstrap";
import { productId } from "@/server/services/validation";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsedId = productId(id);
  if (!parsedId.success)
    return NextResponse.json({ error: parsedId.error }, { status: 400 });
  const product = await catalogRepository.getById(
    parsedId.data,
    request.nextUrl.searchParams.get("storeId") ?? undefined,
  );
  return product
    ? NextResponse.json({ product })
    : NextResponse.json({ error: "Product not found" }, { status: 404 });
}
