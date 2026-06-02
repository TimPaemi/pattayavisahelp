/**
 * Sprint 34 — reduce main-thread work on Lighthouse outlier pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROUTES = [
  'guides/jomtien-immigration-office/index.html',
  'compare/dtv-vs-ltr/index.html',
  'compare/visa-comparison-matrix/index.html',
];

const FADE_OLD = `  var fadeEls = document.querySelectorAll('.article-body h2, .article-body > p, .read-next, .contact-section, .vstats-wrap');
  fadeEls.forEach(function(el){ el.classList.add('fade-up'); });
  var fio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); fio.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  fadeEls.forEach(function(el){ fio.observe(el); });`;

const FADE_NEW = `  var fadeEls = document.querySelectorAll('.article-body h2, .article-body > p, .read-next, .contact-section, .vstats-wrap');
  fadeEls = Array.prototype.slice.call(fadeEls, 0, 14);
  fadeEls.forEach(function(el){ el.classList.add('fade-up'); });
  var fio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); fio.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  fadeEls.forEach(function(el){ fio.observe(el); });`;

const BADGE_OLD = `  // Auto-badge visa codes + currency in article body
  var ab = document.querySelectorAll('.article-body p, .article-body li, .article-body td');
  ab.forEach(function(el){`;

const BADGE_NEW = `  // Auto-badge visa codes + currency in article body (idle — Sprint 34 perf)
  function runAutoBadge(){
  var ab = document.querySelectorAll('.article-body p, .article-body li, .article-body td');
  ab.forEach(function(el){`;

const BADGE_CLOSE_OLD = `  });
  
  // Animated count-up`;
const BADGE_CLOSE_NEW = `  });
  }
  if('requestIdleCallback' in window){ requestIdleCallback(runAutoBadge,{timeout:2500}); }
  else { setTimeout(runAutoBadge, 1200); }
  
  // Animated count-up`;

for (const rel of ROUTES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.warn('skip missing', rel);
    continue;
  }
  let h = fs.readFileSync(file, 'utf8');
  let n = 0;
  if (h.includes(FADE_OLD)) {
    h = h.replace(FADE_OLD, FADE_NEW);
    n++;
  }
  if (h.includes(BADGE_OLD) && !h.includes('runAutoBadge')) {
    h = h.replace(BADGE_OLD, BADGE_NEW);
    h = h.replace(BADGE_CLOSE_OLD, BADGE_CLOSE_NEW);
    n++;
  }
  if (n) {
    fs.writeFileSync(file, h);
    console.log('patched', rel, n);
  } else {
    console.log('no perf patch needed', rel);
  }
}
