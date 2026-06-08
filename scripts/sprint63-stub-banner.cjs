/**
 * Sprint 63 — localize DE/RU stub banners (noindex locale pages).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const EN =
  '<div class="locale-stub-banner" style="max-width:820px;margin:0 auto 2rem;padding:1.25rem 1.5rem;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:8px;font-size:.95rem;line-height:1.55;color:#fafafa"><strong style="color:#fbbf24">Translation in progress.</strong> This page is not yet available in your language. Please use the English guide below — we are rewriting locale pages properly, not publishing empty placeholders.</div>';

const DE =
  '<div class="locale-stub-banner" style="max-width:820px;margin:0 auto 2rem;padding:1.25rem 1.5rem;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:8px;font-size:.95rem;line-height:1.55;color:#fafafa"><strong style="color:#fbbf24">Übersetzung läuft.</strong> Diese Seite ist auf Deutsch noch nicht fertig. Nutzen Sie vorerst den englischen Leitfaden unten — wir veröffentlichen keine leeren Platzhalter.</div>';

const RU =
  '<div class="locale-stub-banner" style="max-width:820px;margin:0 auto 2rem;padding:1.25rem 1.5rem;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:8px;font-size:.95rem;line-height:1.55;color:#fafafa"><strong style="color:#fbbf24">Перевод в работе.</strong> Полная русская версия скоро — пока используйте английскую страницу ниже. Мы не публикуем пустые заглушки.</div>';

const ALT_EN = /<div class="locale-stub-banner"[^>]*>[\s\S]*?<\/div>/;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

let n = 0;
for (const lang of ['de', 'ru']) {
  const dir = path.join(ROOT, lang);
  const banner = lang === 'de' ? DE : RU;
  for (const file of walk(dir)) {
    let h = fs.readFileSync(file, 'utf8');
    if (!h.includes('locale-stub-banner')) continue;
    const next = h.replace(ALT_EN, banner);
    if (next !== h) {
      fs.writeFileSync(file, next);
      n++;
    }
  }
}

console.log('stub banners localized:', n);
