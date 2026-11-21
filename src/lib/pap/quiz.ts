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

/**
 * Curated bank authored only from `sos-tunisie-pap-reference.md`. Each
 * `topic` matches a `QuizReferenceFact`, which also fixes the source page.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-definition",
    difficulty: "easy",
    topic: "definition",
    sourcePage: 4,
    question: {
      fr: "Quelle affirmation décrit correctement le PAP ?",
      ar: "أي عبارة تصف الاقتطاع التلقائي الدائم وصفًا صحيحًا؟",
      en: "Which statement correctly describes the PAP?",
    },
    options: [
      {
        fr: "Une contribution volontaire, prélevée automatiquement chaque mois",
        ar: "مساهمة تطوعية تُسحب تلقائيًا كل شهر",
        en: "A voluntary contribution, automatically debited every month",
      },
      {
        fr: "Un paiement unique, obligatoire et non récurrent",
        ar: "دفعة واحدة إلزامية وغير متكررة",
        en: "A mandatory one-off, non-recurring payment",
      },
      {
        fr: "Un prélèvement hebdomadaire effectué en espèces",
        ar: "سحب أسبوعي نقدي",
        en: "A weekly cash debit",
      },
      {
        fr: "Une carte bancaire dédiée aux dons",
        ar: "بطاقة بنكية مخصصة للتبرعات",
        en: "A bank card dedicated to donations",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Le PAP (Prélèvement Automatique Permanent) est une contribution volontaire et récurrente, prélevée automatiquement chaque mois. Ce n'est ni un don ponctuel ni un paiement obligatoire.",
      ar: "الاقتطاع التلقائي الدائم هو مساهمة تطوعية متكررة تُسحب تلقائيًا كل شهر. وهو ليس تبرعًا لمرة واحدة ولا دفعة إلزامية.",
      en: "PAP (Prélèvement Automatique Permanent) is a voluntary, recurring contribution automatically debited every month. It is neither a one-off donation nor a mandatory payment.",
    },
  },
  {
    id: "q-amount",
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
      { fr: "La banque", ar: "البنك", en: "The bank" },
      { fr: "SOS uniquement", ar: "SOS وحدها", en: "SOS only" },
      { fr: "Le village", ar: "القرية", en: "The village" },
    ],
    correct: 0,
    explanation: {
      fr: "Le donateur choisit librement le montant mensuel.",
      ar: "يختار المتبرع المبلغ الشهري بحرية.",
      en: "The donor freely chooses the monthly amount.",
    },
  },
  {
    id: "q-account",
    difficulty: "medium",
    topic: "account",
    sourcePage: 8,
    question: {
      fr: "Quel moyen de paiement la voie PAP utilise-t-elle ?",
      ar: "أي وسيلة دفع يستخدمها مسار الاقتطاع؟",
      en: "Which payment method does the PAP route use?",
    },
    options: [
      {
        fr: "Un prélèvement automatique depuis un compte courant tunisien",
        ar: "سحب تلقائي من حساب جارٍ تونسي",
        en: "An automatic debit from a Tunisian current account",
      },
      {
        fr: "Une carte bancaire, acceptée pour le PAP",
        ar: "بطاقة بنكية مقبولة للاقتطاع",
        en: "A bank card, accepted for PAP",
      },
      {
        fr: "Un paiement en espèces lors de l'inscription",
        ar: "دفع نقدي عند التسجيل",
        en: "A cash payment at registration",
      },
      {
        fr: "Un virement depuis un compte étranger",
        ar: "تحويل من حساب أجنبي",
        en: "A transfer from a foreign account",
      },
    ],
    correct: 0,
    explanation: {
      fr: "La voie PAP repose sur un prélèvement automatique depuis un compte courant tunisien autorisé, avec les coordonnées bancaires et le RIB. Le paiement par carte n'est pas accepté pour cette voie.",
      ar: "يعتمد مسار الاقتطاع على سحب تلقائي من حساب جارٍ تونسي مُفوَّض، مع المعطيات البنكية ووثيقة RIB. ولا يُقبل الدفع بالبطاقة البنكية في هذا المسار.",
      en: "The PAP route relies on an automatic debit from an authorised Tunisian current account, with the bank details and RIB. Card payment is not accepted for this route.",
    },
  },
  {
    id: "q-dates",
    difficulty: "medium",
    topic: "dates",
    sourcePage: 9,
    question: {
      fr: "Le prélèvement du 25 échoue faute de solde. Que prévoit le calendrier publié ?",
      ar: "فشل سحب اليوم 25 بسبب نقص الرصيد. ماذا ينصّ الجدول المنشور؟",
      en: "The 25th debit fails for insufficient funds. What does the published schedule provide?",
    },
    options: [
      {
        fr: "Une seconde tentative le 5 du mois suivant",
        ar: "محاولة ثانية في اليوم 5 من الشهر التالي",
        en: "A second attempt on the 5th of the following month",
      },
      {
        fr: "Une seconde tentative le 25 du même mois",
        ar: "محاولة ثانية في اليوم 25 من الشهر نفسه",
        en: "A second attempt on the 25th of the same month",
      },
      {
        fr: "Le montant échoué est reporté et cumulé le mois suivant",
        ar: "يُؤجَّل المبلغ الفاشل ويتراكم في الشهر التالي",
        en: "The failed amount is carried forward and added to the next month",
      },
      {
        fr: "Le prélèvement est remplacé par un paiement par carte",
        ar: "يُستبدل السحب بدفع بالبطاقة",
        en: "The debit is replaced by a card payment",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Le prélèvement normal a lieu le 25 de chaque mois. En cas de solde insuffisant, une seconde tentative est faite le 5 du mois suivant. Les prélèvements échoués ne sont pas cumulés et ne sont pas reportés.",
      ar: "يتم السحب العادي في اليوم 25 من كل شهر. وفي حال عدم كفاية الرصيد، تُجرى محاولة ثانية في اليوم 5 من الشهر التالي. ولا تتراكم السحوبات الفاشلة ولا تُؤجَّل.",
      en: "The normal debit takes place on the 25th of each month. If funds are insufficient, a second attempt is made on the 5th of the following month. Failed debits are not cumulative and are not carried forward.",
    },
  },
  {
    id: "q-privacy",
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
        fr: "Non, l'identité et les informations personnelles des enfants sont protégées",
        ar: "لا، هوية الأطفال ومعلوماتهم الشخصية محمية",
        en: "No, children's identities and personal information are protected",
      },
      {
        fr: "Oui, en choisissant un village",
        ar: "نعم، باختيار قرية",
        en: "Yes, by choosing a village",
      },
      {
        fr: "Oui, sur simple demande à SOS",
        ar: "نعم، بمجرد الطلب من SOS",
        en: "Yes, on simple request to SOS",
      },
      {
        fr: "Oui, en augmentant son montant mensuel",
        ar: "نعم، بزيادة المبلغ الشهري",
        en: "Yes, by increasing the monthly amount",
      },
    ],
    correct: 0,
    explanation: {
      fr: "Les donateurs ne peuvent pas choisir ni recevoir l'identité d'un enfant précis. Les informations personnelles des enfants sont protégées. Le sélecteur de village est un choix de zone, pas un choix d'enfant.",
      ar: "لا يمكن للمتبرعين اختيار طفل بعينه أو الحصول على هويته. معلومات الأطفال الشخصية محمية. واختيار القرية هو اختيار منطقة وليس اختيار طفل.",
      en: "Donors cannot choose or receive the identity of a specific child. Children's personal information is protected. The village selector is an area choice, not a child choice.",
    },
  },
];

export const QUIZ_DISTRIBUTION = {
  easy: 2,
  medium: 2,
  hard: 1,
} as const satisfies Record<Difficulty, number>;

export const QUIZ_LENGTH =
  QUIZ_DISTRIBUTION.easy + QUIZ_DISTRIBUTION.medium + QUIZ_DISTRIBUTION.hard;

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

/**
 * Returns a copy with the answer options permuted and `correct` remapped to
 * match, so the right answer is not tied to a fixed position in either bank.
 */
