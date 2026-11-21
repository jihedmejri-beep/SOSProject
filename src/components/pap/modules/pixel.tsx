// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/pixel.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   PAP Interactive Journey — pixel-art engine
   Only the six official colours are used (+ derived transparencies).
   Every sprite is drawn on an integer grid with crisp edges.
   ============================================================ */
(function () {
  'use strict';

  var COLORS = {
    n: '#1D3768', // navy
    c: '#08A9E0', // cyan
    r: '#E2556A', // coral
    l: '#CFEAF5', // light blue
    p: '#EFFAFF', // very pale blue
    w: '#FFFFFF'  // white
  };

  // Derived tints only: same six colours, lower alpha.
  var ALPHA = {
    o: ['#1D3768', 0.14],
    m: ['#1D3768', 0.34],
    g: ['#1D3768', 0.55],
    s: ['#08A9E0', 0.55],
    k: ['#08A9E0', 0.26],
    q: ['#E2556A', 0.42],
    h: ['#FFFFFF', 0.55]
  };

  var DIGITS = {
    '0': ['111', '101', '101', '101', '111'],
    '1': ['010', '110', '010', '010', '111'],
    '2': ['111', '001', '111', '100', '111'],
    '3': ['111', '001', '111', '001', '111'],
    '4': ['101', '101', '111', '001', '001'],
    '5': ['111', '100', '111', '001', '111'],
    '6': ['111', '100', '111', '101', '111'],
    '7': ['111', '001', '001', '010', '010'],
    '8': ['111', '101', '111', '101', '111'],
    '9': ['111', '101', '111', '001', '111'],
    '+': ['000', '010', '111', '010', '000'],
    '-': ['000', '000', '111', '000', '000'],
    '/': ['001', '001', '010', '100', '100'],
    ':': ['000', '010', '000', '010', '000'],
    '.': ['000', '000', '000', '000', '010'],
    ' ': ['000', '000', '000', '000', '000']
  };

  function fillOf(k) {
    if (COLORS[k]) return { fill: COLORS[k], op: 1 };
    if (ALPHA[k]) return { fill: ALPHA[k][0], op: ALPHA[k][1] };
    return null;
  }

  function clampInt(v) { return Math.round(v); }

  function Sprite(w, h) {
    this.w = w;
    this.h = h;
    this.ops = [];
  }

  Sprite.prototype.rect = function (x, y, w, h, k) {
    if (!fillOf(k) || w <= 0 || h <= 0) return this;
    this.ops.push([clampInt(x), clampInt(y), clampInt(w), clampInt(h), k]);
    return this;
  };

  Sprite.prototype.px = function (x, y, k) {
    return this.rect(x, y, 1, 1, k);
  };

  Sprite.prototype.box = function (x, y, w, h, fill, border) {
    this.rect(x, y, w, h, fill);
    if (border) {
      this.rect(x, y, w, 1, border);
      this.rect(x, y + h - 1, w, 1, border);
      this.rect(x, y, 1, h, border);
      this.rect(x + w - 1, y, 1, h, border);
    }
    return this;
  };

  // Blocky rounded rectangle (integer pixel steps).
  Sprite.prototype.round = function (x, y, w, h, r, k) {
    for (var j = 0; j < r; j++) {
      var inset = r - Math.floor(Math.sqrt(Math.max(0, r * r - (r - 1 - j) * (r - 1 - j))));
      this.rect(x + inset, y + j, w - inset * 2, 1, k);
      this.rect(x + inset, y + h - 1 - j, w - inset * 2, 1, k);
    }
    if (h - 2 * r > 0) this.rect(x, y + r, w, h - 2 * r, k);
    return this;
  };

  Sprite.prototype.circle = function (cx, cy, r, k) {
    for (var dy = -r; dy <= r; dy++) {
      var hw = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)));
      this.rect(cx - hw, cy + dy, hw * 2 + 1, 1, k);
    }
    return this;
  };

  Sprite.prototype.ring = function (cx, cy, r, t, k) {
    for (var dy = -r; dy <= r; dy++) {
      var ow = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)));
      var inner = r - t;
      var iw = Math.abs(dy) <= inner ? Math.floor(Math.sqrt(Math.max(0, inner * inner - dy * dy))) : -1;
      if (iw < 0) {
        this.rect(cx - ow, cy + dy, ow * 2 + 1, 1, k);
      } else {
        this.rect(cx - ow, cy + dy, ow - iw, 1, k);
        this.rect(cx + iw + 1, cy + dy, ow - iw, 1, k);
      }
    }
    return this;
  };

  Sprite.prototype.line = function (x1, y1, x2, y2, k) {
    var dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    var dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
    var err = dx + dy;
    for (;;) {
      this.px(x1, y1, k);
      if (x1 === x2 && y1 === y2) break;
      var e2 = 2 * err;
      if (e2 >= dy) { err += dy; x1 += sx; }
      if (e2 <= dx) { err += dx; y1 += sy; }
    }
    return this;
  };

  Sprite.prototype.digits = function (str, x, y, scale, k) {
    var cx = x;
    for (var i = 0; i < str.length; i++) {
      var glyph = DIGITS[str.charAt(i)];
      if (glyph) {
        for (var gy = 0; gy < 5; gy++) {
          for (var gx = 0; gx < 3; gx++) {
            if (glyph[gy].charAt(gx) === '1') {
              this.rect(cx + gx * scale, y + gy * scale, scale, scale, k);
            }
          }
        }
      }
      cx += 4 * scale;
    }
    return this;
  };

  Sprite.prototype.svg = function (extraClass, label) {
    var out = [];
    for (var i = 0; i < this.ops.length; i++) {
      var o = this.ops[i];
      var f = fillOf(o[4]);
      if (!f) continue;
      out.push('<rect x="' + o[0] + '" y="' + o[1] + '" width="' + o[2] +
        '" height="' + o[3] + '"' + (f.op < 1 ? ' fill-opacity="' + f.op + '"' : '') +
        ' fill="' + f.fill + '"/>');
    }
    return '<svg class="pix ' + (extraClass || '') + '" viewBox="0 0 ' + this.w + ' ' + this.h +
      '" shape-rendering="crispEdges" focusable="false" ' +
      (label ? 'role="img" aria-label="' + label.replace(/"/g, '&quot;') + '"' : 'aria-hidden="true"') +
      '>' + out.join('') + '</svg>';
  };

  /* ---------- shared scene helpers ---------- */

  function frame(s, groundY) {
    s.round(1, 1, 26, 19, 2, 'l');
    for (var yy = 4; yy < 19; yy += 4) {
      for (var xx = 3; xx < 26; xx += 4) s.px(xx, yy, 'p');
    }
    s.rect(3, groundY, 22, 1, 'm');
    s.rect(5, groundY + 1, 18, 1, 'o');
    return s;
  }

  function part(svg, cls, left, top, width) {
    return '<span class="scene-part ' + cls + '" style="left:' + left + '%;top:' + top +
      '%;width:' + width + '%">' + svg + '</span>';
  }

  window.Pixel = {
    Sprite: Sprite,
    colors: COLORS,
    frame: frame,
    part: part,
    // Small reusable sprites used as animated scene parts
    pen: function () {
      var s = new Sprite(9, 11);
      for (var i = 0; i < 6; i++) {
        s.rect(1 + i, 9 - i, 3, 2, 'n');
        s.rect(2 + i, 9 - i, 2, 1, 'w');
      }
      s.rect(5, 4, 3, 2, 'c');
      s.rect(1, 9, 2, 1, 'r');
      s.rect(0, 10, 1, 1, 'r');
      return s.svg('pix--pen');
    },
    coin: function () {
      var s = new Sprite(7, 7);
      s.circle(3, 3, 3, 'n');
      s.circle(3, 3, 2, 'c');
      s.rect(2, 2, 1, 1, 'w');
      s.px(3, 3, 'r');
      return s.svg();
    },
    gear: function () {
      var s = new Sprite(13, 13);
      s.ring(6, 6, 6, 2, 'n');
      s.ring(6, 6, 5, 1, 'c');
      [[5, 0], [5, 11], [0, 5], [11, 5], [1, 1], [10, 1], [1, 10], [10, 10]].forEach(function (p) {
        s.rect(p[0], p[1], 2, 2, 'n');
      });
      s.circle(6, 6, 2, 'w');
      return s.svg();
    },
    bell: function () {
      var s = new Sprite(9, 9);
      s.rect(4, 0, 1, 1, 'r');
      s.rect(3, 1, 3, 1, 'n');
      s.rect(2, 2, 5, 1, 'n');
      s.rect(1, 3, 7, 4, 'n');
      s.rect(2, 4, 5, 3, 'r');
      s.rect(0, 7, 9, 1, 'n');
      s.rect(3, 8, 3, 1, 'n');
      return s.svg();
    },
    flag: function () {
      var s = new Sprite(10, 8);
      s.rect(0, 0, 9, 6, 'r');
      s.rect(0, 2, 9, 1, 'w');
      s.rect(8, 0, 1, 6, 'n');
      s.rect(0, 6, 2, 1, 'r');
      return s.svg();
    }
  };
})();

}
