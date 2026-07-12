export interface Topic {
  id: string;
  title: string;
  category: 'essay' | 'formal_letter' | 'informal_letter' | 'pyq';
  description: string;
  wordLimit: number;
  timeLimit: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  hints?: string[];
  facts?: string[];
  keywords?: string[];
  exam?: string; // For PYQs
  year?: number; // For PYQs
  stream?: 'general' | 'IT' | 'AFO';
}

export const defaultTopics: Topic[] = [
  // ESSAYS
  {
    id: 'essay-1',
    title: 'Impact of Digital Banking on Rural India',
    category: 'essay',
    description: 'Discuss how digital banking has transformed the rural economy of India, highlighting the challenges faced and the opportunities ahead.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'medium',
    tags: ['Digital Banking', 'Economy', 'Rural Development'],
    hints: [
      'Define rural digital banking and key milestones (e.g., PMJDY, AEPS, UPI).',
      'Explain the positive changes: Direct Benefit Transfer (DBT), reduced leakages, microfinance access.',
      'Discuss core barriers: lack of digital literacy, connectivity issues, fear of cyber fraud.',
      'Suggest key measures: banking correspondents (BCs), local language apps, offline digital payment systems.'
    ],
    facts: [
      'Over 50 crore Pradhan Mantri Jan Dhan Yojana (PMJDY) accounts have been opened, with a significant share in rural areas.',
      'Aadhaar Enabled Payment System (AePS) handles millions of micro-transactions daily through banking correspondents.',
      'Rural internet penetration crossed 40%, but active usage for financial transactions remains low.'
    ],
    keywords: ['Financial Inclusion', 'Direct Benefit Transfer', 'Micro-transactions', 'Banking Correspondents', 'Digital Literacy', 'Connectivity', 'Cashless Economy']
  },
  {
    id: 'essay-2',
    title: 'The AI Revolution in Banking: Benefits and Risks',
    category: 'essay',
    description: 'Analyze the integration of Artificial Intelligence (AI) and Machine Learning (ML) in modern banking operations. Examine how it enhances customer service and risk management while discussing security and employment concerns.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'medium',
    tags: ['Technology', 'AI', 'Banking'],
    hints: [
      'Introduce AI in banking (robo-advisors, chatbots, credit scoring).',
      'Elaborate on benefits: instant fraud detection, automated customer queries (24/7), personalized wealth advice.',
      'Point out risks: algorithms introducing biases in lending, job displacement in administrative roles, data privacy issues.',
      'Conclude with the necessity of balanced AI regulation and upskilling bank personnel.'
    ],
    facts: [
      'AI-based credit scoring engines analyze non-traditional data to assess loan eligibility for credit-starved applicants.',
      'A large private sector bank reported that AI chatbots handle over 70% of routine client interactions.',
      'Studies estimate that AI automation could reduce bank operating costs by up to 20-25% globally.'
    ],
    keywords: ['Machine Learning', 'Robo-advisors', 'Credit Scoring', 'Fraud Detection', 'Data Privacy', 'Automation', 'Customer Experience', 'Algorithm Bias']
  },
  {
    id: 'essay-3',
    title: 'Climate Change and the Rise of Green Finance',
    category: 'essay',
    description: 'Detail the role of financial systems in combatting climate change. Elaborate on the concept of Green Finance, Green Bonds, and sustainable banking practices.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Climate Change', 'Finance', 'Environment'],
    hints: [
      'Define green finance and its goal of channeling capital toward environment-friendly projects.',
      'Explain key instruments like Green Bonds and Sustainability-Linked Loans.',
      'Outline the role of central banks (e.g., RBI\'s framework for green deposits).',
      'Detail issues: greenwashing, high transition costs, and risk of stranded carbon assets.',
      'Summarize with steps needed to build global sustainable capital flows.'
    ],
    facts: [
      'Green bonds are debt instruments designed to fund environmental projects such as renewable energy or water treatment.',
      'The RBI joined the Network for Greening the Financial System (NGFS) to collaborate on climate risk management.',
      'Global sustainable bond issuance has crossed $1 trillion annually.'
    ],
    keywords: ['Green Bonds', 'Sustainable Development', 'Carbon Footprint', 'Greenwashing', 'ESG Compliance', 'Renewable Energy', 'Transition Finance', 'NGFS']
  },
  {
    id: 'essay-4',
    title: 'Cyber Security Challenges in the Era of UPI and Open Banking',
    category: 'essay',
    description: 'With India leading global real-time digital payments, evaluate the vulnerabilities of the ecosystem. Suggest robust strategies to secure digital payment rails.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Cyber Security', 'Digital Payments', 'UPI'],
    hints: [
      'Introduce the rapid growth of UPI and API-based open banking.',
      'Discuss major security challenges: phishing, SIM swapping, fake payment links, mule bank accounts.',
      'Explain the concept of zero-trust architecture and multi-factor authentication (MFA).',
      'State government/RBI initiatives: National Cyber Crime Portal, card tokenization.',
      'Emphasize user awareness and public-private cybersecurity cooperation.'
    ],
    facts: [
      'UPI transactions frequently cross 10 to 12 billion transactions per month in volume.',
      'Nearly 70% of reported financial frauds in India are digital/payment-card-related, according to security databases.',
      'Card tokenization prevents actual card details from being stored on merchant servers, reducing leak risks.'
    ],
    keywords: ['Phishing', 'SIM Swapping', 'Mule Accounts', 'Tokenization', 'Multi-factor Authentication', 'Zero-trust Architecture', 'Real-time Payments', 'Cyber Literacy']
  },
  
  // FORMAL LETTERS
  {
    id: 'formal-1',
    title: 'Request Letter: Apply for an Education Loan',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager of Apex Bank requesting an education loan of Rs. 15 Lakhs for pursuing higher studies abroad.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'easy',
    tags: ['Loan Request', 'Education', 'Bank Manager'],
    hints: [
      'Use the standard formal letter format: Sender Address, Date, Receiver Designation (Branch Manager, Apex Bank), Subject Line, Salutation.',
      'State the purpose clearly in the first paragraph: secured admission at an international university.',
      'Detail the financial specifics: total course fee, required loan amount, collateral details.',
      'Politely request the list of required documents and swift approval.',
      'Sign off professionally with "Yours faithfully" and name.'
    ],
    facts: [
      'Education loans up to Rs. 7.5 lakhs can be secured under the Credit Guarantee Fund Scheme for Education Loans (CGFSEL) without collateral.',
      'Interest rates for girls are typically given a minor concession (usually 0.50%) by major public sector banks.'
    ],
    keywords: ['Education Loan', 'Admission Letter', 'Collateral Security', 'Sanction Letter', 'Disbursement', 'Co-borrower', 'Interest Concession']
  },
  {
    id: 'formal-2',
    title: 'Complaint Letter: Unauthorized Credit Card Charges',
    category: 'formal_letter',
    description: 'Write a letter to the Credit Card Division Manager of your bank complaining about three unauthorized international transactions on your card, requesting card blocking and reimbursement.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'medium',
    tags: ['Complaint Letter', 'Credit Card', 'Customer Service'],
    hints: [
      'State the credit card number (masked for privacy, e.g., 4532-XXXX-XXXX-1234) and dates of transactions.',
      'Mention that you did not receive any OTP (if applicable) or share card credentials.',
      'Confirm that you have already blocked the card via mobile app and demand card replacement.',
      'Request full credit back/reversal under the RBI policy for zero liability of customers in unauthorized transactions.',
      'Enclose transaction details/screenshots.'
    ],
    facts: [
      'RBI guidelines state that a customer has zero liability if a third-party breach occurs and the customer reports it within 3 working days.',
      'Most international transactions on commercial platforms might bypass 2-factor OTP validation, raising credit card fraud rates.'
    ],
    keywords: ['Unauthorized Transaction', 'Card Blocking', 'Reimbursement', 'Zero Liability', 'Disputed Charge', 'Chargeback', 'Fraudulent Activity']
  },

  // INFORMAL LETTERS
  {
    id: 'informal-1',
    title: 'Letter to a Friend: Benefits of Small Savings Schemes',
    category: 'informal_letter',
    description: 'Write a letter to your friend advising them to start investing early, specifically explaining the benefits of Public Provident Fund (PPF) and Sukanya Samriddhi Yojana (SSY).',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'easy',
    tags: ['Savings', 'Friend', 'Advice'],
    hints: [
      'Use informal format: Sender address and Date in top-left, warm greeting ("Dear [Friend\'s Name]").',
      'Begin with personal inquiries ("Hope you are doing well...").',
      'Explain the compounding power of early investing.',
      'Mention PPF (government-backed, tax-free interest, long term) and SSY (if they have a daughter, high interest rate).',
      'Encourage starting with small monthly sums and sign off warmly ("With warm regards, Yours lovingly").'
    ],
    facts: [
      'PPF currently offers attractive tax benefits under Section 80C, with a lock-in period of 15 years.',
      'Sukanya Samriddhi Yojana offers one of the highest interest rates among small savings schemes for girls under 10 years.'
    ],
    keywords: ['Compounding Interest', 'Tax Exempt', 'Lock-in Period', 'Financial Security', 'Early Investment', 'Sukanya Samriddhi', 'Public Provident Fund']
  },

  // PREVIOUS YEAR QUESTIONS (PYQs)
  {
    id: 'pyq-1',
    title: 'RBI Grade B 2023: Role of fintech in banking operations',
    category: 'pyq',
    description: 'Analyze how Financial Technology (Fintech) startups are driving innovation in payment processing, lending, and wealth management. Discuss collaborating vs. competing forces in the banking sector.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Fintech', 'RBI Grade B', 'Economy'],
    exam: 'RBI Grade B',
    year: 2023,
    hints: [
      'Introduce the concept of Fintech and its rapid expansion in India.',
      'Describe innovations in payment (UPI, prepaid wallets), lending (P2P platforms, digital underwriting), and wealthtech.',
      'Discuss the initial friction (disruption of classic banks) and the transition to collaborative models (banks providing capital/trust, fintechs offering agile frontends).',
      'Mention RBI regulatory sandboxes.'
    ],
    facts: [
      'India has one of the highest fintech adoption rates globally at over 85%, compared to a global average of 64%.',
      'The RBI launched a regulatory sandbox to allow testing of innovative financial solutions on real customers.'
    ],
    keywords: ['Fintech Innovation', 'Peer-to-Peer Lending', 'Digital Underwriting', 'Regulatory Sandbox', 'API Banking', 'Co-opetition', 'Financial Disruption']
  },
  {
    id: 'pyq-2',
    title: 'SBI PO Mains 2024: Impact of privatization of Public Sector Banks (PSBs)',
    category: 'pyq',
    description: 'Critically analyze the arguments for and against the privatization of public sector banks in India. How does it affect financial inclusion in rural areas?',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Privatization', 'PSBs', 'SBI PO Mains'],
    exam: 'SBI PO Mains',
    year: 2024,
    hints: [
      'Introduce the historical context of PSB nationalization (1969) and recent privatization debates.',
      'List arguments FOR: operational efficiency, reduction in government fiscal burden, reduction of NPAs, market competitiveness.',
      'List arguments AGAINST: neglect of rural branches, potential slowdown in financial inclusion, public trust issues, employee unrest.',
      'Conclude with a balanced perspective (e.g., maintaining a few strategic public sector banks while privatizing weaker ones).'
    ],
    facts: [
      'In 1969, the Indian government nationalized 14 major private commercial banks.',
      'Public sector banks account for the overwhelming majority of rural Jan Dhan bank accounts compared to private entities.'
    ],
    keywords: ['Privatization', 'Public Sector Banks', 'Non-Performing Assets (NPAs)', 'Financial Inclusion', 'Nationalization', 'Operational Efficiency', 'Fiscal Burden']
  },
  {
    id: 'pyq-3',
    title: 'IBPS PO Mains 2023: Formal Letter to Bank Manager complaining about ATM cash dispense error',
    category: 'pyq',
    description: 'Write a letter to the manager of your home branch complaining that the ATM did not dispense cash of Rs. 10,000, but your account was debited. Request refund.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'easy',
    tags: ['ATM Issue', 'IBPS PO Mains', 'Complaint'],
    exam: 'IBPS PO Mains',
    year: 2023,
    hints: [
      'Include details: ATM location, transaction ID, date, time, and debited account number.',
      'Explain that the machine showed "Transaction failed" or screen went blank, but you received a debit SMS.',
      'Cite RBI guidelines: the bank must refund failed ATM transactions within 5 calendar days, else pay Rs 100/day penalty.',
      'Ask for prompt credit back to your account.'
    ],
    facts: [
      'Under RBI rules, for failed transactions where cash is not dispensed but debited, banks must credit the money back within T+5 days.',
      'A customer compensation of Rs. 100 per day is payable for delays beyond 5 days, provided the complaint is registered within 30 days.'
    ],
    keywords: ['Cash Dispense Error', 'ATM Transaction', 'Account Debit', 'Failed Transaction', 'RBI Guidelines', 'Compensation Penalty', 'Transaction Slip']
  },
  {
    id: 'pyq-4',
    title: 'IBPS SO IT Officer 2023: Cybersecurity Threat Mitigation in banking rails',
    category: 'pyq',
    description: 'Explain the critical role of cybersecurity frameworks and threat monitoring in securing digital banking pipelines. Discuss how zero-trust architectures protect digital banking endpoints.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Cybersecurity', 'IT Infrastructure', 'IBPS SO'],
    exam: 'IBPS SO',
    year: 2023,
    stream: 'IT',
    hints: [
      'Detail the threat landscape (phishing, DDoS, malware, ransomware).',
      'Explain zero-trust access controls (never trust, always verify).',
      'Detail security components: firewalls, multi-factor authentication, security operations centers (SOC).',
      'Conclude with the importance of security compliance audits.'
    ],
    facts: [
      'Financial sectors are targeted by nearly 30% of all global ransomware attacks.',
      'DDoS attacks on financial systems scale by over 50% year-over-year.'
    ],
    keywords: ['Zero-Trust Architecture', 'Threat Mitigation', 'Multi-factor Authentication', 'SOC Operations', 'DDoS Prevention', 'Ransomware Protection', 'Compliance Audits']
  },
  {
    id: 'pyq-5',
    title: 'IBPS SO IT Officer 2024: Reporting Phishing vulnerabilities to Chief Information Security Officer',
    category: 'pyq',
    description: 'Write a formal letter to the Chief Information Security Officer (CISO) of your bank reporting simulated phishing vulnerabilities spotted during a recent employee drill. Request additional security hygiene training.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'medium',
    tags: ['IT security', 'Staff training', 'IBPS SO'],
    exam: 'IBPS SO',
    year: 2024,
    stream: 'IT',
    hints: [
      'Use formal layout format addressing the CISO.',
      'Specify details of the phishing drill (date, scope, click rates).',
      'State the vulnerability percentage (e.g. 15% of employees entered credentials).',
      'Recommend conducting mandatory security awareness sessions and sign off formally.'
    ],
    facts: [
      'Nearly 90% of successful data breaches in enterprise banking networks begin with standard phishing emails.',
      'Regular security hygiene exercises lower vulnerability rates from 30% to under 5%.'
    ],
    keywords: ['Phishing Vulnerability', 'CISO', 'Security Drill', 'Employee Awareness', 'Credential Theft', 'Data Breach', 'Security Hygiene']
  },
  {
    id: 'it-essay-1',
    title: 'Open Banking and API Integration in Commercial Banks',
    category: 'essay',
    description: 'Analyze the benefits and cybersecurity risks of Open Banking and third-party API sharing. How can banks deliver integrated financial products while protecting customer data privacy?',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'medium',
    tags: ['Open Banking', 'APIs', 'Data Security', 'IT SO'],
    stream: 'IT',
    hints: [
      'Define Open Banking (sharing customer financial data securely with third-party developers via APIs).',
      'Discuss benefits: customized financial dashboards, quick loan approvals, automated budgeting tools.',
      'Detail risks: API vulnerability points, unauthorized credential access, third-party data leaks.',
      'Conclude with mitigation plans: OAuth 2.0 protocols, data encryption, strict security compliance checks.'
    ],
    facts: [
      'Over 60 countries have adopted or are actively developing regulatory frameworks for open banking integration.',
      'API-based financial data requests grew by nearly 120% globally in the last three years.'
    ],
    keywords: ['Open Banking', 'API Integration', 'Data Privacy', 'OAuth Protocol', 'Credential Access', 'Third-Party Risk', 'Data Encryption']
  },
  {
    id: 'it-letter-1',
    title: 'Formal Letter: Request to upgrade branch server bandwidth',
    category: 'formal_letter',
    description: 'Write a formal letter to the Regional IT Lead requesting a bandwidth upgrade for your branch\'s network servers due to slow transaction clearing during peak banking hours.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'medium',
    tags: ['Server Upgrade', 'Bandwidth', 'IT SO', 'Infrastructure'],
    stream: 'IT',
    hints: [
      'Use standard block letter layout addressing the Regional IT Lead.',
      'Specify your branch code, location, and the current bandwidth capacity.',
      'Explain how slow connectivity delays customer deposits, withdrawals, and NEFT clearances during peak times (11 AM to 2 PM).',
      'Request upgrading to high-speed fiber-leased lines to maintain service standards.'
    ],
    facts: [
      'Network latency of over 500ms at branch terminals decreases customer counter transaction speeds by 40%.',
      'Leased fiber lines provide symmetric upload/download bandwidth with 99.9% network uptime SLAs.'
    ],
    keywords: ['Bandwidth Upgrade', 'Regional IT Lead', 'Server Latency', 'Fiber-Leased Line', 'NEFT Clearance', 'Branch Network', 'Transaction Speed']
  },
  {
    id: 'afo-essay-1',
    title: 'Kisan Credit Card (KCC) Scheme: Empowering Indian Farmers',
    category: 'essay',
    description: 'Analyze the impact and role of the Kisan Credit Card (KCC) scheme in providing timely and hassle-free credit to Indian farmers. Discuss how agricultural banking drives rural financial independence.',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'medium',
    tags: ['Kisan Credit Card', 'Rural Credit', 'AFO', 'Agriculture'],
    stream: 'AFO',
    hints: [
      'Define KCC (launched in 1998) and its main objective (revolving credit for agriculture crops).',
      'Explain benefits: low interest rates, flexible repayment options, card limits linked to land holdings.',
      'Explain how it prevents farmers from falling into debt traps with informal local moneylenders.',
      'Outline gaps: awareness in remote regions, administrative delays in card renewal.'
    ],
    facts: [
      'Over 7.3 crore farmers in India actively hold Kisan Credit Cards (KCC).',
      'Under KCC, short-term crop loans are provided at an effective interest rate of 4% per annum (after 3% prompt interest subvention).'
    ],
    keywords: ['KCC Scheme', 'Revolving Credit', 'Interest Subvention', 'Crop Loan', 'Rural Finance', 'Debt Trap', 'Financial Inclusion']
  },
  {
    id: 'afo-essay-2',
    title: 'Sustainable Agriculture and Climate-Resilient Farm Finance',
    category: 'essay',
    description: 'Discuss the role of commercial and regional rural banks in funding sustainable, climate-resilient farming techniques. How can financial packages be designed to incentivize conservation tillage and organic farming?',
    wordLimit: 250,
    timeLimit: 30,
    difficulty: 'hard',
    tags: ['Sustainable Agriculture', 'Climate Finance', 'AFO', 'Rural Development'],
    stream: 'AFO',
    hints: [
      'Define climate-resilient agriculture and its urgent need due to erratic monsoons.',
      'Discuss banks structuring micro-loans for micro-irrigation systems (drip/sprinkler) under central subsidies.',
      'Explore how bank schemes like interest concessions for certified organic practices encourage sustainable soil cultivation.',
      'Highlight challenges in verifying farm-level organic compliance and slow returns on green transition investments.'
    ],
    facts: [
      'Micro-irrigation increases water-use efficiency by up to 90% and crop yields by 20-50%.',
      'NABARD (National Bank for Agriculture and Rural Development) is the primary refinancing agency promoting sustainable rural farm lending in India.'
    ],
    keywords: ['Climate-Resilient', 'Sustainable Farming', 'Micro-irrigation', 'NABARD', 'Green Credits', 'Rural Lending', 'Soil Conservation']
  },
  {
    id: 'afo-letter-1',
    title: 'Request for Loan Repayment Moratorium post Crop Damage',
    category: 'formal_letter',
    description: 'Write a formal letter to the branch manager of Rural Cooperative Bank requesting a 6-month moratorium on your agricultural tractor loan instalment due to severe crop loss from unseasonal monsoon hailstorms.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'medium',
    tags: ['Loan Moratorium', 'Crop Loss', 'AFO', 'Complaint'],
    stream: 'AFO',
    hints: [
      'Ensure standard formal block format addressing the Branch Manager.',
      'Detail your loan account number and tractor model purchased.',
      'Describe the cause of distress (e.g. unseasonal hailstorms destroying standing paddy crops).',
      'Request extension/moratorium for 6 months, citing past consistent repayment record.'
    ],
    facts: [
      'Under RBI crop-loss guidelines, banks can restructure short-term agricultural loans into medium-term loans and provide moratoriums during natural calamities.',
      'Crop loss of 33% or more makes farmers eligible for immediate loan restructuring and interest relief.'
    ],
    keywords: ['Loan Moratorium', 'Repayment Extension', 'Tractor Loan', 'Crop Loss', 'Natural Calamity', 'Loan Restructuring', 'Cooperative Bank']
  },
  {
    id: 'afo-letter-2',
    title: 'Informal Letter: Explaining Crop Insurance benefits to your sibling',
    category: 'informal_letter',
    description: 'Write a letter to your younger sibling who is managing your ancestral family farm, advising them to insure the winter wheat crop under the Pradhan Mantri Fasal Bima Yojana (PMFBY). Explain premium rates and risk coverage.',
    wordLimit: 150,
    timeLimit: 20,
    difficulty: 'medium',
    tags: ['Crop Insurance', 'PMFBY', 'AFO', 'Advice'],
    stream: 'AFO',
    hints: [
      'Use informal layout format (sender\'s address, date, warm salutation).',
      'Explain that PMFBY offers complete coverage against sowing failures, droughts, pests, and localized post-harvest losses.',
      'Mention that the premium is highly subsidized: only 1.5% for winter (Rabi) crops, 2.0% for summer (Kharif) crops.',
      'Encourage registering the crop immediately through the local bank or Common Services Center (CSC).'
    ],
    facts: [
      'PMFBY charges a uniform premium of only 1.5% for Rabi crops and 2.0% for Kharif crops from farmers, with the remaining balance paid by central and state governments.',
      'The PMFBY scheme covers non-prevented sowing, standing crops risk, and localized calamities like hailstorms and landslides.'
    ],
    keywords: ['Crop Insurance', 'PMFBY', 'Rabi Crops', 'Subsidized Premium', 'Risk Coverage', 'Localized Calamity', 'Ancestral Farm']
  }
];
