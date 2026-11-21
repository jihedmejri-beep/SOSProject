// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/state.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   Simulation state — local only, persisted in localStorage
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'pap-journey-v1';
  var STAGES = 10;

  function defaultForm() {
    return {
      type: 'individual',
      name: '',
      profession: '',
      address: '',
      phone: '',
      email: '',
      amount: 60,
      village: 'Gammarth',
      rib: '',
      firstMonth: '2026-02',
      accepted: false,
      signature: ''
    };
  }

  function defaultMonths() {
    return window.PAPData.monthKeys.map(function (key, i) {
      return {
        key: key,
        status: 'pending',
        amount: null,
        ref: null,
        date: key + '-25',
        simulated: false,
        historical: false,
        index: i
      };
    });
  }

  function fresh() {
    return {
      v: 1,
      lang: 'fr',
      donorType: 'individual',
      screen: 'map',
      selectedLevel: null,
      form: defaultForm(),
      submitted: false,
      confirmed: null,
      cancelled: false,
      checkpoints: 0,
      activated: false,
      registrationDate: null,
      firstDebitDate: '2026-01-25',
      months: defaultMonths(),
      selectedMonth: '2026-06',
      incidents: { first: null, second: null, at: null },
      modifications: [],
      suspended: false,
      suspendedOnce: false,
      suspendedAt: null,
      termination: null,
      messages: [],
      playback: { playing: false, progress: 0 },
      completed: [],
      historySeeded: false
    };
  }

  var listeners = [];

  function load() {
    var base = fresh();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1) return base;
      // shallow-safe merge with defaults
      var merged = Object.assign(base, parsed);
      merged.form = Object.assign(defaultForm(), parsed.form || {});
      merged.incidents = Object.assign({ first: null, second: null, at: null }, parsed.incidents || {});
      if (!Array.isArray(merged.months) || merged.months.length !== 12) merged.months = defaultMonths();
      if (!Array.isArray(merged.messages)) merged.messages = [];
      if (!Array.isArray(merged.completed)) merged.completed = [];
      merged.playback = { playing: false, progress: merged.playback ? merged.playback.progress || 0 : 0 };
      return merged;
    } catch (e) {
      return base;
    }
  }

  var Store = {
    state: null,
    subscribers: listeners,

    init: function () {
      this.state = load();
      this.save();
      return this.state;
    },

    save: function () {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.state));
      } catch (e) { /* storage full or disabled: simulation still works */ }
    },

    set: function (patch) {
      Object.assign(this.state, patch);
      this.save();
      this.emit();
    },

    emit: function () {
      listeners.forEach(function (fn) { fn(Store.state); });
    },

    on: function (fn) { listeners.push(fn); },

    reset: function () {
      var lang = this.state.lang;
      var donorType = this.state.donorType;
      this.state = fresh();
      this.state.lang = lang;
      this.state.donorType = donorType;
      this.state.form.type = donorType;
      this.save();
      this.emit();
    },

    currentLevel: function () {
      for (var i = 1; i <= STAGES; i++) {
        if (this.state.completed.indexOf(i) === -1) return i;
      }
      return STAGES;
    },

    isDone: function (n) { return this.state.completed.indexOf(n) !== -1; },

    complete: function (n) {
      if (this.state.completed.indexOf(n) === -1) {
        this.state.completed.push(n);
        this.state.completed.sort(function (a, b) { return a - b; });
        this.save();
        this.emit();
      }
    },

    setLang: function (lang) {
      this.state.lang = lang;
      this.save();
      this.emit();
    },

    setDonorType: function (type) {
      this.state.donorType = type;
      this.state.form.type = type;
      this.save();
      this.emit();
    },

    addMessage: function (type, params) {
      var msg = {
        id: 'm' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        type: type,
        params: params || {},
        at: new Date().toISOString(),
        read: false
      };
      this.state.messages.unshift(msg);
      this.save();
      this.emit();
      return msg;
    },

    unreadCount: function () {
      return this.state.messages.filter(function (m) { return !m.read; }).length;
    },

    markAllRead: function () {
      this.state.messages.forEach(function (m) { m.read = true; });
      this.save();
      this.emit();
    },

    clearMessages: function () {
      this.state.messages = [];
      this.save();
      this.emit();
    },

    ensureHistory: function () {
      var self = this;
      if (this.state.historySeeded) return;
      this.state.historySeeded = true;
      this.state.months.forEach(function (m, i) {
        if (i < 5) {
          m.status = 'paid';
          m.amount = self.state.form.amount || 60;
          m.ref = 'TX-2026-' + String(1041 + i);
          m.historical = true;
          m.simulated = true;
        }
      });
      if (!this.state.registrationDate) {
        this.state.registrationDate = '2026-01-12';
      }
      this.save();
      this.emit();
    },

    markMonthPaid: function (index) {
      var m = this.state.months[index];
      if (!m) return;
      m.status = 'paid';
      m.amount = this.state.form.amount || 60;
      m.ref = 'TX-2026-' + String(1041 + index);
      m.simulated = true;
      this.save();
      this.emit();
    },

    paidMonths: function () {
      return this.state.months.filter(function (m) { return m.status === 'paid'; });
    },

    totalPaid: function () {
      return this.paidMonths().reduce(function (sum, m) { return sum + (Number(m.amount) || 0); }, 0);
    },

    progress: function () {
      return this.state.completed.length;
    },

    seedDemoMessages: function () {
      var st = this.state;
      var name = st.form.name || (st.donorType === 'company' ? 'Société Exemple SARL' : 'Amine Ben Salah');
      var amount = st.form.amount || 60;
      var village = window.UI ? window.UI.villageName(st.form.village) : st.form.village;
      this.addMessage('form', { name: name, amount: amount, village: village });
      this.addMessage('confirmed', { name: name });
      this.addMessage('validated', {});
      this.addMessage('activated', { name: name });
      this.addMessage('firstDebit', { amount: amount, date: '25/01/2026', ref: 'TX-2026-1041' });
      this.addMessage('modification', { detail: amount + ' DT' });
      this.save();
    }
  };

  window.Store = Store;
})();

}
