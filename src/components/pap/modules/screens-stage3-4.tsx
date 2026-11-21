// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-stage3-4.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   STEP 3 — automatic administrative walkthrough
   STEP 4 — activation of the automatic debit
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store, Reg = window.StageRegistry;

  /* ---------------- STEP 3 ---------------- */
  function body3(st) {
    var checks = UI.t('st3.checks');
    var expl = UI.t('st3.expl');
    var doneCount = st.checkpoints || 0;
    var complete = doneCount >= 6;
    var items = checks.map(function (title, i) {
      var cls = 'check-item';
      if (i < doneCount) cls += ' is-done';
      return '<li class="' + cls + '" data-check="' + i + '">' +
        '<span class="check-item__box">' + UI.icon('check', '', 14) + '</span>' +
        '<span class="check-item__text">' + (i + 1) + '. ' + UI.esc(title) + '</span>' +
        '<span class="check-item__badge" data-badge>' + (i < doneCount ? UI.icon('check', '', 12) : '') + '</span>' +
        '</li>';
    }).join('');

    var missing = !st.submitted || !st.form.name || !st.form.rib || !st.form.signature;

    return '' +
      '<div class="cp-layout">' +
      '<div class="panel cp-panel">' +
      '<div class="cp-top">' +
      '<span class="live-tag"><span class="live-dot" aria-hidden="true"></span>' + UI.esc(UI.t('st3.auto')) + '</span>' +
      '<span class="cp-count" data-cp-count>' + doneCount + ' / 6</span>' +
      '</div>' +
      '<div class="bar bar--thin" role="progressbar" aria-valuemin="0" aria-valuemax="6" aria-valuenow="' + doneCount +
      '" aria-label="' + UI.esc(UI.t('st3.progress', { done: doneCount })) + '"><span data-cp-bar style="width:' + Math.round(doneCount / 6 * 100) + '%"></span></div>' +
      '<div class="pop-up' + (complete ? ' is-static' : '') + '" id="cpPop" aria-live="polite">' +
      '<span class="pop-up__num" data-cp-num>' + (complete ? '✓' : '…') + '</span>' +
      '<div class="pop-up__body">' +
      '<p class="pop-up__eyebrow" data-cp-eyebrow>' + (complete ? UI.t('st3.complete') : UI.esc(UI.t('st3.intro'))) + '</p>' +
      '<h3 data-cp-title>' + (complete ? UI.esc(UI.t('st3.doneTitle')) : UI.esc(UI.t('st3.auto'))) + '</h3>' +
      '<p data-cp-text>' + (complete ? UI.esc(UI.t('st3.doneBody')) : '') + '</p>' +
      '</div></div>' +
      '<ol class="checklist" id="checklist">' + items + '</ol>' +
      (missing ? '<p class="note note--warn">' + UI.icon('alert', '', 16) + UI.esc(UI.t('st3.missingNote')) + '</p>' : '') +
      '<div class="cp-actions">' +
      '<button type="button" class="btn btn--ghost" data-skip' + (complete ? ' hidden' : '') + '>' +
      UI.icon('arrow-right', '', 16) + UI.esc(UI.t('st3.skip')) + '</button>' +
      '<span class="hint">' + UI.esc(UI.t('st3.skipNote')) + '</span>' +
      '</div>' +
      '<div class="cp-done" data-cp-done' + (complete ? '' : ' hidden') + '>' +
      '<div class="result-card result-card--success">' +
      '<span class="result-card__icon">' + UI.icon('check', '', 26) + '</span>' +
      '<div><h3>' + UI.esc(UI.t('st3.doneTitle')) + '</h3><p>' + UI.esc(UI.t('st3.doneBody')) + '</p></div>' +
      '</div>' +
      '<div class="row-actions">' +
      '<button type="button" class="btn btn--primary" data-cp-continue>' + UI.icon('arrow-right', '', 18) + UI.esc(UI.t('st3.continue')) + '</button>' +
      '<button type="button" class="btn btn--quiet" data-cp-replay>' + UI.icon('rotate', '', 16) + UI.esc(UI.t('st3.replay')) + '</button>' +
      '</div></div>' +
      '</div>' +
      '<div class="cp-office" aria-hidden="true">' +
      '<div class="cp-office__building">' + window.Art.role('sos') + '</div>' +
      '<div class="cp-office__clip">' + window.Art.role('doc') + '</div>' +
      '<span class="cp-office__label">' + UI.esc(UI.t('st3.source')) + '</span>' +
      '</div>' +
      '<p class="panel panel--sim cp-note">' + UI.icon('info', '', 16) + ' ' + UI.esc(UI.t('st3.note')) + '</p>' +
      '</div>';
  }

  function mount3(root) {
    var checks = UI.t('st3.checks');
    var expl = UI.t('st3.expl');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-check]'));
    var bar = root.querySelector('[data-cp-bar]');
    var count = root.querySelector('[data-cp-count]');
    var pop = root.querySelector('#cpPop');
    var num = root.querySelector('[data-cp-num]');
    var eye = root.querySelector('[data-cp-eyebrow]');
    var title = root.querySelector('[data-cp-title]');
    var text = root.querySelector('[data-cp-text]');
    var doneBox = root.querySelector('[data-cp-done]');
    var skip = root.querySelector('[data-skip]');
    var progressBar = root.querySelector('.bar');
    var timers = [];
    var finished = false;

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function alive() { return document.body.contains(root); }

    function setPop(i) {
      pop.classList.remove('is-pop');
      void pop.offsetWidth;
      pop.classList.add('is-pop');
      num.textContent = String(i + 1);
      eye.textContent = UI.t('st3.checkpoint', { n: i + 1 });
      title.textContent = checks[i];
      text.textContent = expl[i];
    }

    function activate(i) {
      if (!alive()) return;
      items.forEach(function (el, k) {
        el.classList.toggle('is-active', k === i);
        el.classList.toggle('is-done', k < i);
        var badge = el.querySelector('[data-badge]');
        badge.innerHTML = k < i ? UI.icon('check', '', 12) : '';
      });
      setPop(i);
      bar.style.width = Math.round((i / 6) * 100) + '%';
      count.textContent = i + ' / 6';
      if (progressBar) progressBar.setAttribute('aria-valuenow', String(i));
    }

    function finish() {
      if (finished) return;
      finished = true;
      clear();
      items.forEach(function (el) {
        el.classList.remove('is-active');
        el.classList.add('is-done');
        el.querySelector('[data-badge]').innerHTML = UI.icon('check', '', 12);
      });
      bar.style.width = '100%';
      count.textContent = '6 / 6';
      if (progressBar) progressBar.setAttribute('aria-valuenow', '6');
      num.textContent = '✓';
      eye.textContent = UI.t('st3.complete');
      title.textContent = UI.t('st3.doneTitle');
      text.textContent = UI.t('st3.doneBody');
      pop.classList.remove('is-pop');
      void pop.offsetWidth;
      pop.classList.add('is-pop');
      if (doneBox) doneBox.hidden = false;
      if (skip) skip.hidden = true;
      Store.state.checkpoints = 6;
      Store.complete(3);
      var has = Store.state.messages.some(function (m) { return m.type === 'validated'; });
      if (!has) Store.addMessage('validated', {});
      Store.save();
      UI.toast(UI.t('st3.doneBody'), 'success', 5000);
      if (window.App.refreshChrome) window.App.refreshChrome();
    }

    function run() {
      clear();
      finished = false;
      Store.state.checkpoints = 0;
      Store.save();
      items.forEach(function (el) {
        el.classList.remove('is-done', 'is-active');
        el.querySelector('[data-badge]').innerHTML = '';
      });
      bar.style.width = '0%';
      count.textContent = '0 / 6';
      if (doneBox) doneBox.hidden = true;
      if (skip) { skip.hidden = false; skip.disabled = false; }
      num.textContent = '…';
      eye.textContent = UI.t('st3.intro');
      title.textContent = UI.t('st3.auto');
      text.textContent = '';
      pop.classList.remove('is-pop');

      var fast = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var gap = fast ? 900 : 2000;
      timers.push(setTimeout(function () {
        for (var i = 0; i < 6; i++) {
          (function (idx) {
            timers.push(setTimeout(function () { activate(idx); }, idx * gap));
          })(i);
        }
        timers.push(setTimeout(finish, 6 * gap + 500));
      }, fast ? 150 : 450));
    }

    if (skip) skip.addEventListener('click', function () {
      skip.disabled = true;
      finish();
    });
    var replay = root.querySelector('[data-cp-replay]');
    if (replay) replay.addEventListener('click', run);
    var cont = root.querySelector('[data-cp-continue]');
    if (cont) cont.addEventListener('click', function () { window.App.go('stage', { n: 4 }); });

    var st = Store.state;
    if (st.checkpoints >= 6 && Store.isDone(3)) {
      finished = true;
      if (skip) skip.hidden = true;
      if (doneBox) doneBox.hidden = false;
    } else {
      run();
    }
  }

  /* ---------------- STEP 4 ---------------- */
  function body4(st) {
    var amount = st.form.amount || 60;
    var date = st.firstDebitDate;
    var active = st.activated;
    return '' +
      '<div class="activation">' +
      '<div class="panel activation__scene">' +
      '<div class="flow-diagram">' +
      '<div class="flow-node"><span class="flow-node__art">' + window.Art.role('bank') + '</span>' +
      '<strong>' + UI.esc(UI.t('st4.bank')) + '</strong><small>' + UI.esc(UI.t('c.fictional')) + '</small></div>' +
      '<div class="flow-link" aria-hidden="true"><span class="flow-link__line"></span>' +
      '<span class="flow-link__coin" data-act-coin>' + window.Pixel.coin() + '</span>' +
      '<span class="flow-link__label">' + UI.esc(UI.t('st4.link')) + '</span></div>' +
      '<div class="flow-node"><span class="flow-node__art">' + window.Art.role('sos') + '</span>' +
      '<strong>' + UI.esc(UI.t('st4.org')) + '</strong><small>' + UI.esc(UI.t('c.simulation')) + '</small></div>' +
      '</div>' +
      '<ul class="mini-steps" data-act-steps>' +
      [1, 2, 3].map(function (i) {
        return '<li data-act-step="' + i + '"><span class="mini-step__dot"></span>' + UI.esc(UI.t('st4.step' + i)) + '</li>';
      }).join('') +
      '</ul>' +
      '<div class="bar bar--thick"><span data-act-bar style="width:' + (active ? 100 : 0) + '%"></span></div>' +
      '<p class="activation__status" data-act-status>' + UI.esc(UI.t(active ? 'st4.statusActive' : 'st4.statusActivating')) + '</p>' +
      '</div>' +

      '<div class="panel activation__info">' +
      '<dl class="kv kv--big">' +
      '<div><dt>' + UI.esc(UI.t('st4.amount')) + '</dt><dd>' + UI.money(amount) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st4.village')) + '</dt><dd>' + UI.esc(UI.villageName(st.form.village)) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st4.date')) + '</dt><dd>' + UI.fmtDate(date) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st4.status')) + '</dt><dd><span class="status-pill ' + (active ? 'is-on' : 'is-wait') + '" data-act-pill>' +
      UI.icon(active ? 'check' : 'rotate', '', 14) + UI.esc(UI.t(active ? 'st4.statusActive' : 'st4.statusActivating')) + '</span></dd></div>' +
      '</dl>' +
      '<p class="note note--fact">' + UI.icon('check', '', 16) + UI.esc(UI.t('st4.rule')) + '</p>' +
      '<div class="result-card result-card--success" data-act-result' + (active ? '' : ' hidden') + '>' +
      '<span class="result-card__icon">' + UI.icon('check', '', 26) + '</span>' +
      '<div><h3>' + UI.esc(UI.t('st4.activeTitle')) + '</h3><p>' + UI.esc(UI.t('st4.activeBody')) + '</p></div>' +
      '</div>' +
      '<div class="row-actions">' +
      '<button type="button" class="btn btn--primary" data-act-next' + (active ? '' : ' disabled') + '>' +
      UI.icon('arrow-right', '', 18) + UI.esc(UI.t('st4.continue')) + '</button>' +
      '<button type="button" class="btn btn--quiet" data-act-replay>' + UI.icon('rotate', '', 16) + UI.esc(UI.t('st4.replay')) + '</button>' +
      '</div>' +
      '<p class="hint">' + UI.esc(UI.t('st4.simNote')) + '</p>' +
      '</div></div>';
  }

  function mount4(root) {
    var st = Store.state;
    var bar = root.querySelector('[data-act-bar]');
    var status = root.querySelector('[data-act-status]');
    var pill = root.querySelector('[data-act-pill]');
    var result = root.querySelector('[data-act-result]');
    var next = root.querySelector('[data-act-next]');
    var steps = Array.prototype.slice.call(root.querySelectorAll('[data-act-step]'));
    var coin = root.querySelector('[data-act-coin]');
    var timers = [];
    var running = false;

    function clear() { timers.forEach(clearTimeout); timers = []; }

    function resetUI() {
      bar.style.width = '0%';
      status.textContent = UI.t('st4.activating');
      pill.className = 'status-pill is-wait';
      pill.innerHTML = UI.icon('rotate', '', 14) + UI.esc(UI.t('st4.statusActivating'));
      result.hidden = true;
      next.disabled = true;
      steps.forEach(function (s) { s.classList.remove('is-on'); });
      if (coin) coin.classList.remove('is-moving');
    }

    function activateUI() {
      bar.style.width = '100%';
      status.textContent = UI.t('st4.statusActive');
      pill.className = 'status-pill is-on';
      pill.innerHTML = UI.icon('check', '', 14) + UI.esc(UI.t('st4.statusActive'));
      result.hidden = false;
      next.disabled = false;
      steps.forEach(function (s) { s.classList.add('is-on'); });
    }

    function run() {
      clear();
      running = true;
      resetUI();
      var fast = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var gap = fast ? 160 : 750;
      if (coin) coin.classList.add('is-moving');
      steps.forEach(function (s, i) {
        timers.push(setTimeout(function () {
          if (!document.body.contains(root)) return;
          s.classList.add('is-on');
          bar.style.width = Math.round((i + 1) / 3 * 100) + '%';
        }, (i + 1) * gap));
      });
      timers.push(setTimeout(function () {
        if (!document.body.contains(root)) return;
        running = false;
        activateUI();
        st.activated = true;
        Store.complete(4);
        var has = st.messages.some(function (m) { return m.type === 'activated'; });
        if (!has) {
          Store.addMessage('activated', {
            name: st.form.name || window.PAPData.demo.individual.name
          });
        }
        Store.save();
        UI.toast(UI.t('st4.activeBody'), 'success', 4800);
        if (window.App.refreshChrome) window.App.refreshChrome();
      }, 3 * gap + (fast ? 200 : 700)));
    }

    if (next) next.addEventListener('click', function () { window.App.go('stage', { n: 5 }); });
    var replay = root.querySelector('[data-act-replay]');
    if (replay) replay.addEventListener('click', function () {
      if (running) return;
      run();
    });

    if (st.activated) {
      activateUI();
    } else {
      timers.push(setTimeout(run, 400));
    }
  }

  Reg[3] = { body: body3, mount: mount3 };
  Reg[4] = { body: body4, mount: mount4 };
})();

}
