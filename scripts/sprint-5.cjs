const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

function injectHubHreflang(html, enUrl) {
  if (html.includes('hreflang="de"')) return html;
  const block = `<link rel="alternate" hreflang="en" href="${enUrl}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/" />\n<link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;
  const re = /<link rel="alternate" hreflang="en"[^>]+>\s*\n<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (re.test(html)) return html.replace(re, block);
  return html.replace(/<link rel="canonical" href="([^"]+)" \/>/, `<link rel="canonical" href="$1" />\n${block}`);
}

const results = { professions: 0, origin: 0, blogs: [] };

execSync('node scripts/locale-visa-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-profession-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const slug of fs.readdirSync(path.join(ROOT, 'professions'))) {
  const f = path.join(ROOT, 'professions', slug, 'index.html');
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  const en = `${BASE}/professions/${slug}/`;
  if (slug === 'index.html') continue;
  const hasDeProf = html.includes('/de/professions/');
  const block = hasDeProf
    ? null
    : `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  if (block) {
    const next = injectHubHreflang(html, en);
    if (next !== html) {
      fs.writeFileSync(f, next);
      results.professions++;
    }
  }
}

const profIndex = path.join(ROOT, 'professions/index.html');
if (fs.existsSync(profIndex)) {
  let html = fs.readFileSync(profIndex, 'utf8');
  const next = injectHubHreflang(html, `${BASE}/professions/`);
  if (next !== html) {
    fs.writeFileSync(profIndex, next);
    results.professions++;
  }
}

for (const slug of [
  'germany-to-thailand',
  'russia-to-thailand',
  'uk-to-thailand',
  'usa-to-thailand',
  'australia-to-thailand',
  'china-to-thailand',
  'india-to-thailand',
]) {
  const f = path.join(ROOT, 'pattaya', slug, 'index.html');
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  const en = `${BASE}/pattaya/${slug}/`;
  const next = injectHubHreflang(html, en);
  if (next !== html) {
    fs.writeFileSync(f, next);
    results.origin++;
  }
  if (slug === 'germany-to-thailand' && !html.includes('/de/visas/dtv/')) {
    html = fs.readFileSync(f, 'utf8');
    html = html.replace(
      '<main id="main"',
      '<main id="main"'
    );
    if (html.includes('<main id="main"') && !html.includes('de/visas/dtv')) {
      html = html.replace(
        /<main id="main"[^>]*>/,
        (m) =>
          m +
          '\n<p class="lang-switch">Deutsch: <a href="/de/">Visum-Beratung</a> · <a href="/de/visas/dtv/">DTV auf Deutsch</a> · <a href="/de/visas/retirement-non-o/">Non-O Rente</a></p>\n'
      );
      fs.writeFileSync(f, html);
    }
  }
  if (slug === 'russia-to-thailand' && !html.includes('/ru/visas/dtv/')) {
    html = fs.readFileSync(f, 'utf8');
    if (html.includes('<main id="main"') && !html.includes('ru/visas/dtv')) {
      html = html.replace(
        /<main id="main"[^>]*>/,
        (m) =>
          m +
          '\n<p class="lang-switch">По-русски: <a href="/ru/">Консультации</a> · <a href="/ru/visas/dtv/">DTV на русском</a> · <a href="/ru/visas/ltr/">LTR на русском</a></p>\n'
      );
      fs.writeFileSync(f, html);
    }
  }
}

for (const slug of ['tm30-landlord-refusal-2026', 'dtv-embassy-seasoning-2026']) {
  const dir = path.join(ROOT, 'blog', slug);
  if (!fs.existsSync(dir)) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'inherit' });
    results.blogs.push(slug);
  }
}

console.log(JSON.stringify(results, null, 2));
