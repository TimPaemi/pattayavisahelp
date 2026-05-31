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
  'ed-visa-moe-accreditation-2026': {
    title: 'ED Visa MOE Accreditation Check 2026 — Avoid Fake Schools',
    description:
      'Verify MOE-accredited ED visa schools in Thailand 2026 — moe.go.th check, Pattaya language schools, rejection patterns, and switching schools mid-study.',
    h1: 'ED visa in 2026: how to verify MOE accreditation before you pay',
    lede: 'Fake ED schools still sell ฿40K packages in Pattaya. Immigration cross-checks MOE lists — unaccredited schools mean refused extensions and overstay risk.',
    tldr: 'Search school name on moe.go.th accredited list before enrolling. ED visa is for study only — working on ED is illegal. Switch schools only with proper transfer paperwork or you lose extension eligibility.',
    crumbs: 'ED Visa MOE Accreditation 2026',
    readMin: '4',
    date: '2026-06-04',
    body: `<p><strong>Full guides:</strong> <a href="/guides/verify-moe-accredited-school/">Verify MOE school</a> · <a href="/visas/education-ed/">ED visa 2026</a> · <a href="/guides/switch-ed-to-dtv/">Switch ED to DTV</a></p>
<h2>Why accreditation matters</h2>
<p>Thailand ED visas require enrollment at a <strong>Ministry of Education accredited institution</strong>. Immigration verifies against MOE records at extension time — not at first entry. Pattaya has legitimate language schools and operators selling packages with no real classes.</p>
<h2>How to verify (5 minutes)</h2>
<ol>
<li>Get exact legal school name from contract — not marketing brand.</li>
<li>Search <strong>moe.go.th</strong> accredited institution database (or our <a href="/guides/verify-moe-accredited-school/">step-by-step guide</a>).</li>
<li>Confirm school address matches where you will attend classes.</li>
<li>Ask for past immigration extension approval letters (redacted) from current students.</li>
</ol>
<h2>Red flags in Pattaya 2026</h2>
<ul>
<li>"No attendance required" — immigration audits increased in 2025–2026.</li>
<li>Cash-only, no MOE registration number on contract.</li>
<li>School cannot produce CM form or enrollment letter on official letterhead.</li>
</ul>
<h2>Switching schools</h2>
<p>Mid-study transfers need MOE transfer approval + new enrollment docs before next extension. Many holders switch to <a href="/visas/dtv/">DTV</a> if they qualify — see <a href="/guides/switch-ed-to-dtv/">ED to DTV guide</a>.</p>
<p>Need school vetting before you pay? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'privilege-elite-renewal-2026': {
    title: 'Thailand Privilege Elite Renewal 2026 — Upgrade, Downgrade, Timeline',
    description:
      'Privilege Elite renewal and tier changes in 2026 — when to apply, points transfer, downgrade to lower tier, and what happens if you let membership lapse.',
    h1: 'Privilege Elite renewal in 2026: tiers, timing, and downgrade options',
    lede: 'Elite members who miss the renewal window lose fast-track immigration perks and can face re-entry complications. Here is the 2026 renewal calendar we track for Pattaya clients.',
    tldr: 'Contact Thailand Privilege 90 days before expiry. Upgrades require top-up payment; downgrades may forfeit unused years depending on contract. Keep re-entry permit valid if you travel — Elite does not replace immigration compliance.',
    crumbs: 'Privilege Elite Renewal 2026',
    readMin: '4',
    date: '2026-06-05',
    body: `<p><strong>Full guide:</strong> <a href="/visas/privilege-elite/">Privilege Elite 2026</a> · <a href="/de/visas/privilege-elite/">Privilege auf Deutsch</a> · <a href="/compare/privilege-vs-ltr/">Privilege vs LTR</a></p>
<h2>When renewal starts</h2>
<p>Thailand Privilege sends renewal notices ~90 days before membership end. Do not wait until last week — tier changes and payment clearance take 2–4 weeks.</p>
<h2>Upgrade vs downgrade</h2>
<p><strong>Upgrade</strong> (Bronze → Gold etc.): pay difference, new validity from approval date.</p>
<p><strong>Downgrade</strong>: possible in some cases but you may lose unused premium years — read contract before signing original tier.</p>
<h2>Immigration compliance still applies</h2>
<p>Elite fast-track is not a visa by itself — you still need valid visa stamp, TM30, 90-day reports, and re-entry permit if leaving Thailand on long-stay visas. See <a href="/guides/re-entry-permits/">re-entry permit guide</a>.</p>
<h2>Considering switch to LTR or DTV?</h2>
<p>High-income retirees sometimes move Elite → LTR for Royal Decree 743 tax benefits. Nomads on Elite tourist-style stays often switch to DTV — run <a href="/tools/visa-finder/">visa finder</a>.</p>
<p>Renewal questions? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  're-entry-permit-pattaya-2026': {
    title: 'Re-Entry Permit Pattaya 2026 — Jomtien Single vs Multiple',
    description:
      'Re-entry permit Thailand 2026 at Jomtien Immigration — single ฿1,000 vs multiple ฿3,800, when you need it, and what happens if you leave without one.',
    h1: 'Re-entry permits in Pattaya: single vs multiple before you fly',
    lede: 'Leave Thailand on a valid extension without a re-entry permit and your stay is cancelled — even with 8 months left. Jomtien handles this daily for retirees and DTV holders.',
    tldr: 'Apply before travel at Jomtien with TM8 form, passport, photo, cash. Single ฿1,000 for one trip; multiple ฿3,800 if you travel often. Must still be valid on return — check expiry date on permit sticker.',
    crumbs: 'Re-Entry Permit Pattaya 2026',
    readMin: '4',
    date: '2026-06-05',
    body: `<p><strong>Full guide:</strong> <a href="/guides/re-entry-permits/">Re-entry permits complete guide</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a> · <a href="/glossary/re-entry-permit/">Glossary</a></p>
<h2>Who needs one</h2>
<p>Anyone on a <strong>visa extension</strong> (Non-O, Marriage, ED, etc.) planning to leave and return before extension expiry. DTV multi-entry holders re-enter on DTV stamp — different rules; confirm your stamp type.</p>
<h2>Single vs multiple</h2>
<ul>
<li><strong>Single (฿1,000):</strong> one exit and re-entry before permit expiry (usually 1 year).</li>
<li><strong>Multiple (฿3,800):</strong> unlimited exits/re-entries until permit expiry — worth it if you fly quarterly.</li>
</ul>
<h2>Jomtien checklist</h2>
<p>TM8 form, passport original + copy, 1 photo, cash. Same dress code as extensions — no shorts. Allow 30–60 minutes unless queue is heavy.</p>
<h2>What if you forgot</h2>
<p>Your extension is voided when you exit. Re-enter on tourist or new visa — expensive mistake. Some border runs do not fix cancelled extensions.</p>
<p>Travel soon? <a href="/contact/">Book doc check</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'ltr-boi-application-checklist-2026': {
    title: 'LTR BOI Application Checklist 2026 — Documents & Timeline',
    description:
      'LTR visa BOI application checklist 2026 — Wealthy Pensioner, WGC, Work-from-Thailand categories, document list, processing time, and common BOI rejection reasons.',
    h1: 'LTR BOI application in 2026: document checklist before you pay USD 50K insurance',
    lede: 'BOI rejects incomplete LTR packages more often than immigration rejects the visa itself. Here is the 2026 document set we pre-check for Pattaya applicants.',
    tldr: 'Category letter, passport, proof of income/assets per category, USD 50K health insurance, clean criminal record (some categories), BOI fee. Processing 1–3 months. Activate visa within 1 year of approval.',
    crumbs: 'LTR BOI Checklist 2026',
    readMin: '5',
    date: '2026-06-05',
    body: `<p><strong>Full guides:</strong> <a href="/visas/ltr/">LTR 2026</a> · <a href="/blog/ltr-royal-decree-743-2026/">Royal Decree 743</a> · <a href="/compare/dtv-vs-ltr/">DTV vs LTR</a></p>
<h2>Pick your category first</h2>
<ul>
<li><strong>Wealthy Pensioner (W):</strong> 50+, passive income + insurance</li>
<li><strong>Wealthy Global Citizen (WGC):</strong> USD 1M+ assets + USD 80K/year income</li>
<li><strong>Work-from-Thailand Professional (T):</strong> remote employment, employer docs</li>
<li><strong>Highly-Skilled Professional (H):</strong> Thai employer — 17% tax cap, no RD 743 foreign income</li>
</ul>
<h2>Universal documents</h2>
<p>Passport (18+ months validity), photo, health insurance USD 50K+, BOI application form, category-specific financial proof, criminal record (category-dependent).</p>
<h2>After BOI approval</h2>
<p>Apply LTR visa at Thai consulate or immigration. Activate within 1 year. File Royal Decree 743 separately if W/WGC/T — not automatic. See <a href="/blog/ltr-royal-decree-743-2026/">RD 743 guide</a>.</p>
<h2>Common rejections</h2>
<p>Wrong category fit, crypto-only assets without bank trail, insurance policy not meeting BOI wording, incomplete employer letters for T category.</p>
<p>Pre-check before BOI fees? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'marriage-non-o-documents-2026': {
    title: 'Marriage Non-O Extension Documents 2026 — Pattaya Checklist',
    description:
      'Marriage Non-O visa extension documents 2026 in Pattaya — Thai spouse ID, house registration, income proof, TM30, and Jomtien rejection patterns.',
    h1: 'Marriage Non-O extension: document checklist for 2026',
    lede: 'Marriage Non-O extensions need Thai spouse present or documented — plus house book, marriage certificate, and financial proof. Pattaya immigration is strict on outdated marriage certs.',
    tldr: 'Bring TM7, passport, marriage cert (original + copy), Thai spouse ID + tabien baan, ฿400K bank or ฿40K/month income proof, TM30, map. Thai spouse may need to attend. Apply 30 days before expiry.',
    crumbs: 'Marriage Non-O Documents 2026',
    readMin: '4',
    date: '2026-06-06',
    body: `<p><strong>Full guides:</strong> <a href="/visas/marriage-non-o/">Marriage Non-O</a> · <a href="/guides/foreign-marriage-legalisation/">Foreign marriage legalisation</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a></p>
<h2>Core documents</h2>
<ul>
<li><strong>TM7</strong> + passport + visa page copies</li>
<li><strong>Marriage certificate</strong> — Kor Ror / foreign cert legalised if married abroad</li>
<li><strong>Thai spouse ID</strong> + copy + house registration (tabien baan)</li>
<li><strong>Financial proof:</strong> ฿400,000 balance OR ฿40,000/month combined income</li>
<li><strong>TM30</strong> + lease/map</li>
<li><strong>2 photos</strong></li>
</ul>
<h2>Pattaya-specific issues</h2>
<p><strong>Foreign marriage cert not legalised</strong> — must be translated + legalised at home country embassy before Thai MFA chain.</p>
<p><strong>Spouse not on house book</strong> — immigration wants proof of shared address.</p>
<p><strong>Using tourist entry to "switch"</strong> — marriage Non-O from TR needs consulate route first in most cases.</p>
<h2>Path to PR</h2>
<p>After years on Marriage Non-O, PR may be possible — see <a href="/guides/marriage-non-o-to-pr/">Marriage Non-O to PR guide</a>.</p>
<p>Doc review before Jomtien? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'work-permit-renewal-pattaya-2026': {
    title: 'Work Permit Renewal Pattaya 2026 — Docs & Timeline',
    description:
      'Work permit renewal in Pattaya/Chonburi 2026 — 90-day deadline, employer docs, visa sync, Department of Employment checklist, and common delays.',
    h1: 'Work permit renewal in Pattaya: 2026 timeline and documents',
    lede: 'Work permits expire independently of your visa — miss renewal by 90 days and you restart from scratch with a new Non-B. Pattaya employers often underestimate the lead time.',
    tldr: 'Start 60–90 days before WP expiry. Employer submits to Department of Employment with company docs, your passport, medical cert, photos. Visa must remain valid — sync Non-B extension with WP renewal.',
    crumbs: 'Work Permit Renewal Pattaya 2026',
    readMin: '4',
    date: '2026-06-06',
    body: `<p><strong>Full guides:</strong> <a href="/work-permit/">Work permit overview</a> · <a href="/visas/business-non-b/">Non-B visa</a> · <a href="/guides/working-in-thailand/">Working in Thailand</a></p>
<h2>Timeline</h2>
<p>Renew within <strong>90 days before</strong> expiry — ideally 60 days. Late renewal within 90-day grace still possible with fines; after expiry + 90 days = new application.</p>
<h2>Employer documents</h2>
<ul>
<li>Company affidavit + VAT + social security filings</li>
<li>Thai staff ratio compliance (varies by business type)</li>
<li>Letter confirming continued employment + salary</li>
</ul>
<h2>Your documents</h2>
<p>Passport + valid Non-B, medical certificate (some offices), photos, TM30, previous work permit booklet.</p>
<h2>Visa sync</h2>
<p>Non-B extension and WP renewal should align — immigration and DOE do not auto-sync. We see Pattaya cases where WP renewed but visa expired first.</p>
<p>Employer need a checklist? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'o-a-health-insurance-2026': {
    title: 'O-A Health Insurance 2026 — THB 3M Requirement Explained',
    description:
      'O-A retirement visa health insurance 2026 — THB 3 million coverage rule, approved insurers, embassy vs immigration checks, and Pattaya retiree mistakes.',
    h1: 'O-A health insurance in 2026: the THB 3M rule that blocks embassy approval',
    lede: 'O-A applicants must show THB 3 million annual health coverage before travel — but not every travel policy qualifies. Embassy officers reject ambiguous wording weekly.',
    tldr: 'Policy must explicitly meet THB 3,000,000 inpatient coverage for Thailand. Travel insurance often rejected — use O-A-specific Thai or international policies listed by embassy. Non-O in-country does NOT require this — common confusion.',
    crumbs: 'O-A Health Insurance 2026',
    readMin: '4',
    date: '2026-06-07',
    body: `<p><strong>Guides:</strong> <a href="/visas/retirement-o-a/">O-A retirement visa</a> · <a href="/guides/health-insurance/">Health insurance guide</a> · <a href="/compare/non-o-vs-o-a/">Non-O vs O-A</a></p>
<h2>The requirement</h2>
<p>O-A visa applicants (50+, applying at embassy before travel) must hold health insurance with <strong>THB 3 million inpatient coverage</strong> valid in Thailand for the application period.</p>
<h2>What gets rejected</h2>
<ul>
<li>Travel policies capped at USD 100K without THB equivalent clause</li>
<li>Policies excluding Thailand or age 50+</li>
<li>Screenshot without certificate of coverage letter</li>
</ul>
<h2>O-A vs Non-O confusion</h2>
<p><strong>Non-O</strong> extensions in Pattaya do not legally require THB 3M insurance — but we still recommend cover. <strong>O-A</strong> is stricter at embassy stage.</p>
<p>Need policy review before embassy? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'tourist-visa-extension-2026': {
    title: 'Tourist Visa Extension 2026 — 30 Days at Immigration Pattaya',
    description:
      'Tourist visa extension Thailand 2026 — one 30-day extension at immigration, TM7, fee, TM30, and when to switch to DTV or Non-O instead.',
    h1: 'Tourist visa extension in 2026: one 30 days, then you need a real visa',
    lede: 'TR tourist entries get one 30-day extension in-country — not renewable forever. Pattaya immigration sees tourists trying third extensions via visa runs; rules tightened in 2025–2026.',
    tldr: 'Apply before expiry at Jomtien with TM7, passport, photo, TM30, ฿1,900 fee (confirm day-of). One extension only per entry. Long-stay = plan DTV, ED, or Non-O before tourist time runs out.',
    crumbs: 'Tourist Extension 2026',
    readMin: '4',
    date: '2026-06-07',
    body: `<p><strong>Guides:</strong> <a href="/visas/tourist-tr-evisa/">Tourist TR visa</a> · <a href="/guides/visa-runs-vs-extensions/">Visa runs vs extensions</a> · <a href="/visas/dtv/">DTV</a></p>
<h2>Who qualifies</h2>
<p>Valid TR tourist stamp or tourist visa — not visa-exempt entries in all cases; confirm your stamp type at Jomtien before queueing.</p>
<h2>Documents</h2>
<p>TM7, passport, photo, TM30, cash fee, proof of onward travel sometimes requested.</p>
<h2>After the 30 days</h2>
<p>Exit and re-enter, or switch visa category from abroad. DTV from home country increasingly popular for Pattaya-bound nomads — see <a href="/blog/dtv-embassy-seasoning-2026/">DTV seasoning guide</a>.</p>
<p>Stuck on tourist time? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999</p>`,
  },
  'dtv-tax-residency-2026': {
    title: 'DTV Tax Residency 2026 — When Remote Workers Owe Thai Tax',
    description:
      'DTV visa tax residency Thailand 2026 — 180-day rule, foreign income remittance tax, Royal Decree 743 exclusion, and Pattaya nomad structuring.',
    h1: 'DTV and Thai tax in 2026: no RD 743 escape hatch for nomads',
    lede: 'DTV does not include Royal Decree 743 relief. Remote workers who become tax residents and remit income to Thailand face remittance tax since 2024 — enforcement is real in 2026.',
    tldr: '180+ days in Thailand = tax resident for most practical purposes. DTV foreign income remitted to Thai banks is taxable unless kept offshore. LTR W/WGC/T categories differ — DTV is not LTR. Get accountant advice before remitting large sums.',
    crumbs: 'DTV Tax Residency 2026',
    readMin: '5',
    date: '2026-06-07',
    body: `<p><strong>Guides:</strong> <a href="/visas/dtv/">DTV 2026</a> · <a href="/guides/thai-tax-foreign-residents/">Thai tax for foreign residents</a> · <a href="/blog/ltr-royal-decree-743-2026/">Royal Decree 743</a></p>
<h2>DTV ≠ tax-free</h2>
<p>Marketing conflates DTV with LTR tax perks. <strong>DTV holders cannot claim Royal Decree 743.</strong> Remote work for foreign employers is still assessable if you are tax resident and remit to Thailand.</p>
<h2>180-day residency</h2>
<p>Spend 180+ days per calendar year in Thailand and you likely trigger tax residency — bank remittance reporting increased 2025–2026.</p>
<h2>Structuring options (high level)</h2>
<ul>
<li>Keep salary offshore + spend from foreign cards (legal grey — get accountant)</li>
<li>Qualify for LTR T category if income/assets fit</li>
<li>Limit days in-country below residency threshold (not practical for Pattaya residents)</li>
</ul>
<p>Tax structure review? <a href="/contact/">Contact us</a> · WhatsApp +66 96 728 6999 · not tax advice</p>`,
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
