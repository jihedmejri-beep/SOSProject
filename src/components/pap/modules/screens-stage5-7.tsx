// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-stage5-7.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   STEP 5 — first debit · STEP 6 — monthly follow-up · STEP 7 — incidents
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store, Reg = window.StageRegistry;

  function statusMeta(status) {
    if (status === 'paid') return { cls: 'is-paid', icon: 'check', label: UI.t('st6.paid') };
    if (status === 'failed') return { cls: 'is-failed', icon: 'alert', label: UI.t('st6.failed') };
    return { cls: 'is-pending', icon: 'rotate', label: UI.t('st6.pending') };
  }

  /* ---------------- STEP 5 ---------------- */
  function body5(st) {
    var amount = st.form.amount || 60;
    var paid = st.months[0].status === 'paid';
    return '' +
      '<div class="debit-layout">' +
      '<div class="panel debit-scene">' +
      '<div class="debit-accounts">' +
      '<div class="account"><span class="account__art">' + window.Art.role('bank') + '</span>' +
      '<strong>' + UI.esc(UI.t('st5.accountDonor')) + '</strong><small>•••• 5678</small></div>' +
      '<div class="debit-track" data-debit-track>' +
      '<span class="debit-track__line" aria-hidden="true"></span>' +
      '<span class="debit-token" data-debit-token aria-hidden="true">' + window.Pixel.coin() + '</span>' +
      '<span class="debit-track__day">25</span>' +
      '<span class="debit-track__label">' + UI.esc(UI.t('st5.token')) + '</span>' +
      '</div>' +
      '<div class="account"><span class="account__art">' + window.Art.role('sos') + '</span>' +
      '<strong>' + UI.esc(UI.t('st5.accountSos')) + '</strong><small>' + UI.esc(UI.t('c.fictional')) + '</small></div>' +
      '</div>' +
      '<div class="cal-mini" role="img" aria-label="' + UI.esc(UI.t('st5.calendar') + ' — ' + UI.t('st5.date') + ' 25') + '">' +
      '<div class="cal-mini__head">' + UI.icon('calendar', '', 15) + UI.t('st5.calendar') + '<span class="cal-mini__month">' + UI.esc(UI.monthLabel('2026-01')) + '</span></div>' +
      '<div class="cal-mini__grid">' +
      Array.apply(null, { length: 28 }).map(function (_, i) {
        var d = i + 1;
        return '<span class="cal-cell' + (d === 25 ? ' is-25' : '') + '">' + d + '</span>';
      }).join('') +
      '</div></div>' +
      '<p class="hint">' + UI.esc(UI.t('st5.simNote')) + '</p>' +
      '</div>' +

      '<div class="panel debit-info">' +
      '<dl class="kv kv--big">' +
      '<div><dt>' + UI.esc(UI.t('st5.amount')) + '</dt><dd>' + UI.money(amount) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st5.date')) + '</dt><dd>' + UI.fmtDate(st.firstDebitDate) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st5.status')) + '</dt><dd><span class="status-pill ' + (paid ? 'is-on' : 'is-wait') + '" data-debit-pill>' +
      UI.icon(paid ? 'check' : 'rotate', '', 14) + UI.esc(UI.t(paid ? 'st5.paid' : 'st5.debiting')) + '</span></dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st5.ref')) + '</dt><dd><code>' + (paid ? 'TX-2026-1041' : '—') + '</code></dd></div>' +
      '</dl>' +
      '<div class="bar bar--thick"><span data-debit-bar style="width:' + (paid ? 100 : 0) + '%"></span></div>' +
      '<div class="result-card result-card--success" data-debit-result' + (paid ? '' : ' hidden') + '>' +
      '<span class="result-card__icon">' + UI.icon('heart', '', 26) + '</span>' +
      '<div><h3>' + UI.esc(UI.t('st5.done')) + '</h3><p>' + UI.esc(UI.t('st5.success')) + '</p></div>' +
      '</div>' +
      '<div class="row-actions">' +
      '<button type="button" class="btn btn--primary" data-debit-next' + (paid ? '' : ' disabled') + '>' +
      UI.icon('arrow-right', '', 18) + UI.esc(UI.t('st5.continue')) + '</button>' +
      '<button type="button" class="btn btn--quiet" data-debit-replay>' + UI.icon('rotate', '', 16) + UI.esc(UI.t('st5.replay')) + '</button>' +
      '</div>' +
      '</div></div>';
  }

  function mount5(root) {
    var st = Store.state;
    var token = root.querySelector('[data-debit-token]');
    var bar = root.querySelector('[data-debit-bar]');
    var pill = root.querySelector('[data-debit-pill]');
    var result = root.querySelector('[data-debit-result]');
    var next = root.querySelector('[data-debit-next]');
    var track = root.querySelector('[data-debit-track]');
    var timers = [];
    var running = false;

    function completeDebit() {
      if (st.months[0].status !== 'paid') {
        Store.ensureHistory();
        Store.complete(5);
        var has = st.messages.some(function (m) { return m.type === 'firstDebit'; });
        if (!has) {
          Store.addMessage('firstDebit', {
            amount: UI.money(st.form.amount || 60),
            date: UI.fmtDate(st.firstDebitDate, { day: '2-digit', month: '2-digit', year: 'numeric' }),
            ref: 'TX-2026-1041'
          });
        }
        Store.save();
      }
      bar.style.width = '100%';
      pill.className = 'status-pill is-on';
      pill.innerHTML = UI.icon('check', '', 14) + UI.esc(UI.t('st5.paid'));
      result.hidden = false;
      next.disabled = false;
      if (token) token.classList.add('is-arrived');
      UI.toast(UI.t('st5.success'), 'success', 5000);
      if (window.App.refreshChrome) window.App.refreshChrome();
    }

    function run() {
      if (running) return;
      running = true;
      timers.forEach(clearTimeout);
      timers = [];
      bar.style.width = '0%';
      result.hidden = true;
      next.disabled = true;
      pill.className = 'status-pill is-wait';
      pill.innerHTML = UI.icon('rotate', '', 14) + UI.esc(UI.t('st5.debiting'));
      if (token) {
        token.classList.remove('is-arrived', 'is-moving');
        void token.offsetWidth;
        token.classList.add('is-moving');
      }
      if (track) track.classList.add('is-live');
      var fast = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      timers.push(setTimeout(function () {
        if (!document.body.contains(root)) return;
        running = false;
        if (track) track.classList.remove('is-live');
        completeDebit();
      }, fast ? 400 : 2300));
    }

    if (st.months[0].status === 'paid') {
      completeDebit();
    } else {
      timers.push(setTimeout(run, 350));
    }

    var nextBtn = root.querySelector('[data-debit-next]');
    if (nextBtn) nextBtn.addEventListener('click', function () { window.App.go('stage', { n: 6 }); });
    var replay = root.querySelector('[data-debit-replay]');
    if (replay) replay.addEventListener('click', function () {
      if (token) token.classList.remove('is-arrived');
      run();
    });
  }

  /* ---------------- STEP 6 ---------------- */
  function body6(st) {
    var sel = st.months.filter(function (m) { return m.key === st.selectedMonth; })[0] || st.months[5];
    var meta = statusMeta(sel.status);
    var paid = Store.paidMonths();
    var total = Store.totalPaid();
    var idx = st.months.indexOf(sel);

    var cards = st.months.map(function (m) {
      var sm = statusMeta(m.status);
      return '<button type="button" class="month-card ' + sm.cls + (m.key === sel.key ? ' is-selected' : '') +
        '" data-month="' + m.key + '" aria-pressed="' + (m.key === sel.key) + '">' +
        '<span class="month-card__name">' + UI.esc(UI.monthShort(m.key)) + '</span>' +
        '<span class="month-card__status">' + UI.icon(sm.icon, '', 12) + UI.esc(sm.label) + '</span>' +
        '<span class="month-card__amount">' + (m.status === 'paid' ? UI.money(m.amount) : '—') + '</span>' +
        '</button>';
    }).join('');

    return '' +
      '<div class="follow-layout">' +
      '<div class="panel follow-calendar">' +
      '<div class="follow-head">' +
      '<div><h2 class="panel__title">' + UI.icon('calendar', '', 18) + UI.esc(UI.t('st6.schedule')) + '</h2>' +
      '<p class="hint">' + UI.esc(UI.t('st6.day25')) + '</p></div>' +
      '<div class="follow-nav">' +
      '<button type="button" class="icon-btn" data-month-prev aria-label="' + UI.esc(UI.t('st6.prev')) + '">' + UI.icon('arrow-left', '', 18) + '</button>' +
      '<button type="button" class="icon-btn" data-month-next aria-label="' + UI.esc(UI.t('st6.next')) + '">' + UI.icon('arrow-right', '', 18) + '</button>' +
      '</div></div>' +
      '<div class="month-grid">' + cards + '</div>' +
      '<div class="follow-totals">' +
      '<div><span>' + UI.esc(UI.t('st6.count')) + '</span><strong>' + paid.length + '</strong></div>' +
      '<div><span>' + UI.esc(UI.t('st6.total')) + '</span><strong>' + UI.money(total) + '</strong></div>' +
      '</div></div>' +

      '<div class="panel month-detail">' +
      '<div class="month-detail__head">' +
      '<div><p class="eyebrow">' + UI.esc(UI.t('st6.monthDetail')) + '</p>' +
      '<h3>' + UI.esc(UI.monthLabel(sel.key)) + '</h3></div>' +
      '<span class="status-pill ' + (smCls(sel.status)) + '">' + UI.icon(meta.icon, '', 14) + UI.esc(meta.label) + '</span>' +
      '</div>' +
      '<dl class="kv">' +
      '<div><dt>' + UI.esc(UI.t('st6.amount')) + '</dt><dd>' + (sel.amount ? UI.money(sel.amount) : UI.money(st.form.amount || 60)) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st6.date')) + '</dt><dd>' + UI.fmtDate(sel.date) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st6.ref')) + '</dt><dd><code>' + (sel.ref || '—') + '</code></dd></div>' +
      '</dl>' +
      (sel.status === 'pending'
        ? '<button type="button" class="btn btn--primary" data-simulate="' + idx + '">' + UI.icon('play', '', 16) + UI.esc(UI.t('st6.simulate')) + '</button>' +
        '<p class="hint">' + UI.esc(UI.t('st6.nextDebit')) + ' · ' + UI.esc(UI.monthLabel('2026-06')) + '</p>'
        : '<p class="hint">' + UI.esc(UI.t('st6.noPayment')) + '</p>') +
      '<p class="note note--fact">' + UI.icon('check', '', 16) + UI.esc(UI.t('st6.why')) + '</p>' +
      '<p class="hint">' + UI.esc(UI.t('st6.simNote')) + '</p>' +
      '</div></div>';
  }

  function smCls(status) {
    return status === 'paid' ? 'is-on' : status === 'failed' ? 'is-off' : 'is-wait';
  }

  function mount6(root) {
    var st = Store.state;
    if (!st.historySeeded) {
      Store.ensureHistory();
      window.App.render();
      return;
    }
    root.querySelectorAll('[data-month]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.selectedMonth = b.getAttribute('data-month');
        Store.save();
        Store.complete(6);
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
      });
    });

    var idx = st.months.map(function (m) { return m.key; }).indexOf(st.selectedMonth);
    var prev = root.querySelector('[data-month-prev]');
    var next = root.querySelector('[data-month-next]');
    if (prev) prev.addEventListener('click', function () {
      st.selectedMonth = st.months[(idx + 11) % 12].key;
      Store.save();
      window.App.render();
    });
    if (next) next.addEventListener('click', function () {
      st.selectedMonth = st.months[(idx + 1) % 12].key;
      Store.save();
      window.App.render();
    });

    var sim = root.querySelector('[data-simulate]');
    if (sim) sim.addEventListener('click', function () {
      var i = Number(sim.getAttribute('data-simulate'));
      Store.markMonthPaid(i);
      Store.complete(6);
      Store.addMessage('firstDebit', {
        amount: UI.money(st.form.amount || 60),
        date: UI.fmtDate(st.months[i].date, { day: '2-digit', month: '2-digit', year: 'numeric' }),
        ref: st.months[i].ref
      });
      window.App.render();
      if (window.App.refreshChrome) window.App.refreshChrome();
      UI.toast(UI.t('st6.monthDone'), 'success');
    });
  }

  /* ---------------- STEP 7 ---------------- */
  function body7(st) {
    var inc = st.incidents;
    var firstStatus = inc.first === 'failed' ? 'is-failed' : 'is-idle';
    var secondStatus = inc.second === 'success' ? 'is-paid' : inc.second === 'failed' ? 'is-failed' : 'is-idle';
    var secondLabel = inc.second === 'success' ? UI.t('st7.statusSuccess') :
      inc.second === 'failed' ? UI.t('st7.statusFailed') : UI.t('st7.waiting');
    var resultHtml = '';
    if (inc.first === 'failed' && !inc.second) {
      resultHtml = '<p class="note note--warn">' + UI.icon('alert', '', 16) + UI.esc(UI.t('st7.failed')) + '</p>';
    }
    if (inc.second === 'success') {
      resultHtml = '<div class="result-card result-card--success"><span class="result-card__icon">' +
        UI.icon('check', '', 26) + '</span><div><h3>' + UI.esc(UI.t('st7.statusSuccess')) + '</h3><p>' +
        UI.esc(UI.t('st7.success')) + '</p></div></div>';
    } else if (inc.second === 'failed') {
      resultHtml = '<div class="result-card result-card--danger"><span class="result-card__icon">' +
        UI.icon('alert', '', 26) + '</span><div><h3>' + UI.esc(UI.t('st7.statusFailed')) + '</h3><p>' +
        UI.esc(UI.t('st7.fail')) + '</p></div></div>';
    }

    return '' +
      '<div class="incident-layout">' +
      '<div class="panel incident-cal">' +
      '<h2 class="panel__title">' + UI.icon('calendar', '', 18) + UI.esc(UI.t('st7.calendar')) + '</h2>' +
      '<div class="incident-days">' +
      '<div class="incident-day ' + firstStatus + '"><span class="incident-day__num">25</span>' +
      '<span class="incident-day__label">' + UI.esc(UI.t('st7.attempt1')) + '</span>' +
      '<span class="incident-day__status">' + UI.icon(inc.first === 'failed' ? 'x' : 'rotate', '', 13) +
      UI.esc(inc.first === 'failed' ? UI.t('st7.statusFailed') : UI.t('st7.waiting')) + '</span></div>' +
      '<span class="incident-arrow" aria-hidden="true">' + UI.icon('arrow-right', '', 20) + '</span>' +
      '<div class="incident-day ' + secondStatus + '"><span class="incident-day__num">5</span>' +
      '<span class="incident-day__label">' + UI.esc(UI.t('st7.attempt2')) + '</span>' +
      '<span class="incident-day__status">' + UI.icon(inc.second === 'success' ? 'check' : inc.second === 'failed' ? 'x' : 'rotate', '', 13) +
      UI.esc(secondLabel) + '</span></div>' +
      '</div>' +
      '<p class="note note--fact">' + UI.icon('check', '', 16) + UI.esc(UI.t('st7.fact')) + '</p>' +
      '<p class="note note--soft">' + UI.icon('info', '', 16) + UI.esc(UI.t('st7.noAccumulation')) + '</p>' +
      '<p class="hint">' + UI.esc(UI.t('st7.simNote')) + '</p>' +
      '</div>' +

      '<div class="panel incident-steps">' +
      '<div class="step-block">' +
      '<span class="step-block__num">1</span>' +
      '<div><h3>' + UI.esc(UI.t('st7.scenario1')) + '</h3>' +
      '<p>' + UI.esc(UI.t('st7.scenario1Body')) + '</p>' +
      (inc.first === null
        ? '<button type="button" class="btn btn--primary" data-fail-first>' + UI.icon('alert', '', 16) + UI.esc(UI.t('st7.simulate')) + '</button>'
        : '<p class="inline-status is-failed">' + UI.icon('x', '', 14) + UI.esc(UI.t('st7.failed')) + '</p>') +
      '</div></div>' +
      '<div class="step-block">' +
      '<span class="step-block__num">2</span>' +
      '<div><h3>' + UI.esc(UI.t('st7.second')) + '</h3>' +
      '<p>' + UI.esc(UI.t('st7.secondBody')) + '</p>' +
      (inc.first === 'failed' && !inc.second
        ? '<div class="row-actions"><button type="button" class="btn btn--primary" data-second="success">' +
          UI.icon('check', '', 16) + UI.esc(UI.t('st7.trySuccess')) + '</button>' +
          '<button type="button" class="btn btn--danger" data-second="failed">' +
          UI.icon('x', '', 16) + UI.esc(UI.t('st7.tryFail')) + '</button></div>'
        : inc.first === null
          ? '<p class="hint">' + UI.esc(UI.t('st7.chooseResult')) + '</p>'
          : '') +
      '</div></div>' +
      resultHtml +
      '<div class="row-actions">' +
      '<button type="button" class="btn btn--quiet" data-inc-replay>' + UI.icon('rotate', '', 16) + UI.esc(UI.t('st7.replay')) + '</button>' +
      '</div>' +
      '</div></div>';
  }

  function mount7(root) {
    var st = Store.state;
    var fail = root.querySelector('[data-fail-first]');
    if (fail) fail.addEventListener('click', function () {
      st.incidents = { first: 'failed', second: null, at: new Date().toISOString() };
      // Reflect the failed debit in the month history so Step 6 can show "Échec".
      var failedMonth = st.months[5];
      if (failedMonth && !failedMonth.historical) {
        failedMonth.status = 'failed';
        failedMonth.amount = st.form.amount || 60;
        failedMonth.ref = null;
        failedMonth.simulated = true;
        st.selectedMonth = failedMonth.key;
      }
      Store.save();
      Store.addMessage('debitFailed', {
        amount: UI.money(st.form.amount || 60)
      });
      window.App.render();
      if (window.App.refreshChrome) window.App.refreshChrome();
      UI.toast(UI.t('st7.failed'), 'error', 5000);
    });

    root.querySelectorAll('[data-second]').forEach(function (b) {
      b.addEventListener('click', function () {
        var res = b.getAttribute('data-second');
        st.incidents.second = res;
        st.incidents.at = new Date().toISOString();
        if (res === 'success' && st.months[5] && st.months[5].status === 'failed') {
          Store.markMonthPaid(5);
        }
        Store.save();
        Store.complete(7);
        Store.addMessage('secondAttempt', {
          result: UI.t(res === 'success' ? 'st7.resultSuccess' : 'st7.resultFail')
        });
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t(res === 'success' ? 'st7.success' : 'st7.fail'), res === 'success' ? 'success' : 'error', 6000);
      });
    });

    var replay = root.querySelector('[data-inc-replay]');
    if (replay) replay.addEventListener('click', function () {
      st.incidents = { first: null, second: null, at: null };
      var replayMonth = st.months[5];
      if (replayMonth && !replayMonth.historical) {
        replayMonth.status = 'pending';
        replayMonth.amount = null;
        replayMonth.ref = null;
        replayMonth.simulated = false;
      }
      Store.save();
      window.App.render();
      UI.toast(UI.t('st7.replay'), 'info', 2200);
    });
  }

  Reg[5] = { body: body5, mount: mount5 };
  Reg[6] = { body: body6, mount: mount6 };
  Reg[7] = { body: body7, mount: mount7 };
})();

}
