import { NextResponse } from "next/server";
export const apiError = (code: string, message: string, status: number) =>
  NextResponse.json({ error: { code, message } }, { status });
export const authRequired = () =>
  apiError("AUTH_REQUIRED", "Требуется вход в аккаунт.", 401);
