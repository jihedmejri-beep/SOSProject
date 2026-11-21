// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-home.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   Screen: Accueil / introduction
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store;

  function home() {
    var st = Store.state;
    var facts = [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
      return '<li>' + UI.icon('check', '', 15) + '<span>' + UI.esc(UI.t('ho.fact' + i)) + '</span></li>';
    }).join('');
    var levels = window.PAPData.stages.map(function (s) {
      return '<button type="button" class="home-level" data-home-level="' + s.n + '">' +
        '<span class="home-level__num">' + (s.n < 10 ? '0' + s.n : s.n) + '</span>' +
        '<span class="home-level__title">' + UI.esc(UI.t(s.titleKey)) + '</span>' +
        UI.icon('chevron-right', '', 16) + '</button>';
    }).join('');
    var swatches = [
      ['#08A9E0', 'Cyan'], ['#1D3768', 'Navy'], ['#E2556A', 'Coral'],
      ['#EFFAFF', 'Pale'], ['#CFEAF5', 'Light'], ['#FFFFFF', 'White']
    ].map(function (c) {
      return '<span class="swatch"><span class="swatch__dot" style="background:' + c[0] + '"></span>' +
        '<span class="swatch__hex">' + c[0] + '</span></span>';
    }).join('');

    return '' +
      '<section class="screen screen--home">' +
      '<div class="hero">' +
      '<div class="hero__text">' +
      '<p class="eyebrow">' + UI.icon('sparkles', '', 15) + UI.t('brand.sim') + ' · SOS Tunisie</p>' +
      '<h1>' + UI.esc(UI.t('app.title')) + '</h1>' +
      '<p class="lead">' + UI.esc(UI.t('app.subtitle')) + '</p>' +
      '<div class="row-actions">' +
      '<button type="button" class="btn btn--primary btn--lg" data-home-map>' + UI.icon('map', '', 20) + UI.esc(UI.t('app.start')) + '</button>' +
      '<button type="button" class="btn btn--ghost btn--lg" data-home-stage1>' + UI.icon('pen', '', 18) + UI.esc(UI.t('ho.openStage')) + ' 1</button>' +
      '</div>' +
      '<div class="hero__badges">' +
      '<span class="badge badge--fact">' + UI.icon('check', '', 14) + UI.t('c.published') + '</span>' +
      '<span class="badge badge--sim">' + UI.icon('sparkles', '', 14) + UI.t('c.proposed') + '</span>' +
      '<span class="badge badge--soft">' + UI.icon('lock', '', 14) + UI.t('c.fictional') + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="hero__art">' +
      UI.scene(10, 'scene--hero') +
      '<span class="hero__avatar">' + window.Art.avatar(st.donorType) + '</span>' +
      '</div></div>' +

      '<div class="home-grid">' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('heart', '', 18) + UI.t('ho.what') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.whatBody')) + '</p></div>' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('map', '', 18) + UI.t('ho.how') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.howBody')) + '</p></div>' +
      '</div>' +

      '<div class="panel facts-panel">' +
      '<h2 class="panel__title">' + UI.icon('check', '', 18) + UI.t('ho.facts') + UI.badge('fact') + '</h2>' +
      '<ul class="tick-list tick-list--two">' + facts + '</ul></div>' +

      '<div class="home-grid">' +
      '<div class="panel panel--sim"><h2 class="panel__title">' + UI.icon('sparkles', '', 18) + UI.t('ho.sim') + UI.badge('sim') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.simBody')) + '</p>' +
      '<ul class="tick-list">' +
      '<li>' + UI.icon('lock', '', 14) + UI.esc(UI.t('ho.sim1')) + '</li>' +
      '<li>' + UI.icon('lock', '', 14) + UI.esc(UI.t('ho.sim2')) + '</li>' +
      '<li>' + UI.icon('lock', '', 14) + UI.esc(UI.t('ho.sim3')) + '</li>' +
      '</ul></div>' +
      '<div class="stack">' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('lock', '', 18) + UI.t('ho.privacy') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.privBody')) + '</p></div>' +
      '<div class="panel"><h2 class="panel__title">' + UI.icon('user', '', 18) + UI.t('ho.a11y') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.a11yBody')) + '</p></div>' +
      '</div></div>' +

      '<div class="panel palette-panel">' +
      '<h2 class="panel__title">' + UI.icon('sparkles', '', 18) + UI.t('ho.palette') + '</h2>' +
      '<p>' + UI.esc(UI.t('ho.paletteBody')) + '</p>' +
      '<div class="swatches">' + swatches + '</div>' +
      '<h3 class="panel__subtitle">' + UI.icon('info', '', 16) + UI.t('ho.logo') + '</h3>' +
      '<p class="muted">' + UI.esc(UI.t('ho.logoBody')) + '</p></div>' +

      '<div class="panel levels-panel">' +
      '<h2 class="panel__title">' + UI.icon('flag', '', 18) + UI.t('ho.stages') + '</h2>' +
      '<div class="home-levels">' + levels + '</div></div>' +
      '</section>';
  }

  function mountHome(root) {
    var map = root.querySelector('[data-home-map]');
    if (map) map.addEventListener('click', function () { window.App.go('map'); });
    var s1 = root.querySelector('[data-home-stage1]');
    if (s1) s1.addEventListener('click', function () { window.App.go('stage', { n: 1 }); });
    root.querySelectorAll('[data-home-level]').forEach(function (b) {
      b.addEventListener('click', function () { window.App.go('stage', { n: Number(b.getAttribute('data-home-level')) }); });
    });
  }

  window.ScreenHome = { render: home, mount: mountHome };
})();

}
