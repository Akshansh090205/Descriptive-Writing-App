const fs = require('fs');
const path = require('path');

const sets = [];

// Vocabulary Pools for variation
const subjects1 = ["manager", "auditor", "cashier", "CEO", "director", "advisor", "clerk", "consultant", "officer", "supervisor"];
const subjectsPlural = ["assistants", "clerks", "cashiers", "accountants", "investors", "team members", "advisors", "staff members"];
const bankNames = ["SBI", "RBI", "IBPS", "HDFC", "ICICI", "PNB", "BOB", "Axis Bank", "Canara Bank", "Union Bank"];
const loanTypes = ["education", "home", "car", "personal", "commercial", "agricultural", "business", "mortgage"];
const timePeriods = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "last month", "last quarter", "last fiscal year"];
const technology = ["cybersecurity system", "database server", "mobile banking app", "online portal", "payment gateway", "ATM network"];
const issues = ["transaction failures", "KYC compliance delays", "credit score drops", "loan defaults", "interest rate changes", "system downtime"];

// 1. Error Spotting Templates
const errorSpottingTemplates = [
  // Subject-Verb: along with
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    const sP = subjectsPlural[(setNum * qNum) % subjectsPlural.length];
    const bank = bankNames[(setNum + qNum * 3) % bankNames.length];
    const item = issues[(setNum * 2 + qNum) % issues.length];
    return {
      sentence: `The senior ${s1}, along with ${sP} (A) / are working on the ${bank} audit (B) / regarding recent ${item} (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `When a singular subject ("${s1}") is joined to another noun using "along with", the verb must remain singular. "are working" should be corrected to "is working".`,
      category: "subject_verb"
    };
  },
  // Nouns: advices/luggages
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum * 2) % subjects1.length];
    const time = timePeriods[(setNum + qNum) % timePeriods.length];
    return {
      sentence: `The branch ${s1} (A) / gave me several useful advices (B) / during our consultation on ${time} (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `The noun "advice" is uncountable and has no plural form "advices". It should be corrected to "pieces of advice" or simply "advice".`,
      category: "articles"
    };
  },
  // Preposition: senior than
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    const bank = bankNames[(setNum * qNum) % bankNames.length];
    return {
      sentence: `The newly recruited ${s1} (A) / is senior than all other officials (B) / in this department of ${bank} (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `Adjectives ending in "-ior" (like senior, junior, superior) take the preposition "to" instead of the conjunction "than". Correct form: "senior to".`,
      category: "prepositions"
    };
  },
  // Correlative: Hardly... than
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    const tech = technology[(setNum * qNum) % technology.length];
    return {
      sentence: `Hardly had the ${s1} (A) / updated the database for the ${tech} (B) / than the power grid shut down (C) / No error (D)`,
      correctAnswer: "C",
      explanation: `The correlative adverb "Hardly" must be paired with "when" (not "than"). Correct form: "when the power grid...".`,
      category: "agreement"
    };
  },
  // Subjunctive: If I was
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum * 4) % subjects1.length];
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `If I was the chief ${s1} (A) / of this regional office of ${bank}, (B) / I would modify the customer rules (C) / No error (D)`,
      correctAnswer: "A",
      explanation: `To express hypothetical or imaginary conditions in the subjunctive mood, "were" is used for all subjects. Correct form: "If I were...".`,
      category: "tenses"
    };
  },
  // Double Negative
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    const item = issues[(setNum * qNum) % issues.length];
    return {
      sentence: `The internal ${s1} (A) / could not find nothing wrong (B) / concerning the recent ${item} audit (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `This is a double negative error. "could not" should be paired with "anything" instead of "nothing". Correct form: "could not find anything wrong".`,
      category: "punctuation"
    };
  },
  // Subject-Verb: Neither... nor
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    const sP = subjectsPlural[(setNum * qNum) % subjectsPlural.length];
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `Neither the chief ${s1} (A) / nor the cashiers (B) / was present during the unexpected ${bank} audit (C) / No error (D)`,
      correctAnswer: "C",
      explanation: `When subjects are connected by "neither... nor", the verb agrees with the closer subject. "cashiers" is plural, so "was present" should be corrected to "were present".`,
      category: "subject_verb"
    };
  },
  // Pronoun: Each of... have
  (setNum, qNum) => {
    const sP = subjectsPlural[(setNum + qNum) % subjectsPlural.length];
    const tech = technology[(setNum * qNum) % technology.length];
    return {
      sentence: `Each of the new ${sP} (A) / have to complete their training (B) / on the digital safety of ${tech} (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `The phrase "Each of" requires a singular verb. "have to complete" should be corrected to "has to complete".`,
      category: "agreement"
    };
  },
  // Conjunction: Lest... would
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum * 3) % subjects1.length];
    return {
      sentence: `The trainee ${s1} worked diligently (A) / lest he would make mistakes (B) / in balancing the daily ledger books (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `The conjunction "lest" is always followed by a clause containing the modal auxiliary verb "should". Correct form: "lest he should make".`,
      category: "agreement"
    };
  },
  // Verb: Lay/Lie
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `The tired cashier (A) / has laid in the rest room (B) / since the morning shift started (C) / No error (D)`,
      correctAnswer: "B",
      explanation: `The verb "lie" (to recline) has the past participle "lain". "laid" is the past participle of the transitive verb "lay" (to place). Correct form: "has lain".`,
      category: "punctuation"
    };
  }
];

