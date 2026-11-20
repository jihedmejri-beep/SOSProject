import type { Dictionary } from "./fr";

export const en: Dictionary = {
  localeName: "English",
  htmlLang: "en",
  meta: {
    title: "PAP Revolution — SOS Children's Villages Tunisia",
    description:
      "Understand the Permanent Automatic Debit through an interactive educational experience.",
  },
  nav: {
    label: "Main navigation",
    impact: "Impact",
    pap: "PAP",
    quiz: "Quiz",
    assistant: "AI",
    donate: "Donate",
    impactLong: "The impact of a gesture",
    papLong: "Understanding PAP",
    quizLong: "PAP quiz",
    assistantLong: "AI assistant",
    donateLong: "Make a donation",
  },
  common: {
    close: "Close",
    cancel: "Cancel",
    continue: "Continue",
    next: "Next",
    back: "Back",
    reset: "Reset",
    retry: "Try again",
    send: "Send",
    loading: "Loading…",
    required: "Required field",
    source: "Source",
    page: "page",
    of: "of",
    step: "Step",
    simulation: "Educational simulation",
    verified: "Verified information",
    aiGenerated: "AI generated",
    demoProfile: "Demonstration profile",
    clear: "Clear",
    external: "opens the official website in a new tab",
  },
  welcome: {
    dialogLabel: "Welcome to the PAP experience",
    badge: "Educational experience",
    title: "Welcome to the PAP experience",
    subtitle:
      "Discover how regular support can help build a more stable future for children.",
    profileTab: "Create a demonstration profile",
    guestTab: "Continue as guest",
    firstName: "First name",
    firstNamePlaceholder: "Your first name",
    lastName: "Last name",
    lastNamePlaceholder: "Your last name",
    phone: "Phone number",
    phonePlaceholder: "e.g. 22 123 456",
    phoneHint: "Tunisian format: 8 digits, optionally prefixed with +216.",
    createProfile: "Continue",
    continueGuest: "Continue as guest",
    profileNote:
      "This profile is purely demonstrative. It is not an official SOS account. Your details stay in this page's memory and are never sent to a server.",
    guestNote:
      "As a guest you can explore all five tabs and the assistant. The full quiz is reserved for visitors with a demonstration profile.",
    profileCreatedTitle: "Your demonstration profile is ready",
    profileCreatedBody:
      "Welcome {name}. This profile stays local to this session: no real account has been created.",
    startExploring: "Start the experience",
    errors: {
      firstNameRequired: "Please enter your first name.",
      firstNameShort: "The first name must contain at least 2 characters.",
      lastNameRequired: "Please enter your last name.",
      lastNameShort: "The last name must contain at least 2 characters.",
      phoneRequired: "Please enter your phone number.",
      phoneInvalid:
        "Invalid number. Use 8 digits starting with 2, 4, 5, 7 or 9, with +216 if you wish.",
    },
  },
  impact: {
    kicker: "Tab 1 — The impact of a gesture",
    title: "A small regular gesture. Support that lasts.",
    subtitle:
      "Add symbolic contributions and watch the village grow, step by step. Every gesture matters, but no single gesture tells a real story.",
    sceneLabel: "Pixel-art village that evolves with symbolic contributions",
    stage: "Stage",
    stageNames: [
      "A first gesture",
      "A warmer environment",
      "Growing together",
      "A village coming to life",
      "A community being built",
    ],
    stageDescriptions: [
      "One child, a young plant and a calm space. The starting point of the experience.",
      "A welcoming home appears and the garden gains colour.",
      "More children join the scene: support becomes collective.",
      "The village expands with new shared spaces.",
      "A complete, warm and lively community.",
    ],
    amountLabel: "Symbolic simulation amount",
    amountNote:
      "Choose any fictional amount. No payment is made and no banking details are requested.",
    customLabel: "Custom amount",
    customPlaceholder: "e.g. 15",
    customError: "Enter an amount between 1 and 10,000 DT.",
    add: "Add to the experience",
    reset: "Reset the experience",
    totalLabel: "Symbolic total",
    interactionsLabel: "Gestures added",
    stageLabel: "Village stage",
    nextStage: "{count} more gesture(s) to the next stage.",
    maxStage: "The village is complete. You can reset and start again.",
    annualTitle: "Indicative annual comparison",
    annualBody:
      "{amount} DT per month would represent {annual} DT over 12 months in this simulation.",
    dailyTitle: "Daily budget example",
    dailyBody: "1 DT per day represents about 30 DT over 30 days.",
    dailyNote:
      "This is a daily budget example. PAP works through a monthly debit of the amount chosen by the donor, not a daily debit.",
    disclaimerTitle: "About this simulation",
    disclaimer:
      "This experience is an educational simulation. The amounts shown are fictional and do not represent a real expense attributed to a child or a specific service.",
    symbolNote:
      "The village illustrates the strength of collective, regular support. It does not represent the personal situation of a real child.",
    cta: "Understand how PAP works",
    childAlt: "Pixel-art child",
    reducedMotion: "Animations are reduced according to your device preferences.",
    addAnnounce: "Symbolic contribution added. Village stage {stage}.",
  },
  pap: {
    kicker: "Tab 2 — Understanding PAP",
    title: "Regular support, simply.",
    subtitle:
      "A guide walks you through the Permanent Automatic Debit step by step, without jargon and without commitment.",
    definitionKicker: "Definition",
    definitionTitle: "What is PAP?",
    definitionBody:
      "PAP stands for Prélèvement Automatique Permanent (Permanent Automatic Debit). It is a voluntary contribution automatically debited every month from a Tunisian current account, according to the amount chosen and authorised by the donor.",
    journeyKicker: "Donor journey",
    journeyTitle: "Six steps, guided with you",
    journeyHint: "Move at your own pace. This demonstration creates no real mandate.",
    stepLabel: "Step {current} of {total}",
    steps: [
      {
        title: "Discover",
        body:
          "SOS Children's Villages supports children and families. Recurring support makes long-term planning possible instead of relying on one-off gestures.",
      },
      {
        title: "Choose",
        body:
          "You freely choose the monthly amount. No amount is imposed by this demonstration.",
      },
      {
        title: "Understand the authorisation",
        body:
          "The real PAP procedure requires the donor's information, the amount in figures and words, a RIB and bank details, the first debit month, a personal authorisation and a signature. A Tunisian current account is required.",
      },
      {
        title: "Simulated SMS experience",
        body:
          "This is what a confirmation may look like. The message is entirely fictional: no real SMS is sent and no banking operation is performed.",
      },
      {
        title: "The monthly debit",
        body:
          "The normal debit takes place on the 25th. If the account has insufficient funds, a second attempt is made on the 5th of the following month. Failed debits are not cumulative.",
      },
      {
        title: "The choice remains with the donor",
        body:
          "The donor can contact SOS to change the amount, temporarily suspend or stop the contribution. Support remains voluntary.",
      },
    ],
    amountTitle: "Choose a monthly amount (simulation)",
    amountHint:
      "This amount only illustrates the journey. It is neither sent nor stored.",
    smsTitle: "Simulated notification",
    smsFrom: "SOS PAP — simulation",
    smsBody:
      "PAP SIMULATION - Your educational choice: {amount} DT per month. No banking operation has been performed.",
    smsConfirm: "Confirm my simulation",
    smsConfirmedTitle: "Simulation confirmed",
    smsConfirmedBody:
      "Your demonstration journey is complete. No mandate, debit or real SMS has been created.",
    smsDisclaimer:
      "Educational simulation - no real SMS, bank mandate or debit is created.",
    timelineTitle: "The monthly timeline",
    timelineHint: "Tap each point to display its detail.",
    timeline: [
      {
        label: "Authorisation",
        detail:
          "The donor completes and signs the authorisation with their information, amount and RIB.",
      },
      {
        label: "First month",
        detail: "The donor indicates the desired first debit month.",
      },
      {
        label: "The 25th",
        detail: "The normal debit is made on the 25th of each month.",
      },
      {
        label: "The following 5th",
        detail:
          "If funds are insufficient, a second attempt takes place on the 5th of the following month.",
      },
      {
        label: "Every month",
        detail:
          "The debit repeats monthly. Failures do not accumulate.",
      },
    ],
    accountTitle: "Which bank account is required?",
    accountBody:
      "For PAP, the automatic debit is made from a Tunisian current account. The donor authorises their bank to debit this account.",
    accountPoints: [
      "A Tunisian current account is required.",
      "The debit is authorised by the donor.",
      "The RIB and bank details are required.",
      "Card payment is not part of the PAP route.",
    ],
    privacyTitle: "Your support, their privacy",
    privacyBody:
      "PAP supports all of SOS's work: care, education, health and family strengthening. It does not give access to a particular child.",
    privacyPoints: [
      "No selection of an individually identified child.",
      "Children's personal information is protected.",
      "Choosing a village does not mean choosing a specific child.",
    ],
    cta: "Discover the PAP quiz",
    guideAlt: "Pixel-art human guide",
    restart: "Restart the journey",
    stepAnnounce: "PAP journey step {current}: {title}",
  },
  quiz: {
    kicker: "Tab 3 — PAP quiz",
    title: "Test your understanding of PAP",
    subtitle:
      "Six questions from a verified bank, with immediate correction and the source page for every answer.",
    gateTitle: "The quiz is reserved for demonstration profiles",
    gateBody:
      "The quiz is reserved for visitors with a demonstration profile.",
    gateCta: "Create my profile",
    startTitle: "Ready to check your knowledge?",
    startBody:
      "2 easy, 2 medium and 2 hard questions. You can restart as many times as you like.",
    startCta: "Start the quiz",
    level: "Level",
    levels: { easy: "Easy", medium: "Medium", hard: "Hard" },
    questionOf: "Question {current} of {total}",
    score: "Score",
    correct: "Correct answer",
    incorrect: "Incorrect answer",
    explanation: "Explanation",
    source: "Source",
    sourcePage: "PAP guide, page {page}",
    next: "Next question",
    seeResults: "See my results",
    resultsTitle: "Quiz result",
    resultsBody: "Your score: {score} out of {total}.",
    restart: "Restart",
    scoreOutOf: "{score} / {total}",
    verdictPerfect: "Excellent: your understanding of PAP is solid.",
    verdictGood: "Well done. Re-read the explanations to consolidate what remains.",
    verdictLow:
      "Keep exploring the PAP tab, then try the quiz again: every attempt moves you forward.",
    modeCurated: "Verified question bank",
    modeAi: "AI-enriched questions",
    generating: "Preparing questions…",
    loadingError:
      "New questions could not be loaded. The verified bank is used instead.",
    aiBadge: "AI",
    progressLabel: "Quiz progress",
    chooseAnswer: "Choose an answer, then validate.",
    submit: "Validate my answer",
    answered: "Answer recorded",
  },
  assistant: {
    kicker: "Tab 4 — AI assistant",
    title: "A question about PAP?",
    subtitle: "Ask your questions, we will help you understand.",
    welcome:
      "Hello! I answer only from verified resources about PAP. If an information is not confirmed, I will tell you clearly.",
    placeholder: "Write your PAP question…",
    send: "Send the question",
    suggestedTitle: "Frequently asked questions",
    suggestions: [
      "What exactly is PAP?",
      "Can I stop my debit?",
      "When is the debit date?",
      "What type of bank account is required?",
      "Can I choose a child?",
      "What happens if my account lacks funds?",
    ],
    thinking: "Searching the verified sources…",
    modeAi: "AI answers generated from verified sources",
    modeCurated: "Demonstration mode: answers from the verified base",
    citations: "Sources",
    statusOfficial: "Official",
    statusHistorical: "Historical",
    statusEducational: "Explanation",
    sourcePage: "PAP guide, page {page}",
    disclaimer:
      "This assistant is educational. It creates no mandate, processes no payment and does not replace the official information of SOS Children's Villages Tunisia.",
    errorTitle: "The answer could not be loaded",
    errorBody:
      "Check your connection and try again. The verified knowledge base remains available offline.",
    retry: "Try again",
    clear: "Clear the conversation",
    you: "You",
    assistant: "PAP assistant",
    noCitations: "No precise source was found.",
    unsupportedTitle: "Unconfirmed information",
  },
  donate: {
    kicker: "Tab 5 — Make a donation",
    title: "Choose the official route that suits you",
    subtitle:
      "This demonstration processes no payment. All real steps take place on the official pages of SOS Children's Villages Tunisia.",
    onlineKicker: "One-off or online donation",
    onlineTitle: "Donate on the official website",
    onlineBody:
      "General online donations may use card payment. This is a distinct route from PAP sponsorship.",
    onlineCta: "Donate on the official website",
    papKicker: "Recurring sponsorship",
    papTitle: "Discover the official PAP debit",
    papBody:
      "PAP sponsorship relies on an automatic monthly debit from a Tunisian current account, with a signed authorisation. No bank card is used for this route.",
    papCta: "Discover the official PAP debit",
    differenceTitle: "Do not confuse the two routes",
    differenceIntro:
      "Both approaches support SOS, but their administrative and banking processes differ.",
    rows: [
      { label: "Payment method", online: "Bank card possible", pap: "Automatic debit" },
      { label: "Frequency", online: "According to your donation", pap: "Every month" },
      { label: "Account required", online: "According to the official page", pap: "Tunisian current account" },
      { label: "Authorisation", online: "Online payment", pap: "Signed form with RIB" },
    ],
    noteTitle: "No payment in this demonstration",
    note:
      "This application contains no payment gateway and displays no fake financial success screen. Real donations are made exclusively on the official SOS website.",
    officialTitle: "Official pages",
    officialBody:
      "Always verify information on the official pages before taking any step.",
    sourcesTitle: "Useful links",
    linkHome: "Official SOS Tunisia website",
    linkPap: "PAP sponsorship",
    linkDon: "Online donation",
    linkInscription: "SOS registration area",
    independent:
      "This educational experience is independent and does not replace the official procedures of SOS Children's Villages Tunisia.",
  },
  footer: {
    disclaimer:
      "Independent educational experience. No bank mandate, debit or real SMS is created.",
    independence:
      "Information comes from an independent explanatory guide checked on 20 November 2026 and from official public pages. It is not an official internal SOS procedure.",
    sources: "Public sources",
    madeFor: "Designed for SOS Children's Villages Tunisia — PAP Revolution challenge.",
  },
  a11y: {
    skip: "Skip to main content",
    navLabel: "Five-tab navigation",
    langLabel: "Choose language",
    dialogLabel: "Welcome dialog",
    closeDialog: "Close the welcome dialog",
    progress: "Progress",
    scene: "Decorative pixel-art illustration",
    previousTab: "Previous tab",
    nextTab: "Next tab",
  },
};
