/* ============================================================
   App shell: header, navigation, routing, chrome updates
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store;
  var app = null;
  var current = { name: 'map', n: 1 };

  var SCREENS = {
    map: function () { return window.ScreenMap; },
    home: function () { return window.ScreenHome; },
    messages: function () { return window.ScreenMessages; },
    admin: function () { return window.ScreenAdmin; },
    stage: function () { return window.ScreenStage; }
  };

  function navButton(target, label, extra) {
    var isActive = target === current.name || (target === 'stage' && current.name === 'stage' && extra && extra.n === current.n);
    return '<button type="button" class="nav__btn' + (isActive ? ' is-active' : '') + '" data-nav="' + target + '"' +
      (extra && extra.n ? ' data-nav-n="' + extra.n + '"' : '') +
      (isActive ? ' aria-current="page"' : '') + '>' + label + '</button>';
  }

  function header() {
    var st = Store.state;
    var done = Store.progress();
    var unread = Store.unreadCount();
    return '' +
      '<div class="masthead__inner">' +
      '<div class="masthead__tools">' +
      '<div class="seg seg--donor" role="group" aria-label="' + UI.esc(UI.t('u.donorType')) + '">' +
      '<button type="button" class="seg__btn' + (st.donorType === 'individual' ? ' is-on' : '') + '" data-donor="individual" aria-pressed="' + (st.donorType === 'individual') + '">' +
      '<span class="seg__art">' + window.Art.avatar('individual') + '</span><span class="seg__label">' + UI.esc(UI.t('u.individual')) + '</span></button>' +
      '<button type="button" class="seg__btn' + (st.donorType === 'company' ? ' is-on' : '') + '" data-donor="company" aria-pressed="' + (st.donorType === 'company') + '">' +
      '<span class="seg__art">' + window.Art.avatar('company') + '</span><span class="seg__label">' + UI.esc(UI.t('u.company')) + '</span></button>' +
      '</div>' +
      '<button type="button" class="icon-btn bell" data-nav="messages" aria-label="' + UI.esc(UI.t('u.messages')) + '">' +
      UI.icon('bell', '', 20) + (unread ? '<span class="bell__badge">' + unread + '</span>' : '') + '</button>' +
      '<div class="progress-mini" title="' + UI.esc(UI.t('u.progressFull', { done: done })) + '">' +
      '<span class="progress-mini__label">' + UI.esc(UI.t('u.step')) + ' ' + Math.min(done + 1, 10) + ' / 10</span>' +
      '<span class="progress-mini__bar"><span style="width:' + (done / 10 * 100) + '%"></span></span>' +
      '</div>' +
      '</div></div>';
  }

  function nav() {
    var parts = [
      navButton('map', UI.icon('map', '', 16) + '<span>' + UI.esc(UI.t('nav.map')) + '</span>'),
      navButton('messages', UI.icon('bell', '', 16) + '<span>' + UI.esc(UI.t('nav.messages')) + '</span>' +
        (Store.unreadCount() ? '<em class="nav__badge">' + Store.unreadCount() + '</em>' : ''))
    ];
    return '<div class="nav__inner">' + parts.join('') + '</div>' +
      '<span class="sr-only">' + UI.esc(UI.t('u.progressFull', { done: Store.progress() })) + '</span>';
  }

  function footer() {
    return '<div class="footer__inner">' +
      '<p class="footer__brand">' + window.Art.brand() + '<span><strong>' + UI.esc(UI.t('brand.title')) + '</strong> · ' +
      UI.esc(UI.t('ft.note')) + '</span></p>' +
      '<p>' + UI.icon('lock', '', 14) + UI.esc(UI.t('ft.demo')) + '</p>' +
      '<p>' + UI.icon('info', '', 14) + UI.esc(UI.t('ft.logos')) + '</p>' +
      '<p>' + UI.icon('check', '', 14) + UI.esc(UI.t('ft.accuracy')) + '</p>' +
      '</div>';
  }

  function updateChrome() {
    var st = Store.state;
    var done = Store.progress();
    var masthead = document.getElementById('masthead');
    if (masthead) masthead.innerHTML = header();
    var navEl = document.getElementById('mainNav');
    if (navEl) navEl.innerHTML = nav();
    var footEl = document.getElementById('footer');
    if (footEl) footEl.innerHTML = footer();
    bindChrome();
    document.documentElement.lang = st.lang;
    document.documentElement.dir = st.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = UI.t('app.title') + ' — ' + UI.t('brand.sub');
    var skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = UI.t('c.continue');
  }

  function bindChrome() {
    document.querySelectorAll('#masthead [data-donor]').forEach(function (b) {
      b.addEventListener('click', function () {
        setDonor(b.getAttribute('data-donor'));
      });
    });
    document.querySelectorAll('#masthead [data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    document.querySelectorAll('#masthead [data-nav]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var target = b.getAttribute('data-nav');
        go(target === 'stage' ? 'map' : target);
      });
    });
    document.querySelectorAll('#mainNav [data-nav]').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = b.getAttribute('data-nav');
        var n = b.getAttribute('data-nav-n');
        go(target, n ? { n: Number(n) } : undefined);
      });
    });
  }

  function setDonor(type) {
    if (Store.state.donorType === type) return;
    Store.setDonorType(type);
    render();
    UI.toast(UI.t(type === 'company' ? 'f1.typeCompanyDesc' : 'f1.typeIndividualDesc'), 'info', 2600);
  }

  function setLang(lang) {
    if (Store.state.lang === lang) return;
    Store.setLang(lang);
    render();
    UI.toast(UI.t('u.lang') + ' : ' + lang.toUpperCase(), 'success', 1800);
  }

  function render() {
    var st = Store.state;
    if (!app) app = document.getElementById('app') || document.getElementById('main');
    if (!app) return;

    if (current.name === 'stage' && window.ScreenStage && window.ScreenStage.cleanup) {
      window.ScreenStage.cleanup();
    }
    if (current.name === 'map' && window.ScreenMap && window.ScreenMap.pause) {
      window.ScreenMap.pause();
    }
    var oldBoard = document.getElementById('board');
    if (oldBoard && oldBoard._ro) oldBoard._ro.disconnect();

    current = st.screen === 'stage' ? { name: 'stage', n: st.currentStage || 1 } : { name: st.screen || 'map', n: 1 };

    var screen = SCREENS[current.name] ? SCREENS[current.name]() : null;
    var html = '';
    if (current.name === 'stage') {
      html = screen.render(current.n);
    } else {
      html = screen.render();
    }

    app.innerHTML = html;

    updateChrome();

    if (current.name === 'stage') screen.mount(app, current.n);
    else screen.mount(app);

    var main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
  }

  function go(name, opts) {
    opts = opts || {};
    var st = Store.state;
    if (name === 'stage') {
      st.screen = 'stage';
      st.currentStage = Math.max(1, Math.min(10, opts.n || 1));
      current = { name: 'stage', n: st.currentStage };
    } else {
      st.screen = name;
      current = { name: name, n: 1 };
    }
    Store.save();
    render();
    UI.scrollTop();
  }

  function restart() {
    UI.confirm({
      title: UI.t('c.restart'),
      body: '<p>' + UI.esc(UI.t('ft.demo')) + '</p><p class="muted">' + UI.esc(UI.t('ho.privBody')) + '</p>',
      confirmLabel: UI.t('c.restart'),
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      Store.reset();
      go('map');
      UI.toast(UI.t('c.restart'), 'success');
    });
  }

  function init() {
    app = document.getElementById('app') || document.getElementById('main');
    var st = Store.init();
    // The app always opens on the pixel-art adventure map.
    st.screen = 'map';
    st.currentStage = st.currentStage || 1;
    Store.save();
    document.documentElement.lang = st.lang;
    document.documentElement.dir = st.lang === 'ar' ? 'rtl' : 'ltr';
    current = { name: 'map', n: 1 };
    render();

    Store.on(function () { /* state saved by actions; chrome refreshed explicitly */ });
  }

  window.App = {
    go: go,
    render: render,
    refreshChrome: updateChrome,
    restart: restart,
    setDonor: setDonor,
    setLang: setLang,
    init: init
  };

  document.addEventListener('DOMContentLoaded', init);
})();
