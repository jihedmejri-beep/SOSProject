// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/ui.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   UI helpers: translation, icons, dialogs, toasts, formatting
   ============================================================ */
(function () {
  'use strict';

  var ICONS = {
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-2h14v2"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>',
    play: '<polygon points="7 4 20 12 7 20" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    'arrow-left': '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
    'arrow-right': '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
    'chevron-right': '<path d="m9 5 7 7-7 7"/>',
    'chevron-down': '<path d="m5 9 7 7 7-7"/>',
    'chevron-up': '<path d="m5 15 7-7 7 7"/>',
    alert: '<path d="M12 3 2 21h20L12 3z"/><path d="M12 9v6"/><path d="M12 18h.01"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    building: '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h3M8 12h3M8 16h3M18 13h.01M18 17h.01"/><path d="M2 21h20"/>',
    heart: '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/>',
    flag: '<path d="M5 21V3"/><path d="M5 4h12l-2 4 2 4H5"/>',
    message: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M8 11h8M8 15h5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h4M9 18h3"/>',
    pen: '<path d="m4 20 4-1 11-11-3-3L5 16z"/><path d="m14 6 3 3"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    'credit-card': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    phone: '<path d="M6 3h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    'map-pin': '<path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    edit: '<path d="m4 20 4-1 11-11-3-3L5 16z"/><path d="m14 6 3 3"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>',
    'pause-circle': '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>'
  };

  function icon(name, cls, size) {
    var s = size || 20;
    return '<svg class="ico ' + (cls || '') + '" width="' + s + '" height="' + s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || ICONS.info) + '</svg>';
  }

  function lang() {
    var st = window.Store && window.Store.state;
    return (st && st.lang) || 'fr';
  }

  function lookup(dict, key) {
    if (!dict) return undefined;
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    return undefined;
  }

  function t(key, params) {
    var dict = window.I18N[lang()] || {};
    var val = lookup(dict, key);
    if (val === undefined) val = lookup(window.I18N.fr, key);
    if (val === undefined) return key;
    if (typeof val !== 'string') return val;
    if (params) {
      Object.keys(params).forEach(function (k) {
        val = val.split('{' + k + '}').join(params[k] == null ? '' : params[k]);
      });
    }
    return val;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var LOCALES = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-TN-u-nu-latn' };

  function locale() { return LOCALES[lang()] || 'fr-FR'; }

  function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    var d = new Date(value.length === 10 ? value + 'T12:00:00' : value);
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(value, opts) {
    var d = parseDate(value);
    if (!d) return '—';
    try {
      return new Intl.DateTimeFormat(locale(), opts || { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) {
      return d.toISOString().slice(0, 10);
    }
  }

  function monthLabel(key, short) {
    var d = parseDate(key + '-01');
    if (!d) return key;
    try {
      return new Intl.DateTimeFormat(locale(), { month: short ? 'short' : 'long', year: 'numeric' }).format(d);
    } catch (e) { return key; }
  }

  function monthShort(key) {
    var d = parseDate(key + '-01');
    if (!d) return key;
    try {
      return new Intl.DateTimeFormat(locale(), { month: 'short' }).format(d);
    } catch (e) { return key; }
  }

  function money(n) {
    var num = Number(n) || 0;
    return new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(num) + ' ' + t('c.currency');
  }

  function villageName(id) {
    var list = window.PAPData.villages;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i][lang()] || list[i].fr;
    }
    return id || '—';
  }

  function badge(tag) {
    if (tag === 'fact') {
      return '<span class="badge badge--fact">' + icon('check', '', 14) + t('c.published') + '</span>';
    }
    return '<span class="badge badge--sim">' + icon('sparkles', '', 14) + t('c.proposed') + '</span>';
  }

  function roleChip(role) {
    return '<span class="role-chip">' + '<span class="role-chip__art">' + window.Art.role(role) + '</span>' +
      esc(t('role.' + role)) + '</span>';
  }

  function scene(n, cls) {
    var art = window.ArtScenes[n]();
    var label = t('s' + n + '.title');
    return '<div class="scene ' + (cls || '') + '">' + art.svg + art.parts +
      '<span class="scene__tag">' + icon('sparkles', '', 13) + esc(t('c.simulation')) + '</span></div>';
  }

  /* ---------- toasts ---------- */
  function toast(message, kind, ms) {
    var root = document.getElementById('toastRoot');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (kind || 'info');
    el.innerHTML = '<span class="toast__icon">' +
      icon(kind === 'error' ? 'alert' : kind === 'success' ? 'check' : 'info', '', 18) +
      '</span><span class="toast__text">' + esc(message) + '</span>' +
      '<button class="toast__close" type="button" aria-label="' + esc(t('c.close')) + '">' + icon('x', '', 16) + '</button>';
    var timer;
    function dismiss() {
      clearTimeout(timer);
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 220);
    }
    el.querySelector('.toast__close').addEventListener('click', dismiss);
    root.appendChild(el);
    timer = setTimeout(dismiss, ms || 4600);
  }

  /* ---------- dialogs ---------- */
  function dialog(opts) {
    var dlg = document.createElement('dialog');
    dlg.className = 'pap-dialog' + (opts.wide ? ' pap-dialog--wide' : '');
    var actions = opts.actions || [];
    var actionHtml = actions.map(function (a, i) {
      return '<button type="button" class="btn btn--' + (a.kind || 'ghost') + '" data-act="' + i + '">' +
        (a.icon ? icon(a.icon, '', 18) : '') + '<span>' + esc(a.label) + '</span></button>';
    }).join('');
    dlg.innerHTML =
      '<div class="dialog-card" role="document">' +
      '<div class="dialog-head">' +
      '<div><p class="eyebrow">' + esc(opts.eyebrow || t('c.simulation')) + '</p>' +
      '<h2 class="dialog-title">' + esc(opts.title) + '</h2></div>' +
      '<button type="button" class="icon-btn dialog-x" aria-label="' + esc(t('c.close')) + '">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="dialog-body">' + (opts.body || '') + '</div>' +
      (actionHtml ? '<div class="dialog-actions">' + actionHtml + '</div>' : '') +
      '</div>';

    document.body.appendChild(dlg);

    function close(value) {
      if (dlg.returnValue === undefined) dlg.returnValue = value || '';
      if (dlg.open) dlg.close(value || '');
    }

    dlg.querySelector('.dialog-x').addEventListener('click', function () { close('dismiss'); });
    dlg.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = actions[Number(btn.getAttribute('data-act'))];
        if (a && typeof a.onClick === 'function') {
          a.onClick(close, dlg);
        } else {
          close(a && a.value ? a.value : 'ok');
        }
      });
    });
    dlg.addEventListener('cancel', function (e) {
      e.preventDefault();
      close('dismiss');
    });
    dlg.addEventListener('close', function () {
      dlg.remove();
      if (typeof opts.onClose === 'function') opts.onClose(dlg.returnValue);
    });
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute('open', '');
    var focusTarget = dlg.querySelector('.dialog-actions .btn--primary') ||
      dlg.querySelector('button, input, select, textarea, a[href]');
    if (focusTarget) focusTarget.focus();
    return { el: dlg, close: close };
  }

  function confirm(opts) {
    return new Promise(function (resolve) {
      var settled = false;
      function done(value) {
        if (settled) return;
        settled = true;
        resolve(value);
      }
      dialog({
        eyebrow: opts.eyebrow,
        title: opts.title,
        body: opts.body,
        actions: [
          { label: opts.cancelLabel || t('c.cancel'), kind: 'ghost', value: 'cancel' },
          { label: opts.confirmLabel || t('c.confirm'), kind: opts.danger ? 'danger' : 'primary', value: 'confirm' }
        ],
        onClose: function (value) { done(value === 'confirm'); }
      });
    });
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.UI = {
    t: t,
    esc: esc,
    icon: icon,
    badge: badge,
    roleChip: roleChip,
    scene: scene,
    toast: toast,
    dialog: dialog,
    confirm: confirm,
    fmtDate: fmtDate,
    monthLabel: monthLabel,
    monthShort: monthShort,
    money: money,
    villageName: villageName,
    locale: locale,
    parseDate: parseDate,
    scrollTop: scrollTop
  };
})();

}
