const fs = require('fs');
const path = require('path');

const questions = [];

// Helper to push questions
function addQuestion(type, sentence, options, correctAnswer, explanation, category) {
  const id = `g-${questions.length + 1}`;
  questions.push({ id, type, sentence, options, correctAnswer, explanation, category });
}

// 1. Subject-Verb Agreement questions (17 questions)
addQuestion(
  'error_spotting',
  'The manager, along with his assistants (A) / are reviewing the suspicious transactions (B) / that occurred during the weekend (C) / No error (D)',
  null,
  'B',
  'When a subject is joined with other nouns/pronouns using "along with", "together with", "as well as", or "in addition to", the verb agrees with the first subject ("the manager", which is singular). "are" should be replaced by "is".',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'Most of the liquidity (A) / in the public sector banks (B) / have been absorbed by the new treasury bonds (C) / No error (D)',
  null,
  'C',
  'The noun "liquidity" is uncountable, so "most of the liquidity" is singular. The plural verb "have been" must be replaced with the singular verb "has been".',
  'subject_verb'
);

addQuestion(
  'fill_blanks',
  'Neither the Deputy Governor nor the board members ________ satisfied with the current asset classification norms.',
  ['was', 'were', 'is', 'has'],
  'were',
  'When subjects are joined by "neither... nor" or "either... or", the verb agrees with the nearer subject. Here, "board members" is plural, so we use the plural verb "were".',
  'subject_verb'
);

addQuestion(
  'correction',
  'A series of seminars on digital banking security was conducted for the branch staff.',
  [
    'A series of seminars on digital banking security was conducted',
    'A series of seminars on digital banking security were conducted',
    'Series of seminars on digital banking security has conducted',
    'A series of seminars in digital banking security were conducted'
  ],
  'A series of seminars on digital banking security was conducted',
  'The subject is "A series" (singular collective noun phrase), which takes the singular verb "was". "Seminars" is the object of the preposition.',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'The number of loan defaults (A) / have decreased significantly (B) / after the implementation of the strict credit check (C) / No error (D)',
  null,
  'B',
  'The expression "the number of" takes a singular verb ("has"), whereas "a number of" takes a plural verb ("have"). "have decreased" should be "has decreased".',
  'subject_verb'
);

addQuestion(
  'fill_blanks',
  'Every manager and clerk in the metropolitan branches ________ required to undergo the cyber security training.',
  ['are', 'were', 'is', 'have'],
  'is',
  'When two singular nouns are joined by "and" but preceded by "each" or "every", they take a singular verb. The correct answer is "is".',
  'subject_verb'
);

addQuestion(
  'correction',
  'Two-thirds of the bank building were damaged during the flash floods last year.',
  [
    'Two-thirds of the bank building were damaged',
    'Two-thirds of the bank building was damaged',
    'Two-third of the bank building were damaged',
    'Two-thirds of the bank building has damaged'
  ],
  'Two-thirds of the bank building was damaged',
  'For fractions or percentages, the verb agrees with the noun in the prepositional phrase. "bank building" is singular, so we use the singular verb "was damaged".',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'One of the major problems (A) / that the banking sector faces (B) / are the rise in non-performing assets (C) / No error (D)',
  null,
  'C',
  'The subject of the sentence is "One" (singular), so the verb should be singular. "are the rise" should be corrected to "is the rise".',
  'subject_verb'
);

addQuestion(
  'fill_blanks',
  'Three thousand rupees ________ a very nominal processing fee for this commercial loan application.',
  ['are', 'is', 'were', 'have been'],
  'is',
  'When a specific amount of money is treated as a single sum or unit, it takes a singular verb. Correct answer is "is".',
  'subject_verb'
);

addQuestion(
  'correction',
  'The behavior of the customers regarding digital deposits are quite unpredictable.',
  [
    'The behavior of the customers regarding digital deposits are',
    'The behavior of the customers regarding digital deposits is',
    'The behaviors of the customers regarding digital deposits are',
    'The behavior of customer regarding digital deposits are'
  ],
  'The behavior of the customers regarding digital deposits is',
  'The true grammatical subject of the sentence is the singular noun "behavior", which requires the singular verb "is".',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'Either the clerk (A) / or the cashier (B) / have misplaced the cash book (C) / No error (D)',
  null,
  'C',
  'When two singular subjects are connected by "or" or "nor", we use a singular verb. "have misplaced" should be replaced by "has misplaced".',
  'subject_verb'
);

