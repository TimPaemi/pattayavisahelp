/**
 * Sprint 56 — add best-visa + pattaya to Netzwerk DE / Сеть RU strips on all indexed pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sm = fs.readFileSync(path.join(ROOT, 'scripts/rebuild-sitemaps.cjs'), 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const PILOTS = new Set(JSON.parse(m[1]));

const DE_INSERT =
  ' · <a href="/de/best-visa/">Budget</a> · <a href="/de/pattaya/">Pattaya</a>';
const RU_INSERT =
  ' · <a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a>';

function patch(file, url) {
  let h = fs.readFileSync(file, 'utf8');
  const isDe = url.startsWith('/de/');
  const insert = isDe ? DE_INSERT : RU_INSERT;
  const marker = isDe ? 'Netzwerk DE:' : 'Сеть RU:';
  if (!h.includes(marker) || h.includes(isDe ? '/de/best-visa/' : '/ru/best-visa/')) return false;

  const re = new RegExp(
    `(<p class="network-context">${marker}[\\s\\S]*?<a href="${isDe ? '/de/professions/' : '/ru/professions/'}">[^<]+</a>)`,
    'i'
  );
  const next = h.replace(re, `$1${insert}`);
  if (next === h) return false;
  fs.writeFileSync(file, next);
  return true;
}

let n = 0;
for (const url of [...PILOTS].sort()) {
  if (url === '/de/' || url === '/ru/') continue;
  const file = path.join(ROOT, url.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(file)) continue;
  if (patch(file, url)) {
    n++;
    console.log('mesh+', url);
  }
}

// Hub article sources (for next sync)
for (const [article, insert] of [
  ['de-compare-hub-article.html', DE_INSERT],
  ['ru-compare-hub-article.html', RU_INSERT],
  ['de-professions-hub-article.html', DE_INSERT],
  ['ru-professions-hub-article.html', RU_INSERT],
  ['de-tools-hub-article.html', DE_INSERT],
  ['ru-tools-hub-article.html', RU_INSERT],
  ['de-glossary-hub-article.html', DE_INSERT],
  ['ru-glossary-hub-article.html', RU_INSERT],
  ['de-guides-hub-article.html', DE_INSERT],
  ['ru-guides-hub-article.html', RU_INSERT],
]) {
  const fp = path.join(__dirname, 'content', article);
  let t = fs.readFileSync(fp, 'utf8');
  if (t.includes('/de/best-visa/') || t.includes('/ru/best-visa/')) continue;
  const isDe = article.startsWith('de-');
  const re = new RegExp(
    `(<p class="network-context">(?:Netzwerk DE:|Сеть RU:)[\\s\\S]*?<a href="${isDe ? '/de/professions/' : '/ru/professions/'}">[^<]+</a>)`,
    'i'
  );
  const next = t.replace(re, `$1${insert}`);
  if (next !== t) {
    fs.writeFileSync(fp, next);
    console.log('article', article);
  }
}

console.log(`Sprint 56 mesh expand: ${n} pages`);
