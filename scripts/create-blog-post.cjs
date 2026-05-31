/**
 * Clone jomtien blog template into a new post directory.
 * Usage: node scripts/create-blog-post.cjs <slug>
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/create-blog-post.cjs <slug>');
  process.exit(1);
}

const POSTS = {
  '90-day-report-online-2026': {
    title: '90-Day Report Online in Thailand 2026 — TM47 Portal Guide',
    description:
      'Thailand 90-day report online 2026 — immigration.go.th TM47 portal, when to file, what if landlord TM30 is missing, and Pattaya in-person backup at Jomtien.',
    h1: '90-day report online in 2026: TM47 portal, deadlines, and Pattaya backup',
    lede: 'Most long-stay holders should file the 90-day report online — but the portal fails if TM30 was never filed. Here is the 2026 workflow from Pattaya.',
    tldr: 'File at immigration.go.th within 15 days before or 7 days after your 90-day deadline. You need a valid TM30 on file. If online fails, Jomtien Immigration Building A handles walk-in TM47 — arrive before 08:30 on weekdays.',
    crumbs: '90-Day Report Online 2026',
    readMin: '4',
    date: '2026-06-01',
    body: `<p><strong>Full guide:</strong> <a href="/guides/90-day-reporting/">90-day reporting complete guide</a> · <a href="/guides/tm30-reporting/">TM30 reporting</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration office</a></p>
<h2>Who must file</h2>
<p>Anyone on a visa stay longer than 90 days — Non-O, DTV, ED, LTR, Marriage Non-O, etc. Tourist entries under 90 days do not trigger it until you accumulate 90 days in-country on long-stay visas.</p>
<h2>Online filing (preferred)</h2>
<ol>
<li>Go to <strong>immigration.go.th</strong> → 90-day notification (TM47 online).</li>
<li>Log in with passport details — MRZ scan on mobile saves time.</li>
<li>Confirm address matches latest <strong>TM30</strong> on file. Mismatch = rejection.</li>
<li>Submit within <strong>15 days before</strong> or <strong>7 days after</strong> your due date.</li>
<li>Screenshot the confirmation — immigration may ask on next extension.</li>
</ol>
<h2>When online fails (common in Pattaya)</h2>
<p><strong>No TM30.</strong> Landlord never filed? Fix at tm30.immigration.go.th first — or ask condo juristic person. Without TM30, online 90-day blocks.</p>
<p><strong>Wrong address.</strong> Moved condos but old TM30 still active? File new TM30 before 90-day.</p>
<p><strong>Portal timeout.</strong> Peak mornings (Mon/Tue) — try off-peak or walk in.</p>
<h2>Jomtien in-person backup</h2>
<p>Building A at Jomtien Immigration handles 90-day reports. Bring passport + TM30 copy + lease. Queue often 30–60 min Wed–Thu mid-morning. See our <a href="/blog/jomtien-immigration-2026/">Jomtien queue times update</a>.</p>
<h2>Penalties</h2>
<p>Overdue 90-day: ฿2,000 fine at immigration when you next report or extend. Chronic misses can flag your profile. Use our <a href="/tools/expiry-countdown/">expiry countdown</a> to track both visa expiry and 90-day dates.</p>
<p>Questions? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'ltr-royal-decree-743-2026': {
    title: 'LTR Royal Decree 743 in 2026 — Who Actually Gets 0% Tax on Foreign Income',
    description:
      'Royal Decree 743 explained for LTR holders in 2026 — Wealthy Pensioner, Wealthy Global Citizen, Work-from-Thailand Professional. Who qualifies, who does not, and the filing steps in Pattaya.',
    h1: 'Royal Decree 743 in 2026: which LTR holders get 0% tax on foreign income',
    lede: 'LTR marketing promises tax perks. Royal Decree 743 is the actual law — and DTV holders are not on the list. Here is who qualifies and how Pattaya accountants file it.',
    tldr: 'Only LTR Wealthy Pensioner, Wealthy Global Citizen, and Work-from-Thailand Professional categories can claim Royal Decree 743 exemption on qualifying foreign income. DTV, Non-O, ED, and Privilege holders cannot. You must file with the Revenue Department — exemption is not automatic.',
    crumbs: 'Royal Decree 743 2026',
    readMin: '5',
    date: '2026-05-31',
    body: `<p><strong>Full LTR guide:</strong> <a href="/visas/ltr/">Long-Term Resident visa 2026</a> · <a href="/guides/thai-tax-foreign-residents/">Thai tax for foreign residents</a> · <a href="/glossary/royal-decree-743/">Royal Decree 743 glossary</a></p>
<h2>What Royal Decree 743 actually does</h2>
<p>Since 1 January 2024, foreign income remitted to Thailand by tax residents is taxable when it lands — regardless of when it was earned. Royal Decree 743 creates a carve-out: certain <strong>LTR visa categories</strong> can exempt qualifying foreign-source income from Thai tax if they file correctly with the Revenue Department.</p>
<p>This is not a blanket "LTR pays no tax." It is category-specific, document-heavy, and requires annual filing. Get it wrong and you pay standard rates on remitted income.</p>
<h2>Who qualifies (and who does not)</h2>
<ul>
<li><strong>✓ LTR Wealthy Pensioner</strong> — foreign pension / retirement income meeting BOI category rules</li>
<li><strong>✓ LTR Wealthy Global Citizen</strong> — passive foreign investment income + asset threshold met at application</li>
<li><strong>✓ LTR Work-from-Thailand Professional</strong> — remote employment for foreign employers (not Thai clients)</li>
<li><strong>✗ DTV</strong> — explicitly outside RD 743. Remote work on DTV can still trigger tax residency; no exemption.</li>
<li><strong>✗ Non-O, O-A, ED, Privilege, SMART</strong> — standard remittance rules apply if you are tax resident 180+ days</li>
</ul>
<h2>The filing steps (Pattaya pattern we see)</h2>
<ol>
<li>Obtain LTR approval and activate visa — exemption applies from the tax year you become LTR, not retroactively to pre-LTR remittances.</li>
<li>Engage a Thai accountant familiar with RD 743 (not all Pattaya tax shops handle LTR — ask before you pay).</li>
<li>Submit RD 743 application form + LTR certificate + income evidence to the Revenue Department.</li>
<li>Keep remittance records: SWIFT slips, bank credit notes, pension statements — Thai Revenue matches inflows.</li>
<li>Re-file annually. LTR status alone does not renew the exemption; each year's remittance profile must qualify.</li>
</ol>
<h2>Common mistakes in 2026</h2>
<p><strong>Assuming DTV = LTR tax treatment.</strong> We see this weekly in Jomtien consults. DTV remote workers who remit USD 80K/year to Thailand owe tax unless they structure differently — no RD 743 escape hatch.</p>
<p><strong>Mixing Thai and foreign income.</strong> RD 743 covers qualifying foreign-source income only. Thai rental, Thai consulting, or Thai employer salary is taxed normally.</p>
<p><strong>Not filing because "expats don't pay."</strong> Thailand enforcement on remittance tax stepped up in 2025–2026. Bank reporting + LTR visibility = higher audit risk for non-filers.</p>
<p><strong>Pre-2024 income confusion.</strong> Income earned before 2024 and kept offshore may still qualify as "savings" on remittance — but post-2024 earnings remitted in 2026 do not get the old treatment. LTR RD 743 is separate from the savings rule.</p>
<h2>Realistic savings (why people switch to LTR)</h2>
<p>A Wealthy Pensioner remitting GBP 78,000/year might save ~GBP 12,000 annually vs standard remittance tax — see our <a href="/case-studies/">case studies</a> for an anonymised UK retiree pattern. A Wealthy Global Citizen with EUR 380K dividends can save six figures if structure is clean — but setup cost (accountant + BOI + USD 500K Thai investment) runs EUR 4K+ upfront.</p>
<h2>Next steps</h2>
<p>Run your profile through the <a href="/tools/income-test/">income test</a> and <a href="/tools/visa-finder/">visa finder</a>. If LTR looks viable, book a consult — we map category fit before you pay BOI fees.</p>
<p><a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999 · EN · DE · РУ</p>`,
  },
};

const spec = POSTS[slug];
if (!spec) {
  console.error('Unknown slug:', slug);
  process.exit(1);
}

const template = fs.readFileSync(path.join(ROOT, 'blog/jomtien-immigration-2026/index.html'), 'utf8');
const url = `https://pattayavisahelp.com/blog/${slug}/`;
let html = template
  .replace(/jomtien-immigration-2026/g, slug)
  .replace(/Jomtien Immigration Office 2026 — Queue Times & What to Expect/g, spec.title)
  .replace(/Jomtien Immigration Office Pattaya 2026 — typical queue times by day, what to bring for extensions and 90-day reports, and costly mistakes we see every week\./g, spec.description)
  .replace(/Jomtien Immigration 2026: queue times, best arrival window, and what actually happens/g, spec.h1)
  .replace(/Pattaya's Jomtien Immigration Office handles more retiree and DTV extensions than almost anywhere outside Bangkok\. Here is what the queue looks like in 2026\./g, spec.lede)
  .replace(/Pro tip: The portal supports MRZ scan[^<]+/g, spec.tldr.replace(/'/g, "\\'"))
  .replace(/Jomtien Immigration 2026/g, spec.crumbs)
  .replace(/3 MIN READ/g, `${spec.readMin} MIN READ`)
  .replace(/UPDATED 18 MAY 2026/g, 'UPDATED 31 MAY 2026')
  .replace(/"dateModified": "2026-05-18"/g, `"dateModified": "${spec.date}"`)
  .replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${spec.body}\n</main>`);

const outDir = path.join(ROOT, 'blog', slug);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('Created', outDir);
