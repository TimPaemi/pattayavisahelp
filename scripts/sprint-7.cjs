const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-profession-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-guide-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 7')) {
  const block = ` 2026-06-04
 SEO sprint 7

 <h2>Sprint 7 — guide DE/RU stubs, profession hreflang fix, ED MOE blog</h2>
 <p>DE/RU overview stubs for 5 top guides (90-day, TM30, Jomtien, bank account, cost of living) — 10 new locale URLs with hreflang triangles. Fixed EN profession pages to point hreflang at locale-specific profession URLs. New blog: <a href="/blog/ed-visa-moe-accreditation-2026/">ED visa MOE accreditation check</a>.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-03"/, '"dateModified": "2026-06-04"');
  cl = cl.replace(/UPDATED 3 JUN 2026/g, 'UPDATED 4 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
if (!bi.includes('ed-visa-moe-accreditation-2026')) {
  bi = bi.replace(
    '<article>\n <a href="/blog/non-o-extension-documents-2026/">',
    `<article>
 <a href="/blog/ed-visa-moe-accreditation-2026/">
 <time datetime="2026-06-04">4 Jun 2026</time>
 <h2>ED visa MOE accreditation — verify before you pay</h2>
 Read the ED school verification guide
 </a>
 </article>
 <article>
 <a href="/blog/non-o-extension-documents-2026/">`
  );
  fs.writeFileSync(blogIndex, bi);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 7 complete');
