(function () {
  'use strict';
  if (window.__pvhUxEnhancements) return;
  window.__pvhUxEnhancements = 1;

  function pageLang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/ru/') === 0) return 'ru';
    return 'en';
  }

  var L = {
    en: { network: 'Related links', home: 'Home', visas: 'Visas', tools: 'Tools', guides: 'Blog', contact: 'Contact', sections: 'Sections' },
    de: { network: 'Verwandte Seiten', home: 'Start', visas: 'Visa', tools: 'Tools', guides: 'Guides', contact: 'Kontakt', sections: 'Abschnitte' },
    ru: { network: 'Связанные страницы', home: 'Главная', visas: 'Визы', tools: 'Tools', guides: 'Гиды', contact: 'Контакт', sections: 'Разделы' },
  };

  function wrapNetworkStrips() {
    var lang = pageLang();
    var t = L[lang] || L.en;
    document.querySelectorAll('p.network-context').forEach(function (p) {
      if (p.closest('details.pvh-network')) return;
      var d = document.createElement('details');
      d.className = 'pvh-network';
      if (window.matchMedia('(min-width: 761px)').matches) d.open = true;
      var s = document.createElement('summary');
      s.textContent = t.network;
      p.parentNode.insertBefore(d, p);
      d.appendChild(s);
      d.appendChild(p);
    });
  }

  function localizeMnav() {
    var lang = pageLang();
    var t = L[lang] || L.en;
    var m = document.querySelector('.mnav');
    if (!m) return;
    var keys = ['home', 'visas', 'tools', 'guides', 'contact'];
    m.querySelectorAll('a').forEach(function (a, i) {
      if (!keys[i] || !t[keys[i]]) return;
      var ic = a.querySelector('.ic');
      var label = t[keys[i]];
      if (ic) {
        a.innerHTML = ic.outerHTML + label;
      } else {
        a.textContent = label;
      }
    });
  }

  function localizeTocLabel() {
    var lang = pageLang();
    var text = lang === 'de' ? '// Auf dieser Seite' : lang === 'ru' ? '// На этой странице' : '';
    if (!text) return;
    function apply() {
      document.querySelectorAll('.toc-label').forEach(function (el) {
        el.textContent = text;
      });
    }
    apply();
    setTimeout(apply, 200);
    setTimeout(apply, 800);
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\w\s\u00c0-\u024f\u0400-\u04ff-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 48) || 'section';
  }

  function buildMobileSectionJump() {
    if (window.matchMedia('(min-width: 1400px)').matches) return;
    if (document.querySelector('details.pvh-section-jump')) return;
    var root = document.querySelector('main.article-body, main#main.article-body, main#main');
    if (!root) return;
    var heads = root.querySelectorAll('h2');
    if (heads.length < 3) return;

    var lang = pageLang();
    var t = L[lang] || L.en;
    var used = {};
    var links = [];
    heads.forEach(function (h) {
      if (!h.id) {
        var base = slugify(h.textContent);
        var id = base;
        var n = 2;
        while (used[id] || document.getElementById(id)) {
          id = base + '-' + n++;
        }
        used[id] = 1;
        h.id = id;
      }
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/\s+/g, ' ').trim();
      links.push(a);
    });

    var d = document.createElement('details');
    d.className = 'pvh-section-jump';
    var s = document.createElement('summary');
    s.textContent = t.sections;
    var nav = document.createElement('nav');
    links.forEach(function (a) {
      nav.appendChild(a);
    });
    d.appendChild(s);
    d.appendChild(nav);

    var anchor = document.querySelector('header.article-head') || root;
    if (anchor === root) {
      root.insertBefore(d, root.firstChild);
    } else {
      anchor.parentNode.insertBefore(d, anchor.nextSibling);
    }
  }

  function localizeArticleChrome() {
    var lang = pageLang();
    if (lang === 'de') {
      document.querySelectorAll('.article-label').forEach(function (el) {
        if (el.textContent.indexOf('GUIDE') >= 0) el.textContent = '// LEITFADEN · PRAXIS';
      });
      document.querySelectorAll('.article-meta .read').forEach(function (el) {
        if (/MIN READ/.test(el.textContent)) {
          el.textContent = el.textContent.replace('MIN READ', 'MIN LESEN');
        }
      });
    }
    if (lang === 'ru') {
      document.querySelectorAll('.article-label').forEach(function (el) {
        if (el.textContent.indexOf('GUIDE') >= 0) el.textContent = '// ГИД · ПРАКТИКА';
      });
      document.querySelectorAll('.article-meta .read').forEach(function (el) {
        if (/MIN READ/.test(el.textContent)) {
          el.textContent = el.textContent.replace('MIN READ', 'МИН ЧТЕНИЕ');
        }
      });
    }
  }

  function run() {
    wrapNetworkStrips();
    buildMobileSectionJump();
    localizeMnav();
    localizeTocLabel();
    localizeArticleChrome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  /* mnav is injected after DOMContentLoaded on many pages */
  setTimeout(localizeMnav, 400);
})();
