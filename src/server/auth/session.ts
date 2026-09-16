import { headers } from "next/headers";
import type { AuthSession } from "@/types/auth";
export async function getCurrentSession(): Promise<AuthSession | null> {
  const userId =
    (await headers()).get("x-ai-fashion-dev-user") ?? process.env.DEV_USER_ID;
  return userId
    ? {
        id: `dev-${userId}`,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        user: {
          id: userId,
          sizes: [],
          preferences: [],
          favoriteProductIds: [],
          addressIds: [],
          orderIds: [],
          reservationIds: [],
        },
      }
    : null;
}
export async function requireUser() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  return session.user;
}
