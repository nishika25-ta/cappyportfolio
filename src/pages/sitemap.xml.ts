import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const siteUrl = import.meta.env.SITE_URL;
  const urls=siteUrl ? ['/', '/about/'].map(p=>`<url><loc>${new URL(p,siteUrl).href}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
