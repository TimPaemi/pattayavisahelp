/**
 * Sprint 45 — English teacher, fitness trainer, diving instructor DE/RU profession pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint45-hreflang.cjs', 'sprint45-promote-pilot.cjs', 'sprint45-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/english-teacher/')) {
  llms = llms.replace(
    '  - Profession AI engineer: [DE](https://pattayavisahelp.com/de/professions/ai-engineer/), [RU](https://pattayavisahelp.com/ru/professions/ai-engineer/)\n- **Other',
    `  - Profession AI engineer: [DE](https://pattayavisahelp.com/de/professions/ai-engineer/), [RU](https://pattayavisahelp.com/ru/professions/ai-engineer/)
  - Profession English teacher: [DE](https://pattayavisahelp.com/de/professions/english-teacher/), [RU](https://pattayavisahelp.com/ru/professions/english-teacher/)
  - Profession fitness trainer: [DE](https://pattayavisahelp.com/de/professions/fitness-trainer/), [RU](https://pattayavisahelp.com/ru/professions/fitness-trainer/)
  - Profession diving instructor: [DE](https://pattayavisahelp.com/de/professions/diving-instructor/), [RU](https://pattayavisahelp.com/ru/professions/diving-instructor/)
- **Other`
  );
  llms = llms.replace(
    'fifty-four indexed pilots (12 visa types + 9 compares + 6 professions)',
    'sixty indexed pilots (12 visa types + 9 compares + 9 professions)'
  );
  llms = llms.replace(
    'except the fifty-four indexed pilots above',
    'except the sixty indexed pilots above'
  );
  llms = llms.replace(
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer (indexed above)',
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer, english-teacher, fitness-trainer, diving-instructor (indexed above)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/english-teacher/')) {
  meta = meta.replace(
    "'/ru/professions/ai-engineer/',",
    `'/ru/professions/ai-engineer/',
  '/de/professions/english-teacher/',
  '/ru/professions/english-teacher/',
  '/de/professions/fitness-trainer/',
  '/ru/professions/fitness-trainer/',
  '/de/professions/diving-instructor/',
  '/ru/professions/diving-instructor/',`
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
if (!cl.includes('Sprint 45')) {
  const block = ` 2026-05-28
 Recovery sprint 45

 <h2>Sprint 45 — English teacher, fitness trainer, diving instructor DE/RU</h2>
 <p>Indexed six profession locale pilots (262 sitemap URLs). hreflang on EN pillars. Inbound from professions hub, work permit hub, MOE guide.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/256 indexed URLs/g, '262 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 45 complete');
