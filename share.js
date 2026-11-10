/*!
 * WACD.ART — кнопка «Поделиться» / bouton « Partager »
 * Один файл на весь сайт. Подключение (перед </body>):
 *   <script src="/share.js" defer></script>
 * Положить в КОРЕНЬ репозитория рядом с index.html.
 * Язык определяется сам: fr.html → французский, остальное → английский.
 * Ссылка для шеринга берётся из <link rel="canonical">, поэтому всегда
 * ведёт на правильный адрес (…/имя.html), а не на дубль без .html.
 */
(function () {
  'use strict';
  if (window.__wacdShare) return;
  window.__wacdShare = true;

  var script = document.currentScript;
  var side = (script && script.getAttribute('data-position') === 'right') ? 'right' : 'left';

  var isFR = /^fr/i.test(document.documentElement.lang || '') || /\/fr(\.html)?\/?$/i.test(location.pathname);
  var T = isFR
    ? { share: 'Partager', title: 'Partager cette page', copy: 'Copier le lien', copied: 'Lien copié ✓', email: 'E-mail', close: 'Fermer' }
    : { share: 'Share', title: 'Share this page', copy: 'Copy link', copied: 'Link copied ✓', email: 'Email', close: 'Close' };

  function meta(prop) {
    var el = document.querySelector('meta[property="' + prop + '"]');
    return el ? el.getAttribute('content') : '';
  }
  function getUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    if (c && c.href) return c.href;
    return location.origin + location.pathname;
  }
  function getTitle() {
    return meta('og:title') || document.title || 'WACD.ART';
  }

  /* ---------- стили ---------- */
  var css =
    '.wacd-share{position:fixed;bottom:16px;' + side + ':16px;z-index:9999;font-family:inherit}' +
    '.wacd-share *{box-sizing:border-box}' +
    '.wacd-share__btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;' +
      'border:1px solid rgba(255,140,200,.7);background:rgba(18,14,36,.88);color:#fff;font:600 14px/1 inherit;' +
      'cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);' +
      'box-shadow:0 4px 18px rgba(0,0,0,.35);transition:transform .15s,border-color .15s}' +
    '.wacd-share__btn:hover{transform:translateY(-2px);border-color:#ff8cc8}' +
    '.wacd-share__btn:focus-visible,.wacd-share__item:focus-visible{outline:2px solid #ff8cc8;outline-offset:2px}' +
    '.wacd-share__btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.wacd-share__panel{position:absolute;bottom:52px;' + side + ':0;width:230px;padding:10px;border-radius:14px;' +
      'background:rgba(18,14,36,.96);border:1px solid rgba(255,140,200,.45);box-shadow:0 8px 28px rgba(0,0,0,.45);' +
      'display:none}' +
    '.wacd-share.is-open .wacd-share__panel{display:block}' +
    '.wacd-share__head{display:flex;justify-content:space-between;align-items:center;margin:0 4px 8px;' +
      'color:#ffd1ea;font:600 13px/1.2 inherit}' +
    '.wacd-share__x{background:none;border:0;color:#fff;font-size:20px;line-height:1;cursor:pointer;padding:2px 6px}' +
    '.wacd-share__item{display:block;width:100%;text-align:left;padding:9px 10px;margin:0;border:0;border-radius:8px;' +
      'background:transparent;color:#fff;font:500 14px/1.2 inherit;text-decoration:none;cursor:pointer}' +
    '.wacd-share__item:hover{background:rgba(255,140,200,.16)}' +
    '@media (max-width:480px){.wacd-share{bottom:12px;' + side + ':12px}.wacd-share__btn{padding:10px 14px}}' +
    '@media (prefers-reduced-motion:reduce){.wacd-share__btn{transition:none}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- разметка ---------- */
  var root = document.createElement('div');
  root.className = 'wacd-share';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'wacd-share__btn';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>' +
    '<circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';
  var label = document.createElement('span');
  label.textContent = T.share;
  btn.appendChild(label);

  var panel = document.createElement('div');
  panel.className = 'wacd-share__panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', T.title);

  var head = document.createElement('div');
  head.className = 'wacd-share__head';
  var ht = document.createElement('span');
  ht.textContent = T.title;
  var x = document.createElement('button');
  x.type = 'button';
  x.className = 'wacd-share__x';
  x.setAttribute('aria-label', T.close);
  x.textContent = '×';
  head.appendChild(ht);
  head.appendChild(x);
  panel.appendChild(head);

  function addLink(text, hrefFn) {
    var a = document.createElement('a');
    a.className = 'wacd-share__item';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = text;
    a.addEventListener('click', function () { a.href = hrefFn(); });
    a.href = hrefFn();
    panel.appendChild(a);
  }
  function e(s) { return encodeURIComponent(s); }

  var copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'wacd-share__item';
  copyBtn.textContent = T.copy;
  panel.appendChild(copyBtn);

  addLink('Telegram', function () { return 'https://t.me/share/url?url=' + e(getUrl()) + '&text=' + e(getTitle()); });
  addLink('WhatsApp', function () { return 'https://wa.me/?text=' + e(getTitle() + ' ' + getUrl()); });
  addLink('Facebook', function () { return 'https://www.facebook.com/sharer/sharer.php?u=' + e(getUrl()); });
  addLink('X (Twitter)', function () { return 'https://twitter.com/intent/tweet?url=' + e(getUrl()) + '&text=' + e(getTitle()); });
  addLink('LinkedIn', function () { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + e(getUrl()); });
  var mail = document.createElement('a');
  mail.className = 'wacd-share__item';
  mail.textContent = T.email;
  mail.addEventListener('click', function () {
    mail.href = 'mailto:?subject=' + e(getTitle()) + '&body=' + e(getTitle() + '\n' + getUrl());
  });
  mail.href = '#';
  panel.appendChild(mail);

  root.appendChild(btn);
  root.appendChild(panel);

  /* ---------- поведение ---------- */
  function open() {
    root.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    root.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (err) { reject(err); }
    });
  }

  var touch = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;

  btn.addEventListener('click', function () {
    // На телефонах/планшетах — системное окно «Поделиться»
    if (touch && navigator.share) {
      navigator.share({ title: getTitle(), url: getUrl() }).catch(function () { /* отмена — это нормально */ });
      return;
    }
    root.classList.contains('is-open') ? close() : open();
  });

  x.addEventListener('click', function () { close(); btn.focus(); });

  copyBtn.addEventListener('click', function () {
    copyText(getUrl()).then(function () {
      copyBtn.textContent = T.copied;
      setTimeout(function () { copyBtn.textContent = T.copy; close(); }, 1200);
    }, function () {
      window.prompt(T.copy, getUrl());
    });
  });

  document.addEventListener('click', function (ev) {
    if (!root.contains(ev.target)) close();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && root.classList.contains('is-open')) { close(); btn.focus(); }
  });

  function mount() { document.body.appendChild(root); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
