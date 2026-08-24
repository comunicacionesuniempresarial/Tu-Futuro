import crypto from "crypto";
import { auth } from "@/lib/auth";
import type { AdminRole } from "@/lib/supabase";

export async function getAdminRole(): Promise<AdminRole | null> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "super_admin" || role === "advisor" ? role : null;
}

export function hashAdminPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return { password_salt: salt, password_hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}
