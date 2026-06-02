/**
 * Sprint 30 — network contextual links + network-context CSS where missing.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const networkPatches = require('./content/sprint30-network-patches.cjs');
const { NETWORK_CSS } = require('./sprint30-content.cjs'); // does not run content patches

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function ensureNetworkCss(h) {
  if (h.includes('.network-context{')) return h;
  if (h.includes('<style>')) {
    return h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  }
  return h;
}

for (const [route, snippet] of Object.entries(networkPatches)) {
  const file = urlToFile(route);
  if (!fs.existsSync(file)) {
    console.warn('missing', route);
    continue;
  }
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('class="network-context"')) {
    console.log('skip network (exists)', route);
    continue;
  }
  h = ensureNetworkCss(h);
  const marker = '<main id="main" class="article-body">';
  if (h.includes(marker)) {
    h = h.replace(marker, snippet.trim() + '\n' + marker);
  } else {
    const alt = '<main id="main">';
    if (h.includes(alt)) h = h.replace(alt, snippet.trim() + '\n' + alt);
    else {
      console.warn('no main', route);
      continue;
    }
  }
  fs.writeFileSync(file, h);
  console.log('network', route);
}

console.log('Sprint 30 network links done');
