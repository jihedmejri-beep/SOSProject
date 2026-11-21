/* ============================================================
   Screen: pixel-art journey map (default screen)
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI;
  var Store = window.Store;

  var play = { raf: 0, playing: false, progress: 0, startedAt: 0, base: 0, duration: 12000 };
  var geo = { path: null, svg: null, total: 0, nodes: [], points: [] };
  var reduceMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  var stepTimer = 0;

  function stateChip(n) {
    var st = Store.state;
    if (Store.isDone(n)) {
      return '<span class="level__state state--done">' + UI.icon('check', '', 13) + UI.t('map.done') + '</span>';
    }
    if (n === Store.currentLevel() && !st.termination) {
      return '<span class="level__state state--active">' + UI.icon('play', '', 12) + UI.t('map.active') + '</span>';
    }
    return '<span class="level__state state--upcoming">' + UI.icon('flag', '', 12) + UI.t('map.upcoming') + '</span>';
  }

  function card(n) {
    var s = window.PAPData.stages[n - 1];
    var roles = s.roles.map(function (r) {
      return '<span class="mini-role" title="' + UI.esc(UI.t('role.' + r)) + '">' + window.Art.role(r) + '</span>';
    }).join('');
    return '' +
      '<button type="button" class="level level--' + s.tag + '" data-level="' + n + '"' +
      ' aria-label="' + UI.esc(UI.t('u.step') + ' ' + n + ' : ' + UI.t(s.titleKey)) + '">' +
      '<span class="level__top">' +
      '<span class="level__num">' + (n < 10 ? '0' + n : n) + '</span>' +
      stateChip(n) +
      '</span>' +
      '<span class="level__scene">' + UI.scene(n) + '</span>' +
      '<span class="level__body">' +
      '<span class="level__title">' + UI.esc(UI.t(s.titleKey)) + '</span>' +
      '<span class="level__sub">' + UI.esc(UI.t(s.subKey)) + '</span>' +
      '<span class="level__foot"><span class="mini-roles">' + roles + '</span>' +
      '<span class="level__open">' + UI.icon('chevron-right', '', 16) + '</span></span>' +
      '</span>' +
      '</button>';
  }

  function render() {
    var st = Store.state;
    var done = Store.progress();
    var level = st.selectedLevel || Store.currentLevel();
    var pct = Math.round((done / 10) * 100);
    return '' +
      '<section class="screen screen--map" aria-labelledby="mapTitle">' +
      '<div class="map-head">' +
      '<div class="map-head__text">' +
      '<p class="eyebrow">' + UI.icon('map', '', 16) + UI.t('nav.map') + '</p>' +
      '<h1 id="mapTitle">' + UI.esc(UI.t('map.title')) + '</h1>' +
      '<p class="lead">' + UI.esc(UI.t('map.lead')) + '</p>' +
      '</div>' +
      '<div class="map-actions">' +
      '<button type="button" class="btn btn--primary" id="playJourney">' +
      '<span data-play-icon>' + UI.icon('play', '', 18) + '</span><span data-play-label>' + UI.esc(UI.t('map.play')) + '</span></button>' +
      '<button type="button" class="btn btn--ghost" id="replayJourney" title="' + UI.esc(UI.t('map.replay')) + '">' +
      UI.icon('rotate', '', 18) + '<span>' + UI.esc(UI.t('map.replay')) + '</span></button>' +
      '</div>' +
      '</div>' +

      '<div class="map-progress">' +
      '<div class="map-progress__top">' +
      '<span class="map-progress__label">' + UI.icon('flag', '', 16) + UI.t('map.progress') + '</span>' +
      '<strong data-progress-text>' + done + ' / 10</strong>' +
      '</div>' +
      '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' + done + '"' +
      ' aria-label="' + UI.esc(UI.t('map.progress')) + '"><span data-progress-bar style="width:' + pct + '%"></span></div>' +
      '<p class="map-progress__hint">' + UI.icon('sparkles', '', 14) + UI.esc(UI.t('map.playHint')) + '</p>' +
      '</div>' +

      '<div class="board-wrap">' +
      '<div class="board" id="board">' +
      '<svg class="board__route" id="boardRoute" aria-hidden="true" focusable="false"></svg>' +
      '<div class="board__avatar" id="boardAvatar" aria-hidden="true">' + window.Art.avatar(st.donorType) + '</div>' +
      '<span class="board__edge" id="routeStart">' + UI.icon('flag', '', 13) + UI.t('map.start') + '</span>' +
      '<span class="board__edge" id="routeEnd">' + UI.icon('check', '', 13) + UI.t('map.finish') + '</span>' +
      window.PAPData.stages.map(function (s) { return card(s.n); }).join('') +
      '</div>' +
      '</div>' +

      '<div class="map-foot">' +
      '<div class="legend">' +
      '<span class="legend__title">' + UI.icon('info', '', 15) + UI.t('map.legend') + '</span>' +
      '<span class="legend__item state--done">' + UI.icon('check', '', 13) + UI.t('map.done') + '</span>' +
      '<span class="legend__item state--active">' + UI.icon('play', '', 12) + UI.t('map.active') + '</span>' +
      '<span class="legend__item state--upcoming">' + UI.icon('flag', '', 12) + UI.t('map.upcoming') + '</span>' +
      '<span class="legend__sep"></span>' +
      '<span class="legend__item">' + UI.icon('check', '', 13) + UI.t('map.factShort') + '</span>' +
      '<span class="legend__item">' + UI.icon('sparkles', '', 13) + UI.t('map.simShort') + '</span>' +
      '</div>' +
      '<p class="map-foot__note">' + UI.icon('lock', '', 14) + UI.esc(UI.t('map.factNote')) + '</p>' +
      '<p class="map-foot__note map-foot__note--soft">' + UI.esc(UI.t('map.keyboardHint')) + '</p>' +
      '</div>' +
      '<span class="sr-only" data-selected-label>' + UI.esc(UI.t('map.selected') + ' : ' + level) + '</span>' +
      '</section>';
  }

  function mount(root) {
    var board = root.querySelector('#board');
    var svg = root.querySelector('#boardRoute');
    if (!board || !svg) return;
    var avatar = root.querySelector('#boardAvatar');

    geo.svg = svg;
    geo.path = null;
    computeGeometry(board, svg);

    window.addEventListener('resize', onResize);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(onResize);
      ro.observe(board);
      board._ro = ro;
    }

    root.querySelectorAll('.level').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pausePlayback(true);
        openDetail(Number(btn.getAttribute('data-level')));
      });
    });

    var playBtn = root.querySelector('#playJourney');
    var replayBtn = root.querySelector('#replayJourney');
    if (playBtn) playBtn.addEventListener('click', togglePlayback);
    if (replayBtn) replayBtn.addEventListener('click', function () { replay(); });

    // restore avatar position
    paintAvatar(currentProgress());
    updatePlayButton(root);

    if (Store.state.playback.playing && !reduceMotion()) {
      startPlayback(Store.state.playback.progress);
    }

    function onResize() {
      if (!document.body.contains(board)) {
        window.removeEventListener('resize', onResize);
        return;
      }
      computeGeometry(board, svg);
      paintAvatar(currentProgress());
    }
  }

  function computeGeometry(board, svg) {
    var cards = Array.prototype.slice.call(board.querySelectorAll('.level'));
    if (!cards.length) return;
    var br = board.getBoundingClientRect();
    var w = Math.max(1, Math.round(br.width));
    var h = Math.max(1, Math.round(br.height));
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    var points = cards.map(function (c) {
      var r = c.getBoundingClientRect();
      return {
        x: r.left - br.left + r.width / 2,
        y: r.top - br.top + r.height / 2,
        el: c,
        r: r
      };
    });

    // Catmull-Rom smoothing through the card centres.
    var d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i - 1] || points[i];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = points[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6;
      var c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6;
      var c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' +
        c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' +
        p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'route-path');
    path.setAttribute('fill', 'none');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(path);
    geo.path = path;
    geo.points = points;
    geo.total = path.getTotalLength();

    // Length at each card centre (sampled by projection).
    var samples = 240;
    var lens = new Array(points.length).fill(0);
    var best = new Array(points.length).fill(Infinity);
    for (var s = 0; s <= samples; s++) {
      var L = (s / samples) * geo.total;
      var pt = path.getPointAtLength(L);
      for (var k = 0; k < points.length; k++) {
        var dx = pt.x - points[k].x, dy = pt.y - points[k].y;
        var dist = dx * dx + dy * dy;
        if (dist < best[k]) { best[k] = dist; lens[k] = L; }
      }
    }
    geo.nodes = lens;

    // Arrow chevrons in the gaps + start/end dots.
    var decor = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    decor.setAttribute('class', 'route-decor');
    points.forEach(function (p, idx) {
      if (idx === points.length - 1) return;
      var mid = (lens[idx] + lens[idx + 1]) / 2;
      var a = path.getPointAtLength(Math.max(0, mid - 10));
      var b = path.getPointAtLength(Math.min(geo.total, mid + 10));
      var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      if (Math.abs(b.x - a.x) + Math.abs(b.y - a.y) < 2) return;
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ',' + b.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');
      var tri = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tri.setAttribute('d', 'M -3 -4 L 3 0 L -3 4 Z');
      tri.setAttribute('class', 'route-arrow');
      g.appendChild(tri);
      decor.appendChild(g);
    });
    svg.appendChild(decor);

    positionEdges(points);
  }

  function positionEdges(points) {
    var start = document.getElementById('routeStart');
    var end = document.getElementById('routeEnd');
    if (!start || !end || !points.length) return;
    var br = document.getElementById('board').getBoundingClientRect();
    var p0 = points[0], pl = points[points.length - 1];
    start.style.left = Math.max(8, p0.x - 44) + 'px';
    start.style.top = Math.max(0, p0.y - 34) + 'px';
    end.style.left = Math.max(8, Math.min(br.width - 110, pl.x - 44)) + 'px';
    // Keep the arrival badge below the last card so it never covers the stage title.
    end.style.top = Math.min(pl.r.bottom - br.top + 8, br.height - 34) + 'px';
  }

  function currentProgress() {
    return Math.min(1, Math.max(0, Store.state.playback.progress || play.progress || 0));
  }

  function paintAvatar(progress) {
    var avatar = document.getElementById('boardAvatar');
    if (!avatar || !geo.path || !geo.total) return;
    var L = Math.min(geo.total, Math.max(0, progress * geo.total));
    var pt = geo.path.getPointAtLength(L);
    avatar.style.transform = 'translate(' + pt.x + 'px,' + pt.y + 'px) translate(-50%,-58%)';
    avatar.style.opacity = '1';
    if (!play.playing) {
      var lvl = Store.currentLevel() - 1;
      if (progress <= 0.001 && geo.points[lvl]) {
        var p = geo.points[lvl];
        avatar.style.transform = 'translate(' + p.x + 'px,' + (p.y - 22) + 'px) translate(-50%,-58%)';
      }
    }
  }

  function levelAt(progress) {
    if (!geo.nodes.length) return 1;
    var L = progress * geo.total;
    var n = 1;
    for (var i = 0; i < geo.nodes.length; i++) {
      if (L >= geo.nodes[i] - 2) n = i + 1;
    }
    return n;
  }

  function updateCardsDuringPlay(activeN) {
    var cards = document.querySelectorAll('#board .level');
    cards.forEach(function (c) {
      var n = Number(c.getAttribute('data-level'));
      c.classList.toggle('is-travel', n === activeN);
    });
    var label = document.querySelector('[data-selected-label]');
    if (label) label.textContent = UI.t('map.selected') + ' : ' + UI.t('s' + activeN + '.title');
  }

  function togglePlayback() {
    if (play.playing) { pausePlayback(false); return; }
    if (reduceMotion()) { reducedPlay(); return; }
    startPlayback(currentProgress() >= 0.999 ? 0 : currentProgress());
  }

  function startPlayback(from) {
    if (!geo.path) return;
    play.playing = true;
    play.base = from || 0;
    play.startedAt = performance.now();
    play.duration = (1 - play.base) * Math.max(6000, Math.min(16000, geo.total * 7.5));
    play.remaining = play.duration;
    updatePlayButton(document);
    document.getElementById('board').classList.add('is-playing');
    tick(performance.now());
  }

  function tick(now) {
    if (!play.playing) return;
    var elapsed = now - play.startedAt;
    var p = play.base + (elapsed / Math.max(1, play.duration)) * (1 - play.base);
    if (p >= 1) p = 1;
    play.progress = p;
    Store.state.playback.progress = p;
    paintAvatar(p);
    updateCardsDuringPlay(levelAt(p));
    if (p >= 1) {
      play.playing = false;
      Store.state.playback.playing = false;
      Store.save();
      updatePlayButton(document);
      var b = document.getElementById('board');
      if (b) b.classList.remove('is-playing');
      updateCardsDuringPlay(10);
      UI.toast(UI.t('map.finish') + ' — ' + UI.t('s10.title'), 'success');
      return;
    }
    play.raf = requestAnimationFrame(tick);
  }

  function reducedPlay() {
    if (play.playing) return;
    play.playing = true;
    play.progress = 0;
    updatePlayButton(document);
    var board = document.getElementById('board');
    if (board) board.classList.add('is-playing');
    var i = 1;
    var cards = document.querySelectorAll('#board .level');
    function step() {
      if (!play.playing) return;
      updateCardsDuringPlay(i);
      play.progress = i / 10;
      Store.state.playback.progress = play.progress;
      var lvl = cards[i - 1];
      if (lvl) {
        var p = geo.points[i - 1];
        var av = document.getElementById('boardAvatar');
        if (av && p) {
          av.style.opacity = '1';
          av.style.transform = 'translate(' + p.x + 'px,' + (p.y - 22) + 'px) translate(-50%,-58%)';
        }
      }
      i++;
      if (i <= 10) stepTimer = setTimeout(step, 520);
      else {
        clearTimeout(stepTimer);
        play.playing = false;
        Store.state.playback.playing = false;
        Store.state.playback.progress = 1;
        Store.save();
        updatePlayButton(document);
        if (board) board.classList.remove('is-playing');
        UI.toast(UI.t('map.finish') + ' — ' + UI.t('s10.title'), 'success');
      }
    }
    step();
  }

  function pausePlayback(silent) {
    if (play.playing) {
      cancelAnimationFrame(play.raf);
      clearTimeout(stepTimer);
      play.playing = false;
      Store.state.playback.playing = false;
      Store.save();
      updatePlayButton(document);
      var b = document.getElementById('board');
      if (b) b.classList.remove('is-playing');
      document.querySelectorAll('#board .level.is-travel').forEach(function (c) { c.classList.remove('is-travel'); });
      if (!silent) UI.toast(UI.t('map.paused'), 'info', 2400);
    }
  }

  function replay() {
    pausePlayback(true);
    clearTimeout(stepTimer);
    Store.state.playback.progress = 0;
    Store.save();
    play.progress = 0;
    paintAvatar(0);
    document.querySelectorAll('#board .level.is-travel').forEach(function (c) { c.classList.remove('is-travel'); });
    if (reduceMotion()) reducedPlay();
    else startPlayback(0);
  }

  function updatePlayButton(scope) {
    var btn = (scope || document).querySelector('#playJourney');
    if (!btn) return;
    var ic = btn.querySelector('[data-play-icon]');
    var lb = btn.querySelector('[data-play-label]');
    if (ic) ic.innerHTML = play.playing ? UI.icon('pause', '', 18) : UI.icon('play', '', 18);
    if (lb) lb.textContent = play.playing ? UI.t('map.pause') : UI.t('map.play');
  }

  function openDetail(n) {
    var st = Store.state;
    var s = window.PAPData.stages[n - 1];
    var roles = s.roles.map(function (r) { return UI.roleChip(r); }).join('');
    var body = '' +
      '<div class="detail">' +
      '<div class="detail__visual">' + UI.scene(n, 'scene--detail') +
      '<div class="detail__avatar">' + window.Art.avatar(st.donorType) +
      '<span>' + UI.esc(UI.t('role.' + (st.donorType === 'company' ? 'company' : 'donor'))) + '</span></div>' +
      '</div>' +
      '<div class="detail__info">' +
      '<div class="detail__meta"><span class="step-badge">' + UI.t('u.step') + ' ' + n + '</span>' + UI.badge(s.tag) + '</div>' +
      '<h3 class="detail__title">' + UI.esc(UI.t(s.titleKey)) + '</h3>' +
      '<p class="detail__sub">' + UI.esc(UI.t(s.subKey)) + '</p>' +
      '<div class="detail__block"><h4>' + UI.icon('info', '', 15) + UI.t('map.detailWhat') + '</h4><p>' + UI.esc(UI.t(s.whatKey)) + '</p></div>' +
      '<div class="detail__block"><h4>' + UI.icon('user', '', 15) + UI.t('map.detailWho') + '</h4><div class="role-chips">' + roles + '</div>' +
      '<p class="muted">' + UI.esc(UI.t(s.whoKey)) + '</p></div>' +
      '<div class="detail__flow">' +
      '<div><span class="flow-label flow-label--out">' + UI.icon('arrow-right', '', 14) + UI.t('map.sent') + '</span><p>' + UI.esc(UI.t(s.sent)) + '</p></div>' +
      '<div><span class="flow-label flow-label--in">' + UI.icon('arrow-left', '', 14) + UI.t('map.received') + '</span><p>' + UI.esc(UI.t(s.received)) + '</p></div>' +
      '</div>' +
      '<p class="detail__note">' + UI.esc(UI.t(s.note)) + '</p>' +
      '</div></div>';

    UI.dialog({
      wide: true,
      eyebrow: UI.t('map.selected') + ' · ' + UI.t('u.step') + ' ' + n + ' / 10',
      title: UI.t(s.titleKey),
      body: body,
      actions: [
        { label: UI.t('c.backToMap'), kind: 'ghost', value: 'close' },
        {
          label: UI.t('map.open'), kind: 'primary', icon: 'arrow-right',
          onClick: function (close) {
            close('open');
            setTimeout(function () { window.App.go('stage', { n: n }); }, 120);
          }
        }
      ],
      onClose: function (value) {
        if (value === 'open') return;
        var st2 = Store.state;
        st2.selectedLevel = n;
        Store.save();
      }
    });
  }

  window.ScreenMap = { render: render, mount: mount, pause: function () { pausePlayback(true); } };
})();
