const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-tools-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-origin-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-sitemap-hubs.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const slug of ['o-a-health-insurance-2026', 'tourist-visa-extension-2026', 'dtv-tax-residency-2026']) {
  if (!fs.existsSync(path.join(ROOT, 'blog', slug))) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const sitemapEn = path.join(ROOT, 'sitemap/index.html');
if (fs.existsSync(sitemapEn)) {
  let html = fs.readFileSync(sitemapEn, 'utf8');
  if (!html.includes('/de/sitemap/')) {
    html = html.replace(
      `<link rel="alternate" hreflang="en" href="https://pattayavisahelp.com/sitemap/" />\n<link rel="alternate" hreflang="x-default" href="https://pattayavisahelp.com/sitemap/" />`,
      `<link rel="alternate" hreflang="en" href="https://pattayavisahelp.com/sitemap/" />\n<link rel="alternate" hreflang="de" href="https://pattayavisahelp.com/de/sitemap/" />\n<link rel="alternate" hreflang="ru" href="https://pattayavisahelp.com/ru/sitemap/" />\n<link rel="alternate" hreflang="x-default" href="https://pattayavisahelp.com/sitemap/" />`
    );
    fs.writeFileSync(sitemapEn, html);
  }
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 10')) {
  const block = ` 2026-06-07
 SEO sprint 10

 <h2>Sprint 10 — tools DE/RU, origin locale grid, locale sitemaps, 3 blogs, CI auto-commit</h2>
 <p>DE/RU stubs for <strong>9 tools</strong>, <strong>5 additional origin countries</strong> (UK, USA, Australia, China, India), and <strong>/de/sitemap/</strong> + <strong>/ru/sitemap/</strong> hub pages. Blogs: <a href="/blog/o-a-health-insurance-2026/">O-A health insurance</a>, <a href="/blog/tourist-visa-extension-2026/">Tourist extension</a>, <a href="/blog/dtv-tax-residency-2026/">DTV tax residency</a>. Weekly blog workflow now auto-commits radar output.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-06"/, '"dateModified": "2026-06-07"');
  cl = cl.replace(/UPDATED 6 JUN 2026/g, 'UPDATED 7 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
for (const [slug, dt, label, h2, linkText] of [
  ['dtv-tax-residency-2026', '2026-06-07', '7 Jun 2026', 'DTV tax residency — what nomads owe in 2026', 'Read the DTV tax guide'],
  ['tourist-visa-extension-2026', '2026-06-07', '7 Jun 2026', 'Tourist visa extension — 30 days at Jomtien', 'Read the tourist extension guide'],
  ['o-a-health-insurance-2026', '2026-06-07', '7 Jun 2026', 'O-A health insurance — THB 3M rule', 'Read the O-A insurance guide'],
]) {
  if (bi.includes(slug)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/work-permit-renewal-pattaya-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/work-permit-renewal-pattaya-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 10 complete');
