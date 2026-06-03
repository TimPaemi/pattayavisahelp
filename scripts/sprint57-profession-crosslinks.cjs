/**
 * Sprint 57 — in-page cross-links on DE/RU + EN profession pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const MAP = {
  'content-creator': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/de/professions/saas-founder/', 'SaaS (DE)'],
      ['/digital-nomad/', 'Nomad EN'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/ru/professions/saas-founder/', 'SaaS RU'],
      ['/digital-nomad/', 'nomad EN'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/professions/saas-founder/', 'SaaS founder'],
      ['/de/professions/content-creator/', 'Guide (DE)'],
    ],
  },
  'saas-founder': {
    de: [
      ['/de/visas/smart/', 'SMART (DE)'],
      ['/de/visas/ltr/', 'LTR (DE)'],
      ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/de/compare/dtv-vs-smart/', 'DTV vs SMART'],
    ],
    ru: [
      ['/ru/visas/smart/', 'SMART RU'],
      ['/ru/visas/ltr/', 'LTR RU'],
      ['/ru/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/ru/compare/dtv-vs-smart/', 'DTV vs SMART'],
    ],
    en: [
      ['/visas/smart/', 'SMART'],
      ['/visas/ltr/', 'LTR'],
      ['/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/ru/professions/saas-founder/', 'Guide (RU)'],
    ],
  },
  'online-business-owner': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/guides/setting-up-thai-company/', 'Firma EN'],
      ['/de/best-visa/under-50k/', 'Mid-Budget'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/guides/setting-up-thai-company/', 'компания EN'],
      ['/ru/best-visa/', 'бюджет'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/visas/business-non-b/', 'Non-B'],
      ['/guides/setting-up-thai-company/', 'Thai company'],
      ['/best-visa/under-50k/', 'Mid budget'],
    ],
  },
  'affiliate-marketer': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/professions/crypto-trader/', 'Crypto (DE)'],
      ['/de/best-visa/under-20k/', 'Budget-Tier'],
      ['/guides/thai-tax-foreign-residents/', 'Steuer EN'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/professions/crypto-trader/', 'crypto RU'],
      ['/ru/best-visa/', 'бюджет'],
      ['/guides/thai-tax-foreign-residents/', 'tax EN'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/professions/crypto-trader/', 'Crypto trader'],
      ['/best-visa/under-20k/', 'Budget tier'],
      ['/guides/thai-tax-foreign-residents/', 'Tax guide'],
    ],
  },
  'crypto-trader': {
    de: [
      ['/de/visas/ltr/', 'LTR (DE)'],
      ['/de/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
      ['/guides/thai-tax-foreign-residents/', 'Steuer EN'],
      ['/de/best-visa/under-500k/', 'Premium'],
    ],
    ru: [
      ['/ru/visas/ltr/', 'LTR RU'],
      ['/ru/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
      ['/guides/thai-tax-foreign-residents/', 'tax EN'],
      ['/ru/best-visa/', 'бюджет'],
    ],
    en: [
      ['/visas/ltr/', 'LTR'],
      ['/compare/privilege-vs-ltr/', 'Privilege vs LTR'],
      ['/guides/thai-tax-foreign-residents/', 'Tax guide'],
      ['/best-visa/under-500k/', 'Premium tier'],
    ],
  },
  'ai-engineer': {
    de: [
      ['/de/visas/smart/', 'SMART (DE)'],
      ['/de/visas/ltr/', 'LTR (DE)'],
      ['/de/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/de/professions/saas-founder/', 'SaaS (DE)'],
    ],
    ru: [
      ['/ru/visas/smart/', 'SMART RU'],
      ['/ru/visas/ltr/', 'LTR RU'],
      ['/ru/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/ru/professions/saas-founder/', 'SaaS RU'],
    ],
    en: [
      ['/visas/smart/', 'SMART'],
      ['/visas/ltr/', 'LTR'],
      ['/compare/smart-vs-ltr/', 'SMART vs LTR'],
      ['/de/professions/ai-engineer/', 'Guide (DE)'],
    ],
  },
  'english-teacher': {
    de: [
      ['/de/visas/education-ed/', 'ED (DE)'],
      ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/work-permit/', 'Work permit EN'],
      ['/guides/verify-moe-accredited-school/', 'MOE EN'],
    ],
    ru: [
      ['/ru/visas/education-ed/', 'ED RU'],
      ['/ru/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/work-permit/', 'work permit EN'],
      ['/guides/verify-moe-accredited-school/', 'MOE EN'],
    ],
    en: [
      ['/visas/education-ed/', 'ED visa'],
      ['/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/work-permit/', 'Work permit'],
      ['/guides/verify-moe-accredited-school/', 'MOE schools'],
    ],
  },
  'fitness-trainer': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/work-permit/', 'Work permit EN'],
      ['/gyms/', 'Gyms EN'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/work-permit/', 'work permit EN'],
      ['/gyms/', 'gyms EN'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/visas/business-non-b/', 'Non-B'],
      ['/work-permit/', 'Work permit'],
      ['/gyms/', 'Gyms hub'],
    ],
  },
  'diving-instructor': {
    de: [
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/work-permit/', 'Work permit EN'],
      ['/de/visas/media-non-m/', 'Non-M (DE)'],
      ['/de/pattaya/', 'Pattaya (DE)'],
    ],
    ru: [
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/work-permit/', 'work permit EN'],
      ['/ru/visas/media-non-m/', 'Non-M RU'],
      ['/ru/pattaya/', 'Паттайя'],
    ],
    en: [
      ['/visas/business-non-b/', 'Non-B'],
      ['/work-permit/', 'Work permit'],
      ['/visas/media-non-m/', 'Non-M'],
      ['/pattaya/jomtien/', 'Jomtien'],
    ],
  },
  'yoga-teacher': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/visas/education-ed/', 'ED (DE)'],
      ['/de/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/de/professions/fitness-trainer/', 'Fitness (DE)'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/visas/education-ed/', 'ED RU'],
      ['/ru/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/ru/professions/fitness-trainer/', 'fitness RU'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/visas/education-ed/', 'ED'],
      ['/compare/ed-vs-dtv/', 'ED vs DTV'],
      ['/professions/fitness-trainer/', 'Fitness trainer'],
    ],
  },
  'photographer': {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/visas/media-non-m/', 'Non-M (DE)'],
      ['/de/professions/content-creator/', 'Creator (DE)'],
      ['/de/pattaya/', 'Pattaya (DE)'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/visas/media-non-m/', 'Non-M RU'],
      ['/ru/professions/content-creator/', 'creator RU'],
      ['/ru/pattaya/', 'Паттайя'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/visas/media-non-m/', 'Non-M'],
      ['/professions/content-creator/', 'Content creator'],
      ['/pattaya-digital-nomad-guide/', 'Pattaya nomad'],
    ],
  },
  'real-estate-agent': {
    de: [
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/guides/buying-property-thailand/', 'Immobilie EN'],
      ['/work-permit/', 'Work permit EN'],
      ['/de/professions/online-business-owner/', 'Online biz (DE)'],
    ],
    ru: [
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/guides/buying-property-thailand/', 'property EN'],
      ['/work-permit/', 'work permit EN'],
      ['/property/', 'property hub EN'],
    ],
    en: [
      ['/visas/business-non-b/', 'Non-B'],
      ['/guides/buying-property-thailand/', 'Buying property'],
      ['/work-permit/', 'Work permit'],
      ['/property/', 'Property hub'],
    ],
  },
  chef: {
    de: [
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/work-permit/', 'Work permit EN'],
      ['/de/pattaya/', 'Pattaya (DE)'],
      ['/pattaya/living-in-pattaya/', 'Living EN'],
    ],
    ru: [
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/work-permit/', 'work permit EN'],
      ['/ru/pattaya/', 'Паттайя'],
      ['/pattaya/living-in-pattaya/', 'living EN'],
    ],
    en: [
      ['/visas/business-non-b/', 'Non-B'],
      ['/work-permit/', 'Work permit'],
      ['/pattaya/living-in-pattaya/', 'Living in Pattaya'],
      ['/de/professions/chef/', 'Guide (DE)'],
    ],
  },
  dj: {
    de: [
      ['/de/visas/dtv/', 'DTV (DE)'],
      ['/de/visas/media-non-m/', 'Non-M (DE)'],
      ['/de/professions/content-creator/', 'Creator (DE)'],
      ['/digital-nomad/', 'Nomad EN'],
    ],
    ru: [
      ['/ru/visas/dtv/', 'DTV RU'],
      ['/ru/visas/media-non-m/', 'Non-M RU'],
      ['/ru/professions/content-creator/', 'creator RU'],
      ['/digital-nomad/', 'nomad EN'],
    ],
    en: [
      ['/visas/dtv/', 'DTV'],
      ['/visas/media-non-m/', 'Non-M'],
      ['/professions/content-creator/', 'Content creator'],
      ['/digital-nomad/', 'Digital nomad'],
    ],
  },
  hairdresser: {
    de: [
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/work-permit/', 'Work permit EN'],
      ['/de/professions/chef/', 'Chef (DE)'],
      ['/guides/visa-scams-pattaya/', 'Scams EN'],
    ],
    ru: [
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/work-permit/', 'work permit EN'],
      ['/ru/professions/chef/', 'chef RU'],
      ['/guides/visa-scams-pattaya/', 'scams EN'],
    ],
    en: [
      ['/visas/business-non-b/', 'Non-B'],
      ['/work-permit/', 'Work permit'],
      ['/professions/chef/', 'Chef guide'],
      ['/guides/visa-scams-pattaya/', 'Visa scams'],
    ],
  },
  'tattoo-artist': {
    de: [
      ['/de/visas/business-non-b/', 'Non-B (DE)'],
      ['/work-permit/', 'Work permit EN'],
      ['/de/professions/hairdresser/', 'Hairdresser (DE)'],
      ['/de/pattaya/', 'Pattaya (DE)'],
    ],
    ru: [
      ['/ru/visas/business-non-b/', 'Non-B RU'],
      ['/work-permit/', 'work permit EN'],
      ['/ru/professions/hairdresser/', 'hair RU'],
      ['/ru/pattaya/', 'Паттайя'],
    ],
    en: [
      ['/visas/business-non-b/', 'Non-B'],
      ['/work-permit/', 'Work permit'],
      ['/professions/hairdresser/', 'Hairdresser'],
      ['/ru/professions/tattoo-artist/', 'Guide (RU)'],
    ],
  },
};

function block(lang, label, links) {
  const parts = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `<!-- sprint57-profession-crosslinks -->\n<p class="network-context">${label}: ${parts}</p>\n`;
}

function patchFile(file, links, label) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint57-profession-crosslinks')) return false;
  const html = block('x', label, links);
  const anchors = ['<h2>FAQ</h2>', '<div class="faq">', '<h2>Related', '<h2>Verwandte', '<h2>Связанные'];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  const mainEnd = h.lastIndexOf('</main>');
  if (mainEnd < 0) return false;
  h = h.slice(0, mainEnd) + html + h.slice(mainEnd);
  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const slug of Object.keys(MAP)) {
  for (const lang of ['de', 'ru', 'en']) {
    const links = MAP[slug][lang];
    const label = lang === 'de' ? 'Beruf & Visa (DE)' : lang === 'ru' ? 'Профессия и визы (RU)' : 'Profession pathways';
    const prefix = lang === 'en' ? 'professions' : `${lang}/professions`;
    const file = path.join(ROOT, prefix, slug, 'index.html');
    if (!fs.existsSync(file)) continue;
    if (patchFile(file, links, label)) {
      n++;
      console.log('prof', lang, slug);
    }
  }
}
console.log(`Sprint 57 profession crosslinks: ${n} pages`);
