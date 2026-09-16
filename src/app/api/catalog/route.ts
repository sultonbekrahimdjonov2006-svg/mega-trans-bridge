import { NextRequest, NextResponse } from "next/server";
import { catalogRepository } from "@/server/bootstrap";
import { catalogQuery } from "@/server/services/validation";
export async function GET(request: NextRequest) {
  const parsed = catalogQuery(request.nextUrl.searchParams);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  const products = await catalogRepository.list(parsed.data);
  return NextResponse.json({ products });
}
