/**
 * Sprint 60 — EN glossary terms link DE/RU hubs and visa pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GLOSS = path.join(ROOT, 'glossary');

const DEFAULT = [
  ['/de/glossary/', 'Glossar (DE)'],
  ['/ru/glossary/', 'Glossary (RU)'],
  ['/glossary/', 'All terms'],
  ['/de/visas/', 'Visas (DE)'],
];

const VISA_TERM = (slug, label) => [
  [`/visas/${slug}/`, `${label} guide`],
  [`/de/visas/${slug}/`, 'DE'],
  [`/ru/visas/${slug}/`, 'RU'],
  ['/de/glossary/', 'Glossar (DE)'],
];

const MAP = {
  dtv: [
    ['/visas/dtv/', 'DTV guide'],
    ['/de/visas/dtv/', 'DE'],
    ['/ru/visas/dtv/', 'RU'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
  ],
  ltr: [
    ['/visas/ltr/', 'LTR guide'],
    ['/de/visas/ltr/', 'DE'],
    ['/ru/visas/ltr/', 'RU'],
    ['/tools/eligibility/', 'LTR tool'],
  ],
  'non-o': [
    ['/visas/retirement-non-o/', 'Non-O guide'],
    ['/de/visas/retirement-non-o/', 'DE'],
    ['/ru/visas/retirement-non-o/', 'RU'],
    ['/de/compare/marriage-vs-retirement/', 'Marriage vs retire'],
  ],
  'non-oa': [
    ['/visas/retirement-o-a/', 'O-A guide'],
    ['/de/visas/retirement-o-a/', 'DE'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/guides/health-insurance/', 'Insurance'],
  ],
  'non-ox': [
    ['/visas/retirement-o-x/', 'O-X guide'],
    ['/de/visas/retirement-o-x/', 'DE'],
    ['/de/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/de/visas/privilege-elite/', 'Privilege'],
  ],
  'non-b': [
    ['/visas/business-non-b/', 'Non-B guide'],
    ['/de/visas/business-non-b/', 'DE'],
    ['/work-permit/', 'Work permit'],
    ['/de/professions/', 'Professions (DE)'],
  ],
  'non-m': [
    ['/visas/media-non-m/', 'Non-M guide'],
    ['/de/visas/media-non-m/', 'DE'],
    ['/de/professions/content-creator/', 'Creator (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  ed: [
    ['/visas/education-ed/', 'ED guide'],
    ['/de/visas/education-ed/', 'DE'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/guides/verify-moe-accredited-school/', 'MOE'],
  ],
  'smart-visa': [
    ['/visas/smart/', 'SMART guide'],
    ['/de/visas/smart/', 'DE'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/de/professions/saas-founder/', 'SaaS (DE)'],
  ],
  privilege: [
    ['/visas/privilege-elite/', 'Privilege guide'],
    ['/de/visas/privilege-elite/', 'DE'],
    ['/de/compare/privilege-vs-ltr/', 'vs LTR'],
    ['/de/best-visa/under-500k/', 'Premium budget'],
  ],
  tm30: [
    ['/guides/tm30-reporting/', 'TM30 guide'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/blog/tm30-landlord-refusal-2026/', 'TM30 blog'],
  ],
  tm8: [
    ['/guides/re-entry-permits/', 'Re-entry guide'],
    ['/glossary/re-entry-permit/', 'Re-entry term'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  tm6: [
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
  '90-day-report': [
    ['/guides/90-day-reporting/', '90-day guide'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/blog/90-day-report-online-2026/', 'Online blog'],
  ],
  're-entry-permit': [
    ['/guides/re-entry-permits/', 'Re-entry guide'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/', 'Visas (DE)'],
    ['/blog/re-entry-permit-pattaya-2026/', 'Blog'],
  ],
  overstay: [
    ['/guides/visa-overstay-penalties/', 'Overstay guide'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/contact/', 'Consult'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'visa-run': [
    ['/guides/visa-runs-vs-extensions/', 'Runs guide'],
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/blog/30-day-visa-exempt-rollback/', 'Rollback'],
    ['/de/best-visa/under-5k/', 'Shoestring'],
  ],
  extension: [
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/', 'Visas (DE)'],
    ['/blog/extension-timeline-jomtien-2026/', 'Timeline blog'],
  ],
  'royal-decree-743': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/blog/ltr-royal-decree-743-2026/', 'RD743 blog'],
    ['/guides/thai-tax-foreign-residents/', 'Tax guide'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
  ],
  boi: [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/blog/boi-company-setup-visa-2026/', 'BOI blog'],
    ['/glossary/ltr/', 'LTR term'],
  ],
  'e-visa': [
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/resources/', 'Resources'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  wp10: [
    ['/work-permit/', 'Work permit hub'],
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/de/professions/', 'Professions (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'mor-sor-9': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/guides/foreign-marriage-legalisation/', 'Legalisation'],
    ['/de/compare/marriage-vs-retirement/', 'vs Retirement'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
  fet: [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/tools/bank-checker/', 'Bank checker'],
    ['/guides/thai-bank-account-as-foreigner/', 'Bank guide'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
  apostille: [
    ['/guides/foreign-marriage-legalisation/', 'Marriage docs'],
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/guides/embassy-directory/', 'Embassies'],
  ],
  pr: [
    ['/guides/permanent-residency-thailand/', 'PR guide'],
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/blog/permanent-residency-eligibility-2026/', 'PR blog'],
    ['/de/guides/', 'Guides (DE)'],
  ],
  'immigration-bureau': [
    ['/guides/jomtien-immigration-office/', 'Jomtien office'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/', 'Visas (DE)'],
    ['/blog/jomtien-immigration-2026/', 'Jomtien blog'],
  ],
  amphoe: [
    ['/guides/foreign-marriage-legalisation/', 'Marriage legal'],
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'tabien-baan': [
    ['/guides/tm30-reporting/', 'TM30'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'cabinet-resolution': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/blog/2026-thailand-visa-changes-recap/', '2026 recap'],
    ['/de/compare/visa-comparison-matrix/', 'Matrix (DE)'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
  'royal-gazette': [
    ['/blog/2026-thailand-visa-changes-recap/', '2026 recap'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/changelog/', 'Changelog'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'soft-power': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/visas/media-non-m/', 'Non-M (DE)'],
    ['/digital-nomad/', 'Nomad hub'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  moe: [
    ['/guides/verify-moe-accredited-school/', 'MOE guide'],
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/blog/ed-visa-moe-accreditation-2026/', 'MOE blog'],
  ],
  caat: [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/resources/', 'Resources'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
  tat: [
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/pattaya/living-in-pattaya/', 'Living EN'],
    ['/de/best-visa/', 'Budget (DE)'],
  ],
  'cm-form': [
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/visas/', 'Visas (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/glossary/', 'Glossar (DE)'],
  ],
};

const CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

function block(links) {
  const parts = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `<!-- sprint60-glossary-locale -->\n<p class="network-context">Locale network: ${parts}</p>\n`;
}

function patch(file, links) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint60-glossary-locale')) return false;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }
  const html = block(links);
  const anchors = [
    '<h2>FAQ</h2>',
    '<div class="faq">',
    '<h2 class="read-next-h2">',
    '<section class="read-next">',
  ];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  const main = h.indexOf('<main id="main"');
  if (main >= 0) {
    const after = h.indexOf('>', main) + 1;
    h = h.slice(0, after) + '\n' + html + h.slice(after);
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
for (const slug of fs.readdirSync(GLOSS)) {
  const file = path.join(GLOSS, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const links = MAP[slug] || DEFAULT;
  if (patch(file, links)) {
    n++;
    console.log('glossary', slug);
  }
}
console.log(`Sprint 60 glossary locale: ${n} pages`);
