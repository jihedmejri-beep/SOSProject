import type { Localized, LocalizedList } from "@/lib/i18n/localized";

export type SourceStatus = "official" | "historical" | "educational";

export type KnowledgeChunk = {
  id: string;
  topic: string;
  page: number;
  status: SourceStatus;
  title: Localized;
  text: Localized;
  keywords: LocalizedList;
};

/**
 * Curated knowledge base derived from the verified facts listed in the
 * product specification (§15). The source PDF was not present in the
 * repository, so this dataset is the reviewed fallback and every chunk keeps
 * its guide page reference.
 */
export const KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "definition",
    topic: "definition",
    page: 4,
    status: "official",
    title: {
      fr: "Définition du PAP",
      ar: "تعريف الاقتطاع",
      en: "PAP definition",
    },
    text: {
      fr: "PAP signifie Prélèvement Automatique Permanent. Il s'agit d'une contribution volontaire prélevée automatiquement chaque mois sur un compte courant tunisien, selon le montant choisi et autorisé par le donateur.",
      ar: "الاقتطاع التلقائي الدائم هو مساهمة تطوعية تُسحب تلقائيًا كل شهر من حساب جارٍ تونسي، وفق المبلغ الذي يختاره المتبرع ويأذن به.",
      en: "PAP stands for Prélèvement Automatique Permanent. It is a voluntary contribution automatically debited every month from a Tunisian current account, according to the amount chosen and authorised by the donor.",
    },
    keywords: {
      fr: ["pap", "prélèvement automatique permanent", "c'est quoi", "qu'est-ce que", "définition", "signifie", "exactement"],
      ar: ["تعريف", "الاقتطاع", "الدائم", "يعني", "بالضبط"],
      en: ["what is", "definition", "stands for", "mean", "exactly", "pap"],
    },
  },
  {
    id: "monthly",
    topic: "monthly",
    page: 4,
    status: "official",
    title: {
      fr: "Une contribution mensuelle",
      ar: "مساهمة شهرية",
      en: "A monthly contribution",
    },
    text: {
      fr: "Le PAP est une contribution récurrente prélevée chaque mois. Ce n'est ni un don ponctuel ni un prélèvement quotidien. Un exemple de budget quotidien peut aider à se représenter l'effort, mais le PAP fonctionne bien par prélèvement mensuel.",
      ar: "الاقتطاع مساهمة متكررة تُسحب كل شهر. وهو ليس تبرعًا لمرة واحدة ولا سحبًا يوميًا. يمكن لمثال الميزانية اليومية أن يساعد على تصور الجهد، لكن الاقتطاع يعمل بسحب شهري.",
      en: "PAP is a recurring contribution debited every month. It is neither a one-off donation nor a daily debit. A daily budget example can help picture the effort, but PAP works through a monthly debit.",
    },
    keywords: {
      fr: ["mensuel", "chaque mois", "récurrent", "fréquence", "ponctuel", "quotidien", "tous les mois"],
      ar: ["شهري", "كل شهر", "متكرر", "وتيرة", "يومي", "مرة واحدة"],
      en: ["monthly", "every month", "recurring", "frequency", "one-off", "daily"],
    },
  },
  {
    id: "amount",
    topic: "amount",
    page: 7,
    status: "official",
    title: {
      fr: "Le montant choisi par le donateur",
      ar: "المبلغ الذي يختاره المتبرع",
      en: "The amount chosen by the donor",
    },
    text: {
      fr: "Le donateur choisit librement le montant mensuel de sa contribution. Cette démonstration ne fixe aucun montant et n'enregistre aucune saisie.",
      ar: "يختار المتبرع بحرية المبلغ الشهري لمساهمته. هذه المحاكاة لا تحدد أي مبلغ ولا تسجل أي إدخال.",
      en: "The donor freely chooses the monthly amount of their contribution. This demonstration sets no amount and stores no input.",
    },
    keywords: {
      fr: ["montant", "choisir le montant", "librement", "combien", "somme", "fixé par"],
      ar: ["المبلغ", "اختيار المبلغ", "بحرية", "كم", "قيمة"],
      en: ["amount", "choose the amount", "freely", "how much", "sum"],
    },
  },
  {
    id: "account",
    topic: "account",
    page: 8,
    status: "official",
    title: {
      fr: "Compte courant tunisien requis",
      ar: "يلزم حساب جارٍ تونسي",
      en: "Tunisian current account required",
    },
    text: {
      fr: "La voie PAP actuelle exige un compte courant tunisien. Le donateur autorise sa banque à débiter ce compte. Le RIB et les coordonnées bancaires sont requis.",
      ar: "يتطلب مسار الاقتطاع الحالي حسابًا جاريًا تونسيًا. يأذن المتبرع لبنكه بسحب المبلغ من هذا الحساب. وتُطلب وثيقة RIB والمعطيات البنكية.",
      en: "The current PAP route requires a Tunisian current account. The donor authorises their bank to debit this account. The RIB and bank details are required.",
    },
    keywords: {
      fr: ["compte courant", "compte bancaire", "type de compte", "rib", "banque", "tunisien", "coordonnées bancaires"],
      ar: ["حساب جار", "حساب بنكي", "نوع الحساب", "rib", "بنك", "تونسي", "معطيات بنكية"],
      en: ["current account", "bank account", "type of account", "rib", "bank", "tunisian", "bank details"],
    },
  },
  {
    id: "authorization",
    topic: "authorization",
    page: 8,
    status: "official",
    title: {
      fr: "L'autorisation et le premier mois",
      ar: "التفويض والشهر الأول",
      en: "Authorisation and first month",
    },
    text: {
      fr: "L'autorisation PAP réelle demande les informations du donateur, le montant en chiffres et en lettres, un RIB et les coordonnées bancaires, le premier mois de prélèvement, une autorisation personnelle et une signature.",
      ar: "يتطلب تفويض الاقتطاع الحقيقي معلومات المتبرع، والمبلغ بالأرقام والحروف، ووثيقة RIB والمعطيات البنكية، وأول شهر للسحب، وتفويضًا شخصيًا وتوقيعًا.",
      en: "The real PAP authorisation requires the donor's information, the amount in figures and words, a RIB and bank details, the first debit month, a personal authorisation and a signature.",
    },
    keywords: {
      fr: ["autorisation", "signature", "formulaire", "premier mois", "mandat", "début", "commencer"],
      ar: ["تفويض", "توقيع", "استمارة", "أول شهر", "بداية", "يبدأ"],
      en: ["authorisation", "authorization", "signature", "form", "first month", "mandate", "start"],
    },
  },
  {
    id: "dates",
    topic: "dates",
    page: 9,
    status: "official",
    title: {
      fr: "Les dates de prélèvement",
      ar: "تواريخ السحب",
      en: "Debit dates",
    },
    text: {
      fr: "Le prélèvement normal a lieu le 25 de chaque mois. En cas de solde insuffisant, une seconde tentative est faite le 5 du mois suivant.",
      ar: "يتم السحب العادي في اليوم 25 من كل شهر. وفي حال عدم كفاية الرصيد، تُجرى محاولة ثانية في اليوم 5 من الشهر التالي.",
      en: "The normal debit takes place on the 25th of each month. If funds are insufficient, a second attempt is made on the 5th of the following month.",
    },
    keywords: {
      fr: ["date", "quelle date", "25", "le 5", "jour", "quand", "date du prélèvement", "prélevé", "prélevée", "prélevés", "prélevées", "prélever"],
      ar: ["تاريخ", "أي تاريخ", "25", "5", "يوم", "متى", "السحب"],
      en: ["date", "which date", "25", "the 5th", "day", "when"],
    },
  },
  {
    id: "failed",
    topic: "failed",
    page: 9,
    status: "official",
    title: {
      fr: "Solde insuffisant et échecs",
      ar: "الرصيد غير الكافي والإخفاقات",
      en: "Insufficient funds and failures",
    },
    text: {
      fr: "Si le compte manque de solde, une seconde tentative a lieu le 5 du mois suivant. Les prélèvements échoués ne sont pas cumulés : le montant non prélevé ne s'ajoute pas aux mois suivants.",
      ar: "إذا لم يكفِ رصيد الحساب، تُجرى محاولة ثانية في اليوم 5 من الشهر التالي. ولا تتراكم السحوبات الفاشلة: المبلغ غير المسحوب لا يُضاف إلى الأشهر التالية.",
      en: "If the account lacks funds, a second attempt takes place on the 5th of the following month. Failed debits are not cumulative: the amount not debited is not added to following months.",
    },
    keywords: {
      fr: ["solde", "insuffisant", "manque", "échec", "échoué", "seconde tentative", "cumul", "pas assez"],
      ar: ["رصيد", "غير كاف", "ينقص", "فشل", "محاولة ثانية", "تراكم"],
      en: ["balance", "insufficient", "lacks funds", "failure", "failed", "second attempt", "cumulative"],
    },
  },
  {
    id: "flexibility",
    topic: "flexibility",
    page: 10,
    status: "official",
    title: {
      fr: "Modifier, suspendre ou arrêter",
      ar: "التعديل أو التعليق أو الإيقاف",
      en: "Change, pause or stop",
    },
    text: {
      fr: "Le donateur peut contacter SOS pour modifier le montant, suspendre temporairement ou arrêter sa contribution. Le soutien reste volontaire.",
      ar: "يمكن للمتبرع التواصل مع SOS لتعديل المبلغ أو تعليق المساهمة مؤقتًا أو إيقافها. ويبقى الدعم تطوعيًا.",
      en: "The donor can contact SOS to change the amount, temporarily suspend or stop the contribution. Support remains voluntary.",
    },
    keywords: {
      fr: ["arrêter", "arrêt", "suspendre", "pause", "modifier", "changer", "stopper", "annuler"],
      ar: ["إيقاف", "أوقف", "تعليق", "تعديل", "تغيير", "إلغاء", "السحب"],
      en: ["stop", "cancel", "suspend", "pause", "change", "modify"],
    },
  },
  {
    id: "privacy",
    topic: "privacy",
    page: 6,
    status: "official",
    title: {
      fr: "Protection des enfants",
      ar: "حماية الأطفال",
      en: "Child protection",
    },
    text: {
      fr: "Les donateurs ne peuvent pas choisir un enfant individuellement identifié. Les informations personnelles des enfants sont protégées, et choisir un village ne signifie pas choisir un enfant précis.",
      ar: "لا يمكن للمتبرعين اختيار طفل محدد بالهوية. معلومات الأطفال الشخصية محمية، واختيار قرية لا يعني اختيار طفل بعينه.",
      en: "Donors cannot choose an individually identified child. Children's personal information is protected, and choosing a village does not mean choosing a specific child.",
    },
    keywords: {
      fr: ["choisir un enfant", "choisir un village", "informations personnelles", "données personnelles", "vie privée", "protection des enfants", "confidentialité"],
      ar: ["اختيار طفل", "اختيار قرية", "معلومات شخصية", "بيانات شخصية", "حماية الأطفال", "الخصوصية"],
      en: ["choose a child", "choose a village", "personal information", "personal data", "child protection", "privacy", "confidentiality"],
    },
  },
  {
    id: "cards",
    topic: "cards",
    page: 8,
    status: "official",
    title: {
      fr: "Pas de carte bancaire pour le PAP",
      ar: "لا بطاقة بنكية للاقتطاع",
      en: "No bank card for PAP",
    },
    text: {
      fr: "Le paiement par carte bancaire n'est pas accepté pour la voie PAP. Le prélèvement se fait depuis un compte courant tunisien autorisé. Le don en ligne général, distinct, peut utiliser une carte.",
      ar: "لا يُقبل الدفع بالبطاقة البنكية في مسار الاقتطاع. يتم السحب من حساب جارٍ تونسي مُفوَّض. أما التبرع العام عبر الإنترنت، وهو مسار مختلف، فيمكن أن يستخدم البطاقة.",
      en: "Card payment is not accepted for the PAP route. The debit is made from an authorised Tunisian current account. The separate general online donation may use a card.",
    },
    keywords: {
      fr: ["carte", "carte bancaire", "cb", "visa", "paiement", "paiement en ligne"],
      ar: ["بطاقة", "بطاقة بنكية", "دفع", "فيزا"],
      en: ["card", "bank card", "visa", "payment", "online payment"],
    },
  },
  {
    id: "mission",
    topic: "mission",
    page: 5,
    status: "official",
    title: {
      fr: "La mission soutenue",
      ar: "المهمة المدعومة",
      en: "The mission supported",
    },
    text: {
      fr: "Les contributions PAP soutiennent l'ensemble des actions de SOS : soins, éducation, santé et renforcement des familles. Aucun coût précis n'est attribué à un enfant ou à un service particulier sans calcul officiel approuvé.",
      ar: "تدعم مساهمات الاقتطاع جميع أنشطة SOS: الرعاية والتعليم والصحة وتعزيز الأسر. ولا تُنسب أي تكلفة محددة إلى طفل أو خدمة معينة دون حساب رسمي معتمد.",
      en: "PAP contributions support all SOS work: care, education, health and family strengthening. No exact cost is attributed to a child or a particular service without an approved official calculation.",
    },
    keywords: {
      fr: ["mission", "soutien", "soutiennent", "soins", "éducation", "santé", "familles", "actions", "sert"],
      ar: ["مهمة", "دعم", "تدعم", "رعاية", "تعليم", "صحة", "أسر", "أنشطة"],
      en: ["mission", "support", "care", "education", "health", "families", "work"],
    },
  },
  {
    id: "minimum",
    topic: "minimum",
    page: 17,
    status: "historical",
    title: {
      fr: "Le minimum de 10 DT n'est pas confirmé",
      ar: "الحد الأدنى 10 د.ت غير مؤكد",
      en: "The 10 DT minimum is not confirmed",
    },
    text: {
      fr: "Un montant de 10 DT a été mentionné dans un communiqué de presse historique d'octobre 2024. Le formulaire examiné dans le guide n'affichait pas de minimum. Ce seuil ne doit donc pas être présenté comme le minimum officiel actuel sans confirmation de SOS.",
      ar: "ذُكر مبلغ 10 د.ت في بيان صحفي تاريخي من أكتوبر 2024. أما الاستمارة التي فُحصت في الدليل فلم تُظهر حدًا أدنى. لذلك لا ينبغي تقديم هذا الحد كحد أدنى رسمي حالي دون تأكيد من SOS.",
      en: "An amount of 10 DT was mentioned in a historical October 2024 press release. The form reviewed in the guide displayed no minimum. This threshold must therefore not be presented as the current official minimum without SOS confirmation.",
    },
    keywords: {
      fr: ["minimum", "montant minimum", "seuil", "10 dt", "au moins"],
      ar: ["الحد الأدنى", "أدنى مبلغ", "10 د.ت", "على الأقل"],
      en: ["minimum", "minimum amount", "threshold", "10 dt", "at least"],
    },
  },
  {
    id: "donation",
    topic: "donation",
    page: 13,
    status: "educational",
    title: {
      fr: "Deux voies de soutien",
      ar: "مساران للدعم",
      en: "Two support routes",
    },
    text: {
      fr: "Deux voies distinctes existent : le don en ligne général, qui peut utiliser une carte, et le parrainage PAP, qui repose sur un prélèvement mensuel automatique depuis un compte courant tunisien avec autorisation signée. Les démarches réelles se font sur les pages officielles sosve.tn.",
      ar: "يوجد مساران مختلفان: التبرع العام عبر الإنترنت، الذي يمكن أن يستخدم البطاقة، وكفالة الاقتطاع، التي تعتمد على سحب شهري تلقائي من حساب جارٍ تونسي بتفويض موقّع. تتم الإجراءات الحقيقية على صفحات sosve.tn الرسمية.",
      en: "Two distinct routes exist: general online donation, which may use a card, and PAP sponsorship, which relies on an automatic monthly debit from a Tunisian current account with a signed authorisation. Real steps take place on the official sosve.tn pages.",
    },
    keywords: {
      fr: ["don", "donation", "don en ligne", "site officiel", "parrainage", "lien", "où donner"],
      ar: ["تبرع", "تبرع عبر الإنترنت", "الموقع الرسمي", "كفالة", "رابط"],
      en: ["donation", "donate", "online donation", "official website", "sponsorship", "link"],
    },
  },
];

