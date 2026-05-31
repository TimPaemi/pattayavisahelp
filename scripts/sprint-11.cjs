const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
for (const [slug, dt, label, h2, linkText] of [
  ['overstay-voluntary-surrender-2026', '2026-06-08', '8 Jun 2026', 'Overstay voluntary surrender — what happens in 2026', 'Read the overstay surrender guide'],
  ['permanent-residency-eligibility-2026', '2026-06-08', '8 Jun 2026', 'Permanent residency eligibility — who qualifies', 'Read the PR eligibility guide'],
  ['smart-visa-application-2026', '2026-06-08', '8 Jun 2026', 'SMART visa application — Pattaya tech workers', 'Read the SMART visa guide'],
]) {
  if (bi.includes(`href="/blog/${slug}/"`)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/dtv-tax-residency-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/dtv-tax-residency-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 11')) {
  const block = ` 2026-06-08
 SEO sprint 11

 <h2>Sprint 11 — blog index parity for SMART, PR, and overstay guides</h2>
 <p>Surfaced <a href="/blog/smart-visa-application-2026/">SMART visa</a>, <a href="/blog/permanent-residency-eligibility-2026/">PR eligibility</a>, and <a href="/blog/overstay-voluntary-surrender-2026/">overstay surrender</a> on the blog hub. Sitemap refresh.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-07"/, '"dateModified": "2026-06-08"');
  cl = cl.replace(/UPDATED 7 JUN 2026/g, 'UPDATED 8 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 11 complete');
