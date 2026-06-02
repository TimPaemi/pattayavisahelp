/**
 * Sprint 28 — audit remediation: privacy, locale hubs, meta, docs, headers.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint28-meta-patches.cjs');

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function setMeta(html, name, content, attr = 'name') {
  if (!content) return html;
  const esc = content.replace(/"/g, '&quot;');
  const re1 = new RegExp(
    `<meta[^>]+${attr}=["']${name}["'][^>]+content=["'][^"']*["']`,
    'i'
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["'][^"']*["'][^>]+${attr}=["']${name}["']`,
    'i'
  );
  const repl = (m) => m.replace(/content=["'][^"']*["']/i, `content="${esc}"`);
  if (re1.test(html)) return html.replace(re1, repl);
  if (re2.test(html)) return html.replace(re2, repl);
  return html;
}

function applyMetaPatch(file, patch) {
  let html = fs.readFileSync(file, 'utf8');
  if (patch.title) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${patch.title}</title>`);
    html = setMeta(html, 'og:title', patch.title, 'property');
    html = setMeta(html, 'twitter:title', patch.title);
  }
  if (patch.description) {
    html = setMeta(html, 'description', patch.description);
    html = setMeta(html, 'og:description', patch.description, 'property');
    html = setMeta(
      html,
      'twitter:description',
      patch.twitterDescription || patch.description
    );
  }
  if (patch.ogDescription) {
    html = setMeta(html, 'og:description', patch.ogDescription, 'property');
  }
  if (patch.twitterDescription) {
    html = setMeta(html, 'twitter:description', patch.twitterDescription);
  }
  fs.writeFileSync(file, html);
}

// 1) Meta patches
let metaCount = 0;
for (const [p, patch] of Object.entries(patches)) {
  const file = urlToFile(p);
  if (!fs.existsSync(file)) {
    console.warn('skip missing', p);
    continue;
  }
  applyMetaPatch(file, patch);
  metaCount++;
  console.log('meta', p);
}

// 2) DE/RU hubs noindex
for (const hub of ['/de/', '/ru/']) {
  const file = urlToFile(hub);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(
    /<meta name="robots" content="[^"]*"/i,
    '<meta name="robots" content="noindex,follow,max-image-preview:large,max-snippet:-1"'
  );
  fs.writeFileSync(file, html);
  console.log('noindex hub', hub);
}

// 3) Privacy policy — accurate analytics
const privacyPath = path.join(ROOT, 'privacy/index.html');
let privacy = fs.readFileSync(privacyPath, 'utf8');
privacy = privacy.replace(
  /<p class="tldr-text">[\s\S]*?<\/p>/,
  '<p class="tldr-text">We use Google Analytics 4 (deferred until you interact or after 5 seconds) plus Cloudflare security logs. No ad pixels. You can block analytics cookies in your browser.</p>'
);
privacy = privacy.replace(
  /<h2>Cookies and tracking<\/h2>\s*<p>[\s\S]*?<\/p>/,
  `<h2>Cookies and tracking</h2>
<p>We use <strong>Google Analytics 4</strong> (measurement ID G-RSNN24M25C) to understand aggregate traffic — which pages are read, referral sources, and device type. The script loads only after you scroll, click, press a key, or after five seconds on the page, so it does not block initial content. Google may set first-party cookies (_ga, _ga_*). We do not use advertising remarketing or behavioural ad networks.</p>
<p>Cloudflare provides security and performance services; standard server logs are retained briefly. Contact form and API submissions are handled by our own endpoints — not sold to marketers.</p>
<p>You can opt out by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>, using browser cookie controls, or enabling Do Not Track (we honour DNT by skipping GA load when the signal is present — needs manual verification in your browser).</p>`
);
// DNT honour in gtag loader — patch all pages with standard gtag block
const GTAG_OLD = `  ['pointerdown','keydown','scroll'].forEach(function(evt){
    w.addEventListener(evt,loadGtag,{once:true,passive:true});
  });
  w.setTimeout(loadGtag,5000);`;
const GTAG_NEW = `  if(navigator.doNotTrack==='1'||w.doNotTrack==='1'){return;}
  ['pointerdown','keydown','scroll'].forEach(function(evt){
    w.addEventListener(evt,loadGtag,{once:true,passive:true});
  });
  w.setTimeout(loadGtag,5000);`;

let gtagCount = 0;
function walkHtml(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === 'functions') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p);
    else if (ent.name.endsWith('.html')) {
      let h = fs.readFileSync(p, 'utf8');
      if (h.includes(GTAG_OLD) && !h.includes("doNotTrack==='1'")) {
        h = h.replace(GTAG_OLD, GTAG_NEW);
        fs.writeFileSync(p, h);
        gtagCount++;
      }
    }
  }
}
walkHtml(ROOT);
console.log('gtag DNT guard on', gtagCount, 'files');

fs.writeFileSync(privacyPath, privacy);
console.log('privacy updated');

// 4) README
const readmePath = path.join(ROOT, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(
  /- Plain HTML \+ Tailwind CSS \(CDN\)\n- Vanilla JavaScript/,
  '- Plain HTML with per-page inline CSS (dark premium design system)\n- Vanilla JavaScript'
);
readme = readme.replace(/sitemap\.xml             # Monolithic sitemap \(182 URLs\)/, 'sitemap.xml             # Monolithic sitemap (204 indexed EN URLs)');
fs.writeFileSync(readmePath, readme);
console.log('README updated');

// 5) site.webmanifest theme_color
const manifestPath = path.join(ROOT, 'site.webmanifest');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.theme_color = '#000000';
manifest.background_color = '#000000';
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('manifest updated');

// 6) CSP — drop unused tailwind CDN
const headersPath = path.join(ROOT, '_headers');
let headers = fs.readFileSync(headersPath, 'utf8');
headers = headers.replace(
  'https://cdn.tailwindcss.com ',
  ''
);
fs.writeFileSync(headersPath, headers);
console.log('headers updated');

// 7) Visa-finder jump link + aria-live
const vfPath = path.join(ROOT, 'tools/visa-finder/index.html');
let vf = fs.readFileSync(vfPath, 'utf8');
if (!vf.includes('id="quiz-start"')) {
  vf = vf.replace(
    '<div class="quiz-wrap">',
    '<p class="quiz-jump" style="text-align:center;margin:0 0 1.25rem"><a href="#quiz-start" class="btn btn-primary" style="display:inline-block">Start the 6-question quiz ↓</a></p>\n<div class="quiz-wrap" id="quiz-start">'
  );
}
if (!vf.includes('aria-live="polite"')) {
  vf = vf.replace('<div id="quizArea"', '<div id="quizArea" aria-live="polite" aria-atomic="true"');
}
fs.writeFileSync(vfPath, vf);
console.log('visa-finder UX');

console.log(`\nSprint 28 audit fix: ${metaCount} meta pages`);
