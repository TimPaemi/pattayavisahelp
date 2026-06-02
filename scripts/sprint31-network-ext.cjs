/**
 * Sprint 31b — network strips on professions + best-visa tiers (indexed EN).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const PROFESSION_SNIPPETS = {
  '/professions/english-teacher/': `ED visa: <a href="/visas/education-ed/">Education ED</a> · Schools: <a href="https://pattaya-school-guide.com/" target="_blank" rel="noopener noreferrer">Pattaya School Guide</a> · MOE: <a href="/guides/verify-moe-accredited-school/">Verify MOE school</a>`,
  '/professions/diving-instructor/': `Work: <a href="/work-permit/">Work permit</a> · Non-B: <a href="/visas/business-non-b/">Non-B</a> · Living: <a href="/pattaya/living-in-pattaya/">Living in Pattaya</a>`,
  '/professions/real-estate-agent/': `Property: <a href="/property/">Property hub</a> · <a href="https://pattayastream.com/" target="_blank" rel="noopener noreferrer">Pattaya Villa Stream</a> · Non-B: <a href="/visas/business-non-b/">Non-B</a>`,
  '/professions/fitness-trainer/': `<a href="https://pattaya-gym.com/" target="_blank" rel="noopener noreferrer">Pattaya Gym</a> · <a href="https://pattayapersonaltrainer.com/" target="_blank" rel="noopener noreferrer">Pattaya Personal Trainer</a> · DTV: <a href="/visas/dtv/">DTV</a>`,
  '/professions/yoga-teacher/': `DTV: <a href="/visas/dtv/">DTV</a> · <a href="https://pattaya-gym.com/" target="_blank" rel="noopener noreferrer">Pattaya Gym</a> · ED: <a href="/visas/education-ed/">ED visa</a>`,
  '/professions/content-creator/': `DTV: <a href="/visas/dtv/">DTV</a> · Media: <a href="/visas/media-non-m/">Non-M media</a> · Nomad: <a href="/digital-nomad/">Digital nomad hub</a>`,
  '/professions/saas-founder/': `SMART: <a href="/visas/smart/">SMART visa</a> · Company: <a href="/guides/setting-up-thai-company/">Thai company</a> · LTR: <a href="/visas/ltr/">LTR</a>`,
  '/professions/crypto-trader/': `DTV: <a href="/visas/dtv/">DTV</a> · Tax: <a href="/guides/thai-tax-foreign-residents/">Thai tax guide</a> · Banking: <a href="/banking/">Banking hub</a>`,
};

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'node_modules') continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function pagePath(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace('/index.html', '') + '/';
}

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

function getSnippet(route) {
  if (route.startsWith('/best-visa/')) {
    return `<p class="network-context">Tool: <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/tools/income-test/">Income test</a> · Hub: <a href="/best-visa/">Best visa by budget</a> · <a href="/visas/">All visas</a></p>\n`;
  }
  const custom = PROFESSION_SNIPPETS[route];
  if (custom) return `<p class="network-context">${custom}</p>\n`;
  return `<p class="network-context">Pathway: <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/professions/">All professions</a> · DTV: <a href="/visas/dtv/">DTV</a></p>\n`;
}

function apply(file, route) {
  let h = fs.readFileSync(file, 'utf8');
  if (!isIndexed(h) || h.includes('network-context')) return false;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  }
  const marker = '<main id="main" class="article-body">';
  if (!h.includes(marker)) return false;
  h = h.replace(marker, getSnippet(route) + marker);
  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const f of walk(ROOT)) {
  const route = pagePath(f);
  if (!route.startsWith('/professions/') && !route.startsWith('/best-visa/')) continue;
  if (apply(f, route)) {
    n++;
    console.log('ext network', route);
  }
}

console.log(`Sprint 31b: ${n} profession/best-visa pages`);
