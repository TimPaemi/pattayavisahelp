const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TODAY = '2026-05-31';

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git') continue;
      walkHtml(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractFaqs(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  const block = main ? main[0] : html;
  const items = [];
  for (const m of block.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi)) {
    const q = stripHtml(m[1]);
    let a = stripHtml(m[2]);
    if (q && a && a.length > 20) items.push({ q, a });
  }
  return items;
}

function injectFaqSchema(html, items) {
  if (!items.length || /FAQPage/.test(html)) return html;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.slice(0, 12).map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };
  const tag = `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>\n`;
  const idx = html.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com"');
  if (idx === -1) return html;
  return html.slice(0, idx) + tag + html.slice(idx);
}

const HOWTO_TDAC = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"HowTo","name":"How to fill the Thailand Digital Arrival Card (TDAC)","description":"Step-by-step TDAC submission at tdac.immigration.go.th before arriving in Thailand","totalTime":"PT10M","step":[{"@type":"HowToStep","position":1,"name":"Open tdac.immigration.go.th","text":"Use the official Immigration Bureau TDAC portal on your phone or laptop within 72 hours of arrival."},{"@type":"HowToStep","position":2,"name":"Enter passport and travel details","text":"Passport number, nationality, flight number, arrival date, and accommodation address in Thailand."},{"@type":"HowToStep","position":3,"name":"Complete health declaration","text":"Answer the health questions truthfully — required since TDAC replaced the paper TM6."},{"@type":"HowToStep","position":4,"name":"Save the QR confirmation","text":"Screenshot or PDF the confirmation QR code — immigration may ask to scan it on arrival."}]}
</script>
`;

const CONTEXTUAL = {
  'visas/dtv/index.html':
    '<p class="network-context">Training in Pattaya? DTV soft-power covers Muay Thai — see <a href="https://pattaya-gym.com/guides/training-thailand-visa-pattaya/" target="_blank" rel="noopener noreferrer">Pattaya Gym visa + training guide</a> · Nomad cafés: <a href="https://pattaya-coffee.com/" target="_blank" rel="noopener noreferrer">Pattaya Coffee</a></p>\n',
  'visas/education-ed/index.html':
    '<p class="network-context">Choosing a school? <a href="https://pattaya-school-guide.com/" target="_blank" rel="noopener noreferrer">Pattaya School Guide</a> lists MOE-accredited options · Muay Thai ED: <a href="https://pattaya-gym.com/" target="_blank" rel="noopener noreferrer">Pattaya Gym</a></p>\n',
  'visas/retirement-o-a/index.html':
    '<p class="network-context">O-A requires health insurance — compare hospitals via <a href="https://pattaya-medical.com/" target="_blank" rel="noopener noreferrer">Pattaya Medical</a> · Retirement areas: <a href="/pattaya/living-in-pattaya/">Living in Pattaya guide</a></p>\n',
  'visas/retirement-non-o/index.html':
    '<p class="network-context">Healthcare in Pattaya: <a href="https://pattaya-medical.com/" target="_blank" rel="noopener noreferrer">Pattaya Medical</a> · Cost of living: <a href="/guides/cost-of-living-pattaya/">Pattaya COL guide</a></p>\n',
  'glossary/soft-power/index.html':
    '<p class="network-context">Soft-power often means Muay Thai — <a href="https://pattaya-gym.com/guides/muay-thai-pattaya-beginners/" target="_blank" rel="noopener noreferrer">beginner Muay Thai in Pattaya</a> · Full DTV: <a href="/visas/dtv/">DTV guide</a></p>\n',
  'gyms/index.html':
    '<p class="network-context">Directory: <a href="https://pattaya-gym.com/" target="_blank" rel="noopener noreferrer">Pattaya Gym</a> — full gym + Muay Thai map · DTV soft-power: <a href="/visas/dtv/">DTV visa guide</a> · <a href="/glossary/soft-power/">Soft-power glossary</a></p>\n',
  'healthcare/index.html':
    '<p class="network-context">Hospital directory: <a href="https://pattaya-medical.com/" target="_blank" rel="noopener noreferrer">Pattaya Medical</a> · Insurance for visas: <a href="/guides/health-insurance/">Health insurance guide</a> · O-A requirements: <a href="/visas/retirement-o-a/">O-A retirement</a></p>\n',
  'guides/international-schools-pattaya/index.html':
    '<p class="network-context">Full school directory: <a href="https://pattaya-school-guide.com/" target="_blank" rel="noopener noreferrer">Pattaya School Guide</a> · ED visa: <a href="/visas/education-ed/">Education ED guide</a></p>\n',
};

const GUIDE_FAQ_PRIORITY = [
  'guides/90-day-reporting/index.html',
  'guides/tm30-reporting/index.html',
  'guides/re-entry-permits/index.html',
  'guides/health-insurance/index.html',
  'guides/jomtien-immigration-office/index.html',
  'guides/thai-tax-foreign-residents/index.html',
  'guides/cost-of-living-pattaya/index.html',
  'guides/visa-overstay-penalties/index.html',
  'guides/visa-scams-pattaya/index.html',
  'guides/thai-bank-account-as-foreigner/index.html',
  'guides/healthcare-thailand/index.html',
  'guides/visa-runs-vs-extensions/index.html',
  'guides/buying-property-thailand/index.html',
  'guides/permanent-residency-thailand/index.html',
  'guides/foreign-marriage-legalisation/index.html',
  'guides/international-schools-pattaya/index.html',
  'guides/pattaya-vs-phuket-vs-chiang-mai-retirement/index.html',
  'guides/bringing-family-to-thailand/index.html',
  'guides/embassy-directory/index.html',
  'guides/working-in-thailand/index.html',
];

const results = { faq: [], dateMod: 0, contextual: [], howto: [] };

for (const rel of GUIDE_FAQ_PRIORITY) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (/FAQPage/.test(html)) continue;
  const items = extractFaqs(html);
  if (items.length < 2) continue;
  const next = injectFaqSchema(html, items);
  if (next !== html) {
    fs.writeFileSync(full, next);
    results.faq.push(rel);
  }
}

for (const rel of Object.keys(CONTEXTUAL)) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('class="network-context"')) continue;
  const marker = html.includes('<div class="faq">') ? '<div class="faq">' : '<main id="main"';
  if (html.includes(marker)) {
    html = html.replace(marker, CONTEXTUAL[rel] + marker);
    fs.writeFileSync(full, html);
    results.contextual.push(rel);
  }
}

const tdac = path.join(ROOT, 'blog/tdac-step-by-step/index.html');
if (fs.existsSync(tdac)) {
  let html = fs.readFileSync(tdac, 'utf8');
  if (!/HowTo/.test(html)) {
    html = html.replace(
      '<link rel="preconnect" href="https://fonts.googleapis.com" />',
      HOWTO_TDAC + '<link rel="preconnect" href="https://fonts.googleapis.com" />'
    );
    fs.writeFileSync(tdac, html);
    results.howto.push('blog/tdac-step-by-step');
  }
}

for (const v of fs.readdirSync(path.join(ROOT, 'visas'))) {
  const f = path.join(ROOT, 'visas', v, 'index.html');
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  const before = html;
  html = html.replace(/"dateModified":\s*"[^"]+"/g, `"dateModified": "${TODAY}"`);
  html = html.replace(/UPDATED \d+ [A-Z]+ 2026/gi, 'UPDATED 31 MAY 2026');
  html = html.replace(/UPDATED MAY 2026/gi, 'UPDATED 31 MAY 2026');
  if (html !== before) {
    fs.writeFileSync(f, html);
    results.dateMod++;
  }
}

console.log(JSON.stringify(results, null, 2));
