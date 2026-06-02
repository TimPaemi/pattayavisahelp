/**
 * Content + design quality audit — FAIL pages should not be indexed.
 * Usage: node scripts/audit-content-quality.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIN_WORDS_INDEX = 400;
const MIN_WORDS_ARTICLE = 600;
const MIN_WORDS_BLOG = 500;
const LOCALE_HUBS = new Set(['/de/', '/ru/']);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function pagePath(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace('/index.html', '') + '/';
}

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function analyze(file) {
  const html = fs.readFileSync(file, 'utf8');
  const p = pagePath(file);
  const words = wordCount(html);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || 'index,follow';
  const noindex = /noindex/i.test(robots);
  const isLocale = p.startsWith('/de/') || p.startsWith('/ru/');
  const isLocaleHub = LOCALE_HUBS.has(p);
  const isBlog = p.startsWith('/blog/');
  const isStubLink = /<main[^>]*>[\s\S]*?Vollständiger Leitfaden \(EN\)|Полный гид \(EN\)|Полное сравнение \(EN\)|Открыть инструмент \(EN\)/i.test(html);

  const design = {
    hasNav: /class="nav"/.test(html) || /class='nav'/.test(html),
    hasMq: /class="mq"/.test(html),
    hasFullFooter: /class="f-grid"/.test(html) || /f-disclaim/.test(html),
    hasOg: /<meta property="og:title"/.test(html),
    hasFonts: /\/assets\/fonts\/fonts(-pilot)?\.css/.test(html) || /preload[^>]+\.woff2/i.test(html),
    hasMobileNav: /class="mnav"/.test(html) || /__mnavLoaded/.test(html),
  };

  const designFails = [];
  if (!isLocale || isLocaleHub) {
    if (!design.hasNav && !isBlog) designFails.push('missing nav');
    if (!design.hasMq && !isLocale) designFails.push('missing marquee');
    if (!design.hasFullFooter && !isLocale) designFails.push('missing full footer');
    if (!design.hasOg && !noindex) designFails.push('missing og:title');
    if (!design.hasFonts && !isLocale) designFails.push('missing self-hosted fonts');
  }
  if (isLocale && !isLocaleHub) {
    if (!design.hasNav) designFails.push('stub: no nav');
    if (!design.hasFullFooter) designFails.push('stub: minimal footer');
    if (isStubLink) designFails.push('locale stub (link-only body)');
  }

  let minWords = MIN_WORDS_INDEX;
  if (isBlog) minWords = MIN_WORDS_BLOG;
  else if (p.startsWith('/visas/') || p.startsWith('/guides/') || p.startsWith('/compare/')) minWords = MIN_WORDS_ARTICLE;

  const contentFails = [];
  if (!noindex && words < minWords) contentFails.push(`thin content (${words}w, need ${minWords})`);
  if (isStubLink && !noindex) contentFails.push('unpublished locale stub indexed');

  const fails = [...designFails, ...contentFails];
  let verdict = 'PASS';
  if (fails.some((f) => f.includes('stub') || f.includes('thin') || f.includes('unpublished'))) verdict = 'FAIL';
  else if (fails.length) verdict = 'WARN';
  if (noindex && fails.length) verdict = verdict === 'FAIL' ? 'FAIL_NOINDEX' : 'NOINDEX';

  return { path: p, words, noindex, isLocale, isLocaleHub, isStubLink, design, fails, verdict };
}

const pages = walk(ROOT).map(analyze);
const indexed = pages.filter((p) => !p.noindex);
const failIndexed = indexed.filter((p) => p.verdict === 'FAIL');
const warnIndexed = indexed.filter((p) => p.verdict === 'WARN');
const stubs = pages.filter((p) => p.isStubLink);

const report = {
  generated: new Date().toISOString(),
  totals: {
    pages: pages.length,
    indexed: indexed.length,
    failIndexed: failIndexed.length,
    warnIndexed: warnIndexed.length,
    localeStubs: stubs.length,
  },
  verdict: failIndexed.length === 0 ? (warnIndexed.length ? 'WARN' : 'PASS') : 'FAIL',
  failIndexed: failIndexed.slice(0, 100).map((p) => ({ path: p.path, words: p.words, fails: p.fails })),
  warnIndexed: warnIndexed.slice(0, 50).map((p) => ({ path: p.path, words: p.words, fails: p.fails })),
  localeStubSample: stubs.slice(0, 10).map((p) => p.path),
};

fs.writeFileSync(path.join(ROOT, '_audit-content-quality.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ verdict: report.verdict, ...report.totals }, null, 2));
