/**
 * Sprint 29 — cookie consent banner + gtag consent gate + network contextual links.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const networkPatches = require('./content/sprint29-network-patches.cjs');

const GTAG_OLD = `  if(navigator.doNotTrack==='1'||w.doNotTrack==='1'){return;}
  ['pointerdown','keydown','scroll'].forEach(function(evt){
    w.addEventListener(evt,loadGtag,{once:true,passive:true});
  });
  w.setTimeout(loadGtag,5000);`;

const GTAG_NEW = `  w.__pvhLoadGtag=loadGtag;
  function armGtag(){
    if(navigator.doNotTrack==='1'||w.doNotTrack==='1')return;
    if(localStorage.getItem('pvh_cookie_consent')==='declined')return;
    if(localStorage.getItem('pvh_cookie_consent')!=='accepted')return;
    ['pointerdown','keydown','scroll'].forEach(function(evt){
      w.addEventListener(evt,loadGtag,{once:true,passive:true});
    });
    w.setTimeout(loadGtag,5000);
  }
  armGtag();
  w.addEventListener('pvh-consent-accepted',armGtag);`;

const CONSENT_TAG = '<script src="/cookie-consent.js" defer></script>\n';

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function walkHtml(dir, fn) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === 'functions') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, fn);
    else if (ent.name.endsWith('.html')) fn(p);
  }
}

let gtag = 0;
let consent = 0;
walkHtml(ROOT, (file) => {
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (h.includes(GTAG_OLD)) {
    h = h.replace(GTAG_OLD, GTAG_NEW);
    gtag++;
    changed = true;
  }
  if (h.includes("G-RSNN24M25C") && !h.includes('/cookie-consent.js')) {
    h = h.replace('<!-- Google tag (gtag.js)', CONSENT_TAG + '<!-- Google tag (gtag.js)');
    consent++;
    changed = true;
  }
  if (changed) fs.writeFileSync(file, h);
});

for (const [route, snippet] of Object.entries(networkPatches)) {
  const file = urlToFile(route);
  if (!fs.existsSync(file)) continue;
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('class="network-context"')) {
    console.log('skip network (exists)', route);
    continue;
  }
  const marker = '<main id="main" class="article-body">';
  if (!h.includes(marker)) {
    const alt = '<main id="main">';
    if (h.includes(alt)) {
      h = h.replace(alt, snippet.trim() + '\n' + alt);
    } else {
      console.warn('no main', route);
      continue;
    }
  } else {
    h = h.replace(marker, snippet.trim() + '\n' + marker);
  }
  fs.writeFileSync(file, h);
  console.log('network', route);
}

// Fix duplicate budget table on cost-of-living guide
const colFile = urlToFile('/guides/cost-of-living-pattaya/');
let col = fs.readFileSync(colFile, 'utf8');
const dupBlock = `<h2>Three sample monthly budgets</h2>
<table tabindex="0">
<thead><tr><th scope="col">Profile</th><th scope="col">Monthly total</th><th scope="col">USD approx.</th><th scope="col">Key line items</th></tr></thead>
<tbody>
<tr><td><strong>Frugal retiree</strong></td><td>฿32,000</td><td>≈ $920</td><td>Studio Jomtien ฿8k · Thai food ฿8k · utilities ฿2.5k · motorbike ฿2.5k · basic insurance ฿4k · misc ฿4k · visa amortized ฿3k</td></tr>
<tr><td><strong>Comfortable expat</strong></td><td>฿65,000</td><td>≈ $1,870</td><td>1BR Pratumnak/Jomtien ฿18k · mixed food ฿15k · utilities ฿3.5k · Grab+bike ฿4k · mid insurance ฿7k · gym/social ฿10k · visa ฿3.5k · buffer ฿4k</td></tr>
<tr><td><strong>Premium couple</strong></td><td>฿140,000</td><td>≈ $4,030</td><td>2BR Wongamat sea view ฿45k · restaurants ฿30k · utilities ฿5k · car+Grab ฿15k · premium insurance ×2 ฿18k · entertainment ฿20k · Privilege/LTR visa ฿7k</td></tr>
</tbody>
</table>

`;
if ((col.match(/<h2>Three sample monthly budgets<\/h2>/g) || []).length > 1) {
  const first = col.indexOf(dupBlock);
  const second = col.indexOf(dupBlock, first + 1);
  if (second > -1) {
    col = col.slice(0, second) + col.slice(second + dupBlock.length);
    fs.writeFileSync(colFile, col);
    console.log('removed duplicate budget table on cost-of-living');
  }
}

// About read time
const aboutFile = urlToFile('/about/');
let about = fs.readFileSync(aboutFile, 'utf8');
about = about.replace(/<span class="read">1 MIN READ<\/span>/, '<span class="read">5 MIN READ</span>');
fs.writeFileSync(aboutFile, about);

// Privacy — cookie banner mention
const privacyFile = path.join(ROOT, 'privacy/index.html');
let privacy = fs.readFileSync(privacyFile, 'utf8');
if (!privacy.includes('cookie banner')) {
  privacy = privacy.replace(
    /<h2>Cookies and tracking<\/h2>/,
    `<h2>Cookies and tracking</h2>
<p>On your first visit we show a <strong>cookie preference banner</strong>. Choose <em>Accept analytics</em> to allow deferred Google Analytics, or <em>Essential only</em> to block analytics scripts. Your choice is stored in your browser (localStorage key <code>pvh_cookie_consent</code>) until you clear site data.</p>`
  );
  fs.writeFileSync(privacyFile, privacy);
  console.log('privacy banner note');
}

// Shared network-context CSS on pages that get the class (inject once into first guide patched - use inline style like international-schools)
const NC_STYLE =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';
for (const route of Object.keys(networkPatches)) {
  const file = urlToFile(route);
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('network-context{') || !h.includes('class="network-context"')) continue;
  if (h.includes('<style>') && !h.includes('.network-context{')) {
    h = h.replace('<style>', `<style>\n${NC_STYLE}\n`);
    fs.writeFileSync(file, h);
  }
}

console.log(`\nSprint 29: gtag gate ${gtag} files, consent script ${consent} files`);
