/**
 * Sprint 19 — UI chrome rebuild: corrupted card grids, mashed stats, merged CTAs.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const professionsHub = require('./content/sprint19-professions-hub.cjs');
const oboFull = require('./content/sprint19-online-business-owner-full.cjs');
const djFull = require('./content/sprint19-dj-full.cjs');
const nomad = require('./content/sprint19-digital-nomad-guide.cjs');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, html) {
  fs.writeFileSync(path.join(ROOT, rel), html);
}

function replaceMain(rel, body) {
  let html = read(rel);
  if (/<main id="main"/.test(html)) {
    html = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${body}\n</main>`);
  } else {
    html = html.replace(
      /(<div class="tldr">[\s\S]*?<\/div>\s*)([\s\S]*?)(<section class="read-next">)/,
      `$1<main id="main" class="article-body">\n${body}\n</main>\n\n$3`
    );
  }
  write(rel, html);
  return true;
}

// Site-wide: merged consultation CTA
let ctaFixed = 0;
function walkHtml(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walkHtml(p);
    } else if (e.name.endsWith('.html')) {
      let html = fs.readFileSync(p, 'utf8');
      if (html.includes('Free 15-min consultation<h2>')) {
        html = html.replace(
          /Free 15-min consultation<h2>/g,
          '<p><strong>Free 15-min consultation</strong></p>\n<h2>'
        );
        fs.writeFileSync(p, html);
        ctaFixed++;
      }
    }
  }
}
walkHtml(ROOT);

// 1. Professions hub — full rebuild
replaceMain('professions/index.html', professionsHub);

// 2. Online business owner + DJ — full rebuild (fixes missing &lt;main&gt; tag)
replaceMain('professions/online-business-owner/index.html', oboFull);
replaceMain('professions/dj/index.html', djFull);

// 3. Digital nomad guide — fix intro + CTA (preserve sections 3–12)
let ndg = read('pattaya-digital-nomad-guide/index.html');
ndg = ndg.replace(
  /(<p><strong>Free 15-min consultation<\/strong><\/p>\s*<h2>Need help planning your move\?<\/h2>[\s\S]*?WhatsApp \+66 96 728 6999<\/a>\s*)<\/main>/,
  `${nomad.cta}\n</main>`
);
if (!ndg.includes('Quick stats:')) {
  ndg = ndg.replace(
    /<main id="main" class="article-body">\s*The Pattaya digital nomad guidePage sections[\s\S]*?<h2>2\. The visa: DTV 95% of the time<\/h2>\s*\n\s*<ul>/,
    `<main id="main" class="article-body">\n${nomad.intro}\n<ul>`
  );
}
write('pattaya-digital-nomad-guide/index.html', ndg);

// Fix read-next on professions hub
let prof = read('professions/index.html');
if (prof.includes('// DEFAULT')) {
  prof = prof.replace(
    /<div class="rn-grid">\s*<a href="\/visas\/" class="rn pk">[\s\S]*?<\/div>\s*<\/section>/,
    `<div class="rn-grid">
<a href="/work-permit/" class="rn pk"><div class="cat">// HUBS</div><h3>Work permit hub</h3><p>Non-B + WP10 routes</p><span class="arr">→</span></a><a href="/digital-nomad/" class="rn cy"><div class="cat">// HUBS</div><h3>Digital nomad</h3><p>Pattaya nomad guide</p><span class="arr">→</span></a><a href="/tools/visa-finder/" class="rn yl"><div class="cat">// TOOLS</div><h3>Visa Finder</h3><p>Match your profile</p><span class="arr">→</span></a>
</div>
</section>`
  );
  write('professions/index.html', prof);
}

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
const comp = JSON.parse(fs.readFileSync(path.join(ROOT, '_audit-comprehensive.json'), 'utf8'));
if (comp.verdict !== 'PASS') process.exit(1);
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log(JSON.stringify({ ctaFixedGlobally: ctaFixed, pagesRebuilt: 4 }, null, 2));
