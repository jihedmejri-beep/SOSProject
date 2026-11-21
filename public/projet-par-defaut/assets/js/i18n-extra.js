/* ============================================================
   Additional strings (stage shell + step-3 checkpoint scripts)
   ============================================================ */
(function () {
  var add = {
    fr: {
      "st.prev": "Étape précédente",
      "st.next": "Étape suivante",
      "st.accuracy": "Précision de l'information",
      "st.actors": "Acteurs de cette étape",
      "st.scene": "Illustration de l'étape",
      "role.doc": "Dossier / document",
      "s2.title": "Message de confirmation du donateur",
      "s2.sub": "Le donateur reçoit une notification simulée et confirme ou annule son engagement.",
      "s2.what": "Après l'envoi du formulaire, une notification de style SMS/WhatsApp invite le donateur à confirmer son engagement. Deux réponses sont proposées : confirmer ou annuler.",
      "s2.who": "Le donateur et le service des relations donateurs (simulation).",
      "s2.note": "Ce message de confirmation et le choix à deux boutons sont une fonction de simulation proposée, non une procédure SOS vérifiée.",
      "s3.title": "Vérification administrative",
      "s3.sub": "Six points de contrôle défilent automatiquement pour expliquer le traitement du dossier.",
      "s3.what": "Une séquence automatique présente six points de contrôle : réception du formulaire, informations personnelles, montant, RIB fictif, signature simulée et validation.",
      "s3.who": "Le service administratif de SOS Villages d'Enfants (illustration).",
      "s3.note": "Séquence de démonstration : chaque point est expliqué, mais aucun contrôle réel n'est effectué.",
      "s4.title": "Activation du prélèvement automatique",
      "s4.sub": "Le compte bancaire fictif est relié à SOS et le prélèvement du 25 devient actif.",
      "s4.what": "Le dossier validé passe à l'activation : un lien fictif est établi entre la banque du donateur et SOS Villages d'Enfants. Le prélèvement récurrent est programmé le 25 de chaque mois.",
      "s4.who": "Le donateur, sa banque fictive et SOS Villages d'Enfants.",
      "s4.note": "Le prélèvement le 25 de chaque mois fait partie de la procédure PAP publiée ; l'activation affichée est une simulation.",
      "s5.title": "Premier prélèvement",
      "s5.sub": "Le 25, un jeton de paiement fictif rejoint le compte de don de SOS.",
      "s5.what": "Le premier prélèvement est animé : le 25 est mis en évidence, le montant quitte le compte fictif du donateur et un numéro de transaction est généré.",
      "s5.who": "La banque fictive, le donateur et le compte de don SOS.",
      "s5.note": "Aucun paiement réel n'est effectué : le calendrier, la banque et le numéro de transaction sont fictifs.",
      "st7.resultSuccess": "réussi",
      "st7.resultFail": "échoué",
      "st3.checks": [
        "Réception du formulaire",
        "Vérification des informations personnelles",
        "Vérification du montant choisi",
        "Vérification du RIB fictif",
        "Vérification de la signature simulée",
        "Validation de la demande"
      ],
      "st3.expl": [
        "Le formulaire PAP arrive dans la file de traitement simulée. À ce stade, rien n'est encore vérifié.",
        "Le service donateur compare le nom, l'adresse et le téléphone pour éviter les doublons. Contrôle illustratif uniquement.",
        "Le montant mensuel est relu pour confirmer qu'il correspond bien au choix du donateur.",
        "Le format du RIB de démonstration est contrôlé. Aucune banque n'est contactée.",
        "La signature dessinée est bien présente dans le dossier de démonstration.",
        "Le dossier est marqué comme prêt pour l'activation dans la simulation."
      ]
    },
    en: {
      "st.prev": "Previous stage",
      "st.next": "Next stage",
      "st.accuracy": "Information accuracy",
      "st.actors": "Actors in this stage",
      "st.scene": "Stage illustration",
      "role.doc": "File / document",
      "s2.title": "Donor confirmation message",
      "s2.sub": "The donor receives a simulated notification and confirms or cancels the commitment.",
      "s2.what": "After the form is sent, an SMS/WhatsApp-style notification asks the donor to confirm the commitment. Two answers are offered: confirm or cancel.",
      "s2.who": "The donor and the donor relations service (simulation).",
      "s2.note": "This confirmation message and two-button choice are a proposed simulation feature, not a verified SOS procedure.",
      "s3.title": "Administrative verification",
      "s3.sub": "Six checkpoints run automatically to explain how the file would be processed.",
      "s3.what": "An automatic sequence presents six checkpoints: form received, personal information, amount, fictional bank details, simulated signature and validation.",
      "s3.who": "The SOS Villages d'Enfants administrative service (illustration).",
      "s3.note": "Demonstration sequence: each checkpoint is explained, but no real check is performed.",
      "s4.title": "Automatic debit activation",
      "s4.sub": "The fictional bank account is linked to SOS and the monthly debit on the 25th becomes active.",
      "s4.what": "The validated file moves to activation: a fictional link is created between the donor's bank and SOS Villages d'Enfants. The recurring debit is scheduled for the 25th of each month.",
      "s4.who": "The donor, their fictional bank and SOS Villages d'Enfants.",
      "s4.note": "The debit on the 25th of each month is part of the published PAP procedure; the activation shown here is a simulation.",
      "s5.title": "First debit",
      "s5.sub": "On the 25th, a fictional payment token reaches the SOS donation account.",
      "s5.what": "The first debit is animated: the 25th is highlighted, the amount leaves the donor's fictional account and a transaction number is generated.",
      "s5.who": "The fictional bank, the donor and the SOS donation account.",
      "s5.note": "No real payment is made: the calendar, the bank and the transaction number are fictional.",
      "st7.resultSuccess": "successful",
      "st7.resultFail": "failed",
      "st3.checks": [
        "Form received",
        "Personal information checked",
        "Chosen amount checked",
        "Fictional bank details checked",
        "Simulated signature checked",
        "Request validated"
      ],
      "st3.expl": [
        "The PAP form arrives in the simulated processing queue. At this point nothing has been checked yet.",
        "The donor service compares name, address and phone to avoid duplicates. Illustrative check only.",
        "The monthly amount is re-read to confirm it matches the donor's choice.",
        "The format of the demonstration bank details is checked. No bank is contacted.",
        "The drawn signature is present in the demonstration file.",
        "The file is marked as ready for activation in the simulation."
      ]
    },
    ar: {
      "st.prev": "المرحلة السابقة",
      "st.next": "المرحلة التالية",
      "st.accuracy": "دقة المعلومة",
      "st.actors": "فاعلو هذه المرحلة",
      "st.scene": "رسم المرحلة",
      "role.doc": "الملف / الوثيقة",
      "s2.title": "رسالة تأكيد المتبرّع",
      "s2.sub": "يتلقى المتبرّع إشعارًا محاكيًا ثم يؤكد التزامه أو يلغيه.",
      "s2.what": "بعد إرسال الاستمارة، يدعو إشعار على نمط SMS/واتساب المتبرّع إلى تأكيد التزامه. يُقترح جوابان: التأكيد أو الإلغاء.",
      "s2.who": "المتبرّع ودائرة علاقات المتبرّعين (محاكاة).",
      "s2.note": "رسالة التأكيد هذه والاختيار بزرّين هما وظيفة محاكاة مقترحة، وليستا إجراءً موثّقًا لدى SOS.",
      "s3.title": "التحقق الإداري",
      "s3.sub": "تتوالى ست نقاط تحقّق تلقائيًا لشرح كيفية معالجة الملف.",
      "s3.what": "يعرض تسلسل تلقائي ست نقاط تحقّق: استلام الاستمارة، المعلومات الشخصية، المبلغ، البيانات البنكية الخيالية، التوقيع المحاكى والمصادقة.",
      "s3.who": "الدائرة الإدارية في جمعية SOS لقرى الأطفال (توضيح).",
      "s3.note": "تسلسل توضيحي: تُشرح كل نقطة، لكن لا يُنفَّذ أي تحقق حقيقي.",
      "s4.title": "تفعيل الاقتطاع التلقائي",
      "s4.sub": "يُربط الحساب البنكي الخيالي بـ SOS ويصبح اقتطاع يوم 25 نشطًا.",
      "s4.what": "ينتقل الملف المصادق عليه إلى التفعيل: يُنشأ رابط خيالي بين بنك المتبرّع وجمعية SOS. يُبرمَج الاقتطاع الدوري في 25 من كل شهر.",
      "s4.who": "المتبرّع وبنكه الخيالي وجمعية SOS لقرى الأطفال.",
      "s4.note": "الاقتطاع في 25 من كل شهر جزء من إجراء PAP المنشور؛ أما التفعيل المعروض فهو محاكاة.",
      "s5.title": "أول اقتطاع",
      "s5.sub": "في يوم 25، تصل رمزية دفع خيالية إلى حساب التبرعات لدى SOS.",
      "s5.what": "يُعرض أول اقتطاع بشكل متحرّك: يُبرَز يوم 25، ويغادر المبلغ الحساب الخيالي للمتبرّع، ويُنشأ رقم معاملة.",
      "s5.who": "البنك الخيالي والمتبرّع وحساب التبرعات لدى SOS.",
      "s5.note": "لا يتم أي دفع حقيقي: الرزنامة والبنك ورقم المعاملة كلها خيالية.",
      "st7.resultSuccess": "ناجحة",
      "st7.resultFail": "فاشلة",
      "st3.checks": [
        "استلام الاستمارة",
        "التحقق من المعلومات الشخصية",
        "التحقق من المبلغ المختار",
        "التحقق من البيانات البنكية الخيالية",
        "التحقق من التوقيع المحاكى",
        "المصادقة على الطلب"
      ],
      "st3.expl": [
        "تصل استمارة الاقتطاع إلى قائمة المعالجة المحاكاة. في هذه المرحلة لم يتم أي تحقق بعد.",
        "تقارن دائرة المتبرّعين الاسم والعنوان والهاتف لتجنّب التكرار. تحقق توضيحي فقط.",
        "يُعاد قراءة المبلغ الشهري للتأكد من مطابقته لاختيار المتبرّع.",
        "يتم التحقق من صيغة البيانات البنكية الخيالية. لا يُتصل بأي بنك.",
        "التوقيع المرسوم موجود فعلًا في ملف العرض.",
        "يُعلَّم الملف كجاهز للتفعيل في المحاكاة."
      ]
    }
  };
  Object.keys(add).forEach(function (lang) {
    window.I18N[lang] = Object.assign(window.I18N[lang] || {}, add[lang]);
  });
})();