export type CuratedAnswer = {
  topic: string;
  pages: number[];
  answer: Localized;
};

export const CURATED_ANSWERS: Record<string, CuratedAnswer> = {
  definition: {
    topic: "definition",
    pages: [4],
    answer: {
      fr: "Le PAP (Prélèvement Automatique Permanent) est une contribution volontaire, prélevée automatiquement chaque mois sur un compte courant tunisien, selon le montant choisi et autorisé par le donateur. Ce n'est pas un don ponctuel, et aucune carte bancaire n'est utilisée dans cette voie.",
      ar: "الاقتطاع التلقائي الدائم هو مساهمة تطوعية تُسحب تلقائيًا كل شهر من حساب جارٍ تونسي، وفق المبلغ الذي يختاره المتبرع ويأذن به. وهو ليس تبرعًا لمرة واحدة، ولا تُستخدم أي بطاقة بنكية في هذا المسار.",
      en: "PAP (Prélèvement Automatique Permanent) is a voluntary contribution automatically debited every month from a Tunisian current account, according to the amount chosen and authorised by the donor. It is not a one-off donation, and no bank card is used in this route.",
    },
  },
  monthly: {
    topic: "monthly",
    pages: [4, 9],
    answer: {
      fr: "Le PAP est un prélèvement mensuel récurrent : le montant choisi est débité chaque mois. Ce n'est ni un don unique ni un prélèvement quotidien. Un exemple de budget quotidien peut aider à se représenter l'effort, mais le fonctionnement réel reste mensuel.",
      ar: "الاقتطاع سحب شهري متكرر: يُسحب المبلغ المختار كل شهر. وهو ليس تبرعًا لمرة واحدة ولا سحبًا يوميًا. يمكن لمثال الميزانية اليومية أن يساعد على تصور الجهد، لكن العمل الفعلي يبقى شهريًا.",
      en: "PAP is a recurring monthly debit: the chosen amount is debited every month. It is neither a one-time donation nor a daily debit. A daily budget example can help picture the effort, but the real mechanism remains monthly.",
    },
  },
  amount: {
    topic: "amount",
    pages: [7],
    answer: {
      fr: "Le donateur choisit librement le montant mensuel de sa contribution. Cette démonstration ne fixe aucun montant et n'enregistre aucune saisie. Pour connaître les montants acceptés dans la procédure officielle, vérifiez auprès de SOS Villages d'Enfants Tunisie.",
      ar: "يختار المتبرع بحرية المبلغ الشهري لمساهمته. هذه المحاكاة لا تحدد أي مبلغ ولا تسجل أي إدخال. ولمعرفة المبالغ المقبولة في الإجراء الرسمي، تحقق مع قرى SOS للأطفال بتونس.",
      en: "The donor freely chooses the monthly amount of their contribution. This demonstration sets no amount and stores no input. To know the amounts accepted in the official procedure, check with SOS Children's Villages Tunisia.",
    },
  },
  account: {
    topic: "account",
    pages: [8],
    answer: {
      fr: "La voie PAP exige un compte courant tunisien. Le donateur autorise sa banque à débiter ce compte, et le RIB ainsi que les coordonnées bancaires sont requis. Le paiement par carte bancaire ne fait pas partie de cette voie.",
      ar: "يتطلب مسار الاقتطاع حسابًا جاريًا تونسيًا. يأذن المتبرع لبنكه بسحب المبلغ من هذا الحساب، وتُطلب وثيقة RIB والمعطيات البنكية. والدفع بالبطاقة البنكية ليس جزءًا من هذا المسار.",
      en: "The PAP route requires a Tunisian current account. The donor authorises their bank to debit this account, and the RIB and bank details are required. Card payment is not part of this route.",
    },
  },
  authorization: {
    topic: "authorization",
    pages: [8],
    answer: {
      fr: "L'autorisation PAP réelle demande les informations du donateur, le montant en chiffres et en lettres, un RIB et les coordonnées bancaires, le premier mois de prélèvement, une autorisation personnelle et une signature. Un compte courant tunisien est requis.",
      ar: "يتطلب تفويض الاقتطاع الحقيقي معلومات المتبرع، والمبلغ بالأرقام والحروف، ووثيقة RIB والمعطيات البنكية، وأول شهر للسحب، وتفويضًا شخصيًا وتوقيعًا. ويُشترط حساب جارٍ تونسي.",
      en: "The real PAP authorisation requires the donor's information, the amount in figures and words, a RIB and bank details, the first debit month, a personal authorisation and a signature. A Tunisian current account is required.",
    },
  },
  dates: {
    topic: "dates",
    pages: [9],
    answer: {
      fr: "Le prélèvement normal a lieu le 25 de chaque mois. En cas de solde insuffisant, une seconde tentative est faite le 5 du mois suivant.",
      ar: "يتم السحب العادي في اليوم 25 من كل شهر. وفي حال عدم كفاية الرصيد، تُجرى محاولة ثانية في اليوم 5 من الشهر التالي.",
      en: "The normal debit takes place on the 25th of each month. If funds are insufficient, a second attempt is made on the 5th of the following month.",
    },
  },
  failed: {
    topic: "failed",
    pages: [9],
    answer: {
      fr: "Si le compte manque de solde, une seconde tentative a lieu le 5 du mois suivant. Les prélèvements échoués ne sont pas cumulés : le montant non prélevé ne s'ajoute pas aux mois suivants.",
      ar: "إذا لم يكفِ رصيد الحساب، تُجرى محاولة ثانية في اليوم 5 من الشهر التالي. ولا تتراكم السحوبات الفاشلة: المبلغ غير المسحوب لا يُضاف إلى الأشهر التالية.",
      en: "If the account lacks funds, a second attempt takes place on the 5th of the following month. Failed debits are not cumulative: the amount not debited is not added to following months.",
    },
  },
  flexibility: {
    topic: "flexibility",
    pages: [10],
    answer: {
      fr: "Oui. Le donateur peut contacter SOS pour modifier le montant, suspendre temporairement ou arrêter sa contribution. Le soutien reste volontaire à chaque étape.",
      ar: "نعم. يمكن للمتبرع التواصل مع SOS لتعديل المبلغ أو تعليق المساهمة مؤقتًا أو إيقافها. ويبقى الدعم تطوعيًا في كل مرحلة.",
      en: "Yes. The donor can contact SOS to change the amount, temporarily suspend or stop the contribution. Support remains voluntary at every stage.",
    },
  },
  privacy: {
    topic: "privacy",
    pages: [6],
    answer: {
      fr: "Non. Les donateurs ne peuvent pas choisir un enfant individuellement identifié. Les informations personnelles des enfants sont protégées, et choisir un village ne signifie pas choisir un enfant précis.",
      ar: "لا. لا يمكن للمتبرعين اختيار طفل محدد بالهوية. معلومات الأطفال الشخصية محمية، واختيار قرية لا يعني اختيار طفل بعينه.",
      en: "No. Donors cannot choose an individually identified child. Children's personal information is protected, and choosing a village does not mean choosing a specific child.",
    },
  },
  cards: {
    topic: "cards",
    pages: [8, 13],
    answer: {
      fr: "Le paiement par carte bancaire n'est pas accepté pour la voie PAP : le prélèvement se fait depuis un compte courant tunisien autorisé. Le don en ligne général, qui est une voie distincte, peut utiliser une carte.",
      ar: "لا يُقبل الدفع بالبطاقة البنكية في مسار الاقتطاع: يتم السحب من حساب جارٍ تونسي مُفوَّض. أما التبرع العام عبر الإنترنت، وهو مسار مختلف، فيمكن أن يستخدم البطاقة.",
      en: "Card payment is not accepted for the PAP route: the debit is made from an authorised Tunisian current account. The separate general online donation may use a card.",
    },
  },
  mission: {
    topic: "mission",
    pages: [5],
    answer: {
      fr: "Les contributions PAP soutiennent l'ensemble des actions de SOS : soins, éducation, santé et renforcement des familles. Aucun coût précis n'est attribué à un enfant ou à un service particulier sans calcul officiel approuvé.",
      ar: "تدعم مساهمات الاقتطاع جميع أنشطة SOS: الرعاية والتعليم والصحة وتعزيز الأسر. ولا تُنسب أي تكلفة محددة إلى طفل أو خدمة معينة دون حساب رسمي معتمد.",
      en: "PAP contributions support all SOS work: care, education, health and family strengthening. No exact cost is attributed to a child or a particular service without an approved official calculation.",
    },
  },
  minimum: {
    topic: "minimum",
    pages: [17],
    answer: {
      fr: "Le guide ne confirme pas de minimum officiel actuel. Un montant de 10 DT a été mentionné dans un communiqué de presse historique d'octobre 2024, mais le formulaire examiné n'affichait pas de minimum. Ne considérez donc pas ce seuil comme la règle actuelle : vérifiez auprès de SOS Villages d'Enfants Tunisie.",
      ar: "الدليل لا يؤكد حدًا أدنى رسميًا حاليًا. ذُكر مبلغ 10 د.ت في بيان صحفي تاريخي من أكتوبر 2024، لكن الاستمارة التي فُحصت لم تُظهر حدًا أدنى. لذلك لا تعتبر هذا الحد هو القاعدة الحالية: تحقق مع قرى SOS للأطفال بتونس.",
      en: "The guide does not confirm a current official minimum. An amount of 10 DT was mentioned in a historical October 2024 press release, but the form reviewed displayed no minimum. Do not treat this threshold as the current rule: check with SOS Children's Villages Tunisia.",
    },
  },
  donation: {
    topic: "donation",
    pages: [13],
    answer: {
      fr: "Deux voies distinctes existent : le don en ligne général, qui peut utiliser une carte, et le parrainage PAP, qui repose sur un prélèvement mensuel automatique depuis un compte courant tunisien avec autorisation signée. Les démarches réelles se font sur les pages officielles de SOS Tunisie.",
      ar: "يوجد مساران مختلفان: التبرع العام عبر الإنترنت، الذي يمكن أن يستخدم البطاقة، وكفالة الاقتطاع، التي تعتمد على سحب شهري تلقائي من حساب جارٍ تونسي بتفويض موقّع. تتم الإجراءات الحقيقية على الصفحات الرسمية لـ SOS تونس.",
      en: "Two distinct routes exist: general online donation, which may use a card, and PAP sponsorship, which relies on an automatic monthly debit from a Tunisian current account with a signed authorisation. Real steps take place on the official SOS Tunisia pages.",
    },
  },
};

export const UNSUPPORTED_ANSWER: Localized = {
  fr: "Je ne trouve pas de confirmation fiable de cette information dans les ressources disponibles. Pour éviter de vous induire en erreur, veuillez contacter directement SOS Villages d'Enfants Tunisie.",
  ar: "لا أجد تأكيدًا موثوقًا لهذه المعلومة في المصادر المتاحة. لتجنب تضليلك، يرجى التواصل مباشرة مع قرى SOS للأطفال بتونس.",
  en: "I cannot find reliable confirmation of this information in the available resources. To avoid misleading you, please contact SOS Children's Villages Tunisia directly.",
};

export const KNOWLEDGE_DISCLAIMER: Localized = {
  fr: "Guide explicatif indépendant vérifié le 20 novembre 2026. Il ne s'agit pas d'une procédure interne officielle de SOS.",
  ar: "دليل توضيحي مستقل تم التحقق منه في 20 نوفمبر 2026. وهو ليس إجراءً داخليًا رسميًا لـ SOS.",
  en: "Independent explanatory guide checked on 20 November 2026. It is not an official internal SOS procedure.",
};
