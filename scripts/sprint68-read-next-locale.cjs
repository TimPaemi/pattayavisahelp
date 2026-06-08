/**
 * Sprint 68 — localized Read next + contact CTA on DE/RU guide pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const L = {
  de: {
    lab: '// Weiterlesen · verwandte Leitfäden',
    h2: 'Weiter <span style="color:var(--pink)">lesen</span>.',
    cat: '// LEITFÄDEN',
    contactLab: '// Kontakt · 3 Wege',
    contactH2: 'Lassen Sie uns <span class="cy">klären</span>.',
    emailLab: '// E-MAIL · DETAILS',
    emailMet: 'Antwort in 24 Std · Dokumentiert',
    waLab: '// WHATSAPP · KURZ',
    waMet: 'Mo–Sa 9–18 ICT · DE · EN · RU',
    formLab: '// KONTAKTFORMULAR',
    formAct: 'Formular nutzen',
    formMet: 'Für das volle Bild',
  },
  ru: {
    lab: '// Дальше · связанные гиды',
    h2: 'Читайте <span style="color:var(--pink)">дальше</span>.',
    cat: '// ГИДЫ',
    contactLab: '// Контакт · 3 способа',
    contactH2: 'Разберём <span class="cy">вместе</span>.',
    emailLab: '// EMAIL · ПОДРОБНО',
    emailMet: 'Ответ за 24 ч',
    waLab: '// WHATSAPP · БЫСТРО',
    waMet: 'Пн–Сб 9–18 ICT · RU · EN · DE',
    formLab: '// ФОРМА',
    formAct: 'Открыть форму',
    formMet: 'Полная картина',
  },
};

const CARDS = {
  '/de/guides/jomtien-immigration-office/': [
    { href: '/de/guides/90-day-reporting/', title: '90-Tage-Meldung', desc: 'TM47 alle 90 Tage' },
    { href: '/de/guides/tm30-reporting/', title: 'TM30', desc: 'Vermieter · 24 Stunden' },
    { href: '/de/guides/re-entry-permits/', title: 'Re-entry', desc: 'Vor der Ausreise' },
  ],
  '/ru/guides/jomtien-immigration-office/': [
    { href: '/ru/guides/90-day-reporting/', title: '90-day', desc: 'TM47 каждые 90 дней' },
    { href: '/ru/guides/tm30-reporting/', title: 'TM30', desc: '24 часа · арендодатель' },
    { href: '/ru/guides/re-entry-permits/', title: 'Re-entry', desc: 'До выезда' },
  ],
  '/de/guides/tm30-reporting/': [
    { href: '/de/guides/90-day-reporting/', title: '90-Tage-Meldung', desc: 'Nächste Pflicht' },
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Walk-in TM30' },
    { href: '/de/guides/re-entry-permits/', title: 'Re-entry', desc: 'Vor Reisen' },
  ],
  '/ru/guides/tm30-reporting/': [
    { href: '/ru/guides/90-day-reporting/', title: '90-day', desc: 'Следующий шаг' },
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'TM30 лично' },
    { href: '/ru/guides/re-entry-permits/', title: 'Re-entry', desc: 'До поездки' },
  ],
  '/de/guides/90-day-reporting/': [
    { href: '/de/guides/tm30-reporting/', title: 'TM30', desc: 'Zuerst vom Vermieter' },
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Erste Meldung vor Ort' },
    { href: '/de/guides/re-entry-permits/', title: 'Re-entry', desc: 'Visum behalten' },
  ],
  '/ru/guides/90-day-reporting/': [
    { href: '/ru/guides/tm30-reporting/', title: 'TM30', desc: 'Сначала арендодатель' },
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Первая подача' },
    { href: '/ru/guides/re-entry-permits/', title: 'Re-entry', desc: 'Сохранить визу' },
  ],
  '/de/guides/re-entry-permits/': [
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'TM.8 vor Ort' },
    { href: '/de/guides/90-day-reporting/', title: '90-Tage', desc: 'Parallel-Pflicht' },
    { href: '/de/visas/retirement-non-o/', title: 'Non-O Rente', desc: 'Visa-Pilot DE' },
  ],
  '/ru/guides/re-entry-permits/': [
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'TM.8 в офисе' },
    { href: '/ru/guides/90-day-reporting/', title: '90-day', desc: 'Параллельно' },
    { href: '/ru/visas/retirement-non-o/', title: 'Non-O', desc: 'Пенсия RU' },
  ],
  '/de/guides/visa-overstay-penalties/': [
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Freiwillige Meldung' },
    { href: '/de/guides/re-entry-permits/', title: 'Re-entry', desc: 'Vor Reisen planen' },
    { href: '/de/guides/90-day-reporting/', title: '90-Tage', desc: 'Fristen einhalten' },
  ],
  '/ru/guides/visa-overstay-penalties/': [
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Сдаться самим' },
    { href: '/ru/guides/re-entry-permits/', title: 'Re-entry', desc: 'Планировать выезд' },
    { href: '/ru/guides/90-day-reporting/', title: '90-day', desc: 'Не пропускать' },
  ],
  '/de/guides/visa-runs-vs-extensions/': [
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Verlängerung vor Ort' },
    { href: '/de/visas/dtv/', title: 'DTV', desc: 'Statt Run-Schleife' },
    { href: '/de/guides/visa-overstay-penalties/', title: 'Overstay', desc: 'Wenn zu spät' },
  ],
  '/ru/guides/visa-runs-vs-extensions/': [
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Продление' },
    { href: '/ru/visas/dtv/', title: 'DTV', desc: 'Вместо run' },
    { href: '/ru/guides/visa-overstay-penalties/', title: 'Overstay', desc: 'Если опоздали' },
  ],
  '/de/guides/cost-of-living-pattaya/': [
    { href: '/de/guides/retiring-in-thailand/', title: 'Rente', desc: 'Pattaya-Plan' },
    { href: '/tools/cost-calculator/', title: 'Rechner', desc: 'Visa-Kosten' },
    { href: '/de/pattaya/', title: 'Pattaya', desc: 'Viertel DE' },
  ],
  '/ru/guides/cost-of-living-pattaya/': [
    { href: '/ru/guides/retiring-in-thailand/', title: 'Пенсия', desc: 'Паттайя' },
    { href: '/tools/cost-calculator/', title: 'Калькулятор', desc: 'виза' },
    { href: '/ru/pattaya/', title: 'Pattaya', desc: 'районы' },
  ],
  '/de/guides/driving-licence-thailand/': [
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Aufenthaltsschein' },
    { href: '/de/guides/90-day-reporting/', title: '90-Tage', desc: 'TM47' },
    { href: '/de/pattaya/', title: 'Pattaya', desc: 'Viertel' },
  ],
  '/ru/guides/driving-licence-thailand/': [
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'справка' },
    { href: '/ru/guides/90-day-reporting/', title: '90-day', desc: 'TM47' },
    { href: '/ru/pattaya/', title: 'Pattaya', desc: 'районы' },
  ],
  '/de/guides/retiring-in-thailand/': [
    { href: '/de/visas/retirement-non-o/', title: 'Non-O', desc: 'Standard Rente' },
    { href: '/de/guides/thai-bank-account-as-foreigner/', title: 'Bankkonto', desc: 'Vor ฿800k' },
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Verlängerung' },
  ],
  '/ru/guides/retiring-in-thailand/': [
    { href: '/ru/visas/retirement-non-o/', title: 'Non-O', desc: 'пенсия' },
    { href: '/ru/guides/thai-bank-account-as-foreigner/', title: 'Банк', desc: 'до ฿800k' },
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'продление' },
  ],
  '/de/guides/health-insurance/': [
    { href: '/de/visas/retirement-non-o/', title: 'Non-O', desc: 'Keine Pflichtversicherung' },
    { href: '/de/compare/non-o-vs-o-a/', title: 'Non-O vs O-A', desc: 'Versicherungsfaktor' },
    { href: '/de/visas/ltr/', title: 'LTR', desc: '$100k Savings-Option' },
  ],
  '/ru/guides/health-insurance/': [
    { href: '/ru/visas/retirement-non-o/', title: 'Non-O', desc: 'без обязательной' },
    { href: '/ru/compare/non-o-vs-o-a/', title: 'Non-O vs O-A', desc: 'страховка' },
    { href: '/ru/visas/ltr/', title: 'LTR', desc: '$100k на счёте' },
  ],
  '/de/guides/thai-bank-account-as-foreigner/': [
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Certificate of Residence' },
    { href: '/de/guides/tm30-reporting/', title: 'TM30', desc: 'Vor dem Konto' },
    { href: '/de/visas/retirement-non-o/', title: 'Non-O', desc: '฿800k Seasoning' },
  ],
  '/ru/guides/thai-bank-account-as-foreigner/': [
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'справка' },
    { href: '/ru/guides/tm30-reporting/', title: 'TM30', desc: 'до счёта' },
    { href: '/ru/visas/retirement-non-o/', title: 'Non-O', desc: '฿800k' },
  ],
  '/de/guides/': [
    { href: '/de/guides/cost-of-living-pattaya/', title: 'Lebenshaltung', desc: '฿32–65k' },
    { href: '/de/guides/retiring-in-thailand/', title: 'Rente', desc: 'Pattaya-Plan' },
    { href: '/de/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Immigration' },
  ],
  '/ru/guides/': [
    { href: '/ru/guides/cost-of-living-pattaya/', title: 'Расходы', desc: '฿32–65k' },
    { href: '/ru/guides/retiring-in-thailand/', title: 'Пенсия', desc: 'Паттайя' },
    { href: '/ru/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'офис' },
  ],
};

function readNextHtml(lang, cards) {
  const t = L[lang];
  const cls = ['pk', 'cy', 'yl'];
  const items = cards
    .map(
      (c, i) =>
        `<a href="${c.href}" class="rn ${cls[i]}"><div class="cat">${t.cat}</div><h3>${c.title}</h3><p>${c.desc}</p><span class="arr">→</span></a>`
    )
    .join('');
  return `<section class="read-next">
<div class="read-next-hd">
<span class="read-next-lab">${t.lab}</span>
<h2 class="read-next-h2">${t.h2}</h2>
</div>
<div class="rn-grid">${items}</div>
</section>`;
}

function patchContact(h, lang) {
  const t = L[lang];
  return h
    .replace(/<span class="contact-label">\/\/ 3 ways to reach us<\/span>/, `<span class="contact-label">${t.contactLab}</span>`)
    .replace(
      /<h2 class="contact-h2">Let's <span class="cy">sort<\/span> it\.<\/h2>/,
      `<h2 class="contact-h2">${t.contactH2}</h2>`
    )
    .replace(/<div class="lab">\/\/ EMAIL · BEST FOR DETAIL<\/div>/, `<div class="lab">${t.emailLab}</div>`)
    .replace(/<div class="met">Reply within 24 hrs · Documented<\/div>/, `<div class="met">${t.emailMet}</div>`)
    .replace(/<div class="lab">\/\/ WHATSAPP · QUICK Qs<\/div>/, `<div class="lab">${t.waLab}</div>`)
    .replace(/<div class="met">Mon-Sat 9-18 ICT · EN · DE · РУ<\/div>/, `<div class="met">${t.waMet}</div>`)
    .replace(/<div class="lab">\/\/ CONTACT FORM<\/div>/, `<div class="lab">${t.formLab}</div>`)
    .replace(/<div class="act">Use the form<\/div>/, `<div class="act">${t.formAct}</div>`)
    .replace(/<div class="met">For the full picture<\/div>/, `<div class="met">${t.formMet}</div>`);
}

let n = 0;
for (const [url, cards] of Object.entries(CARDS)) {
  const lang = url.startsWith('/de/') ? 'de' : 'ru';
  const file = path.join(ROOT, url.slice(1), 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('skip missing', url);
    continue;
  }
  let h = fs.readFileSync(file, 'utf8');
  const block = readNextHtml(lang, cards);
  if (!h.includes('<section class="read-next">')) continue;
  h = h.replace(/<section class="read-next">[\s\S]*?<\/section>/, block);
  h = patchContact(h, lang);
  fs.writeFileSync(file, h);
  n++;
  console.log('locale UX', url);
}
console.log(`read-next + contact: ${n} pages`);
