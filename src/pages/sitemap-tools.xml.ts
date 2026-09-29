import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const urls = [
    'https://christmasphotos.netlify.app/schedule',
    'https://christmasphotos.netlify.app/reschedule',
    'https://christmasphotos.netlify.app/coordinator',
    'https://christmasphotos.netlify.app/calculator',
    'https://christmasphotos.netlify.app/style-guide',
    'https://christmasphotos.netlify.app/prep-checklist',
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
