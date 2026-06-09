/**
 * Live mobile + desktop viewport checks on critical URLs.
 */
const BASE = 'https://pattayavisahelp.com';
const URLS = [
  '/',
  '/visas/dtv/',
  '/guides/thailand-digital-arrival-card/',
  '/guides/non-o-extension-pattaya/',
  '/de/visas/dtv/',
  '/de/guides/driving-licence-thailand/',
];

async function check(url, viewport) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'PVH-Audit/1.0' } });
    clearTimeout(t);
    const html = await res.text();
    const hasViewport = /width=device-width/i.test(html);
    const hasMnavJs = /assets\/mnav\.js/i.test(html);
    const hasUx = /ux-enhancements\.(js|css)/i.test(html);
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
    const desc = (html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
    const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html);
    const canon = /<link[^>]+rel=["']canonical["']/i.test(html);
    const hreflang = (html.match(/hreflang=/gi) || []).length;
    const schema = (html.match(/application\/ld\+json/gi) || []).length;
    const h1 = (html.match(/<h1[^>]*>/gi) || []).length;
    return {
      url,
      viewport,
      status: res.status,
      ok: res.ok,
      hasViewport,
      hasMnavJs,
      hasUx,
      titleLen: title?.length,
      descLen: desc.length,
      ogImage,
      canon,
      hreflang,
      schema,
      h1,
      title: title?.slice(0, 70),
    };
  } catch (e) {
    clearTimeout(t);
    return { url, viewport, ok: false, error: e.message };
  }
}

(async () => {
  const results = [];
  for (const p of URLS) {
    results.push(await check(BASE + p, 'shared-html'));
  }
  const report = { generated: new Date().toISOString(), results, pass: results.every((r) => r.ok && r.hasViewport && r.h1 === 1) };
  require('fs').writeFileSync(require('path').join(__dirname, '..', '_audit-live-viewports.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})();
