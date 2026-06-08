/**
 * Locale-aware mobile bottom navigation (replaces per-page inline injectors over time).
 */
(function () {
  'use strict';
  if (window.__mnavLoaded) return;
  window.__mnavLoaded = 1;

  var L = {
    en: { home: 'Home', visas: 'Visas', tools: 'Tools', guides: 'Blog', contact: 'Contact' },
    de: { home: 'Start', visas: 'Visa', tools: 'Tools', guides: 'Guides', contact: 'Kontakt' },
    ru: { home: 'Главная', visas: 'Визы', tools: 'Tools', guides: 'Гиды', contact: 'Контакт' },
  };

  function lang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/ru/') === 0) return 'ru';
    return 'en';
  }

  function paths(lg) {
    if (lg === 'de') {
      return { home: '/de/', visas: '/de/visas/', tools: '/de/tools/', guides: '/de/guides/', contact: '/contact/' };
    }
    if (lg === 'ru') {
      return { home: '/ru/', visas: '/ru/visas/', tools: '/ru/tools/', guides: '/ru/guides/', contact: '/contact/' };
    }
    return { home: '/', visas: '/visas/', tools: '/tools/', guides: '/blog/', contact: '/contact/' };
  }

  function init() {
    if (document.querySelector('.mnav')) return;
    var lg = lang();
    var t = L[lg] || L.en;
    var hrefs = paths(lg);
    var p = location.pathname;
    var n = document.createElement('nav');
    n.className = 'mnav';
    n.setAttribute('aria-label', 'Mobile navigation');

    function item(href, ic, key) {
      var active =
        (href !== '/' && href !== '/de/' && href !== '/ru/' && p.indexOf(href) === 0) ||
        ((href === '/' || href === '/de/' || href === '/ru/') &&
          (p === href || p === href.slice(0, -1)))
          ? ' active'
          : '';
      var cta = href === '/contact/' ? ' cta' : '';
      return (
        '<a href="' +
        href +
        '" class="' +
        (active + cta).trim() +
        '"><span class="ic">' +
        ic +
        '</span>' +
        t[key] +
        '</a>'
      );
    }

    n.innerHTML =
      item(hrefs.home, '\u2302', 'home') +
      item(hrefs.visas, '\u29C9', 'visas') +
      item(hrefs.tools, '\u25C8', 'tools') +
      item(hrefs.guides, '\u00B6', 'guides') +
      item(hrefs.contact, '\u2709', 'contact');
    document.body.appendChild(n);
    window.dispatchEvent(new Event('pvh-mnav-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
