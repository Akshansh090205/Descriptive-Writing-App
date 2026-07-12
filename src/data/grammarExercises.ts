export interface GrammarQuestion {
  id: string;
  type: 'correction' | 'fill_blanks' | 'error_spotting';
  sentence: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string;
  explanation: string;
  category: 'articles' | 'prepositions' | 'tenses' | 'subject_verb' | 'punctuation' | 'agreement';
}

export const grammarQuestions: GrammarQuestion[] = [
  {
    id: 'g-1',
    type: 'error_spotting',
    sentence: 'The Board of Directors (A) / are meeting tomorrow (B) / to discuss the bank merger (C) / No error (D)',
    correctAnswer: 'B',
    explanation: 'The subject "Board of Directors" is a collective noun acting as a single unit, so it takes a singular verb. "are meeting" should be replaced with "is meeting".',
    category: 'subject_verb'
  },
  {
    id: 'g-2',
    type: 'fill_blanks',
    sentence: 'The reserve bank has been monitoring inflation rates ________ the beginning of the fiscal quarter.',
    options: ['for', 'from', 'since', 'during'],
    correctAnswer: 'since',
    explanation: 'We use "since" to denote a specific starting point in time ("the beginning of the fiscal quarter") when using present perfect continuous tense ("has been monitoring").',
    category: 'prepositions'
  },
  {
    id: 'g-3',
    type: 'correction',
    sentence: 'Scarcely had the ATM dispensed the cash than the power failed.',
    options: [
      'Scarcely had the ATM dispensed the cash than the power failed',
      'Scarcely had the ATM dispensed the cash when the power failed',
      'Scarcely did the ATM dispensed the cash then the power failed',
      'Scarcely had the ATM dispensed the cash then the power failed'
    ],
    correctAnswer: 'Scarcely had the ATM dispensed the cash when the power failed',
    explanation: 'The correlative conjunction combination is "Scarcely... when" or "Hardly... when". Using "than" is grammatically incorrect (which pairs with "No sooner... than").',
    category: 'agreement'
  },
  {
    id: 'g-4',
    type: 'error_spotting',
    sentence: 'Neither the bank manager (A) / nor the cashiers (B) / was present during the inspection (C) / No error (D)',
    correctAnswer: 'C',
    explanation: 'When two subjects are joined by "neither... nor", the verb agrees with the subject closest to it. Here, "cashiers" (plural) is closer to the verb, so "was present" must be corrected to "were present".',
    category: 'subject_verb'
  },
  {
    id: 'g-5',
    type: 'fill_blanks',
    sentence: 'Could you please explain the guidelines ________ educational loans in detail?',
    options: ['for', 'about', 'on', 'with'],
    correctAnswer: 'for',
    explanation: 'In banking contexts, "guidelines for [a service/loan]" is the idiomatic preposition choice when specifying the purpose of guidelines.',
    category: 'prepositions'
  },
  {
    id: 'g-6',
    type: 'correction',
    sentence: 'Each of the account holders have to complete their KYC documentation before Friday.',
    options: [
      'Each of the account holders have to complete their KYC',
      'Each of the account holders has to complete his or her KYC',
      'Each of the account holder have to complete their KYC',
      'Every account holders has to complete their KYC'
    ],
    correctAnswer: 'Each of the account holders has to complete his or her KYC',
    explanation: '"Each of" is followed by a plural noun ("account holders") but requires a singular verb ("has") and singular pronouns ("his or her").',
    category: 'agreement'
  },
  {
    id: 'g-7',
    type: 'error_spotting',
    sentence: 'If I was the Governor of the RBI (A) / I would decrease the repo rate (B) / to stimulate economic growth (C) / No error (D)',
    correctAnswer: 'A',
    explanation: 'This is a subjunctive statement expressing an imaginary or hypothetical condition. In the subjunctive mood, "were" is used instead of "was" for all subjects. Correct form: "If I were the Governor..."',
    category: 'tenses'
  },
  {
    id: 'g-8',
    type: 'fill_blanks',
    sentence: 'The loan applicant was disqualified because he did not comply ________ the credit score requirements.',
    options: ['with', 'to', 'by', 'for'],
    correctAnswer: 'with',
    explanation: 'The verb "comply" always takes the preposition "with" to denote obeying or adhering to a rule.',
    category: 'prepositions'
  }
];
