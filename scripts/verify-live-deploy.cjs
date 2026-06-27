const urls = [
  'https://pattayavisahelp.com/guides/jomtien-queue-times/',
  'https://pattayavisahelp.com/about/',
  'https://pattayavisahelp.com/services/',
  'https://pattayavisahelp.com/guides/jomtien-immigration-office/',
  'https://pattayavisahelp.com/guides/90-day-reporting/',
];

(async () => {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { 'cache-control': 'no-cache' } });
      const t = await r.text();
      const h1 = (t.match(/<h1>([^<]*)<\/h1>/) || [])[1] || '';
      const byline = t.includes('class="byline"') ? 'BYLINE' : '-';
      const noFees = /referral fees, commissions, or kickbacks|no referral fees from agents|take no cut/i.test(t) ? 'POLICY-OK' : '-';
      console.log(r.status, byline, noFees, '|', h1.slice(0, 55), '|', u);
    } catch (e) {
      console.log('ERR', u, e.message);
    }
  }
})();
