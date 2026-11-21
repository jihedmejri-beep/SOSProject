export type QuizReferenceFact = {
  id: string;
  section: number;
  page: number;
  text: string;
};

/**
 * Quiz facts condensed from `sos-tunisie-pap-reference.md` (checked 20 Nov
 * 2026). Each fact keeps the reference section and a guide page already used
 * by the knowledge base, so every generated question stays traceable.
 */
export const QUIZ_REFERENCE_FACTS: QuizReferenceFact[] = [
  {
    id: "definition",
    section: 1,
    page: 4,
    text: "PAP stands for Prélèvement Automatique Permanent: a voluntary recurring contribution supporting SOS Villages d'Enfants Tunisie, collected automatically every month from a Tunisian current account.",
  },
  {
    id: "amount",
    section: 1,
    page: 7,
    text: "The donor chooses the monthly amount.",
  },
  {
    id: "first-month",
    section: 1,
    page: 8,
    text: "The online form asks the donor to select the first month of debit.",
  },
  {
    id: "account",
    section: 1,
    page: 8,
    text: "PAP is paid by automatic debit from a Tunisian current account using the donor's bank details and RIB; bank-card payments are not accepted for this route.",
  },
  {
    id: "dates",
    section: 7,
    page: 9,
    text: "The normal debit is taken on the 25th of each month. If it fails for insufficient balance, a second attempt is made on the 5th of the following month.",
  },
  {
    id: "failed",
    section: 7,
    page: 9,
    text: "Failed debits are not cumulative: the missed amount is not carried forward.",
  },
  {
    id: "flexibility",
    section: 8,
    page: 10,
    text: "The donor can change the amount, pause temporarily or stop the contribution at any time by contacting SOS.",
  },
  {
    id: "privacy",
    section: 4,
    page: 6,
    text: "Donors cannot choose or receive the identity of a specific child; children's personal information is protected. The village/area selector is a location choice, not a choice of an individual child.",
  },
  {
    id: "mission",
    section: 3,
    page: 5,
    text: "Contributions support SOS work as a whole: care, education, health, family strengthening and community assistance. No exact cost is attributed to a particular child or service.",
  },
];