addQuestion(
  'fill_blanks',
  'The quality of service provided in the public sector banks ________ improved over the last few years.',
  ['have', 'has', 'are', 'were'],
  'has',
  'The subject of the sentence is "quality" (singular), so it requires the singular auxiliary verb "has" to form the present perfect tense.',
  'subject_verb'
);

addQuestion(
  'correction',
  'Many a student have applied for the educational subsidy loan this term.',
  [
    'Many a student have applied',
    'Many a student has applied',
    'Many students has applied',
    'Many a students have applied'
  ],
  'Many a student has applied',
  'The idiom "many a" is followed by a singular countable noun and a singular verb. Hence, "many a student has applied" is correct.',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'A pair of safety deposit keys (A) / were found near the vault entrance (B) / by the security guard yesterday (C) / No error (D)',
  null,
  'B',
  'The subject is "A pair" which is singular, so it takes a singular verb. "were found" should be changed to "was found".',
  'subject_verb'
);

addQuestion(
  'fill_blanks',
  'The jury ________ divided in their opinions regarding the banking fraud case.',
  ['was', 'were', 'is', 'has'],
  'were',
  'A collective noun ("jury") takes a plural verb when its members act individually or have differing opinions (indicated by the plural pronoun "their").',
  'subject_verb'
);

addQuestion(
  'correction',
  'Physics are a subject that requires logical thinking, especially in statistical analysis.',
  [
    'Physics are a subject that requires',
    'Physics is a subject that requires',
    'Physics were a subject that require',
    'Physics has subjects that require'
  ],
  'Physics is a subject that requires',
  'Names of subjects ending in "-ics" (like Physics, Economics) are singular nouns and take singular verbs ("is").',
  'subject_verb'
);

addQuestion(
  'error_spotting',
  'The principal as well as the staff members (A) / was present in the meeting (B) / to discuss the bank scholarship scheme (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. When subjects are joined by "as well as", the verb agrees with the first subject ("the principal", singular), so the singular verb "was" is correct.',
  'subject_verb'
);

// 2. Prepositions questions (17 questions)
addQuestion(
  'fill_blanks',
  'The bank is not liable ________ any losses incurred due to online transaction passwords shared with third parties.',
  ['to', 'for', 'with', 'on'],
  'for',
  'The adjective "liable" takes the preposition "for" when it means responsible for something.',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'The committee decided to (A) / deviate from the traditional credit appraisal system (B) / and adopt a new model based on AI (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. The verb "deviate" correctly takes the preposition "from".',
  'prepositions'
);

addQuestion(
  'correction',
  'The branch manager is very popular among his colleagues due to his humble nature.',
  [
    'popular among his colleagues',
    'popular between his colleagues',
    'popular with his colleagues',
    'popular at his colleagues'
  ],
  'popular with his colleagues',
  'The adjective "popular" is idiomatic with the preposition "with" when referring to people ("popular with his colleagues").',
  'prepositions'
);

addQuestion(
  'fill_blanks',
  'All employees must comply ________ the code of conduct specified in the banking regulation handbook.',
  ['with', 'by', 'to', 'for'],
  'with',
  'The verb "comply" always takes the preposition "with".',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'He was senior than (A) / all other assistant managers (B) / in the corporate office (C) / No error (D)',
  null,
  'A',
  'Adjectives ending in "-ior" (senior, junior, superior, inferior, prior) are followed by the preposition "to" instead of the conjunction "than". Correct form: "senior to".',
  'prepositions'
);

addQuestion(
  'fill_blanks',
  'The bank manager refrained ________ disclosing any details about the customer accounts to the media.',
  ['to', 'by', 'from', 'with'],
  'from',
  'The verb "refrain" is followed by the preposition "from" and a gerund ("disclosing").',
  'prepositions'
);

addQuestion(
  'correction',
  'We arrived in the bank at 10 AM, only to find the gates closed.',
  [
    'arrived in the bank',
    'arrived at the bank',
    'arrived to the bank',
    'arrived on the bank'
  ],
  'arrived at the bank',
  'We use "arrive at" for specific places or buildings (like a bank, station, office) and "arrive in" for cities, countries, or regions.',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'The newly appointed cashier (A) / is proficient at handling (B) / multiple foreign currency transactions (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. The adjective "proficient" can take the preposition "at" or "in" followed by a gerund, making "proficient at handling" correct.',
  'prepositions'
);

