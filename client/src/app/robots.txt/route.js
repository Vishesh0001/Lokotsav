export function GET() {
  const baseUrl = process.env.BASE_URL || 'https://lokotsav.vercel.app/';

  const content = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`.trim();

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
