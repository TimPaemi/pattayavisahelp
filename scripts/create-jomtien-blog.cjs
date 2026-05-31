const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const src = path.join(ROOT, 'blog/tdac-step-by-step/index.html');
const dstDir = path.join(ROOT, 'blog/jomtien-immigration-2026');
fs.mkdirSync(dstDir, { recursive: true });

let h = fs.readFileSync(src, 'utf8');
const replacements = [
  [/tdac-step-by-step/g, 'jomtien-immigration-2026'],
  [
    /TDAC Step by Step — Thailand Digital Arrival Card 2026 Guide/g,
    'Jomtien Immigration Office 2026 — Queue Times & What to Expect',
  ],
  [
    /TDAC step by step:how to fill the digital arrival card/g,
    'Jomtien Immigration 2026: queue times, best arrival window, and what actually happens',
  ],
  [
    /Click &quot;Arrival Card&quot; on the homepage\. Fill in:/g,
    "Pattaya's Jomtien Immigration Office handles more retiree and DTV extensions than almost anywhere outside Bangkok. Here is what the queue looks like in 2026.",
  ],
  [/Tdac Step By Step/g, 'Jomtien Immigration 2026'],
  [
    /How to fill the Thailand Digital Arrival Card\. Step-by-step: passport details, travel info, accommodation, health declaration\. Free at tdac\.immigration\.go\.th\./g,
    'Jomtien Immigration Office Pattaya 2026 — typical queue times by day, what to bring for extensions and 90-day reports, and costly mistakes we see every week.',
  ],
];
for (const [a, b] of replacements) h = h.replace(a, b);

const body = `<main id="main" class="article-body">
<p><strong>Full field guide:</strong> <a href="/guides/jomtien-immigration-office/">Jomtien Immigration Office — complete 2026 guide</a> (hours, building map, document lists).</p>
<h2>Quick numbers (May 2026)</h2>
<ul>
<li><strong>Address:</strong> Jomtien Immigration, Soi 5, Jomtien Beach Road — not the old Pattaya Second Road office.</li>
<li><strong>Hours:</strong> Mon–Fri 08:30–16:30 (lunch closure ~12:00–13:00). Sat/Sun closed.</li>
<li><strong>Best arrival:</strong> 07:30–08:00 for extension days. Queue often 40–90 minutes by 09:30 on Mon/Tue.</li>
<li><strong>Quietest:</strong> Wed–Thu mid-morning for 90-day reporting; Fri afternoons can spike before the weekend.</li>
</ul>
<h2>What people get wrong</h2>
<p><strong>Wrong bank balance printout.</strong> Jomtien wants a stamped bank letter or passbook copy showing balance on every month of the seasoning period — not a mobile-app screenshot.</p>
<p><strong>Missing TM30.</strong> If your landlord never filed TM30, extension can stop at the counter. Fix online at tm30.immigration.go.th before you queue.</p>
<p><strong>Wrong outfit.</strong> Collared shirt, long trousers, closed shoes. Shorts and tank tops get turned away — you lose your queue spot.</p>
<p><strong>90-day vs extension confusion.</strong> Building A handles 90-day reports. Visa extensions are a different queue — ask security which line before you wait an hour in the wrong one.</p>
<h2>Services we see most in Pattaya</h2>
<ul>
<li>Non-O retirement annual extension (50+ with ฿800K bank or ฿65K/month income proof)</li>
<li>DTV 180-day extension (฿1,900 fee — TM7, passport photos, proof of address)</li>
<li>90-day report (TM47 online preferred; in-person backup if portal fails)</li>
<li>Re-entry permit (single vs multiple — decide before you travel)</li>
</ul>
<h2>After your visit</h2>
<p>Photograph every stamp and receipt. Set a reminder with our <a href="/tools/expiry-countdown/">expiry countdown tool</a>. If immigration asks for extra documents, you usually get a slip with a return date — do not overstay waiting.</p>
<p>Questions before you go? <a href="/contact/">Message us</a> or WhatsApp +66 96 728 6999 — we reply within 24 hours with the doc list for your visa type.</p>
</main>`;

h = h.replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, body);
fs.writeFileSync(path.join(dstDir, 'index.html'), h);
console.log('Created blog/jomtien-immigration-2026/index.html');