addQuestion(
  'fill_blanks',
  'The customer expressed his dissatisfaction ________ the slow processing of the loan application.',
  ['on', 'with', 'for', 'about'],
  'with',
  'The noun "dissatisfaction" takes the preposition "with" to denote the object causing the feeling.',
  'prepositions'
);

addQuestion(
  'correction',
  'The board of directors is angry at the union leaders for calling a strike.',
  [
    'angry at the union leaders',
    'angry with the union leaders',
    'angry on the union leaders',
    'angry to the union leaders'
  ],
  'angry with the union leaders',
  'We are "angry with" a person and "angry at" a situation or non-living object. Since "union leaders" are people, "angry with" is the correct preposition.',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'The foreign investor is (A) / keen in expanding (B) / his portfolio in Indian private banks (C) / No error (D)',
  null,
  'B',
  'The adjective "keen" is followed by the preposition "on" ("keen on expanding") rather than "in".',
  'prepositions'
);

addQuestion(
  'fill_blanks',
  'The audit report was prepared ________ accordance with the international banking standards.',
  ['in', 'by', 'with', 'for'],
  'in',
  'The fixed prepositional phrase is "in accordance with".',
  'prepositions'
);

addQuestion(
  'correction',
  'The clerk was accused for stealing sensitive database passwords.',
  [
    'accused for stealing',
    'accused of stealing',
    'accused with stealing',
    'accused to steal'
  ],
  'accused of stealing',
  'The verb "accuse" is followed by the preposition "of" ("accused of stealing").',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'The reserve bank is (A) / confident of maintaining (B) / financial stability during this recession (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. The adjective "confident" correctly takes the preposition "of".',
  'prepositions'
);

addQuestion(
  'fill_blanks',
  'The loan officers are prohibited ________ accepting any personal gifts from credit applicants.',
  ['to', 'for', 'from', 'with'],
  'from',
  'The verb "prohibit" takes the preposition "from" followed by a gerund ("accepting").',
  'prepositions'
);

addQuestion(
  'correction',
  'The recovery agent persisted on demanding immediate repayment of the dues.',
  [
    'persisted on demanding',
    'persisted in demanding',
    'persisted to demand',
    'persisted at demanding'
  ],
  'persisted in demanding',
  'The verb "persist" is followed by the preposition "in" followed by a gerund ("persisted in demanding").',
  'prepositions'
);

addQuestion(
  'error_spotting',
  'The security supervisor (A) / was congratulated for (B) / preventing the bank robbery (C) / No error (D)',
  null,
  'B',
  'The verb "congratulate" takes the preposition "on" rather than "for". Correct form: "congratulated on preventing".',
  'prepositions'
);

// 3. Tenses and Conditionals (17 questions)
addQuestion(
  'fill_blanks',
  'If the bank ________ the interest rates earlier, they would have attracted more fixed deposits.',
  ['raised', 'had raised', 'would raise', 'has raised'],
  'had raised',
  'This is a third conditional sentence expressing an imaginary past situation. The structure is: If + past perfect (had raised), would + have + past participle (would have attracted).',
  'tenses'
);

addQuestion(
  'error_spotting',
  'Since the merger, (A) / our branch is offering (B) / various innovative wealth management products (C) / No error (D)',
  null,
  'B',
  'When an action started in the past and continues into the present (indicated by "Since"), we use the present perfect continuous or present perfect tense. "is offering" should be replaced with "has been offering" or "has offered".',
  'tenses'
);

addQuestion(
  'correction',
  'By the end of next month, the IT department will migrate all database servers.',
  [
    'will migrate all database servers',
    'will have migrated all database servers',
    'would migrate all database servers',
    'has migrated all database servers'
  ],
  'will have migrated all database servers',
  'We use the future perfect tense ("will have migrated") to describe an action that will be completed before a specific point in the future ("By the end of next month").',
  'tenses'
);

addQuestion(
  'fill_blanks',
  'When the board of directors arrived at the corporate office, the annual general meeting ________.',
  ['already started', 'had already started', 'has already started', 'was already starting'],
  'had already started',
  'We use the past perfect tense ("had already started") to show that one action in the past occurred before another action in the past ("arrived").',
  'tenses'
);

addQuestion(
  'error_spotting',
  'I have written to the regional manager (A) / three times last week (B) / regarding my pending transfer request (C) / No error (D)',
  null,
  'A',
  'We do not use the present perfect tense ("have written") with specific past time indicators ("last week"). We must use the simple past tense: "I wrote to the regional manager".',
  'tenses'
);

