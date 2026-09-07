import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const urls = [
    'https://foursquare-christmas-photoshoot.netlify.app/schedule',
    'https://foursquare-christmas-photoshoot.netlify.app/calculator',
    'https://foursquare-christmas-photoshoot.netlify.app/style-guide',
    'https://foursquare-christmas-photoshoot.netlify.app/prep-checklist',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-09-07T10:30:00-06:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
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
