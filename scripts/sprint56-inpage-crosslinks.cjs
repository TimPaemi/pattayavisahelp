/**
 * Sprint 56 — in-page locale cross-links on visa + compare pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sm = fs.readFileSync(path.join(ROOT, 'scripts/rebuild-sitemaps.cjs'), 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const PILOTS = new Set(JSON.parse(m[1]));

const VISA_DE = {
  dtv: [
    ['/de/compare/dtv-vs-ltr/', 'DTV vs LTR'],
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/de/compare/dtv-vs-elite/', 'DTV vs Elite'],
  ],
  ltr: [
    ['/de/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/de/compare/dtv-vs-ltr/', 'DTV vs LTR'],
  ],
  'privilege-elite': [
    ['/de/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
    ['/de/compare/dtv-vs-elite/', 'DTV vs Elite'],
    ['/de/visas/ltr/', 'LTR (DE)'],
  ],
  'retirement-non-o': [
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/de/compare/marriage-vs-retirement/', 'Ehe vs Rente'],
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
  ],
  'retirement-o-a': [
    ['/de/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
  ],
  'retirement-o-x': [
    ['/de/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/de/visas/privilege-elite/', 'Privilege (DE)'],
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
  ],
  'marriage-non-o': [
    ['/de/compare/marriage-vs-retirement/', 'Ehe vs Rente'],
    ['/de/visas/retirement-non-o/', 'Non-O Rente'],
    ['/guides/foreign-marriage-legalisation/', 'Heirat EN'],
  ],
  'business-non-b': [
    ['/de/visas/smart/', 'SMART (DE)'],
    ['/work-permit/', 'Work permit EN'],
    ['/guides/setting-up-thai-company/', 'Firma EN'],
  ],
  smart: [
    ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/de/compare/dtv-vs-smart/', 'DTV vs SMART'],
    ['/de/visas/ltr/', 'LTR (DE)'],
  ],
  'education-ed': [
    ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/guides/verify-moe-accredited-school/', 'MOE EN'],
  ],
  'tourist-tr-evisa': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs EN'],
    ['/de/best-visa/', 'Budget-Hub'],
  ],
  'media-non-m': [
    ['/de/visas/business-non-b/', 'Non-B (DE)'],
    ['/work-permit/', 'Work permit EN'],
    ['/de/professions/content-creator/', 'Creator (DE)'],
  ],
};

const VISA_RU = {
  dtv: [
    ['/ru/compare/dtv-vs-ltr/', 'DTV vs LTR'],
    ['/ru/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/ru/compare/dtv-vs-elite/', 'DTV vs Elite'],
  ],
  ltr: [
    ['/ru/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
    ['/ru/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/ru/compare/dtv-vs-ltr/', 'DTV vs LTR'],
  ],
  'privilege-elite': [
    ['/ru/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
    ['/ru/compare/dtv-vs-elite/', 'DTV vs Elite'],
    ['/ru/visas/ltr/', 'LTR RU'],
  ],
  'retirement-non-o': [
    ['/ru/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/ru/compare/marriage-vs-retirement/', 'брак vs пенсия'],
    ['/ru/visas/retirement-o-a/', 'O-A RU'],
  ],
  'retirement-o-a': [
    ['/ru/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/ru/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/ru/visas/retirement-non-o/', 'Non-O RU'],
  ],
  'retirement-o-x': [
    ['/ru/compare/o-a-vs-o-x/', 'O-A vs O-X'],
    ['/ru/visas/privilege-elite/', 'Privilege RU'],
    ['/ru/visas/retirement-o-a/', 'O-A RU'],
  ],
  'marriage-non-o': [
    ['/ru/compare/marriage-vs-retirement/', 'брак vs пенсия'],
    ['/ru/visas/retirement-non-o/', 'Non-O RU'],
    ['/guides/foreign-marriage-legalisation/', 'брак EN'],
  ],
  'business-non-b': [
    ['/ru/visas/smart/', 'SMART RU'],
    ['/work-permit/', 'work permit EN'],
    ['/guides/setting-up-thai-company/', 'компания EN'],
  ],
  smart: [
    ['/ru/compare/smart-vs-ltr/', 'SMART vs LTR'],
    ['/ru/compare/dtv-vs-smart/', 'DTV vs SMART'],
    ['/ru/visas/ltr/', 'LTR RU'],
  ],
  'education-ed': [
    ['/ru/compare/ed-vs-dtv/', 'ED vs DTV'],
    ['/ru/visas/dtv/', 'DTV RU'],
    ['/guides/verify-moe-accredited-school/', 'MOE EN'],
  ],
  'tourist-tr-evisa': [
    ['/ru/visas/dtv/', 'DTV RU'],
    ['/guides/visa-runs-vs-extensions/', 'runs EN'],
    ['/ru/best-visa/', 'бюджет'],
  ],
  'media-non-m': [
    ['/ru/visas/business-non-b/', 'Non-B RU'],
    ['/work-permit/', 'work permit EN'],
    ['/ru/professions/content-creator/', 'creator RU'],
  ],
};

const COMPARE_DE = {
  'dtv-vs-ltr': ['/de/visas/dtv/', '/de/visas/ltr/', '/de/compare/visa-comparison-matrix/'],
  'dtv-vs-elite': ['/de/visas/dtv/', '/de/visas/privilege-elite/', '/de/best-visa/'],
  'dtv-vs-smart': ['/de/visas/dtv/', '/de/visas/smart/', '/de/professions/saas-founder/'],
  'ed-vs-dtv': ['/de/visas/education-ed/', '/de/visas/dtv/', '/guides/switch-ed-to-dtv/'],
  'privilege-vs-ltr': ['/de/visas/privilege-elite/', '/de/visas/ltr/', '/de/compare/dtv-vs-elite/'],
  'smart-vs-ltr': ['/de/visas/smart/', '/de/visas/ltr/', '/de/compare/dtv-vs-smart/'],
  'non-o-vs-o-a': ['/de/visas/retirement-non-o/', '/de/visas/retirement-o-a/', '/guides/health-insurance/'],
  'o-a-vs-o-x': ['/de/visas/retirement-o-a/', '/de/visas/retirement-o-x/', '/de/visas/privilege-elite/'],
  'marriage-vs-retirement': ['/de/visas/marriage-non-o/', '/de/visas/retirement-non-o/', '/guides/marriage-non-o-to-pr/'],
  'pattaya-vs-bangkok': ['/de/pattaya/', '/de/visas/dtv/', '/guides/jomtien-immigration-office/'],
  'pattaya-vs-phuket': ['/de/pattaya/', '/de/compare/pattaya-vs-bangkok/', '/pattaya/living-in-pattaya/'],
  'pattaya-vs-chiang-mai': ['/de/pattaya/', '/guides/best-visa-digital-nomads/', '/de/visas/dtv/'],
  'pattaya-vs-hua-hin': ['/de/pattaya/', '/de/compare/pattaya-vs-bangkok/', '/pattaya/wongamat/'],
  'pattaya-vs-hua-hin-deep': ['/de/pattaya/', '/de/compare/pattaya-vs-hua-hin/', '/retirement/'],
  'visa-comparison-matrix': ['/de/visas/', '/tools/visa-finder/', '/de/best-visa/'],
};

const COMPARE_RU = {
  'dtv-vs-ltr': ['/ru/visas/dtv/', '/ru/visas/ltr/', '/ru/compare/visa-comparison-matrix/'],
  'dtv-vs-elite': ['/ru/visas/dtv/', '/ru/visas/privilege-elite/', '/ru/best-visa/'],
  'dtv-vs-smart': ['/ru/visas/dtv/', '/ru/visas/smart/', '/ru/professions/saas-founder/'],
  'ed-vs-dtv': ['/ru/visas/education-ed/', '/ru/visas/dtv/', '/guides/switch-ed-to-dtv/'],
  'privilege-vs-ltr': ['/ru/visas/privilege-elite/', '/ru/visas/ltr/', '/ru/compare/dtv-vs-elite/'],
  'smart-vs-ltr': ['/ru/visas/smart/', '/ru/visas/ltr/', '/ru/compare/dtv-vs-smart/'],
  'non-o-vs-o-a': ['/ru/visas/retirement-non-o/', '/ru/visas/retirement-o-a/', '/guides/health-insurance/'],
  'o-a-vs-o-x': ['/ru/visas/retirement-o-a/', '/ru/visas/retirement-o-x/', '/ru/visas/privilege-elite/'],
  'marriage-vs-retirement': ['/ru/visas/marriage-non-o/', '/ru/visas/retirement-non-o/', '/guides/marriage-non-o-to-pr/'],
  'pattaya-vs-bangkok': ['/ru/pattaya/', '/ru/visas/dtv/', '/guides/jomtien-immigration-office/'],
  'pattaya-vs-phuket': ['/ru/pattaya/', '/ru/compare/pattaya-vs-bangkok/', '/pattaya/living-in-pattaya/'],
  'pattaya-vs-chiang-mai': ['/ru/pattaya/', '/guides/best-visa-digital-nomads/', '/ru/visas/dtv/'],
  'pattaya-vs-hua-hin': ['/ru/pattaya/', '/ru/compare/pattaya-vs-bangkok/', '/pattaya/wongamat/'],
  'pattaya-vs-hua-hin-deep': ['/ru/pattaya/', '/ru/compare/pattaya-vs-hua-hin/', '/retirement/'],
  'visa-comparison-matrix': ['/ru/visas/', '/tools/visa-finder/', '/ru/best-visa/'],
};

function block(lang, label, links) {
  const parts = links
    .map(([href, text]) => `<a href="${href}">${text || href}</a>`)
    .join(' · ');
  return `<p class="network-context">${label}: ${parts}</p>`;
}

function visaSlug(url) {
  const m = url.match(/^\/(de|ru)\/visas\/([^/]+)\/$/);
  return m ? m[2] : null;
}

function compareSlug(url) {
  const m = url.match(/^\/(de|ru)\/compare\/([^/]+)\/$/);
  return m ? m[2] : null;
}

function patchInpage(file, url) {
  let h = fs.readFileSync(file, 'utf8');
  const marker = 'sprint56-crosslinks';
  if (h.includes(marker)) return false;

  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  let links = null;
  let label = lang === 'de' ? 'Querverweise (DE)' : 'Связанные (RU)';

  const v = visaSlug(url);
  if (v) {
    const map = lang === 'de' ? VISA_DE : VISA_RU;
    links = map[v];
  }
  const c = compareSlug(url);
  if (c) {
    const map = lang === 'de' ? COMPARE_DE : COMPARE_RU;
    const hrefs = map[c];
    if (hrefs) links = hrefs.map((href) => [href, href.split('/').filter(Boolean).pop()]);
  }

  if (!links || !links.length) return false;

  const html = `<!-- ${marker} -->\n${block(lang, label, links)}\n`;
  const anchors = [
    '<h2>Verwandte Ratgeber',
    '<h2>Связанные гиды',
    '<h2>Related guides',
    '<h2>FAQ</h2>',
    '<div class="faq">',
  ];
  let inserted = false;
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    const mainEnd = h.lastIndexOf('</main>');
    if (mainEnd < 0) return false;
    h = h.slice(0, mainEnd) + html + h.slice(mainEnd);
  }

  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const url of [...PILOTS].sort()) {
  if (!url.includes('/visas/') && !url.includes('/compare/')) continue;
  const file = path.join(ROOT, url.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(file)) continue;
  if (patchInpage(file, url)) {
    n++;
    console.log('xlink', url);
  }
}
console.log(`Sprint 56 in-page crosslinks: ${n} pages`);
