const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const src = path.join(ROOT, 'blog/jomtien-immigration-2026/index.html');
const dstDir = path.join(ROOT, 'blog/dtv-180-day-extension-2026');
fs.mkdirSync(dstDir, { recursive: true });

let h = fs.readFileSync(src, 'utf8');
const replacements = [
  [/jomtien-immigration-2026/g, 'dtv-180-day-extension-2026'],
  [
    /Jomtien Immigration Office 2026 — Queue Times & What to Expect/g,
    'DTV 180-Day Extension in Thailand 2026 — Pattaya & Jomtien Guide',
  ],
  [
    /Jomtien Immigration 2026: queue times, best arrival window, and what actually happens/g,
    'How to extend your DTV stay for another 180 days — ฿1,900 fee, TM7 form, and what Jomtien Immigration checks in 2026',
  ],
  [
    /Pattaya's Jomtien Immigration Office handles more retiree and DTV extensions than almost anywhere outside Bangkok\. Here is what the queue looks like in 2026\./g,
    'The Destination Thailand Visa gives 180 days per entry — but most DTV holders extend once inside Thailand for another 180 days. Here is the 2026 process at Jomtien and nationwide.',
  ],
  [/Jomtien Immigration 2026/g, 'DTV 180-day extension'],
  [
    /Jomtien Immigration Office Pattaya 2026 — typical queue times by day, what to bring for extensions and 90-day reports, and costly mistakes we see every week\./g,
    'DTV 180-day extension guide 2026 — TM7 form, ฿1,900 fee, passport photos, proof of address, and common rejection reasons at Pattaya Jomtien Immigration.',
  ],
];
for (const [a, b] of replacements) h = h.replace(a, b);

const body = `<main id="main" class="article-body">
<p><strong>Full DTV pillar:</strong> <a href="/visas/dtv/">Destination Thailand Visa — complete 2026 guide</a> · <strong>Field office:</strong> <a href="/guides/jomtien-immigration-office/">Jomtien Immigration Office guide</a></p>
<h2>Who can extend?</h2>
<p>DTV holders in Thailand on their first 180-day stamp can apply for a <strong>single 180-day extension</strong> at any immigration office — ฿1,900 fee (TM7). This is not unlimited: after 360 days total in-country on one entry cycle, you must leave and re-enter (or hold a multi-year DTV with remaining validity).</p>
<h2>Documents (Jomtien, May 2026)</h2>
<ul>
<li>Passport + copy of photo page and current DTV stamp</li>
<li>TM7 extension form (available at immigration or download from immigration.go.th)</li>
<li>4×6 cm photo (some offices accept 2; Jomtien often wants 1–2 recent)</li>
<li>Proof of address — lease + landlord ID copy, or hotel booking + TM30 receipt</li>
<li>TM30 must be on file — if missing, file online before you queue</li>
<li>Some officers ask for proof of funds (฿500K seasoning) — bring bank statement if you have it</li>
</ul>
<h2>Timeline and cost</h2>
<p>Same-day processing at Jomtien if documents are complete — typically 1–3 hours including queue. Fee: ฿1,900 cash. No agent required for straightforward DTV extensions.</p>
<h2>Common rejection reasons</h2>
<ul>
<li><strong>No TM30</strong> — fix before you go</li>
<li><strong>Overstay</strong> — even 1 day blocks extension; pay fine first at a different counter</li>
<li><strong>Wrong form</strong> — TM7 for extension, not TM47 (90-day report)</li>
<li><strong>Address mismatch</strong> — lease address must match TM30</li>
</ul>
<h2>After extension</h2>
<p>Set your next 90-day report date in our <a href="/tools/expiry-countdown/">expiry countdown tool</a>. Plan re-entry before your 360-day in-country limit if you intend to stay longer — or apply for a new DTV entry from a consulate abroad.</p>
<p>Not sure DTV is right? <a href="/tools/visa-finder/">Take the visa finder quiz</a> or <a href="/contact/">message us</a>.</p>
</main>`;

h = h.replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, body);
fs.writeFileSync(path.join(dstDir, 'index.html'), h);
console.log('Created blog/dtv-180-day-extension-2026/index.html');
