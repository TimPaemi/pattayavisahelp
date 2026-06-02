const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'llms.txt');
let t = fs.readFileSync(p, 'utf8');

const old = `- **Indexed locale pilots (full translation):** [DTV auf Deutsch](https://pattayavisahelp.com/de/visas/dtv/), [DTV на русском](https://pattayavisahelp.com/ru/visas/dtv/)`;
const neu = `- **Indexed locale pilots (full translation):**
  - DTV: [DE](https://pattayavisahelp.com/de/visas/dtv/), [RU](https://pattayavisahelp.com/ru/visas/dtv/)
  - LTR: [DE](https://pattayavisahelp.com/de/visas/ltr/), [RU](https://pattayavisahelp.com/ru/visas/ltr/)
  - Non-O Retirement: [DE](https://pattayavisahelp.com/de/visas/retirement-non-o/), [RU](https://pattayavisahelp.com/ru/visas/retirement-non-o/)`;

if (t.includes('Indexed locale pilots') && !t.includes('/de/visas/ltr/')) {
  t = t.replace(old, neu);
  fs.writeFileSync(p, t);
  console.log('llms.txt: pilots expanded');
} else {
  console.log('llms.txt: skip');
}
