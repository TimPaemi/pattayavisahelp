/**
 * Policy radar — surfaces stale content and blog topic gaps.
 * Usage: node scripts/policy-radar.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const STALE_DAYS = 21;

const TOPICS = [
  { slug: '90-day-report-online-2026', keywords: ['90-day', 'tm47', 'online report'], priority: 'high' },
  { slug: 'tm30-landlord-refusal-2026', keywords: ['tm30', 'landlord'], priority: 'medium' },
  { slug: 'dtv-embassy-seasoning-2026', keywords: ['seasoning', 'embassy', 'dtv'], priority: 'medium' },
  { slug: 'non-o-extension-documents-2026', keywords: ['non-o', 'extension', 'jomtien'], priority: 'low' },
  { slug: 'ed-visa-moe-accreditation-2026', keywords: ['ed visa', 'moe', 'accreditation'], priority: 'medium' },
  { slug: 'privilege-elite-renewal-2026', keywords: ['privilege', 'elite', 'renewal'], priority: 'medium' },
  { slug: 're-entry-permit-pattaya-2026', keywords: ['re-entry', 'jomtien', 'tm8'], priority: 'medium' },
  { slug: 'ltr-boi-application-checklist-2026', keywords: ['ltr', 'boi', 'application'], priority: 'high' },
  { slug: 'marriage-non-o-documents-2026', keywords: ['marriage', 'non-o', 'extension'], priority: 'medium' },
  { slug: 'work-permit-renewal-pattaya-2026', keywords: ['work permit', 'renewal', 'pattaya'], priority: 'medium' },
  { slug: 'o-a-health-insurance-2026', keywords: ['o-a', 'health insurance', '3m'], priority: 'medium' },
  { slug: 'tourist-visa-extension-2026', keywords: ['tourist', 'extension', 'immigration'], priority: 'medium' },
  { slug: 'dtv-tax-residency-2026', keywords: ['dtv', 'tax', 'residency'], priority: 'high' },
];

function daysSince(iso) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

const report = { date: TODAY, staleVisas: [], staleBlogs: [], missingTopics: [], existingBlogs: [] };

for (const d of fs.readdirSync(path.join(ROOT, 'visas'))) {
  const f = path.join(ROOT, 'visas', d, 'index.html');
  if (!fs.existsSync(f)) continue;
  const m = fs.readFileSync(f, 'utf8').match(/"dateModified":\s*"([^"]+)"/);
  if (m && daysSince(m[1]) > STALE_DAYS) report.staleVisas.push({ visa: d, dateModified: m[1] });
}

for (const d of fs.readdirSync(path.join(ROOT, 'blog'))) {
  const f = path.join(ROOT, 'blog', d, 'index.html');
  if (!fs.existsSync(f)) continue;
  report.existingBlogs.push(d);
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/"dateModified":\s*"([^"]+)"/);
  if (m && daysSince(m[1]) > STALE_DAYS) report.staleBlogs.push({ post: d, dateModified: m[1] });
}

for (const t of TOPICS) {
  if (!report.existingBlogs.includes(t.slug)) report.missingTopics.push(t);
}

const out = path.join(ROOT, '_policy-radar.json');
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
