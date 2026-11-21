/* ============================================================
   Actors: donor avatars, generic role icons, brand mark
   All illustrations are original and generic — no official logo.
   ============================================================ */
(function () {
  'use strict';
  var Sprite = window.Pixel.Sprite;

  function individual() {
    var s = new Sprite(18, 22);
    s.rect(4, 20, 10, 1, 'o');
    s.rect(6, 16, 2, 3, 'n');
    s.rect(10, 16, 2, 3, 'n');
    s.rect(5, 19, 3, 1, 'n');
    s.rect(10, 19, 3, 1, 'n');
    s.round(5, 9, 8, 8, 1, 'c');
    s.rect(8, 9, 2, 2, 'w');
    s.rect(7, 11, 1, 1, 'r'); s.rect(9, 11, 1, 1, 'r');
    s.rect(7, 12, 4, 1, 'r'); s.rect(8, 13, 2, 1, 'r');
    s.rect(4, 11, 1, 4, 'l');
    s.rect(13, 11, 1, 4, 'l');
    s.circle(9, 6, 4, 'l');
    s.rect(5, 2, 8, 2, 'n');
    s.rect(5, 4, 1, 2, 'n');
    s.rect(12, 4, 1, 2, 'n');
    s.rect(7, 6, 1, 1, 'n');
    s.rect(10, 6, 1, 1, 'n');
    s.rect(8, 8, 2, 1, 'r');
    s.rect(4, 5, 1, 2, 'l');
    s.rect(13, 5, 1, 2, 'l');
    return s.svg('avatar avatar--individual');
  }

  function company() {
    var s = new Sprite(20, 22);
    s.rect(3, 20, 16, 1, 'o');
    s.box(3, 4, 14, 16, 'w', 'n');
    s.rect(2, 2, 16, 3, 'n');
    s.rect(4, 5, 12, 4, 'c');
    s.rect(6, 6, 2, 2, 'w');
    s.rect(12, 6, 2, 2, 'w');
    s.rect(6, 7, 1, 1, 'n');
    s.rect(12, 7, 1, 1, 'n');
    s.rect(8, 8, 4, 1, 'w');
    s.rect(5, 11, 2, 2, 'l');
    s.rect(9, 11, 2, 2, 'l');
    s.rect(13, 11, 2, 2, 'l');
    s.rect(5, 14, 2, 2, 'l');
    s.rect(13, 14, 2, 2, 'l');
    s.rect(9, 14, 2, 3, 'r');
    s.rect(9, 16, 2, 4, 'c');
    s.rect(18, 0, 1, 9, 'n');
    s.rect(18, 0, 1, 1, 'n');
    s.rect(18, 1, 4, 3, 'r');
    s.rect(18, 15, 1, 1, 'l');
    return s.svg('avatar avatar--company');
  }

  var roles = {
    person: function () {
      var s = new Sprite(16, 16);
      s.circle(8, 5, 3, 'l');
      s.rect(5, 2, 7, 1, 'n');
      s.rect(7, 4, 1, 1, 'n');
      s.rect(10, 4, 1, 1, 'n');
      s.rect(5, 9, 7, 5, 'c');
      s.rect(3, 10, 2, 3, 'l');
      s.rect(11, 10, 2, 3, 'l');
      s.rect(6, 14, 2, 2, 'n');
      s.rect(9, 14, 2, 2, 'n');
      return s.svg('role-icon');
    },
    company: function () {
      var s = new Sprite(16, 16);
      s.rect(2, 3, 12, 2, 'n');
      s.box(3, 5, 10, 10, 'w', 'n');
      s.rect(4, 6, 8, 3, 'c');
      s.rect(5, 7, 2, 1, 'w');
      s.rect(9, 7, 2, 1, 'w');
      s.rect(4, 10, 2, 2, 'l');
      s.rect(7, 10, 2, 2, 'l');
      s.rect(10, 10, 2, 3, 'r');
      s.rect(4, 13, 2, 2, 'l');
      return s.svg('role-icon');
    },
    sos: function () {
      var s = new Sprite(16, 16);
      s.rect(2, 6, 12, 1, 'n');
      s.rect(3, 5, 10, 1, 'n');
      s.rect(4, 4, 8, 1, 'n');
      s.rect(5, 3, 6, 1, 'n');
      s.box(4, 7, 8, 8, 'w', 'n');
      s.rect(3, 14, 10, 1, 'n');
      s.rect(6, 9, 1, 1, 'r'); s.rect(9, 9, 1, 1, 'r');
      s.rect(6, 10, 4, 1, 'r');
      s.rect(7, 11, 2, 1, 'r');
      s.rect(7, 13, 2, 2, 'c');
      return s.svg('role-icon');
    },
    bank: function () {
      var s = new Sprite(16, 16);
      s.rect(3, 4, 10, 1, 'n');
      s.rect(4, 3, 8, 1, 'n');
      s.rect(5, 2, 6, 1, 'n');
      s.rect(2, 5, 12, 1, 'c');
      s.rect(3, 6, 1, 7, 'n');
      s.rect(6, 6, 1, 7, 'n');
      s.rect(9, 6, 1, 7, 'n');
      s.rect(12, 6, 1, 7, 'n');
      s.rect(2, 13, 12, 1, 'n');
      s.rect(2, 14, 12, 1, 'l');
      return s.svg('role-icon');
    },
    village: function () {
      var s = new Sprite(16, 16);
      s.rect(1, 9, 2, 1, 'n');
      s.rect(2, 8, 4, 1, 'n');
      s.box(2, 9, 4, 5, 'w', 'n');
      s.rect(3, 11, 1, 1, 'c');
      s.rect(8, 7, 1, 1, 'n');
      s.rect(9, 6, 4, 1, 'n');
      s.box(8, 7, 6, 7, 'w', 'n');
      s.rect(10, 10, 2, 4, 'c');
      s.rect(13, 13, 1, 1, 'r');
      s.rect(14, 14, 1, 1, 'n');
      s.rect(0, 14, 16, 1, 'n');
      return s.svg('role-icon');
    },
    notify: function () {
      var s = new Sprite(16, 16);
      s.rect(4, 1, 8, 14, 'n');
      s.rect(5, 3, 6, 10, 'w');
      s.rect(7, 5, 2, 2, 'c');
      s.rect(6, 8, 4, 1, 'l');
      s.rect(6, 10, 3, 1, 'l');
      s.rect(6, 13, 4, 1, 'l');
      s.rect(14, 2, 2, 2, 'r');
      return s.svg('role-icon');
    },
    doc: function () {
      var s = new Sprite(16, 16);
      s.box(3, 2, 10, 13, 'w', 'n');
      s.rect(4, 3, 8, 2, 'c');
      s.rect(5, 7, 6, 1, 'm');
      s.rect(5, 9, 4, 1, 'm');
      s.rect(5, 11, 6, 1, 'm');
      s.rect(11, 3, 1, 1, 'r');
      return s.svg('role-icon');
    }
  };

  window.Art = {
    avatar: function (type) { return type === 'company' ? company() : individual(); },
    role: function (name) { return roles[name] ? roles[name]() : roles.person(); },
    brand: function () {
      var s = new Sprite(16, 16);
      s.rect(3, 2, 4, 1, 'c'); s.rect(9, 2, 4, 1, 'c');
      s.rect(2, 3, 12, 4, 'c');
      s.rect(2, 7, 4, 2, 'c'); s.rect(10, 7, 4, 2, 'c');
      s.rect(3, 9, 2, 2, 'c'); s.rect(11, 9, 2, 2, 'c');
      s.rect(4, 11, 2, 2, 'c'); s.rect(10, 11, 2, 2, 'c');
      s.rect(6, 13, 4, 1, 'c');
      s.rect(5, 4, 2, 2, 'w');
      s.rect(9, 9, 2, 2, 'r');
      return s.svg('brand-mark');
    }
  };
})();
