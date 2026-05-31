/**
 * Rebuild /sitemap/ with full site chrome (nav, footer) — was a bare HTML stub.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const template = fs.readFileSync(path.join(ROOT, 'resources/index.html'), 'utf8');
const hubBody = require('./content/sprint16-hubs.cjs')['/sitemap/'];
const current = fs.readFileSync(path.join(ROOT, 'sitemap/index.html'), 'utf8');

// Preserve link lists from expanded sitemap if present
const lists = current.match(/<h2>[\s\S]*?<\/ul>/g) || [];
const listBlock = lists.filter((b) => !b.includes('Want a personal answer')).join('\n\n');

const mainBody = `${hubBody}

<h2>All pages by section</h2>
${listBlock || '<p>See <a href="/sitemap.xml">sitemap.xml</a> for the machine-readable index.</p>'}`;

let html = template
  .replace(/<title>[^<]*<\/title>/, '<title>Site Map — All Pages on Pattaya Visa Help</title>')
  .replace(/content="Browse every page[^"]*"/, 'content="Browse every page on Pattaya Visa Help — visa pillars, tools, guides, comparisons, profession-specific pages, and Pattaya neighborhood content."')
  .replace(/https:\/\/pattayavisahelp\.com\/resources\//g, 'https://pattayavisahelp.com/sitemap/')
  .replace(/Resources Hub/g, 'Site Map')
  .replace(/\/resources\//g, '/sitemap/')
  .replace(
    /<main id="main" class="article-body">[\s\S]*?<\/main>/,
    `<main id="main" class="article-body">\n${mainBody}\n</main>`
  )
  .replace(
    /<header class="article-head">[\s\S]*?<\/header>/,
    `<header class="article-head">
<div class="crumbs"><a href="/">Home</a><span class="sep">/</span><span>Site Map</span></div>
<span class="article-label">Site index</span>
<h1>Site <span style="color:var(--pink)">Map</span></h1>
<p class="lede">Every indexable page on Pattaya Visa Help — visas, guides, tools, comparisons, professions, glossary, and Pattaya neighbourhoods.</p>
</header>`
  );

fs.writeFileSync(path.join(ROOT, 'sitemap/index.html'), html);
console.log('Fixed sitemap page chrome');
