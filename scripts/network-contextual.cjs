/**
 * Contextual in-content links between network sites and visa help.
 */
const fs = require('fs');
const path = require('path');

const PROJECTS = path.join(__dirname, '..', '..');
const VISA = 'https://pattayavisahelp.com';

const PATCHES = [
  {
    repo: 'pattayagym',
    file: 'guides/training-thailand-visa-pattaya/index.html',
    insert: `<p class="visa-context">Full visa breakdown: <a href="${VISA}visas/dtv/" target="_blank" rel="noopener noreferrer">DTV guide</a> · <a href="${VISA}glossary/soft-power/" target="_blank" rel="noopener noreferrer">Soft-power category</a> · <a href="${VISA}visas/education-ed/" target="_blank" rel="noopener noreferrer">ED visa for Muay Thai</a> · Free quiz: <a href="${VISA}tools/visa-finder/" target="_blank" rel="noopener noreferrer">Visa finder</a></p>\n`,
  },
  {
    repo: 'pattayagym',
    file: 'index.html',
    insert: `<p class="visa-context" style="margin:1rem 0">Moving to train? See <a href="${VISA}visas/dtv/" target="_blank" rel="noopener noreferrer">Thailand DTV visa</a> and <a href="https://pattaya-gym.com/guides/training-thailand-visa-pattaya/" rel="noopener">training + visa guide</a> · <a href="${VISA}glossary/soft-power/" target="_blank" rel="noopener noreferrer">Soft-power visa</a></p>\n`,
  },
  {
    repo: 'pattayaschoolguide',
    file: 'index.html',
    insert: `<p class="visa-context">Need a visa for school? <a href="${VISA}visas/education-ed/" target="_blank" rel="noopener noreferrer">Education ED visa guide</a> · <a href="${VISA}guides/verify-moe-accredited-school/" target="_blank" rel="noopener noreferrer">Verify MOE accreditation</a> · <a href="${VISA}guides/bringing-family-to-thailand/" target="_blank" rel="noopener noreferrer">Bringing family to Thailand</a></p>\n`,
  },
  {
    repo: 'pattayamedical',
    file: 'index.html',
    insert: `<p class="visa-context">Retirement visa insurance requirements: <a href="${VISA}visas/retirement-o-a/" target="_blank" rel="noopener noreferrer">O-A retirement guide</a> · <a href="${VISA}guides/health-insurance/" target="_blank" rel="noopener noreferrer">Health insurance for Thai visas</a> · <a href="${VISA}healthcare/" target="_blank" rel="noopener noreferrer">Healthcare hub</a></p>\n`,
  },
  {
    repo: 'pattayapets',
    file: 'index.html',
    insert: `<p class="visa-context">Bringing pets to Thailand? <a href="${VISA}guides/bringing-family-to-thailand/" target="_blank" rel="noopener noreferrer">Family relocation guide</a> · <a href="${VISA}visas/marriage-non-o/" target="_blank" rel="noopener noreferrer">Marriage visa</a> · <a href="${VISA}contact/" target="_blank" rel="noopener noreferrer">Ask Pattaya Visa Help</a></p>\n`,
  },
  {
    repo: 'pattayacoffee',
    file: 'index.html',
    insert: `<p class="visa-context">Working remotely from Pattaya? <a href="${VISA}visas/dtv/" target="_blank" rel="noopener noreferrer">DTV digital nomad visa</a> · <a href="${VISA}pattaya-digital-nomad-guide/" target="_blank" rel="noopener noreferrer">Digital nomad in Pattaya</a> · <a href="${VISA}tools/visa-finder/" target="_blank" rel="noopener noreferrer">Visa finder quiz</a></p>\n`,
  },
  {
    repo: 'pattaya-vehicle-rentals',
    file: 'index.html',
    insert: `<p class="visa-context">Long-stay in Pattaya? <a href="${VISA}visas/" target="_blank" rel="noopener noreferrer">All 12 Thailand visas</a> · <a href="${VISA}guides/driving-licence-thailand/" target="_blank" rel="noopener noreferrer">Thai driving licence guide</a></p>\n`,
  },
];

function insertAfterMainOpen(html, insert) {
  const re = /<main\b[^>]*>/i;
  const m = html.match(re);
  if (!m) return null;
  return html.replace(re, (tag) => tag + '\n' + insert);
}

const report = { updated: [], skipped: [] };

for (const p of PATCHES) {
  const full = path.join(PROJECTS, p.repo, p.file);
  if (!fs.existsSync(full)) {
    report.skipped.push(`${p.repo}/${p.file} missing`);
    continue;
  }
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('class="visa-context"')) {
    report.skipped.push(`${p.repo}/${p.file} already linked`);
    continue;
  }
  const next = insertAfterMainOpen(html, p.insert);
  if (!next) {
    report.skipped.push(`${p.repo}/${p.file} no main`);
    continue;
  }
  fs.writeFileSync(full, next);
  report.updated.push(`${p.repo}/${p.file}`);
}

console.log(JSON.stringify(report, null, 2));