addQuestion(
  'fill_blanks',
  'If the credit department approves the collateral today, we ________ the loan tomorrow.',
  ['disbursed', 'would disburse', 'will disburse', 'would have disbursed'],
  'will disburse',
  'This is a first conditional sentence showing a real or possible future situation. Structure: If + simple present (approves), will + verb (will disburse).',
  'tenses'
);

addQuestion(
  'correction',
  'For the last five years, the bank is striving to reduce its ratio of non-performing assets.',
  [
    'the bank is striving to reduce',
    'the bank has been striving to reduce',
    'the bank was striving to reduce',
    'the bank had striven to reducing'
  ],
  'the bank has been striving to reduce',
  'For an action that began in the past and is still ongoing (indicated by "For the last five years"), the present perfect continuous tense ("has been striving") is correct.',
  'tenses'
);

addQuestion(
  'error_spotting',
  'As soon as the Governor (A) / will arrive at the summit, (B) / the press conference will begin (C) / No error (D)',
  null,
  'B',
  'In time clauses introduced by words like "as soon as", "when", "until", or "before", we use the simple present tense instead of the future tense to refer to the future. Change "will arrive" to "arrives".',
  'tenses'
);

addQuestion(
  'fill_blanks',
  'The internal auditors ________ the accounts for several hours before they found the discrepancy.',
  ['examined', 'have examined', 'had been examining', 'will have examined'],
  'had been examining',
  'We use the past perfect continuous tense ("had been examining") to show an action that was ongoing in the past before another event in the past ("found the discrepancy").',
  'tenses'
);

addQuestion(
  'correction',
  'I wish the bank administration would have handled the customer strike more diplomatically.',
  [
    'would have handled the customer strike',
    'had handled the customer strike',
    'handled the customer strike',
    'has handled the customer strike'
  ],
  'had handled the customer strike',
  'To express a regret about a past situation, we use "wish" followed by the past perfect tense ("had handled").',
  'tenses'
);

addQuestion(
  'error_spotting',
  'By this time tomorrow, (A) / the Treasury department (B) / will dispatch the sovereign gold bonds (C) / No error (D)',
  null,
  'C',
  'We use the future perfect tense ("will have dispatched") with "by this time tomorrow" to indicate completion of a future action. Change "will dispatch" to "will have dispatched".',
  'tenses'
);

addQuestion(
  'fill_blanks',
  'If the bank manager ________ present, he would have handled the angry customer immediately.',
  ['was', 'were', 'had been', 'is'],
  'had been',
  'This is a third conditional sentence referring to a past regret/hypothetical. Structure: If + past perfect (had been), would + have + past participle (would have handled).',
  'tenses'
);

addQuestion(
  'correction',
  'Since the new CEO took charge, the bank stock price rose by twenty percent.',
  [
    'took charge, the bank stock price rose',
    'took charge, the bank stock price has risen',
    'takes charge, the bank stock price rises',
    'had taken charge, the bank stock price had risen'
  ],
  'took charge, the bank stock price has risen',
  'When using "since" to mark a starting point in the past, the main clause action uses the present perfect tense ("has risen").',
  'tenses'
);

addQuestion(
  'error_spotting',
  'He has finished his work (A) / before his colleague (B) / came to assist him (C) / No error (D)',
  null,
  'A',
  'The past perfect tense is used to denote the earlier of two past actions. Change "has finished" (present perfect) to "had finished" (past perfect).',
  'tenses'
);

addQuestion(
  'fill_blanks',
  'Our bank ________ online account opening services since last December.',
  ['is offering', 'offered', 'has been offering', 'will offer'],
  'has been offering',
  'We use present perfect continuous tense ("has been offering") for actions that started in the past and are still continuing, signaled by "since last December".',
  'tenses'
);

addQuestion(
  'correction',
  'Unless the customer does not submit his PAN card, he cannot withdraw this large amount.',
  [
    'Unless the customer does not submit',
    'Unless the customer submits',
    'Until the customer does not submit',
    'If the customer submits'
  ],
  'Unless the customer submits',
  '"Unless" means "if not", so it already has a negative meaning. Adding "does not" creates a double negative. Correct clause: "Unless the customer submits".',
  'tenses'
);

