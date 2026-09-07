import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://foursquare-christmas-photoshoot.netlify.app/sitemap-services.xml</loc>
    <lastmod>2026-09-07T10:30:00-06:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://foursquare-christmas-photoshoot.netlify.app/sitemap-locations.xml</loc>
    <lastmod>2026-09-07T10:30:00-06:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://foursquare-christmas-photoshoot.netlify.app/sitemap-tools.xml</loc>
    <lastmod>2026-09-07T10:30:00-06:00</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
