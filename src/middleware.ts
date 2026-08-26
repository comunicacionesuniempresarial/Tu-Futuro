import { auth } from "@/lib/auth";

/**
 * Edge middleware: protege rutas /admin/** con autenticación NextAuth.
 *
 * Patrón oficial NextAuth v5:
 * https://authjs.dev/getting-started/session-management/protecting
 *
 * - /admin/login es EXCLUIDO (necesita ser accesible sin sesión)
 * - /api/admin/** requiere sesión válida
 * - /admin/** (excepto login) requiere sesión válida
 * - Todo lo demás pasa sin auth
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Permitir login sin autenticación
  if (pathname.startsWith("/admin/login")) {
    return;
  }

  // Proteger rutas admin y APIs admin
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminRoute && !req.auth) {
    // Para API routes, retornar 401 en vez de redirect
    if (pathname.startsWith("/api/")) {
      return Response.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Para páginas, redirigir a login
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  // Matcher explícito: solo rutas admin (no assets, no _next, no APIs públicas)
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
