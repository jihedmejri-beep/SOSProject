/* ============================================================
   STEP 8 — modification · STEP 9 — suspension · STEP 10 — termination
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store, Reg = window.StageRegistry;

  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function maskRib(v) {
    var d = digits(v);
    return d.length >= 4 ? '•••• ' + d.slice(-4) : '—';
  }

  /* ---------------- STEP 8 ---------------- */
  function modDetail(m) {
    if (m.type === 'amount') return UI.t('st8.changeAmount', { value: m.value });
    if (m.type === 'bank') return UI.t('st8.changeBank', { value: maskRib(m.value) });
    if (m.type === 'contact') return UI.t('st8.changeContact', { value: m.value });
    if (m.type === 'village') return UI.t('st8.changeVillage', { value: UI.villageName(m.value) });
    return '';
  }

  function modLabel(type) {
    return UI.t('st8.' + type);
  }

  function modForm(type, st) {
    var inner = '';
    if (type === 'amount') {
      inner = '<div class="field"><label for="modAmount">' + UI.esc(UI.t('st8.newAmount')) + '</label>' +
        '<input id="modAmount" type="number" min="5" max="5000" step="5" value="' + UI.esc(st.form.amount || 60) + '"></div>';
    } else if (type === 'bank') {
      inner = '<div class="field"><label for="modRib">' + UI.esc(UI.t('st8.newRib')) + '</label>' +
        '<input id="modRib" type="text" maxlength="27" value="' + UI.esc(st.form.rib || '') + '" placeholder="TN59 1000 6035 0000 1234 5678"></div>';
    } else if (type === 'contact') {
      inner = '<div class="form-grid">' +
        '<div class="field"><label for="modAddress">' + UI.esc(UI.t('st8.newAddress')) + '</label>' +
        '<input id="modAddress" type="text" value="' + UI.esc(st.form.address || '') + '"></div>' +
        '<div class="field"><label for="modPhone">' + UI.esc(UI.t('st8.newPhone')) + '</label>' +
        '<input id="modPhone" type="tel" value="' + UI.esc(st.form.phone || '') + '"></div>' +
        '<div class="field"><label for="modEmail">' + UI.esc(UI.t('st8.newEmail')) + '</label>' +
        '<input id="modEmail" type="email" value="' + UI.esc(st.form.email || '') + '"></div></div>';
    } else {
      inner = '<div class="field"><label for="modVillage">' + UI.esc(UI.t('st8.newVillage')) + '</label>' +
        '<select id="modVillage">' + window.PAPData.villages.map(function (v) {
          return '<option value="' + UI.esc(v.id) + '"' + (v.id === st.form.village ? ' selected' : '') + '>' +
            UI.esc(v[st.lang] || v.fr) + '</option>';
        }).join('') + '</select></div>';
    }
    return '<form class="mod-form" data-mod-form="' + type + '" novalidate>' +
      '<h3 class="panel__title">' + UI.icon('edit', '', 17) + UI.esc(modLabel(type)) + '</h3>' +
      '<div class="mod-form__current">' + UI.esc(UI.t('st8.current')) + ' : <strong>' + currentValue(type, st) + '</strong></div>' +
      inner + '<div class="row-actions">' +
      '<button type="submit" class="btn btn--primary">' + UI.icon('check', '', 17) + UI.esc(UI.t('st8.submit')) + '</button>' +
      '<button type="button" class="btn btn--quiet" data-mod-cancel>' + UI.esc(UI.t('st8.back')) + '</button>' +
      '</div></form>';
  }

  function currentValue(type, st) {
    if (type === 'amount') return UI.money(st.form.amount || 60);
    if (type === 'bank') return maskRib(st.form.rib) + ' · ' + UI.esc(UI.t('c.fictional'));
    if (type === 'contact') return UI.esc(st.form.phone || '—');
    return UI.esc(UI.villageName(st.form.village));
  }

  function body8(st) {
    var tiles = ['amount', 'bank', 'contact', 'village'].map(function (type) {
      var icons = { amount: 'banknote', bank: 'credit-card', contact: 'edit', village: 'map-pin' };
      return '<button type="button" class="mod-tile" data-mod="' + type + '" aria-pressed="false">' +
        '<span class="mod-tile__icon">' + UI.icon(icons[type], '', 22) + '</span>' +
        '<span class="mod-tile__text"><strong>' + UI.esc(UI.t('st8.' + type)) + '</strong>' +
        '<small>' + UI.esc(UI.t('st8.' + type + 'Desc')) + '</small></span>' +
        '<span class="mod-tile__arrow">' + UI.icon('chevron-right', '', 18) + '</span>' +
        '</button>';
    }).join('');

    var reqs = st.modifications.length
      ? '<ul class="request-list">' + st.modifications.slice().reverse().map(function (m) {
        return '<li><span class="request-list__dot">' + UI.icon('check', '', 12) + '</span>' +
          '<div><strong>' + UI.esc(modLabel(m.type)) + '</strong>' +
          '<p>' + UI.esc(modDetail(m)) + '</p>' +
          '<small>' + UI.fmtDate(m.at, { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + UI.esc(UI.t('st8.recorded')) + '</small></div></li>';
      }).join('') + '</ul>'
      : '<p class="empty-state">' + UI.icon('edit', '', 22) + UI.esc(UI.t('st8.empty')) + '</p>';

    return '' +
      '<div class="mod-layout">' +
      '<div class="panel">' +
      '<h2 class="panel__title">' + UI.icon('settings', '', 18) + UI.esc(UI.t('st8.choose')) + '</h2>' +
      '<div class="mod-grid">' + tiles + '</div>' +
      ['amount', 'bank', 'contact', 'village'].map(function (t) { return '<div data-mod-slot="' + t + '" hidden>' + modForm(t, st) + '</div>'; }).join('') +
      '<p class="hint">' + UI.esc(UI.t('st8.simNote')) + '</p>' +
      '</div>' +
      '<div class="panel">' +
      '<h2 class="panel__title">' + UI.icon('list', '', 18) + UI.esc(UI.t('st8.requests')) + '</h2>' +
      reqs +
      '</div></div>';
  }

  function mount8(root) {
    var st = Store.state;
    function show(type) {
      root.querySelectorAll('.mod-tile').forEach(function (t) {
        t.classList.toggle('is-on', !!type && t.getAttribute('data-mod') === type);
        t.setAttribute('aria-pressed', String(!!type && t.getAttribute('data-mod') === type));
      });
      root.querySelectorAll('[data-mod-slot]').forEach(function (s) {
        s.hidden = s.getAttribute('data-mod-slot') !== type;
      });
      var form = type ? root.querySelector('[data-mod-form="' + type + '"]') : null;
      if (form) {
        var first = form.querySelector('input, select');
        if (first) first.focus();
      }
    }

    root.querySelectorAll('.mod-tile').forEach(function (t) {
      t.addEventListener('click', function () {
        var isOn = t.classList.contains('is-on');
        show(isOn ? null : t.getAttribute('data-mod'));
      });
    });

    root.querySelectorAll('[data-mod-cancel]').forEach(function (b) {
      b.addEventListener('click', function () { show(null); });
    });

    root.querySelectorAll('.mod-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var type = form.getAttribute('data-mod-form');
        var rec = null;

        if (type === 'amount') {
          var amount = Number(form.querySelector('#modAmount').value);
          if (!amount || amount < 5 || amount > 5000) { UI.toast(UI.t('f1.invalidAmount'), 'error'); return; }
          rec = { type: type, value: amount };
        } else if (type === 'bank') {
          var rib = form.querySelector('#modRib').value.trim();
          var d = digits(rib);
          if (d.length < 10 || d.length > 24) { UI.toast(UI.t('f1.ribInvalid'), 'error'); return; }
          rec = { type: type, value: rib };
        } else if (type === 'contact') {
          var address = form.querySelector('#modAddress').value.trim();
          var phone = form.querySelector('#modPhone').value.trim();
          var email = form.querySelector('#modEmail').value.trim();
          if (address.length < 5 || digits(phone).length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            UI.toast(UI.t('st8.invalid'), 'error');
            return;
          }
          rec = { type: type, value: phone, meta: { address: address, email: email } };
        } else {
          rec = { type: type, value: form.querySelector('#modVillage').value };
        }

        rec.at = new Date().toISOString();
        st.modifications.push(rec);
        if (type === 'amount') st.form.amount = rec.value;
        if (type === 'bank') st.form.rib = rec.value;
        if (type === 'contact') {
          st.form.address = rec.meta.address;
          st.form.phone = rec.value;
          st.form.email = rec.meta.email;
        }
        if (type === 'village') st.form.village = rec.value;
        Store.save();
        Store.complete(8);
        Store.addMessage('modification', { detail: modDetail(rec) });
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t('st8.saved'), 'success', 4800);
        UI.dialog({
          eyebrow: UI.t('st8.recorded'),
          title: UI.t('st8.confirmTitle'),
          body: '<p>' + UI.esc(UI.t('st8.saved')) + '</p><p class="muted">' + UI.esc(modDetail(rec)) + '</p>',
          actions: [{ label: UI.t('dg.ok'), kind: 'primary', value: 'ok' }]
        });
      });
    });
  }

  /* ---------------- STEP 9 ---------------- */
  function body9(st) {
    var suspended = st.suspended;
    return '' +
      '<div class="susp-layout">' +
      '<div class="panel susp-hero ' + (suspended ? 'is-suspended' : 'is-active') + '">' +
      '<div class="status-orb">' + UI.icon(suspended ? 'pause' : 'play', '', 34) + '</div>' +
      '<div class="susp-hero__text">' +
      '<p class="eyebrow">' + UI.esc(UI.t('st9.status')) + '</p>' +
      '<h2>' + UI.esc(UI.t(suspended ? 'st9.suspended' : 'st9.active')) + '</h2>' +
      '<p class="muted">' + (suspended && st.suspendedAt
        ? UI.esc(UI.t('st9.since', { date: UI.fmtDate(st.suspendedAt) }))
        : UI.esc(UI.t('st4.rule'))) + '</p>' +
      '</div>' +
      '<span class="status-pill ' + (suspended ? 'is-off' : 'is-on') + '">' +
      UI.icon(suspended ? 'pause' : 'check', '', 14) + UI.esc(UI.t(suspended ? 'st9.suspended' : 'st9.active')) + '</span>' +
      '</div>' +
      '<div class="panel">' +
      (suspended
        ? '<button type="button" class="btn btn--primary btn--wide" data-reactivate>' + UI.icon('play', '', 18) + UI.esc(UI.t('st9.reactivate')) + '</button>'
        : '<button type="button" class="btn btn--danger btn--wide" data-suspend>' + UI.icon('pause-circle', '', 18) + UI.esc(UI.t('st9.suspend')) + '</button>') +
      '<h3 class="panel__title panel__title--spaced">' + UI.icon('info', '', 16) + UI.esc(UI.t('st9.impact')) + '</h3>' +
      '<ul class="tick-list">' +
      '<li>' + UI.icon('check', '', 14) + UI.esc(UI.t('st9.impact1')) + '</li>' +
      '<li>' + UI.icon('check', '', 14) + UI.esc(UI.t('st9.impact2')) + '</li>' +
      '<li>' + UI.icon('check', '', 14) + UI.esc(UI.t('st9.impact3')) + '</li>' +
      '</ul>' +
      '<p class="hint">' + UI.esc(UI.t('st9.note')) + '</p>' +
      '</div></div>';
  }

  function mount9(root) {
    var st = Store.state;
    var suspend = root.querySelector('[data-suspend]');
    if (suspend) suspend.addEventListener('click', function () {
      UI.confirm({
        title: UI.t('st9.confirmTitle'),
        body: '<p>' + UI.esc(UI.t('st9.confirmBody')) + '</p>',
        confirmLabel: UI.t('st9.confirmYes'),
        cancelLabel: UI.t('st9.confirmNo'),
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        st.suspended = true;
        st.suspendedOnce = true;
        st.suspendedAt = new Date().toISOString();
        Store.save();
        Store.complete(9);
        Store.addMessage('suspension', { name: st.form.name || window.PAPData.demo.individual.name });
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t('st9.suspendedMsg'), 'warning', 4800);
      });
    });

    var react = root.querySelector('[data-reactivate]');
    if (react) react.addEventListener('click', function () {
      UI.confirm({
        title: UI.t('st9.reactivate'),
        body: '<p>' + UI.esc(UI.t('st9.impact3')) + '</p>',
        confirmLabel: UI.t('st9.reactivate')
      }).then(function (ok) {
        if (!ok) return;
        st.suspended = false;
        st.suspendedAt = null;
        Store.save();
        Store.addMessage('reactivation', { name: st.form.name || window.PAPData.demo.individual.name });
        window.App.render();
        if (window.App.refreshChrome) window.App.refreshChrome();
        UI.toast(UI.t('st9.reactivatedMsg'), 'success');
      });
    });
  }

  /* ---------------- STEP 10 ---------------- */
  function reasonLabel(key) {
    var map = {
      finance: 'st10.reasonFinance',
      situation: 'st10.reasonSituation',
      dissatisfaction: 'st10.reasonDissatisfaction',
      other: 'st10.reasonOther'
    };
    return UI.t(map[key] || 'st10.reasonOther');
  }

  function body10(st) {
    if (st.termination) {
      var paid = Store.paidMonths();
      var term = st.termination;
      return '' +
        '<div class="final-layout">' +
        '<div class="panel final-card">' +
        '<div class="final-badge">' + UI.icon('flag', '', 26) + '</div>' +
        '<h2>' + UI.esc(UI.t('st10.finalTitle')) + '</h2>' +
        '<p class="final-msg">' + UI.esc(UI.t('st10.finalMsg')) + '</p>' +
        '<div class="stop-visual" aria-hidden="true">' +
        [1, 2, 3, 4, 5].map(function (i) { return '<span style="--i:' + i + '">' + window.Pixel.coin() + '</span>'; }).join('') +
        '<span class="stop-visual__label">' + UI.icon('x', '', 13) + UI.esc(UI.t('st10.stopped')) + '</span>' +
        '</div>' +
        '<p class="hint">' + UI.esc(UI.t('st10.confirmReason', { reason: reasonLabel(term.reason) })) + '</p>' +
        '</div>' +
        '<div class="panel summary-card">' +
        '<h3 class="panel__title">' + UI.icon('list', '', 18) + UI.esc(UI.t('st10.summary')) + '</h3>' +
        '<dl class="kv">' +
        '<div><dt>' + UI.esc(UI.t('st10.regDate')) + '</dt><dd>' + UI.fmtDate(st.registrationDate || '2026-01-12') + '</dd></div>' +
        '<div><dt>' + UI.esc(UI.t('st10.amount')) + '</dt><dd>' + UI.money(st.form.amount || 60) + '</dd></div>' +
        '<div><dt>' + UI.esc(UI.t('st10.count')) + '</dt><dd>' + paid.length + '</dd></div>' +
        '<div><dt>' + UI.esc(UI.t('st10.total')) + '</dt><dd>' + UI.money(Store.totalPaid()) + '</dd></div>' +
        '<div><dt>' + UI.esc(UI.t('st10.termDate')) + '</dt><dd>' + UI.fmtDate(term.at) + '</dd></div>' +
        '<div><dt>' + UI.esc(UI.t('st10.status')) + '</dt><dd><span class="status-pill is-off">' +
        UI.icon('x', '', 14) + UI.esc(UI.t('st10.terminated')) + '</span></dd></div>' +
        '</dl>' +
        '<div class="row-actions">' +
        '<button type="button" class="btn btn--primary" data-final-restart>' + UI.icon('rotate', '', 17) + UI.esc(UI.t('st10.restart')) + '</button>' +
        '<button type="button" class="btn btn--quiet" data-final-map>' + UI.icon('map', '', 16) + UI.esc(UI.t('st10.map')) + '</button>' +
        '</div></div></div>';
    }

    return '' +
      '<div class="term-layout">' +
      '<div class="panel term-question">' +
      '<div class="term-icon">' + UI.icon('alert', '', 26) + '</div>' +
      '<h2>' + UI.esc(UI.t('st10.question')) + '</h2>' +
      '<p class="muted">' + UI.esc(UI.t('s10.sub')) + '</p>' +
      '<div class="choice-grid">' +
      '<button type="button" class="choice choice--no" data-terminate>' +
      '<span class="choice__icon">' + UI.icon('x', '', 22) + '</span><span>' + UI.esc(UI.t('st10.yes')) + '</span></button>' +
      '<button type="button" class="choice choice--yes" data-keep>' +
      '<span class="choice__icon">' + UI.icon('heart', '', 22) + '</span><span>' + UI.esc(UI.t('st10.no')) + '</span></button>' +
      '</div>' +
      '<p class="hint">' + UI.esc(UI.t('s10.note')) + '</p>' +
      '</div>' +
      '<div class="panel term-info">' +
      '<h3 class="panel__title">' + UI.icon('info', '', 17) + UI.esc(UI.t('st10.summary')) + '</h3>' +
      '<dl class="kv">' +
      '<div><dt>' + UI.esc(UI.t('st10.regDate')) + '</dt><dd>' + UI.fmtDate(st.registrationDate || '2026-01-12') + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st10.amount')) + '</dt><dd>' + UI.money(st.form.amount || 60) + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st10.count')) + '</dt><dd>' + Store.paidMonths().length + '</dd></div>' +
      '<div><dt>' + UI.esc(UI.t('st10.total')) + '</dt><dd>' + UI.money(Store.totalPaid()) + '</dd></div>' +
      '</dl>' +
      '<div class="term-note">' + UI.icon('alert', '', 16) + UI.esc(UI.t('st10.confirmBody')) + '</div>' +
      '</div></div>';
  }

  function mount10(root) {
    var st = Store.state;
    var term = root.querySelector('[data-terminate]');
    if (term) term.addEventListener('click', function () {
      var reasonForm = '<div class="reason-list" role="radiogroup" aria-label="' + UI.esc(UI.t('st10.reason')) + '">' +
        ['finance', 'situation', 'dissatisfaction', 'other'].map(function (r) {
          return '<label class="reason"><input type="radio" name="termReason" value="' + r + '">' +
            '<span>' + UI.esc(UI.t('st10.reason' + r.charAt(0).toUpperCase() + r.slice(1))) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="field"><label for="termOther">' + UI.esc(UI.t('st10.reasonOther')) + '</label>' +
        '<input id="termOther" type="text" placeholder="' + UI.esc(UI.t('st10.reasonOtherPh')) + '"></div>' +
        '<p class="field__error" data-term-error role="alert"></p>' +
        '<p class="note note--warn">' + UI.icon('alert', '', 16) + UI.esc(UI.t('st10.confirmBody')) + '</p>';

      UI.dialog({
        eyebrow: UI.t('st10.confirmTitle'),
        title: UI.t('st10.confirmTitle'),
        body: reasonForm,
        actions: [
          { label: UI.t('st10.cancelBtn'), kind: 'ghost', value: 'cancel' },
          {
            label: UI.t('st10.confirmBtn'), kind: 'danger', value: 'confirm',
            onClick: function (close, dlg) {
              var checked = dlg.querySelector('input[name="termReason"]:checked');
              var err = dlg.querySelector('[data-term-error]');
              if (!checked) {
                err.textContent = UI.t('st10.reasonMissing');
                return;
              }
              var reason = checked.value;
              var other = dlg.querySelector('#termOther').value.trim();
              st.termination = { reason: reason, detail: other, at: new Date().toISOString() };
              Store.save();
              Store.complete(10);
              Store.addMessage('termination', {
                name: st.form.name || window.PAPData.demo.individual.name,
                reason: reasonLabel(reason)
              });
              close('confirm');
              window.App.render();
              if (window.App.refreshChrome) window.App.refreshChrome();
              UI.toast(UI.t('st10.finalTitle'), 'info', 5000);
            }
          }
        ]
      });
    });

    var keep = root.querySelector('[data-keep]');
    if (keep) keep.addEventListener('click', function () {
      UI.dialog({
        eyebrow: UI.t('st10.keepTitle'),
        title: UI.t('st10.keepTitle'),
        body: '<div class="result-card result-card--success"><span class="result-card__icon">' +
          UI.icon('heart', '', 26) + '</span><div><p>' + UI.esc(UI.t('st10.keepBody')) + '</p></div></div>',
        actions: [
          { label: UI.t('c.backToMap'), kind: 'ghost', value: 'map' },
          { label: UI.t('c.continue'), kind: 'primary', value: 'stay' }
        ],
        onClose: function (v) { if (v === 'map') window.App.go('map'); }
      });
    });

    var restart = root.querySelector('[data-final-restart]');
    if (restart) restart.addEventListener('click', function () {
      if (window.App.restart) window.App.restart();
    });
    var map = root.querySelector('[data-final-map]');
    if (map) map.addEventListener('click', function () { window.App.go('map'); });
  }

  Reg[8] = { body: body8, mount: mount8 };
  Reg[9] = { body: body9, mount: mount9 };
  Reg[10] = { body: body10, mount: mount10 };
})();
