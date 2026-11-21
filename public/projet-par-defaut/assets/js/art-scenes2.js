/* ============================================================
   Pixel scenes for levels 6–10
   ============================================================ */
(function () {
  'use strict';
  var P = window.Pixel, Sprite = P.Sprite, frame = P.frame, part = P.part;
  var scenes = window.ArtScenes;

  /* 6 — monthly history */
  scenes[6] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.box(4, 3, 20, 15, 'w', 'n');
    s.rect(5, 4, 18, 3, 'c');
    s.rect(6, 5, 5, 1, 'w');
    s.rect(12, 5, 2, 1, 'r');
    s.rect(19, 2, 1, 2, 'n');
    s.rect(9, 2, 1, 2, 'n');
    var cols = [6, 9, 12, 15, 18, 21];
    var rows = [8, 11, 14, 17];
    var checks = [[0, 0], [1, 0], [1, 2], [3, 1], [4, 1], [5, 2], [4, 2]];
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < cols.length; c++) {
        s.rect(cols[c], rows[r], 2, 2, 'p');
      }
    }
    checks.forEach(function (pt) {
      s.rect(cols[pt[0]], rows[pt[1]], 2, 2, 'c');
      s.px(cols[pt[0]] + 1, rows[pt[1]], 'w');
    });
    s.rect(cols[2], rows[3], 2, 2, 'r');
    s.px(cols[2], rows[3], 'w'); s.px(cols[2] + 1, rows[3] + 1, 'w');
    s.rect(5, 17, 4, 1, 'm');
    return { svg: s.svg('scene-svg'), parts: part(checkSprite(), 'anim-check', 70, 15, 9) };
  };

  function checkSprite() {
    var s = new Sprite(7, 7);
    s.rect(1, 3, 2, 2, 'c');
    s.rect(3, 5, 2, 2, 'c');
    s.rect(5, 1, 2, 2, 'c');
    return s.svg();
  }

  /* 7 — payment incident + second attempt calendar */
  scenes[7] = function () {
    var s = new Sprite(28, 21);
    frame(s, 18);
    var i, w;
    for (i = 0; i < 8; i++) {
      w = 1 + i * 2;
      s.rect(9 - i, 5 + i, w, 1, 'r');
    }
    s.rect(8, 8, 2, 4, 'w');
    s.rect(8, 13, 2, 2, 'w');
    s.box(17, 7, 9, 10, 'w', 'n');
    s.rect(18, 8, 7, 2, 'r');
    s.digits('5', 20, 11, 1, 'n');
    s.rect(19, 11, 1, 1, 'm');
    s.rect(17, 17, 9, 1, 'o');
    s.rect(2, 3, 1, 1, 'c');
    s.px(3, 2, 'c');
    return { svg: s.svg('scene-svg'), parts: part(P.bell(), 'anim-bell', 64, 18, 20) };
  };

  /* 8 — modification / settings */
  scenes[8] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.circle(8, 10, 7, 'n');
    s.circle(8, 10, 5, 'c');
    s.circle(8, 10, 2, 'w');
    s.circle(8, 10, 1, 'p');
    [[7, 1], [7, 18], [0, 9], [15, 9]].forEach(function (p) { s.rect(p[0], p[1], 2, 2, 'n'); });
    s.rect(15, 4, 11, 13, 'w');
    s.rect(15, 4, 11, 1, 'n');
    s.rect(15, 16, 11, 1, 'n');
    s.rect(25, 4, 1, 13, 'n');
    s.rect(15, 4, 1, 13, 'n');
    s.rect(16, 5, 9, 2, 'c');
    var rows = [9, 12, 15];
    rows.forEach(function (y, i) {
      s.rect(17, y, 7, 1, 'l');
      var knob = [18, 21, 19][i];
      s.rect(knob, y - 1, 2, 3, i === 1 ? 'r' : 'n');
    });
    return { svg: s.svg('scene-svg'), parts: part(P.gear(), 'anim-gear', 55, 22, 22) };
  };

  /* 9 — temporary pause */
  scenes[9] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.round(3, 2, 14, 14, 2, 'n');
    s.rect(7, 6, 2, 7, 'c');
    s.rect(11, 6, 2, 7, 'c');
    s.rect(3, 16, 14, 1, 'o');
    s.box(18, 5, 8, 12, 'w', 'n');
    s.rect(19, 6, 6, 2, 'c');
    s.rect(20, 10, 4, 1, 'm');
    s.rect(20, 12, 3, 1, 'm');
    s.rect(19, 14, 6, 2, 'q');
    s.circle(23, 8, 2, 'k');
    s.circle(26, 17, 1, 'q');
    return { svg: s.svg('scene-svg'), parts: '' };
  };

  /* 10 — finish flag and journey summary */
  scenes[10] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.rect(5, 3, 1, 15, 'n');
    s.rect(4, 18, 3, 1, 'n');
    s.rect(6, 3, 2, 1, 'r');
    s.rect(3, 18, 22, 1, 'n');
    for (var x = 3; x < 25; x += 2) {
      s.rect(x, 18, 1, 1, 'w');
      s.rect(x + 1, 17, 1, 1, 'n');
    }
    // trophy
    s.rect(17, 7, 8, 4, 'c');
    s.rect(17, 11, 8, 1, 'n');
    s.rect(18, 12, 6, 1, 'c');
    s.rect(20, 13, 2, 2, 'c');
    s.rect(18, 15, 6, 1, 'n');
    s.rect(16, 8, 1, 2, 'n');
    s.rect(25, 8, 1, 2, 'n');
    s.rect(21, 8, 1, 2, 'w');
    s.rect(1, 6, 1, 1, 'c');
    s.rect(3, 10, 1, 1, 'r');
    s.rect(26, 5, 1, 1, 'c');
    s.rect(14, 2, 1, 1, 'r');
    return { svg: s.svg('scene-svg'), parts: part(P.flag(), 'anim-flag', 21, 10, 33) };
  };

  window.ArtScenes = scenes;
})();
