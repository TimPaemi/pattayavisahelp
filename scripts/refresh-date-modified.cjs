/**
 * Refresh dateModified on visa pillar pages to today.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const report = [];

for (const d of fs.readdirSync(path.join(ROOT, 'visas'))) {
  const f = path.join(ROOT, 'visas', d, 'index.html');
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  const prev = html.match(/"dateModified":\s*"([^"]+)"/)?.[1];
  if (!prev || prev === TODAY) continue;
  html = html.replace(/"dateModified":\s*"[^"]+"/g, `"dateModified": "${TODAY}"`);
  fs.writeFileSync(f, html);
  report.push(d);
}
console.log(JSON.stringify({ refreshed: report, date: TODAY }, null, 2));
