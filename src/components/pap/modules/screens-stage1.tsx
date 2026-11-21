// @ts-nocheck
/* ------------------------------------------------------------------
   TSX port of assets/js/screens-stage1.js
   The original source below is preserved verbatim. The only wrapper
   is a `document` parameter so the app can render in its own scoped
   DOM instead of a separate iframe document.
   ------------------------------------------------------------------ */
export default function run(doc) {
  var document = doc;
/* ============================================================
   STEP 1 — PAP form
   ============================================================ */
(function () {
  'use strict';
  var UI = window.UI, Store = window.Store, Reg = window.StageRegistry;

  function field(id, label, input, hint, req) {
    return '<div class="field" data-field="' + id + '">' +
      '<label for="' + id + '">' + UI.esc(label) + (req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' +
      input +
      (hint ? '<p class="hint">' + UI.esc(hint) + '</p>' : '') +
      '<p class="field__error" data-error-for="' + id + '" role="alert"></p>' +
      '</div>';
  }

  function body(st) {
    var f = st.form;
    var demo = window.PAPData.demo;
    var villages = window.PAPData.villages.map(function (v) {
      return '<option value="' + UI.esc(v.id) + '"' + (v.id === f.village ? ' selected' : '') + '>' +
        UI.esc(v[st.lang] || v.fr) + '</option>';
    }).join('');
    var amounts = [20, 40, 60, 100, 250];

    return '' +
      '<form class="pap-form" id="papForm" novalidate>' +
      '<div class="panel form-panel">' +
      '<h2 class="panel__title">' + UI.icon('user', '', 18) + UI.t('f1.section1') + '</h2>' +
      '<p class="hint">' + UI.esc(UI.t('f1.typeHint')) + '</p>' +
      '<div class="type-switch" role="radiogroup" aria-label="' + UI.esc(UI.t('f1.type')) + '">' +
      ['individual', 'company'].map(function (tp) {
        var on = (f.type === tp);
        return '<button type="button" class="type-card' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on +
          '" data-type="' + tp + '">' +
          '<span class="type-card__art">' + window.Art.avatar(tp) + '</span>' +
          '<span class="type-card__text"><strong>' + UI.esc(UI.t(tp === 'company' ? 'c.company' : 'c.individual')) + '</strong>' +
          '<small>' + UI.esc(UI.t(tp === 'company' ? 'f1.typeCompanyDesc' : 'f1.typeIndividualDesc')) + '</small></span>' +
          '<span class="type-card__tick">' + (on ? UI.icon('check', '', 14) : '') + '</span>' +
          '</button>';
      }).join('') +
      '</div>' +
      '<div class="form-grid">' +
      field('name', f.type === 'company' ? UI.t('f1.nameCompany') : UI.t('f1.name'), '<input id="name" name="name" type="text" autocomplete="off" value="' + UI.esc(f.name) + '" placeholder="' + UI.esc(f.type === 'company' ? UI.t('f1.nameCompanyPh') : UI.t('f1.namePh')) + '">', '', true) +
      field('profession', f.type === 'company' ? UI.t('f1.professionCompany') : UI.t('f1.profession'), '<input id="profession" type="text" autocomplete="off" value="' + UI.esc(f.profession) + '" placeholder="' + UI.esc(UI.t('f1.professionPh')) + '">', '', true) +
      '</div></div>' +

      '<div class="panel form-panel">' +
      '<h2 class="panel__title">' + UI.icon('map-pin', '', 18) + UI.t('f1.section2') + '</h2>' +
      '<div class="form-grid">' +
      field('address', UI.t('f1.address'), '<input id="address" type="text" autocomplete="off" value="' + UI.esc(f.address) + '" placeholder="' + UI.esc(UI.t('f1.addressPh')) + '">', '', true) +
      field('phone', UI.t('f1.phone'), '<input id="phone" type="tel" inputmode="tel" autocomplete="off" value="' + UI.esc(f.phone) + '" placeholder="' + UI.esc(UI.t('f1.phonePh')) + '">', '', true) +
      field('email', UI.t('f1.email'), '<input id="email" type="email" inputmode="email" autocomplete="off" value="' + UI.esc(f.email) + '" placeholder="' + UI.esc(UI.t('f1.emailPh')) + '">', '', true) +
      '</div></div>' +

      '<div class="panel form-panel">' +
      '<h2 class="panel__title">' + UI.icon('heart', '', 18) + UI.t('f1.section3') + '</h2>' +
      '<div class="form-grid">' +
      '<div class="field" data-field="amount"><label for="amount">' + UI.esc(UI.t('f1.amount')) +
      '<span class="req" aria-hidden="true">*</span></label>' +
      '<div class="amount-row"><div class="input-suffix"><input id="amount" type="number" min="5" max="5000" step="5" value="' + UI.esc(f.amount) + '" aria-describedby="amountHint"><span>' + UI.esc(UI.t('c.currency')) + '</span></div>' +
      '<div class="chips">' + amounts.map(function (a) {
        return '<button type="button" class="chip' + (Number(f.amount) === a ? ' is-on' : '') + '" data-amount="' + a + '">' + a + '</button>';
      }).join('') + '</div></div>' +
      '<p class="hint" id="amountHint">' + UI.esc(UI.t('f1.amountHint')) + '</p>' +
      '<p class="field__error" data-error-for="amount" role="alert"></p></div>' +
      field('village', UI.t('f1.village'), '<select id="village">' + villages + '</select>', '', true) +
      field('firstMonth', UI.t('f1.firstMonth'), '<input id="firstMonth" type="month" min="2026-01" max="2027-12" value="' + UI.esc(f.firstMonth || '2026-02') + '">', UI.t('f1.firstMonthHint'), true) +
      '</div></div>' +

      '<div class="panel form-panel">' +
      '<h2 class="panel__title">' + UI.icon('credit-card', '', 18) + UI.t('f1.section4') + '</h2>' +
      '<div class="form-grid">' +
      field('rib', UI.t('f1.rib'),
        '<div class="input-action"><input id="rib" type="text" inputmode="text" autocomplete="off" maxlength="27" value="' + UI.esc(f.rib) + '" placeholder="TN59 1000 6035 0000 1234 5678">' +
        '<button type="button" class="btn btn--ghost btn--sm" id="ribFill">' + UI.esc(UI.t('f1.ribFill')) + '</button></div>',
        UI.t('f1.ribHint') + ' · ' + UI.t('f1.ribNote'), true) +
      '</div></div>' +

      '<div class="panel form-panel">' +
      '<h2 class="panel__title">' + UI.icon('pen', '', 18) + UI.t('f1.section5') + '</h2>' +
      '<div class="sign-wrap">' +
      '<canvas id="signaturePad" width="640" height="180" aria-label="' + UI.esc(UI.t('f1.signature')) + '"></canvas>' +
      '<span class="sign-placeholder" id="signPlaceholder">' + UI.icon('pen', '', 16) + UI.esc(UI.t('f1.signEmpty')) + '</span>' +
      '<button type="button" class="btn btn--quiet btn--sm sign-clear" id="signClear">' + UI.icon('x', '', 14) + UI.esc(UI.t('f1.signClear')) + '</button>' +
      '</div>' +
      '<p class="hint">' + UI.esc(UI.t('f1.signHint')) + '</p>' +
      '<p class="field__error" data-error-for="signature" role="alert"></p>' +
      '<label class="check"><input type="checkbox" id="accept"' + (f.accepted ? ' checked' : '') + '>' +
      '<span>' + UI.esc(UI.t('f1.accept')) + '</span></label>' +
      '<p class="field__error" data-error-for="accept" role="alert"></p>' +
      '</div>' +

      '<div class="form-submit">' +
      '<div class="form-submit__note">' + UI.icon('lock', '', 16) + UI.esc(UI.t('f1.notice')) + '</div>' +
      '<div class="form-submit__actions">' +
      '<button type="button" class="btn btn--ghost" id="demoFill">' + UI.icon('sparkles', '', 18) + UI.esc(UI.t('f1.demoFill')) + '</button>' +
      '<button type="submit" class="btn btn--primary" id="submitForm">' + UI.icon('arrow-right', '', 18) + '<span>' + UI.esc(UI.t('f1.submit')) + '</span></button>' +
      '</div>' +
      '<p class="hint form-submit__hint">' + UI.esc(UI.t('f1.demoNote')) + '</p>' +
      '</div>' +
      '</form>';
  }

  function mount(root, n) {
    var st = Store.state;
    var form = root.querySelector('#papForm');
    var nameEl = root.querySelector('#name');
    var professionEl = root.querySelector('#profession');
    var addressEl = root.querySelector('#address');
    var phoneEl = root.querySelector('#phone');
    var emailEl = root.querySelector('#email');
    var amountEl = root.querySelector('#amount');
    var villageEl = root.querySelector('#village');
    var monthEl = root.querySelector('#firstMonth');
    var ribEl = root.querySelector('#rib');
    var acceptEl = root.querySelector('#accept');
    var canvas = root.querySelector('#signaturePad');
    var ctx = canvas.getContext('2d');
    var placeholder = root.querySelector('#signPlaceholder');
    var signature = st.form.signature || '';
    var drawing = false;
    var last = null;

    function paintSignature() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (signature) {
        var img = new Image();
        img.onload = function () { ctx.drawImage(img, 0, 0); };
        img.src = signature;
        placeholder.classList.add('is-hidden');
      } else {
        placeholder.classList.remove('is-hidden');
      }
    }
    paintSignature();

    function saveSignature() {
      signature = canvas.toDataURL('image/png');
      placeholder.classList.add('is-hidden');
      clearError('signature');
      st.form.signature = signature;
    }

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (canvas.width / r.width),
        y: (e.clientY - r.top) * (canvas.height / r.height)
      };
    }

    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      last = pos(e);
      ctx.beginPath();
      ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1D3768';
      ctx.fill();
      placeholder.classList.add('is-hidden');
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = '#1D3768';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      last = p;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      canvas.addEventListener(ev, function () {
        if (!drawing) return;
        drawing = false;
        saveSignature();
      });
    });

    root.querySelector('#signClear').addEventListener('click', function () {
      signature = '';
      st.form.signature = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      placeholder.classList.remove('is-hidden');
    });

    function clearError(id) {
      var box = root.querySelector('[data-field="' + id + '"]');
      if (box) box.classList.remove('is-invalid');
      var err = root.querySelector('[data-error-for="' + id + '"]');
      if (err) err.textContent = '';
      var input = root.querySelector('#' + id);
      if (input) input.removeAttribute('aria-invalid');
    }

    function setError(id, msg) {
      var box = root.querySelector('[data-field="' + id + '"]');
      if (box) box.classList.add('is-invalid');
      var err = root.querySelector('[data-error-for="' + id + '"]');
      if (err) err.textContent = msg;
      var input = root.querySelector('#' + id);
      if (input) input.setAttribute('aria-invalid', 'true');
    }

    // Keep partially typed values when the header donor switch or navigation re-renders the screen.
    function syncForm() {
      if (st.submitted) return;
      st.form.name = nameEl.value;
      st.form.profession = professionEl.value;
      st.form.address = addressEl.value;
      st.form.phone = phoneEl.value;
      st.form.email = emailEl.value;
      st.form.amount = Number(amountEl.value) || st.form.amount;
      st.form.village = villageEl.value;
      st.form.firstMonth = monthEl.value || st.form.firstMonth;
      st.form.rib = ribEl.value;
      st.form.accepted = acceptEl.checked;
      Store.save();
    }
    form.addEventListener('input', syncForm);
    form.addEventListener('change', syncForm);

    [nameEl, professionEl, addressEl, phoneEl, emailEl, amountEl, ribEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', function () { clearError(el.id); });
    });
    acceptEl.addEventListener('change', function () { clearError('accept'); });

    function setType(type) {
      st.donorType = type;
      st.form.type = type;
      root.querySelectorAll('.type-card').forEach(function (c) {
        var on = c.getAttribute('data-type') === type;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-checked', String(on));
        c.querySelector('.type-card__tick').innerHTML = on ? UI.icon('check', '', 14) : '';
      });
      var label = root.querySelector('label[for="name"]');
      if (label) {
        label.innerHTML = UI.esc(type === 'company' ? UI.t('f1.nameCompany') : UI.t('f1.name')) + '<span class="req" aria-hidden="true">*</span>';
      }
      var pl = root.querySelector('label[for="profession"]');
      if (pl) {
        pl.innerHTML = UI.esc(type === 'company' ? UI.t('f1.professionCompany') : UI.t('f1.profession')) + '<span class="req" aria-hidden="true">*</span>';
      }
      nameEl.placeholder = type === 'company' ? UI.t('f1.nameCompanyPh') : UI.t('f1.namePh');
      syncForm();
      Store.save();
      if (window.App) window.App.refreshChrome();
    }
    root.querySelectorAll('.type-card').forEach(function (c) {
      c.addEventListener('click', function () { setType(c.getAttribute('data-type')); });
    });

    root.querySelectorAll('[data-amount]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var a = Number(chip.getAttribute('data-amount'));
        amountEl.value = a;
        root.querySelectorAll('[data-amount]').forEach(function (c2) {
          c2.classList.toggle('is-on', Number(c2.getAttribute('data-amount')) === a);
        });
        syncForm();
        clearError('amount');
      });
    });

    root.querySelector('#ribFill').addEventListener('click', function () {
      ribEl.value = window.PAPData.demo.rib;
      syncForm();
      clearError('rib');
      UI.toast(UI.t('f1.ribNote'), 'info', 2600);
    });

    function drawDemoSignature() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1D3768';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(60, 120);
      ctx.bezierCurveTo(120, 48, 150, 156, 210, 98);
      ctx.bezierCurveTo(260, 52, 250, 140, 320, 110);
      ctx.bezierCurveTo(380, 84, 360, 130, 430, 100);
      ctx.stroke();
      signature = canvas.toDataURL('image/png');
      st.form.signature = signature;
      placeholder.classList.add('is-hidden');
    }

    root.querySelector('#demoFill').addEventListener('click', function () {
      var d = window.PAPData.demo;
      var isCompany = st.donorType === 'company';
      nameEl.value = isCompany ? d.company.name : d.individual.name;
      professionEl.value = isCompany ? d.company.profession : d.individual.profession;
      addressEl.value = d.address;
      phoneEl.value = d.phone;
      emailEl.value = d.email;
      amountEl.value = d.amount;
      ribEl.value = d.rib;
      monthEl.value = d.firstMonth;
      acceptEl.checked = true;
      drawDemoSignature();
      syncForm();
      ['name', 'profession', 'address', 'phone', 'email', 'amount', 'rib', 'signature', 'accept'].forEach(clearError);
      UI.toast(UI.t('f1.demoFill'), 'success', 2200);
      nameEl.focus();
    });

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
    function digits(v) { return (v || '').replace(/\D/g, ''); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errors = 0;
      if (nameEl.value.trim().length < 3) { setError('name', UI.t('f1.required')); errors++; }
      if (professionEl.value.trim().length < 2) { setError('profession', UI.t('f1.required')); errors++; }
      if (addressEl.value.trim().length < 5) { setError('address', UI.t('f1.required')); errors++; }
      if (digits(phoneEl.value).length < 8) { setError('phone', UI.t('f1.invalidPhone')); errors++; }
      if (!validEmail(emailEl.value.trim())) { setError('email', UI.t('f1.invalidEmail')); errors++; }
      var amount = Number(amountEl.value);
      if (!amount || amount < 5 || amount > 5000) { setError('amount', UI.t('f1.invalidAmount')); errors++; }
      var ribDigits = digits(ribEl.value);
      if (ribDigits.length < 10 || ribDigits.length > 24) { setError('rib', UI.t('f1.ribInvalid')); errors++; }
      if (!signature) { setError('signature', UI.t('f1.signMissing')); errors++; }
      if (!acceptEl.checked) { setError('accept', UI.t('f1.acceptMissing')); errors++; }

      if (errors) {
        UI.toast(UI.t('f1.fixFields'), 'error');
        var firstInvalid = root.querySelector('.field.is-invalid input, .field.is-invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var btn = root.querySelector('#submitForm');
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + UI.esc(UI.t('f1.loading')) + '</span>';

      var data = {
        type: st.donorType,
        name: nameEl.value.trim(),
        profession: professionEl.value.trim(),
        address: addressEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        amount: amount,
        village: villageEl.value,
        rib: ribEl.value.trim(),
        firstMonth: monthEl.value || '2026-02',
        accepted: true,
        signature: signature
      };

      setTimeout(function () {
        st.form = data;
        st.submitted = true;
        st.donorType = data.type;
        st.registrationDate = new Date().toISOString().slice(0, 10);
        Store.save();
        Store.complete(1);
        Store.addMessage('form', {
          name: data.name,
          amount: data.amount,
          village: UI.villageName(data.village)
        });
        UI.toast(UI.t('f1.successBody'), 'success', 5000);
        window.App.go('stage', { n: 2 });
      }, 1100);
    });
  }

  Reg[1] = { body: body, mount: mount };
})();

}
