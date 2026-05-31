const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-profession-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-origin-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 6')) {
  const block = ` 2026-06-03
 SEO sprint 6

 <h2>Sprint 6 — all profession DE/RU stubs, origin locale pages, auto-blog pipeline</h2>
 <p>Extended DE/RU profession overviews to all 16 profession pages (32 new locale URLs). Added <a href="/de/pattaya/germany-to-thailand/">Germany → Thailand (DE)</a> and <a href="/ru/pattaya/russia-to-thailand/">Russia → Thailand (RU)</a> origin stubs with proper hreflang triangles. New blog from policy radar: <a href="/blog/non-o-extension-documents-2026/">Non-O extension documents</a>. Scripts: auto-blog-from-radar.cjs, update-feed.cjs, locale-origin-stubs.cjs. Sitemap now 240+ URLs.</p>

 2026-06-02
 SEO sprint 5

 <h2>Sprint 5 — profession hreflang, TM30 + DTV seasoning blogs</h2>
 <p>DE/RU profession stubs for top 6 professions, hreflang on all profession + origin country pages. Blogs: <a href="/blog/tm30-landlord-refusal-2026/">TM30 landlord refusal</a>, <a href="/blog/dtv-embassy-seasoning-2026/">DTV embassy seasoning</a>. Visa stub FAQs on DTV/LTR/Non-O.</p>

 2026-05-31
 SEO sprint 4

 <h2>Sprint 4 — 24 DE/RU visa locale pages + RD743 blog</h2>
 <p>Full <code>/de/visas/*</code> and <code>/ru/visas/*</code> stub grid for all 12 visa pillars. Comparison matrix ItemList expanded to 12 visas. Case studies 3→5. Blog: <a href="/blog/ltr-royal-decree-743-2026/">Royal Decree 743</a>.</p>

 2026-05-31
 SEO sprint 3

 <h2>Sprint 3 — compare ItemList, case studies, hreflang</h2>
 <p>DE/RU hreflang on visa pillars, ItemList schema on 15 compare pages, 2 new case studies, weekly blog GitHub Action.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-05-18"/, '"dateModified": "2026-06-03"');
  cl = cl.replace(/UPDATED 18 MAY 2026/g, 'UPDATED 3 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
if (!bi.includes('non-o-extension-documents-2026')) {
  bi = bi.replace(
    '<article>\n <a href="/blog/tm30-landlord-refusal-2026/">',
    `<article>
 <a href="/blog/non-o-extension-documents-2026/">
 <time datetime="2026-06-03">3 Jun 2026</time>
 <h2>Non-O extension documents — Jomtien checklist</h2>
 Read the Non-O extension guide
 </a>
 </article>
 <article>
 <a href="/blog/tm30-landlord-refusal-2026/">`
  );
  fs.writeFileSync(blogIndex, bi);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log('Sprint 6 complete');
