/**
 * Dominio base público del sitio, para metadata/SEO/sitemap/robots.
 *
 * Jerarquía (primero que esté seteado):
 *   1. AUTH_URL        — dominio estable de producción (recomendado setearlo
 *                        en Vercel: https://tu-futuro-dual.vercel.app)
 *   2. VERCEL_URL      — inyectado automáticamente por Vercel en cada deploy
 *                        (formato "tu-futuro-dual-xxx.vercel.app", sin protocolo)
 *   3. NEXTAUTH_URL    — dev local (http://localhost:3000)
 *   4. fallback         — http://localhost:3000
 *
 * Sin AUTH_URL seteada, el SEO usa VERCEL_URL (cambia entre deploys) lo cual
 * es aceptable; para URLs canónicas/OG estables se recomienda setear AUTH_URL.
 */
function resolveSiteUrl(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();