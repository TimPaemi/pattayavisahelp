/**
 * Sprint 59 — blog posts link DE/RU pilots, hubs, and related guides.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

const MAP = {
  'dtv-180-day-extension-2026': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/ru/visas/dtv/', 'DTV (RU)'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/guides/jomtien-immigration-office/', 'Jomtien EN'],
  ],
  'dtv-embassy-seasoning-2026': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/ru/visas/dtv/', 'DTV (RU)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/pattaya/germany-to-thailand/', 'DE → TH'],
  ],
  'dtv-tax-residency-2026': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/guides/thai-tax-foreign-residents/', 'Tax EN'],
    ['/de/compare/dtv-vs-ltr/', 'DTV vs LTR (DE)'],
    ['/glossary/royal-decree-743/', 'RD743'],
  ],
  'ltr-boi-application-checklist-2026': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/ru/visas/ltr/', 'LTR (RU)'],
    ['/tools/eligibility/', 'LTR tool'],
    ['/de/compare/privilege-vs-ltr/', 'vs Privilege'],
  ],
  'ltr-royal-decree-743-2026': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/glossary/royal-decree-743/', 'Glossary'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/guides/thai-tax-foreign-residents/', 'Tax EN'],
  ],
  'non-o-extension-documents-2026': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/ru/visas/retirement-non-o/', 'Non-O (RU)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
  ],
  'marriage-non-o-documents-2026': [
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
    ['/ru/visas/marriage-non-o/', 'Marriage (RU)'],
    ['/guides/foreign-marriage-legalisation/', 'Legalisation'],
    ['/de/compare/marriage-vs-retirement/', 'vs Retirement'],
  ],
  'o-a-health-insurance-2026': [
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
    ['/guides/health-insurance/', 'Insurance EN'],
    ['/de/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
  ],
  'privilege-elite-renewal-2026': [
    ['/de/visas/privilege-elite/', 'Privilege (DE)'],
    ['/ru/visas/privilege-elite/', 'Privilege (RU)'],
    ['/de/compare/privilege-vs-ltr/', 'vs LTR'],
    ['/de/best-visa/under-500k/', 'Premium budget'],
  ],
  'smart-visa-application-2026': [
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/ru/visas/smart/', 'SMART (RU)'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/de/professions/saas-founder/', 'SaaS (DE)'],
  ],
  'ed-visa-moe-accreditation-2026': [
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/ru/visas/education-ed/', 'ED (RU)'],
    ['/guides/verify-moe-accredited-school/', 'MOE EN'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
  ],
  'tourist-visa-extension-2026': [
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs EN'],
    ['/de/visas/dtv/', 'DTV upgrade'],
    ['/de/best-visa/under-5k/', 'Shoestring'],
  ],
  'tm30-landlord-refusal-2026': [
    ['/guides/tm30-reporting/', 'TM30 EN'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/glossary/tm30/', 'TM30 term'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  '90-day-report-online-2026': [
    ['/guides/90-day-reporting/', '90-day EN'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/glossary/90-day-report/', 'Glossary'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  're-entry-permit-pattaya-2026': [
    ['/guides/re-entry-permits/', 'Re-entry EN'],
    ['/glossary/re-entry-permit/', 'Glossary'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
  ],
  'extension-timeline-jomtien-2026': [
    ['/guides/jomtien-immigration-office/', 'Jomtien EN'],
    ['/blog/jomtien-immigration-2026/', 'Jomtien blog'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'jomtien-immigration-2026': [
    ['/guides/jomtien-immigration-office/', 'Office guide'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/ru/pattaya/', 'Pattaya (RU)'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  'overstay-voluntary-surrender-2026': [
    ['/guides/visa-overstay-penalties/', 'Overstay EN'],
    ['/glossary/overstay/', 'Glossary'],
    ['/de/glossary/', 'Glossar (DE)'],
    ['/contact/', 'Consult'],
  ],
  'permanent-residency-eligibility-2026': [
    ['/guides/permanent-residency-thailand/', 'PR EN'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/guides/marriage-non-o-to-pr/', 'Marriage → PR'],
    ['/de/visas/marriage-non-o/', 'Marriage (DE)'],
  ],
  'work-permit-renewal-pattaya-2026': [
    ['/work-permit/', 'WP hub'],
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'boi-company-setup-visa-2026': [
    ['/guides/setting-up-thai-company/', 'Company EN'],
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/work-permit/', 'Work permit'],
  ],
  'visa-agent-red-flags-2026': [
    ['/guides/visa-scams-pattaya/', 'Scams EN'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/contact/', 'Consult'],
    ['/tools/visa-finder/', 'Visa Finder'],
  ],
  'tdac-step-by-step': [
    ['/guides/', 'Guides hub'],
    ['/de/guides/', 'Guides (DE)'],
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/resources/', 'Resources'],
  ],
  '30-day-visa-exempt-rollback': [
    ['/de/visas/tourist-tr-evisa/', 'Tourist (DE)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs EN'],
    ['/de/visas/dtv/', 'DTV path'],
    ['/blog/2026-thailand-visa-changes-recap/', '2026 recap'],
  ],
  '2026-thailand-visa-changes-recap': [
    ['/de/visas/', 'Visas (DE)'],
    ['/ru/visas/', 'Visas (RU)'],
    ['/de/compare/visa-comparison-matrix/', 'Matrix (DE)'],
    ['/changelog/', 'Changelog'],
  ],
  '2026-annual-review': [
    ['/de/', 'DE home'],
    ['/ru/', 'RU home'],
    ['/de/visas/', 'Visas (DE)'],
    ['/blog/', 'All posts'],
  ],
};

function block(links) {
  const parts = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `<!-- sprint59-blog-locale -->\n<p class="network-context">Go deeper: ${parts}</p>\n`;
}

function insert(file, html) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint59-blog-locale')) return false;

  if (!h.includes('.network-context{') && h.includes('<style>')) {
    const css =
      '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';
    h = h.replace('<style>', `<style>\n${css}\n`);
  }

  const anchors = [
    '<h2>FAQ</h2>',
    '<div class="faq">',
    '<h2 class="read-next-h2">',
    '<h2>Related',
    '<h2>Want a personal',
    '<h2 class="contact-h2">',
  ];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  const main = h.indexOf('<main');
  if (main < 0) return false;
  const after = h.indexOf('>', main) + 1;
  h = h.slice(0, after) + '\n' + html + h.slice(after);
  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const slug of fs.readdirSync(BLOG)) {
  const file = path.join(BLOG, slug, 'index.html');
  if (!fs.existsSync(file) || slug === 'index.html') continue;
  const links = MAP[slug];
  if (!links) {
    console.warn('no map', slug);
    continue;
  }
  if (insert(file, block(links))) {
    n++;
    console.log('blog', slug);
  }
}

// Blog hub — locale strip
const hub = path.join(BLOG, 'index.html');
let hubHtml = fs.readFileSync(hub, 'utf8');
if (!hubHtml.includes('sprint59-blog-locale')) {
  const strip = `<!-- sprint59-blog-locale -->\n<p class="network-context">Locale: <a href="/de/visas/">Visas (DE)</a> · <a href="/ru/visas/">Visas (RU)</a> · <a href="/de/pattaya/">Pattaya (DE)</a> · <a href="/de/best-visa/">Budget (DE)</a> · <a href="/de/compare/">Compare (DE)</a></p>\n`;
  hubHtml = hubHtml.replace('<main id="main"', `${strip}<main id="main"`);
  fs.writeFileSync(hub, hubHtml);
  console.log('blog', 'index (hub)');
}

console.log(`Sprint 59 blog locale: ${n} posts`);
