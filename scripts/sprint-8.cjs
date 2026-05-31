const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-guide-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-compare-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-visa-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-hub-expand.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const slug of [
  'privilege-elite-renewal-2026',
  're-entry-permit-pattaya-2026',
  'ltr-boi-application-checklist-2026',
]) {
  const dir = path.join(ROOT, 'blog', slug);
  if (!fs.existsSync(dir)) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 8')) {
  const block = ` 2026-06-05
 SEO sprint 8

 <h2>Sprint 8 — full guide + compare DE/RU grids, visa FAQ expansion, 3 blogs</h2>
 <p>DE/RU overview stubs for <strong>all 36 guides</strong> and <strong>15 compare pages</strong> (102 new locale URLs). FAQPage schema on all 12 DE/RU visa stubs. DE/RU hub pages expanded with guide + compare link grids. New blogs: <a href="/blog/privilege-elite-renewal-2026/">Privilege renewal</a>, <a href="/blog/re-entry-permit-pattaya-2026/">Re-entry permit Pattaya</a>, <a href="/blog/ltr-boi-application-checklist-2026/">LTR BOI checklist</a>. Sitemap 360+ URLs.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-04"/, '"dateModified": "2026-06-05"');
  cl = cl.replace(/UPDATED 4 JUN 2026/g, 'UPDATED 5 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
const newPosts = [
  ['ltr-boi-application-checklist-2026', '2026-06-05', '5 Jun 2026', 'LTR BOI application checklist 2026', 'Read the LTR BOI checklist'],
  ['re-entry-permit-pattaya-2026', '2026-06-05', '5 Jun 2026', 'Re-entry permit at Jomtien — single vs multiple', 'Read the re-entry permit guide'],
  ['privilege-elite-renewal-2026', '2026-06-05', '5 Jun 2026', 'Privilege Elite renewal and tier changes', 'Read the Privilege renewal guide'],
];
for (const [slug, dt, label, h2, linkText] of newPosts) {
  if (bi.includes(slug)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/ed-visa-moe-accreditation-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/ed-visa-moe-accreditation-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 8 complete');
