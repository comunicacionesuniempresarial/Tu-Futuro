import crypto from "crypto";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getAdminUserByEmail } from "@/lib/supabase";

// Admin credentials from environment variables
// Multiple admin users supported: ADMIN_EMAILS and ADMIN_PASSWORDS (comma-separated)
const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);
const adminPasswords = (process.env.ADMIN_PASSWORDS || "").split(",").filter(Boolean);

// Brute-force protection: max 10 failed attempts per identifier per 15 minutes
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map<string, { count: number; firstAt: number }>();

function cleanExpired(): void {
  const now = Date.now();
  for (const [key, entry] of failedAttempts) {
    if (now - entry.firstAt > WINDOW_MS) {
      failedAttempts.delete(key);
    }
  }
}

function isThrottled(identifier: string): boolean {
  cleanExpired();
  const entry = failedAttempts.get(identifier);
  return entry ? entry.count >= MAX_ATTEMPTS : false;
}

function recordFailure(identifier: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(identifier);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    failedAttempts.set(identifier, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

/**
 * Constant-time password comparison: both values are hashed with SHA-256
 * to equalize lengths, then compared with timingSafeEqual.
 */
function secureEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a, "utf8").digest();
  const hashB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function verifyStoredPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return secureEqual(derived, hash);
}

class ThrottledSigninError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "throttled";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = credentials?.password as string;

        if (!email || !password) return null;

        if (isThrottled(email)) {
          throw new ThrottledSigninError();
        }

        // Prefer the database-backed RBAC users. If the migration has not been
        // applied yet, keep the legacy env super-admin as a safe fallback.
        try {
          const storedUser = await getAdminUserByEmail(email);
          if (storedUser?.activo && verifyStoredPassword(password, storedUser.password_hash, storedUser.password_salt)) {
            failedAttempts.delete(email);
            return {
              id: storedUser.id,
              email: storedUser.email,
              name: storedUser.nombre,
              role: storedUser.role,
            };
          }
        } catch {
          // The table may not exist during migration; use the legacy account.
        }

        // Check against env-configured super-admin users
        const index = adminEmails.indexOf(email);
        if (index !== -1 && secureEqual(password, adminPasswords[index] ?? "")) {
          failedAttempts.delete(email);
          return {
            id: email,
            email,
            name: "Admin",
            role: "super_admin",
          };
        }

        recordFailure(email);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "super_admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
