const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const TODAY = '2026-05-31';

const HREFLANG_BLOCK = (enUrl) =>
  `<link rel="alternate" hreflang="en" href="${enUrl}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/" />\n<link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;

const LANG_SWITCH =
  '<p class="lang-switch" style="font:600 .72rem \'JetBrains Mono\',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--tl);margin:0 0 1.25rem">Language: EN · <a href="/de/">Deutsch</a> · <a href="/ru/">Русский</a> — visa advice in German &amp; Russian</p>\n';

const VISA_SLUGS = fs.readdirSync(path.join(ROOT, 'visas')).filter((d) => {
  return fs.existsSync(path.join(ROOT, 'visas', d, 'index.html'));
});

const COMPARE_ITEMS = {
  'dtv-vs-elite': [
    { name: 'Destination Thailand Visa (DTV)', url: '/visas/dtv/' },
    { name: 'Thailand Privilege Elite Visa', url: '/visas/privilege-elite/' },
  ],
  'dtv-vs-ltr': [
    { name: 'Destination Thailand Visa (DTV)', url: '/visas/dtv/' },
    { name: 'Long-Term Resident Visa (LTR)', url: '/visas/ltr/' },
  ],
  'dtv-vs-smart': [
    { name: 'Destination Thailand Visa (DTV)', url: '/visas/dtv/' },
    { name: 'SMART Visa Thailand', url: '/visas/smart/' },
  ],
  'ed-vs-dtv': [
    { name: 'Education Visa (ED)', url: '/visas/education-ed/' },
    { name: 'Destination Thailand Visa (DTV)', url: '/visas/dtv/' },
  ],
  'marriage-vs-retirement': [
    { name: 'Marriage Non-O Visa', url: '/visas/marriage-non-o/' },
    { name: 'Retirement Non-O Visa', url: '/visas/retirement-non-o/' },
  ],
  'non-o-vs-o-a': [
    { name: 'Retirement Non-O Visa', url: '/visas/retirement-non-o/' },
    { name: 'Retirement O-A Visa', url: '/visas/retirement-o-a/' },
  ],
  'o-a-vs-o-x': [
    { name: 'Retirement O-A Visa', url: '/visas/retirement-o-a/' },
    { name: 'Retirement O-X Visa', url: '/visas/retirement-o-x/' },
  ],
  'privilege-vs-ltr': [
    { name: 'Thailand Privilege Elite Visa', url: '/visas/privilege-elite/' },
    { name: 'Long-Term Resident Visa (LTR)', url: '/visas/ltr/' },
  ],
  'smart-vs-ltr': [
    { name: 'SMART Visa Thailand', url: '/visas/smart/' },
    { name: 'Long-Term Resident Visa (LTR)', url: '/visas/ltr/' },
  ],
  'pattaya-vs-bangkok': [
    { name: 'Living in Pattaya', url: '/pattaya/living-in-pattaya/' },
    { name: 'Thailand visa hub', url: '/visas/' },
  ],
  'pattaya-vs-chiang-mai': [
    { name: 'Living in Pattaya', url: '/pattaya/living-in-pattaya/' },
    { name: 'Pattaya vs Phuket vs Chiang Mai retirement', url: '/guides/pattaya-vs-phuket-vs-chiang-mai-retirement/' },
  ],
  'pattaya-vs-hua-hin': [
    { name: 'Living in Pattaya', url: '/pattaya/living-in-pattaya/' },
    { name: 'Cost of living Pattaya', url: '/guides/cost-of-living-pattaya/' },
  ],
  'pattaya-vs-hua-hin-deep': [
    { name: 'Living in Pattaya', url: '/pattaya/living-in-pattaya/' },
    { name: 'Retirement Non-O guide', url: '/visas/retirement-non-o/' },
  ],
  'pattaya-vs-phuket': [
    { name: 'Living in Pattaya', url: '/pattaya/living-in-pattaya/' },
    { name: 'Pattaya vs Phuket vs Chiang Mai retirement', url: '/guides/pattaya-vs-phuket-vs-chiang-mai-retirement/' },
  ],
  'visa-comparison-matrix': [
    { name: 'All 12 Thailand visas', url: '/visas/' },
    { name: 'Visa finder quiz', url: '/tools/visa-finder/' },
  ],
};

const CASE_BLOCKS = `
<section class="case-block">
<h2 class="case-label">Case 4 · DTV + soft-power</h2>
<h3>Russian remote developer, 29, Muay Thai + remote work</h3>
<p class="case-meta">Engagement: 6 weeks · Outcome: DTV approved (Moscow consulate) · Soft-power Muay Thai documentation · Status: Legal remote + training</p>

 <h3>Situation</h3>
 <p>Full-stack developer earning USD 95,000/year from EU clients. Wanted to train Muay Thai 6 days/week in Pattaya while keeping remote contracts. Previous tourist entries flagged at Suvarnabhumi — officer noted repeat 60-day patterns. Needed a visa that covers both remote income and gym enrollment without ED attendance risk.</p>

 <h3>What we did</h3>
 <ul>
 <li>Confirmed DTV remote-work category with employment contract + 6-month bank seasoning (USD 520K equivalent in RUB account — embassy accepted with notarised translation).</li>
 <li>Matched him with a Pattaya gym on the <a href="https://pattaya-gym.com/guides/training-thailand-visa-pattaya/">soft-power training list</a> — enrollment letter naming DTV soft-power category.</li>
 <li>Applied at Moscow consulate (3-month seasoning accepted in his batch). Approved in 11 business days.</li>
 <li>Pre-booked Jomtien condo with TM30-ready landlord before first entry — avoided extension block on first 180-day cycle.</li>
 <li>Mapped tax: 180+ days = Thai tax resident; foreign client income remitted after arrival taxable under 2024 rules — referred to accountant, not DIY.</li>
 </ul>

 <h3>Result</h3>
 <p>Legal 5-year DTV. Trains daily, works remotely evenings. No more tourist-entry anxiety. First 180-day extension at Jomtien completed in one visit with TM7 + gym enrollment copy on file. Engagement cost: USD 850 consulting + embassy fees.</p>