// 2. Fill in the Blanks Templates
const fillBlanksTemplates = [
  // comply with
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `All customer profiles in ${bank} must comply ________ the latest KYC verification rules.`,
      options: ["with", "by", "to", "for"],
      correctAnswer: "with",
      explanation: "The verb 'comply' always takes the preposition 'with'.",
      category: "prepositions"
    };
  },
  // refrain from
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum * 2) % subjects1.length];
    return {
      sentence: `The assistant ${s1} was instructed to refrain ________ discussing confidential loan information.`,
      options: ["to", "by", "from", "with"],
      correctAnswer: "from",
      explanation: "The verb 'refrain' is followed by the preposition 'from' and a gerund.",
      category: "prepositions"
    };
  },
  // a/an/the before unique consonant
  (setNum, qNum) => {
    const bank = bankNames[(setNum * qNum) % bankNames.length];
    return {
      sentence: `The board of ${bank} reached ________ unanimous agreement to lower digital transfer fees.`,
      options: ["a", "an", "the", "no article"],
      correctAnswer: "a",
      explanation: "We use 'a' before 'unanimous' because it begins with a consonant sound (/j/).",
      category: "articles"
    };
  },
  // Conditional: Third
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `If ${bank} ________ the interest rates earlier, they would have preserved their profit margins.`,
      options: ["raised", "had raised", "would raise", "has raised"],
      correctAnswer: "had raised",
      explanation: "This is a third conditional sentence. The 'if' clause requires the past perfect tense ('had raised') to pair with 'would have preserved'.",
      category: "tenses"
    };
  },
  // Conjunction: No sooner... than
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `No sooner did the ${s1} verify the token ________ the transaction went through.`,
      options: ["when", "then", "than", "as"],
      correctAnswer: "than",
      explanation: "The correlative conjunction 'No sooner' is always paired with 'than'.",
      category: "agreement"
    };
  },
  // Future Perfect: By the end of
  (setNum, qNum) => {
    const tech = technology[(setNum * qNum) % technology.length];
    return {
      sentence: `By the end of this fiscal year, the bank ________ the security modules for the ${tech}.`,
      options: ["upgrades", "will upgrade", "will have upgraded", "has upgraded"],
      correctAnswer: "will have upgraded",
      explanation: "We use the future perfect tense ('will have upgraded') to describe an action that will be completed by a certain future time.",
      category: "tenses"
    };
  },
  // Preposition: liable for
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum * 3) % bankNames.length];
    return {
      sentence: `${bank} is not liable ________ losses resulting from unauthorized sharing of PIN numbers.`,
      options: ["to", "for", "with", "on"],
      correctAnswer: "for",
      explanation: "The adjective 'liable' is followed by 'for' when referring to legal/financial responsibility.",
      category: "prepositions"
    };
  },
  // Subject-Verb: Number of
  (setNum, qNum) => {
    const loan = loanTypes[(setNum + qNum) % loanTypes.length];
    return {
      sentence: `The number of outstanding ${loan} loans ________ growing steadily over the past few years.`,
      options: ["are", "were", "is", "have been"],
      correctAnswer: "is",
      explanation: "'The number of' takes a singular verb ('is' or 'has been').",
      category: "subject_verb"
    };
  },
  // Article: silent H
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `The recruitment panel is looking for ________ honest officer to lead the vigilance cell.`,
      options: ["a", "an", "the", "no article"],
      correctAnswer: "an",
      explanation: "We use 'an' before 'honest' because it starts with a vowel sound (silent h).",
      category: "articles"
    };
  },
  // Verb: affect vs effect
  (setNum, qNum) => {
    return {
      sentence: `The sudden change in Repo Rate is bound to ________ the borrowing costs of banks.`,
      options: ["affect", "effect", "effection", "affection"],
      correctAnswer: "affect",
      explanation: "The verb 'affect' means 'to influence' or 'to act upon', which is correct here.",
      category: "punctuation"
    };
  }
];

