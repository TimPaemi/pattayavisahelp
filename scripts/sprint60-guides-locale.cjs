/**
 * Sprint 60 — EN guides link DE/RU hubs and relevant pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES = path.join(ROOT, 'guides');

const DEFAULT = [
  ['/de/guides/', 'Guides (DE)'],
  ['/ru/guides/', 'Guides (RU)'],
  ['/de/visas/', 'Visas (DE)'],
  ['/de/pattaya/', 'Pattaya (DE)'],
];

const MAP = {
  '90-day-reporting': [
    ['/glossary/90-day-report/', 'Glossary'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
  ],
  'tm30-reporting': [
    ['/glossary/tm30/', 'TM30 term'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/blog/tm30-landlord-refusal-2026/', 'TM30 blog'],
  ],
  're-entry-permits': [
    ['/glossary/re-entry-permit/', 'Glossary'],
    ['/de/visas/', 'Visas (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'jomtien-immigration-office': [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/ru/pattaya/', 'Pattaya (RU)'],
    ['/de/visas/', 'Visas (DE)'],
    ['/blog/jomtien-immigration-2026/', 'Jomtien blog'],
  ],
  'visa-scams-pattaya': [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/ru/pattaya/', 'Pattaya (RU)'],
    ['/contact/', 'Consult'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'cost-of-living-pattaya': [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/pattaya/living-in-pattaya/', 'Living EN'],
    ['/tools/cost-calculator/', 'Calculator'],
  ],
  'retiring-in-thailand': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/ru/visas/retirement-non-o/', 'Non-O (RU)'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/de/best-visa/under-100k/', 'Comfort tier'],
  ],
  'health-insurance': [
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
    ['/de/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/guides/retiring-in-thailand/', 'Retiring'],
  ],
  'foreign-marriage-legalisation': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/ru/visas/marriage-non-o/', 'Marriage (RU)'],
    ['/de/compare/marriage-vs-retirement/', 'vs Retirement'],
    ['/blog/marriage-non-o-documents-2026/', 'Docs blog'],
  ],
  'marriage-non-o-to-pr': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/guides/permanent-residency-thailand/', 'PR guide'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  'switch-ed-to-dtv': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/guides/verify-moe-accredited-school/', 'MOE schools'],
  ],
  'switch-tourist-to-non-o-retirement': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs EN'],
    ['/de/best-visa/under-50k/', 'Mid budget'],
  ],
  'switch-non-b-to-ltr': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/tools/eligibility/', 'LTR tool'],
  ],
  'best-visa-digital-nomads': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/ru/visas/dtv/', 'DTV (RU)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/digital-nomad/', 'Nomad hub'],
  ],
  'best-visa-retirees-over-50': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/best-visa/under-100k/', 'Comfort tier'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'best-visa-families': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/guides/bringing-family-to-thailand/', 'Family EN'],
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
  ],
  'best-visa-couples': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/compare/marriage-vs-retirement/', 'Marriage vs retire'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'best-visa-remote-tech-workers': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/de/professions/saas-founder/', 'SaaS (DE)'],
    ['/de/compare/dtv-vs-smart/', 'DTV vs SMART'],
  ],
  'thai-tax-foreign-residents': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/glossary/royal-decree-743/', 'RD743'],
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/blog/dtv-tax-residency-2026/', 'DTV tax blog'],
  ],
  'thai-bank-account-as-foreigner': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/tools/bank-checker/', 'Bank checker'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
  ],
  'verify-moe-accredited-school': [
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/blog/ed-visa-moe-accreditation-2026/', 'MOE blog'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  'visa-runs-vs-extensions': [
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/de/visas/dtv/', 'DTV upgrade'],
    ['/blog/30-day-visa-exempt-rollback/', 'Rollback blog'],
    ['/de/best-visa/under-5k/', 'Shoestring'],
  ],
  'visa-overstay-penalties': [
    ['/glossary/overstay/', 'Overstay term'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/contact/', 'Consult'],
  ],
  'permanent-residency-thailand': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/blog/permanent-residency-eligibility-2026/', 'PR blog'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  'working-in-thailand': [
    ['/work-permit/', 'Work permit'],
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/de/professions/', 'Professions (DE)'],
  ],
  'setting-up-thai-company': [
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/blog/boi-company-setup-visa-2026/', 'BOI blog'],
    ['/work-permit/', 'Work permit'],
    ['/de/professions/online-business-owner/', 'Online biz'],
  ],
  'pattaya-vs-phuket-vs-chiang-mai-retirement': [
    ['/de/compare/pattaya-vs-phuket/', 'vs Phuket (DE)'],
    ['/de/compare/pattaya-vs-chiang-mai/', 'vs CM (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
  ],
  'healthcare-thailand': [
    ['/healthcare/', 'Healthcare hub'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/guides/health-insurance/', 'Insurance'],
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
  ],
  'international-schools-pattaya': [
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/pattaya/living-in-pattaya/', 'Living EN'],
    ['/guides/verify-moe-accredited-school/', 'MOE'],
  ],
  'bringing-family-to-thailand': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'buying-property-thailand': [
    ['/property/', 'Property hub'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/professions/real-estate-agent/', 'RE agent'],
  ],
  'driving-licence-thailand': [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/guides/', 'Guides (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'will-writing-thailand': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/guides/', 'Guides (DE)'],
    ['/guides/buying-property-thailand/', 'Property'],
  ],
  'thai-citizenship': [
    ['/guides/permanent-residency-thailand/', 'PR first'],
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/guides/', 'Guides (DE)'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'embassy-directory': [
    ['/de/visas/', 'Visas (DE)'],
    ['/ru/visas/', 'Visas (RU)'],
    ['/resources/', 'Resources'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  glossary: [
    ['/glossary/', 'Glossary hub'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/ru/glossary/', 'Glossary (RU)'],
    ['/de/guides/', 'Guides (DE)'],
  ],
};

const CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

function block(links) {
  const parts = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `<!-- sprint60-guides-locale -->\n<p class="network-context">Locale network: ${parts}</p>\n`;
}

function patch(file, links) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint60-guides-locale')) return false;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }
  const html = block(links);
  const anchors = [
    '<h2>FAQ</h2>',
    '<div class="faq">',
    '<h2 class="read-next-h2">',
    '<section class="read-next">',
    '<h2>Related',
  ];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  return false;
}

let n = 0;
for (const slug of fs.readdirSync(GUIDES)) {
  if (slug === 'index.html') continue;
  const file = path.join(GUIDES, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const links = MAP[slug] || DEFAULT;
  if (patch(file, links)) {
    n++;
    console.log('guide', slug);
  }
}
console.log(`Sprint 60 guides locale: ${n} pages`);
