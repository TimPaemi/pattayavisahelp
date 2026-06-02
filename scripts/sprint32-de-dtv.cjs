/**
 * Sprint 32 — full German DTV page (indexed pilot) + sitemap inclusion.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const deFile = path.join(ROOT, 'de/visas/dtv/index.html');
const article = fs.readFileSync(path.join(__dirname, 'content/de-dtv-article.html'), 'utf8');

let h = fs.readFileSync(deFile, 'utf8');

h = h.replace(/<meta name="robots" content="noindex,follow" \/>/, '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />');

h = h.replace(
  /<main id="main" class="article-body">[\s\S]*?<\/main>/,
  `<main id="main" class="article-body">\n${article}\n</main>`
);

h = h.replace(
  '<div class="article-meta"><span class="live">UPDATED 31 MAY 2026</span></div>',
  '<div class="article-meta"><span class="live">UPDATED 28 MAY 2026</span><span class="sep">·</span><span class="read">9 MIN READ</span><span class="sep">·</span><span>DEUTSCH · UNABHÄNGIG</span></div>'
);

h = h.replace(
  '<span class="article-label">// DE · VISA OVERVIEW</span>',
  '<span class="article-label">// DE · DTV · VOLLSTÄNDIGER LEITFADEN</span>'
);

h = h.replace(
  '<p class="lede">Das DTV ist das wichtigste Visum für digitale Nomaden und Remote-Arbeiter mit ausländischem Einkommen.</p>',
  '<p class="lede">Das Destination Thailand Visa (DTV) ist Thailands 5-Jahres-Visum für Remote-Arbeiter, Freelancer und Soft-Power-Aktivitäten — 180 Tage pro Einreise, ฿10.000 Gebühr, ฿500.000 Seasoning. Vollständiger Leitfaden auf Deutsch für Antragsteller aus Deutschland, Österreich und der Schweiz.</p>'
);

h = h.replace(
  '<a href="/visas/dtv/">Vollständiger englischer Leitfaden →</a>',
  '<a href="/de/visas/dtv/">DTV Leitfaden</a>'
);

const faqSchema = `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Wie lange kann ich mit dem DTV in Thailand bleiben?","acceptedAnswer":{"@type":"Answer","text":"180 Tage pro Einreise, einmal verlängerbar um 180 Tage. Das Visum gilt 5 Jahre mit beliebig vielen Einreisen."}},{"@type":"Question","name":"Kann ich auf dem DTV arbeiten?","acceptedAnswer":{"@type":"Answer","text":"Remote für ausländische Arbeitgeber oder Kunden ja. Thai-Arbeitgeber oder Thai-Kunden nein."}},{"@type":"Question","name":"Wie viel Bankguthaben brauche ich?","acceptedAnswer":{"@type":"Answer","text":"500.000 THB Äquivalent, 3–6 Monate Seasoning je nach Botschaft."}},{"@type":"Question","name":"Muss ich in Thailand Steuern zahlen auf dem DTV?","acceptedAnswer":{"@type":"Answer","text":"Bei 180+ Tagen pro Jahr und Remittance von Auslandseinkommen seit 2024 steuerpflichtig. LTR-Befreiung gilt nicht für DTV."}},{"@type":"Question","name":"Kann ich vom Touristenvisum auf DTV umstellen?","acceptedAnswer":{"@type":"Answer","text":"In der Regel nein — Antrag außerhalb Thailands erforderlich."}}]}`;

h = h.replace(
  /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>\s*/,
  `<script type="application/ld+json">\n${faqSchema}\n</script>\n`
);

if (!h.includes('.network-context{')) {
  h = h.replace(
    '<style>',
    `<style>\n.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}\n`
  );
}

fs.writeFileSync(deFile, h);
console.log('DE DTV full article + index,follow');

const sitemapScript = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(sitemapScript, 'utf8');
if (!sm.includes('LOCALE_INDEXED_PILOT')) {
  sm = sm.replace(
    `function skipPage(p) {
  if (SKIP.has(p)) return true;
  if (p.startsWith('/de/')) return true;
  if (p.startsWith('/ru/')) return true;
  return false;
}`,
    `const LOCALE_INDEXED_PILOT = new Set(['/de/visas/dtv/']);

function skipPage(p) {
  if (SKIP.has(p)) return true;
  if (LOCALE_INDEXED_PILOT.has(p)) return false;
  if (p.startsWith('/de/')) return true;
  if (p.startsWith('/ru/')) return true;
  return false;
}`
  );
  fs.writeFileSync(sitemapScript, sm);
  console.log('rebuild-sitemaps: DE DTV pilot whitelist');
}

const deHub = path.join(ROOT, 'de/index.html');
let hub = fs.readFileSync(deHub, 'utf8');
if (!hub.includes('Vollständiger DTV-Leitfaden auf Deutsch')) {
  hub = hub.replace(
    '<header class="article-head">',
    `<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.35);background:rgba(6,182,212,.08);border-radius:8px;font-size:.95rem"><strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/dtv/">Vollständiger DTV-Leitfaden auf Deutsch</a> (vollständig übersetzt, in Google indexierbar).</p>\n<header class="article-head">`
  );
}
hub = hub.replace('<a href="/visas/dtv/">DTV</a>', '<a href="/de/visas/dtv/">DTV (DE)</a><a href="/visas/dtv/">DTV (EN)</a>');
fs.writeFileSync(deHub, hub);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sitemaps rebuilt');
