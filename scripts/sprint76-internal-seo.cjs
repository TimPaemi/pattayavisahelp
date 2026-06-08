/**
 * Sprint 76 — internal links + hub SEO for new guides and money pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const LINK_BLOCK = `<li><a href="/guides/thailand-digital-arrival-card/"><strong>Thailand Digital Arrival Card (TDAC)</strong> — Mandatory within 72h before every entry; replaced TM6 in 2025. <span>(Arrival)</span></a></li>
<li><a href="/guides/non-o-extension-pattaya/"><strong>Non-O extension Pattaya</strong> — Annual retirement extension at Jomtien: ฿800K, TM30, TM7, ฿1,900. <span>(Retirement)</span></a></li>`;

const PATCHES = [
  {
    file: 'guides/index.html',
    find: '<li><a href="/guides/90-day-reporting/"><strong>90-day reporting</strong>',
    insert: `${LINK_BLOCK}\n<li><a href="/guides/90-day-reporting/"><strong>90-day reporting</strong>`,
  },
  {
    file: 'visas/retirement-non-o/index.html',
    find: '<h2>Application — at Jomtien Immigration</h2>',
    insert: `<p><strong>Pattaya extension:</strong> <a href="/guides/non-o-extension-pattaya/">Non-O extension at Jomtien</a> · <a href="/guides/jomtien-immigration-office/">Jomtien office guide</a> · <a href="/blog/non-o-extension-documents-2026/">Document checklist</a></p>\n<h2>Application — at Jomtien Immigration</h2>`,
  },
  {
    file: 'guides/jomtien-immigration-office/index.html',
    find: '<h2>Services available at Jomtien</h2>',
    insert: `<p><strong>Step-by-step:</strong> <a href="/guides/non-o-extension-pattaya/">Non-O extension Pattaya</a> · <a href="/guides/thailand-digital-arrival-card/">TDAC arrival card</a> · <a href="/guides/90-day-reporting/">90-day reporting</a></p>\n<h2>Services available at Jomtien</h2>`,
  },
  {
    file: 'guides/90-day-reporting/index.html',
    find: '<h2>What is 90-day reporting?</h2>',
    insert: `<p><strong>Before reporting:</strong> File <a href="/guides/thailand-digital-arrival-card/">TDAC</a> on every entry — missing TDAC blocks online TM47.</p>\n<h2>What is 90-day reporting?</h2>`,
  },
  {
    file: 'index.html',
    find: '<a href="/blog/90-day-report-online-2026/">90-day online reporting</a>',
    insert: `<a href="/guides/thailand-digital-arrival-card/">TDAC guide</a> · <a href="/guides/non-o-extension-pattaya/">Non-O extension Pattaya</a> · <a href="/blog/90-day-report-online-2026/">90-day online reporting</a>`,
  },
  {
    file: 'blog/tdac-step-by-step/index.html',
    find: '<main id="main" class="article-body">',
    insert: `<main id="main" class="article-body">
<p><strong>Pillar guide:</strong> <a href="/guides/thailand-digital-arrival-card/">Thailand Digital Arrival Card (TDAC) — full guide</a></p>`,
  },
  {
    file: 'blog/non-o-extension-documents-2026/index.html',
    find: '<main id="main" class="article-body">',
    insert: `<main id="main" class="article-body">
<p><strong>Pillar guide:</strong> <a href="/guides/non-o-extension-pattaya/">Non-O extension Pattaya — Jomtien guide</a></p>`,
  },
  {
    file: 'visas/dtv/index.html',
    find: '<p class="network-context">Training in Pattaya?',
    insert: `<p class="network-context">Arrival: <a href="/guides/thailand-digital-arrival-card/">TDAC digital arrival card</a> (mandatory 72h before landing)</p>\n<p class="network-context">Training in Pattaya?`,
  },
];

function patch(rel, find, insert, once) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return false;
  let h = fs.readFileSync(file, 'utf8');
  if (!h.includes(find)) return false;
  if (once && h.includes(insert.trim().slice(0, 40))) return false;
  h = h.replace(find, insert);
  fs.writeFileSync(file, h);
  return true;
}

let n = 0;
for (const p of PATCHES) {
  if (patch(p.file, p.find, p.insert, p.once)) {
    n++;
    console.log('linked', p.file);
  }
}

// DE/RU DTV — inject gtag + cookie consent (indexed pilots missing GA)
const GTAG = `<script src="/cookie-consent.js" defer></script>
<!-- Google tag (gtag.js) - delayed for LCP -->
<script>
(function(w,d,id){
  w.dataLayer=w.dataLayer||[];
  w.gtag=w.gtag||function(){w.dataLayer.push(arguments)};
  w.gtag('js',new Date());
  function loadGtag(){
    if(w.__pvhGtagLoaded)return;
    w.__pvhGtagLoaded=1;
    var s=d.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+id;
    d.head.appendChild(s);
    w.gtag('config',id);
  }
  w.__pvhLoadGtag=loadGtag;
  function armGtag(){
    if(navigator.doNotTrack==='1'||w.doNotTrack==='1')return;
    if(localStorage.getItem('pvh_cookie_consent')==='declined')return;
    if(localStorage.getItem('pvh_cookie_consent')!=='accepted')return;
    ['pointerdown','keydown','scroll'].forEach(function(evt){
      w.addEventListener(evt,loadGtag,{once:true,passive:true});
    });
    w.setTimeout(loadGtag,5000);
  }
  armGtag();
  w.addEventListener('pvh-consent-accepted',armGtag);
})(window,document,'G-RSNN24M25C');
</script>`;

for (const rel of ['de/visas/dtv/index.html', 'ru/visas/dtv/index.html']) {
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('G-RSNN24M25C')) continue;
  h = h.replace(
    '<script src="/analytics-events.js" defer></script>',
    `${GTAG}\n<script src="/analytics-events.js" defer></script>`
  );
  fs.writeFileSync(file, h);
  console.log('GA fixed', rel);
  n++;
}

console.log('internal SEO patches:', n);
