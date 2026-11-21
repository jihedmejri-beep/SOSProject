/* ============================================================
   Static content: stages, villages, fictional admin data
   ============================================================ */
(function () {
  'use strict';

  var STAGES = [
    {
      n: 1, tag: 'fact', roles: ['donor', 'doc'], sent: 's1.out', received: 's1.in',
      note: 's1.note'
    },
    {
      n: 2, tag: 'sim', roles: ['donor', 'sos', 'notify'], sent: 'st2.notification', received: 'st2.delivered',
      note: 'st2.simNote'
    },
    {
      n: 3, tag: 'sim', roles: ['sos', 'doc'], sent: 'map.sent', received: 'map.received',
      note: 'st3.note'
    },
    {
      n: 4, tag: 'fact', roles: ['donor', 'sos', 'bank'], sent: 'map.sent', received: 'map.received',
      note: 'st4.simNote'
    },
    {
      n: 5, tag: 'fact', roles: ['donor', 'bank', 'sos'], sent: 'map.sent', received: 'map.received',
      note: 'st5.simNote'
    },
    {
      n: 6, tag: 'fact', roles: ['donor', 'sos'], sent: 'map.sent', received: 'map.received',
      note: 's6.note'
    },
    {
      n: 7, tag: 'fact', roles: ['bank', 'donor', 'sos'], sent: 'map.sent', received: 'map.received',
      note: 'st7.simNote'
    },
    {
      n: 8, tag: 'fact', roles: ['donor', 'sos'], sent: 'map.sent', received: 'map.received',
      note: 's8.note'
    },
    {
      n: 9, tag: 'fact', roles: ['donor', 'sos'], sent: 'map.sent', received: 'map.received',
      note: 's9.note'
    },
    {
      n: 10, tag: 'fact', roles: ['donor', 'sos', 'notify'], sent: 'map.sent', received: 'map.received',
      note: 's10.note'
    }
  ];

  // Exact title / subtitle / explanation keys used by map cards and detail panel.
  STAGES.forEach(function (s) {
    s.titleKey = 's' + s.n + '.title';
    s.subKey = 's' + s.n + '.sub';
    s.whatKey = 's' + s.n + '.what';
    s.whoKey = 's' + s.n + '.who';
  });

  // Stage 3 and 7 get more specific exchange labels.
  STAGES[2].sent = 'st3.auto';
  STAGES[6].sent = 'st7.fact';

  var VILLAGES = [
    { id: 'Gammarth', fr: 'Gammarth', en: 'Gammarth', ar: 'قمرت' },
    { id: 'Siliana', fr: 'Siliana', en: 'Siliana', ar: 'سليانة' },
    { id: 'Mahres', fr: 'Mahres', en: 'Mahres', ar: 'المهراس' },
    { id: 'Akouda', fr: 'Akouda', en: 'Akouda', ar: 'أكودة' },
    { id: 'El Alâa', fr: 'El Alâa', en: 'El Alâa', ar: 'العلا' },
    { id: 'Hassi El Ferid', fr: 'Hassi El Ferid', en: 'Hassi El Ferid', ar: 'حاسي الفريد' }
  ];

  // The fictional 2026 timeline used across the simulation.
  var MONTH_KEYS = [
    '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
    '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
  ];

  // Fictional administrative records (6 demo donors + the visitor).
  var ADMIN_DONORS = [
    { id: 'd1', nameKey: 'ad.donors.n1', amount: 60, village: 'Gammarth', stage: 7, status: 'active', months: 4 },
    { id: 'd2', nameKey: 'ad.donors.n2', amount: 250, village: 'Siliana', stage: 10, status: 'terminated', months: 9 },
    { id: 'd3', nameKey: 'ad.donors.n3', amount: 40, village: 'Mahres', stage: 9, status: 'suspended', months: 6 },
    { id: 'd4', nameKey: 'ad.donors.n4', amount: 500, village: 'Akouda', stage: 6, status: 'active', months: 5 },
    { id: 'd5', nameKey: 'ad.donors.n5', amount: 30, village: 'El Alâa', stage: 3, status: 'pending', months: 0 },
    { id: 'd6', nameKey: 'ad.donors.n6', amount: 80, village: 'Hassi El Ferid', stage: 8, status: 'active', months: 7 }
  ];

  window.PAPData = {
    stages: STAGES,
    villages: VILLAGES,
    monthKeys: MONTH_KEYS,
    adminDonors: ADMIN_DONORS,
    demo: {
      individual: { name: 'Amine Ben Salah', profession: 'Enseignant', company: false },
      company: { name: 'Société Exemple SARL', profession: 'Services numériques', company: true },
      address: '12 rue des Oliviers, Tunis',
      phone: '20 123 456',
      email: 'amine@exemple.tn',
      rib: 'TN59 1000 6035 0000 1234 5678',
      amount: 60,
      village: 'Gammarth',
      firstMonth: '2026-02'
    }
  };
})();
