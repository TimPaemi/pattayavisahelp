(function () {
  'use strict';

  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({ send_to: 'G-RSNN24M25C' }, params || {}));
  }

  function path() {
    return window.location.pathname || '/';
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;

      if (/^mailto:/i.test(href)) {
        send('email_click', { link_url: href.slice(0, 120), page_path: path() });
        return;
      }
      if (/whatsapp\.com|wa\.me/i.test(href)) {
        send('whatsapp_click', { link_url: href.slice(0, 120), page_path: path() });
        return;
      }
      if (/line\.me/i.test(href)) {
        send('line_click', { link_url: href.slice(0, 120), page_path: path() });
        return;
      }
      if (/\/tools\/visa-finder\//.test(href)) {
        send('visa_finder_nav', { page_path: path() });
      }
      if (/\/contact\//.test(href)) {
        send('contact_nav', { page_path: path() });
      }
    },
    true
  );

  window.pvhTrack = send;
})();
