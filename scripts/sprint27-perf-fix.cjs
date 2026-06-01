/**
 * Sprint 27 — Lighthouse-driven CLS + JS tuning (site-wide).
 * - Metric-matched @font-face fallbacks before web-font swap
 * - Trim Google Fonts weights (drop 500)
 * - Opacity-only fade-up (no translateY CLS)
 * - Skip TL;DR from scroll fade-in (above-fold)
 * - Defer gtag idle load to 5s interaction-only fallback
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FONT_URL_OLD =
  'family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
const FONT_URL_NEW =
  'family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700&display=swap';

const FONT_FALLBACK_MARKER = '/* FONT-FALLBACK-V1';
const FONT_FALLBACK_CSS = `${FONT_FALLBACK_MARKER} — metric-matched fallbacks reduce CLS on web-font swap */
@font-face{font-family:'Inter Fallback';src:local('Arial');size-adjust:107.4%;ascent-override:90%;descent-override:22.43%;line-gap-override:0%}
@font-face{font-family:'Space Grotesk Fallback';src:local('Arial');size-adjust:98.5%;ascent-override:92%;descent-override:24%;line-gap-override:0%}
@font-face{font-family:'JetBrains Mono Fallback';src:local('Courier New');size-adjust:96%;ascent-override:88%;descent-override:22%;line-gap-override:0%}
`;

const FADE_OLD_A =
  '.fade-up{opacity:0;transform:translateY(24px);transition:opacity .7s ease-out,transform .7s ease-out}\n.fade-up.in{opacity:1;transform:translateY(0)}';
const FADE_OLD_B =
  '.fade-up{opacity:0;transform:translateY(24px);transition:opacity .7s ease-out,transform .7s ease-out}\n.fade-up.in{opacity:1;transform:none}';
const FADE_NEW =
  '.fade-up{opacity:0;transition:opacity .6s ease-out}\n.fade-up.in{opacity:1}\n@media (prefers-reduced-motion:reduce){.fade-up,.fade-up.in{opacity:1;transition:none}}';

const GTAG_OLD = `  if('requestIdleCallback' in w){w.requestIdleCallback(loadGtag,{timeout:2000});}
  else{w.setTimeout(loadGtag,2000);}`;
const GTAG_NEW = '  w.setTimeout(loadGtag,5000);';

const FADE_SEL_OLD = ".tldr, .article-body h2, .article-body > p, .read-next, .contact-section, .vstats-wrap";
const FADE_SEL_NEW = ".article-body h2, .article-body > p, .read-next, .contact-section, .vstats-wrap";

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function patch(html) {
  let n = 0;
  let h = html;

  if (h.includes(FONT_URL_OLD)) {
    h = h.split(FONT_URL_OLD).join(FONT_URL_NEW);
    n++;
  }

  if (!h.includes(FONT_FALLBACK_MARKER) && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${FONT_FALLBACK_CSS}`);
    n++;
  }

  if (h.includes(FADE_OLD_A)) {
    h = h.replace(FADE_OLD_A, FADE_NEW);
    n++;
  } else if (h.includes(FADE_OLD_B)) {
    h = h.replace(FADE_OLD_B, FADE_NEW);
    n++;
  }

  if (h.includes(FADE_SEL_OLD)) {
    h = h.replace(FADE_SEL_OLD, FADE_SEL_NEW);
    n++;
  }

  if (h.includes(GTAG_OLD)) {
    h = h.replace(GTAG_OLD, GTAG_NEW);
    n++;
  }

  const fontPairs = [
    ["'JetBrains Mono',monospace", "'JetBrains Mono','JetBrains Mono Fallback',ui-monospace,monospace"],
    ["'Space Grotesk',sans-serif", "'Space Grotesk','Space Grotesk Fallback',system-ui,sans-serif"],
    ['Inter,sans-serif', "Inter,'Inter Fallback',system-ui,sans-serif"],
    ["'Inter',sans-serif", "'Inter','Inter Fallback',system-ui,sans-serif"],
  ];
  for (const [from, to] of fontPairs) {
    if (h.includes(from)) {
      h = h.split(from).join(to);
      n++;
    }
  }

  return { html: h, changed: n > 0, patches: n };
}

const files = walkHtml(ROOT);
let touched = 0;
let totalPatches = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const { html, changed, patches } = patch(raw);
  if (changed) {
    fs.writeFileSync(file, html);
    touched++;
    totalPatches += patches;
    console.log('patched', path.relative(ROOT, file), `(${patches})`);
  }
}

console.log(`\nSprint 27 perf fix: ${touched} files, ${totalPatches} patch groups`);
