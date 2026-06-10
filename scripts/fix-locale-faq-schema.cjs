/**
 * Rebuild FAQPage JSON-LD on DE/RU guide pages from the on-page FAQ content,
 * replacing English schema cloned from EN templates.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractFaqs(html) {
  const block = html.match(/<div class="faq">([\s\S]*?)<\/div>/i)?.[1];
  if (!block) return [];
  const faqs = [];
  for (const m of block.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi)) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

const targets = [];
for (const locale of ['de', 'ru']) {
  const dir = path.join(ROOT, locale, 'guides');
  if (!fs.existsSync(dir)) continue;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const f = path.join(dir, e.name, 'index.html');
    if (fs.existsSync(f)) targets.push({ f, page: `/${locale}/guides/${e.name}/` });
  }
}

let fixed = 0;
let removed = 0;
const skipped = [];

for (const { f, page } of targets) {
  let html = fs.readFileSync(f, 'utf8');
  const scriptRe = /<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?\})\s*<\/script>/;
  const m = html.match(scriptRe);
  if (!m) continue;

  // Only touch schemas whose questions are English (start with English question words)
  const isEnglish = /"name":"(What|Can|Do|How|Is|Are|Where|Which|When|Why)\b/.test(m[1]);
  if (!isEnglish) {
    skipped.push({ page, reason: 'schema already localized' });
    continue;
  }

  const faqs = extractFaqs(html);
  if (faqs.length >= 2) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    };
    html = html.replace(scriptRe, `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>`);
    fixed++;
    console.log(`FIXED   ${page} (${faqs.length} on-page FAQs)`);
  } else {
    // No matching visible FAQ content — remove the mismatched schema entirely
    html = html.replace(scriptRe, '');
    removed++;
    console.log(`REMOVED ${page} (no on-page FAQ block found)`);
  }
  fs.writeFileSync(f, html);
}

console.log(`\nDone: ${fixed} rebuilt, ${removed} removed, ${skipped.length} already localized.`);