addQuestion(
  'error_spotting',
  'They are working in (A) / this foreign exchange department (B) / for the last three years (C) / No error (D)',
  null,
  'A',
  'For an action continuing from the past up to now with a duration indicator ("for the last three years"), use the present perfect continuous tense. Change "are working" to "have been working".',
  'tenses'
);

// 4. Articles and Nouns (16 questions)
addQuestion(
  'fill_blanks',
  'The board of directors passed ________ unanimous resolution to acquire the fintech startup.',
  ['a', 'an', 'the', 'no article'],
  'a',
  'We use the article "a" before "unanimous" because the word begins with a consonant sound (/j/ as in "yoo-nanimous") even though it starts with a vowel letter.',
  'articles'
);

addQuestion(
  'error_spotting',
  'The branch manager (A) / gave me some (B) / useful advices regarding my investment portfolio (C) / No error (D)',
  null,
  'C',
  'The noun "advice" is uncountable, so it cannot be pluralized as "advices". Correct form: "some useful advice" or "pieces of advice".',
  'articles'
);

addQuestion(
  'correction',
  'The gold is a precious metal, and its prices are rising globally.',
  [
    'The gold is a precious metal',
    'Gold is a precious metal',
    'A gold is a precious metal',
    'Some gold is a precious metal'
  ],
  'Gold is a precious metal',
  'We do not use articles before names of materials or substances (uncountable nouns) when used in a general sense. Correct form: "Gold is a precious metal".',
  'articles'
);

addQuestion(
  'fill_blanks',
  'The client was looking for ________ honest financial advisor who would not charge hidden fees.',
  ['a', 'an', 'the', 'no article'],
  'an',
  'We use "an" before words starting with a silent "h" ("honest") because it begins with a vowel sound.',
  'articles'
);

addQuestion(
  'error_spotting',
  'All the luggages (A) / of the bank officials (B) / were thoroughly checked at the security checkpoint (C) / No error (D)',
  null,
  'A',
  'The word "luggage" is an uncountable noun and does not have a plural form "luggages". Correct form: "All the luggage".',
  'articles'
);

addQuestion(
  'fill_blanks',
  'We need to hire ________ experienced auditor who specializes in anti-money laundering regulations.',
  ['a', 'an', 'the', 'no article'],
  'an',
  'We use the indefinite article "an" because "experienced" begins with a vowel sound and the noun phrase is non-specific.',
  'articles'
);

addQuestion(
  'correction',
  'He has joined a three-years degree course in banking and financial analytics.',
  [
    'a three-years degree course',
    'a three-year degree course',
    'three years degree course',
    'a three-years-long degree course'
  ],
  'a three-year degree course',
  'When a measurement functions as an adjective preceding a noun, the noun in the measurement phrase is singular. Correct: "a three-year degree course".',
  'articles'
);

addQuestion(
  'error_spotting',
  'The economic data (A) / indicates that the inflation (B) / is likely to decline next quarter (C) / No error (D)',
  null,
  'B',
  'We do not use the definite article "the" before abstract nouns ("inflation") unless they are specifically defined. Change "the inflation" to "inflation".',
  'articles'
);

addQuestion(
  'fill_blanks',
  '________ information provided by the loan applicant was found to be fraudulent.',
  ['A', 'An', 'The', 'no article'],
  'The',
  'We use the definite article "The" because the noun "information" is made specific by the modifying phrase "provided by the loan applicant".',
  'articles'
);

addQuestion(
  'correction',
  'The customer went to the bank to withdraw five thousands rupees.',
  [
    'five thousands rupees',
    'five thousand rupees',
    'five thousand rupee',
    'five thousands of rupees'
  ],
  'five thousand rupees',
  'When nouns of number (dozen, hundred, thousand, million) are preceded by a specific numeral (like "five"), they are kept in singular form. Correct form: "five thousand rupees".',
  'articles'
);

addQuestion(
  'error_spotting',
  'The corporate office (A) / is located in (B) / the central market area (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. The articles "The" are correctly used for specific places.',
  'articles'
);

addQuestion(
  'fill_blanks',
  '________ rich should contribute to the economic development of the country.',
  ['A', 'An', 'The', 'no article'],
  'The',
  'When an adjective ("rich") represents a class of people, it is preceded by the definite article "The" and functions as a plural noun.',
  'articles'
);

addQuestion(
  'correction',
  'I have read the first and second chapter of the banking regulations book.',
  [
    'the first and second chapter',
    'the first and second chapters',
    'first and second chapter',
    'the first and the second chapter'
  ],
  'the first and second chapters',
  'When two ordinal adjectives are connected by "and" and preceded by a single article, they refer to plural nouns, so "chapters" is required. Correct: "the first and second chapters".',
  'articles'
);