// 3. Sentence Correction Templates
const sentenceCorrectionTemplates = [
  // Many a student
  (setNum, qNum) => {
    const loan = loanTypes[(setNum + qNum) % loanTypes.length];
    return {
      sentence: `Many a customer have complained about the delays in processing the ${loan} loan.`,
      options: [
        `Many a customer have complained`,
        `Many a customer has complained`,
        `Many customers has complained`,
        `Many a customers have complained`
      ],
      correctAnswer: `Many a customer has complained`,
      explanation: "The phrase 'many a' must be followed by a singular noun ('customer') and a singular verb ('has').",
      category: "subject_verb"
    };
  },
  // Scarcely... when
  (setNum, qNum) => {
    const s1 = subjects1[(setNum * qNum) % subjects1.length];
    return {
      sentence: `Scarcely had the senior ${s1} left the branch than the cyber alert was triggered.`,
      options: [
        `left the branch than the cyber alert was`,
        `left the branch when the cyber alert was`,
        `had left the branch than the cyber alert had`,
        `leaves the branch then the cyber alert is`
      ],
      correctAnswer: `left the branch when the cyber alert was`,
      explanation: "The negative adverb 'Scarcely' is paired with the conjunction 'when'.",
      category: "agreement"
    };
  },
  // Senior/Superior to
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `The newly promoted ${s1} is superior than his colleagues in handling clients.`,
      options: [
        `superior than his colleagues`,
        `superior to his colleagues`,
        `superior with his colleagues`,
        `superior from his colleagues`
      ],
      correctAnswer: `superior to his colleagues`,
      explanation: "The adjective 'superior' requires the preposition 'to' instead of 'than'.",
      category: "prepositions"
    };
  },
  // Neither of the candidates was
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum * 2) % bankNames.length];
    return {
      sentence: `Neither of the two branch managers were selected for the ${bank} international posting.`,
      options: [
        `managers were selected`,
        `managers was selected`,
        `manager were selected`,
        `managers had selected`
      ],
      correctAnswer: `managers was selected`,
      explanation: "The distributive pronoun 'Neither' is singular and requires the singular verb 'was selected'.",
      category: "subject_verb"
    };
  },
  // Lest he should
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `The assistant ${s1} locked the cash vault carefully lest he would forget it.`,
      options: [
        `lest he would forget it`,
        `lest he should forget it`,
        `lest he might forget it`,
        `lest he forgets it`
      ],
      correctAnswer: `lest he should forget it`,
      explanation: "The conjunction 'lest' is always followed by a clause containing the auxiliary verb 'should'.",
      category: "agreement"
    };
  },
  // Since + Past, Present Perfect
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `Since the bank opened its online gateway, digital transactions rose by fifty percent.`,
      options: [
        `digital transactions rose`,
        `digital transactions have risen`,
        `digital transactions rises`,
        `digital transactions had risen`
      ],
      correctAnswer: `digital transactions have risen`,
      explanation: "When using 'since' to denote a starting point in the past, the main clause verb should be in the present perfect tense ('have risen').",
      category: "tenses"
    };
  },
  // Between... and
  (setNum, qNum) => {
    const bank = bankNames[(setNum * qNum) % bankNames.length];
    return {
      sentence: `The main customer service desk at ${bank} operates between 10 AM to 4 PM.`,
      options: [
        `operates between 10 AM to 4 PM`,
        `operates between 10 AM and 4 PM`,
        `operates from 10 AM and 4 PM`,
        `operates between 10 AM with 4 PM`
      ],
      correctAnswer: `operates between 10 AM and 4 PM`,
      explanation: "The preposition 'between' is paired with the conjunction 'and'. Alternatively, use 'from 10 AM to 4 PM'.",
      category: "punctuation"
    };
  },
  // Dangling participle
  (setNum, qNum) => {
    const bank = bankNames[(setNum + qNum) % bankNames.length];
    return {
      sentence: `Having compiled the audit report, the ledger was sent to the ${bank} head office.`,
      options: [
        `the ledger was sent to the head office`,
        `the auditor sent the ledger to the head office`,
        `the ledger sent to the head office`,
        `the ledger has sent to the head office`
      ],
      correctAnswer: `the auditor sent the ledger to the head office`,
      explanation: "To correct a dangling participle, the subject of the main clause ('the auditor') must be the agent performing the action in the participle phrase ('Having compiled...').",
      category: "punctuation"
    };
  },
  // Angry with person
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `The board of directors was angry at the chief ${s1} for the audit failure.`,
      options: [
        `angry at the chief`,
        `angry with the chief`,
        `angry on the chief`,
        `angry to the chief`
      ],
      correctAnswer: `angry with the chief`,
      explanation: "We are 'angry with' a person and 'angry at' a situation or object. Since 'chief' is a person, 'angry with' is correct.",
      category: "prepositions"
    };
  },
  // As smart as
  (setNum, qNum) => {
    const s1 = subjects1[(setNum + qNum) % subjects1.length];
    return {
      sentence: `He is as competent, if not more competent than, the senior ${s1}.`,
      options: [
        `as competent, if not more competent than, the`,
        `as competent as, if not more competent than, the`,
        `competent as, if not more competent than, the`,
        `as competent as, if not competent than, the`
      ],
      correctAnswer: `as competent as, if not more competent than, the`,
      explanation: "The comparison structure requires the second 'as' to complete the phrase 'as competent as'.",
      category: "agreement"
    };
  }
];

