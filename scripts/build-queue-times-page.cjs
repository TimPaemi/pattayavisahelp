/**
 * One-shot builder: creates /guides/jomtien-queue-times/ (EN-only data asset)
 * by cloning the Jomtien field-guide template and swapping head + body.
 */
const fs = require('fs');
const path = require('path');

const TPL = 'guides/jomtien-immigration-office/index.html';
const OUT_DIR = 'guides/jomtien-queue-times';
const URL = 'https://pattayavisahelp.com/guides/jomtien-queue-times/';

let html = fs.readFileSync(TPL, 'utf8');

/* ---------- HEAD ---------- */

html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Jomtien Immigration Queue Times 2026 — Field Data</title>'
);
html = html.replace(
  /<meta name="description" content="[^"]*" \/>/,
  '<meta name="description" content="Jomtien Immigration queue times 2026, from repeated field visits: best arrival hour, worst days, wait by service (90-day report, retirement extension), holiday surges. Updated monthly." />'
);
html = html.replace(
  /<link rel="canonical" href="[^"]*" \/>/,
  `<link rel="canonical" href="${URL}" />`
);
// EN-only page: hreflang en + x-default pointing to self.
html = html.replace(/<link rel="alternate" hreflang="de" href="[^"]*" \/>\n/, '');
html = html.replace(/<link rel="alternate" hreflang="ru" href="[^"]*" \/>\n/, '');
html = html.replace(
  /<link rel="alternate" hreflang="en" href="[^"]*" \/>/,
  `<link rel="alternate" hreflang="en" href="${URL}" />`
);
html = html.replace(
  /<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/,
  `<link rel="alternate" hreflang="x-default" href="${URL}" />`
);

const OG_TITLE = 'Jomtien Immigration Queue Times 2026 — Field Data';
const OG_DESC = 'When to show up at Jomtien Immigration: hour-by-hour and day-by-day wait patterns from repeated field visits. 90-day reports, extensions, re-entry permits.';
html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${OG_TITLE}" />`);
html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${OG_DESC}" />`);
html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${URL}" />`);
html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${OG_TITLE}" />`);
html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${OG_DESC}" />`);

/* Replace all JSON-LD blocks (template has 4) with this page's schema. */
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: URL,
    name: 'Jomtien Immigration Queue Times 2026 — Field Data',
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', '@id': 'https://pattayavisahelp.com/#website', url: 'https://pattayavisahelp.com/', name: 'Pattaya Visa Help', inLanguage: 'en' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Jomtien Immigration Queue Times — 2026 Field Data',
    description: 'Hour-by-hour and day-by-day queue patterns at Jomtien Immigration (Pattaya), compiled from repeated field visits and client reports. Updated monthly.',
    author: { '@type': 'Person', name: 'Tim Paemi', url: 'https://pattayavisahelp.com/about/#author' },
    publisher: { '@type': 'Organization', name: 'Pattaya Visa Help', url: 'https://pattayavisahelp.com' },
    datePublished: '2026-06-10',
    dateModified: '2026-06-10',
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
    image: 'https://pattayavisahelp.com/og-default.png',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Jomtien Immigration queue-time observations, 2026',
    description: 'Typical wait times at Jomtien Immigration Office (Soi 5, Jomtien, Pattaya) by arrival hour, weekday, season, and service type. Compiled from repeated in-person visits and client reports by Pattaya Visa Help; updated monthly.',
    url: URL,
    creator: { '@type': 'Person', name: 'Tim Paemi', url: 'https://pattayavisahelp.com/about/#author' },
    temporalCoverage: '2026',
    spatialCoverage: { '@type': 'Place', name: 'Jomtien Immigration Office', address: { '@type': 'PostalAddress', streetAddress: 'Soi Chaiyaphruek 2, Jomtien', addressLocality: 'Pattaya', addressRegion: 'Chonburi', postalCode: '20150', addressCountry: 'TH' } },
    license: 'https://pattayavisahelp.com/terms/',
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pattayavisahelp.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://pattayavisahelp.com/guides/' },
      { '@type': 'ListItem', position: 3, name: 'Jomtien Queue Times', item: URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What time should I arrive at Jomtien Immigration?', acceptedAnswer: { '@type': 'Answer', text: 'Arrive 07:30 — before the 08:30 official opening. The hall opens around 08:00 and ticket machines start ~08:15. A 07:30 arrival on a Tuesday–Thursday mid-month typically means a 90-day report is done in 30–45 minutes and a retirement extension by late morning.' } },
      { '@type': 'Question', name: 'What is the worst day to visit Jomtien Immigration?', acceptedAnswer: { '@type': 'Answer', text: 'Monday — weekend backlog plus the new-week rush. The single worst days of the year are the first working day after a public holiday cluster (Songkran in April, New Year), when volume roughly doubles.' } },
      { '@type': 'Question', name: 'How long does a retirement extension take at Jomtien?', acceptedAnswer: { '@type': 'Answer', text: 'Plan half a day regardless of arrival time — bank verification makes it slow. Arriving 07:30 typically gets you out by 10:30–11:30. Jomtien often asks you to return the next day to collect the passport stamp.' } },
      { '@type': 'Question', name: 'Does Jomtien Immigration close for lunch?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — 12:00 to 13:00, and counters stop processing shortly before noon. If your number has not been called by ~11:30 you will likely wait through the closure.' } },
      { '@type': 'Question', name: 'Is online 90-day reporting faster than queueing at Jomtien?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — under 5 minutes once your reporting history and TM30 are in the system. Your first 90-day report must still be filed in person. File online Wednesday–Friday off-peak for the fewest portal errors.' } },
    ],
  },
];

