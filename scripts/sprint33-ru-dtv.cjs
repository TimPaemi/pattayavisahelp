/**
 * Sprint 33 — full Russian DTV page (indexed pilot).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ruFile = path.join(ROOT, 'ru/visas/dtv/index.html');
const article = fs.readFileSync(path.join(__dirname, 'content/ru-dtv-article.html'), 'utf8');

let h = fs.readFileSync(ruFile, 'utf8');

h = h.replace(/<meta name="robots" content="noindex,follow" \/>/, '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />');

h = h.replace(
  /<main id="main" class="article-body">[\s\S]*?<\/main>/,
  `<main id="main" class="article-body">\n${article}\n</main>`
);

h = h.replace(
  '<div class="article-meta"><span class="live">UPDATED 31 MAY 2026</span></div>',
  '<div class="article-meta"><span class="live">UPDATED 28 MAY 2026</span><span class="sep">·</span><span class="read">9 MIN READ</span><span class="sep">·</span><span>РУССКИЙ · НЕЗАВИСИМО</span></div>'
);

h = h.replace(
  '<span class="article-label">// RU · VISA OVERVIEW</span>',
  '<span class="article-label">// RU · DTV · ПОЛНЫЙ ГИД</span>'
);

h = h.replace(
  '<p class="lede">DTV — главная виза для цифровых кочевников с иностранным доходом.</p>',
  '<p class="lede">Destination Thailand Visa (DTV) — 5-летняя виза для удалёнщиков и soft-power: 180 дней за въезд, ฿10 000 пошлина, ฿500 000 seasoning. Полный гид на русском для заявителей из России и СНГ, живущих в Паттайе.</p>'
);

h = h.replace(
  '<a href="/visas/dtv/">Полный гид на английском →</a>',
  '<a href="/ru/visas/dtv/">Гид DTV</a>'
);

const faqSchema = `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Сколько можно находиться на DTV?","acceptedAnswer":{"@type":"Answer","text":"180 дней за въезд, одно продление 180 дней. Виза 5 лет, неограниченные въезды."}},{"@type":"Question","name":"Можно ли работать на DTV?","acceptedAnswer":{"@type":"Answer","text":"Удалённо на иностранного работодателя — да. Тайский работодатель — нет."}},{"@type":"Question","name":"Сколько нужно на счёте?","acceptedAnswer":{"@type":"Answer","text":"500 000 бат эквивалент, seasoning 3–6 месяцев."}},{"@type":"Question","name":"Налоги в Таиланде на DTV?","acceptedAnswer":{"@type":"Answer","text":"При 180+ днях и remittance — да с 2024. LTR освобождён, DTV нет."}},{"@type":"Question","name":"Можно ли сменить туристическую на DTV внутри страны?","acceptedAnswer":{"@type":"Answer","text":"Обычно нет — подача за границей."}}]}`;

h = h.replace(
  /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>\s*/,
  `<script type="application/ld+json">\n${faqSchema}\n</script>\n`
);

if (!h.includes('.network-context{')) {
  h = h.replace(
    '<style>',
    `<style>\n.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}\n`
  );
}

fs.writeFileSync(ruFile, h);

const sitemapScript = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(sitemapScript, 'utf8');
if (!sm.includes('/ru/visas/dtv/')) {
  sm = sm.replace(
    "const LOCALE_INDEXED_PILOT = new Set(['/de/visas/dtv/']);",
    "const LOCALE_INDEXED_PILOT = new Set(['/de/visas/dtv/', '/ru/visas/dtv/']);"
  );
  fs.writeFileSync(sitemapScript, sm);
}

const ruHub = path.join(ROOT, 'ru/index.html');
let hub = fs.readFileSync(ruHub, 'utf8');
if (!hub.includes('Полный гид DTV на русском')) {
  hub = hub.replace(
    '<header class="article-head">',
    `<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.35);background:rgba(6,182,212,.08);border-radius:8px;font-size:.95rem"><strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/dtv/">Полный гид DTV на русском</a> (полный перевод, в индексе Google).</p>\n<header class="article-head">`
  );
}
hub = hub.replace('<a href="/visas/dtv/">DTV</a>', '<a href="/ru/visas/dtv/">DTV (RU)</a><a href="/visas/dtv/">DTV (EN)</a>');
fs.writeFileSync(ruHub, hub);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('RU DTV pilot complete');