addQuestion(
  'error_spotting',
  'He is (A) / an European citizen (B) / working in the international exchange department (C) / No error (D)',
  null,
  'B',
  'Although "European" starts with a vowel letter, it begins with a consonant sound (/j/). Therefore, the article "a" should be used instead of "an". Correct form: "a European".',
  'articles'
);

addQuestion(
  'fill_blanks',
  'The IT department updated ________ antivirus software on all terminal machines.',
  ['a', 'an', 'the', 'no article'],
  'the',
  'The definite article "the" is appropriate here because we are referring to the specific antivirus software used by the bank.',
  'articles'
);

addQuestion(
  'correction',
  'All the files of bank was kept in the archive vault.',
  [
    'files of bank was kept',
    'files of the bank were kept',
    'file of the bank were kept',
    'files of the bank was kept'
  ],
  'files of the bank were kept',
  'The plural subject "files" requires the plural verb "were", and the noun "bank" needs the definite article "the". Correct form: "files of the bank were kept".',
  'articles'
);

// 5. Correlative Conjunctions and Agreement (17 questions)
addQuestion(
  'fill_blanks',
  'No sooner did the RBI Governor announce the policy changes ________ the stock market surged.',
  ['when', 'then', 'than', 'as'],
  'than',
  'The correlative conjunction "No sooner" always pairs with "than" to connect two events occurring in quick succession.',
  'agreement'
);

addQuestion(
  'error_spotting',
  'Although the bank has (A) / simplified the loan process, (B) / but customers are still facing difficulties (C) / No error (D)',
  null,
  'C',
  'The conjunction "Although" should not be paired with "but" or "yet" in the same complex sentence. The comma is sufficient to connect the clauses. Remove "but".',
  'agreement'
);

addQuestion(
  'correction',
  'Scarcely had the loan agent left the house than the applicant called him back.',
  [
    'left the house than the applicant called',
    'left the house when the applicant called',
    'had left the house than the applicant had called',
    'leaves the house then the applicant calls'
  ],
  'left the house when the applicant called',
  'The adverbial phrase "Scarcely... had" is always paired with the conjunction "when" (never "than").',
  'agreement'
);

addQuestion(
  'fill_blanks',
  'Not only the branch staff ________ the regional manager attended the customer grievance cell meeting.',
  ['but also', 'and also', 'as well as', 'and'],
  'but also',
  'The correlative conjunction "Not only" is paired with "but also".',
  'agreement'
);

addQuestion(
  'error_spotting',
  'Hardly had the customer (A) / entered the bank (B) / than the fire alarm rang (C) / No error (D)',
  null,
  'C',
  'The negative adverb "Hardly" should be paired with the conjunction "when" instead of "than". Change "than the fire alarm" to "when the fire alarm".',
  'agreement'
);

addQuestion(
  'fill_blanks',
  'She is ________ intelligent but also highly dedicated to her banking duties.',
  ['not only', 'neither', 'either', 'both'],
  'not only',
  'The presence of "but also" in the clause indicates that it must be paired with "not only" to complete the correlative conjunction structure.',
  'agreement'
);

addQuestion(
  'correction',
  'He worked hard lest he would fail the IBPS PO bank exam.',
  [
    'lest he would fail',
    'lest he should fail',
    'lest he might fail',
    'lest he fails'
  ],
  'lest he should fail',
  'The conjunction "lest" is always followed by a clause containing the modal auxiliary verb "should" (meaning: for fear that). Correct form: "lest he should fail".',
  'agreement'
);

addQuestion(
  'error_spotting',
  'Both the branch manager (A) / as well as the cashier (B) / were summoned by the internal audit team (C) / No error (D)',
  null,
  'B',
  'The conjunction "Both" should be paired with "and", not "as well as". Correct form: "Both the branch manager and the cashier".',
  'agreement'
);

addQuestion(
  'fill_blanks',
  'The bank will neither refund the transaction fee ________ reverse the GST charges.',
  ['or', 'nor', 'but', 'and'],
  'nor',
  'The correlative conjunction "neither" always pairs with "nor".',
  'agreement'
);

