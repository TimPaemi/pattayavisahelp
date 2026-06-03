/**
 * Sprint 61 — EN Pattaya pages link DE/RU Pattaya hub and locale compares.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint61-pattaya';
const CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const BLOCK = `<!-- ${MARKER} -->\n<p class="network-context">Pattaya locale: <a href="/de/pattaya/">Hub (DE)</a> · <a href="/ru/pattaya/">Hub (RU)</a> · <a href="/de/compare/pattaya-vs-bangkok/">vs BKK (DE)</a> · <a href="/de/visas/">Visas (DE)</a> · <a href="/guides/jomtien-immigration-office/">Jomtien guide</a></p>\n`;

function patch(file) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER)) return false;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }
  const anchors = ['<h2>FAQ</h2>', '<div class="faq">', '<h2 class="read-next-h2">', '<section class="read-next">'];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${BLOCK}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  if (h.includes('<main')) {
    h = h.replace(/<main\b[^>]*>/, (m) => `${m}\n${BLOCK}`);
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
const dirs = ['pattaya', 'pattaya-digital-nomad-guide'];
for (const dir of dirs) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  const entries = fs.readdirSync(base, { withFileTypes: true });
  for (const e of entries) {
    const file = path.join(base, e.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    if (patch(file)) {
      n++;
      console.log(dir, e.name);
    }
  }
  const hub = path.join(base, 'index.html');
  if (fs.existsSync(hub) && patch(hub)) {
    n++;
    console.log(dir, 'hub');
  }
}

console.log(`Sprint 61 pattaya locale: ${n} pages`);
