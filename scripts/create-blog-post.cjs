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
  'tm30-landlord-refusal-2026': {
    title: 'TM30 Landlord Refusal in Thailand 2026 — What to Do in Pattaya',
    description:
      'Landlord won\'t file TM30? 2026 guide for Pattaya tenants — self-filing options, extension blocks, condo juristic person, and how to fix before Jomtien Immigration.',
    h1: 'Your landlord won\'t file TM30 — fixes that actually work in Pattaya',
    lede: 'No TM30 on file means blocked extensions, failed 90-day online reports, and wasted queue time at Jomtien. Here is the 2026 workaround path.',
    tldr: 'Ask landlord to file at tm30.immigration.go.th — takes 5 minutes. If they refuse, some tenants file via condo juristic office or switch to a TM30-ready lease. Never fly in on a new visa without confirming TM30 will be filed within 24 hours of check-in.',
    crumbs: 'TM30 Landlord Refusal 2026',
    readMin: '4',
    date: '2026-06-02',
    body: `<p><strong>Related:</strong> <a href="/guides/tm30-reporting/">TM30 reporting guide</a> · <a href="/blog/90-day-report-online-2026/">90-day online report</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a></p>
<h2>Why TM30 matters</h2>
<p>Every foreigner check-in must be reported to immigration within 24 hours. Your landlord, hotel, or condo juristic person files TM30 online. Without it on file, <strong>visa extensions and 90-day reports fail</strong> at the counter — we see this weekly in Pattaya.</p>
<h2>Step 1 — Ask properly</h2>
<p>Send your landlord the direct link: <strong>tm30.immigration.go.th</strong>. Explain it is a legal obligation, not optional. Provide passport copy + lease. Most Pattaya condo owners simply do not know how — a 2-minute walkthrough fixes 80% of cases.</p>
<h2>Step 2 — Condo juristic person</h2>
<p>In a managed condo (Jomtien, Pratumnak, Central Pattaya), the <strong>juristic office</strong> often files TM30 for tenants. Bring lease + passport to the front desk. Fee: usually free to ฿200.</p>
<h2>Step 3 — Switch lease if needed</h2>
<p>Some guesthouses and informal landlords permanently refuse. If you are on Non-O or DTV with annual extensions ahead, <strong>move to a TM30-ready landlord</strong> before your next extension — cheaper than repeated immigration rejections.</p>
<h2>What does NOT work</h2>
<ul>
<li>Bribing immigration without TM30 — they send you back.</li>
<li>Fake hotel receipts — flagged in 2025–2026 enforcement passes.</li>
<li>Ignoring it until extension day — you lose your queue slot.</li>
</ul>
<h2>Pattaya-specific tip</h2>
<p>Before signing a 6–12 month lease, add a clause: "Landlord agrees to file TM30 within 24 hours of tenant check-in." Agents in Naklua and Jomtien increasingly accept this — it protects both sides.</p>
<p>Stuck now? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'dtv-embassy-seasoning-2026': {
    title: 'DTV Bank Seasoning by Embassy 2026 — 3 vs 6 Month Guide',
    description:
      'DTV ฿500K seasoning requirements by embassy in 2026 — Vientiane 3 months vs Europe 6 months, statement format, rejection patterns, and Pattaya applicant checklist.',
    h1: 'DTV bank seasoning in 2026: which embassy wants 3 vs 6 months',
    lede: 'The ฿500K requirement is not the hard part — seasoning length and statement format vary by embassy and change without announcement. Here is what Pattaya applicants are seeing in mid-2026.',
    tldr: 'Plan for 6-month statements if applying in Europe or home country. Vientiane and some ASEAN posts accept 3 months. Mobile app screenshots are rejected — stamped bank letters or official PDFs with transaction history required.',
    crumbs: 'DTV Embassy Seasoning 2026',
    readMin: '5',
    date: '2026-06-02',
    body: `<p><strong>Full DTV guide:</strong> <a href="/visas/dtv/">DTV 2026</a> · <a href="/de/visas/dtv/">DTV auf Deutsch</a> · <a href="/ru/visas/dtv/">DTV на русском</a> · <a href="/tools/income-test/">Income test</a></p>
<h2>The rule vs the practice</h2>
<p>Official DTV guidance references ฿500,000 equivalent seasoned in your account. In practice, embassies interpret <strong>how many months of history</strong> differently — and they change without a Gazette notice.</p>
<h2>Embassy patterns (May 2026)</h2>
<ul>
<li><strong>Vientiane / ASEAN hubs:</strong> often 3-month statements if balance stable — popular with Pattaya-bound nomads doing visa runs.</li>
<li><strong>UK / EU / US consulates:</strong> increasingly 6-month bank history; sudden large deposits questioned.</li>
<li><strong>Moscow / Istanbul:</strong> notarised translations + 6-month statements common for Russian applicants.</li>
</ul>
<h2>Statement format that gets accepted</h2>
<ul>
<li>Official bank PDF or stamped branch letter — not app screenshots.</li>
<li>Account holder name matching passport exactly.</li>
<li>Balance shown on every month of the seasoning window.</li>
<li>Investment-only or crypto-only proof — usually rejected for DTV.</li>
</ul>
<h2>Common rejection reasons</h2>
<p><strong>Fresh lump sum.</strong> ฿500K deposited 2 weeks before application — refused even if balance is correct today.</p>
<p><strong>Wrong account type.</strong> Business account without personal guarantee letter.</p>
<p><strong>Currency conversion disputes.</strong> Embassy uses their FX rate — buffer 10% above ฿500K equivalent.</p>
<h2>Pattaya after approval</h2>
<p>Land with DTV, file TM30 within 24 hours, set 90-day reminder. First extension at Jomtien needs proof of address + TM7 — see <a href="/blog/dtv-180-day-extension-2026/">DTV 180-day extension guide</a>.</p>
<p>Not sure which embassy fits your passport + bank? <a href="/contact/">Book a consult</a> · WhatsApp +66 96 728 6999</p>`,
  },
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
  'non-o-extension-documents-2026': {
    title: 'Non-O Extension Documents 2026 — Jomtien Immigration Checklist',
    description:
      'Non-O retirement extension documents 2026 at Jomtien Immigration — bank letter, TM30, TM7, photos, income proof, and common rejection reasons in Pattaya.',
    h1: 'Non-O extension at Jomtien: document checklist for 2026',
    lede: 'Annual Non-O extensions fail at the photocopy counter — not because rules changed, but because bank letters, TM30, or outfit code slip. Here is the Pattaya checklist we use with clients.',
    tldr: 'Bring TM7, passport originals + copies, 2 photos, stamped 800k bank letter (or 65k/month income proof), TM30 receipt, lease, and map to condo. Apply 30 days before expiry. Collared shirt, long trousers — no shorts.',
    crumbs: 'Non-O Extension Documents 2026',
    readMin: '4',
    date: '2026-06-03',
    body: `<p><strong>Full guides:</strong> <a href="/visas/retirement-non-o/">Non-O retirement</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a> · <a href="/blog/jomtien-immigration-2026/">Queue times 2026</a></p>
<h2>When to apply</h2>
<p>Earliest: <strong>30 days before</strong> visa expiry. Latest: do not overstay — even 1 day triggers ฿500/day fine and extension complications.</p>
<h2>Document checklist</h2>
<ul>
<li><strong>TM7</strong> extension form — download or pick up at Jomtien</li>
<li><strong>Passport</strong> original + copy of photo page + current visa page</li>
<li><strong>2 passport photos</strong> — 4×6 cm, white background, recent</li>
<li><strong>Bank proof:</strong> stamped letter showing ฿800,000 balance OR 3 months statements + ฿65,000/month income (pension letter apostilled if from abroad)</li>
<li><strong>TM30</strong> receipt — landlord must have filed; print from tm30.immigration.go.th if needed</li>
<li><strong>Lease / yellow house book</strong> copy + map to property</li>
<li><strong>฿1,900 fee</strong> cash (amount subject to immigration notice — confirm day-of)</li>
</ul>
<h2>Top rejection reasons (Pattaya 2026)</h2>
<p><strong>Mobile banking screenshot</strong> instead of stamped bank letter — refused.</p>
<p><strong>Missing TM30</strong> — see <a href="/blog/tm30-landlord-refusal-2026/">TM30 landlord refusal guide</a>.</p>
<p><strong>Wrong queue</strong> — 90-day reports are Building A; extensions different window — ask security first.</p>
<p><strong>Dress code</strong> — shorts and sandals = turned away, lose queue position.</p>
<h2>After approval</h2>
<p>Photograph new stamp. Set reminder: next extension ~11 months, 90-day report separate cycle. Use <a href="/tools/expiry-countdown/">expiry countdown tool</a>.</p>
<p>Need doc review before you queue? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
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
