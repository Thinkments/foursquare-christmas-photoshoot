import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const urls = [
    'https://foursquare-christmas-photoshoot.netlify.app/',
    'https://foursquare-christmas-photoshoot.netlify.app/services/staff-portraits',
    'https://foursquare-christmas-photoshoot.netlify.app/services/resident-family',
    'https://foursquare-christmas-photoshoot.netlify.app/services/santa-experience',
    'https://foursquare-christmas-photoshoot.netlify.app/services/department-teams',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-09-07T10:30:00-06:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url.endsWith('/') ? '1.0' : '0.8'}</priority>
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
