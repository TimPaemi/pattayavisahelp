(function () {
  'use strict';
  var KEY = 'pvh_cookie_consent';
  var privacyUrl = '/privacy/';

  function cookieCopy() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) {
      return {
        aria: 'Cookie-Einstellungen',
        text:
          'Optional nutzen wir <strong style="color:#fafafa">Google Analytics</strong> für aggregierte Besucherzahlen (erst nach Zustimmung). Kein Werbe-Tracking. <a href="' +
          privacyUrl +
          '">Datenschutz</a>.',
        decline: 'Nur essenziell',
        accept: 'Analytics erlauben',
      };
    }
    if (p.indexOf('/ru/') === 0) {
      return {
        aria: 'Настройки cookie',
        text:
          'По желанию мы используем <strong style="color:#fafafa">Google Analytics</strong> для обобщённой статистики (только после согласия). Без рекламного трекинга. <a href="' +
          privacyUrl +
          '">Политика конфиденциальности</a>.',
        decline: 'Только необходимое',
        accept: 'Разрешить аналитику',
      };
    }
    return {
      aria: 'Cookie preferences',
      text:
        'We use optional <strong style="color:#fafafa">Google Analytics</strong> to see aggregate traffic (deferred until you accept). No ad tracking. <a href="' +
        privacyUrl +
        '">Privacy policy</a>.',
      decline: 'Essential only',
      accept: 'Accept analytics',
    };
  }

  function getConsent() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {}
    if (value === 'accepted') {
      window.dispatchEvent(new Event('pvh-consent-accepted'));
      if (typeof window.__pvhLoadGtag === 'function') {
        window.__pvhLoadGtag();
      }
    }
  }

  function injectStyles() {
    if (document.getElementById('pvh-cookie-styles')) return;
    var s = document.createElement('style');
    s.id = 'pvh-cookie-styles';
    s.textContent =
      '#pvh-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:300;padding:1rem 1.25rem calc(1rem + env(safe-area-inset-bottom,0px));background:rgba(10,10,10,.96);border-top:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px);font:400 .9rem/1.55 Inter,system-ui,sans-serif;color:#fafafa}' +
      '#pvh-cookie-banner .pvh-cookie-inner{max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}' +
      '#pvh-cookie-banner p{margin:0;flex:1 1 280px;color:#a1a1aa;font-size:.88rem}' +
      '#pvh-cookie-banner a{color:#06b6d4}' +
      '#pvh-cookie-actions{display:flex;flex-wrap:wrap;gap:.5rem}' +
      '#pvh-cookie-banner button{font:600 .68rem/1 "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;padding:.65rem 1rem;border-radius:6px;cursor:pointer;border:1px solid rgba(255,255,255,.14);background:transparent;color:#fafafa}' +
      '#pvh-cookie-banner button.pvh-accept{background:#06b6d4;color:#000;border-color:#06b6d4}' +
      '@media(max-width:760px){body.pvh-cookie-open{padding-bottom:7rem}}' +
      '@media(max-width:760px){body.pvh-cookie-open:has(.mnav){padding-bottom:calc(7rem + 72px + env(safe-area-inset-bottom,0px))}}' +
      '@media(max-width:760px){body.pvh-cookie-open:has(.mnav) #pvh-cookie-banner{bottom:calc(56px + env(safe-area-inset-bottom,0px))}}';
    document.head.appendChild(s);
  }

  function showBanner() {
    if (document.getElementById('pvh-cookie-banner')) return;
    injectStyles();
    document.body.classList.add('pvh-cookie-open');
    var c = cookieCopy();
    var el = document.createElement('div');
    el.id = 'pvh-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', c.aria);
    el.innerHTML =
      '<div class="pvh-cookie-inner">' +
      '<p>' +
      c.text +
      '</p>' +
      '<div id="pvh-cookie-actions">' +
      '<button type="button" class="pvh-decline">' +
      c.decline +
      '</button>' +
      '<button type="button" class="pvh-accept">' +
      c.accept +
      '</button>' +
      '</div></div>';
    document.body.appendChild(el);
    el.querySelector('.pvh-accept').addEventListener('click', function () {
      setConsent('accepted');
      el.remove();
      document.body.classList.remove('pvh-cookie-open');
    });
    el.querySelector('.pvh-decline').addEventListener('click', function () {
      setConsent('declined');
      el.remove();
      document.body.classList.remove('pvh-cookie-open');
    });
  }

  var existing = getConsent();
  if (existing === 'accepted' || existing === 'declined') {
    if (existing === 'accepted') {
      window.dispatchEvent(new Event('pvh-consent-accepted'));
    }
    return;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
