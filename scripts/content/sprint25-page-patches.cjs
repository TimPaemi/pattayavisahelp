/** Sprint 25 — content fills for empty sections and callout fixes. */
module.exports = {
  '/guides/thai-bank-account-as-foreigner/': {
    intro: `<p><strong>Related:</strong> <a href="/guides/jomtien-immigration-office/">Certificate of Residence (Jomtien)</a> · <a href="/visas/retirement-non-o/">Retirement Non-O</a> · <a href="/visas/dtv/">DTV</a> · <a href="/banking/">Banking hub</a> · <a href="/contact/">Free consultation</a></p>

<p><strong>Quick reference:</strong> Bangkok Bank Beach Road and Bangkok Bank Jomtien are the default for Pattaya expats. Bring passport, long-stay visa, TM30, proof of address, and a Thai SIM. Retirement extensions need 800,000 THB seasoned 2 months at Jomtien before your appointment.</p>

`,
    start: /<h2>Which Thai bank for foreigners\?<\/h2>/,
    fills: [
      {
        after: /<h3>For DTV holders<\/h3>\s*\n\s*\n/,
        content: `<h3>For DTV holders</h3>
<ul>
 <li>Same base stack as other long-stay visas — passport, DTV stamp, TM30, proof of address, Thai SIM</li>
 <li>Many branches treat DTV as tourist and refuse; a guarantee letter from an accredited Thai institution (Muay Thai gym, culinary school, MOE language school) plus a <a href="/guides/jomtien-immigration-office/">Certificate of Residence from Jomtien</a> is the usual workaround package</li>
 <li>Try Bangkok Bank Jomtien or Kasikorn Beach Road first; if refused, try another branch of the same bank before giving up</li>
 <li>Wise or Revolut with a THB balance covers daily spending while you resolve a Thai account — not a substitute for retirement seasoning</li>
</ul>

`,
      },
      {
        after: /<h3>For LTR \/ Privilege \/ SMART holders<\/h3>\s*\n\s*\n/,
        content: `<h3>For LTR / Privilege / SMART holders</h3>
<ul>
 <li>BOI-issued LTR letter or SMART endorsement letter alongside passport and visa stamp</li>
 <li>Privilege Elite: membership letter from TAT/Elite office — accepted at Bangkok Bank and Kasikorn premium desks</li>
 <li>Standard minimum deposit (500–1,000 THB); no special seasoning unless you also use the account for retirement-style visa evidence</li>
 <li>Some Bangkok Bank branches offer priority counters for Elite holders — ask at the greeter desk</li>
</ul>

`,
      },
    ],
  },

  '/blog/tdac-step-by-step/': {
    replacements: [
      [
        /Timing matters\nYou can only submit within 72 hours \(3 days\) before arrival\. Earlier than that, the form rejects you\. Best practice: do it the day before you fly\./,
        `<p><strong>Timing matters:</strong> You can only submit within 72 hours (3 days) before arrival. Earlier than that, the form rejects you. Best practice: do it the day before you fly.</p>`,
      ],
    ],
  },

  '/blog/2026-thailand-visa-changes-recap/': {
    replacements: [
      [
        /Important\nThe TDAC is single-use\. Every time you cross the border into Thailand — whether by plane, land, or sea — you need a fresh TDAC\. If you do a Cambodia border bounce, you submit a new TDAC for the return entry\. Long-stay residents leaving and re-entering still submit each time\./,
        `<p><strong>Important:</strong> The TDAC is single-use. Every time you cross the border into Thailand — whether by plane, land, or sea — you need a fresh TDAC. If you do a Cambodia border bounce, you submit a new TDAC for the return entry. Long-stay residents leaving and re-entering still submit each time.</p>`,
      ],
      [
        /<h3>What happens if you don't have one<\/h3>\s*\n\s*\n/,
        `<h3>What happens if you don't have one</h3>
<p>Airlines increasingly check TDAC before boarding — you can be refused check-in without a valid QR code. At Thai immigration, officers may direct you to a kiosk to complete it on the spot (expect a 10–20 minute delay). Do not rely on last-minute completion — submit within 72 hours before departure. See our <a href="/blog/tdac-step-by-step/">TDAC step-by-step guide</a>.</p>

`,
      ],
    ],
  },

  '/guides/90-day-reporting/': {
    replacements: [
      [
        /<p>TDAC matters now<\/p>\s*\n/,
        `<p><strong>TDAC matters now:</strong></p>\n`,
      ],
    ],
  },

  '/guides/embassy-directory/': {
    replacements: [
      [
        /Important\nEmbassy details change\.[\s\S]*?where you apply\)\./,
        `<p><strong>Important:</strong> Embassy details change. Always verify current requirements, hours, and processing times on the embassy's official website before traveling. Some embassies require appointments; some accept walk-ins. Some now refuse visa applications from non-residents (you must be a resident of the country where you apply).</p>`,
      ],
    ],
  },

  '/guides/driving-licence-thailand/': {
    replacements: [
      [
        /<h3>UK licence holders<\/h3>\s*\n\s*\n/,
        `<h3>UK licence holders</h3>
<p>UK photocard licences convert directly at Pattaya DLT with residence certificate, medical certificate, and ฿205 fee — same process as EU holders. An International Driving Permit (IDP) from the Post Office is useful supplementary ID but does not replace the UK licence for conversion.</p>

`,
      ],
    ],
  },

  '/guides/verify-moe-accredited-school/': {
    replacements: [
      [
        /<h3>1\. Get the school's official MOE registration number<\/h3>\s*\n\s*\n/,
        `<h3>1. Get the school's official MOE registration number</h3>
<p>Ask the school for their MOE registration number and a copy of their current BT5 authorisation certificate. Legitimate schools provide both immediately. If they refuse or stall, walk away.</p>

`,
      ],
    ],
  },

  '/guides/foreign-marriage-legalisation/': {
    replacements: [
      [
        /<h3>Step 1: Get an Apostille on the marriage certificate<\/h3>\s*\n\s*\n/,
        `<h3>Step 1: Get an Apostille on the marriage certificate</h3>
<p>Request an apostille from your country's designated authority (UK: FCDO Legalisation Office; US: state Secretary of State; Australia: DFAT). Allow 1–4 weeks depending on country and service level. The apostille certifies the marriage certificate for international use.</p>

`,
      ],
      [
        /<h3>Step 2: Translate to Thai by a certified translator<\/h3>\s*\n\s*\n/,
        `<h3>Step 2: Translate to Thai by a certified translator</h3>
<p>Have the apostilled certificate translated into Thai by an MFA-registered translator. Pattaya agencies charge 500–2,000 THB per document; turnaround 2–7 days. Keep the original apostille with the translator's certification stamp.</p>

`,
      ],
    ],
  },

  '/guides/visa-overstay-penalties/': {
    replacements: [
      [
        / Read this first\n <strong>Overstaying voids your visa immediately\.<\/strong> Re-entry permits don't help\. Tourist visa-exempt entries don't help\. There is no grace period\. The clock starts the day after your stamp expires\./,
        `<p><strong>Read this first:</strong> <strong>Overstaying voids your visa immediately.</strong> Re-entry permits don't help. Tourist visa-exempt entries don't help. There is no grace period. The clock starts the day after your stamp expires.</p>`,
      ],
      [
        /<h2>Self-report vs caught: huge difference<\/h2>\s*\n\s*\n If you have overstayed\n <h2>Real overstay scenarios/,
        `<h2>Self-report vs caught: huge difference</h2>
<p><strong>Self-reporting</strong> means walking into immigration or declaring at the airport exit before an officer catches you. You pay the calculated fine, receive an exit stamp (usually 7 days to leave), and — if under 90 days — no blacklist.</p>
<p><strong>Being caught</strong> means a police check, hotel ID flag, or immigration discovering the overstay before you report it. Same fine cap, but mandatory blacklist tiers apply, plus possible criminal charges and IDC detention for long overstays.</p>
<p><strong>If you have overstayed:</strong> Go to Jomtien Immigration or your nearest exit point immediately. The scenarios below show how fines and blacklists typically play out.</p>

<h2>Real overstay scenarios`,
      ],
      [
        /<h3>Scenario 1: Forgetful tourist, 3-day overstay, self-discovers at airport<\/h3>\s*\n\s*\n/,
        `<h3>Scenario 1: Forgetful tourist, 3-day overstay, self-discovers at airport</h3>
<p>Tourist realizes at Suvarnabhumi check-in that their visa-exempt stamp expired 3 days ago. They go to the immigration desk before check-in, pay ฿1,500 (3 × ฿500), receive an exit stamp, and fly out same day. No blacklist — under 90 days and self-reported.</p>

`,
      ],
    ],
  },
};