</section>

<section class="case-block">
<h2 class="case-label">Case 5 · Family ED + trailing spouse</h2>
<h3>Australian couple, child 8, relocating to Pattaya</h3>
<p class="case-meta">Engagement: 3 months · Outcome: Child on MOE-accredited ED · Spouse on Marriage Non-O · Status: Whole family legal</p>

 <h3>Situation</h3>
 <p>Australian husband (42) with Thai wife and 8-year-old daughter. Husband works remotely (AUD 140K). Wife's family in Naklua. Daughter needed international school — they assumed husband's income could carry a DTV for everyone. DTV is individual-only; child needs ED, spouse needs her own visa category.</p>

 <h3>What we did</h3>
 <ul>
 <li>Shortlisted three MOE-accredited schools via <a href="https://pattaya-school-guide.com/">Pattaya School Guide</a> — picked one with straightforward ED paperwork for primary age.</li>
 <li>Child: ED visa through school bundle (tuition + visa support). Verified <a href="/guides/verify-moe-accredited-school/">MOE accreditation</a> before deposit.</li>
 <li>Mother: Thai citizen — no visa needed.</li>
 <li>Father: DTV on remote-work route (AUD bank statements, contract, 6-month seasoning via Sydney branch).</li>
 <li>Documented 90-day reporting calendar for father + ED extension dates for child — different cycles, same household TM30.</li>
 </ul>

 <h3>Result</h3>
 <p>Family landed together on coordinated visas. Daughter started term on time. Father's DTV and child's ED renewals staggered but manageable with shared TM30 from one landlord. Avoided illegal "child on tourist + homeschool" pattern common in Facebook groups. Engagement cost: AUD 1,400 across consulting + school intro.</p>
