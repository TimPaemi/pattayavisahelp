/**
 * Sprint 64 — fix 32 pages with only 1 inbound internal link.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint64-inbound';

function patch(rel, fn) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return;
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER)) return;
  const next = fn(h);
  if (next === h) return;
  fs.writeFileSync(file, next);
  console.log('inbound', rel);
}

function areaSlugs(lang) {
  const dir = path.join(ROOT, lang, 'pattaya');
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function areaLinks(lang) {
  return areaSlugs(lang)
    .map((slug) => {
      const label = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `<a href="/${lang}/pattaya/${slug}/">${label}</a>`;
    })
    .join(' · ');
}

// DE pattaya hub — full mirror list (filesystem-driven)
patch('de/pattaya/index.html', (h) => {
  const block = `<p><strong>Alle DE-Spiegel:</strong> ${areaLinks('de')}</p>\n<!-- ${MARKER} -->\n`;
  return h.replace(/<!-- sprint64-inbound -->[\s\S]*?<!-- sprint62-pattaya-stubs -->/, `<!-- ${MARKER} -->\n${block}<!-- sprint62-pattaya-stubs -->`);
});

// RU pattaya hub
patch('ru/pattaya/index.html', (h) => {
  const block = `<p><strong>Все RU-страницы:</strong> ${areaLinks('ru')}</p>\n<!-- ${MARKER} -->\n`;
  return h.replace(/<!-- sprint64-inbound -->[\s\S]*?<!-- sprint62-pattaya-stubs -->/, `<!-- ${MARKER} -->\n${block}<!-- sprint62-pattaya-stubs -->`);
});

// EN pattaya hub — locale mirrors (only where stub exists)
patch('pattaya/index.html', (h) => {
  const de = areaSlugs('de')
    .map((slug) => `<a href="/de/pattaya/${slug}/">DE ${slug}</a>`)
    .join(' · ');
  const ru = areaSlugs('ru')
    .map((slug) => `<a href="/ru/pattaya/${slug}/">RU ${slug}</a>`)
    .join(' · ');
  const block = `<p class="network-context">Locale mirrors: ${de} · ${ru}</p>\n<!-- ${MARKER} -->\n`;
  return h.replace(/<p class="network-context">Locale area mirrors:[\s\S]*?<!-- sprint64-inbound -->/, block.trim() + '\n<!-- sprint64-inbound -->');
});

// EN country routes → DE/RU stubs when present
for (const slug of areaSlugs('de').filter((s) => s.includes('-to-thailand') || s === 'living-in-pattaya')) {
  const de = `/de/pattaya/${slug}/`;
  const ruPath = path.join(ROOT, 'ru/pattaya', slug, 'index.html');
  const ruLink = fs.existsSync(ruPath) ? ` · <a href="/ru/pattaya/${slug}/">Русский</a>` : '';
  patch(`pattaya/${slug}/index.html`, (h) => {
    const line = `<p class="network-context"><a href="${de}">Deutsch</a>${ruLink}</p>\n<!-- ${MARKER} -->\n`;
    return h.replace(/<p class="network-context"><a href="\/de\/pattaya\/[^"]*">Deutsch<\/a>[^<]*<\/p>\s*<!-- sprint64-inbound -->/, line);
  });
}

// RU tools hub — stub list (like DE)
patch('ru/tools/index.html', (h) => {
  const block = `<h2 id="sprint64-ru-tool-stubs">RU-зеркала tools (noindex → EN)</h2>
<ul>
<li><a href="/ru/tools/visa-finder/">Visa Finder</a> → <a href="/tools/visa-finder/">EN</a></li>
<li><a href="/ru/tools/income-test/">Income Test</a> → <a href="/tools/income-test/">EN</a></li>
<li><a href="/ru/tools/bank-checker/">Bank Checker</a> → <a href="/tools/bank-checker/">EN</a></li>
<li><a href="/ru/tools/document-checklist/">Checklist</a> → <a href="/tools/document-checklist/">EN</a></li>
<li><a href="/ru/tools/expiry-countdown/">Countdown</a> → <a href="/tools/expiry-countdown/">EN</a></li>
<li><a href="/ru/tools/reminder/">Reminder</a> → <a href="/tools/reminder/">EN</a></li>
<li><a href="/ru/tools/cost-calculator/">Cost calc</a> → <a href="/tools/cost-calculator/">EN</a></li>
<li><a href="/ru/tools/currency-converter/">FX</a> → <a href="/tools/currency-converter/">EN</a></li>
<li><a href="/ru/tools/eligibility/">LTR check</a> → <a href="/tools/eligibility/">EN</a></li>
</ul>\n<!-- ${MARKER} -->\n`;
  return h.replace('<h2>Страницы /ru/tools/*</h2>', block + '<h2>Страницы /ru/tools/*</h2>');
});

// Locale homes — sitemap + work-permit
patch('de/index.html', (h) => {
  const block = `<p><a href="/de/sitemap/">Sitemap (DE)</a> · <a href="/de/work-permit/">Work permit (DE)</a> · <a href="/de/pattaya/germany-to-thailand/">Deutschland → Thailand</a></p>\n<!-- ${MARKER} -->\n`;
  return h.replace('<h2 id="sprint62-de-landings">', `${block}<h2 id="sprint62-de-landings">`);
});

patch('ru/index.html', (h) => {
  const block = `<p><a href="/ru/sitemap/">Карта сайта</a> · <a href="/ru/work-permit/">Work permit (RU)</a> · <a href="/ru/pattaya/russia-to-thailand/">Россия → Таиланд</a></p>\n<!-- ${MARKER} -->\n`;
  return h.replace('<h2 id="sprint62-ru-landings">', `${block}<h2 id="sprint62-ru-landings">`);
});

// EN professions hub — digital-nomad stub
patch('professions/index.html', (h) => {
  const block = `<p><a href="/professions/digital-nomad/">Digital nomad (EN)</a> · <a href="/de/digital-nomad/">Nomad (DE)</a> · <a href="/ru/digital-nomad/">Nomad (RU)</a></p>\n<!-- ${MARKER} -->\n`;
  return h.replace('<main id="main"', `${block}<main id="main"`);
});

// Cross-link weak DE areas from indexed DE jomtien guide
patch('de/guides/jomtien-immigration-office/index.html', (h) => {
  const extra = `<p><strong>Pattaya DE:</strong> <a href="/de/pattaya/jomtien/">Jomtien</a> · <a href="/de/pattaya/living-in-pattaya/">Living</a> · <a href="/de/pattaya/germany-to-thailand/">DE → TH</a> · <a href="/de/pattaya/uk-to-thailand/">UK → TH</a> · <a href="/de/pattaya/usa-to-thailand/">USA → TH</a></p>\n<!-- ${MARKER} -->\n`;
  if (h.includes(MARKER)) return h;
  return h.replace('<main id="main"', `${extra}<main id="main"`);
});

// Footer on sitemap pages
for (const p of ['de/sitemap/index.html', 'ru/sitemap/index.html']) {
  patch(p, (h) => {
    const home = p.startsWith('de/') ? '/de/' : '/ru/';
    const block = `<p style="margin-top:1.5rem"><a href="${home}">← ${p.startsWith('de/') ? 'DE Start' : 'RU главная'}</a> · <a href="/sitemap/">EN sitemap</a></p>\n<!-- ${MARKER} -->\n`;
    return h.replace('</main>', `${block}</main>`);
  });
}

for (const p of ['de/work-permit/index.html', 'ru/work-permit/index.html']) {
  patch(p, (h) => {
    const home = p.startsWith('de/') ? '/de/' : '/ru/';
    const block = `<p><a href="${home}">← Hub</a> · <a href="/work-permit/">EN work permit</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>\n<!-- ${MARKER} -->\n`;
    if (h.includes('<main')) return h.replace(/<main[^>]*>/, (m) => `${m}\n${block}`);
    return h;
  });
}

patch('digital-nomad/index.html', (h) => {
  const block = `<p><a href="/professions/digital-nomad/">Profession: digital nomad (legacy URL)</a></p>\n<!-- ${MARKER}-dn -->\n`;
  if (h.includes(`${MARKER}-dn`)) return h;
  return h.replace('<main id="main"', `${block}<main id="main"`);
});

patch('sitemap/index.html', (h) => {
  const block = `<p><a href="/de/sitemap/">Sitemap (DE)</a> · <a href="/ru/sitemap/">Sitemap (RU)</a></p>\n<!-- ${MARKER}-sm -->\n`;
  if (h.includes(`${MARKER}-sm`)) return h;
  return h.replace('<main id="main"', `${block}<main id="main"`);
});

patch('de/digital-nomad/index.html', (h) => {
  const block = `<p><a href="/professions/digital-nomad/">Digital nomad (EN legacy)</a> · <a href="/digital-nomad/">Nomad hub (EN)</a></p>\n<!-- ${MARKER}-dn -->\n`;
  if (h.includes(`${MARKER}-dn`)) return h;
  if (!h.includes('<main')) return h;
  return h.replace(/<main[^>]*>/, (m) => `${m}\n${block}`);
});

patch('changelog/index.html', (h) => {
  const block = `<p><a href="/de/sitemap/">DE sitemap</a> · <a href="/ru/sitemap/">RU sitemap</a></p>\n<!-- ${MARKER}-sm -->\n`;
  if (h.includes(`${MARKER}-sm`)) return h;
  return h.replace('<h2>Sprint 63', `${block}<h2>Sprint 63`);
});

console.log('Sprint 64 inbound done');
