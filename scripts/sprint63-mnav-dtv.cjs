/**
 * Sprint 63 — inject deferred mnav on DE/RU DTV visa pilots (CSS already present).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MNAV = `<script defer>(function(){if(window.__mnavLoaded)return;window.__mnavLoaded=1;function init(){if(document.querySelector('.mnav'))return;var n=document.createElement('nav');n.className='mnav';n.setAttribute('aria-label','Mobile navigation');var p=location.pathname;function a(href,ic,label){var c=p.indexOf(href)===0&&href!=='/'||(href==='/'&&p==='/')?' active':'';var cta=href==='/contact/'?' cta':'';return '<a href="'+href+'" class="'+(c+cta).trim()+'"><span class="ic">'+ic+'</span>'+label+'</a>'}n.innerHTML=a('/','\u2302','Home')+a('/visas/','\u29C9','Visas')+a('/tools/','\u25C8','Tools')+a('/blog/','\u00B6','Blog')+a('/contact/','\u2709','Contact');document.body.appendChild(n)}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}})();</script>`;

const TARGETS = ['/de/visas/dtv/', '/ru/visas/dtv/'];

for (const url of TARGETS) {
  const file = path.join(ROOT, url.slice(1), 'index.html');
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('__mnavLoaded')) {
    console.log('skip mnav', url);
    continue;
  }
  if (!h.includes('</style>')) throw new Error('no style close: ' + url);
  h = h.replace('</style>', `</style>\n${MNAV}`);
  fs.writeFileSync(file, h);
  console.log('mnav', url);
}
