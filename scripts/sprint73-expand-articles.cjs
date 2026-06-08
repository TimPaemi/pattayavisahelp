/**
 * Sprint 73 — append depth blocks so locale guide articles reach 400+ words.
 */
const fs = require('fs');
const path = require('path');

const CONTENT = path.join(__dirname, 'content');

const EXPAND = {
  'de-90day-guide-article.html': `<h2>Online-TM47 — typische Fehler</h2>
<p>Falsches Passfoto-Format, abgelaufene TM30-Quittung oder fehlende TDAC blockieren die Online-Meldung. Speichern Sie PDF-Quittungen in einem Ordner „Immigration“ — bei Verlängerungen verlangt Jomtien manchmal die letzten zwei 90-Tage-Nachweise. LTR-Inhaber: jährliche Meldung statt vierteljährlich — trotzdem Kalender pflegen.</p>`,
  'de-bank-guide-article.html': `<h2>SWIFT &amp; FTT für Non-O</h2>
<p>Überweisungen aus DE/AT/CH müssen als <strong>Foreign Transaction (FTT)</strong> auf dem Thai-Kontoauszug erscheinen — sonst zählt das Geld nicht für Seasoning. Bangkok Bank stellt englische Auszüge aus; planen Sie 5–10 Werktage für SWIFT. Kombination Einkommen + Einlage ist möglich — Einkommensnachweis (Rentenbescheid, regelmäßige SWIFT) plus Rest als Seasoning.</p>`,
  'de-health-insurance-guide-article.html': `<h2>Altersstufen &amp; Prämien (Richtwerte)</h2>
<p>50–55: oft 30–50k ฿/Jahr für O-A-konforme Police. 66–70: 80–120k ฿. Ab 71: viele TGIA-Mitglieder verweigern Neuzugang — dann Non-O oder LTR-Savings prüfen. Vergleichen Sie mindestens drei Angebote; Diabetes-Ausschlüsse sind üblich, aber teuer.</p>`,
  'de-overstay-guide-article.html': `<h2>Nach dem Overstay</h2>
<p>Nach freiwilliger Meldung erhalten Sie einen Exit-Stempel (meist 7 Tage). Neues Visum holen Sie bei Botschaft/Konsulat im Ausland oder per DTV/e-Visa online — nicht in Thailand bei touristischem Status. Blacklist-Einträge sind zeitlich begrenzt; längere Overstays können IDC-Aufenthalt bedeuten.</p>`,
  'de-reentry-guide-article.html': `<h2>Formular TM.8 &amp; Timing</h2>
<p>TM.8 am Schalter ausfüllen oder vorab laden (immigration.go.th). Foto 4×6 cm, Pass, aktuelles Visum, Bargeld. Multi-Re-entry lohnt ab der vierten geplanten Reise pro Visum-Jahr. Nach Visum-Verlängerung in Jomtien am selben Tag Multi beantragen — spart einen Extra-Besuch.</p>`,
  'de-retiring-guide-article.html': `<h2>Alltag &amp; Community</h2>
<p>Jomtien-Promenade, Golfclubs, Hash-Runs und Expat-Vereine (DE/EN) füllen den Wochenplan. Big C, Lotus und Villa Market liefern Western-Groceries. Songthaew und Grab decken Transport ab — Auto optional. Krankenversicherung freiwillig auch auf Non-O: 1M IPD reicht oft für Alltag, günstiger als O-A-3M-Police.</p>`,
  'de-tm30-guide-article.html': `<h2>Online-Portal für Vermieter</h2>
<p>Vermieter registrieren sich einmal auf tm30.immigration.go.th, laden Passkopie und Tabien-Baan hoch, erhalten Quittung per E-Mail. Als Mieter: PDF sofort speichern und an Immigration-Ordner hängen. Bei Condo-Wechsel: neue Meldung — alte Quittung reicht nicht für neue Adresse.</p>`,
  'de-visa-runs-guide-article.html': `<h2>Checkliste: Verlängerung statt Run</h2>
<p>TM30 aktuell? 90-Tage gemeldet? Pass 6+ Monate gültig? Jomtien 7:30 anstehen spart Wartezeit. Tourist-Verlängerung 1.900 ฿/30 Tage; Seasoning ฿800k braucht 2 Monate auf Konto — Run ersetzt das nicht. DTV oder Non-O langfristig planen statt Grenz-Schleife.</p>`,
  'ru-90day-guide-article.html': `<h2>Онлайн TM47 — ошибки</h2>
<p>Неверное фото, просроченный TM30 или отсутствие TDAC блокируют подачу. Храните PDF квитанций. LTR: отчёт раз в год, но календарь всё равно ведите. После re-entry отсчёт 90 дней с нового штампа.</p>`,
  'ru-bank-guide-article.html': `<h2>SWIFT и FTT для Non-O</h2>
<p>Перевод из EU/UK/US должен быть помечен FTT на выписке — иначе не засчитают seasoning. Планируйте 5–10 рабочих дней. Комбинация пенсии + депозита возможна: справка о доходе плюс остаток на счёте.</p>`,
  'ru-health-insurance-guide-article.html': `<h2>Возраст и премии</h2>
<p>50–55: ~30–50k ฿/год для O-A. 66–70: 80–120k ฿. После 71 многие страховщики отказывают — Non-O или LTR с $100k. Сравните 3+ предложения; исключения по диабету часты.</p>`,
  'ru-overstay-guide-article.html': `<h2>После overstay</h2>
<p>После добровольной сдачи — штамп на выезд (7 дней). Новую визу — в консульстве за границей или e-visa. Blacklist временный; длительный overstay — IDC.</p>`,
  'ru-reentry-guide-article.html': `<h2>Форма TM.8</h2>
<p>TM.8 на стойке или с сайта immigration.go.th. Фото 4×6, паспорт, виза, наличные. Multi выгоден от 4 поездок за год визы. После продления в Jomtien — сразу оформить multi, чтобы не ехать второй раз.</p>
<p><strong>Забыли permit?</strong> Виза аннулирована — только новая в посольстве. DTV/LTR/Privilege — multi-entry, re-entry не нужен.</p>
<h2>Pattaya-пенсионеры</h2>
<p>Типично: multi ฿3.800 перед летом в ЕС, осенью продление + новый multi. Проверьте 90-day до выезда — без отчёта иногда не оформят re-entry.</p>`,
  'ru-retiring-guide-article.html': `<h2>Быт и сообщество</h2>
<p>Набережная Jomtien, golf, hash-run, клубы expat. Big C и Villa — западные продукты. Grab/songthaew для транспорта. На Non-O добровольная страховка 1M IPD часто дешевле O-A 3M.</p>
<h2>Недвижимость</h2>
<p>Иностранцы — condo в квоте 49%. Jomtien studio от ~฿800k. CAM ฿1.500–4.000/мес. Подробнее: <a href="/property/">property EN</a>.</p>`,
  'ru-tm30-guide-article.html': `<h2>Онлайн для арендодателя</h2>
<p>Регистрация на tm30.immigration.go.th один раз, загрузка паспорта, PDF на email. При смене адреса — новая подача. Сохраняйте квитанции в папке Immigration.</p>`,
  'ru-visa-runs-guide-article.html': `<h2>Чеклист: продление вместо run</h2>
<p>TM30 есть? 90-day сдан? Паспорт 6+ мес? Jomtien в 7:30. Tourist extension ฿1.900/30 дней. Seasoning ฿800k — 2 месяца на счёте, run не заменит. Планируйте DTV/Non-O вместо границы.</p>`,
};

function words(html) {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

for (const [file, block] of Object.entries(EXPAND)) {
  const fp = path.join(CONTENT, file);
  let h = fs.readFileSync(fp, 'utf8');
  if (h.includes('<!-- sprint73-expand -->')) {
    console.log('skip', file);
    continue;
  }
  h = h.replace(/(<p><a href="\/contact\/">[\s\S]*?<\/p>\s*)$/, `<!-- sprint73-expand -->\n${block}\n\n$1`);
  if (!h.includes('sprint73-expand')) {
    h += `\n<!-- sprint73-expand -->\n${block}\n`;
  }
  fs.writeFileSync(fp, h);
  console.log(words(h), file);
}
