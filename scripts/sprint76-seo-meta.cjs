/**
 * Sprint 76 — meta title/description SEO fixes (EN money pages + all locale pilots).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const EN_PATCHES = {
  '/': {
    title: 'Pattaya Visa Help — Thailand Visa Guide 2026 | DTV, LTR',
    description:
      'Independent Thailand visa guide from Jomtien, Pattaya. DTV, LTR, Privilege, Non-O retirement, marriage — 12 pathways, costs, checklists. No commissions.',
  },
  '/visas/dtv/': {
    title: 'DTV Thailand Visa 2026 — Application & Requirements',
    description:
      'Destination Thailand Visa (DTV) 2026: 5-year multi-entry, 180 days per stay, ฿500K bank seasoning, ฿10K fee. How to apply, embassy checklist, Pattaya DTV guide.',
  },
  '/visas/retirement-non-o/': {
    title: 'Non-O Retirement Visa Thailand 2026 — Pattaya Guide',
    description:
      'Thailand Non-O retirement visa 2026: age 50+, ฿800K Thai bank or ฿65K/month income, Jomtien extension ฿1,900. Documents, seasoning, vs O-A — Pattaya guide.',
  },
  '/visas/ltr/': {
    title: 'LTR Visa Thailand 2026 — Long-Term Resident Guide',
    description:
      'Thailand LTR visa 2026: 10-year stay, 17% flat tax option, $100K savings or $80K income route. BOI application, Pattaya eligibility, vs DTV and Privilege.',
  },
  '/guides/jomtien-immigration-office/': {
    title: 'Jomtien Immigration Office Pattaya — Hours & Queue 2026',
    description:
      'Jomtien Immigration Office Pattaya 2026: Soi 5 hours, queue times, DTV and Non-O extensions, TM30, 90-day reporting. What to bring, dress code, mistakes to avoid.',
  },
  '/guides/': {
    title: 'Thailand Visa Guides 2026 — Pattaya Compliance Hub',
    description:
      '38 Thailand visa and expat guides from Pattaya: 90-day reporting, TM30, TDAC, Non-O extension, bank accounts, retirement, cost of living. Independent Jomtien advice.',
  },
  '/visas/': {
    title: 'Thailand Visas 2026 — All 12 Pathways | Pattaya Guide',
    description:
      'All 12 Thailand visa types explained: DTV, LTR, Privilege Elite, Non-O retirement, marriage, ED, SMART, tourist. Costs, requirements, Pattaya Jomtien extensions.',
  },
  '/compare/': {
    title: 'Thailand Visa Comparisons 2026 — DTV vs LTR vs Non-O',
    description:
      'Side-by-side Thailand visa comparisons 2026: DTV vs LTR, Non-O vs O-A, Privilege vs LTR, Pattaya vs Bangkok. Independent cost and requirement analysis.',
  },
  '/pattaya/': {
    title: 'Pattaya Expat Guide 2026 — Areas, Visas & Living',
    description:
      'Living in Pattaya 2026: Jomtien, Pratumnak, Naklua neighbourhoods, visa extensions, cost of living, immigration office. Independent expat guide from Jomtien.',
  },
  '/faq/': {
    title: 'Thailand Visa FAQ 2026 — Pattaya Immigration Answers',
    description:
      'Frequently asked Thailand visa questions answered: DTV bank seasoning, Non-O ฿800K, 90-day reporting, TM30, overstay fines, Jomtien extensions. Pattaya 2026.',
  },
  '/tools/visa-finder/': {
    title: 'Thailand Visa Finder Tool 2026 — Best Visa Match',
    description:
      'Free Thailand visa finder: answer 8 questions, get DTV, LTR, Non-O, ED or tourist match with cost estimate. Independent tool from Pattaya Visa Help — no agent bias.',
  },
};

function loadPilot() {
  const src = fs.readFileSync(path.join(__dirname, 'audit-meta-indexed.cjs'), 'utf8');
  const m = src.match(/const PILOT = new Set\(\[([\s\S]*?)\]\)/);
  return new Set([...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
}

const PILOT = loadPilot();

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function setMeta(html, name, content, attr = 'name') {
  if (!content) return html;
  const esc = content.replace(/"/g, '&quot;');
  const re1 = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["'][^"']*["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["'][^"']*["'][^>]+${attr}=["']${name}["']`, 'i');
  const repl = (m) => m.replace(/content=["'][^"']*["']/i, `content="${esc}"`);
  if (re1.test(html)) return html.replace(re1, repl);
  if (re2.test(html)) return html.replace(re2, repl);
  return html;
}

function applyPatch(file, patch) {
  let html = fs.readFileSync(file, 'utf8');
  if (patch.title) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${patch.title}</title>`);
    html = setMeta(html, 'og:title', patch.title, 'property');
    html = setMeta(html, 'twitter:title', patch.title);
  }
  if (patch.description) {
    html = setMeta(html, 'description', patch.description);
    html = setMeta(html, 'og:description', patch.description, 'property');
    html = setMeta(html, 'twitter:description', patch.description);
  }
  fs.writeFileSync(file, html);
}

function localeDesc(p) {
  const lang = p.startsWith('/de/') ? 'de' : 'ru';
  const parts = p.split('/').filter(Boolean);
  const section = parts[1] || '';
  const slug = parts[2] || parts[1] || 'home';
  const slugHuman = slug.replace(/-/g, ' ');

  const DE = {
    visas: `${slugHuman.toUpperCase()} Visum Thailand 2026 auf Deutsch — Voraussetzungen, Kosten, Antrag aus Pattaya/Jomtien. Unabhängiger Leitfaden ohne Agentenprovisionen.`,
    compare: `Vergleich ${slugHuman} auf Deutsch — DTV, LTR, Non-O Trade-offs für Expats in Thailand 2026. Pattaya Visa Help: unabhängige Beratung aus Jomtien.`,
    professions: `Thailand-Visa für ${slugHuman} auf Deutsch — DTV, LTR, Non-B Optionen Pattaya 2026. Unabhängiger Leitfaden, keine Provisionen.`,
    guides:
      parts.length > 2
        ? `Leitfaden ${slugHuman} auf Deutsch — Pattaya Visa Help: Schritte, Checklisten, Jomtien-Tipps 2026. Unabhängige Visa-Beratung ohne Agenten.`
        : `Deutschsprachige Thailand-Visa-Leitfäden — Pattaya/Jomtien 2026. DTV, Non-O, TM30, 90-Tage, Bankkonto. Unabhängig, ohne Provisionen.`,
    tools: `Visa-Tools auf Deutsch — Rechner, Checklisten, Visa Finder. Pattaya Visa Help 2026: unabhängige Beratung aus Jomtien, keine Agentenprovisionen.`,
    glossary: `Visa-Glossar ${slugHuman} auf Deutsch — Thailand Immigration Begriffe erklärt. Pattaya Visa Help 2026, unabhängige Jomtien-Beratung.`,
    'best-visa': `Beste Thailand-Visa nach Budget auf Deutsch — DTV, Non-O, Tourist ab ฿5k. Pattaya 2026: unabhängiger Vergleich ohne Agentenprovisionen.`,
    pattaya: `Pattaya ${slugHuman} auf Deutsch — Visa, Leben, Immigration Jomtien 2026. Unabhängiger Expats-Leitfaden von Pattaya Visa Help.`,
    '': `Pattaya Visa Help auf Deutsch — Thailand Visa DTV, LTR, Non-O 2026. Unabhängige Beratung aus Jomtien, keine Agentenprovisionen.`,
  };

  const RU = {
    visas: `Виза ${slugHuman} Таиланд 2026 на русском — требования, стоимость, подача из Паттайи/Jomtien. Независимый гид без комиссий агентов.`,
    compare: `Сравнение ${slugHuman} на русском — DTV, LTR, Non-O для экспатов в Таиланде 2026. Pattaya Visa Help: независимая консультация Jomtien.`,
    professions: `Виза Таиланд для ${slugHuman} на русском — DTV, LTR, Non-B Паттайя 2026. Независимый гид, без комиссий.`,
    guides:
      parts.length > 2
        ? `Гид ${slugHuman} на русском — Pattaya Visa Help: шаги, чеклисты, Jomtien 2026. Независимая визовая консультация.`
        : `Русскоязычные гиды по визам Таиланда — Паттайя/Jomtien 2026. DTV, Non-O, TM30, 90-day, банк. Без комиссий.`,
    tools: `Визовые инструменты на русском — калькулятор, чеклисты, Visa Finder. Pattaya Visa Help 2026, независимая консультация Jomtien.`,
    glossary: `Глоссарий ${slugHuman} на русском — термины иммиграции Таиланда. Pattaya Visa Help 2026, независимый гид.`,
    'best-visa': `Лучшая виза Таиланд по бюджету на русском — DTV, Non-O от ฿5k. Паттайя 2026: независимое сравнение.`,
    pattaya: `Паттайя ${slugHuman} на русском — виза, жизнь, иммиграция Jomtien 2026. Независимый гид Pattaya Visa Help.`,
    '': `Pattaya Visa Help на русском — визы Таиланд DTV, LTR, Non-O 2026. Независимая консультация Jomtien, без комиссий.`,
  };

  const table = lang === 'de' ? DE : RU;
  let desc = table[section] || table[''];
  if (desc.length > 165) desc = desc.slice(0, 162) + '…';
  if (desc.length < 120) desc = desc + ' Pattaya Visa Help 2026.';
  return desc.slice(0, 165);
}

let en = 0;
for (const [p, patch] of Object.entries(EN_PATCHES)) {
  const file = urlToFile(p);
  if (!fs.existsSync(file)) continue;
  applyPatch(file, patch);
  en++;
  console.log('EN meta', p);
}

let loc = 0;
for (const p of PILOT) {
  const file = urlToFile(p);
  if (!fs.existsSync(file)) continue;
  let desc = localeDesc(p);
  while (desc.length < 120) desc += ' Unabhängig 2026.';
  if (desc.length > 165) desc = desc.slice(0, 162) + '…';
  applyPatch(file, { description: desc });
  loc++;
}
console.log(`EN patches: ${en}, locale desc: ${loc}`);