export function shuffleQuestionOptions<T extends QuizQuestion>(
  question: T,
  rng: () => number = Math.random,
): T {
  const order = shuffle(question.options.map((_, index) => index), rng);
  const options = order
    .map((index) => question.options[index])
    .filter((option): option is Localized => option !== undefined);

  return { ...question, options, correct: order.indexOf(question.correct) };
}

export function buildQuiz(
  rng: () => number = Math.random,
  pool: QuizQuestion[] = QUIZ_QUESTIONS,
): QuizQuestion[] {
  const byLevel = (level: Difficulty) =>
    shuffle(
      pool.filter((question) => question.difficulty === level),
      rng,
    ).slice(0, QUIZ_DISTRIBUTION[level]);

  return shuffle([...byLevel("easy"), ...byLevel("medium"), ...byLevel("hard")], rng).map(
    (question) => shuffleQuestionOptions(question, rng),
  );
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

const SEEN_PROMPT_LIMIT = 20;

export function questionFingerprint(question: QuizQuestion): string {
  return question.question.fr.trim().toLowerCase().replace(/\s+/g, " ");
}

export function appendSeenPrompt(seen: string[], question: QuizQuestion): string[] {
  const fingerprint = questionFingerprint(question);
  if (seen.includes(fingerprint)) return [...seen];
  return [...seen, fingerprint].slice(-SEEN_PROMPT_LIMIT);
}
