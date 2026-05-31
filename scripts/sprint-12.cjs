const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-landing-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-guide-faq.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-sitemap-hubs.cjs', { cwd: ROOT, stdio: 'inherit' });

try {
  execSync('node scripts/network-contextual.cjs', { cwd: ROOT, stdio: 'inherit' });
} catch {
  console.log('network-contextual skipped or partial');
}

for (const slug of [
  'extension-timeline-jomtien-2026',
  'boi-company-setup-visa-2026',
  'visa-agent-red-flags-2026',
]) {
  if (!fs.existsSync(path.join(ROOT, 'blog', slug))) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
execSync('node scripts/auto-blog-from-radar.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 12')) {
  const block = ` 2026-06-09
 SEO sprint 12

 <h2>Sprint 12 — hub landings, guide FAQ schema, GSC blog seeds, sister links</h2>
 <p>DE/RU stubs for <strong>tax, coworking, resources, property, services, FAQ</strong> hubs (12 URLs). FAQPage on 10 top DE guide stubs. Policy radar GSC query seeds. Blogs: <a href="/blog/extension-timeline-jomtien-2026/">Extension timeline</a>, <a href="/blog/boi-company-setup-visa-2026/">BOI company setup</a>, <a href="/blog/visa-agent-red-flags-2026/">Visa agent red flags</a>. Sister-site reciprocal links expanded.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  cl = cl.replace(/"dateModified": "2026-06-08"/, '"dateModified": "2026-06-09"');
  cl = cl.replace(/UPDATED 8 JUN 2026/g, 'UPDATED 9 JUN 2026');
  fs.writeFileSync(changelogPath, cl);
}

const blogIndex = path.join(ROOT, 'blog/index.html');
let bi = fs.readFileSync(blogIndex, 'utf8');
for (const [slug, dt, label, h2, linkText] of [
  ['visa-agent-red-flags-2026', '2026-06-09', '9 Jun 2026', 'Pattaya visa agent red flags 2026', 'Read the scam red flags guide'],
  ['boi-company-setup-visa-2026', '2026-06-09', '9 Jun 2026', 'Thai company setup for Non-B visa', 'Read the BOI company guide'],
  ['extension-timeline-jomtien-2026', '2026-06-09', '9 Jun 2026', 'Extension timeline at Jomtien', 'Read the extension timeline guide'],
]) {
  if (bi.includes(slug)) continue;
  bi = bi.replace(
    '<article>\n <a href="/blog/overstay-voluntary-surrender-2026/">',
    `<article>
 <a href="/blog/${slug}/">
 <time datetime="${dt}">${label}</time>
 <h2>${h2}</h2>
 ${linkText}
 </a>
 </article>
 <article>
 <a href="/blog/overstay-voluntary-surrender-2026/">`
  );
}
fs.writeFileSync(blogIndex, bi);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 12 complete');
