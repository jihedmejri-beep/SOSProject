/* ============================================================
   STEP 2 — confirmation message (proposed simulation feature)
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store, Reg = window.StageRegistry;

  function donorName() {
    var st = Store.state;
    if (st.form.name) return st.form.name;
    return st.donorType === 'company' ? window.PAPData.demo.company.name : window.PAPData.demo.individual.name;
  }

  function body(st) {
    var name = donorName();
    var text = UI.t('st2.messageBody', { name: name });
    var decision;
    if (st.confirmed === true) {
      decision = '' +
        '<div class="result-card result-card--success">' +
        '<span class="result-card__icon">' + UI.icon('check', '', 26) + '</span>' +
        '<div><h3>' + UI.esc(UI.t('st2.confirmTitle')) + '</h3>' +
        '<p>' + UI.esc(UI.t('st2.confirmBody')) + '</p></div>' +
        '</div>' +
        '<div class="row-actions">' +
        '<button type="button" class="btn btn--primary" data-continue>' + UI.icon('arrow-right', '', 18) + UI.esc(UI.t('st2.continue')) + '</button>' +
        '<button type="button" class="btn btn--quiet" data-reopen>' + UI.icon('rotate', '', 16) + UI.esc(UI.t('st2.reopen')) + '</button>' +
        '</div>';
    } else if (st.confirmed === false) {
      decision = '' +
        '<div class="result-card result-card--danger">' +
        '<span class="result-card__icon">' + UI.icon('x', '', 26) + '</span>' +
        '<div><h3>' + UI.esc(UI.t('st2.cancelTitle')) + '</h3>' +
        '<p>' + UI.esc(UI.t('st2.cancelBody')) + '</p></div>' +
        '</div>' +
        '<div class="row-actions">' +
        '<button type="button" class="btn btn--primary" data-restart-journey>' + UI.icon('rotate', '', 18) + UI.esc(UI.t('st2.restart')) + '</button>' +
        '<button type="button" class="btn btn--quiet" data-reopen>' + UI.icon('arrow-left', '', 16) + UI.esc(UI.t('st2.reopen')) + '</button>' +
        '</div>';
    } else {
      decision = '' +
        '<p class="question">' + UI.esc(UI.t('st2.choice')) + '</p>' +
        '<div class="choice-grid">' +
        '<button type="button" class="choice choice--yes" data-confirm>' +
        '<span class="choice__icon">' + UI.icon('check', '', 22) + '</span>' +
        '<span>' + UI.esc(UI.t('st2.confirm')) + '</span></button>' +
        '<button type="button" class="choice choice--no" data-cancel>' +
        '<span class="choice__icon">' + UI.icon('x', '', 22) + '</span>' +
        '<span>' + UI.esc(UI.t('st2.cancel')) + '</span></button>' +
        '</div>';
    }

    return '' +
      '<div class="stage-2">' +
      '<div class="phone-wrap">' +
      '<div class="phone">' +
      '<div class="phone__notch" aria-hidden="true"></div>' +
      '<div class="phone__status"><span>9:41</span><span>' + UI.icon('message', '', 13) + ' ' + UI.esc(UI.t('m.phone')) + '</span></div>' +
      '<div class="phone__app">' +
      '<div class="phone__head"><span class="avatar-dot">' + window.Art.role('sos') + '</span>' +
      '<div><strong>' + UI.esc(UI.t('st2.header')) + '</strong><small>' + UI.icon('lock', '', 11) + ' ' + UI.esc(UI.t('c.simulation')) + '</small></div>' +
      UI.icon('info', '', 18) + '</div>' +
      '<div class="chat">' +
      '<span class="chat-day">' + UI.esc(UI.t('st2.today')) + '</span>' +
      '<div class="chat-bubble chat-bubble--in">' +
      '<span class="chat-bubble__sender">' + UI.esc(UI.t('st2.header')) + '</span>' +
      '<p class="chat-text">' + UI.esc(text) + '</p>' +
      '<span class="chat-meta">10:24 ' + UI.icon('check', '', 12) + UI.icon('check', '', 12) + '</span>' +
      '</div>' +
      (st.confirmed === true ? '<div class="chat-bubble chat-bubble--out"><p class="chat-text">' + UI.esc(UI.t('st2.confirm')) + '</p><span class="chat-meta">10:26</span></div>' : '') +
      (st.confirmed === false ? '<div class="chat-bubble chat-bubble--out"><p class="chat-text">' + UI.esc(UI.t('st2.cancel')) + '</p><span class="chat-meta">10:26</span></div>' : '') +
      '<div class="chat-label">' + UI.icon('sparkles', '', 13) + UI.esc(UI.t('m.fictional')) + '</div>' +
      '</div></div>' +
      '</div></div>' +

      '<div class="stage-2__side">' +
      '<div class="panel decision-panel">' +
      '<h2 class="panel__title">' + UI.icon('message', '', 18) + UI.esc(UI.t('st2.decided')) + '</h2>' +
      decision +
      '</div>' +
      '<div class="panel panel--sim">' +
      '<p>' + UI.icon('info', '', 16) + ' ' + UI.esc(UI.t('st2.simNote')) + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function mount(root, n) {
    var st = Store.state;
    var hasRequest = st.messages.some(function (m) { return m.type === 'confirmRequest'; });
    if (!hasRequest) {
      Store.addMessage('confirmRequest', { name: donorName() });
    }

    var confirmBtn = root.querySelector('[data-confirm]');
    if (confirmBtn) confirmBtn.addEventListener('click', function () {
      st.confirmed = true;
      st.cancelled = false;
      Store.complete(2);
      Store.addMessage('confirmed', { name: donorName() });
      Store.save();
      UI.toast(UI.t('st2.confirmBody'), 'success');
      window.App.render();
      if (window.App.refreshChrome) window.App.refreshChrome();
      setTimeout(function () {
        if (Store.state.screen === 'stage' && Store.state.currentStage === 2 && Store.state.confirmed === true) {
          window.App.go('stage', { n: 3 });
        }
      }, 2400);
    });

    var cancelBtn = root.querySelector('[data-cancel]');
    if (cancelBtn) cancelBtn.addEventListener('click', function () {
      st.confirmed = false;
      st.cancelled = true;
      Store.addMessage('cancelled', { name: donorName() });
      Store.save();
      UI.toast(UI.t('st2.cancelBody'), 'error', 6000);
      window.App.render();
    });

    var reopen = root.querySelector('[data-reopen]');
    if (reopen) reopen.addEventListener('click', function () {
      st.confirmed = null;
      st.cancelled = false;
      Store.save();
      window.App.render();
    });

    var cont = root.querySelector('[data-continue]');
    if (cont) cont.addEventListener('click', function () { window.App.go('stage', { n: 3 }); });

    var restart = root.querySelector('[data-restart-journey]');
    if (restart) restart.addEventListener('click', function () {
      if (window.App.restart) window.App.restart();
    });
  }

  Reg[2] = { body: body, mount: mount };
})();
