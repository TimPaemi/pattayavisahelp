/**
 * Sprint 64 — minimal nav + mnav + skip link on noindex DE/RU stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint64-stub-nav';

const sm = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const PILOTS = new Set(JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]));
const LOCALE_HUBS = new Set(['/de/', '/ru/']);

const MNAV = `<script defer>(function(){if(window.__mnavLoaded)return;window.__mnavLoaded=1;function init(){if(document.querySelector('.mnav'))return;var n=document.createElement('nav');n.className='mnav';n.setAttribute('aria-label','Mobile navigation');var p=location.pathname;function a(href,ic,label){var c=p.indexOf(href)===0&&href!=='/'||(href==='/'&&p==='/')?' active':'';var cta=href==='/contact/'?' cta':'';return '<a href="'+href+'" class="'+(c+cta).trim()+'"><span class="ic">'+ic+'</span>'+label+'</a>'}n.innerHTML=a('/','\u2302','Home')+a('/visas/','\u29C9','Visas')+a('/tools/','\u25C8','Tools')+a('/blog/','\u00B6','Blog')+a('/contact/','\u2709','Contact');document.body.appendChild(n)}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}})();</script>`;

const CSS = `/* ${MARKER} */
.skipto{position:absolute;left:-9999px;top:0;background:var(--cyan,#06b6d4);color:#000;padding:10px 18px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;font-weight:600;text-transform:uppercase;z-index:9999;border-radius:0 0 8px 0}
.skipto:focus{left:0;top:0}
.nav{position:fixed;top:1rem;right:1rem;z-index:60;display:flex;gap:.1rem;padding:.35rem;background:rgba(15,15,15,.88);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.14);border-radius:999px}
.nav a{font:600 .68rem/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:#a1a1aa;padding:.55rem .85rem;border-radius:999px}
.nav a:hover{color:#fafafa;background:rgba(255,255,255,.04)}
.nav a.cta{background:#ec4899;color:#fff}
.brand{top:1rem!important;left:1rem!important}
.mnav{display:none}
@media (max-width:760px){
  .nav{top:.75rem!important;right:.75rem!important;padding:4px 4px 4px 10px}
  .nav a:not(.cta){display:none}
  .mnav{display:flex!important;position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(0,0,0,.92);backdrop-filter:blur(18px);border-top:1px solid rgba(255,255,255,.1);padding:8px 4px calc(8px + env(safe-area-inset-bottom,0px));justify-content:space-around}
  .mnav a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:44px;padding:10px 6px;color:#a1a1aa;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;text-transform:uppercase;font-weight:600}
  body{padding-bottom:72px}
}`;

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

function patch(file, url) {
  if (PILOTS.has(url) || LOCALE_HUBS.has(url)) return false;
  let h = fs.readFileSync(file, 'utf8');
  const robots = h.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || '';
  if (!/noindex/i.test(robots)) return false;
  if (h.includes(MARKER)) return false;

  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  const home = `/${lang}/`;
  const skipLabel = lang === 'de' ? 'Zum Inhalt' : 'К содержанию';
  const nav = `<nav class="nav" aria-label="Primary"><a href="${home}">${lang === 'de' ? 'Home' : 'Главная'}</a><a href="${home}visas/">${lang === 'de' ? 'Visa' : 'Визы'}</a><a href="${home}guides/">${lang === 'de' ? 'Guides' : 'Гиды'}</a><a href="/contact/" class="cta">Contact →</a></nav>`;
  const skipto = `<a href="#main" class="skipto">${skipLabel}</a>\n<!-- ${MARKER} -->\n`;

  if (h.includes('<style>') && !h.includes(MARKER)) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }
  if (!h.includes('__mnavLoaded')) {
    h = h.replace('</style>', `</style>\n${MNAV}`);
  }

  h = h.replace(/<a href="\/" class="brand"/, `<a href="${home}" class="brand"`);
  if (!h.includes('class="skipto"')) {
    h = h.replace(/<body([^>]*)>/i, `<body$1>\n${skipto}`);
  }
  if (!h.includes('class="nav"')) {
    h = h.replace(/(<a href="[^"]*" class="brand"[^>]*>[\s\S]*?<\/a>)/, `$1\n${nav}`);
  }

  if (/<main\b/.test(h) && !/<main[^>]*\bid=["']main["']/i.test(h)) {
    h = h.replace(/<main class="article-body"/, '<main id="main" class="article-body"');
    h = h.replace(/<main>/, '<main id="main">');
  }

  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const lang of ['de', 'ru']) {
  for (const file of walk(path.join(ROOT, lang))) {
    const url = pageUrl(file);
    if (patch(file, url)) {
      n++;
      if (n <= 12 || n % 25 === 0) console.log('stub-nav', url);
    }
  }
}
console.log(`Sprint 64 stub nav: ${n} pages`);
