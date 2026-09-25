import type { APIRoute } from 'astro';
import { FACILITY_LIST } from '../data/facilities';

export const GET: APIRoute = async () => {
  const urls = [
    ...FACILITY_LIST.map((f) => `https://foursquare-christmas-photoshoot.netlify.app/${f.code}`),
    'https://foursquare-christmas-photoshoot.netlify.app/cml-day2',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-09-24T12:00:00-06:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
