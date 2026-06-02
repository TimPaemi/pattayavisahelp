/**
 * Sprint 43 — Content creator, SaaS founder, Online business owner DE/RU profession pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint43-hreflang.cjs', 'sprint43-promote-pilot.cjs', 'sprint43-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/content-creator/')) {
  llms = llms.replace(
    '  - Compare DTV vs Privilege: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-elite/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-elite/)\n- **Other',
    `  - Compare DTV vs Privilege: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-elite/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-elite/)
  - Profession content creator: [DE](https://pattayavisahelp.com/de/professions/content-creator/), [RU](https://pattayavisahelp.com/ru/professions/content-creator/)
  - Profession SaaS founder: [DE](https://pattayavisahelp.com/de/professions/saas-founder/), [RU](https://pattayavisahelp.com/ru/professions/saas-founder/)
  - Profession online business owner: [DE](https://pattayavisahelp.com/de/professions/online-business-owner/), [RU](https://pattayavisahelp.com/ru/professions/online-business-owner/)
- **Other`
  );
  llms = llms.replace(
    'forty-two indexed pilots (12 visa types + 9 compares)',
    'forty-eight indexed pilots (12 visa types + 9 compares + 3 professions)'
  );
  llms = llms.replace(
    'except the forty-two indexed pilots above',
    'except the forty-eight indexed pilots above'
  );
  llms = llms.replace(
    '- Profession pages (DE/RU, noindex stubs): `/de/professions/{slug}/`, `/ru/professions/{slug}/`',
    '- Other profession pages (DE/RU, noindex stubs): `/de/professions/{slug}/`, `/ru/professions/{slug}/` — except content-creator, saas-founder, online-business-owner (indexed above)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/content-creator/')) {
  meta = meta.replace(
    "'/ru/compare/dtv-vs-elite/',",
    `'/ru/compare/dtv-vs-elite/',
  '/de/professions/content-creator/',
  '/ru/professions/content-creator/',
  '/de/professions/saas-founder/',
  '/ru/professions/saas-founder/',
  '/de/professions/online-business-owner/',
  '/ru/professions/online-business-owner/',`
  );
  fs.writeFileSync(metaPath, meta);
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
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
if (!cl.includes('Sprint 43')) {
  const block = ` 2026-05-28
 Recovery sprint 43

 <h2>Sprint 43 — Content creator, SaaS founder, Online business DE/RU</h2>
 <p>Indexed six profession locale pilots (250 sitemap URLs). hreflang on EN profession pillars. Inbound from professions hub, digital nomad hub, nomad guide.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/244 indexed URLs/g, '250 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 43 complete');