const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g)];
// Remove all existing JSON-LD blocks, then insert ours after twitter:image meta.
for (const b of ldBlocks) html = html.replace(b[0] + '\n', '');
const ldHtml = SCHEMAS.map((s) => `<script type="application/ld+json">\n${JSON.stringify(s)}\n</script>`).join('\n');
html = html.replace(
  /(<meta name="twitter:image" content="[^"]*" \/>)/,
  `$1\n${ldHtml}`
);

/* ---------- BODY ---------- */

const BODY = `<header class="article-head">
<div class="crumbs"><a href="/">Home</a><span class="sep">/</span><a href="/guides/">Guides</a><span class="sep">/</span><span>Jomtien Queue Times</span></div>
<span class="article-label">// FIELD DATA · UPDATED MONTHLY</span>
<h1>Jomtien Immigration queue times — the real wait data.</h1>
<p class="lede">Hour-by-hour and day-by-day wait patterns at Jomtien Immigration, compiled from our repeated visits and client reports in Pattaya. The arrival hour, the weekday, and the calendar decide whether you spend 30 minutes or 4 hours.</p>
<div class="article-meta"><span class="live">UPDATED 10 JUN 2026</span><span class="sep">·</span><span class="read">7 MIN READ</span><span class="sep">·</span><span>INDEPENDENT · NO COMMISSIONS</span><span class="sep">·</span><span class="byline">BY <a href="/about/#author">TIM PAEMI</a></span></div>
</header>



<div class="tldr">
<span class="tldr-label">// TL;DR</span>
<p class="tldr-text">Arrive 07:30 on a Tuesday–Thursday in the middle weeks of a month: 90-day report done in 30–45 min, extension by late morning. Mondays and the first working day after any public holiday run roughly double. After 11:00, simple services slip past the 12:00–13:00 lunch closure — come back tomorrow.</p>
</div>

<p class="network-context">The full office guide: <a href="/guides/jomtien-immigration-office/">Jomtien Immigration field guide</a> · <a href="/guides/90-day-reporting/">90-day reporting</a> · <a href="/guides/non-o-extension-pattaya/">Non-O extension at Jomtien</a></p>
<main id="main" class="article-body">
<p><strong>Related:</strong> <a href="/guides/jomtien-immigration-office/">Jomtien field guide</a> · <a href="/guides/90-day-reporting/">90-day reporting</a> · <a href="/guides/tm30-reporting/">TM30</a> · <a href="/tools/expiry-countdown/">Expiry countdown</a> · <a href="/contact/">Free consultation</a></p>

<h2>The one rule that matters</h2>
<p data-speakable>If you remember nothing else: <strong>be standing at the gate at 07:30</strong>. The queue starts forming from 06:30 on busy days, the hall opens around 08:00, tickets start ~08:15, and counters open 08:30. Every 30 minutes of later arrival roughly doubles your total time on a normal day — and the day's intake for extensions can be capped entirely by mid-morning.</p>

<h2>Wait time by arrival hour</h2>
<p>Typical outcomes on a normal mid-month weekday (not Monday, not post-holiday). Two services shown: the fast lane (90-day report, TM47) and the slow lane (annual retirement extension).</p>
<table tabindex="0">
<thead><tr><th scope="col">You arrive</th><th scope="col">90-day report (TM47)</th><th scope="col">Retirement extension</th></tr></thead>
<tbody>
<tr><td><strong>07:00–07:30</strong></td><td>30–45 min — out before 09:30</td><td>2–3 h — out by 10:30–11:30</td></tr>
<tr><td><strong>08:00–08:30</strong></td><td>45–90 min</td><td>3–4 h — lunch closure risk</td></tr>
<tr><td><strong>09:00–10:00</strong></td><td>1.5–2.5 h — queue past 100 numbers</td><td>Half day+ — may not finish; intake may already be capped</td></tr>
<tr><td><strong>11:00–12:00</strong></td><td>Straddles lunch closure — effectively 2 h+</td><td>Usually turned away — come back tomorrow</td></tr>
<tr><td><strong>13:00–14:00</strong></td><td>30–60 min on quiet days — second window</td><td>Too late for same-day processing</td></tr>
<tr><td><strong>After 15:00</strong></td><td>Risky — counters wind down before 16:30</td><td>Not possible</td></tr>
</tbody>
</table>

<h2>Crowding by day of week</h2>
<p>Relative crowding from our visit log, indexed to Monday = 100 (the worst regular day).</p>
<table tabindex="0">
<thead><tr><th scope="col">Day</th><th scope="col">Crowding index</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><td><strong>Monday</strong></td><td>100</td><td>Weekend backlog + fresh-start crowd. Avoid if you can.</td></tr>
<tr><td><strong>Tuesday</strong></td><td>~60</td><td>Reliably one of the two best days.</td></tr>
<tr><td><strong>Wednesday</strong></td><td>~55</td><td>The best regular day in our log.</td></tr>
<tr><td><strong>Thursday</strong></td><td>~60</td><td>Good. Afternoon window often workable for simple stamps.</td></tr>
<tr><td><strong>Friday</strong></td><td>~80</td><td>Pre-weekend rush; people clearing deadlines before Sat/Sun closure.</td></tr>
</tbody>
</table>

<h2>Calendar effects — when the averages break</h2>
<table tabindex="0">
<thead><tr><th scope="col">Period</th><th scope="col">Effect</th><th scope="col">What to do</th></tr></thead>
<tbody>
<tr><td><strong>First working day after a public holiday</strong></td><td>~2× normal volume</td><td>Never visit. Wait two days.</td></tr>
<tr><td><strong>Songkran week (mid-April) and New Year week</strong></td><td>Closures + the heaviest surges of the year</td><td>File early — the 15-day early window on 90-day reports exists for this.</td></tr>
<tr><td><strong>First 3 working days of any month</strong></td><td>Noticeably heavier — monthly renewal cycles</td><td>Target the middle weeks of the month.</td></tr>
<tr><td><strong>High season (Dec–Mar)</strong></td><td>Everything ~30–50% slower; more first-time applicants</td><td>Arrive even earlier; expect intake caps on extensions.</td></tr>
<tr><td><strong>Low season (Sep–Oct)</strong></td><td>The quietest months in our log</td><td>Best time for slow services like conversions.</td></tr>
</tbody>
</table>

<h2>Typical wait by service</h2>
<table tabindex="0">
<thead><tr><th scope="col">Service</th><th scope="col">Fee</th><th scope="col">Typical total time (07:30 arrival)</th></tr></thead>
<tbody>
<tr><td><strong>90-day report (TM47)</strong></td><td>Free (฿2,000 if late)</td><td>30–60 min</td></tr>
<tr><td><strong>Re-entry permit (single/multiple)</strong></td><td>฿1,000 / ฿3,800</td><td>30–60 min</td></tr>
<tr><td><strong>TM30 walk-in filing</strong></td><td>Free</td><td>15–30 min</td></tr>
<tr><td><strong>30-day visa-exempt extension</strong></td><td>฿1,900</td><td>1–2 h</td></tr>
<tr><td><strong>1-year retirement extension</strong></td><td>฿1,900</td><td>2–3 h + often a next-day passport pickup</td></tr>
<tr><td><strong>Non-O conversion (in-country)</strong></td><td>฿2,000 + extension fees</td><td>Multi-visit over 1–2 weeks</td></tr>
</tbody>
</table>
<p>Full service-by-service documents and fees: <a href="/guides/jomtien-immigration-office/">Jomtien Immigration field guide</a>.</p>

<h2>Skip the queue entirely</h2>
<ul>
<li><strong>90-day report</strong> — file <a href="/guides/90-day-reporting/">online at immigration.go.th</a> after your first in-person report. Under 5 minutes when TM30 is current. Wednesday–Friday off-peak has the fewest portal errors in our experience.</li>
<li><strong>Re-entry permit</strong> — also issued at U-Tapao and Bangkok airports before departure (after passport control) if you're flying anyway.</li>
<li><strong>Extensions</strong> — a vetted agent (฿1,500–5,000) queues for you. Worth it for first-time conversions; unnecessary for routine 90-day reports. <a href="/contact/">We can match you, commission-free</a>.</li>
</ul>

<h2>Methodology</h2>
<p>This page aggregates our own repeated visits to Jomtien Immigration and timing reports from clients we assist, collected continuously since early 2026. Figures are typical ranges on the stated conditions, not guarantees — a single understaffed counter or a tour-group surge can break any average. We re-check and update this page monthly; the date stamp above is the last review. Official hours and fees: <a href="https://www.immigration.go.th" target="_blank" rel="noopener noreferrer">immigration.go.th</a>.</p>

<!-- sprint61-mirror -->
<h2>FAQ</h2>

<details>
<summary>What time should I arrive at Jomtien Immigration?</summary>
<p>07:30 — before the official 08:30 opening. The hall opens ~08:00, tickets from ~08:15. A 07:30 arrival on a Tuesday–Thursday mid-month means a 90-day report in 30–45 minutes and an extension done by late morning.</p>
</details>
<details>
<summary>What is the worst day to visit?</summary>
<p>Monday. And the single worst days of the year are the first working day after a holiday cluster — Songkran and New Year — when volume roughly doubles.</p>
</details>
<details>
<summary>How long does a retirement extension take?</summary>
<p>Plan half a day regardless — bank verification is slow. A 07:30 arrival typically finishes by 10:30–11:30, and Jomtien often asks you to collect the passport the next day.</p>
</details>
<details>
<summary>Does the office close for lunch?</summary>
<p>Yes, 12:00–13:00 — and counters stop slightly before noon. Not called by ~11:30? You'll wait through the closure.</p>
</details>
<details>
<summary>Is online 90-day reporting faster?</summary>
<p>Much faster — under 5 minutes once your reporting history and TM30 are in the system. The first report must be in person. See the <a href="/guides/90-day-reporting/">90-day reporting guide</a>.</p>
</details>

<h2>Related Pattaya guides</h2>

<ul>
<li><a href="/guides/jomtien-immigration-office/"><strong>Jomtien Immigration field guide</strong> — documents, fees, dress code <span>(Start here)</span></a></li>
<li><a href="/guides/90-day-reporting/"><strong>90-day reporting (TM47)</strong> — online, in-person, late penalties <span>(Most common visit)</span></a></li>
<li><a href="/guides/non-o-extension-pattaya/"><strong>Non-O extension at Jomtien</strong> — the full document pack <span>(Top slow-lane service)</span></a></li>
</ul>
<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>
</main>`;

const start = html.indexOf('<header class="article-head">');
const end = html.indexOf('</main>') + '</main>'.length;
if (start === -1 || end === -1) throw new Error('template markers not found');
html = html.slice(0, start) + BODY + html.slice(end);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
console.log('written:', path.join(OUT_DIR, 'index.html'), html.length, 'bytes');
