/**
 * Sprint 61 — network mesh on noindex DE/RU locale stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sm = fs.readFileSync(path.join(ROOT, 'scripts/rebuild-sitemaps.cjs'), 'utf8');
const PILOTS = new Set(JSON.parse(sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/)[1]));

const CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const DE_BASE =
  '<p class="network-context">Netzwerk DE: <a href="/de/">Home</a> · <a href="/de/visas/">Visa</a> · <a href="/de/compare/">Compare</a> · <a href="/de/guides/">Guides</a> · <a href="/de/tools/">Tools</a> · <a href="/de/glossary/">Glossar</a> · <a href="/de/professions/">Berufe</a> · <a href="/de/best-visa/">Budget</a> · <a href="/de/pattaya/">Pattaya</a></p>';

const RU_BASE =
  '<p class="network-context">Сеть RU: <a href="/ru/">Home</a> · <a href="/ru/visas/">визы</a> · <a href="/ru/compare/">сравнения</a> · <a href="/ru/guides/">гиды</a> · <a href="/ru/tools/">tools</a> · <a href="/ru/glossary/">глоссарий</a> · <a href="/ru/professions/">профессии</a> · <a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a></p>';

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['_', 'node_modules', '.git', 'functions'].includes(e.name)) continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function pageUrl(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace('/index.html', '') + '/';
}

function enPillar(url) {
  const parts = url.split('/').filter(Boolean);
  if (parts.length < 3) return null;
  const [, section, slug] = parts;
  if (section === 'guides' || section === 'glossary' || section === 'compare' || section === 'visas' || section === 'professions' || section === 'best-visa' || section === 'pattaya' || section === 'tools') {
    return `/${section}/${slug}/`;
  }
  if (section === 'banking' || section === 'retirement' || section === 'digital-nomad' || section === 'faq' || section === 'coworking') {
    return `/${section}/`;
  }
  return null;
}

function patch(file, url) {
  let h = fs.readFileSync(file, 'utf8');
  const robots = h.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || '';
  if (!/noindex/i.test(robots)) return false;
  if (h.includes('sprint61-stub-mesh')) return false;

  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  const base = lang === 'de' ? DE_BASE : RU_BASE;
  const en = enPillar(url);
  const enLink = en
    ? lang === 'de'
      ? ` · <a href="${en}">EN pillar</a>`
      : ` · <a href="${en}">EN</a>`
    : '';
  const block = `<!-- sprint61-stub-mesh -->\n${base.replace('</p>', `${enLink}</p>`)}\n`;

  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }

  if (h.includes('<main')) {
    h = h.replace(/<main\b[^>]*>/, (m) => `${m}\n${block}`);
  } else return false;

  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const file of walk(ROOT)) {
  const url = pageUrl(file);
  if (!url.startsWith('/de/') && !url.startsWith('/ru/')) continue;
  if (PILOTS.has(url)) continue;
  if (patch(file, url)) {
    n++;
    if (n <= 15 || n % 20 === 0) console.log('stub', url);
  }
}
console.log(`Sprint 61 stub mesh: ${n} pages`);
