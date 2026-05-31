const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const HOST = 'pattayavisahelp.com';
const KEY_FILE = fs.readdirSync(ROOT).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!KEY_FILE) {
  console.error('No IndexNow key file found');
  process.exit(1);
}
const KEY = fs.readFileSync(path.join(ROOT, KEY_FILE), 'utf8').trim();

function getUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function ping(endpoint, urlList) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY_FILE}`,
      urlList,
    });
    const u = new URL(endpoint);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const urls = getUrls();
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];
  const BATCH = 100;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const label = `${i + 1}-${Math.min(i + BATCH, urls.length)}`;
    for (const ep of endpoints) {
      try {
        const r = await ping(ep, batch);
        console.log(ep, `batch ${label}`, r.status, r.body.slice(0, 80));
      } catch (e) {
        console.error(ep, `batch ${label}`, e.message);
      }
    }
  }
  console.log(`IndexNow: submitted ${urls.length} URLs in ${Math.ceil(urls.length / BATCH)} batches`);
})();
