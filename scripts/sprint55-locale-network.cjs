/**
 * Sprint 55 — locale mesh + parent-hub links on all indexed DE/RU pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const sm = fs.readFileSync(path.join(ROOT, 'scripts/rebuild-sitemaps.cjs'), 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const PILOTS = new Set(JSON.parse(m[1]));

const DE_MESH =
  '<p class="network-context">Netzwerk DE: <a href="/de/">Home</a> · <a href="/de/visas/">Visa</a> · <a href="/de/compare/">Compare</a> · <a href="/de/guides/">Guides</a> · <a href="/de/tools/">Tools</a> · <a href="/de/glossary/">Glossar</a> · <a href="/de/professions/">Berufe</a> · <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/contact/">Beratung</a></p>';

const RU_MESH =
  '<p class="network-context">Сеть RU: <a href="/ru/">Home</a> · <a href="/ru/visas/">визы</a> · <a href="/ru/compare/">сравнения</a> · <a href="/ru/guides/">гиды</a> · <a href="/ru/tools/">tools</a> · <a href="/ru/glossary/">глоссарий</a> · <a href="/ru/professions/">профессии</a> · <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/contact/">консультация</a></p>';

const PARENT = {
  de: {
    visas: { hub: '/de/visas/', label: 'Visa-Hub (DE)' },
    compare: { hub: '/de/compare/', label: 'Compare-Hub (DE)' },
    professions: { hub: '/de/professions/', label: 'Berufe-Hub (DE)' },
    guides: { hub: '/de/guides/', label: 'Leitfäden-Hub (DE)' },
    tools: { hub: '/de/tools/', label: 'Tools-Hub (DE)' },
    glossary: { hub: '/de/glossary/', label: 'Glossar-Hub (DE)' },
    'best-visa': { hub: '/de/best-visa/', label: 'Budget-Visa (DE)' },
    pattaya: { hub: '/de/pattaya/', label: 'Pattaya (DE)' },
  },
  ru: {
    visas: { hub: '/ru/visas/', label: 'хаб виз (RU)' },
    compare: { hub: '/ru/compare/', label: 'сравнения (RU)' },
    professions: { hub: '/ru/professions/', label: 'профессии (RU)' },
    guides: { hub: '/ru/guides/', label: 'гиды (RU)' },
    tools: { hub: '/ru/tools/', label: 'tools (RU)' },
    glossary: { hub: '/ru/glossary/', label: 'глоссарий (RU)' },
    'best-visa': { hub: '/ru/best-visa/', label: 'бюджет виз (RU)' },
    pattaya: { hub: '/ru/pattaya/', label: 'Паттайя (RU)' },
  },
};

const EN_PILLAR = {
  de: {
    visas: '/visas/',
    compare: '/compare/',
    professions: '/professions/',
    guides: '/guides/',
    tools: '/tools/',
    glossary: '/glossary/',
    'best-visa': '/best-visa/',
    pattaya: '/pattaya/',
  },
  ru: {
    visas: '/visas/',
    compare: '/compare/',
    professions: '/professions/',
    guides: '/guides/',
    tools: '/tools/',
    glossary: '/glossary/',
    'best-visa': '/best-visa/',
    pattaya: '/pattaya/',
  },
};

function sectionOf(url, lang) {
  const parts = url.replace(`/${lang}/`, '').split('/').filter(Boolean);
  return parts[0] || null;
}

function patch(file, url) {
  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
    changed = true;
  }

  const mesh = lang === 'de' ? DE_MESH : RU_MESH;
  const meshKey = lang === 'de' ? 'Netzwerk DE:' : 'Сеть RU:';
  if (!h.includes(meshKey)) {
    const marker = '<main id="main"';
    if (h.includes(marker)) {
      h = h.replace(marker, `${mesh}\n${marker}`);
      changed = true;
    }
  }

  const sec = sectionOf(url, lang);
  const depth = url.split('/').filter(Boolean).length;
  if (sec && depth >= 3 && PARENT[lang][sec]) {
    const { hub, label } = PARENT[lang][sec];
    const hubLink = `<a href="${hub}">${label}</a>`;
    if (!h.includes(`href="${hub}"`)) {
      const re = /<p class="network-context">([\s\S]*?)<\/p>/;
      if (re.test(h)) {
        h = h.replace(re, (full, inner) => {
          if (inner.includes(hub)) return full;
          return `<p class="network-context">${inner} · ${hubLink}</p>`;
        });
        changed = true;
      }
    }
    const enPillar = EN_PILLAR[lang][sec];
    if (enPillar && !h.includes(`href="${enPillar}"`)) {
      const re = /<p class="network-context">([\s\S]*?)<\/p>/;
      if (re.test(h)) {
        h = h.replace(re, (full, inner) => {
          if (inner.includes(enPillar)) return full;
          return `<p class="network-context">${inner} · <a href="${enPillar}">EN pillar</a></p>`;
        });
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
for (const url of [...PILOTS].sort()) {
  if (url === '/de/' || url === '/ru/') continue;
  const file = path.join(ROOT, url.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('missing', url);
    continue;
  }
  if (patch(file, url)) {
    n++;
    console.log('mesh', url);
  }
}

console.log(`Sprint 55 locale network: ${n} pages patched`);
