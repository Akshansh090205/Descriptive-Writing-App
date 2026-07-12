export interface VocabWord {
  word: string;
  partOfSpeech: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  bankingContextUsage: string;
}

export const dailyVocabulary: VocabWord[] = [
  {
    word: 'Mitigate',
    partOfSpeech: 'verb',
    meaning: 'To make something less severe, serious, or painful; to lessen gravity of a risk.',
    synonyms: ['alleviate', 'moderate', 'temper', 'reduce', 'diminish'],
    antonyms: ['aggravate', 'exacerbate', 'intensify', 'worsen'],
    example: 'The government took urgent steps to mitigate the impact of the economic downturn on small traders.',
    bankingContextUsage: 'Banks use advanced credit monitoring tools to mitigate the risk of default on large corporate loans.'
  },
  {
    word: 'Ameliorate',
    partOfSpeech: 'verb',
    meaning: 'To make something bad or unsatisfactory better.',
    synonyms: ['improve', 'enhance', 'reform', 'better', 'upgrade'],
    antonyms: ['deteriorate', 'degrade', 'impair'],
    example: 'The central bank introduced liquidity support to ameliorate credit shortages in the microfinance market.',
    bankingContextUsage: 'Deploying digital banking correspondents helped ameliorate the difficulty of access to physical bank branches in remote areas.'
  },
  {
    word: 'Proliferation',
    partOfSpeech: 'noun',
    meaning: 'Rapid increase in the numbers or spread of something.',
    synonyms: ['expansion', 'multiplication', 'mushrooming', 'escalation'],
    antonyms: ['contraction', 'decrease', 'shrinkage'],
    example: 'The proliferation of smartphones has changed how consumer goods are marketed and sold.',
    bankingContextUsage: 'The rapid proliferation of UPI-based apps has made India a global leader in real-time retail payment volume.'
  },
  {
    word: 'Insolvency',
    partOfSpeech: 'noun',
    meaning: 'The state of being unable to pay the debts owed, by a person or company.',
    synonyms: ['bankruptcy', 'ruin', 'financial collapse', 'liquidation'],
    antonyms: ['solvency', 'wealth', 'financial health'],
    example: 'The steel manufacturer filed for insolvency after three consecutive quarters of operational losses.',
    bankingContextUsage: 'The Insolvency and Bankruptcy Code (IBC) provides a time-bound process for resolving corporate insolvency and recovering bad loans.'
  },
  {
    word: 'Bespoke',
    partOfSpeech: 'adjective',
    meaning: 'Made for a particular customer or user; custom-made or customized.',
    synonyms: ['tailored', 'customized', 'personalized', 'specialty'],
    antonyms: ['standardized', 'mass-produced', 'ready-made'],
    example: 'The software company designs bespoke databases to match the security standards of national bank clients.',
    bankingContextUsage: 'Wealth management units offer bespoke investment plans to high-net-worth individuals to match their specific risk tolerance.'
  },
  {
    word: 'Exorbitant',
    partOfSpeech: 'adjective',
    meaning: 'An unreasonably high amount or price (especially of a fee or cost).',
    synonyms: ['excessive', 'prohibitive', 'outrageous', 'inflated', 'extravagant'],
    antonyms: ['reasonable', 'moderate', 'cheap', 'affordable'],
    example: 'Unregulated local moneylenders often charge exorbitant interest rates, trapping poor farmers in debt.',
    bankingContextUsage: 'The RBI capped transaction fees to prevent payment networks from charging merchants exorbitant commissions.'
  },
  {
    word: 'Fostering',
    partOfSpeech: 'verb (gerund)',
    meaning: 'Encouraging or promoting the development or growth of something.',
    synonyms: ['nurturing', 'promoting', 'cultivating', 'supporting', 'stimulating'],
    antonyms: ['stifling', 'hindering', 'suppressing', 'discouraging'],
    example: 'The policy framework is designed for fostering small-scale industrial innovations in Tier-2 cities.',
    bankingContextUsage: 'Fintech startups and banks play a pivotal role in fostering financial inclusion among the unbanked populations.'
  },
  {
    word: 'Impetus',
    partOfSpeech: 'noun',
    meaning: 'The force or energy that makes a process start or happen more quickly.',
    synonyms: ['stimulus', 'incentive', 'momentum', 'catalyst', 'encouragement'],
    antonyms: ['hindrance', 'deterrent', 'obstacle', 'discouragement'],
    example: 'The announcement of tax concessions provided a major impetus to the manufacturing sector.',
    bankingContextUsage: 'Demonetization and the COVID-19 pandemic provided a massive impetus to the adoption of contactless digital payments.'
  },
  {
    word: 'Juxtapose',
    partOfSpeech: 'verb',
    meaning: 'To place different things close together or side-by-side to compare or contrast them.',
    synonyms: ['collocate', 'compare', 'contrast', 'pair'],
    antonyms: ['separate', 'isolate', 'disconnect'],
    example: 'To understand the economic disparity, we must juxtapose metropolitan income growth with agricultural earnings.',
    bankingContextUsage: 'Credit analysts juxtapose the asset quality of public sector banks against private banks to identify industry trends.'
  },
  {
    word: 'Preponderance',
    partOfSpeech: 'noun',
    meaning: 'The quality or fact of being greater in number, quantity, importance, or strength.',
    synonyms: ['dominance', 'prevalence', 'majority', 'predominance', 'prepotency'],
    antonyms: ['minority', 'scarcity', 'dearth'],
    example: 'There is a preponderance of evidence showing that high inflation dampens consumer spending.',
    bankingContextUsage: 'Despite the growth of digital transactions, there is still a preponderance of cash transactions in rural retail trade.'
  }
];