addQuestion(
  'correction',
  'The reason why the loan application was rejected was because the credit score was too low.',
  [
    'was because the credit score was too low',
    'was that the credit score was too low',
    'because of the low credit score',
    'due to the low credit score'
  ],
  'was that the credit score was too low',
  'The expression "The reason why... is/was" should be followed by a noun clause beginning with "that", not "because", as "because" is redundant. Correct: "was that the credit score was too low".',
  'agreement'
);

addQuestion(
  'error_spotting',
  'He is as smart, (A) / if not smarter than, (B) / his senior manager in the credit department (C) / No error (D)',
  null,
  'A',
  'The comparison structure is "as [adjective] as". We must include the second "as" before the comparison. Correct form: "He is as smart as, if not...".',
  'agreement'
);

addQuestion(
  'fill_blanks',
  '________ the market conditions are highly volatile, the bank decided to go ahead with the IPO.',
  ['Although', 'Because', 'Since', 'Unless'],
  'Although',
  'The conjunction "Although" is used to show contrast or concession between the volatile market and the bank\'s decision to proceed.',
  'agreement'
);

addQuestion(
  'correction',
  'No sooner had the manager opened the door, then the customers rushed in.',
  [
    'opened the door, then the customers rushed',
    'opened the door than the customers rushed',
    'open the door when the customers rushed',
    'opened the door then the customers rushed'
  ],
  'opened the door than the customers rushed',
  'The correct correlative conjunction is "No sooner... than" (without a comma and using "than" instead of "then").',
  'agreement'
);

addQuestion(
  'error_spotting',
  'Lest you do not work hard, (A) / you should fail (B) / the banking recruitment examination (C) / No error (D)',
  null,
  'A',
  '"Lest" has a negative meaning built in ("for fear that"). It should not be followed by a negative word like "not". Correct form: "Lest you work hard...".',
  'agreement'
);

addQuestion(
  'fill_blanks',
  'The new banking app is ________ faster but also more secure than the previous version.',
  ['not only', 'both', 'neither', 'either'],
  'not only',
  'Pairs with "but also" to show addition of two positive attributes.',
  'agreement'
);

addQuestion(
  'correction',
  'He is either a clerk, or a cashier in that branch.',
  [
    'either a clerk, or a cashier',
    'either a clerk or a cashier',
    'either a clerk and a cashier',
    'both a clerk or a cashier'
  ],
  'either a clerk or a cashier',
  'No comma is needed before the second element in a correlative pair like "either... or". Correct form: "either a clerk or a cashier".',
  'agreement'
);

addQuestion(
  'error_spotting',
  'The financial advisor recommended (A) / investing in equity funds (B) / rather than to keep cash in savings accounts (C) / No error (D)',
  null,
  'C',
  'The sentence should maintain parallel structure. "investing in equity funds" (gerund) should be compared with "keeping cash" (gerund) instead of "to keep" (infinitive). Correct: "rather than keeping cash".',
  'agreement'
);

// 6. Miscellaneous Grammar (16 questions)
addQuestion(
  'fill_blanks',
  'The bank ________ customers to link their Aadhaar cards to their accounts before the end of the month.',
  ['advises', 'advices', 'adviced', 'advising'],
  'advises',
  '"Advise" is the verb form, and "advice" is the noun form. The sentence requires the third-person singular present verb "advises".',
  'punctuation'
);

addQuestion(
  'error_spotting',
  'The corporate lawyer (A) / laid down the book (B) / on the bank table (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. "laid" is the past tense of the transitive verb "lay" (to put down), which is correctly used here.',
  'punctuation'
);

addQuestion(
  'correction',
  'Having finished the bank audit, the file was sent to the head office.',
  [
    'Having finished the bank audit, the file was sent',
    'Having finished the bank audit, the manager sent the file',
    'After finishing the bank audit the file was sent',
    'The bank audit having finished the file was sent'
  ],
  'Having finished the bank audit, the manager sent the file',
  'This is a dangling participle error. The phrase "Having finished..." must modify the person who performed the action ("the manager"), not the object ("the file").',
  'punctuation'
);

addQuestion(
  'fill_blanks',
  'The bank ________ the interest rate in the next monetary policy meeting.',
  ['may affect', 'may effect', 'may effective', 'may affection'],
  'may effect',
  'Here, "effect" is used as a verb meaning "to bring about" or "to make happen". The bank may effect (bring about) the interest rate changes.',
  'punctuation'
);

