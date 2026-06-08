/**
 * Sprint 64 — create missing DE russia / RU germany pattaya country stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function clone(srcRel, destRel, replacements) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (fs.existsSync(dest)) {
    console.log('exists', destRel);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let h = fs.readFileSync(src, 'utf8');
  for (const [from, to] of replacements) {
    h = h.split(from).join(to);
  }
  fs.writeFileSync(dest, h);
  console.log('created', destRel);
}

clone(
  'de/pattaya/germany-to-thailand/index.html',
  'de/pattaya/russia-to-thailand/index.html',
  [
    ['Deutschland nach Thailand', 'Russland nach Thailand'],
    ['deutsche Staatsbürger', 'russische Staatsbürger'],
    ['germany-to-thailand', 'russia-to-thailand'],
    ['Deutschland', 'Russland'],
    ['Deutsche', 'Russinnen und Russen'],
    ['/pattaya/germany-to-thailand/', '/pattaya/russia-to-thailand/'],
    ['Aus Pattaya auf Deutsch', 'Pattaya — Leitfaden auf Deutsch'],
  ]
);

clone(
  'ru/pattaya/russia-to-thailand/index.html',
  'ru/pattaya/germany-to-thailand/index.html',
  [
    ['Россия → Таиланд', 'Германия → Таиланд'],
    ['для граждан РФ', 'для граждан Германии'],
    ['russia-to-thailand', 'germany-to-thailand'],
    ['россиян', 'немцев'],
    ['/pattaya/russia-to-thailand/', '/pattaya/germany-to-thailand/'],
    ['hreflang="de" href="https://pattayavisahelp.com/de/"', 'hreflang="de" href="https://pattayavisahelp.com/de/pattaya/germany-to-thailand/"'],
  ]
);
