import type { APIRoute } from 'astro';
import { escapeXml, sanitizeSiteUrl } from '../scripts/security.mjs';
export const GET: APIRoute = () => {
  const siteUrl = sanitizeSiteUrl(import.meta.env.SITE_URL);
  const urls = siteUrl
    ? ['/', '/about/']
        .map(p => `<url><loc>${escapeXml(new URL(p, siteUrl).href)}</loc></url>`)
        .join('')
    : '';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  );
};
