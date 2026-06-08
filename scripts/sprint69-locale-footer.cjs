/**
 * Sprint 69 — locale footer, nav, brand, crumbs on indexed DE/RU pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint69-locale-footer';

const sm = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const PILOTS = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);

const FOOTER = {
  de: {
    tagline: 'Gebaut in Pattaya. Für Pattaya.',
    tag: 'Unabhängige Thailand-Visa-Beratung aus Jomtien. 12 Wege, echte Kosten, keine Agenten-Provisionen.',
    visas: `<div><p class="f-col-h">Visa</p>
<a href="/de/visas/dtv/">DTV</a><a href="/de/visas/ltr/">LTR</a><a href="/de/visas/privilege-elite/">Privilege</a><a href="/de/visas/retirement-non-o/">Rente</a><a href="/de/visas/marriage-non-o/">Ehe</a><a href="/de/visas/">Alle 12 →</a>
</div>`,
    tools: `<div><p class="f-col-h">Tools</p>
<a href="/de/tools/visa-finder/">Visa-Finder</a><a href="/de/tools/cost-calculator/">Kosten</a><a href="/de/tools/income-test/">Einkommen</a><a href="/de/tools/document-checklist/">Checkliste</a><a href="/de/tools/">Alle Tools →</a>
</div>`,
    learn: `<div><p class="f-col-h">Wissen</p>
<a href="/blog/">Blog</a><a href="/de/faq/">FAQ</a><a href="/de/glossary/">Glossar</a><a href="/de/guides/">Leitfäden</a><a href="/changelog/">Changelog</a>
</div>`,
    about: `<div><p class="f-col-h">Über uns</p>
<a href="/about/">Team</a><a href="/contact/">Kontakt</a><a href="/privacy/">Datenschutz</a><a href="/terms/">AGB</a><a href="https://pattaya-authority.com/work/pattaya-visa-help/" target="_blank" rel="noopener noreferrer">Pattaya Authority ↗</a>
</div>`,
  },
  ru: {
    tagline: 'Сделано в Паттайе. Для Паттайи.',
    tag: 'Независимая визовая консультация из Jomtien. 12 маршрутов, реальные расходы, без комиссий агентам.',
    visas: `<div><p class="f-col-h">Визы</p>
<a href="/ru/visas/dtv/">DTV</a><a href="/ru/visas/ltr/">LTR</a><a href="/ru/visas/privilege-elite/">Privilege</a><a href="/ru/visas/retirement-non-o/">Пенсия</a><a href="/ru/visas/marriage-non-o/">Брак</a><a href="/ru/visas/">Все 12 →</a>
</div>`,
    tools: `<div><p class="f-col-h">Tools</p>
<a href="/ru/tools/visa-finder/">Подбор визы</a><a href="/ru/tools/cost-calculator/">Расходы</a><a href="/ru/tools/income-test/">Доход</a><a href="/ru/tools/document-checklist/">Документы</a><a href="/ru/tools/">Все tools →</a>
</div>`,
    learn: `<div><p class="f-col-h">Учёба</p>
<a href="/blog/">Блог</a><a href="/ru/faq/">FAQ</a><a href="/ru/glossary/">Глоссарий</a><a href="/ru/guides/">Гиды</a><a href="/changelog/">Changelog</a>
</div>`,
    about: `<div><p class="f-col-h">О нас</p>
<a href="/about/">О проекте</a><a href="/contact/">Контакт</a><a href="/privacy/">Конфиденциальность</a><a href="/terms/">Условия</a><a href="https://pattaya-authority.com/work/pattaya-visa-help/" target="_blank" rel="noopener noreferrer">Pattaya Authority ↗</a>
</div>`,
  },
};

function patch(h, lang) {
  const pre = `/${lang}/`;
  const t = FOOTER[lang];
  if (!t) return h;

  if (h.includes('class="f-grid"') && !h.includes(MARKER)) {
    h = h.replace(/Built in Pattaya\. For Pattaya\./, t.tagline);
    h = h.replace(
      /Independent Thailand visa guidance from Jomtien\. 12 pathways mapped, real costs, no agent commissions\./,
      t.tag
    );
    h = h.replace(
      /<div><p class="f-col-h">Visas<\/p>[\s\S]*?<\/div>\s*<div><p class="f-col-h">Tools<\/p>[\s\S]*?<\/div>\s*<div><p class="f-col-h">Learn<\/p>[\s\S]*?<\/div>\s*<div><p class="f-col-h">About<\/p>[\s\S]*?<\/div>/,
      `${t.visas}\n${t.tools}\n${t.learn}\n${t.about}\n<!-- ${MARKER} -->`
    );
  }

  h = h.replace(/<a href="\/" class="brand">/g, `<a href="${pre}" class="brand">`);

  /* Top nav only (floating pill) — avoid touching in-article EN pillar links */
  h = h.replace(
    /<nav class="nav" aria-label="Primary">([\s\S]*?)<\/nav>/g,
    (m, inner) => {
      let n = inner;
      if (lang === 'de') {
        n = n
          .replace(/href="\/#visas"/, 'href="/de/visas/"')
          .replace(/>Visas</, '>Visa<')
          .replace(/href="\/tools\/"/, 'href="/de/tools/"')
          .replace(/href="\/faq\/"/, 'href="/de/faq/"');
      } else {
        n = n
          .replace(/href="\/#visas"/, 'href="/ru/visas/"')
          .replace(/>Visas</, '>Визы<')
          .replace(/href="\/tools\/"/, 'href="/ru/tools/"')
          .replace(/href="\/faq\/"/, 'href="/ru/faq/"');
      }
      return `<nav class="nav" aria-label="Primary">${n}</nav>`;
    }
  );

  if (lang === 'de') {
    h = h.replace(
      /<div class="crumbs"><a href="\/">Home<\/a>/g,
      '<div class="crumbs"><a href="/de/">Start</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/guides\/">Guides<\/a>/g,
      '$1<a href="/de/guides/">Leitfäden</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/visas\/">Visas<\/a>/g,
      '$1<a href="/de/visas/">Visa</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/compare\/">Compare<\/a>/g,
      '$1<a href="/de/compare/">Vergleich</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/professions\/">Professions<\/a>/g,
      '$1<a href="/de/professions/">Berufe</a>'
    );
    h = h.replace(/aria-label="Back to top"/g, 'aria-label="Nach oben"');
    h = h.replace(/<a href="\/visas\/">All visas<\/a>/g, '<a href="/de/visas/">Alle Visa (DE)</a>');
  } else {
    h = h.replace(
      /<div class="crumbs"><a href="\/">Home<\/a>/g,
      '<div class="crumbs"><a href="/ru/">Главная</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/guides\/">Guides<\/a>/g,
      '$1<a href="/ru/guides/">Гиды</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/visas\/">Visas<\/a>/g,
      '$1<a href="/ru/visas/">Визы</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/compare\/">Compare<\/a>/g,
      '$1<a href="/ru/compare/">Сравнение</a>'
    );
    h = h.replace(
      /(<div class="crumbs">[\s\S]*?)<a href="\/professions\/">Professions<\/a>/g,
      '$1<a href="/ru/professions/">Профессии</a>'
    );
    h = h.replace(/aria-label="Back to top"/g, 'aria-label="Наверх"');
    h = h.replace(/<a href="\/visas\/">All visas<\/a>/g, '<a href="/ru/visas/">Все визы (RU)</a>');
  }

  return h;
}

let n = 0;
for (const url of PILOTS) {
  if (!url.startsWith('/de/') && !url.startsWith('/ru/')) continue;
  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  const rel = url === '/de/' || url === '/ru/' ? `${lang}/index.html` : url.slice(1) + 'index.html';
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.warn('missing', url);
    continue;
  }
  const before = fs.readFileSync(file, 'utf8');
  const after = patch(before, lang);
  if (after !== before) {
    fs.writeFileSync(file, after);
    n++;
    console.log('locale shell', url);
  }
}
console.log(`Patched ${n} pilot pages`);
