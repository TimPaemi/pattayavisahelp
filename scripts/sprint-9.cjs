const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-glossary-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-best-visa-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-pattaya-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const slug of ['marriage-non-o-documents-2026', 'work-permit-renewal-pattaya-2026']) {
  if (!fs.existsSync(path.join(ROOT, 'blog', slug))) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 9')) {
  const block = ` 2026-06-06
 SEO sprint 9

 <h2>Sprint 9 — glossary, budget tier, Pattaya area DE/RU grids, 2 blogs</h2>
 <p>DE/RU stubs for <strong>all 35 glossary terms</strong>, <strong>6 best-visa budget tiers</strong>, and <strong>7 Pattaya neighborhood guides</strong> (96 locale URLs). New blogs: <a href="/blog/marriage-non-o-documents-2026/">Marriage Non-O documents</a>, <a href="/blog/work-permit-renewal-pattaya-2026/">Work permit renewal Pattaya</a>. Sitemap 450+ URLs.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-05"/, '"dateModified": "2026-06-06"');
  cl = cl.replace(/UPDATED 5 JUN 2026/g, 'UPDATED 6 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
for (const [slug, dt, label, h2, linkText] of [
  ['work-permit-renewal-pattaya-2026', '2026-06-06', '6 Jun 2026', 'Work permit renewal in Pattaya 2026', 'Read the work permit renewal guide'],
  ['marriage-non-o-documents-2026', '2026-06-06', '6 Jun 2026', 'Marriage Non-O extension documents', 'Read the Marriage Non-O checklist'],
]) {
  if (bi.includes(slug)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/ltr-boi-application-checklist-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/ltr-boi-application-checklist-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 9 complete');