</section>
`;

function injectHreflang(html, enUrl) {
  if (html.includes('hreflang="de"')) return html;
  const re = /<link rel="alternate" hreflang="en" href="[^"]+" \/>\s*\n<link rel="alternate" hreflang="x-default" href="[^"]+" \/>\s*\n/;
  if (re.test(html)) {
    return html.replace(re, HREFLANG_BLOCK(enUrl));
  }
  const canon = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
  if (canon) {
    return html.replace(
      `<link rel="canonical" href="${canon[1]}" />`,
      `<link rel="canonical" href="${canon[1]}" />\n${HREFLANG_BLOCK(enUrl).trim()}`
    );
  }
  return html;
}

function injectCompareItemList(html, slug, canonical) {
  if (/ItemList/.test(html) && /compare.*itemListElement/i.test(html)) return html;
  const items = COMPARE_ITEMS[slug];
  if (!items) return html;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: html.match(/<title>([^<]+)<\/title>/i)?.[1]?.replace(/&amp;/g, '&') || slug,
    url: canonical,
    numberOfItems: items.length,
    itemListElement: items.map((x, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: x.name,
      url: `${BASE}${x.url}`,
    })),
  };
  const tag = `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>\n`;
  const idx = html.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com"');
  if (idx === -1) return html;
  return html.slice(0, idx) + tag + html.slice(idx);
}

const results = { hreflang: [], langSwitch: [], compareSchema: [], caseStudies: false };

for (const slug of VISA_SLUGS) {
  const rel = `visas/${slug}/index.html`;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const enUrl = `${BASE}/visas/${slug}/`;
  const next = injectHreflang(html, enUrl);
  if (next !== html) {
    html = next;
    results.hreflang.push(rel);
  }
  if (!html.includes('class="lang-switch"') && html.includes('<main id="main"')) {
    html = html.replace(/<main id="main"[^>]*>/, (m) => m + '\n' + LANG_SWITCH);
    results.langSwitch.push(rel);
  }
  fs.writeFileSync(full, html);
}

for (const slug of Object.keys(COMPARE_ITEMS)) {
  const rel = `compare/${slug}/index.html`;
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  const canon = html.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];
  const next = injectCompareItemList(html, slug, canon);
  if (next !== html) {
    fs.writeFileSync(full, next);
    results.compareSchema.push(rel);
  }
}

const csPath = path.join(ROOT, 'case-studies/index.html');
let cs = fs.readFileSync(csPath, 'utf8');
if (!cs.includes('Case 4 · DTV')) {
  cs = cs.replace('<h2>Why we anonymise everything</h2>', CASE_BLOCKS + '\n <h2>Why we anonymise everything</h2>');
  cs = cs.replace(/Three real foreigners, three pathways/g, 'Five real foreigners, five pathways');
  cs = cs.replace(
    /Three anonymised Thailand visa case studies[^"]+/,
    'Five anonymised Thailand visa case studies from Pattaya — UK retiree on LTR, US DJ on DTV + Non-B, German HNW on LTR, Russian developer on DTV soft-power, Australian family on ED + DTV. Real patterns, changed details.'
  );
  cs = cs.replace(
    /Three anonymised Pattaya visa outcomes[^<]+/,
    'Five anonymised Pattaya visa outcomes — UK retiree on LTR, US DJ on DTV + Non-B, German LTR, Russian DTV soft-power, Australian family ED + DTV. Real patterns, changed details.'
  );
  cs = cs.replace(/3 sectors · Retirement, music, business/g, '5 sectors · Retirement, music, business, remote dev, family');
  cs = cs.replace(/3 MIN READ/g, '6 MIN READ');
  cs = cs.replace(/UPDATED 18 MAY 2026/g, 'UPDATED 31 MAY 2026');
  cs = cs.replace(/"dateModified": "2026-05-18"/g, `"dateModified": "${TODAY}"`);
  cs = cs.replace(
    '"numberOfItems": 3',
    '"numberOfItems": 5'
  );
  if (!cs.includes('Anonymised Russian remote developer')) {
    const extraReviews = `,
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Anonymised Russian remote developer, 29" },
      "reviewBody": "Got DTV through Moscow with soft-power Muay Thai docs. Tim matched the gym, fixed my seasoning paperwork, and I stopped getting grilled at Suvarnabhumi on tourist entries.",
      "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
      "itemReviewed": { "@type": "Service", "name": "Thailand Visa Consulting", "provider": { "@type": "Organization", "name": "Pattaya Visa Help" } }
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Anonymised Australian family, child 8" },
      "reviewBody": "Thought one DTV would cover our whole family. Tim mapped ED for our daughter and DTV for me — MOE school verified before we paid tuition. Whole family legal on arrival.",
      "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
      "itemReviewed": { "@type": "Service", "name": "Thailand Visa Consulting", "provider": { "@type": "Organization", "name": "Pattaya Visa Help" } }
    }`;
    cs = cs.replace(/\s*\]\s*\}\s*\n<\/script>\s*\n<link rel="preconnect"/, `${extraReviews}\n  ]\n}\n</script>\n<link rel="preconnect"`);
  }
  fs.writeFileSync(csPath, cs);
  results.caseStudies = true;
}

for (const hub of ['de/index.html', 'ru/index.html', 'index.html']) {
  const full = path.join(ROOT, hub);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  const enUrl = hub === 'index.html' ? `${BASE}/` : `${BASE}/${hub.split('/')[0]}/`;
  const next = injectHreflang(html, enUrl);
  if (next !== html) {
    fs.writeFileSync(full, next);
    results.hreflang.push(hub);
  }
}

console.log(JSON.stringify(results, null, 2));
