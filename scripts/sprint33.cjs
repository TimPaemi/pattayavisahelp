/**
 * Sprint 33 — self-hosted fonts site-wide + RU DTV indexed pilot.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('=== sprint33-fonts-sitewide ===');
execSync('node scripts/sprint33-fonts-sitewide.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log('\n=== sprint33-ru-dtv ===');
execSync('node scripts/sprint33-ru-dtv.cjs', { cwd: ROOT, stdio: 'inherit' });

// EN + DE lang links
const enDtv = path.join(ROOT, 'visas/dtv/index.html');
let en = fs.readFileSync(enDtv, 'utf8');
en = en.replace(
  'Language: EN · <a href="/de/visas/dtv/">Deutsch (DTV)</a> · <a href="/ru/visas/dtv/">Русский</a>',
  'Language: EN · <a href="/de/visas/dtv/">Deutsch</a> · <a href="/ru/visas/dtv/">Русский (DTV)</a>'
);
fs.writeFileSync(enDtv, en);

const deDtv = path.join(ROOT, 'de/visas/dtv/index.html');
let de = fs.readFileSync(deDtv, 'utf8');
if (!de.includes('/ru/visas/dtv/')) {
  de = de.replace(
    '<a href="/ru/visas/dtv/">Русский</a>',
    '<a href="/ru/visas/dtv/">Русский (DTV)</a>'
  );
  fs.writeFileSync(deDtv, de);
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'scan-ui-junk.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 33')) {
  const block = ` 2026-05-28
 Recovery sprint 33

 <h2>Sprint 33 — site-wide self-hosted fonts + RU DTV pilot</h2>
 <p>Replaced Google Fonts with self-hosted woff2 + /assets/fonts/fonts.css on all HTML pages. Full Russian DTV at /ru/visas/dtv/ indexed (204 sitemap URLs). LOCALE_INDEXED_PILOT now includes DE and RU DTV.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 33 complete');
