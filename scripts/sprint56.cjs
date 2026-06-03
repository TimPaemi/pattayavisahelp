/**
 * Sprint 56 — Deepen locale mesh + in-page cross-links (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint56-mesh-expand.cjs',
  'sprint55-sync-hub-articles.cjs',
  'sprint56-inpage-crosslinks.cjs',
  'sprint56-inbound.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

// Future sprint55 mesh runs include budget/pattaya in strip
const meshPath = path.join(ROOT, 'scripts/sprint55-locale-network.cjs');
let mesh = fs.readFileSync(meshPath, 'utf8');
if (!mesh.includes('/de/best-visa/')) {
  mesh = mesh.replace(
    '<a href="/de/professions/">Berufe</a> · <a href="/tools/visa-finder/">',
    '<a href="/de/professions/">Berufe</a> · <a href="/de/best-visa/">Budget</a> · <a href="/de/pattaya/">Pattaya</a> · <a href="/tools/visa-finder/">'
  );
  mesh = mesh.replace(
    '<a href="/ru/professions/">профессии</a> · <a href="/tools/visa-finder/">',
    '<a href="/ru/professions/">профессии</a> · <a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a> · <a href="/tools/visa-finder/">'
  );
  fs.writeFileSync(meshPath, mesh);
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'scan-ui-junk.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 56')) {
  const block = ` 2026-05-28
 Recovery sprint 56

 <h2>Sprint 56 — Full mesh + in-page locale cross-links</h2>
 <p>Budget and Pattaya added to every Netzwerk DE / Сеть RU strip on 104 pilots; visa and compare pages get in-page Querverweise blocks; EN homepage and hubs link DE/RU best-visa and pattaya. 306 indexed URLs unchanged.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 56 complete');
