/**
 * Sprint 61 — EN guides/glossary link matching DE/RU mirror stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint61-mirror';

function mirrorLine(de, ru) {
  return ` · <a href="${de}">DE mirror</a> · <a href="${ru}">RU mirror</a>`;
}

function patchMirror(file, de, ru) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER)) return false;
  const link = mirrorLine(de, ru);
  const re = /<!-- sprint60-guides-locale -->[\s\S]*?<\/p>/;
  if (re.test(h)) {
    h = h.replace(re, (block) => {
      if (block.includes(de)) return block;
      return block.replace('</p>', `${link}</p>\n<!-- ${MARKER} -->`);
    });
    fs.writeFileSync(file, h);
    return true;
  }
  const re2 = /<!-- sprint60-glossary-locale -->[\s\S]*?<\/p>/;
  if (re2.test(h)) {
    h = h.replace(re2, (block) => {
      if (block.includes(de)) return block;
      return block.replace('</p>', `${link}</p>\n<!-- ${MARKER} -->`);
    });
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
const guidesDir = path.join(ROOT, 'guides');
for (const slug of fs.readdirSync(guidesDir)) {
  if (slug === 'glossary') continue;
  const en = path.join(guidesDir, slug, 'index.html');
  const de = `/de/guides/${slug}/`;
  const ru = `/ru/guides/${slug}/`;
  if (!fs.existsSync(en)) continue;
  if (!fs.existsSync(path.join(ROOT, 'de/guides', slug, 'index.html'))) continue;
  if (patchMirror(en, de, ru)) {
    n++;
    console.log('guide', slug);
  }
}

const glossDir = path.join(ROOT, 'glossary');
for (const slug of fs.readdirSync(glossDir)) {
  const en = path.join(glossDir, slug, 'index.html');
  const de = `/de/glossary/${slug}/`;
  const ru = `/ru/glossary/${slug}/`;
  if (!fs.existsSync(en)) continue;
  if (!fs.existsSync(path.join(ROOT, 'de/glossary', slug, 'index.html'))) continue;
  if (patchMirror(en, de, ru)) {
    n++;
    console.log('glossary', slug);
  }
}

// EN best-visa tiers → de/ru tier stubs
const tiers = ['under-5k', 'under-20k', 'under-50k', 'under-100k', 'under-500k', 'under-1m'];
for (const tier of tiers) {
  const en = path.join(ROOT, 'best-visa', tier, 'index.html');
  if (!fs.existsSync(en)) continue;
  let h = fs.readFileSync(en, 'utf8');
  if (h.includes(MARKER)) continue;
  const de = `/de/best-visa/${tier}/`;
  const ru = `/ru/best-visa/${tier}/`;
  const link = mirrorLine(de, ru);
  const re = /<!-- sprint60-tools-bestvisa -->[\s\S]*?<\/p>/;
  if (re.test(h)) {
    h = h.replace(re, (b) => b.replace('</p>', `${link}</p>\n<!-- ${MARKER} -->`));
    fs.writeFileSync(en, h);
    n++;
    console.log('tier', tier);
  }
}

console.log(`Sprint 61 EN mirror links: ${n} pages`);
