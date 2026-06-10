/**
 * E-E-A-T pass: add a visible named-author byline and Person author JSON-LD
 * to every guide and blog article (EN/DE/RU).
 *
 * - Visible byline appended to the .article-meta row, localized per language.
 * - Article/BlogPosting JSON-LD gets author = Person Tim Paemi + publisher Org.
 * - Pages with no Article schema get the author on their WebPage block instead.
 * - <meta name="author"> normalized to the named person.
 */
const fs = require('fs');
const path = require('path');

const AUTHOR_URL = 'https://pattayavisahelp.com/about/#author';
const PERSON = { '@type': 'Person', name: 'Tim Paemi', url: AUTHOR_URL };
const PUBLISHER = {
  '@type': 'Organization',
  name: 'Pattaya Visa Help',
  url: 'https://pattayavisahelp.com',
  logo: { '@type': 'ImageObject', url: 'https://pattayavisahelp.com/favicon.svg' },
};

const BYLINE = {
  en: 'BY <a href="/about/#author">TIM PAEMI</a>',
  de: 'VON <a href="/about/#author">TIM PAEMI</a>',
  ru: 'АВТОР: <a href="/about/#author">TIM PAEMI</a>',
};

const ARTICLE_TYPES = new Set(['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'HowTo']);

function collectFiles() {
  const files = [];
  for (const base of ['guides', 'blog', 'de/guides', 'ru/guides', 'de/blog', 'ru/blog']) {
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      const f = path.join(base, d, 'index.html');
      if (fs.existsSync(f)) files.push(f);
    }
  }
  return files;
}

function langOf(file) {
  if (file.startsWith('de' + path.sep)) return 'de';
  if (file.startsWith('ru' + path.sep)) return 'ru';
  return 'en';
}

function typesOf(obj) {
  const t = obj && obj['@type'];
  return Array.isArray(t) ? t : t ? [t] : [];
}

const report = { byline: 0, articleLd: 0, webpageLd: 0, metaAuthor: 0, skipped: [], jsonErrors: [] };

for (const file of collectFiles()) {
  let html = fs.readFileSync(file, 'utf8');
  const lang = langOf(file);
  let changed = false;

  // 1. Visible byline in the article-meta row.
  if (!html.includes('class="byline"') && html.includes('class="article-meta"')) {
    html = html.replace(
      /(<div class="article-meta">)([\s\S]*?)(<\/div>)/,
      (m, open, inner, close) =>
        `${open}${inner}<span class="sep">·</span><span class="byline">${BYLINE[lang]}</span>${close}`
    );
    report.byline++;
    changed = true;
  }

  // 2. JSON-LD author/publisher.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let articleDone = false;
  let webpageBlock = null;

  for (const b of blocks) {
    let obj;
    try {
      obj = JSON.parse(b[1]);
    } catch (e) {
      report.jsonErrors.push(`${file}: ${e.message.slice(0, 60)}`);
      continue;
    }
    const nodes = Array.isArray(obj['@graph']) ? obj['@graph'] : [obj];
    let blockChanged = false;
    for (const node of nodes) {
      const types = typesOf(node);
      if (types.some((t) => ARTICLE_TYPES.has(t))) {
        node.author = { ...PERSON };
        if (!node.publisher) node.publisher = { ...PUBLISHER };
        articleDone = true;
        blockChanged = true;
      } else if (types.includes('WebPage') && !webpageBlock) {
        webpageBlock = { raw: b[0], body: b[1], obj, node };
      }
    }
    if (blockChanged) {
      const replacement = `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
      html = html.replace(b[0], replacement);
      report.articleLd++;
      changed = true;
    }
  }

  // 2b. No Article schema anywhere — attach author to the WebPage node.
  if (!articleDone && webpageBlock) {
    if (!webpageBlock.node.author) {
      webpageBlock.node.author = { ...PERSON };
      const replacement = `<script type="application/ld+json">\n${JSON.stringify(webpageBlock.obj, null, 2)}\n</script>`;
      html = html.replace(webpageBlock.raw, replacement);
      report.webpageLd++;
      changed = true;
    }
  } else if (!articleDone && !webpageBlock) {
    report.skipped.push(file);
  }

  // 3. meta name="author"
  const metaRe = /<meta name="author" content="[^"]*"\s*\/?>/;
  if (metaRe.test(html) && !html.includes('<meta name="author" content="Tim Paemi"')) {
    html = html.replace(metaRe, '<meta name="author" content="Tim Paemi" />');
    report.metaAuthor++;
    changed = true;
  }

  if (changed) fs.writeFileSync(file, html);
}

console.log(JSON.stringify(report, null, 2));
