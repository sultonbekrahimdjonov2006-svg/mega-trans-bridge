import { NextResponse } from "next/server";
import { getCurrentSession } from "@/server/auth/session";
export async function GET() {
  return NextResponse.json({ session: await getCurrentSession() });
}