// Generate 100 sets
for (let sIndex = 1; sIndex <= 100; sIndex++) {
  const setQuestions = [];

  // Generate 30 questions for this set
  // 10 Error spotting
  for (let q = 0; q < 10; q++) {
    const qData = errorSpottingTemplates[q](sIndex, q);
    setQuestions.push({
      id: `q-${sIndex}-${q + 1}`,
      type: "error_spotting",
      ...qData
    });
  }

  // 10 Fill blanks
  for (let q = 0; q < 10; q++) {
    const qData = fillBlanksTemplates[q](sIndex, q);
    setQuestions.push({
      id: `q-${sIndex}-${q + 11}`,
      type: "fill_blanks",
      ...qData
    });
  }

  // 10 Sentence correction
  for (let q = 0; q < 10; q++) {
    const qData = sentenceCorrectionTemplates[q](sIndex, q);
    setQuestions.push({
      id: `q-${sIndex}-${q + 21}`,
      type: "correction",
      ...qData
    });
  }

  sets.push({
    id: sIndex,
    name: `IBPS PO & SO English Practice Set ${sIndex}`,
    questions: setQuestions
  });
}

// Generate the output file
const fileContent = `export interface GrammarQuestion {
  id: string;
  type: 'correction' | 'fill_blanks' | 'error_spotting';
  sentence: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string;
  explanation: string;
  category: 'articles' | 'prepositions' | 'tenses' | 'subject_verb' | 'punctuation' | 'agreement';
}

export interface PracticeSet {
  id: number;
  name: string;
  questions: GrammarQuestion[];
}

export const practiceSets: PracticeSet[] = ${JSON.stringify(sets, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/grammarExercises.ts'), fileContent, 'utf-8');
console.log('Successfully generated 100 sets (3000 questions total) in grammarExercises.ts!');
