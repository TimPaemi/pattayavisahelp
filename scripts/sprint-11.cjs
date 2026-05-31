const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-section-indexes.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-landing-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/refresh-date-modified.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-sitemap-hubs.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const slug of [
  'smart-visa-application-2026',
  'permanent-residency-eligibility-2026',
  'overstay-voluntary-surrender-2026',
]) {
  if (!fs.existsSync(path.join(ROOT, 'blog', slug))) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 11')) {
  const block = ` 2026-06-08
 SEO sprint 11

 <h2>Sprint 11 — section indexes, landing DE/RU, case studies 7, 3 blogs, dateModified refresh</h2>
 <p>DE/RU <strong>section index pages</strong> for visas, guides, compare, tools, glossary, professions, budget tiers, Pattaya (16 indexes). DE/RU stubs for <strong>7 landing pages</strong> (digital-nomad, retirement, work-permit, case-studies, healthcare, banking, nomad guide). Case studies expanded 5→7. Blogs: <a href="/blog/smart-visa-application-2026/">SMART application</a>, <a href="/blog/permanent-residency-eligibility-2026/">PR eligibility</a>, <a href="/blog/overstay-voluntary-surrender-2026/">Overstay surrender</a>. Visa pillar dateModified refreshed.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-07"/, '"dateModified": "2026-06-08"');
  cl = cl.replace(/UPDATED 7 JUN 2026/g, 'UPDATED 8 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
for (const [slug, dt, label, h2, linkText] of [
  ['overstay-voluntary-surrender-2026', '2026-06-08', '8 Jun 2026', 'Overstay voluntary surrender — fines and blacklist', 'Read the overstay guide'],
  ['permanent-residency-eligibility-2026', '2026-06-08', '8 Jun 2026', 'Thailand PR eligibility in 2026', 'Read the PR eligibility guide'],
  ['smart-visa-application-2026', '2026-06-08', '8 Jun 2026', 'SMART Visa BOI application checklist', 'Read the SMART visa guide'],
]) {
  if (bi.includes(slug)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/o-a-health-insurance-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/o-a-health-insurance-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 11 complete');
