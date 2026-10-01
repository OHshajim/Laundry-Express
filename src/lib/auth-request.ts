import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";
import { UserDbService } from "@/lib/services/user-db-service";
import type { User } from "@/types";

export async function getVerifiedUser(
  req: NextRequest
): Promise<{ token: JWT; user: User } | null> {
  const token = await getToken({ req, secret: getAuthSecret() });
  if (!token?.id) return null;
  const user = await UserDbService.getActiveUserById(String(token.id));
  return user ? { token, user } : null;
}
