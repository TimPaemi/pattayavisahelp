const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const PILOT = new Set([
  '/de/',
  '/ru/',
  '/de/visas/',
  '/ru/visas/',
  '/de/compare/',
  '/ru/compare/',
  '/de/professions/',
  '/ru/professions/',
  '/de/guides/',
  '/ru/guides/',
  '/de/tools/',
  '/ru/tools/',
  '/de/glossary/',
  '/ru/glossary/',
  '/de/visas/dtv/',
  '/ru/visas/dtv/',
  '/de/visas/ltr/',
  '/ru/visas/ltr/',
  '/de/visas/retirement-non-o/',
  '/ru/visas/retirement-non-o/',
  '/de/visas/privilege-elite/',
  '/ru/visas/privilege-elite/',
  '/de/visas/marriage-non-o/',
  '/ru/visas/marriage-non-o/',
  '/de/visas/business-non-b/',
  '/ru/visas/business-non-b/',
  '/de/visas/smart/',
  '/ru/visas/smart/',
  '/de/visas/education-ed/',
  '/ru/visas/education-ed/',
  '/de/visas/tourist-tr-evisa/',
  '/ru/visas/tourist-tr-evisa/',
  '/de/visas/retirement-o-a/',
  '/ru/visas/retirement-o-a/',
  '/de/visas/retirement-o-x/',
  '/ru/visas/retirement-o-x/',
  '/de/visas/media-non-m/',
  '/ru/visas/media-non-m/',
  '/de/compare/dtv-vs-ltr/',
  '/ru/compare/dtv-vs-ltr/',
  '/de/compare/ed-vs-dtv/',
  '/ru/compare/ed-vs-dtv/',
  '/de/compare/privilege-vs-ltr/',
  '/ru/compare/privilege-vs-ltr/',
  '/de/compare/non-o-vs-o-a/',
  '/ru/compare/non-o-vs-o-a/',
  '/de/compare/o-a-vs-o-x/',
  '/ru/compare/o-a-vs-o-x/',
  '/de/compare/dtv-vs-smart/',
  '/ru/compare/dtv-vs-smart/',
  '/de/compare/smart-vs-ltr/',
  '/ru/compare/smart-vs-ltr/',
  '/de/compare/marriage-vs-retirement/',
  '/ru/compare/marriage-vs-retirement/',
  '/de/compare/dtv-vs-elite/',
  '/ru/compare/dtv-vs-elite/',
  '/de/compare/pattaya-vs-bangkok/',
  '/ru/compare/pattaya-vs-bangkok/',
  '/de/compare/pattaya-vs-chiang-mai/',
  '/ru/compare/pattaya-vs-chiang-mai/',
  '/de/compare/pattaya-vs-phuket/',
  '/ru/compare/pattaya-vs-phuket/',
  '/de/compare/pattaya-vs-hua-hin/',
  '/ru/compare/pattaya-vs-hua-hin/',
  '/de/compare/pattaya-vs-hua-hin-deep/',
  '/ru/compare/pattaya-vs-hua-hin-deep/',
  '/de/compare/visa-comparison-matrix/',
  '/ru/compare/visa-comparison-matrix/',
  '/de/professions/content-creator/',
  '/ru/professions/content-creator/',
  '/de/professions/saas-founder/',
  '/ru/professions/saas-founder/',
  '/de/professions/online-business-owner/',
  '/ru/professions/online-business-owner/',
  '/de/professions/affiliate-marketer/',
  '/ru/professions/affiliate-marketer/',
  '/de/professions/crypto-trader/',
  '/ru/professions/crypto-trader/',
  '/de/professions/ai-engineer/',
  '/ru/professions/ai-engineer/',
  '/de/professions/english-teacher/',
  '/ru/professions/english-teacher/',
  '/de/professions/fitness-trainer/',
  '/ru/professions/fitness-trainer/',
  '/de/professions/diving-instructor/',
  '/ru/professions/diving-instructor/',
  '/de/professions/yoga-teacher/',
  '/ru/professions/yoga-teacher/',
  '/de/professions/photographer/',
  '/ru/professions/photographer/',
  '/de/professions/real-estate-agent/',
  '/ru/professions/real-estate-agent/',
  '/de/professions/chef/',
  '/ru/professions/chef/',
  '/de/professions/dj/',
  '/ru/professions/dj/',
  '/de/professions/hairdresser/',
  '/ru/professions/hairdresser/',
  '/de/professions/tattoo-artist/',
  '/ru/professions/tattoo-artist/',
]);
function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'functions', '_lighthouse-reports', '_research'].includes(e.name) || e.name.startsWith('_')) continue;
      walk(p, a);
    } else if (e.name === 'index.html') a.push(p);
  }
  return a;
}
function pp(f) {
  const r = path.relative(ROOT, f).replace(/\\/g, '/');
  return r === 'index.html' ? '/' : '/' + r.replace('/index.html', '') + '/';
}
const meta = [];
const h1 = [];
const noSchema = [];
for (const f of walk(ROOT)) {
  const h = fs.readFileSync(f, 'utf8');
  const p = pp(f);
  const robots = (h.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  if (/noindex/i.test(robots)) continue;
  if ((p.startsWith('/de/') || p.startsWith('/ru/')) && !PILOT.has(p)) continue;
  const title = (h.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const desc = (h.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  if (title.length < 30 || title.length > 65) meta.push({ p, kind: 'title', len: title.length, val: title.slice(0, 50) });
  if (desc.length < 120 || desc.length > 165) meta.push({ p, kind: 'desc', len: desc.length });
  const h1c = (h.match(/<h1[^>]*>/gi) || []).length;
  if (h1c !== 1) h1.push({ p, h1c });
  if (!/application\/ld\+json/i.test(h)) noSchema.push(p);
}
console.log(JSON.stringify({ metaCount: meta.length, meta: meta.slice(0, 25), h1, noSchemaCount: noSchema.length }, null, 2));
