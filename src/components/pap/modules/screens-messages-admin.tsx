// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-messages-admin.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   Screens: message centre + administrative dashboard
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store;
  var msgFilter = 'all';

  var TYPE_ICON = {
    form: 'clipboard', confirmRequest: 'message', confirmed: 'check', cancelled: 'x',
    validated: 'check', activated: 'play', firstDebit: 'banknote', debitFailed: 'alert',
    secondAttempt: 'rotate', modification: 'edit', suspension: 'pause',
    reactivation: 'play', termination: 'flag'
  };

  /* ---------------- MESSAGES ---------------- */
  function messages() {
    var st = Store.state;
    var unread = Store.unreadCount();
    var list = st.messages.filter(function (m) { return msgFilter === 'all' || !m.read; });

    var items = list.length ? list.map(function (m) {
      var title = UI.t('m.types.' + m.type);
      var body = UI.t('m.bodies.' + m.type, m.params || {});
      return '<li class="msg' + (m.read ? '' : ' is-unread') + '">' +
        '<details data-msg="' + m.id + '"' + (m.read ? '' : ' data-unread="1"') + '>' +
        '<summary>' +
        '<span class="msg__icon">' + UI.icon(TYPE_ICON[m.type] || 'bell', '', 18) + '</span>' +
        '<span class="msg__main"><strong>' + UI.esc(title) + '</strong>' +
        '<span class="msg__preview">' + UI.esc(body) + '</span></span>' +
        '<span class="msg__meta"><time datetime="' + m.at + '">' + UI.fmtDate(m.at, { hour: '2-digit', minute: '2-digit' }) + '</time>' +
        '<span class="msg__dot" aria-hidden="true"></span></span>' +
        '</summary>' +
        '<div class="msg__body"><p>' + UI.esc(body) + '</p>' +
        '<span class="msg__fiction">' + UI.icon('sparkles', '', 12) + UI.esc(UI.t('m.fictional')) + '</span>' +
        '</div></details></li>';
    }).join('') : '';

    var empty = !list.length
      ? '<div class="msg-empty">' + UI.icon('bell', '', 30) +
        '<p>' + UI.esc(st.messages.length ? UI.t('m.emptyFilter') : UI.t('m.empty')) + '</p>' +
        (!st.messages.length ? '<button type="button" class="btn btn--primary btn--sm" data-gen-msg>' +
          UI.icon('sparkles', '', 16) + UI.esc(UI.t('m.emptyCta')) + '</button>' : '') +
        '</div>'
      : '';

    return '' +
      '<section class="screen screen--messages">' +
      '<header class="screen-head">' +
      '<p class="eyebrow">' + UI.icon('bell', '', 16) + UI.t('nav.messages') + '</p>' +
      '<h1>' + UI.esc(UI.t('m.title')) + '</h1>' +
      '<p class="lead">' + UI.esc(UI.t('m.lead')) + '</p>' +
      '</header>' +
      '<div class="messages-layout">' +
      '<div class="phone phone--tall">' +
      '<div class="phone__notch" aria-hidden="true"></div>' +
      '<div class="phone__status"><span>9:41</span><span>' + UI.icon('bell', '', 13) + ' ' + UI.esc(UI.t('m.phone')) + '</span></div>' +
      '<div class="phone__app">' +
      '<div class="phone__head"><span class="avatar-dot">' + window.Art.brand() + '</span>' +
      '<div><strong>' + UI.esc(UI.t('m.phone')) + '</strong><small>' + UI.esc(UI.t('m.unreadCount', { n: unread })) + '</small></div>' +
      UI.icon('info', '', 18) + '</div>' +
      '<div class="msg-filters" role="group" aria-label="' + UI.esc(UI.t('m.filter')) + '">' +
      '<button type="button" class="seg-btn' + (msgFilter === 'all' ? ' is-on' : '') + '" data-msg-filter="all">' + UI.esc(UI.t('m.all')) + '</button>' +
      '<button type="button" class="seg-btn' + (msgFilter === 'unread' ? ' is-on' : '') + '" data-msg-filter="unread">' + UI.esc(UI.t('m.unread')) +
      (unread ? ' · ' + unread : '') + '</button>' +
      '</div>' +
      '<ul class="msg-list">' + items + '</ul>' + empty +
      '</div></div>' +
      '<aside class="messages-side">' +
      '<div class="panel">' +
      '<h2 class="panel__title">' + UI.icon('bell', '', 18) + UI.esc(UI.t('m.unreadCount', { n: unread })) + '</h2>' +
      '<div class="stack stack--tight">' +
      '<button type="button" class="btn btn--primary btn--wide" data-mark-all>' + UI.icon('check', '', 17) + UI.esc(UI.t('m.markAll')) + '</button>' +
      '<button type="button" class="btn btn--danger btn--wide" data-clear-msg>' + UI.icon('trash', '', 17) + UI.esc(UI.t('m.clear')) + '</button>' +
      '<button type="button" class="btn btn--ghost btn--wide" data-gen-msg>' + UI.icon('sparkles', '', 17) + UI.esc(UI.t('m.emptyCta')) + '</button>' +
      '</div></div>' +
      '<div class="panel panel--sim"><h2 class="panel__title">' + UI.icon('info', '', 17) + UI.esc(UI.t('c.simulation')) + '</h2>' +
      '<p>' + UI.esc(UI.t('m.lead')) + '</p>' +
      '<p class="msg__fiction msg__fiction--static">' + UI.icon('sparkles', '', 12) + UI.esc(UI.t('m.fictional')) + '</p>' +
      '</div>' +
      '</aside></div></section>';
  }

  function mountMessages(root) {
    var st = Store.state;
    root.querySelectorAll('[data-msg-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        msgFilter = b.getAttribute('data-msg-filter');
        window.App.render();
      });
    });
    var markAll = root.querySelector('[data-mark-all]');
    if (markAll) markAll.addEventListener('click', function () {
      if (!st.messages.length) { UI.toast(UI.t('m.empty'), 'info'); return; }
      Store.markAllRead();
      window.App.render();
      if (window.App.refreshChrome) window.App.refreshChrome();
      UI.toast(UI.t('m.markAll'), 'success');
    });
    var clear = root.querySelector('[data-clear-msg]');
    if (clear) clear.addEventListener('click', function () {
      if (!st.messages.length) { UI.toast(UI.t('m.empty'), 'info'); return; }
      UI.confirm({
        title: UI.t('m.confirmClear'),
        body: '<p>' + UI.esc(UI.t('m.confirmClearBody')) + '</p>',
        confirmLabel: UI.t('m.clear'),
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        Store.clearMessages();
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t('m.deleted'), 'success');
      });
    });
    root.querySelectorAll('[data-gen-msg]').forEach(function (b) {
      b.addEventListener('click', function () {
        Store.seedDemoMessages();
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t('m.generated'), 'success');
      });
    });
    root.querySelectorAll('details[data-msg]').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        var id = d.getAttribute('data-msg');
        var m = st.messages.filter(function (x) { return x.id === id; })[0];
        if (m && !m.read) {
          m.read = true;
          d.removeAttribute('data-unread');
          d.parentElement.classList.remove('is-unread');
          Store.save();
          if (window.App.refreshChrome) window.App.refreshChrome();
        }
      });
    });
  }

  /* ---------------- ADMIN ---------------- */
  function kpis(st) {
    var paid = Store.paidMonths().length;
    return [
      { key: 'forms', value: 24 + (st.submitted ? 1 : 0), icon: 'clipboard' },
      { key: 'confirmations', value: 18 + (st.confirmed === true ? 1 : 0), icon: 'check' },
      { key: 'validated', value: 16 + (st.checkpoints >= 6 ? 1 : 0), icon: 'list' },
      { key: 'activated', value: 15 + (st.activated ? 1 : 0), icon: 'play' },
      { key: 'success', value: 120 + paid, icon: 'banknote' },
      { key: 'failed', value: 7 + (st.incidents.first ? 1 : 0), icon: 'alert' },
      { key: 'suspended', value: 3 + (st.suspended ? 1 : 0), icon: 'pause' },
      { key: 'terminated', value: 2 + (st.termination ? 1 : 0), icon: 'flag' }
    ].map(function (k) {
      return '<div class="kpi"><span class="kpi__icon">' + UI.icon(k.icon, '', 20) + '</span>' +
        '<span class="kpi__value">' + k.value + '</span>' +
        '<span class="kpi__label">' + UI.esc(UI.t('ad.' + k.key)) + '</span></div>';
    }).join('');
  }

  function barChart() {
    var values = [8, 11, 9, 12, 10, 6, 4, 9, 12, 11, 13, 12];
    var max = 16, W = 640, H = 220, pad = 26, bw = 30, gap = (W - pad * 2 - bw * 12) / 11;
    var bars = values.map(function (v, i) {
      var h = Math.round((v / max) * (H - 70));
      var x = pad + i * (bw + gap);
      var y = H - 34 - h;
      var label = UI.monthShort('2026-' + ('0' + (i + 1)).slice(-2));
      return '<g class="bar-g"><rect class="bar-rect" x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="4"/>' +
        '<text class="bar-value" x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6) + '" text-anchor="middle">' + v + '</text>' +
        '<text class="bar-label" x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 14) + '" text-anchor="middle">' + UI.esc(label) + '</text></g>';
    }).join('');
    return '<svg class="chart chart--bars" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
      UI.esc(UI.t('ad.chartTitle') + ' — ' + UI.t('ad.chartSub')) + '">' +
      '<line class="chart-axis" x1="' + pad + '" y1="' + (H - 34) + '" x2="' + (W - 12) + '" y2="' + (H - 34) + '"/>' +
      bars + '</svg>';
  }

  function donut(st) {
    var parts = [
      { label: UI.t('ad.statusActive'), value: 9, color: '#08A9E0' },
      { label: UI.t('ad.statusSuspended'), value: 3, color: '#CFEAF5' },
      { label: UI.t('ad.statusTerminated'), value: 2, color: '#E2556A' },
      { label: UI.t('ad.statusPending'), value: 2, color: '#EFFAFF' }
    ];
    var total = parts.reduce(function (s, p) { return s + p.value; }, 0);
    var r = 62, circ = 2 * Math.PI * r, offset = 0;
    var segs = parts.map(function (p) {
      var len = (p.value / total) * circ;
      var s = '<circle class="donut-seg" cx="90" cy="90" r="' + r + '" fill="none" stroke="' + p.color +
        '" stroke-width="22" stroke-dasharray="' + len.toFixed(1) + ' ' + (circ - len).toFixed(1) +
        '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 90 90)"/>';
      offset += len;
      return s;
    }).join('');
    var legend = parts.map(function (p) {
      return '<li><span class="donut-dot" style="background:' + p.color + '"></span>' +
        '<span>' + UI.esc(p.label) + '</span><strong>' + p.value + '</strong></li>';
    }).join('');
    return '<div class="donut-wrap">' +
      '<svg class="chart chart--donut" viewBox="0 0 180 180" role="img" aria-label="' +
      UI.esc(UI.t('ad.chart2') + ' — ' + UI.t('ad.chart2Sub')) + '">' +
      '<circle cx="90" cy="90" r="' + r + '" fill="none" stroke="#FFFFFF" stroke-width="22"/>' + segs +
      '<text x="90" y="86" text-anchor="middle" class="donut-total">' + total + '</text>' +
      '<text x="90" y="106" text-anchor="middle" class="donut-label">' + UI.esc(UI.t('ad.totalDonors')) + '</text>' +
      '</svg><ul class="donut-legend">' + legend + '</ul></div>';
  }

  function donorRows(st) {
    var rows = '';
    var you = {
      id: 'you',
      name: st.form.name || UI.t('ad.yours'),
      amount: st.form.amount || 60,
      village: st.form.village,
      stage: st.termination ? 10 : Store.currentLevel(),
      status: st.termination ? 'terminated' : st.suspended ? 'suspended' : st.activated ? 'active' : 'pending'
    };
    var all = [you].concat(window.PAPData.adminDonors);
    all.forEach(function (d, i) {
      var name = i === 0 ? d.name : UI.t(d.nameKey);
      var statusKey = 'ad.status' + d.status.charAt(0).toUpperCase() + d.status.slice(1);
      rows += '<tr class="' + (i === 0 ? 'is-you' : '') + '">' +
        '<td data-label="' + UI.esc(UI.t('ad.donor')) + '"><span class="table-name">' + (i === 0 ? '<span class="you-tag">' + UI.esc(UI.t('c.you')) + '</span>' : '') +
        UI.esc(name) + '</span><small>' + UI.esc(UI.villageName(d.village)) + '</small></td>' +
        '<td data-label="' + UI.esc(UI.t('ad.amount')) + '">' + UI.money(d.amount) + '</td>' +
        '<td class="table-hide" data-label="' + UI.esc(UI.t('ad.stage')) + '">' + UI.esc(UI.t('u.step')) + ' ' + d.stage + '</td>' +
        '<td data-label="' + UI.esc(UI.t('ad.status')) + '"><span class="status-pill ' + (d.status === 'active' ? 'is-on' : d.status === 'pending' ? 'is-wait' : 'is-off') + '">' +
        UI.esc(UI.t(statusKey)) + '</span></td>' +
        '<td class="table-action" data-label="' + UI.esc(UI.t('ad.view')) + '"><button type="button" class="btn btn--ghost btn--sm" data-donor="' + d.id + '">' +
        UI.icon('chevron-right', '', 15) + UI.esc(UI.t('ad.view')) + '</button></td>' +
        '</tr>';
    });
    return rows;
  }

  function admin() {
    var st = Store.state;
    return '' +
      '<section class="screen screen--admin">' +
      '<header class="screen-head">' +
      '<p class="eyebrow">' + UI.icon('dashboard', '', 16) + UI.t('c.demo') + '</p>' +
      '<h1>' + UI.esc(UI.t('ad.title')) + '</h1>' +
      '<p class="lead">' + UI.esc(UI.t('ad.lead')) + '</p>' +
      '<div class="banner banner--demo">' + UI.icon('alert', '', 18) + '<span>' + UI.esc(UI.t('ad.demo')) + '</span>' +
      '<button type="button" class="btn btn--quiet btn--sm" data-demo-note>' + UI.esc(UI.t('ad.export')) + '</button></div>' +
      '</header>' +
      '<div class="kpi-grid">' + kpis(st) + '</div>' +
      '<div class="charts-grid">' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('chart', '', 18) + UI.esc(UI.t('ad.chartTitle')) + '</h2>' +
      '<p class="hint">' + UI.esc(UI.t('ad.chartSub')) + '</p>' + barChart() + '</div>' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('dashboard', '', 18) + UI.esc(UI.t('ad.chart2')) + '</h2>' +
      '<p class="hint">' + UI.esc(UI.t('ad.chart2Sub')) + '</p>' + donut(st) + '</div>' +
      '</div>' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('list', '', 18) + UI.esc(UI.t('ad.tableTitle')) + '</h2>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>' + UI.esc(UI.t('ad.donor')) + '</th><th>' + UI.esc(UI.t('ad.amount')) + '</th>' +
      '<th class="table-hide">' + UI.esc(UI.t('ad.stage')) + '</th><th>' + UI.esc(UI.t('ad.status')) + '</th><th><span class="sr-only">' + UI.esc(UI.t('ad.view')) + '</span></th>' +
      '</tr></thead><tbody>' + donorRows(st) + '</tbody></table></div>' +
      '<p class="hint">' + UI.esc(UI.t('ad.legend')) + '</p></div>' +
      '</section>';
  }

  function donorTimeline(id, st) {
    var isYou = id === 'you';
    var donor = isYou ? {
      name: st.form.name || UI.t('ad.yours'),
      amount: st.form.amount || 60,
      village: st.form.village,
      stage: st.termination ? 10 : Store.currentLevel(),
      status: st.termination ? 'terminated' : st.suspended ? 'suspended' : st.activated ? 'active' : 'pending'
    } : window.PAPData.adminDonors.filter(function (d) { return d.id === id; })[0];
    if (!donor) return;
    var name = isYou ? donor.name : UI.t(donor.nameKey);
    var statusKey = 'ad.status' + donor.status.charAt(0).toUpperCase() + donor.status.slice(1);
    var items = window.PAPData.stages.map(function (s) {
      var reached = isYou ? Store.isDone(s.n) : s.n <= donor.stage;
      var current = isYou && !Store.isDone(s.n) && s.n === Store.currentLevel();
      return '<li class="timeline__item ' + (reached ? 'is-done' : 'is-todo') + (current ? ' is-current' : '') + '">' +
        '<span class="timeline__mark">' + (reached ? UI.icon('check', '', 13) : current ? UI.icon('play', '', 11) : s.n) + '</span>' +
        '<div><strong>' + UI.esc(UI.t(s.titleKey)) + '</strong>' +
        '<small>' + UI.esc(UI.t(reached ? 'ad.reached' : current ? 'map.active' : 'ad.notReached')) + '</small></div></li>';
    }).join('');
    UI.dialog({
      wide: true,
      eyebrow: UI.t('ad.record'),
      title: name,
      body: '<div class="donor-head"><div class="kv kv--inline">' +
        '<span><strong>' + UI.money(donor.amount) + '</strong> / ' + UI.esc(UI.t('c.month')) + '</span>' +
        '<span>' + UI.icon('map-pin', '', 14) + UI.esc(UI.villageName(donor.village)) + '</span>' +
        '<span class="status-pill ' + (donor.status === 'active' ? 'is-on' : donor.status === 'pending' ? 'is-wait' : 'is-off') + '">' +
        UI.esc(UI.t(statusKey)) + '</span></div></div>' +
        '<h3 class="panel__title">' + UI.icon('list', '', 17) + UI.t('ad.timeline') + '</h3>' +
        '<ol class="timeline">' + items + '</ol>' +
        '<p class="hint">' + UI.esc(UI.t('ad.demo')) + '</p>',
      actions: [{ label: UI.t('c.close'), kind: 'primary', value: 'close' }]
    });
  }

  function mountAdmin(root) {
    var st = Store.state;
    root.querySelectorAll('[data-donor]').forEach(function (b) {
      b.addEventListener('click', function () { donorTimeline(b.getAttribute('data-donor'), st); });
    });
    root.querySelectorAll('[data-demo-note]').forEach(function (b) {
      b.addEventListener('click', function () {
        UI.dialog({
          eyebrow: UI.t('c.demo'),
          title: UI.t('ad.printable'),
          body: '<p>' + UI.esc(UI.t('ad.exportNote')) + '</p><p class="hint">' + UI.esc(UI.t('ad.demo')) + '</p>',
          actions: [{ label: UI.t('dg.ok'), kind: 'primary', value: 'ok' }]
        });
      });
    });
  }

  window.ScreenMessages = { render: messages, mount: mountMessages };
  window.ScreenAdmin = { render: admin, mount: mountAdmin };
})();

}
