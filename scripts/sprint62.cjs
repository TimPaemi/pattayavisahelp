/**
 * Sprint 62 — Jomtien DE/RU guide pilots + landing inbound (308 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint62-promote-guide-pilots.cjs', 'sprint62-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

// Sync guides hub from article
execSync('node -e "const fs=require(\'fs\'),p=require(\'path\');const r=path.join(\'scripts\',\'..\');const a=fs.readFileSync(\'scripts/content/de-guides-hub-article.html\',\'utf8\');const f=\'de/guides/index.html\';let h=fs.readFileSync(f,\'utf8\');const n=h.replace(/<main id=\\"main\\"[^>]*>[\\s\\S]*?<\\/main>/,\`<main id=\\"main\\" class=\\"article-body\\">\\n\${a}\\n</main>\`);if(n!==h){fs.writeFileSync(f,n);console.log(\'synced guides hub\');}"', { cwd: ROOT, stdio: 'inherit' });

let llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
if (!llms.includes('106 indexed')) {
  llms = llms.replace(/one hundred four indexed pilots/g, 'one hundred six indexed pilots');
  llms = llms.replace(/104 indexed pilots/g, '106 indexed pilots');
  llms = llms.replace(
    '- [Pattaya hub RU]',
    '- [Jomtien immigration guide DE](https://pattayavisahelp.com/de/guides/jomtien-immigration-office/) — **indexed pilot**\n- [Jomtien immigration guide RU](https://pattayavisahelp.com/ru/guides/jomtien-immigration-office/) — **indexed pilot**\n- [Pattaya hub RU]'
  );
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);
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
if (!cl.includes('Sprint 62')) {
  const block = ` 2026-05-28
 Recovery sprint 62

 <h2>Sprint 62 — Jomtien DE/RU guide pilots + landing inbound</h2>
 <p>Indexed /de/guides/jomtien-immigration-office/ and /ru/guides/jomtien-immigration-office/ (106 pilots, 308 URLs). EN hubs link DE/RU landing stubs, tool mirrors, and Pattaya area pages.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/306 indexed URLs/g, '308 indexed URLs');
  cl = cl.replace(/306 sitemap URLs/g, '308 sitemap URLs');
  fs.writeFileSync(changelogPath, cl);
}

// Homepage pilot count
for (const f of ['index.html', 'de/index.html', 'ru/index.html']) {
  let h = fs.readFileSync(path.join(ROOT, f), 'utf8');
  h = h.replace(/104 indexed pilots/g, '106 indexed pilots');
  h = h.replace(/one hundred four indexed pilots/g, '106 indexed pilots');
  fs.writeFileSync(path.join(ROOT, f), h);
}

console.log('\nSprint 62 complete');
