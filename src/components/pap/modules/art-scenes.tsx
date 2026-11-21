// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/art-scenes.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   Pixel scenes for levels 1–5 (each one is visually unique)
   ============================================================ */
(function () {
  'use strict';
  var P = window.Pixel, Sprite = P.Sprite, frame = P.frame, part = P.part;
  var scenes = {};

  /* 1 — PAP form, pen and signature */
  scenes[1] = function () {
    var s = new Sprite(28, 21);
    frame(s, 18);
    s.rect(7, 4, 16, 14, 'o');            // paper shadow
    s.box(5, 3, 16, 14, 'w', 'n');        // paper
    s.rect(6, 4, 14, 3, 'c');             // header band
    s.rect(7, 5, 6, 1, 'w');
    s.rect(15, 5, 3, 1, 'r');
    s.rect(7, 9, 10, 1, 'm');
    s.rect(7, 11, 7, 1, 'm');
    s.rect(7, 13, 10, 1, 'm');
    s.box(7, 15, 3, 3, 'p', 'n');         // consent checkbox
    s.rect(7, 16, 1, 1, 'c');
    s.rect(8, 17, 1, 1, 'c');
    s.rect(9, 16, 1, 1, 'c');
    s.rect(12, 16, 7, 1, 'n');            // signature line
    s.px(13, 15, 'c'); s.px(14, 16, 'c'); s.px(15, 15, 'c'); s.px(16, 16, 'c');
    s.circle(23, 16, 2, 'q');
    s.digits('25', 2, 3, 1, 'n');
    return {
      svg: s.svg('scene-svg'),
      parts: part(P.pen(), 'anim-pen', 63, 34, 26)
    };
  };

  /* 2 — confirmation chat message */
  scenes[2] = function () {
    var s = new Sprite(28, 21);
    frame(s, 18);
    s.round(3, 3, 22, 11, 2, 'n');        // bubble outline
    s.round(4, 4, 20, 9, 1, 'w');         // bubble body
    s.rect(6, 6, 7, 1, 'n');              // sender line
    s.rect(6, 8, 15, 1, 'm');
    s.rect(6, 10, 12, 1, 'm');
    s.rect(6, 12, 9, 1, 'm');
    s.rect(8, 14, 3, 1, 'n');             // tail
    s.rect(8, 15, 2, 1, 'n');
    s.rect(8, 16, 1, 1, 'n');
    s.rect(18, 11, 1, 1, 'c');            // read receipts
    s.rect(19, 12, 1, 1, 'c');
    s.rect(20, 11, 1, 1, 'c');
    s.rect(21, 10, 2, 1, 'c');
    s.rect(21, 6, 1, 1, 'r');             // little heart
    s.rect(23, 6, 1, 1, 'r');
    s.rect(21, 7, 3, 1, 'r');
    s.rect(22, 8, 1, 1, 'r');
    s.circle(4, 5, 2, 's');
    s.circle(25, 17, 2, 's');
    return { svg: s.svg('scene-svg'), parts: '' };
  };

  /* 3 — administrative clipboard and checklist */
  scenes[3] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.round(6, 2, 16, 17, 1, 'n');        // clipboard board
    s.rect(10, 1, 8, 3, 'c');             // clip
    s.rect(12, 2, 4, 1, 'n');
    s.rect(11, 0, 6, 1, 'c');
    s.box(8, 5, 12, 13, 'w', 'l');        // paper sheet
    var i, y;
    for (i = 0; i < 6; i++) {
      y = 6 + i * 2;
      s.box(9, y, 2, 2, 'p', 'l');
      s.rect(12, y, 6, 1, 'm');
    }
    for (i = 0; i < 3; i++) {             // three validated lines
      y = 6 + i * 2;
      s.px(9, y + 1, 'c'); s.px(10, y, 'c');
    }
    s.rect(18, 13, 1, 3, 'r');            // coral priority flag
    s.rect(18, 13, 3, 2, 'r');
    s.circle(24, 5, 2, 'k');
    return { svg: s.svg('scene-svg'), parts: part(checkSprite(), 'anim-check', 27, 24, 9) };
  };

  function checkSprite() {
    var s = new Sprite(7, 7);
    s.rect(1, 3, 2, 2, 'c');
    s.rect(3, 5, 2, 2, 'c');
    s.rect(5, 1, 2, 2, 'c');
    return s.svg();
  }

  /* 4 — SOS ↔ fictional bank connection */
  scenes[4] = function () {
    var s = new Sprite(28, 21);
    frame(s, 17);
    // fictional bank (generic columns, no logo)
    s.rect(2, 7, 11, 1, 'n');
    s.rect(3, 6, 9, 1, 'n');
    s.rect(4, 5, 7, 1, 'n');
    s.rect(2, 8, 11, 8, 'w');
    s.rect(2, 8, 11, 1, 'n');
    s.rect(2, 15, 11, 1, 'n');
    s.rect(4, 10, 1, 5, 'n');
    s.rect(6, 10, 1, 5, 'n');
    s.rect(8, 10, 1, 5, 'n');
    s.rect(10, 10, 1, 5, 'n');
    s.rect(2, 9, 11, 1, 'c');
    // supported village house (generic symbol)
    s.rect(17, 10, 10, 1, 'n');
    s.rect(18, 9, 8, 1, 'n');
    s.rect(19, 8, 6, 1, 'n');
    s.rect(20, 7, 4, 1, 'n');
    s.box(18, 10, 8, 7, 'w', 'n');
    s.rect(21, 13, 2, 4, 'c');
    s.rect(19, 12, 1, 1, 'l');
    s.rect(24, 12, 1, 1, 'l');
    s.rect(21, 11, 2, 1, 'r');
    s.rect(20, 12, 4, 1, 'r');
    s.rect(21, 13, 2, 1, 'r');
    // connecting wire
    s.rect(13, 12, 1, 1, 'c');
    s.rect(15, 12, 1, 1, 'c');
    s.rect(14, 11, 1, 1, 'k');
    s.digits('1', 15, 4, 1, 'n');
    s.circle(15, 6, 2, 's');
    return {
      svg: s.svg('scene-svg'),
      parts: part(P.coin(), 'anim-token', 45, 46, 15)
    };
  };

  /* 5 — first debit on the 25th */
  scenes[5] = function () {
    var s = new Sprite(28, 21);
    frame(s, 19);
    s.rect(9, 2, 1, 2, 'n');
    s.rect(18, 2, 1, 2, 'n');
    s.box(5, 3, 18, 16, 'w', 'n');
    s.rect(6, 4, 16, 3, 'c');
    s.rect(7, 5, 6, 1, 'w');
    s.rect(19, 5, 2, 1, 'w');
    s.round(7, 8, 14, 10, 1, 'r');
    s.digits('25', 9, 10, 2, 'w');
    s.rect(6, 18, 16, 1, 'o');
    s.circle(25, 18, 2, 'k');
    return {
      svg: s.svg('scene-svg'),
      parts: part(P.coin(), 'anim-coin-drop', 8, 60, 12)
    };
  };

  window.ArtScenes = scenes;
})();

}