addQuestion(
  'error_spotting',
  'The credit card holder (A) / could not scarcely pay (B) / his minimum monthly due (C) / No error (D)',
  null,
  'B',
  'This is a double negative error. "Scarcely" has a negative meaning, so it cannot be paired with "not". Correct form: "could scarcely pay".',
  'punctuation'
);

addQuestion(
  'fill_blanks',
  'The customer executive behaved ________ towards the senior citizen seeking assistance.',
  ['courteous', 'courteously', 'courtesy', 'courteousness'],
  'courteously',
  'The blank requires an adverb to modify the verb "behaved". Correct answer is "courteously".',
  'punctuation'
);

addQuestion(
  'correction',
  'The bank operates between 10 AM to 4 PM every weekday.',
  [
    'between 10 AM to 4 PM',
    'between 10 AM and 4 PM',
    'from 10 AM and 4 PM',
    'between 10 AM with 4 PM'
  ],
  'between 10 AM and 4 PM',
  'The preposition "between" is always paired with "and". Alternatively, we use "from... to". Correct form: "between 10 AM and 4 PM".',
  'punctuation'
);

addQuestion(
  'error_spotting',
  'The loan inspector (A) / did not find (B) / nothing suspicious in the balance sheet (C) / No error (D)',
  null,
  'C',
  'This is a double negative error. "did not find" should be paired with "anything" instead of "nothing". Correct: "did not find anything".',
  'punctuation'
);

addQuestion(
  'fill_blanks',
  'The bank manager asked me if I ________ my passport for verification.',
  ['bring', 'brought', 'had brought', 'will bring'],
  'had brought',
  'In indirect speech reporting a past question, a past perfect tense ("had brought") is used to indicate an action that was completed before the asking occurred.',
  'punctuation'
);

addQuestion(
  'correction',
  'The customer relations manager is superior than his counterpart in the cash section.',
  [
    'superior than his counterpart',
    'superior to his counterpart',
    'superior with his counterpart',
    'superior from his counterpart'
  ],
  'superior to his counterpart',
  'The adjective "superior" is followed by the preposition "to" instead of the conjunction "than".',
  'punctuation'
);

addQuestion(
  'error_spotting',
  'We had hardly (A) / reached the cash counter (B) / when the bank closed (C) / No error (D)',
  null,
  'D',
  'The sentence is grammatically correct. "Hardly" is correctly paired with "when".',
  'punctuation'
);

addQuestion(
  'fill_blanks',
  'He is ________ honest officer who works diligently in the vigilance department.',
  ['a', 'an', 'the', 'no article'],
  'an',
  'We use "an" before "honest" because the "h" is silent and the word starts with a vowel sound.',
  'punctuation'
);

addQuestion(
  'correction',
  'He has been working in the bank since three years.',
  [
    'since three years',
    'for three years',
    'from three years',
    'for three years ago'
  ],
  'for three years',
  'We use "for" to denote a duration of time ("three years") and "since" to denote a specific starting point in time.',
  'punctuation'
);

addQuestion(
  'error_spotting',
  'The branch has (A) / two cashiers and (B) / one officer, respectively (C) / No error (D)',
  null,
  'C',
  'The word "respectively" is redundant here because there is no other list or sequence to correlate with the numbers of staff. Remove "respectively".',
  'punctuation'
);

addQuestion(
  'fill_blanks',
  'The economic survey was ________ to the Finance Ministry yesterday morning.',
  ['submitted', 'submitting', 'submit', 'submits'],
  'submitted',
  'The sentence is in the passive voice ("was [past participle]"), requiring "submitted".',
  'punctuation'
);

addQuestion(
  'correction',
  'Neither of the two candidates were suitable for the credit analyst position.',
  [
    'Neither of the two candidates were',
    'Neither of the two candidates was',
    'Neither of the candidate were',
    'Neither two candidates was'
  ],
  'Neither of the two candidates was',
  'The pronoun "Neither" is singular and takes a singular verb ("was"). Correct form: "Neither of the two candidates was suitable".',
  'punctuation'
);

// Writing file
const fileContent = `export interface GrammarQuestion {
  id: string;
  type: 'correction' | 'fill_blanks' | 'error_spotting';
  sentence: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string;
  explanation: string;
  category: 'articles' | 'prepositions' | 'tenses' | 'subject_verb' | 'punctuation' | 'agreement';
}

export const grammarQuestions: GrammarQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/grammarExercises.ts'), fileContent, 'utf-8');
console.log('Successfully generated 100 grammar questions in grammarExercises.ts!');
