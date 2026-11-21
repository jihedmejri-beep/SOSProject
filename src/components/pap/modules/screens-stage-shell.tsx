// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-stage-shell.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   Stage shell: header, aside, footer, shared helpers
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI;
  var Store = window.Store;
  var Registry = window.StageRegistry || (window.StageRegistry = {});

  function aside(n) {
    var s = window.PAPData.stages[n - 1];
    var roles = s.roles.map(function (r) { return UI.roleChip(r); }).join('');
    return '' +
      '<aside class="stage-aside">' +
      '<div class="panel panel--scene">' +
      '<p class="eyebrow">' + UI.icon('sparkles', '', 14) + UI.t('st.scene') + '</p>' +
      UI.scene(n, 'scene--stage') +
      '<p class="scene-caption">' + UI.esc(UI.t('s' + n + '.sub')) + '</p>' +
      '</div>' +
      '<div class="panel">' +
      '<h2 class="panel__title">' + UI.icon('info', '', 16) + UI.t('map.detailWhat') + '</h2>' +
      '<p>' + UI.esc(UI.t('s' + n + '.what')) + '</p>' +
      '</div>' +
      '<div class="panel">' +
      '<h2 class="panel__title">' + UI.icon('user', '', 16) + UI.t('st.actors') + '</h2>' +
      '<div class="role-chips">' + roles + '</div>' +
      '<p class="muted">' + UI.esc(UI.t('s' + n + '.who')) + '</p>' +
      '</div>' +
      '<div class="panel panel--note ' + (s.tag === 'fact' ? 'panel--fact' : 'panel--sim') + '">' +
      '<h2 class="panel__title">' + UI.icon('info', '', 16) + UI.t('st.accuracy') + '</h2>' +
      '<div>' + UI.badge(s.tag) + '</div>' +
      '<p class="muted">' + UI.esc(UI.t(s.note)) + '</p>' +
      '</div>' +
      '</aside>';
  }

  function dots(current) {
    var out = '';
    for (var i = 1; i <= 10; i++) {
      var cls = 'dot' + (Store.isDone(i) ? ' is-done' : '') + (i === current ? ' is-current' : '');
      out += '<button type="button" class="' + cls + '" data-jump="' + i + '"' +
        ' aria-label="' + UI.esc(UI.t('u.step') + ' ' + i + ' : ' + UI.t('s' + i + '.title')) + '"' +
        (i === current ? ' aria-current="step"' : '') + '>' + i + '</button>';
    }
    return '<div class="stage-dots" role="group" aria-label="' + UI.esc(UI.t('nav.stages')) + '">' + out + '</div>';
  }

  function render(n) {
    var s = window.PAPData.stages[n - 1];
    var item = Registry[n];
    var body = item && item.body ? item.body(Store.state) : '';
    return '' +
      '<section class="screen screen--stage" data-stage="' + n + '" aria-labelledby="stageTitle">' +
      '<header class="stage-head">' +
      '<div class="stage-head__bar">' +
      '<button type="button" class="btn btn--ghost btn--sm" data-back-map>' +
      UI.icon('map', '', 16) + '<span>' + UI.esc(UI.t('c.backToMap')) + '</span></button>' +
      '<span class="stage-count">' + UI.esc(UI.t('u.step')) + ' <strong>' + n + '</strong> / 10</span>' +
      dots(n) +
      '</div>' +
      '<div class="stage-head__main">' +
      '<p class="eyebrow">' + UI.icon('flag', '', 15) + UI.esc(UI.t('nav.stages')) + ' · ' + n + '</p>' +
      '<h1 id="stageTitle">' + UI.esc(UI.t(s.titleKey)) + '</h1>' +
      '<p class="lead">' + UI.esc(UI.t(s.subKey)) + '</p>' +
      '<div class="stage-head__meta">' + UI.badge(s.tag) +
      '<span class="stage-head__hint">' + UI.icon('arrow-right', '', 14) + UI.esc(UI.t('map.playHint')) + '</span>' +
      '</div>' +
      '</div>' +
      '</header>' +
      '<div class="stage-grid"><div class="stage-main" id="stageMain">' + body + '</div>' + aside(n) + '</div>' +
      '<footer class="stage-actions">' +
      '<button type="button" class="btn btn--ghost" data-prev>' + UI.icon('arrow-left', '', 18) +
      '<span>' + UI.esc(n === 1 ? UI.t('c.backToMap') : UI.t('st.prev')) + '</span></button>' +
      '<div class="stage-actions__mid">' +
      '<button type="button" class="btn btn--quiet" data-restart>' + UI.icon('rotate', '', 16) + UI.t('c.restart') + '</button>' +
      '</div>' +
      '<button type="button" class="btn btn--primary" data-next>' +
      '<span>' + UI.esc(n === 10 ? UI.t('c.backToMap') : UI.t('st.next')) + '</span>' + UI.icon('arrow-right', '', 18) + '</button>' +
      '</footer>' +
      '</section>';
  }

  function mount(root, n) {
    var back = root.querySelector('[data-back-map]');
    if (back) back.addEventListener('click', function () { window.App.go('map'); });

    root.querySelectorAll('[data-jump]').forEach(function (b) {
      b.addEventListener('click', function () { window.App.go('stage', { n: Number(b.getAttribute('data-jump')) }); });
    });

    var prev = root.querySelector('[data-prev]');
    if (prev) prev.addEventListener('click', function () {
      window.App.go(n === 1 ? 'map' : 'stage', n === 1 ? undefined : { n: n - 1 });
    });

    var next = root.querySelector('[data-next]');
    if (next) next.addEventListener('click', function () {
      window.App.go(n === 10 ? 'map' : 'stage', n === 10 ? undefined : { n: n + 1 });
    });

    var restart = root.querySelector('[data-restart]');
    if (restart) restart.addEventListener('click', function () {
      UI.confirm({
        title: UI.t('c.restart'),
        body: UI.esc(UI.t('ft.demo')),
        confirmLabel: UI.t('c.restart'),
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        Store.reset();
        window.App.go('map');
        UI.toast(UI.t('c.restart'), 'success');
      });
    });

    if (Registry[n] && Registry[n].mount) Registry[n].mount(root, n);
  }

  window.ScreenStage = { render: render, mount: mount };
})();

}
