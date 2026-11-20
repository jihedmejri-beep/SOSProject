import type { Localized } from "@/lib/i18n/localized";

export type Difficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  difficulty: Difficulty;
  topic: string;
  sourcePage: number;
  question: Localized;
  options: Localized[];
  correct: number;
  explanation: Localized;
  aiGenerated?: boolean;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-meaning",
    difficulty: "easy",
    topic: "definition",
    sourcePage: 4,
    question: {
      fr: "Que signifie PAP ?",
      ar: "ماذا يعني الاقتطاع التلقائي الدائم (PAP)؟",
      en: "What does PAP stand for?",
    },
    options: [
      {
        fr: "Prélèvement Automatique Permanent",
        ar: "الاقتطاع التلقائي الدائم",
        en: "Prélèvement Automatique Permanent (Permanent Automatic Debit)",
      },
      {
        fr: "Paiement Annuel Programmé",
        ar: "الدفع السنوي المبرمج",
        en: "Scheduled Annual Payment",
      },
      {
        fr: "Parrainage Automatique Ponctuel",
        ar: "الكفالة التلقائية الظرفية",
        en: "One-off Automatic Sponsorship",
      },
      {
        fr: "Prêt Aidé Personnel",
        ar: "قرض شخصي مدعوم",
        en: "Personal Assisted Loan",
      },
    ],
    correct: 0,
    explanation: {
      fr: "PAP signifie Prélèvement Automatique Permanent : une contribution volontaire récurrente, prélevée chaque mois selon le montant choisi par le donateur.",
      ar: "الاقتطاع التلقائي الدائم هو مساهمة تطوعية متكررة تُسحب كل شهر وفق المبلغ الذي يختاره المتبرع.",
      en: "PAP stands for Prélèvement Automatique Permanent: a recurring voluntary contribution debited every month according to the amount chosen by the donor.",
    },
  },
  {
    id: "q-frequency",
    difficulty: "easy",
    topic: "monthly",
    sourcePage: 4,
    question: {
      fr: "À quelle fréquence le PAP est-il prélevé ?",
      ar: "ما وتيرة السحب في الاقتطاع التلقائي الدائم؟",
      en: "How often is the PAP debit made?",
    },
    options: [
      { fr: "Chaque mois", ar: "كل شهر", en: "Every month" },
      { fr: "Une seule fois", ar: "مرة واحدة فقط", en: "Only once" },
      { fr: "Chaque semaine", ar: "كل أسبوع", en: "Every week" },
      { fr: "Chaque jour", ar: "كل يوم", en: "Every day" },
    ],
    correct: 0,
    explanation: {
      fr: "Le PAP est une contribution mensuelle récurrente, et non un don ponctuel ou quotidien.",
      ar: "الاقتطاع مساهمة شهرية متكررة، وليس تبرعًا لمرة واحدة أو يوميًا.",
      en: "PAP is a recurring monthly contribution, not a one-off or daily donation.",
    },
  },
  {
    id: "q-account",
    difficulty: "easy",
    topic: "account",
    sourcePage: 8,
    question: {
      fr: "Quel type de compte est nécessaire pour la voie PAP ?",
      ar: "أي نوع من الحسابات يلزم لمسار الاقتطاع؟",
      en: "Which type of account is required for the PAP route?",
    },
    options: [
      {
        fr: "Un compte courant tunisien",
        ar: "حساب جارٍ تونسي",
        en: "A Tunisian current account",
      },
      {
        fr: "Une carte bancaire internationale",
        ar: "بطاقة بنكية دولية",
        en: "An international bank card",
      },
      {
        fr: "Un compte à l'étranger",
        ar: "حساب في الخارج",
        en: "A foreign account",
      },
      { fr: "Aucun compte", ar: "لا حاجة إلى أي حساب", en: "No account at all" },
    ],
    correct: 0,
    explanation: {
      fr: "La voie PAP actuelle exige un compte courant tunisien : le donateur autorise sa banque à débiter ce compte.",
      ar: "يتطلب مسار الاقتطاع الحالي حسابًا جاريًا تونسيًا: إذ يأذن المتبرع لبنكه بسحب المبلغ من هذا الحساب.",
      en: "The current PAP route requires a Tunisian current account: the donor authorises their bank to debit it.",
    },
  },
  {
    id: "q-amount-choice",
    difficulty: "easy",
    topic: "amount",
    sourcePage: 7,
    question: {
      fr: "Qui choisit le montant mensuel du PAP ?",
      ar: "من يختار المبلغ الشهري للاقتطاع؟",
      en: "Who chooses the monthly PAP amount?",
    },
    options: [
      { fr: "Le donateur", ar: "المتبرع", en: "The donor" },
      { fr: "SOS uniquement", ar: "SOS وحدها", en: "SOS only" },
      { fr: "La banque", ar: "البنك", en: "The bank" },
      { fr: "Le village", ar: "القرية", en: "The village" },
    ],
    correct: 0,
    explanation: {
      fr: "Le donateur choisit librement le montant mensuel. Aucun montant n'est imposé par cette démonstration.",
      ar: "يختار المتبرع المبلغ الشهري بحرية. ولا تفرض هذه المحاكاة أي مبلغ.",
      en: "The donor freely chooses the monthly amount. No amount is imposed by this demonstration.",
    },
  },
  {
    id: "q-debit-day",
    difficulty: "medium",
    topic: "dates",
    sourcePage: 9,
    question: {
      fr: "Quel est le jour du prélèvement normal ?",
      ar: "ما هو يوم السحب العادي؟",
      en: "What is the normal debit day?",
    },
    options: [
      { fr: "Le 25", ar: "اليوم 25", en: "The 25th" },
      { fr: "Le 1er", ar: "اليوم 1", en: "The 1st" },
      { fr: "Le 5", ar: "اليوم 5", en: "The 5th" },
      { fr: "Le 30", ar: "اليوم 30", en: "The 30th" },
    ],
    correct: 0,
    explanation: {
      fr: "Le prélèvement normal est effectué le 25 de chaque mois.",
      ar: "يتم السحب العادي في اليوم 25 من كل شهر.",
      en: "The normal debit is made on the 25th of each month.",
    },
  },
  {
    id: "q-retry-day",
    difficulty: "medium",
    topic: "dates",
    sourcePage: 9,
    question: {
      fr: "En cas de solde insuffisant, quand a lieu la seconde tentative ?",
      ar: "في حال عدم كفاية الرصيد، متى تُجرى المحاولة الثانية؟",
      en: "If funds are insufficient, when does the second attempt take place?",
    },
    options: [
      {
        fr: "Le 5 du mois suivant",
        ar: "اليوم 5 من الشهر التالي",
        en: "The 5th of the following month",
      },
      {
        fr: "Le 25 du même mois",
        ar: "اليوم 25 من الشهر نفسه",
        en: "The 25th of the same month",
      },
      {
        fr: "Le 10 du mois suivant",
        ar: "اليوم 10 من الشهر التالي",
        en: "The 10th of the following month",
      },
      {
        fr: "Aucune seconde tentative",
        ar: "لا توجد محاولة ثانية",
        en: "There is no second attempt",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Une seconde tentative est faite le 5 du mois suivant lorsque le solde était insuffisant.",
      ar: "تُجرى محاولة ثانية في اليوم 5 من الشهر التالي عندما لا يكون الرصيد كافيًا.",
      en: "A second attempt is made on the 5th of the following month when funds were insufficient.",
    },
  },
  {
    id: "q-cumulative",
    difficulty: "medium",
    topic: "failed",
    sourcePage: 9,
    question: {
      fr: "Les prélèvements échoués sont-ils cumulés ?",
      ar: "هل تتراكم السحوبات الفاشلة؟",
      en: "Do failed debits accumulate?",
    },
    options: [
      { fr: "Non", ar: "لا", en: "No" },
      {
        fr: "Oui, ils sont doublés",
        ar: "نعم، تتضاعف",
        en: "Yes, they are doubled",
      },
      {
        fr: "Oui, en fin d'année",
        ar: "نعم، في نهاية السنة",
        en: "Yes, at the end of the year",
      },
      {
        fr: "Seulement si le solde est négatif",
        ar: "فقط إذا كان الرصيد سالبًا",
        en: "Only if the balance is negative",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Les prélèvements échoués ne sont pas cumulés : le montant non prélevé ne s'ajoute pas aux mois suivants.",
      ar: "لا تتراكم السحوبات الفاشلة: المبلغ غير المسحوب لا يُضاف إلى الأشهر التالية.",
      en: "Failed debits are not cumulative: the amount not debited is not added to following months.",
    },
  },
  {
    id: "q-first-month",
    difficulty: "medium",
    topic: "first-month",
    sourcePage: 8,
    question: {
      fr: "Qui choisit le premier mois de prélèvement ?",
      ar: "من يختار أول شهر للسحب؟",
      en: "Who chooses the first debit month?",
    },
    options: [
      { fr: "Le donateur", ar: "المتبرع", en: "The donor" },
      { fr: "La banque", ar: "البنك", en: "The bank" },
      { fr: "SOS", ar: "SOS", en: "SOS" },
      {
        fr: "Le premier lundi du mois",
        ar: "أول اثنين من الشهر",
        en: "The first Monday of the month",
      },
    ],
    correct: 0,
    explanation: {
      fr: "L'autorisation PAP permet au donateur d'indiquer le premier mois de prélèvement souhaité.",
      ar: "يتيح تفويض الاقتطاع للمتبرع تحديد أول شهر للسحب.",
      en: "The PAP authorisation lets the donor indicate the desired first debit month.",
    },
  },
  {
    id: "q-child-privacy",
    difficulty: "hard",
    topic: "privacy",
    sourcePage: 6,
    question: {
      fr: "Un donateur peut-il choisir un enfant précis ?",
      ar: "هل يمكن للمتبرع اختيار طفل بعينه؟",
      en: "Can a donor choose a specific child?",
    },
    options: [
      {
        fr: "Non, les informations personnelles des enfants sont protégées",
        ar: "لا، معلومات الأطفال الشخصية محمية",
        en: "No, children's personal information is protected",
      },
      {
        fr: "Oui, sur simple demande",
        ar: "نعم، بمجرد الطلب",
        en: "Yes, on simple request",
      },
      {
        fr: "Oui, en choisissant un village",
        ar: "نعم، باختيار قرية",
        en: "Yes, by choosing a village",
      },
      {
        fr: "Oui, avec un montant plus élevé",
        ar: "نعم، بمبلغ أعلى",
        en: "Yes, with a higher amount",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Les donateurs ne peuvent pas choisir un enfant individuellement identifié. Choisir un village ne signifie pas choisir un enfant précis.",
      ar: "لا يمكن للمتبرعين اختيار طفل محدد بالهوية. واختيار قرية لا يعني اختيار طفل بعينه.",
      en: "Donors cannot choose an individually identified child. Choosing a village does not mean choosing a specific child.",
    },
  },
  {
    id: "q-flexibility",
    difficulty: "hard",
    topic: "flexibility",
    sourcePage: 10,
    question: {
      fr: "Comment modifier, suspendre ou arrêter sa contribution ?",
      ar: "كيف يمكن تعديل المساهمة أو تعليقها أو إيقافها؟",
      en: "How can a contribution be changed, paused or stopped?",
    },
    options: [
      {
        fr: "En contactant SOS",
        ar: "بالتواصل مع SOS",
        en: "By contacting SOS",
      },
      {
        fr: "En fermant son compte bancaire",
        ar: "بإغلاق الحساب البنكي",
        en: "By closing the bank account",
      },
      {
        fr: "Uniquement par carte bancaire",
        ar: "بالبطاقة البنكية فقط",
        en: "Only by bank card",
      },
      { fr: "Impossible", ar: "مستحيل", en: "It is impossible" },
    ],
    correct: 0,
    explanation: {
      fr: "Le donateur peut contacter SOS pour modifier le montant, suspendre temporairement ou arrêter sa contribution.",
      ar: "يمكن للمتبرع التواصل مع SOS لتعديل المبلغ أو تعليق المساهمة مؤقتًا أو إيقافها.",
      en: "The donor can contact SOS to change the amount, temporarily suspend or stop the contribution.",
    },
  },
  {
    id: "q-card",
    difficulty: "hard",
    topic: "cards",
    sourcePage: 8,
    question: {
      fr: "Le paiement par carte bancaire est-il accepté pour la voie PAP ?",
      ar: "هل يُقبل الدفع بالبطاقة البنكية في مسار الاقتطاع؟",
      en: "Is card payment accepted for the PAP route?",
    },
    options: [
      { fr: "Non", ar: "لا", en: "No" },
      { fr: "Oui, toujours", ar: "نعم، دائمًا", en: "Yes, always" },
      {
        fr: "Oui, avec 3D Secure",
        ar: "نعم، مع 3D Secure",
        en: "Yes, with 3D Secure",
      },
      {
        fr: "Oui, en dessous de 20 DT",
        ar: "نعم، أقل من 20 د.ت",
        en: "Yes, below 20 DT",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Le paiement par carte n'est pas accepté pour la voie PAP : le prélèvement se fait depuis un compte courant tunisien autorisé.",
      ar: "لا يُقبل الدفع بالبطاقة في مسار الاقتطاع: يتم السحب من حساب جارٍ تونسي مُفوَّض.",
      en: "Card payment is not accepted for the PAP route: the debit is made from an authorised Tunisian current account.",
    },
  },
  {
    id: "q-mission",
    difficulty: "hard",
    topic: "mission",
    sourcePage: 5,
    question: {
      fr: "Que soutiennent les contributions PAP ?",
      ar: "ماذا تدعم مساهمات الاقتطاع؟",
      en: "What do PAP contributions support?",
    },
    options: [
      {
        fr: "L'ensemble des actions de SOS : soins, éducation, santé et renforcement des familles",
        ar: "جميع أنشطة SOS: الرعاية والتعليم والصحة وتعزيز الأسر",
        en: "All SOS work: care, education, health and family strengthening",
      },
      {
        fr: "Uniquement les repas d'un enfant",
        ar: "وجبات طفل واحد فقط",
        en: "Only one child's meals",
      },
      {
        fr: "Uniquement les bâtiments",
        ar: "المباني فقط",
        en: "Only buildings",
      },
      {
        fr: "Uniquement les salaires",
        ar: "الرواتب فقط",
        en: "Only salaries",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Les contributions soutiennent les actions de SOS dans leur ensemble. Aucun coût précis n'est attribué à un enfant ou à un service particulier.",
      ar: "تدعم المساهمات أنشطة SOS ككل. ولا تُنسب أي تكلفة محددة إلى طفل أو خدمة معينة.",
      en: "Contributions support SOS work as a whole. No exact cost is attributed to a particular child or service.",
    },
  },
];

export const QUESTIONS_PER_LEVEL = 2;
export const QUIZ_LENGTH = QUESTIONS_PER_LEVEL * 3;

export function questionsByDifficulty(difficulty: Difficulty): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((question) => question.difficulty === difficulty);
}

/** Deterministic-free shuffle helper; injectable RNG keeps tests stable. */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = copy[i];
    const target = copy[j];
    if (current === undefined || target === undefined) continue;
    copy[i] = target;
    copy[j] = current;
  }
  return copy;
}

export function buildQuiz(
  rng: () => number = Math.random,
  pool: QuizQuestion[] = QUIZ_QUESTIONS,
): QuizQuestion[] {
  const byLevel = (level: Difficulty) =>
    shuffle(
      pool.filter((question) => question.difficulty === level),
      rng,
    ).slice(0, QUESTIONS_PER_LEVEL);

  return shuffle([...byLevel("easy"), ...byLevel("medium"), ...byLevel("hard")], rng);
}

export function scoreQuiz(
  answers: Record<string, number>,
  questions: QuizQuestion[],
): { score: number; total: number } {
  let score = 0;
  for (const question of questions) {
    if (answers[question.id] === question.correct) score += 1;
  }
  return { score, total: questions.length };
}
