/**
 * Sprint 30 — healthcare hub expansion, FAQ schema, read-time sync on substantive hubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const HEALTH_FAQ_BLOCK = `
<h2>Pharmacies and prescriptions</h2>
<p>Chain pharmacies (Boots, Watsons, Fascino) and independent shops are everywhere in Central Pattaya and Jomtien. Most common medications are available over the counter at lower prices than Western countries. Bring a copy of your home prescription for chronic medications — a Pattaya physician can issue a Thai prescription if the drug is controlled or not stocked OTC. For specialist medications, BHP pharmacy can source imports within a few days.</p>

<h2>Emergency numbers and ambulance</h2>
<p><strong>Tourist Police:</strong> 1155 (English available). <strong>Emergency ambulance:</strong> 1669 (national) or call BHP emergency directly at +66 38 259 999. <strong>Fire:</strong> 199. Save your condo address in Thai script on your phone — ambulance crews rely on it. For serious trauma, BHP emergency is the default for expats; PIH for minor urgent care if closer. Travel insurance or Thai hospital membership cards often include ambulance coordination — activate that line before calling a random taxi.</p>

<h2>FAQ</h2>
<p><strong>Do I need health insurance on a DTV?</strong> Not legally required for the visa itself, but uninsured hospitalisation at BHP can exceed ฿500,000 for surgery or cardiac care. Treat comprehensive cover as mandatory regardless of visa type.</p>
<p><strong>Which Pattaya hospital is best for emergencies?</strong> Bangkok Hospital Pattaya for serious emergencies and specialist care; Pattaya International Hospital for faster routine outpatient visits when BHP queues are long.</p>
<p><strong>Can I use UK or EU insurance at Thai private hospitals?</strong> Many international policies work if they include Thailand and the hospital is on-panel — confirm with BUPA, Cigna, or Allianz before treatment. Cash pay plus reimbursement is common when panels do not match.</p>
`;

const HEALTH_FAQ_SCHEMA = `    {
      "@type": "FAQPage",
      "@id": "https://pattayavisahelp.com/healthcare/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need health insurance on a DTV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not legally required for the DTV visa itself, but uninsured hospitalisation at Bangkok Hospital Pattaya can exceed 500,000 THB for surgery or cardiac care. Treat comprehensive cover as mandatory regardless of visa type."
          }
        },
        {
          "@type": "Question",
          "name": "Which Pattaya hospital is best for emergencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bangkok Hospital Pattaya for serious emergencies and specialist care; Pattaya International Hospital for faster routine outpatient visits when BHP queues are long."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use UK or EU insurance at Thai private hospitals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Many international policies work if they include Thailand and the hospital is on-panel. Confirm with BUPA, Cigna, or Allianz before treatment. Cash pay plus reimbursement is common when panels do not match."
          }
        }
      ]
    }`;

const RETIRE_FAQ_BLOCK = `
<h2>FAQ</h2>
<p><strong>What is the cheapest retirement visa for Pattaya?</strong> Non-O retirement (800k seasoning or 65k/month income proof) is the lowest official cost. O-A adds mandatory insurance premiums. Privilege and LTR are premium tiers for higher budgets.</p>
<p><strong>Can I retire in Pattaya on ฿40,000 per month?</strong> Possible in a studio in Jomtien with local food and no car, but most comfortable retirees budget ฿55,000–฿80,000 including insurance, visa amortisation, and occasional Bangkok medical visits.</p>
<p><strong>Do I need to learn Thai to retire in Pattaya?</strong> No for daily life in expat areas — English works in hospitals, immigration queues, and most services. Basic Thai helps for government hospital visits, landlord TM30, and better pricing at local markets.</p>
`;

const RETIRE_FAQ_SCHEMA = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the cheapest retirement visa for Pattaya?","acceptedAnswer":{"@type":"Answer","text":"Non-O retirement with 800k bank seasoning or 65k/month income proof is the lowest official cost. O-A adds mandatory insurance. Privilege and LTR are premium tiers."}},{"@type":"Question","name":"Can I retire in Pattaya on 40,000 THB per month?","acceptedAnswer":{"@type":"Answer","text":"Possible in a Jomtien studio with local food and no car, but most comfortable retirees budget 55,000–80,000 THB including insurance and visa costs."}},{"@type":"Question","name":"Do I need to learn Thai to retire in Pattaya?","acceptedAnswer":{"@type":"Answer","text":"No for daily expat life — English works in private hospitals and most services. Basic Thai helps for TM30, government hospitals, and local market pricing."}}]}
</script>
`;

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function runContentPatches() {
function mainWords(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return 0;
  return m[1].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function readMinutes(wc) {
  return Math.max(2, Math.min(12, Math.round(wc / 200)));
}

// Healthcare hub
const hcFile = urlToFile('/healthcare/');
let hc = fs.readFileSync(hcFile, 'utf8');
hc = hc.replace(/<span class="read">1 MIN READ<\/span>/, '<span class="read">4 MIN READ</span>');
if (!hc.includes('<h2>Pharmacies and prescriptions</h2>')) {
  hc = hc.replace(
    '<p><strong>Free 15-min consultation</strong></p>\n<h2>Want a personal answer?</h2>',
    HEALTH_FAQ_BLOCK.trim() + '\n<p><strong>Free 15-min consultation</strong></p>\n<h2>Want a personal answer?</h2>'
  );
}
if (!hc.includes('"@type": "FAQPage"') && hc.includes('"@graph": [')) {
  hc = hc.replace(
    '    {\n      "@type": "BreadcrumbList",',
    HEALTH_FAQ_SCHEMA + ',\n    {\n      "@type": "BreadcrumbList",'
  );
}
fs.writeFileSync(hcFile, hc);
console.log('healthcare hub expanded');

// Retiring guide FAQ + schema
const retFile = urlToFile('/guides/retiring-in-thailand/');
let ret = fs.readFileSync(retFile, 'utf8');
if (!ret.includes('<h2>FAQ</h2>')) {
  ret = ret.replace(
    '<h2>Want a personal answer?</h2>',
    RETIRE_FAQ_BLOCK.trim() + '\n<h2>Want a personal answer?</h2>'
  );
}
if (!ret.includes('"@type":"FAQPage"') && !ret.includes('"@type": "FAQPage"')) {
  ret = ret.replace('</script>\n<link rel="preconnect"', RETIRE_FAQ_SCHEMA + '\n<link rel="preconnect"');
}
const retWc = mainWords(ret);
ret = ret.replace(/<span class="read">\d+ MIN READ<\/span>/, `<span class="read">${readMinutes(retWc)} MIN READ</span>`);
fs.writeFileSync(retFile, ret);
console.log('retiring guide FAQ + read time');

// Sync read times on substantive hubs still showing 1 MIN
const HUBS = [
  '/healthcare/',
  '/property/',
  '/digital-nomad/',
  '/coworking/',
  '/tax/',
  '/retirement/',
  '/services/',
  '/case-studies/',
  '/pattaya/living-in-pattaya/',
  '/pattaya-digital-nomad-guide/',
];
for (const route of HUBS) {
  const file = urlToFile(route);
  if (!fs.existsSync(file)) continue;
  let h = fs.readFileSync(file, 'utf8');
  if (!h.includes('1 MIN READ')) continue;
  const wc = mainWords(h);
  if (wc < 400) continue;
  const mins = readMinutes(wc);
  h = h.replace(/<span class="read">1 MIN READ<\/span>/, `<span class="read">${mins} MIN READ</span>`);
  fs.writeFileSync(file, h);
  console.log('read time', route, mins + ' MIN');
}
}

module.exports = { NETWORK_CSS, runContentPatches };

if (require.main === module) {
  runContentPatches();
}
