/**
 * Sprint 72 — on DE/RU indexed pilots, link to locale guides/visas/compare when available.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const GUIDES = [
  'jomtien-immigration-office',
  'tm30-reporting',
  '90-day-reporting',
  're-entry-permits',
  'visa-overstay-penalties',
  'visa-runs-vs-extensions',
  'thai-bank-account-as-foreigner',
  'health-insurance',
  'retiring-in-thailand',
  'cost-of-living-pattaya',
  'driving-licence-thailand',
];

const VISAS = [
  'dtv',
  'ltr',
  'retirement-non-o',
  'retirement-o-a',
  'retirement-o-x',
  'privilege-elite',
  'marriage-non-o',
  'business-non-b',
  'smart',
  'education-ed',
  'tourist-tr-evisa',
  'media-non-m',
];

const COMPARE = [
  'dtv-vs-ltr',
  'ed-vs-dtv',
  'privilege-vs-ltr',
  'non-o-vs-o-a',
  'o-a-vs-o-x',
  'dtv-vs-smart',
  'smart-vs-ltr',
  'marriage-vs-retirement',
  'dtv-vs-elite',
  'pattaya-vs-bangkok',
  'pattaya-vs-phuket',
  'pattaya-vs-chiang-mai',
  'pattaya-vs-hua-hin',
  'pattaya-vs-hua-hin-deep',
  'visa-comparison-matrix',
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function patchFile(file, lang) {
  let h = fs.readFileSync(file, 'utf8');
  let n = 0;
  const prefix = `/${lang}`;

  for (const slug of GUIDES) {
    const en = `/guides/${slug}/`;
    const loc = `${prefix}/guides/${slug}/`;
    const re = new RegExp(`href="${en.replace(/\//g, '\\/')}"`, 'g');
    const c = (h.match(re) || []).length;
    if (c) {
      h = h.replace(re, `href="${loc}"`);
      n += c;
    }
  }
  for (const slug of VISAS) {
    const en = `/visas/${slug}/`;
    const loc = `${prefix}/visas/${slug}/`;
    const re = new RegExp(`href="${en.replace(/\//g, '\\/')}"`, 'g');
    const c = (h.match(re) || []).length;
    if (c) {
      h = h.replace(re, `href="${loc}"`);
      n += c;
    }
  }
  for (const slug of COMPARE) {
    const en = `/compare/${slug}/`;
    const loc = `${prefix}/compare/${slug}/`;
    const re = new RegExp(`href="${en.replace(/\//g, '\\/')}"`, 'g');
    const c = (h.match(re) || []).length;
    if (c) {
      h = h.replace(re, `href="${loc}"`);
      n += c;
    }
  }

  if (n) {
    fs.writeFileSync(file, h);
    console.log(path.relative(ROOT, file).replace(/\\/g, '/'), n);
  }
}

let total = 0;
for (const lang of ['de', 'ru']) {
  const dir = path.join(ROOT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (rel === `${lang}/index.html`) continue;
    const before = fs.readFileSync(file, 'utf8');
    patchFile(file, lang);
    if (fs.readFileSync(file, 'utf8') !== before) total++;
  }
}
console.log('patched files', total);
