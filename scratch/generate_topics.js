import fs from 'fs';
import path from 'path';

// Core topics list
const rawTopics = [
  // ==================== ESSAYS (50 Topics) ====================
  // Banking & Financial Sector (15 Essays)
  {
    id: 'essay-1',
    title: 'Impact of Digital Banking on Rural India',
    category: 'essay',
    description: 'Discuss how digital banking has transformed the rural economy of India, highlighting the challenges faced and the opportunities ahead.',
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
  {
    id: 'essay-5',
    title: 'Central Bank Digital Currency (CBDC): Future of Money',
    category: 'essay',
    description: 'Evaluate the introduction of the Digital Rupee (e₹) by the RBI. Analyze its implications on the monetary transmission, commercial banking structure, and currency management costs.',
    difficulty: 'hard',
    tags: ['CBDC', 'Monetary Policy', 'Digital Currency'],
    hints: [
      'Define CBDC and differentiate between wholesale (CBDC-W) and retail (CBDC-R).',
      'State advantages: reduction in physical currency printing/distribution costs, efficient cross-border payments, direct policy execution.',
      'Highlight challenges: potential disintermediation of commercial banks, data privacy concerns, and system security vulnerabilities.',
      'Conclude with the necessity of a phased rollout and robust security standards.'
    ],
    facts: [
      'The RBI launched pilot projects for the Digital Rupee (e₹) in retail and wholesale segments in late 2022.',
      'Printing and managing physical bank notes costs the Indian government and RBI thousands of crores annually.',
      'CBDC operates as a direct liability of the central bank, unlike commercial bank deposits or private cryptocurrencies.'
    ],
    keywords: ['Digital Rupee', 'Monetary Transmission', 'Disintermediation', 'Currency Management', 'Distributed Ledger', 'Sovereign Currency', 'Data Privacy']
  },
  {
    id: 'essay-6',
    title: 'Role of Bad Banks in Resolving NPA Crises',
    category: 'essay',
    description: 'Explain the concept of a Bad Bank, with special reference to NARCL and IDRCL in India. Examine how this mechanism helps clean up commercial bank balance sheets and revive credit growth.',
    difficulty: 'medium',
    tags: ['NPA', 'Bad Bank', 'Financial Regulation'],
    hints: [
      'Define bad bank: an asset reconstruction company (ARC) set up to buy non-performing assets (NPAs) from commercial banks.',
      'Discuss NARCL (National Asset Reconstruction Company Limited) and IDRCL (India Debt Resolution Company Limited).',
      'Explain how it frees banks to focus on core credit business rather than loan recovery.',
      'Discuss criticism: moving toxic assets from one government ledger to another without addressing structural lending issues.'
    ],
    facts: [
      'NARCL is incorporated as a government-backed asset reconstruction company to consolidate stress in the banking system.',
      'Gross Non-Performing Assets (GNPA) ratio of Scheduled Commercial Banks has dropped significantly post-pandemic, aided by resolutions and write-offs.',
      'The government provides guarantees on security receipts (SRs) issued by NARCL to secure transaction transfers.'
    ],
    keywords: ['NARCL', 'IDRCL', 'Asset Reconstruction', 'Security Receipts', 'Toxic Assets', 'Credit Flow', 'Balance Sheet Cleanup']
  },
  {
    id: 'essay-7',
    title: 'Neo-Banks vs. Traditional Banks: The Battle for Banking Supremacy',
    category: 'essay',
    description: 'Compare digital-only Neo-Banks with traditional brick-and-mortar banks. Examine how neo-banks are disrupting customer engagement, while addressing regulatory limits in India.',
    difficulty: 'medium',
    tags: ['Neo-Banks', 'Disruption', 'Banking Technology'],
    hints: [
      'Define Neo-banks (digital banks without physical branches operating via apps/web).',
      'Describe their strengths: superior UX, seamless onboarding, instant account creation, tailored financial insights.',
      'Describe traditional banks strengths: trust, branch access, complete regulatory licenses, offline support.',
      'Highlight the regulatory environment in India: RBI does not issue direct virtual bank licenses; neo-banks must partner with traditional licensed banks.'
    ],
    facts: [
      'Neo-banks globally attract younger cohorts due to lower transaction fees and real-time budgeting tools.',
      'India\'s digital population exceeds 800 million, offering a massive demographic dividend for fintech services.',
      'In India, neo-banks function as technology providers or banking agents rather than direct depositories.'
    ],
    keywords: ['Virtual Banking', 'Fintech Partnership', 'Customer Experience', 'Regulatory Compliance', 'Branchless Banking', 'Digital Onboarding', 'Customer Retention']
  },
  {
    id: 'essay-8',
    title: 'Small Finance Banks and Payment Banks: Driving Niche Financial Inclusion',
    category: 'essay',
    description: 'Detail the establishment of differentiated banks in India. Analyze the performance, business models, and challenges of Small Finance Banks (SFBs) and Payment Banks.',
    difficulty: 'hard',
    tags: ['Differentiated Banking', 'Financial Inclusion', 'RBI Regulations'],
    hints: [
      'Explain Nachiket Mor Committee recommendations on differentiated banking structures.',
      'Detail Small Finance Banks: focus on high-volume, low-value loans, priority sector lending (75% target), and deposit taking.',
      'Detail Payment Banks: restricted to savings deposits (up to 2 lakh), no lending activity, payment services focus.',
      'Discuss challenges: high cost of operations, intense competition from commercial banks, margins under pressure.'
    ],
    facts: [
      'Differentiated banking licenses were introduced by RBI in 2014 to serve underserved segments.',
      'Small Finance Banks are mandated to extend at least 50% of their loans to small business units and marginal farmers.',
      'Payment banks cannot issue credit cards or loans directly, reducing credit risk but limiting yield opportunities.'
    ],
    keywords: ['Differentiated License', 'Priority Sector Lending', 'Payment Rails', 'Underbanked Populations', 'Marginal Farmers', 'Deposit Cap', 'Credit Risk']
  },
  {
    id: 'essay-9',
    title: 'The Rise of Microfinance and its Impact on Women Empowerment',
    category: 'essay',
    description: 'Examine the evolution of Microfinance Institutions (MFIs) and Self-Help Group (SHG) bank linkage programs in India. Assess their contribution to fostering economic independence among rural women.',
    difficulty: 'medium',
    tags: ['Microfinance', 'Women Empowerment', 'Rural Economy'],
    hints: [
      'Explain microfinance: providing credit, savings, and insurance to low-income populations without formal collateral.',
      'Discuss the SHG-Bank Linkage program initiated by NABARD.',
      'Analyze economic empowerment: rural women starting micro-enterprises, gaining financial decision-making power.',
      'Discuss limitations: high interest rates of some MFIs, risk of over-indebtedness, coercive collection practices.'
    ],
    facts: [
      'India\'s microfinance sector serves over 6 crore unique borrowers, with a massive share of female clients.',
      'The SHG-Bank Linkage program is the largest microfinance initiative in the world.',
      'Studies show that microfinance access increases household investments in health and children\'s education.'
    ],
    keywords: ['SHG-Bank Linkage', 'NABARD', 'Collateral-free Loan', 'Micro-enterprise', 'Financial Sovereignty', 'Over-indebtedness', 'Joint Liability Group']
  },
  {
    id: 'essay-10',
    title: 'Mergers and Acquisitions in Public Sector Banks: Pros and Cons',
    category: 'essay',
    description: 'Analyze the consolidation of Public Sector Banks (PSBs) in India. Evaluate the arguments for creating global-sized banks versus the disruption caused to employees and local services.',
    difficulty: 'hard',
    tags: ['PSB Mergers', 'Consolidation', 'Corporate Finance'],
    hints: [
      'Provide background on recent mega-mergers of PSBs in India.',
      'List benefits: economies of scale, stronger capital adequacy, unified technology stacks, wider geographical footprint.',
      'List arguments against: administrative disruption, branch closures, harmonization of work cultures, distraction from bad loan recovery.',
      'Conclude on long-term efficiency indicators.'
    ],
    facts: [
      'In 2020, the Indian government consolidated 10 public sector banks into 4 larger entities.',
      'Post-merger, consolidated banks showed improved capital positions and efficiency ratios.',
      'Bank employees unions expressed concerns regarding seniority adjustments and branch rationalization.'
    ],
    keywords: ['Bank Consolidation', 'Capital Adequacy', 'Economies of Scale', 'Operational Synergy', 'Cultural Integration', 'Priority Lending', 'Public Sector Banking']
  },
  {
    id: 'essay-11',
    title: 'The Insolvency and Bankruptcy Code (IBC): A Game Changer for Resolving Stressed Assets',
    category: 'essay',
    description: 'Examine the framework of the Insolvency and Bankruptcy Code. Discuss its success in changing promoter behavior and speeding up the recovery of bad loans compared to legacy tools.',
    difficulty: 'hard',
    tags: ['IBC', 'Stressed Assets', 'Corporate Law'],
    hints: [
      'Introduce the historical context of stressed assets and the implementation of IBC in 2016.',
      'Detail the institutional mechanism: NCLT, Insolvency Professionals, Committee of Creditors (CoC).',
      'Explain the shift in balance of power: from borrower/promoter to creditor.',
      'Detail challenges: delays in judicial benches, low recovery rates (haircuts), vacancies in tribunal boards.'
    ],
    facts: [
      'The IBC provides a statutory time limit (initially 180+90 days) for resolving corporate insolvency.',
      'Prior to IBC, recovering debts took an average of 4.3 years in India; the code aimed to compress this significantly.',
      'Billions of rupees have been recovered by banks through resolution plans, though average haircut rates remain a point of debate.'
    ],
    keywords: ['NCLT', 'Insolvency Resolution', 'Committee of Creditors', 'Corporate Debtor', 'Haircut Rates', 'Promoter Liability', 'Debt Recovery']
  },
  {
    id: 'essay-12',
    title: 'Financial Literacy: The Foundation of Sustainable Financial Inclusion',
    category: 'essay',
    description: 'Argue why opening bank accounts is insufficient without structured financial literacy. Detail how knowledge of budgeting, interest compounding, and cyber-safety impacts rural savings.',
    difficulty: 'medium',
    tags: ['Financial Literacy', 'Financial Inclusion', 'Consumer Protection'],
    hints: [
      'Define the difference between financial access (account ownership) and financial literacy (active, informed usage).',
      'Explain risks of low literacy: falling victim to Ponzi schemes, micro-loan traps, and UPI phishing.',
      'State benefits: active investment in mutual funds/deposits, planning for retirement, purchasing insurance.',
      'Suggest strategies: digital financial literacy centers, school curriculum integration, local language workshops.'
    ],
    facts: [
      'The RBI conducts annual financial literacy weeks to promote savings habits and digital transaction safety.',
      'Despite high account penetration, a significant proportion of rural accounts remain inactive or maintain zero balances.',
      'Cyber-crimes targeting rural UPI accounts have surged due to gaps in basic digital financial hygiene.'
    ],
    keywords: ['Financial Literacy', 'Financial Hygiene', 'Consumer Awareness', 'Digital Frauds', 'Investment Behavior', 'Compound Interest', 'Financial Inclusion']
  },
  {
    id: 'essay-13',
    title: 'The Challenge of Inflation and the Role of RBI\'s Monetary Policy Committee',
    category: 'essay',
    description: 'Explain the mechanism of inflation targeting in India. Examine how the RBI\'s Monetary Policy Committee (MPC) balance interest rates to control inflation while supporting GDP growth.',
    difficulty: 'hard',
    tags: ['Inflation', 'Monetary Policy', 'RBI MPC'],
    hints: [
      'Define inflation targeting (headline CPI target of 4% with a +/- 2% tolerance band).',
      'Describe the role and composition of the MPC (6 members: 3 internal, 3 external).',
      'Detail policy tools: Repo Rate, Reverse Repo Rate, CRR, SLR.',
      'Analyze the dilemma: hiking rates dampens demand (controls inflation) but increases borrowing costs (slows down growth).'
    ],
    facts: [
      'The statutory inflation targeting framework was introduced in India in 2016 through an amendment to the RBI Act.',
      'The MPC meets at least four times a year to decide on interest rates by majority vote.',
      'Supply-side shocks, such as food crop damages and crude oil prices, frequently complicate the MPC\'s demand-side rate decisions.'
    ],
    keywords: ['Monetary Policy Committee', 'Inflation Targeting', 'Repo Rate', 'Consumer Price Index', 'Liquidity Management', 'Economic Growth', 'Statutory Liquidity Ratio']
  },
  {
    id: 'essay-14',
    title: 'Cross-Border Payments: UPI Integration with Global Networks',
    category: 'essay',
    description: 'Discuss the expansion of India\'s Unified Payments Interface (UPI) to international markets. Evaluate the benefits for trade, tourism, and remittance flows.',
    difficulty: 'medium',
    tags: ['UPI', 'International Trade', 'Remittances'],
    hints: [
      'State UPI\'s integration with foreign countries (e.g., Singapore PayNow, UAE, Mauritius, Sri Lanka).',
      'Explain benefits: instant, low-cost cross-border payments, eliminating middleman bank charges, helping Indian tourists.',
      'Describe remittance advantages: India is the world\'s largest recipient of remittances; digital rails reduce cost.',
      'Outline technical hurdles: currency conversion spreads, cross-border compliance, interoperability.'
    ],
    facts: [
      'India received over $100 billion in remittances annually, making it the top global remittance recipient.',
      'The integration of UPI with Singapore\'s PayNow allows real-time, low-cost bank-to-bank fund transfers.',
      'UPI-based QR transactions are increasingly accepted at tourist hubs across Southeast Asia and the Gulf.'
    ],
    keywords: ['Cross-Border Payments', 'UPI International', 'Remittance Flows', 'Currency Conversion', 'Interoperability', 'Inward Remittances', 'Foreign Exchange']
  },
  {
    id: 'essay-15',
    title: 'Sustainable Development Goals (SDGs) and Banking Strategy',
    category: 'essay',
    description: 'Explore the alignment of commercial banking models with the United Nations Sustainable Development Goals. How can financial institutions promote social equality and environmental protection?',
    difficulty: 'hard',
    tags: ['SDGs', 'Sustainable Banking', 'Corporate Responsibility'],
    hints: [
      'Define SDGs and highlight banking-related goals: Goal 8 (Decent Work & Growth), Goal 13 (Climate Action), Goal 5 (Gender Equality).',
      'Explain ESG lending: screening borrowers based on environmental, social, and governance standards.',
      'Detail corporate social responsibility (CSR) programs funding clean water, sanitation, and school digital libraries.',
      'Conclude with the business logic: sustainable practices lower long-term credit risks.'
    ],
    facts: [
      'Top commercial banks are incorporating ESG risk frameworks into their credit appraisal processes for large infrastructure loans.',
      'India\'s CSR mandate under the Companies Act requires profitable banks to spend 2% of profits on social initiatives.',
      'Global institutional investors are shifting capital towards companies with high ESG scores.'
    ],
    keywords: ['ESG Integration', 'Sustainable Finance', 'Responsible Banking', 'Climate Risk', 'Gender Equality', 'Social Impact', 'CSR Mandate']
  },

  // Indian Economy & Policy (10 Essays)
  {
    id: 'essay-16',
    title: 'India\'s Journey Toward a $5 Trillion Economy: Key Enablers',
    category: 'essay',
    description: 'Examine the opportunities and structural bottlenecks in India\'s path to becoming a $5 trillion economy. Detail the roles of manufacturing, infrastructure investment, and digital services.',
    difficulty: 'medium',
    tags: ['Indian Economy', 'GDP Growth', 'Infrastructure'],
    hints: [
      'Define the target and the current size of the Indian economy.',
      'Identify key enablers: CAPEX infrastructure spending, digital economy, demographic dividend, manufacturing policies (PLI scheme).',
      'Detail bottlenecks: land acquisition delays, complex labor rules, low private investment, and skill gaps in the workforce.',
      'Propose solutions: logistics cost reduction, educational reforms, easing business compliance.'
    ],
    facts: [
      'The National Infrastructure Pipeline (NIP) aims to funnel massive capital into roads, railways, and energy sectors.',
      'India is currently the fifth-largest economy in the world by nominal GDP and third by PPP.',
      'Logistics cost in India represents nearly 13-14% of GDP, compared to 8% in advanced economies.'
    ],
    keywords: ['Five Trillion', 'Logistics Cost', 'Capital Expenditure', 'PLI Scheme', 'Demographic Dividend', 'Structural Reforms', 'Private CAPEX']
  },
  {
    id: 'essay-17',
    title: 'The MSME Sector: The Backbone of the Indian Economy',
    category: 'essay',
    description: 'Discuss the strategic importance of Micro, Small, and Medium Enterprises (MSMEs) in employment generation and exports. Suggest solutions to address credit shortages in this sector.',
    difficulty: 'medium',
    tags: ['MSMEs', 'Employment', 'Credit Access'],
    hints: [
      'State MSME definition (investment and turnover thresholds) and its share in GDP and exports.',
      'Discuss its employment impact: hiring unskilled and semi-skilled workers, preventing rural migration.',
      'Explain the credit gap: lack of formal collateral, delayed payments from large corporates, high default risk.',
      'Suggest interventions: TReDS platform, credit guarantee schemes (CGTMSE), fintech alternative underwriting.'
    ],
    facts: [
      'MSMEs contribute nearly 30% to India\'s GDP and account for around 45-50% of total exports.',
      'The sector employs over 11 crore people across urban and rural India.',
      'Trade Receivables Discounting System (TReDS) is an online platform to facilitate discounting of MSME invoices.'
    ],
    keywords: ['MSME Credit Gap', 'CGTMSE', 'TReDS Platform', 'Alternative Underwriting', 'Delayed Payments', 'Employment Generation', 'Industrial Clusters']
  },
  {
    id: 'essay-18',
    title: 'Goods and Services Tax (GST): Post-Implementation Evaluation',
    category: 'essay',
    description: 'Critically evaluate the impact of the Goods and Services Tax (GST) on the Indian tax structure, cooperative federalism, and formalization of the economy.',
    difficulty: 'hard',
    tags: ['GST', 'Indirect Taxation', 'Federalism'],
    hints: [
      'Introduce GST as a destination-based unified indirect tax launched in 2017.',
      'Discuss positive achievements: elimination of cascading tax effects, unified national market, increased tax compliance.',
      'Discuss challenges: compliance burden for small traders, disputes over GST compensation to states, complex rate structure.',
      'Suggest improvements: rationalizing tax slabs, simplification of filing portals.'
    ],
    facts: [
      'GST replaced multiple central and state taxes like excise duty, VAT, and service tax.',
      'Monthly GST collections regularly cross 1.6 to 1.8 lakh crore rupees, indicating economic formalization.',
      'The GST Council, chaired by the Union Finance Minister, is a constitutional body driving tax policy.'
    ],
    keywords: ['Cascading Effect', 'Destination-based Tax', 'GST Council', 'Federal Balance', 'Tax Compliance', 'Formalization', 'Input Tax Credit']
  },
  {
    id: 'essay-19',
    title: 'Atmanirbhar Bharat: Self-Reliance vs. Protectionism',
    category: 'essay',
    description: 'Analyze the "Atmanirbhar Bharat" initiative. Discuss whether self-reliance means isolation/protectionism, or if it integrates India more strongly with global supply chains.',
    difficulty: 'hard',
    tags: ['Self-Reliance', 'Trade Policy', 'Manufacturing'],
    hints: [
      'Define the core pillars of Atmanirbhar Bharat (Economy, Infrastructure, System, Demography, Demand).',
      'Explain that self-reliance does not mean closed-door policies, but enhancing domestic manufacturing capacity (e.g., defense, electronics).',
      'Discuss risks: high import tariffs protecting inefficient local industries, retaliatory duties by trade partners.',
      'Conclude: true self-reliance relies on building competitive quality standards to match global exports.'
    ],
    facts: [
      'The Production Linked Incentive (PLI) scheme spans 14 key sectors to boost domestic manufacturing.',
      'India\'s mobile phone manufacturing surged, making it one of the largest mobile exporters globally.',
      'Historic import-substituting policies in pre-1991 India led to stagnation; the current focus aims at export competitiveness.'
    ],
    keywords: ['Atmanirbhar', 'Global Value Chains', 'Export Competitiveness', 'PLI Scheme', 'Import Substitution', 'Protectionism', 'Ease of Doing Business']
  },
  {
    id: 'essay-20',
    title: 'The Gig Economy: Opportunities and Challenges for the Workforce',
    category: 'essay',
    description: 'Detail the growth of the gig economy in India. Analyze the benefits of flexible work structures for youths and companies, against the lack of job security and social protection.',
    difficulty: 'medium',
    tags: ['Gig Economy', 'Labor Reform', 'Employment'],
    hints: [
      'Define gig economy: platform-based, short-term contract work (e.g., delivery partners, freelance developers).',
      'Explain benefits: flexible hours, entry-level income source for youths, lower operational costs for startups.',
      'Highlight critical gaps: absence of health insurance, pension benefits, minimum wage protections, and job insecurity.',
      'State legislative efforts: Social Security Code provisions for gig workers.'
    ],
    facts: [
      'Reports estimate that India\'s gig workforce could grow to over 2.3 crore workers by the end of the decade.',
      'Platform workers are classified separately from traditional employees, creating legal gaps in benefit claims.',
      'Rajasthan became the first state in India to pass a specific bill for the welfare of platform-based gig workers.'
    ],
    keywords: ['Platform Workers', 'Social Security Code', 'Flexibility', 'Contractual Labor', 'Gig Workforce', 'Job Insecurity', 'Welfare Fund']
  },
  {
    id: 'essay-21',
    title: 'Direct Benefit Transfer (DBT): Plugs in Welfare Leakages',
    category: 'essay',
    description: 'Assess the role of the JAM Trinity (Jan Dhan-Aadhaar-Mobile) in restructuring welfare delivery in India. Discuss how DBT reduces corruption and fiscal waste.',
    difficulty: 'medium',
    tags: ['DBT', 'JAM Trinity', 'Welfare Systems'],
    hints: [
      'Introduce the concept of Direct Benefit Transfer and the JAM Trinity framework.',
      'Explain how payments are directly credited to beneficiaries\' Aadhaar-linked accounts.',
      'Discuss achievements: eliminating ghost beneficiaries, reducing administrative overhead, checking middleman corruption.',
      'Identify bottlenecks: fingerprint mismatch in rural biometric readers, bank branch access constraints.'
    ],
    facts: [
      'Hundreds of welfare schemes (e.g., PM-KISAN, LPG subsidy) operate via the DBT framework.',
      'Government estimates show that DBT saved lakhs of crores by weeding out fake and duplicate beneficiaries.',
      'Financial transfers are processed instantaneously through the National Payments Corporation of India (NPCI) mapper.'
    ],
    keywords: ['JAM Trinity', 'Direct Benefit Transfer', 'NPCI Mapper', 'Biometric Authentication', 'Middlemen', 'Fiscal Savings', 'Financial Inclusion']
  },
  {
    id: 'essay-22',
    title: 'The Challenge of Agricultural Marketing and Infrastructure in India',
    category: 'essay',
    description: 'Examine the issues faced by Indian farmers in selling their produce. Discuss the role of APMC mandis, e-NAM, and cold-chain logistics in reducing food wastage.',
    difficulty: 'hard',
    tags: ['Agriculture', 'Infrastructure', 'e-NAM'],
    hints: [
      'Highlight that India has high farm production but suffers from high post-harvest losses due to poor cold chains.',
      'Explain APMC (Agricultural Produce Market Committee) systems and their limitations (cartelization, commissions).',
      'Detail e-NAM (electronic National Agriculture Market) as a unified digital trading platform.',
      'Propose solutions: private investment in cold storage, food processing parks, and direct farm-to-retail linkages.'
    ],
    facts: [
      'India wastes a high percentage of fresh fruits and vegetables annually due to deficient storage infrastructure.',
      'The e-NAM portal integrates over 1,000 mandis across states to facilitate transparent online trading.',
      'Agriculture contributes nearly 15-18% to India\'s GDP but supports over 40% of the active workforce.'
    ],
    keywords: ['APMC Mandis', 'e-NAM', 'Cold Chain Logistics', 'Post-Harvest Loss', 'Food Processing', 'Cartelization', 'Price Discovery']
  },
  {
    id: 'essay-23',
    title: 'Unemployment and Skill Development: Bridging the Employability Gap',
    category: 'essay',
    description: 'Argue why general degrees lead to high youth unemployment. Highlight the role of vocational training and the Skill India mission in generating job-ready youth.',
    difficulty: 'medium',
    tags: ['Employability', 'Skill India', 'Education Policy'],
    hints: [
      'Define the difference between high literacy rate and low employability rate.',
      'Explain that traditional college curriculums focus on theoretical concepts, while industries require technology/applied skills.',
      'State government schemes: Pradhan Mantri Kaushal Vikas Yojana (PMKVY).',
      'Conclude with the importance of apprenticeship programs and industry-academia collaboration.'
    ],
    facts: [
      'Reports on Indian youth indicate that less than half of engineering and general graduates are immediately employable.',
      'The Skill India Mission targets training millions of youths in specialized technical trades.',
      'Germany\'s dual-education system, combining classroom study with paid industry apprenticeships, is a global benchmark.'
    ],
    keywords: ['Employability Gap', 'PMKVY', 'Vocational Training', 'Apprenticeships', 'Theoretical Curriculum', 'Skill India', 'Industry-Academia']
  },
  {
    id: 'essay-24',
    title: 'FDI (Foreign Direct Investment) in India: Trends and Economic Impact',
    category: 'essay',
    description: 'Detail the role of Foreign Direct Investment in driving capital growth and technology transfer. Analyze which sectors attract the most FDI and the impact of geopolitical changes.',
    difficulty: 'medium',
    tags: ['FDI', 'Capital Flows', 'Foreign Investment'],
    hints: [
      'Define FDI and contrast it with FPI (Foreign Portfolio Investment - hot money).',
      'Discuss benefits: foreign capital inflow, technology transfer, manufacturing practices, job creation.',
      'Highlight top sectors: computer software, services, telecommunications, and auto industries.',
      'Discuss challenges: regulatory flips, bureaucratic red tape, and infrastructural deficits.'
    ],
    facts: [
      'India consistently ranks among the top global destinations for greenfield FDI projects.',
      'Singapore, Mauritius, and the US represent major sourcing nations for inward FDI flows to India.',
      'FDI limits in key sectors like insurance and defense have been liberalized to attract long-term investments.'
    ],
    keywords: ['Foreign Direct Investment', 'Foreign Portfolio Investment', 'Greenfield Project', 'Capital Inflow', 'Technology Transfer', 'Liberalization', 'Compliance Ease']
  },
  {
    id: 'essay-25',
    title: 'Special Economic Zones (SEZs): Review of Export Performance',
    category: 'essay',
    description: 'Assess the performance of Special Economic Zones in India. Discuss how they boost manufacturing exports and whether they create land acquisition conflicts.',
    difficulty: 'hard',
    tags: ['SEZ', 'Exports', 'Land Acquisition'],
    hints: [
      'Define SEZs: duty-free enclaves with simplified economic laws to encourage exports and investment.',
      'Analyze successes: major hubs in IT services, electronics, and pharmaceuticals.',
      'Outline failures: vacant land parcels, tax incentives utilized without matching long-term manufacturing growth, conflicts over fertile land.',
      'Suggest transitions (e.g. Development of Enterprise and Service Hubs - DESH Bill).'
    ],
    facts: [
      'The SEZ Act was passed in India in 2005 to boost export operations.',
      'SEZ units enjoy tax holidays, duty-free imports, and single-window clearances.',
      'The DESH Bill was proposed to overhaul SEZs, allowing domestic market sales without heavy penalties.'
    ],
    keywords: ['SEZ Act', 'Tax Holiday', 'DESH Bill', 'Single Window Clearance', 'Domestic Tariff Area', 'Export Promotion', 'Land Acquisition']
  },

  // Technology & Innovation (10 Essays)
  {
    id: 'essay-26',
    title: 'Generative AI: The Future of Content Creation and Job Disruption',
    category: 'essay',
    description: 'Analyze the sudden rise of Generative AI tools (LLMs). Examine the productivity boosts they offer against concerns regarding deepfakes, copyright violations, and job losses in white-collar sectors.',
    difficulty: 'medium',
    tags: ['Generative AI', 'Technology', 'Ethics'],
    hints: [
      'Define Generative AI and Large Language Models (LLMs).',
      'Explain benefits: coding assistants, automated copy writing, high-speed document summarization.',
      'Identify core concerns: misinformation through deepfakes, intellectual property infringement, loss of entry-level editing and coding jobs.',
      'Conclude with the need for ethical AI alignment and regulatory frameworks.'
    ],
    facts: [
      'AI models can generate human-like text, code, and artwork based on prompts.',
      'Several technology enterprises have integrated generative tools, reducing support ticket response times.',
      'Governments globally are drafting AI safety policies to regulate deepfake propagation.'
    ],
    keywords: ['Generative AI', 'Large Language Models', 'Deepfakes', 'Copyright', 'Job Disruption', 'AI Regulation', 'Ethical Alignment']
  },
  {
    id: 'essay-27',
    title: 'The Digital Divide: Access, Literacy, and Social Disparity',
    category: 'essay',
    description: 'Argue how the expansion of digital services (banking, education, healthcare) risks leaving behind populations lacking internet access or basic digital literacy.',
    difficulty: 'medium',
    tags: ['Digital Divide', 'Social Equity', 'Digital Literacy'],
    hints: [
      'Define digital divide: the gap between demographics that have access to modern information tech and those who do not.',
      'Analyze the impact on education (online classes during crises) and banking (phasing out rural physical services).',
      'Discuss gender digital divide: lower smartphone ownership among rural women.',
      'Propose initiatives: BharatNet project, community digital centers, basic school computer training.'
    ],
    facts: [
      'The BharatNet project aims to connect all village gram panchayats with high-speed optical fiber.',
      'Survey data shows that while smartphone usage is high, active digital literacy is much lower in rural settings.',
      'A significant gender gap exists in internet usage rates in developing nations.'
    ],
    keywords: ['Digital Divide', 'BharatNet', 'Digital Access', 'Gender Gap', 'Online Education', 'Social Disparity', 'Gram Panchayats']
  },
  {
    id: 'essay-28',
    title: 'Cryptocurrencies vs. Central Bank Currencies: A Regulatory Debate',
    category: 'essay',
    description: 'Examine the risks private cryptocurrencies pose to monetary stability and sovereign control. Compare them with official Central Bank Digital Currencies (CBDCs).',
    difficulty: 'hard',
    tags: ['Cryptocurrency', 'Financial Stability', 'CBDC'],
    hints: [
      'Define cryptocurrencies (decentralized, blockchain-based tokens like Bitcoin) and their high volatility.',
      'Detail regulatory risks: money laundering, terror financing, tax evasion, loss of central bank monetary control.',
      'Contrast with CBDCs: centralized, legal tender, digital version of sovereign fiat.',
      'Summarize global stances (taxation, complete bans, or regulatory tracking).'
    ],
    facts: [
      'The RBI has consistently warned that private cryptocurrencies pose systemic risks to financial stability.',
      'India introduced a 30% tax on income from virtual digital assets and a 1% TDS on transactions.',
      'Several countries have banned cryptocurrency trading outright to protect capital control.'
    ],
    keywords: ['Sovereign Fiat', 'Private Cryptocurrency', 'Blockchain', 'Systemic Risk', 'Tax Evaded', 'Capital Control', 'TDS Regulation']
  },
  {
    id: 'essay-29',
    title: '5G and 6G Technologies: Shaping the Connected World',
    category: 'essay',
    description: 'Evaluate the rollout of 5G networks and the ongoing development of 6G. Analyze how high speeds and low latency drive IoT, smart cities, and remote telemedicine.',
    difficulty: 'medium',
    tags: ['5G Network', 'IoT', 'Infrastructure'],
    hints: [
      'Detail features of 5G: high data transfer speed, low latency, and high device connection density.',
      'Examine use cases: smart manufacturing, connected automated vehicles, precision agriculture, and remote health consults.',
      'Explain 6G horizons: terahertz communications, AI-native network architecture.',
      'Highlight hurdles: high cost of fiber backhaul, base station densification, and spectrum allocation.'
    ],
    facts: [
      'India saw one of the fastest 5G rollouts in the world across hundreds of cities.',
      '5G latency drops to under 10 milliseconds, which is critical for real-time remote robotics.',
      '6G development is expected to commercialize around 2030, offering speeds up to 100 times faster than 5G.'
    ],
    keywords: ['Low Latency', 'Internet of Things', 'Telemedicine', 'Spectrum Allocation', 'Fiber Backhaul', 'Densification', 'Terahertz']
  },
  {
    id: 'essay-30',
    title: 'The Ethics of Big Data: Privacy in the Age of Surveillance Capitalism',
    category: 'essay',
    description: 'Examine how tech companies collect, process, and monetize personal user data. Detail the need for data protection acts to safeguard individual privacy.',
    difficulty: 'hard',
    tags: ['Data Privacy', 'DPDP Act', 'Digital Ethics'],
    hints: [
      'Explain how user actions are tracked online to build psychological profiles for target ads.',
      'Introduce the concept of "surveillance capitalism" (coined by Shoshana Zuboff).',
      'Detail the provisions of India\'s Digital Personal Data Protection (DPDP) Act.',
      'Discuss balancing innovation (data sharing) with individual privacy rights.'
    ],
    facts: [
      'India passed the Digital Personal Data Protection (DPDP) Act in 2023.',
      'The DPDP Act imposes financial penalties on entities failing to prevent data breaches or misusing consent.',
      'European Union\'s GDPR represents the global gold standard for user data rights.'
    ],
    keywords: ['DPDP Act', 'Surveillance Capitalism', 'Consent Managers', 'Data Fiduciaries', 'GDPR Compliance', 'User Profiling', 'Breach Penalty']
  },
  {
    id: 'essay-31',
    title: 'E-Commerce Expansion and the Decline of Traditional Retail',
    category: 'essay',
    description: 'Evaluate the rapid growth of e-commerce platforms. Discuss whether online retail will completely wipe out local mom-and-pop shops, and suggest hybrid survival strategies.',
    difficulty: 'medium',
    tags: ['E-Commerce', 'Retail Sector', 'ONDC'],
    hints: [
      'Acknowledge the rise of digital marketplaces and quick-commerce delivery apps.',
      'Explain benefits: convenience, pricing competition, wider choices, logistics employment.',
      'Detail threats to local Kirana shops: loss of foot traffic, inability to match discount pricing.',
      'State government support: Open Network for Digital Commerce (ONDC) to democratize e-commerce.'
    ],
    facts: [
      'E-commerce penetration is growing rapidly in Tier-2 and Tier-3 cities in India.',
      'Quick-commerce apps deliver grocery items within 10-15 minutes, shifting daily purchase habits.',
      'ONDC allows small merchants to sell directly to consumers across multiple buyer platforms.'
    ],
    keywords: ['ONDC', 'Quick Commerce', 'Kirana Shops', 'Market Monopoly', 'Unified Interface', 'Discount Pricing', 'Logistics Infrastructure']
  },
  {
    id: 'essay-32',
    title: 'Cloud Computing: Transforming Enterprise Operations',
    category: 'essay',
    description: 'Detail the shift from local server rooms to cloud infrastructures. Discuss the cost benefits, scalability, and security risks of cloud integration for banks and tech startups.',
    difficulty: 'medium',
    tags: ['Cloud Infrastructure', 'Tech Operations', 'Data Center'],
    hints: [
      'Define cloud computing: on-demand delivery of IT resources (storage, databases) over the internet.',
      'Contrast CAPEX (buying physical servers) with OPEX (pay-as-you-go cloud service models).',
      'Discuss security: shared responsibility models, encryption at rest/in transit, data sovereignty regulations.',
      'Highlight RBI rules: mandate that banking data of Indian citizens must be stored inside national borders.'
    ],
    facts: [
      'Major public sector and private banks are adopting hybrid cloud models to scale digital transactions.',
      'The RBI requires payment data of Indian residents to be localized within India.',
      'Cloud transitions help businesses handle sudden peak transaction loads without system crashes.'
    ],
    keywords: ['Cloud Computing', 'Hybrid Cloud', 'Data Localization', 'Sovereignty', 'SaaS', 'OPEX Model', 'Scalability']
  },
  {
    id: 'essay-33',
    title: 'Blockchain Technology Beyond Cryptocurrency',
    category: 'essay',
    description: 'Argue how blockchain (distributed ledger technology) can reform supply chain logistics, land registry records, and trade finance, independent of digital tokens.',
    difficulty: 'hard',
    tags: ['Blockchain', 'Distributed Ledger', 'Supply Chain'],
    hints: [
      'Define blockchain as an immutable, decentralized ledger verifying transactions through consensus.',
      'Detail supply chain application: tracing goods from raw source to end consumer, preventing counterfeiting.',
      'Explain land registry: eliminating fraud by recording titles on a tamper-proof digital database.',
      'Discuss trade finance: smart contracts automating payment release upon custom clearance verify.'
    ],
    facts: [
      'Several state governments in India are piloting blockchain-based land record storage.',
      'Major global logistics companies use distributed ledgers to track containers and cargo status in real time.',
      'Smart contracts reduce dispute settlement times in trade transactions.'
    ],
    keywords: ['Distributed Ledger', 'Immutability', 'Smart Contracts', 'Land Registry', 'Supply Chain Traceability', 'Consensus Algorithm', 'Tamper-proof']
  },
  {
    id: 'essay-34',
    title: 'The Rise of Smart Cities: Urban Planning in the Digital Age',
    category: 'essay',
    description: 'Evaluate the concept of Smart Cities. Analyze how smart grids, integrated traffic systems, and IoT waste management address the challenges of rapid urbanization.',
    difficulty: 'medium',
    tags: ['Smart Cities', 'Urban Planning', 'Sustainability'],
    hints: [
      'Describe the challenges of urbanization: congestion, pollution, water scarcity, housing shortages.',
      'Explain smart features: sensors managing street lighting, smart grids optimizing power distribution, traffic cameras routing flows.',
      'Acknowledge constraints: high installation costs, legacy infrastructure limits, cyber threat risk.',
      'Emphasize that smart technology must serve basic citizens needs (sanitation, safe water).'
    ],
    facts: [
      'India\'s Smart Cities Mission targets overhauling urban infrastructure in 100 selected cities.',
      'Smart grids can automatically detect and reroute power around localized grid failures.',
      'Integrated Command and Control Centers (ICCCs) act as the brain of smart cities during emergencies.'
    ],
    keywords: ['Smart Cities', 'ICCC', 'Smart Grid', 'Internet of Things', 'Urbanization', 'Traffic Routing', 'Carbon Efficiency']
  },
  {
    id: 'essay-35',
    title: 'AI Ethics: Regulating Algorithm Bias and Decision Fairness',
    category: 'essay',
    description: 'Detail how automated decision algorithms (for hiring, lending, judicial bail) can inherit and amplify human biases. Suggest policies to guarantee algorithmic fairness.',
    difficulty: 'hard',
    tags: ['AI Ethics', 'Algorithm Bias', 'Social Justice'],
    hints: [
      'Explain that AI models learn from historical data, which may contain human discrimination.',
      'Show examples: credit models denying loans to specific neighborhoods, resume screeners favoring certain profiles.',
      'Outline solutions: training models on balanced datasets, auditing models for bias, establishing human-in-the-loop validation.',
      'Conclude on the importance of "Explainable AI" so decisions can be questioned.'
    ],
    facts: [
      'Studies show facial recognition algorithms have higher error rates for minority demographics.',
      'The EU AI Act classifies AI systems based on risk level, banning high-risk discriminatory profiling.',
      'Explainable AI (XAI) frameworks are being developed to help developers trace how algorithms reach outputs.'
    ],
    keywords: ['Algorithm Bias', 'Explainable AI', 'Data Profiling', 'EU AI Act', 'Discriminatory Data', 'Automated Decisioning', 'Human-in-the-loop']
  },

  // Environment & Sustainability (10 Essays)
  {
    id: 'essay-36',
    title: 'The Electric Vehicle (EV) Transition: Opportunities and Roadblocks',
    category: 'essay',
    description: 'Examine the transition from internal combustion engines to Electric Vehicles. Analyze India\'s EV goals, environmental benefits, charging network limits, and battery sourcing issues.',
    difficulty: 'medium',
    tags: ['Electric Vehicles', 'FAME Scheme', 'Clean Energy'],
    hints: [
      'Acknowledge the rising air pollution and fossil fuel import bill as drivers for EV adoption.',
      'Detail government initiatives like the FAME (Faster Adoption and Manufacturing of Electric Vehicles) scheme.',
      'Explain roadblocks: lack of public fast-charging stations, high upfront costs, dependence on imported lithium-ion cells.',
      'Conclude on domestic battery recycling and grid upgrades.'
    ],
    facts: [
      'The FAME scheme provides direct purchase subsidies on electric two-wheelers and public buses.',
      'China currently dominates the global supply chain for lithium processing and battery cathode production.',
      'Transitioning to EVs only reduces emissions if the primary electricity grid shifts from coal to renewables.'
    ],
    keywords: ['Electric Vehicles', 'FAME Scheme', 'Lithium-ion Battery', 'Charging Infrastructure', 'Grid Load', 'Clean Mobility', 'Carbon Emissions']
  },
  {
    id: 'essay-37',
    title: 'Single-Use Plastic Bans: Policy Success or Enforcement Failure?',
    category: 'essay',
    description: 'Critically analyze the ban on single-use plastics in India. Evaluate why execution remains weak at retail levels, and suggest viable biodegradable alternatives.',
    difficulty: 'medium',
    tags: ['Plastic Pollution', 'Waste Management', 'Environment Policy'],
    hints: [
      'Highlight the scale of plastic pollution clog waterways and damaging ecosystems.',
      'Acknowledge the implementation of national single-use plastic bans.',
      'Analyze why enforcement is weak: lack of cheap alternatives, poor monitoring of small street vendors, resistance from plastic packaging industries.',
      'Suggest alternatives: jute bags, bamboo cutlery, seaweed-based packaging, and strict municipal fines.'
    ],
    facts: [
      'India generates millions of tonnes of plastic waste annually, with a low percentage recycled.',
      'Single-use plastics represent a major fraction of ocean micro-plastic contamination.',
      'State pollution control boards are authorized to penalize manufacturing units violating plastic thickness limits.'
    ],
    keywords: ['Single-use Plastic', 'Biodegradable', 'Micro-plastics', 'Enforcement Gap', 'Waste Segregation', 'Extended Producer Responsibility', 'Ecosystem Damage']
  },
  {
    id: 'essay-38',
    title: 'The Hydrogen Economy: The Green Hydrogen Mission',
    category: 'essay',
    description: 'Discuss the concept of a Hydrogen Economy. Focus on India\'s National Green Hydrogen Mission and its potential to clean up heavy industries (steel, fertilizers, transport).',
    difficulty: 'hard',
    tags: ['Green Hydrogen', 'Energy Security', 'Decarbonization'],
    hints: [
      'Differentiate between Grey Hydrogen (from fossil fuels), Blue Hydrogen (with carbon capture), and Green Hydrogen (electrolysis using renewable power).',
      'Detail the National Green Hydrogen Mission objectives.',
      'Explain benefits: domestic energy security, cutting fossil fuel imports, exporting clean fuels.',
      'List challenges: high cost of electrolyzers, high water consumption, storage and pipeline leakage issues.'
    ],
    facts: [
      'India launched the National Green Hydrogen Mission targeting production of 5 MMT of green hydrogen annually by 2030.',
      'Green hydrogen requires massive amounts of pure water and cheap renewable electricity to be commercially viable.',
      'Hydrogen is a highly explosive gas, requiring specialized high-pressure storage tanks and transport infrastructure.'
    ],
    keywords: ['Green Hydrogen', 'Electrolyzers', 'Energy Transition', 'National Mission', 'Storage Safety', 'Carbon Neutral', 'Heavy Industry']
  },
  {
    id: 'essay-39',
    title: 'Carbon Credits and the Market-Based Approach to Carbon Control',
    category: 'essay',
    description: 'Explain the working of Carbon Markets. Evaluate how carbon credit trading incentivizes companies to cut emissions, and discuss the risks of greenwashing.',
    difficulty: 'hard',
    tags: ['Carbon Credits', 'Climate Markets', 'ESG'],
    hints: [
      'Explain cap-and-trade: capping total emissions and allowing companies to buy/sell unused emission permits.',
      'Detail how voluntary carbon markets allow companies to offset emissions by funding rural forestry projects.',
      'Point out challenges: verifying actual carbon absorption, double-counting, cheap offsets allowing major polluters to delay emission cuts.',
      'Propose reforms: unified verification registries and strict definitions.'
    ],
    facts: [
      'The Kyoto Protocol laid the initial foundations for international carbon credit transactions.',
      'India is developing its own Carbon Credit Trading Scheme (CCTS) to formalize domestic carbon exchanges.',
      'Criticisms of carbon offsets focus on projects that would have occurred anyway without the funding (additionality issues).'
    ],
    keywords: ['Carbon Offsets', 'Cap and Trade', 'Greenwashing', 'Kyoto Protocol', 'CCTS India', 'Voluntary Market', 'Additionality']
  },
  {
    id: 'essay-40',
    title: 'Water Conservation and the Threat of Day Zero in Cities',
    category: 'essay',
    description: 'Analyze the acute water crisis in major urban hubs. Discuss rain-water harvesting, wastewater recycling, and policy coordination needed to prevent cities from running out of water.',
    difficulty: 'medium',
    tags: ['Water Scarcity', 'Urban Conservation', 'Jal Jeevan'],
    hints: [
      'Cite examples of global/domestic cities facing "Day Zero" (running out of municipal water, e.g., Cape Town, Bengaluru).',
      'Explain causes: concrete covering recharge zones, drying lakes, over-extraction of groundwater, leakages.',
      'Detail solutions: mandatory rainwater harvesting in apartments, dual-piping for recycled toilet water, restoring urban wetlands.',
      'Mention government programs like Jal Jeevan Mission and Amrit Sarovar.'
    ],
    facts: [
      'Groundwater levels in major cities have dropped significantly, prompting drilling deeper bores.',
      'Recycling wastewater to drinking standards is successfully implemented in water-scarce cities like Singapore.',
      'A vast majority of rainwater in Indian cities flows into concrete storm drains without recharge.'
    ],
    keywords: ['Day Zero', 'Groundwater Depletion', 'Rainwater Harvesting', 'Wastewater Recycling', 'Wetland Restoration', 'Water Recharge', 'Urban Hydrology']
  },
  {
    id: 'essay-41',
    title: 'Circular Economy: Redefining Consumption and Waste',
    category: 'essay',
    description: 'Explore the transition from a linear economy (take-make-dispose) to a circular economy. Discuss the benefits of product longevity, recycling, and remanufacturing.',
    difficulty: 'medium',
    tags: ['Circular Economy', 'Recycling', 'Sustainability'],
    hints: [
      'Define linear economy and its resource exhaustion risks.',
      'Define circular economy: design out waste, keep products in use, regenerate natural systems.',
      'Detail industries adopting circular models: smartphone manufacturers using recycled metals, fashion brands using upcycled fibers.',
      'Suggest policy supports: tax concessions on recycled inputs and EPR rules.'
    ],
    facts: [
      'Extended Producer Responsibility (EPR) regulations mandate electronics brands to manage the recycling of their sold goods.',
      'Extracting gold from electronic waste generates significantly fewer emissions than mining raw gold.',
      'Only a small fraction of municipal solid waste globally is currently processed back into original raw materials.'
    ],
    keywords: ['Circular Economy', 'Linear Consumption', 'Upcycling', 'Extended Producer Responsibility', 'Resource Recovery', 'Sustainable Materials', 'E-Waste']
  },
  {
    id: 'essay-42',
    title: 'Disaster Management and Economic Resilience',
    category: 'essay',
    description: 'Evaluate the economic costs of natural disasters (floods, cyclones) in India. Analyze the transition from reactive relief work to proactive disaster-resilient infrastructure design.',
    difficulty: 'hard',
    tags: ['Disaster Management', 'Infrastructure', 'NDMA'],
    hints: [
      'Highlight the high annual financial damage caused by cyclones in coastal states and urban flooding.',
      'Discuss the NDMA (National Disaster Management Authority) framework.',
      'Explain proactive measures: cyclone-resilient electricity poles, retention basins in flood-prone cities, earthquake-resistant construction standards.',
      'Conclude: climate adaptation finance represents a critical investment, not a cost.'
    ],
    facts: [
      'Every major urban flood in cities costs local businesses billions of rupees in inventory damages and work stoppages.',
      'India\'s early warning systems for cyclones have dramatically reduced human casualties over the last two decades.',
      'The Coalition for Disaster Resilient Infrastructure (CDRI) was launched by India to promote global resilient building.'
    ],
    keywords: ['NDMA', 'Early Warning Systems', 'Infrastructure Resilience', 'Urban Flooding', 'Climate Adaptation', 'CDRI', 'Economic Damage']
  },
  {
    id: 'essay-43',
    title: 'Renewable Energy Integration and Grid Stability',
    category: 'essay',
    description: 'Assess India\'s target of achieving 500 GW of non-fossil fuel energy. Discuss the technical challenges of grid stability, power storage, and matching peak demand with variable solar/wind power.',
    difficulty: 'hard',
    tags: ['Renewable Energy', 'Grid Stability', 'Solar Power'],
    hints: [
      'State India\'s commitment at COP summits regarding renewable capacity.',
      'Detail the variability issue: solar power peaks at noon, wind power is seasonal, but electricity demand peaks in the evening.',
      'Explain storage solutions: Pumped Hydro Storage (PHS) and Battery Energy Storage Systems (BESS).',
      'Explain the importance of green energy corridors to transmit power across states.'
    ],
    facts: [
      'India ranks among the world leaders in installed solar power capacity.',
      'The green energy corridor project facilitates grid integration of large-scale solar parks in western deserts.',
      'BESS technology remains capital-intensive, prompting the government to support it via viability gap funding.'
    ],
    keywords: ['Variable Power', 'Grid Integration', 'PHS Storage', 'BESS Systems', 'COP Commitments', 'Viability Gap Funding', 'Green Energy Corridor']
  },
  {
    id: 'essay-44',
    title: 'Air Pollution: The Health and Economic Crisis of Indian Cities',
    category: 'essay',
    description: 'Examine the multi-layered causes of air pollution in Indo-Gangetic plains. Suggest policy solutions spanning crop residue management, clean transport, and dust control.',
    difficulty: 'medium',
    tags: ['Air Quality', 'NCAP', 'Public Health'],
    hints: [
      'Cite AQI spikes in winter, crop residue stubble burning, coal-fired plants, construction dust, and vehicular exhaust.',
      'Outline economic costs: healthcare bills, reduced worker productivity, and low tourism rates.',
      'Detail solutions: promoting happy-seeder machines for farmers, shifting public transport to electric, implementing strict dust covers.',
      'State government programs: National Clean Air Programme (NCAP).'
    ],
    facts: [
      'Air pollution reduces the average life expectancy of residents in highly contaminated areas by years.',
      'The National Clean Air Programme targets a 20-30% reduction in PM2.5 and PM10 concentrations.',
      'Stubble burning in northern states represents a seasonal spike, but vehicular and industrial pollution remains a year-round baseline.'
    ],
    keywords: ['AQI Levels', 'PM2.5', 'Stubble Burning', 'NCAP', 'Public Health Cost', 'Productivity Loss', 'Clean Transport']
  },
  {
    id: 'essay-45',
    title: 'Sustainable Tourism: Balancing Growth with Conservation',
    category: 'essay',
    description: 'Argue the impacts of mass tourism on fragile ecological zones (e.g. Himalayas, Western Ghats). Suggest measures to implement eco-tourism codes and carrying-capacity limits.',
    difficulty: 'medium',
    tags: ['Eco-tourism', 'Conservation', 'Himalayas'],
    hints: [
      'Define carrying capacity: the maximum population size of a species that the environment can sustain.',
      'Highlight threats: commercial building collapse risk, plastic waste dumping, local water source diversion.',
      'Suggest strategies: strict tourist caps, banning plastics in national parks, green taxes funding local cleanup, promoting community-run homestays.',
      'Conclude: tourism must benefit local populations without destroying the natural capital.'
    ],
    facts: [
      'Unregulated commercial constructions in Himalayan towns have caused land subsidence and structural damage.',
      'Several global destinations have implemented overnight stay fees or tourist booking caps to protect natural sites.',
      'Community-run homestays in Northeast states keep tourism revenues local and reduce heavy hotel footprints.'
    ],
    keywords: ['Carrying Capacity', 'Eco-tourism', 'Land Subsidence', 'Waste Accumulation', 'Fragile Ecosystem', 'Green Tax', 'Community Homestay']
  },

  // Social Issues & Governance (5 Essays)
  {
    id: 'essay-46',
    title: 'National Education Policy (NEP) 2020: Review of School and Higher Education Reforms',
    category: 'essay',
    description: 'Analyze the structural changes introduced by NEP 2020. Examine how the policy promotes mother-tongue instruction, vocational training, and multi-disciplinary university degrees.',
    difficulty: 'medium',
    tags: ['NEP 2020', 'Education Reform', 'Vocational Studies'],
    hints: [
      'Outline the 5+3+3+4 structure replacing the classic 10+2 pattern.',
      'Discuss positives: multi-disciplinary options, credit banks allowing flexible exit-entry, vocational skills from class 6.',
      'Detail challenges: teacher retraining, digital gaps in rural schools, state-level implementation differences.',
      'Summarize with the target of increasing research and public spending on education.'
    ],
    facts: [
      'NEP 2020 aims to increase public investment in education to 6% of GDP.',
      'The policy establishes the Academic Bank of Credits (ABC) to store university grades digitally.',
      'The new pedagogical structure focuses on cognitive development phases of childhood.'
    ],
    keywords: ['NEP 2020', 'Academic Bank of Credits', 'Multi-disciplinary', 'Vocational Integration', 'Pedagogical Structure', 'Teacher Training', 'GDP Allocation']
  },
  {
    id: 'essay-47',
    title: 'Women Empowerment and the Role of Financial Independence',
    category: 'essay',
    description: 'Detail why gender equality is impossible without economic self-reliance. Analyze the impact of bank account ownership, micro-loans, and digital financial tools on women\'s agency.',
    difficulty: 'medium',
    tags: ['Gender Equality', 'Financial Independence', 'Financial Inclusion'],
    hints: [
      'Explain that social rights are fragile if women depend on family members for daily sustenance.',
      'Highlight how direct deposits under welfare programs (DBT) give women control over their funds.',
      'Discuss how microfinance loan groups build community networks and leadership skills.',
      'Highlight gaps: low representation of women in banking management, and digital literacy gaps.'
    ],
    facts: [
      'The Mudra Yojana scheme has extended a high percentage of its entrepreneurial loans to women borrowers.',
      'Financial inclusion metrics show that joint bank accounts are increasingly transitioning to individual female bank accounts.',
      'Studies confirm that women invest a larger share of their earnings back into household health and nutrition.'
    ],
    keywords: ['Financial Independence', 'Mudra Loans', 'Welfare Deposits', 'Decision Agency', 'Rural Enterprise', 'Digital Literacy Gap', 'Economic Autonomy']
  },
  {
    id: 'essay-48',
    title: 'The Mental Health Crisis: Destigmatizing Care in Modern Society',
    category: 'essay',
    description: 'Discuss the rise of mental health issues among youths due to academic pressure, social media comparison, and urban isolation. Suggest public policies to integrate care with primary health.',
    difficulty: 'medium',
    tags: ['Mental Health', 'Public Health', 'Healthcare Policy'],
    hints: [
      'Identify triggers: exam stress, corporate work hours, lack of community support, online validation seeking.',
      'Highlight the social stigma preventing individuals from seeking therapy or psychiatric advice.',
      'Propose measures: school counsellors, corporate wellness mandates, national tele-mental health services (Tele-MANAS).',
      'Conclude: mental health must be covered by standard health insurance policies.'
    ],
    facts: [
      'The Indian government launched Tele-MANAS (Tele Mental Health Assistance and Networking Across States) in 2022.',
      'Mental health issues represent a significant global burden of disease, with young adults most affected.',
      'Insurance regulations in India mandate that insurers must treat mental illness on par with physical ailments.'
    ],
    keywords: ['Tele-MANAS', 'Destigmatization', 'Academic Stress', 'Insurance Mandate', 'Urban Isolation', 'Cognitive Health', 'Primary Healthcare']
  },
  {
    id: 'essay-49',
    title: 'The Impact of Social Media on Public Discourse and Democracy',
    category: 'essay',
    description: 'Evaluate the role of social media platforms in connecting people, versus their impact in spreading fake news, echo chambers, and polarizing political views.',
    difficulty: 'medium',
    tags: ['Social Media', 'Fake News', 'Democracy'],
    hints: [
      'Acknowledge that social platforms democratize content generation, allowing marginalized voices to speak.',
      'Explain the algorithm dynamic: maximizing engagement leads to promoting sensational, emotional, or divisive content.',
      'Discuss risks: deepfakes, coordinated misinformation during elections, and cyber-bullying.',
      'Suggest solutions: platform accountability rules, third-party fact-checkers, and public digital hygiene literacy.'
    ],
    facts: [
      'Algorithms are designed to prioritize posts with high shares and comments, which correlate with high emotional triggers.',
      'Misinformation spreads significantly faster than verified fact-checking statements on digital networks.',
      'Several governments have updated IT rules to require platforms to trace the origin of viral illegal content.'
    ],
    keywords: ['Echo Chambers', 'Algorithm Engagement', 'Polarization', 'Fake News', 'Information Hygiene', 'IT Rules', 'Democratized Content']
  },
  {
    id: 'essay-50',
    title: 'Healthcare Infrastructure Reforms: Lessons from Global Crises',
    category: 'essay',
    description: 'Detail the gaps in primary and tertiary healthcare infrastructure. Analyze the role of technology (tele-medicine, digital health cards) and public funding in building resilient health networks.',
    difficulty: 'hard',
    tags: ['Healthcare', 'Ayushman Bharat', 'Public Funding'],
    hints: [
      'Discuss low public healthcare spending as a percentage of GDP.',
      'Detail Ayushman Bharat (PM-JAY) and its goal of providing secondary and tertiary care cover to poor households.',
      'Explain how digital health records (Ayushman Bharat Digital Mission) simplify treatment coordination.',
      'Highlight training programs to build rural doctor and nursing capacities.'
    ],
    facts: [
      'India\'s public health expenditure is around 1.3-1.5% of GDP, below the target of 2.5% set by national policies.',
      'PM-JAY provides health cover up to Rs. 5 Lakhs per family per year to eligible low-income households.',
      'The Ayushman Bharat Digital Mission (ABDM) creates unique digital health accounts to store medical reports.'
    ],
    keywords: ['PM-JAY', 'ABDM', 'Health Expenditure', 'GDP Ratio', 'Tele-consultation', 'Primary Healthcare', 'Resilient Infrastructure']
  },

  // ==================== FORMAL LETTERS (25 Topics) ====================
  {
    id: 'formal-1',
    title: 'Request Letter: Apply for an Education Loan',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager of Apex Bank requesting an education loan of Rs. 15 Lakhs for pursuing higher studies abroad.',
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
  {
    id: 'formal-3',
    title: 'Request Letter: Re-activation of Dormant Account',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager of your bank requesting the re-activation of your savings bank account which has become dormant due to non-operation for two years.',
    difficulty: 'easy',
    tags: ['Account Re-activation', 'Dormant Account', 'Bank Manager'],
    hints: [
      'State your dormant account number and the reason for non-operation (e.g. transfer to another city).',
      'Mention that you have attached your KYC documents (Aadhaar and PAN) along with a fresh photograph.',
      'Request the manager to restore transaction facilities on the account.',
      'Close with professional salutations and signature details.'
    ],
    facts: [
      'A savings or current account is classified as inoperative or dormant if there are no customer-induced transactions for over two years.',
      'No charges are leviable by banks for the activation of inoperative accounts, according to RBI mandates.'
    ],
    keywords: ['Dormant Account', 'Re-activation', 'KYC Verification', 'Inoperative Account', 'Savings Account', 'Customer Verification', 'Identity Proof']
  },
  {
    id: 'formal-4',
    title: 'Complaint Letter: Delay in Pension Disbursement',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager complaining about the delay in the disbursement of your monthly pension for the last three months, which is causing financial distress.',
    difficulty: 'medium',
    tags: ['Pension Delay', 'Senior Citizen', 'Complaint'],
    hints: [
      'Specify your Pension Payment Order (PPO) number and savings bank account details.',
      'Explain that the pension has not been credited since the last three months, causing extreme difficulty in purchase of medicines.',
      'Mention that you have submitted the annual Life Certificate in time.',
      'Politely request immediate clearance of arrears and regular monthly credits.'
    ],
    facts: [
      'Banks are required to credit pension by the last working day of the month (except for March, which is sometimes slightly adjusted).',
      'Retired government employees must submit their Life Certificate in November every year to ensure uninterrupted pension flows.'
    ],
    keywords: ['Pension Payment Order', 'Life Certificate', 'Arrears Credit', 'Senior Citizen Care', 'Disbursement Delay', 'Account Statement', 'Financial Distress']
  },
  {
    id: 'formal-5',
    title: 'Request Letter: Branch Manager for Home Loan NOC',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting a No Objection Certificate (NOC) and return of original property documents after full repayment of your home loan.',
    difficulty: 'medium',
    tags: ['NOC Request', 'Home Loan', 'Bank Manager'],
    hints: [
      'Provide details of the home loan account number and property mortgaged.',
      'Confirm that you have paid all outstanding dues and closed the loan account.',
      'Request the issuance of NOC/No Dues Certificate.',
      'Request the return of original title deeds deposited as collateral, asking for a convenient pickup date.'
    ],
    facts: [
      'An NOC from a bank confirms that the borrower has settled all obligations and the bank has released charge on the property.',
      'RBI requires banks to release all original property documents within 30 days of full loan closure, else pay a daily penalty.'
    ],
    keywords: ['No Objection Certificate', 'Home Loan Closure', 'Title Deeds', 'Mortgage Release', 'No Dues Certificate', 'Collateral Return', 'Repayment Schedule']
  },
  {
    id: 'formal-6',
    title: 'Complaint Letter: Rude Behavior of Bank Staff',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager reporting the unprofessional and rude behavior of a counter clerk when you went to update your passbook and deposit cash.',
    difficulty: 'medium',
    tags: ['Staff Behavior', 'Complaint', 'Customer Service'],
    hints: [
      'Detail the date, time, and counter number where the incident occurred.',
      'Describe the clerk\'s unprofessional conduct (refusing to print passbook, using offensive tone).',
      'Remind the management that customer service standards are paramount for bank reputation.',
      'Request appropriate sensitization of the counter staff and remedial action.'
    ],
    facts: [
      'Customer service quality is a primary metric evaluated under RBI\'s Banking Ombudsman guidelines.',
      'Major banks have internal code-of-conduct manuals detailing service timelines and staff decorum standards.'
    ],
    keywords: ['Customer Grievance', 'Staff Decorum', 'Counter Service', 'Professional Conduct', 'Ombudsman Guidelines', 'Bank Reputation', 'Remedial Action']
  },
  {
    id: 'formal-7',
    title: 'Request Letter: Apply for Bank Locker Facility',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting the allotment of a safe deposit locker in the branch to store valuable documents and jewelry.',
    difficulty: 'easy',
    tags: ['Locker Allocation', 'Safe Deposit', 'Bank Manager'],
    hints: [
      'Specify your account number and customer ID.',
      'State the preferred size of the locker (small/medium) and acknowledge readiness to pay annual rent and sign agreements.',
      'Inquire about the current waitlist if lockers are unavailable.',
      'Express willingness to maintain a fixed deposit if required under locker allocation guidelines.'
    ],
    facts: [
      'Safe Deposit Lockers are leased to customers under specific locker agreements framed by the RBI.',
      'Banks are allowed to obtain a fixed deposit covering three years\' rent and breakage charges at the time of locker allotment.'
    ],
    keywords: ['Safe Deposit Locker', 'Locker Rental', 'Locker Agreement', 'Valuables Security', 'Fixed Deposit Linked', 'Waitlist Status', 'Customer ID']
  },
  {
    id: 'formal-8',
    title: 'Request Letter: Change of Registered Mobile Number',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting a change in the registered mobile number linked to your savings account, as you have permanently changed your number.',
    difficulty: 'easy',
    tags: ['Mobile Update', 'Account Security', 'Bank Manager'],
    hints: [
      'State your name, address, and savings account number.',
      'Specify the old mobile number and write the new mobile number clearly.',
      'Acknowledge that this is critical for receiving transaction OTPs and security alerts.',
      'Attach a self-attested copy of your Aadhaar card or identity proof.'
    ],
    facts: [
      'A registered mobile number is the primary endpoint for receiving two-factor authentication OTPs in digital banking.',
      'Mobile number updates require strict customer verification to prevent unauthorized access via SIM swap frauds.'
    ],
    keywords: ['Registered Mobile', 'Two-Factor Authentication', 'Security Alert', 'KYC Document', 'Mobile Update', 'OTP Delivery', 'Account Security']
  },
  {
    id: 'formal-9',
    title: 'Complaint Letter: Double Debit during Online Transaction',
    category: 'formal_letter',
    description: 'Write a letter to the Customer Service Lead complaining that your account was debited twice for a single online merchant payment, and the merchant has not received the excess amount.',
    difficulty: 'medium',
    tags: ['Double Debit', 'Digital Payment', 'Complaint'],
    hints: [
      'Provide your account number, transaction date, and time.',
      'List the transaction IDs and transaction amounts for both debits.',
      'State that the merchant payment gateway showed a timed-out error on the first attempt but debited the money anyway.',
      'Request immediate reconciliation and credit back of the duplicate debit.'
    ],
    facts: [
      'Failed transactions where accounts are debited must be reversed automatically by the banks within standard settlement times.',
      'Reconciliation teams use transaction reference numbers to verify double-debit errors at merchant nodes.'
    ],
    keywords: ['Double Debit', 'Merchant Payment', 'Transaction Reference', 'Reconciliation', 'Settlement Cycle', 'Digital Failure', 'Refund Request']
  },
  {
    id: 'formal-10',
    title: 'Request Letter: Issuance of a Duplicate Cheque Book',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting a duplicate/new cheque book of 25 leaves, as your previous cheque book was lost during house relocation.',
    difficulty: 'easy',
    tags: ['Cheque Book', 'Service Request', 'Bank Manager'],
    hints: [
      'State account name and savings account number.',
      'Explain that the previous unused cheque book was lost and request stop-payment on all serial numbers of the lost leaves.',
      'Request the dispatch of a new cheque book to your registered address.',
      'Acknowledge standard charges if applicable.'
    ],
    facts: [
      'Banks allow stop-payment instructions on cheque leaves to prevent fraudulent clearance of lost checks.',
      'New cheque books are dispatched to registered addresses via secure post to prevent interception by third parties.'
    ],
    keywords: ['Cheque Leaves', 'Stop Payment', 'Lost Cheque Book', 'Registered Address', 'Security Measures', 'Service Charges', 'Signature Verification']
  },
  {
    id: 'formal-11',
    title: 'Letter to Editor: The Necessity of Financial Literacy in Rural India',
    category: 'formal_letter',
    description: 'Write a letter to the editor of "The National Herald" emphasizing the urgent need to introduce basic financial literacy programs in rural schools to protect farmers and families from debts.',
    difficulty: 'medium',
    tags: ['Financial Literacy', 'Editor Letter', 'Public Awareness'],
    hints: [
      'Address the Editor, The National Herald, with standard formal spacing.',
      'State the subject: necessity of introducing financial education in rural institutions.',
      'Discuss how rural populations fall victim to local loan-sharks due to lack of compounding knowledge.',
      'Argue that school kids can act as financial ambassadors for their farming families.',
      'Suggest curriculum addition of basic budgeting and digital banking precautions.'
    ],
    facts: [
      'High bank account counts do not correlate with high financial literacy in rural sectors.',
      'Informal credit sources in rural villages continue to charge interest rates that trap households in cycles of debt.'
    ],
    keywords: ['Financial Education', 'School Curriculum', 'Debt Trap', 'Digital Hygiene', 'National Herald', 'Public Advocacy', 'Rural Youth']
  },
  {
    id: 'formal-12',
    title: 'Letter to Editor: Rise in Cyber Frauds and the Need for Public Vigilance',
    category: 'formal_letter',
    description: 'Write a letter to the editor of "The Daily Express" highlighting the surge in digital banking frauds (phishing, spoofing) and urging government campaigns on cyber security.',
    difficulty: 'medium',
    tags: ['Cyber Fraud', 'Editor Letter', 'Digital Security'],
    hints: [
      'Structure the letter with sender\'s address, editor designation, date, subject, salutation, body, closing.',
      'Highlight common scams: electricity bill payment frauds, fake customer care calls, screen-sharing app downloads.',
      'State that senior citizens are the primary victims.',
      'Advocate for national advertisements on TV/Radio in local languages regarding OTP confidentiality.'
    ],
    facts: [
      'Phishing represents a large portion of financial crimes in metropolitan areas, targeting vulnerable digital adopters.',
      'RBI runs "RBI Kehna Hai" public safety campaigns to spread cyber caution.'
    ],
    keywords: ['Cyber Hygiene', 'Phishing Campaign', 'OTP Confidentiality', 'RBI Kehna Hai', 'Digital Vigilance', 'Financial Fraud', 'Public Service Broadcaster']
  },
  {
    id: 'formal-13',
    title: 'Request Letter: Apply for Home Loan Balance Transfer',
    category: 'formal_letter',
    description: 'Write a letter to the Loan Division Manager of Union Bank requesting a home loan balance transfer from your current lender due to competitive interest rate differences.',
    difficulty: 'hard',
    tags: ['Balance Transfer', 'Home Loan', 'Loan Manager'],
    hints: [
      'Provide details of the outstanding home loan principal and interest rate with the current lender.',
      'Express desire to transfer the loan to Union Bank due to their lower ROI.',
      'Attach list of income documents and statement of accounts.',
      'Inquire about processing fees, valuation charges, and document transfer formalities.'
    ],
    facts: [
      'Home Loan Balance Transfer allows borrowers to shift outstanding loans to another lender offering better interest terms.',
      'Borrowers need to secure a foreclosure letter and list of documents held by the existing bank before transfer.'
    ],
    keywords: ['Balance Transfer', 'Rate of Interest', 'Foreclosure Letter', 'Outstanding Principal', 'Processing Fees', 'Collateral Documents', 'Asset Evaluation']
  },
  {
    id: 'formal-14',
    title: 'Complaint Letter: Incorrect CIBIL Score Reporting',
    category: 'formal_letter',
    description: 'Write a letter to the Nodal Grievance Officer of your bank complaining about an incorrect loan default reporting in your CIBIL record, which is lowering your credit rating.',
    difficulty: 'hard',
    tags: ['CIBIL Complaint', 'Credit Rating', 'Nodal Officer'],
    hints: [
      'Explain that your credit report shows an active default on a loan that you closed or never borrowed.',
      'Provide the loan account reference number and attach the No Dues Certificate.',
      'State that this incorrect entry led to a rejection of a recent loan application.',
      'Request the bank to update their records with credit bureaus within 30 days.'
    ],
    facts: [
      'CIBIL score is the primary metric used by lenders in India to assess consumer credit history.',
      'Under credit regulations, banks must update credit bureau files within 30 days of receiving a dispute verification.'
    ],
    keywords: ['CIBIL Score', 'Credit Bureau', 'No Dues Certificate', 'Dispute Resolution', 'Nodal Officer', 'Defaulter List', 'Credit Assessment']
  },
  {
    id: 'formal-15',
    title: 'Request Letter: Manager for Business CC (Cash Credit) Limit Increase',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager of Apex Bank requesting an increase in your business Cash Credit (CC) limit from Rs. 20 Lakhs to Rs. 35 Lakhs to support export inventory purchases.',
    difficulty: 'hard',
    tags: ['CC Limit Increase', 'Business Loan', 'Working Capital'],
    hints: [
      'State your business name, account details, and current CC limit.',
      'Explain the business rationale: new export orders requiring bulk raw material stock purchases.',
      'Offer additional collateral or primary stock hypothecation details.',
      'Enclose audited balance sheets for the last two financial years.'
    ],
    facts: [
      'Cash Credit is a working capital loan extended to businesses based on stock and debtors statements.',
      'Limit enhancements depend on turnover projections and valuation of underlying stock assets.'
    ],
    keywords: ['Cash Credit', 'Working Capital', 'Hypothecation', 'Enhancement Request', 'Export Orders', 'Collateral Valuation', 'Financial Statements']
  },
  {
    id: 'formal-16',
    title: 'Request Letter: Temporary Moratorium on Car Loan due to Medical Emergency',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting a 3-month temporary moratorium on your car loan EMIs due to sudden high medical treatment expenses in the family.',
    difficulty: 'medium',
    tags: ['Loan Moratorium', 'Medical Emergency', 'Bank Manager'],
    hints: [
      'State car loan account number and monthly EMI details.',
      'Explain the situation: sudden hospitalization of a parent leading to high medical out-of-pocket expenses.',
      'Request a temporary waiver/moratorium of 3 months on principal repayment.',
      'Express willingness to pay accrued interest and extend loan tenure.'
    ],
    facts: [
      'Moratorium provides temporary relief on debt repayment during extreme distress, though interest continues to accrue.',
      'Banks examine past repayment records before granting discretionary payment extensions.'
    ],
    keywords: ['EMI Moratorium', 'Medical Crisis', 'Out-of-pocket Expense', 'Repayment History', 'Tenure Extension', 'Accrued Interest', 'Principal Waiver']
  },
  {
    id: 'formal-17',
    title: 'Complaint Letter: ATM Card Captured by Machine without Cash',
    category: 'formal_letter',
    description: 'Write a complaint letter to the Branch Manager stating that your debit card was captured by the branch ATM during an active transaction, and no cash was dispensed.',
    difficulty: 'easy',
    tags: ['ATM Issue', 'Debit Card', 'Complaint'],
    hints: [
      'Detail the ATM kiosk location, time, and card number.',
      'Explain that the card went inside but the machine screen went black, capturing the card.',
      'Request retrieving the card safely or blocking the current card and issuing a replacement free of charge.',
      'Sign off with your account details.'
    ],
    facts: [
      'ATM card captures happen during hardware faults or security lockouts inside the card readers.',
      'For security reasons, captured cards are frequently destroyed by the replenishment agency and replacement cards issued.'
    ],
    keywords: ['Debit Card captured', 'ATM hardware error', 'Card replacement', 'Card blocking', 'Account validation', 'Replacement charges', 'Kiosk location']
  },
  {
    id: 'formal-18',
    title: 'Request Letter: Apply for Pradhan Mantri Mudra Loan',
    category: 'formal_letter',
    description: 'Write a formal letter to the Branch Manager of a public sector bank applying for a Mudra loan under the "Kishor" category to purchase sewing machines for your tailoring unit.',
    difficulty: 'medium',
    tags: ['Mudra Loan', 'Micro Credit', 'Bank Manager'],
    hints: [
      'Detail your small business profile: tailoring and garment manufacturing shop.',
      'Specify the Mudra category: "Kishor" (loans between 50,000 and 5 Lakhs).',
      'Explain how the funds will be utilized: purchasing commercial machines to scale capacity.',
      'Enclose details of business registration and quotation for machinery.'
    ],
    facts: [
      'Pradhan Mantri Mudra Yojana (PMMY) offers collateral-free loans in Shishu (up to 50k), Kishor (50k-5L), and Tarun (5L-10L) categories.',
      'Mudra loans target credit needs of non-corporate, non-farm small/micro enterprises.'
    ],
    keywords: ['Mudra Loan', 'Kishor Category', 'Collateral-free Credit', 'Micro Enterprise', 'Tailoring Unit', 'Capital Procurement', 'Self-employment']
  },
  {
    id: 'formal-19',
    title: 'Letter to Editor: High Bank Charges on Saving Accounts',
    category: 'formal_letter',
    description: 'Write a letter to the editor of "The Financial Times" expressing concern over high minimum balance penalties and SMS alert fees charged by commercial banks, impacting low-income depositors.',
    difficulty: 'medium',
    tags: ['Bank Charges', 'Editor Letter', 'Consumer Voice'],
    hints: [
      'Address the Editor, The Financial Times, detailing the subject.',
      'Highlight charges: minimum average balance (MAB) penalties, debit card annual fees, SMS charges.',
      'Argue that these charges eat into the small savings of poor citizens, discouraging digital adoption.',
      'Call for RBI regulation to cap fees on basic savings accounts.'
    ],
    facts: [
      'Scheduled Commercial Banks collect thousands of crores annually through MAB defaults and SMS alert charges.',
      'Basic Savings Bank Deposit (BSBD) accounts require zero minimum balance and are exempt from standard transaction charges.'
    ],
    keywords: ['Minimum Balance Penalty', 'MAB Charges', 'SMS Alert Fees', 'Financial Times', 'Low-income Depositors', 'BSBD Account', 'Regulatory Cap']
  },
  {
    id: 'formal-20',
    title: 'Request Letter: Upgrading Account to NRI Status',
    category: 'formal_letter',
    description: 'Write a letter to the NRI Services Division of your bank requesting the designation change of your resident savings account to an NRO account, as you are relocating to the UK.',
    difficulty: 'hard',
    tags: ['NRO Account', 'Relocation', 'NRI Services'],
    hints: [
      'Provide your savings bank account details and customer ID.',
      'State that you are relocating to the UK on a employment visa.',
      'Request the bank to redesignate the resident account to a Non-Resident Ordinary (NRO) account.',
      'Attach copy of employment visa, passport, and foreign address details.'
    ],
    facts: [
      'Under FEMA guidelines, Indian citizens relocating abroad must convert their resident accounts to NRO/NRE status.',
      'NRO accounts are used to manage income earned in India (e.g. rent, dividends) after becoming an NRI.'
    ],
    keywords: ['NRO Conversion', 'NRI Services', 'FEMA Guidelines', 'Resident Account', 'Employment Visa', 'Non-Resident Ordinary', 'Foreign Address']
  },
  {
    id: 'formal-21',
    title: 'Request Letter: Apply for Education Loan Subvention Scheme benefits',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager requesting the application of interest subsidy benefits on your outstanding education loan under the Central Sector Interest Subsidy (CSIS) scheme.',
    difficulty: 'hard',
    tags: ['Education Loan', 'Interest Subsidy', 'CSIS Scheme'],
    hints: [
      'Provide details of the education loan account number, sanction date, and university.',
      'Explain that your family income is within the CSIS threshold (up to 4.5 Lakhs per annum).',
      'Attach the certified family income certificate issued by local authorities.',
      'Request that the interest during the moratorium period be claimed from the government.'
    ],
    facts: [
      'The CSIS scheme provides full interest subsidy during the moratorium period (course period + 1 year) to students from economically weaker sections.',
      'Interest subsidy claims must be uploaded by banks on the designated government portal for reimbursement.'
    ],
    keywords: ['Interest Subsidy', 'CSIS Scheme', 'Income Certificate', 'Moratorium Period', 'Education Loan', 'Reimbursement Portal', 'Economically Weaker Section']
  },
  {
    id: 'formal-22',
    title: 'Complaint Letter: Credit of Counterfeit Note at Cash Deposit Machine',
    category: 'formal_letter',
    description: 'Write a letter to the Branch Manager stating that the branch Cash Deposit Machine (CDM) rejected a 500 Rupee note as counterfeit during deposit, but did not return the note or credit the amount.',
    difficulty: 'hard',
    tags: ['CDM Error', 'Counterfeit Currency', 'Complaint'],
    hints: [
      'Provide CDM terminal ID, date, time, and account details.',
      'Explain that the machine detected a single note as suspicious, retained it, printed a receipt showing "Suspect Note Retained", but did not credit it.',
      'Acknowledge the counterfeit rules but request validation of the note and credit if found authentic.',
      'Attach receipt copy.'
    ],
    facts: [
      'RBI rules require CDMs to retain counterfeit or suspect notes and not return them to depositors to prevent recirculation.',
      'Banks must issue a receipt for such retained notes and report counterfeit detections to police authorities monthly.'
    ],
    keywords: ['Cash Deposit Machine', 'Suspect Note Retained', 'Counterfeit detection', 'CDM Receipt', 'RBI Directives', 'Verification Process', 'Deposit Credit']
  },
  {
    id: 'formal-23',
    title: 'Request Letter: Re-issuance of PIN for Net Banking',
    category: 'formal_letter',
    description: 'Write a letter to the systems administrator of your bank requesting a duplicate net banking login PIN, as you have forgotten the credentials and cannot log in online.',
    difficulty: 'easy',
    tags: ['Net Banking', 'PIN Re-issuance', 'Service Request'],
    hints: [
      'Provide customer ID, registered name, and account number.',
      'State that you have blocked your online access due to multiple incorrect password attempts.',
      'Request the generation of a temporary login PIN and security password.',
      'Request physical dispatch to your home address.'
    ],
    facts: [
      'Net banking PIN security locks account access after a set number of consecutive failed login inputs.',
      'Duplicate physical credentials are sent via secure courier channels to the customer\'s registered address.'
    ],
    keywords: ['Net Banking PIN', 'Customer ID', 'Login Security', 'Credentials Lockout', 'Password Reset', 'Secure Courier', 'Verification Check']
  },
  {
    id: 'formal-24',
    title: 'Complaint Letter: Delayed Pension Commutation payment',
    category: 'formal_letter',
    description: 'Write a letter to the Pension Processing Cell of your bank complaining about the non-credit of your commuted pension amount despite submission of approval orders three months ago.',
    difficulty: 'hard',
    tags: ['Pension Commutation', 'Senior Citizen', 'Complaint'],
    hints: [
      'Detail PPO number, retired designation, bank branch code.',
      'Explain that the commutation of pension (lump sum payment) was sanctioned by the government department and forwarded to the bank.',
      'State that the regular pension is credited, but the lump-sum commutation has not been paid, causing building construction delays.',
      'Request urgent processing.'
    ],
    facts: [
      'Pension commutation allows government employees to receive a lump-sum payment in exchange for giving up a portion of monthly pension.',
      'Processing delays in pension cells often require coordination between government treasury departments and bank systems.'
    ],
    keywords: ['Commuted Pension', 'Pension Processing Cell', 'PPO Record', 'Lump-sum Payment', 'Treasury Coordination', 'Senior Citizen Grievance', 'Disbursement Delay']
  },
  {
    id: 'formal-25',
    title: 'Request Letter: Apply for Agriculture Crop Loan Renewal',
    category: 'formal_letter',
    description: 'Write a formal letter to the Branch Manager of a rural cooperative bank requesting the annual renewal of your Crop Loan/KCC limit based on fresh land cultivation records.',
    difficulty: 'medium',
    tags: ['KCC Renewal', 'Crop Loan', 'Rural Finance'],
    hints: [
      'Specify KCC card number, land holding details (in acres), and crops planned (wheat/mustard).',
      'Mention that you have repaid the previous crop loan principal along with subsidized interest.',
      'Request the renewal/extension of the cash credit limit for the upcoming season.',
      'Enclose copy of land revenue records (Khatauni).'
    ],
    facts: [
      'KCC accounts are renewed annually based on farm requirements and credit history, valid for 5 years.',
      'Prompt repayment of KCC loans makes farmers eligible for interest subventions, lowering credit costs.'
    ],
    keywords: ['Crop Loan Renewal', 'KCC Limit', 'Subsidized Interest', 'Land Cultivation', 'Rural cooperative bank', 'Revenue Records', 'Account Settlement']
  },

  // ==================== INFORMAL LETTERS (15 Topics) ====================
  {
    id: 'informal-1',
    title: 'Letter to a Friend: Benefits of Small Savings Schemes',
    category: 'informal_letter',
    description: 'Write a letter to your friend advising them to start investing early, specifically explaining the benefits of Public Provident Fund (PPF) and Sukanya Samriddhi Yojana (SSY).',
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
  {
    id: 'informal-2',
    title: 'Letter to Younger Sibling: Career Choices in Banking Sector',
    category: 'informal_letter',
    description: 'Write a letter to your younger sibling who is in college, explaining the career opportunities, work life, and growth path in the public sector banking industry (SBI PO / IBPS PO).',
    difficulty: 'medium',
    tags: ['Career Advice', 'Banking jobs', 'Sibling'],
    hints: [
      'Start with a warm and conversational opening inquiries about college semester results.',
      'Explain the prestige, job security, and training opportunities in nationalized banks.',
      'Describe the role of a Probationary Officer (PO): handling credit, operations, and rural postings.',
      'Mention that it requires dedication but offers fast promotion channels to management grades.'
    ],
    facts: [
      'Probationary Officers undergo direct operational training across branches during a 2-year probation phase.',
      'Public sector bank promotions are structured through competitive exams, allowing fast career climbs.'
    ],
    keywords: ['Career opportunities', 'Probationary Officer', 'Job security', 'Branch Operations', 'Promotion Channel', 'Rural Posting', 'Administrative Role']
  },
  {
    id: 'informal-3',
    title: 'Letter to Friend: Explaining Crop Insurance (PMFBY)',
    category: 'informal_letter',
    description: 'Write a letter to your friend who has started farming in his village, advising him to register his crops under the Pradhan Mantri Fasal Bima Yojana (PMFBY) to shield against monsoon failures.',
    difficulty: 'medium',
    tags: ['Crop Insurance', 'PMFBY', 'Agriculture Advice'],
    hints: [
      'Write a warm, supportive opening congratulating him on choosing farming.',
      'Introduce PMFBY as a low-cost, government-backed safety net.',
      'Explain premium rates: highly subsidized, low rates for winter (Rabi) and summer (Kharif) crops.',
      'Detail the coverage: sowing failure, post-harvest losses, local calamities.',
      'Close with warmth, hoping for a rich harvest.'
    ],
    facts: [
      'PMFBY charges a flat premium of only 1.5% for Rabi and 2.0% for Kharif crops from farmers.',
      'The scheme operates digitally via the PMFBY portal, integrated with banking systems for claims settlement.'
    ],
    keywords: ['Crop Insurance', 'PMFBY Portal', 'Subsidized Premium', 'Monsoon Failure', 'Harvest Security', 'Rabi Kharif', 'Village Farm']
  },
  {
    id: 'informal-4',
    title: 'Letter to Sibling: Advice on Cyber Hygiene and Online Banking Safety',
    category: 'informal_letter',
    description: 'Write a letter to your younger sibling advising them on basic safety rules for online banking and card transactions, warning them about SIM swap and phishing frauds.',
    difficulty: 'easy',
    tags: ['Cyber Safety', 'Card Security', 'Sibling'],
    hints: [
      'Express concern after reading about increasing online financial frauds.',
      'Outline safety rules: never share OTP, block cards if misplaced, verify UPI merchant name before entering PIN.',
      'Warn about phishing links in SMS promising tax refunds or lottery rewards.',
      'Encourage setting transaction limits on mobile apps.'
    ],
    facts: [
      'UPI transactions require a PIN only for sending money, not for receiving it.',
      'SIM swapping enables hackers to intercept bank OTP SMS by cloning mobile numbers.'
    ],
    keywords: ['Cyber Hygiene', 'SIM swap fraud', 'Transaction Limits', 'UPI Safety', 'OTP Confidentiality', 'Phishing Links', 'Mobile Banking App']
  },
  {
    id: 'informal-5',
    title: 'Letter to Parent: Sharing Experience of First Month in Job',
    category: 'informal_letter',
    description: 'Write a letter to your father/mother sharing your experience of your first month as a Probationary Officer in a rural bank branch, detailing the work culture and local hospitality.',
    difficulty: 'easy',
    tags: ['Job Experience', 'Parent letter', 'Rural Banking'],
    hints: [
      'Start with a warm and emotional address, thanking them for their support.',
      'Describe the branch environment: busy counter mornings, helping farmers open Jan Dhan accounts.',
      'Detail your daily routine: finding local accommodation, managing meals.',
      'Share details of local rural hospitality (farmers bringing fresh milk/fruits to staff).'
    ],
    facts: [
      'Rural banking postings are mandatory for bank officers to gain grassroots financial experience.',
      'Branch staff in rural sectors frequently act as advisors for local agricultural communities.'
    ],
    keywords: ['Probationary Officer', 'Rural Branch', 'Counter operations', 'Jan Dhan Accounts', 'Local Hospitality', 'Grassroots Finance', 'Parent Support']
  },
  {
    id: 'informal-6',
    title: 'Letter to Friend: Encouraging Him to Set Up an Organic Farm',
    category: 'informal_letter',
    description: 'Write a letter to your childhood friend encouraging them to transition to organic farming on their family land, citing market demand and health benefits.',
    difficulty: 'medium',
    tags: ['Organic Farm', 'Agriculture', 'Friend advice'],
    hints: [
      'Recall old memories of spending vacations on their farm.',
      'Explain that heavy chemical pesticide use is damaging soil health and groundwater quality.',
      'Highlight market trends: urban consumers are willing to pay premium prices for certified organic produce.',
      'Suggest starting with a small trial plot to master compost and vermiculture methods.'
    ],
    facts: [
      'Organic farming improves soil water-retention capacity and supports long-term farm ecosystems.',
      'India has the largest number of organic producers in the world, though certified land share remains small.'
    ],
    keywords: ['Organic Produce', 'Soil Health', 'Groundwater Pollution', 'Compost Vermiculture', 'Premium Pricing', 'Sustainable Agriculture', 'Family Land']
  },
  {
    id: 'informal-7',
    title: 'Letter to Cousin: Warning Against Crypto Speculation',
    category: 'informal_letter',
    description: 'Write a letter to your cousin warning them against investing their entire pocket savings in volatile private cryptocurrencies based on social media trends.',
    difficulty: 'medium',
    tags: ['Crypto warning', 'Investment', 'Cousin'],
    hints: [
      'Open with light, friendly banter.',
      'Address their social posts about trading crypto coins.',
      'Explain the extreme volatility: prices can drop 50% overnight without clear economic triggers.',
      'Contrast this with regulated investments like mutual funds, PPF, or equity SIPs.',
      'Advise that high return always carries matching high risks.'
    ],
    facts: [
      'Private cryptocurrencies are not backed by physical assets or central bank guarantees.',
      'Speculative trading spikes are often driven by online influencers and chat groups, leading to retail investor losses.'
    ],
    keywords: ['Speculative Trading', 'Market Volatility', 'Asset Backed', 'Regulated Market', 'Mutual Funds SIP', 'Financial Discipline', 'Influencer Claims']
  },
  {
    id: 'informal-8',
    title: 'Letter to Sibling: Importance of Developing Reading Habits',
    category: 'informal_letter',
    description: 'Write a letter to your younger sibling explaining how reading quality books and newspapers (like editorials) will improve their vocabulary, analytical thinking, and writing skills for exams.',
    difficulty: 'easy',
    tags: ['Reading habits', 'Self-improvement', 'Sibling'],
    hints: [
      'Discuss how spending excessive time on short video apps is lowering their attention span.',
      'Explain that reading newspapers (e.g. The Hindu editorial) is critical for matching current affairs requirements in civil/bank tests.',
      'Describe how reading builds subconscious grammar and vocabulary models.',
      'Gift them a book to start and recommend a simple 20-minute daily reading routine.'
    ],
    facts: [
      'Consistent reading habits are positively correlated with high verbal scores in competitive exams.',
      'Editorials provide balanced, multi-dimensional viewpoints on socio-economic policy matters.'
    ],
    keywords: ['Attention Span', 'Editorials', 'Vocabulary Enrichment', 'Analytical Thinking', 'Competitive Exams', 'Daily Reading', 'Current Affairs']
  },
  {
    id: 'informal-9',
    title: 'Letter to Friend: Inviting to Spend Vacation in Your Rural Posting Location',
    category: 'informal_letter',
    description: 'Write a letter to your metropolitan friend inviting them to spend a weekend with you in your rural banking location, describing the natural landscape and slow life.',
    difficulty: 'easy',
    tags: ['Vacation Invite', 'Rural Life', 'Friend'],
    hints: [
      'Open with warm greetings, checking on their hectic corporate life.',
      'Describe the beautiful rural environment: green paddy fields, clean air, quiet starry nights.',
      'Plan weekend activities: visiting local historical temples, walking along riverbanks, eating organic local meals.',
      'Assure them that the branch guest house has basic amenities.'
    ],
    facts: [
      'Rural tourism is emerging as a popular relaxation channel for urban workers facing high corporate burnout.',
      'Slow life settings help reduce stress and improve mental wellbeing.'
    ],
    keywords: ['Rural Life', 'Weekend getaway', 'Corporate Burnout', 'Organic Meals', 'Quiet star nights', 'Branch Guest House', 'Vacation Invite']
  },
  {
    id: 'informal-10',
    title: 'Letter to Brother: Advising Him to Purchase Health Insurance',
    category: 'informal_letter',
    description: 'Write a letter to your brother who has just started his first job in private sector, advising him to buy an individual health insurance policy early in life.',
    difficulty: 'medium',
    tags: ['Insurance advice', 'Finance', 'Brother'],
    hints: [
      'Congratulate him on his new job and financial independence.',
      'Explain that medical inflation is very high; a single hospitalization can deplete years of savings.',
      'Detail the benefits of buying early: lower premium rates, no waiting periods for diseases.',
      'Advise him to not depend solely on corporate group insurance.'
    ],
    facts: [
      'Health insurance premiums increase significantly as entry age increases due to rising health risks.',
      'Corporate group insurance policies terminate immediately upon leaving the organization.'
    ],
    keywords: ['Medical Inflation', 'Health Insurance', 'Premium Rates', 'Waiting Period', 'Group Policy', 'Financial Planning', 'First Job']
  },
  {
    id: 'informal-11',
    title: 'Letter to Cousin: Advice on Managing Exam Stress',
    category: 'informal_letter',
    description: 'Write a letter to your cousin who is appearing for Class XII board exams, advising them on how to manage exam stress and maintain mental balance.',
    difficulty: 'easy',
    tags: ['Exam Stress', 'Mental Balance', 'Cousin'],
    hints: [
      'Acknowledge the high pressure of board exams in the family.',
      'Advise them to set realistic study slots and avoid continuous overnight cramming.',
      'Highlight the importance of 7 hours of sleep, light exercise, and short breaks.',
      'Reassure them that board marks are important but do not define lifetime success.'
    ],
    facts: [
      'Adequate sleep before exams improves memory recall and analytical speeds.',
      'Active test anxiety triggers cortisol, which blocks structured thought access during examinations.'
    ],
    keywords: ['Test Anxiety', 'Study Slots', 'Sleep Cycle', 'Board Exams', 'Stress Management', 'Support System', 'Reassurance']
  },
  {
    id: 'informal-12',
    title: 'Letter to Friend: Sharing Experience of Setting up a Small Business',
    category: 'informal_letter',
    description: 'Write a letter to your friend sharing the excitement and operational struggles of launching your independent handicraft e-commerce portal.',
    difficulty: 'medium',
    tags: ['Business Launch', 'E-Commerce', 'Friend'],
    hints: [
      'Describe the official launch day and the first organic customer order received.',
      'Detail the startup struggles: negotiating with rural artisans, logistics packaging delays, website bugs.',
      'Acknowledge that managing finance and inventory is exhausting but highly rewarding.',
      'Request their feedback on the portal design.'
    ],
    facts: [
      'Handicraft e-commerce platforms connect local rural artisans directly with national urban buyers, eliminating middlemen.',
      'Startup founders handle multiple roles (marketing, finance, customer support) in initial launch phases.'
    ],
    keywords: ['E-Commerce Portal', 'Rural Artisans', 'Middlemen elimination', 'Logistics coordination', 'Startup struggles', 'Inventory management', 'Operational challenges']
  },
  {
    id: 'informal-13',
    title: 'Letter to Sibling: Encouraging Participation in Sports',
    category: 'informal_letter',
    description: 'Write a letter to your sister who is obsessed with mobile video games, encouraging her to join the school basketball team to build health and leadership skills.',
    difficulty: 'easy',
    tags: ['Sports benefits', 'Physical Health', 'Sibling'],
    hints: [
      'Start with humorous complaints about her screen-time reports.',
      'Explain that basketball builds strong physical stamina and hand-eye coordination.',
      'Highlight team sports benefits: learning cooperation, handling defeats, and making active friends.',
      'Offer to buy her a basketball kit if she promises to attend practice.'
    ],
    facts: [
      'Regular physical sports participation decreases childhood obesity and increases concentration spans.',
      'Team sports teach structural leadership and group cooperation dynamics.'
    ],
    keywords: ['Physical Stamina', 'Screen Time', 'Basketball team', 'Cooperation dynamics', 'Leadership skills', 'Healthy Lifestyle', 'Active friendship']
  },
  {
    id: 'informal-14',
    title: 'Letter to Friend: Explaining the Power of Compounding via Mutual Funds SIP',
    category: 'informal_letter',
    description: 'Write a letter to your colleague/friend explaining how small monthly investments (SIPs) in diversified mutual funds compound into wealth over 15-20 years.',
    difficulty: 'medium',
    tags: ['SIP Compounding', 'Investment advice', 'Friend'],
    hints: [
      'Discuss how salary increases often lead to matching lifestyle inflation.',
      'Explain mutual fund SIP (Systematic Investment Plan) and rupee cost averaging.',
      'Illustrate with a simple compounding math example (e.g. how 5000/month grows over 15 years at 12% returns).',
      'Encourage them to automate their savings on payday.'
    ],
    facts: [
      'SIP allows automated investing, reducing the temptation to time the stock market.',
      'Compounding returns yield the highest growth in the final quarters of long-term investment tenures.'
    ],
    keywords: ['Systematic Investment Plan', 'Power of Compounding', 'Lifestyle Inflation', 'Rupee Cost Averaging', 'Diversified Mutual Funds', 'Wealth Creation', 'Payday Automation']
  },
  {
    id: 'informal-15',
    title: 'Letter to Friend: Sharing Pride on India\'s Space Achievements',
    category: 'informal_letter',
    description: 'Write a letter to your NRI friend sharing the pride and excitement of watching India\'s lunar landing mission (Chandrayaan) succeed, showcasing low-cost space tech.',
    difficulty: 'easy',
    tags: ['Space Tech', 'National Pride', 'Friend'],
    hints: [
      'Express the electric atmosphere across the nation during the final landing descent phase.',
      'Detail ISRO\'s achievement: landing on the unexplored South Pole of the Moon.',
      'Highlight how the mission succeeded at a fraction of the budget of Hollywood movies.',
      'Discuss how this inspires young minds to take up science and engineering research.'
    ],
    facts: [
      'ISRO\'s lunar missions specialize in cost-efficient space exploration engineering.',
      'India was the first country to successfully reach the south polar region of the lunar surface.'
    ],
    keywords: ['ISRO achievement', 'Lunar Landing', 'South Pole exploration', 'Cost efficiency', 'National Pride', 'Space Research', 'Scientific Temper']
  },

  // ==================== PREVIOUS YEAR QUESTIONS (PYQs - 10 Topics) ====================
  {
    id: 'pyq-1',
    title: 'RBI Grade B 2023: Role of fintech in banking operations',
    category: 'pyq',
    description: 'Analyze how Financial Technology (Fintech) startups are driving innovation in payment processing, lending, and wealth management. Discuss collaborating vs. competing forces in the banking sector.',
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
    id: 'pyq-6',
    title: 'SBI PO Mains 2023: Essay on the Importance of ESG (Environmental, Social, Governance) in corporate banking',
    category: 'pyq',
    description: 'Discuss the relevance of ESG compliance in the evaluation of corporate loan approvals. How are Indian banks shifting lending policies to encourage environment-friendly industries?',
    difficulty: 'hard',
    tags: ['ESG', 'SBI PO Mains', 'Corporate Banking'],
    exam: 'SBI PO Mains',
    year: 2023,
    hints: [
      'Define ESG and explain why banks analyze these risks (regulatory fines, stranded carbon assets).',
      'Discuss RBI guidelines on green deposits and climate risk disclosure.',
      'Detail advantages: reduced corporate interest rates for certified green projects.',
      'Highlight difficulties: verifying carbon savings, greenwashing tracking.'
    ],
    facts: [
      'Major public sector banks have established specific credit scoring lines targeting ESG metrics.',
      'Climate risks translate to financial credit risks if borrowing factories face closure from emissions limits.'
    ],
    keywords: ['ESG Lending', 'Climate Risk Disclosure', 'Green Deposits', 'Environmental Compliance', 'Corporate Credit', 'Stranded Assets', 'Sustainable Portfolios']
  },
  {
    id: 'pyq-7',
    title: 'IBPS PO Mains 2022: Formal Letter to Editor complaining about child labor in local shops',
    category: 'pyq',
    description: 'Write a letter to the editor of a national daily complaining about the persistent employment of child laborers in local roadside eateries and tea shops, requesting municipal intervention.',
    difficulty: 'medium',
    tags: ['Child Labor', 'IBPS PO Mains', 'Social Issue'],
    exam: 'IBPS PO Mains',
    year: 2022,
    hints: [
      'Use standard editor letter layout addressing the national editor.',
      'Detail the location: local food stalls and tea stalls near high-traffic areas.',
      'State that these children are denied education and work under unhygienic conditions.',
      'Request labor inspector raids and rehabilitation under central schemes.'
    ],
    facts: [
      'The Child Labour Prohibition and Regulation Act in India bans children under 14 from commercial employment.',
      'Education is a fundamental right (Article 21A) for children aged 6 to 14 in India.'
    ],
    keywords: ['Child Labor', 'Labor Inspector', 'Fundamental Right', 'Rehabilitation Scheme', 'Eatery Stalls', 'Municipal Intervention', 'Enforcement Drives']
  },
  {
    id: 'pyq-8',
    title: 'RBI Grade B 2022: Essay on the Impact of Cryptocurrency on Monetary Policy',
    category: 'pyq',
    description: 'Discuss how the rise of decentralized private cryptocurrencies challenges the transmission of monetary policy by central banks, and outline regulatory options.',
    difficulty: 'hard',
    tags: ['Cryptocurrency', 'RBI Grade B', 'Monetary Policy'],
    exam: 'RBI Grade B',
    year: 2022,
    hints: [
      'Explain that monetary policy works through commercial banking credit controls.',
      'Detail how crypto shifts transactions away from central bank balance sheets, weakening policy rates transmission.',
      'Highlight capital flight, currency substitution, and exchange rate volatility risks.',
      'Suggest policy solutions (legal bans, tax limits, or CBDC adoption).'
    ],
    facts: [
      'Countries experiencing high inflation have seen rapid adoption of stablecoins, leading to local currency depreciation.',
      'Central banks cannot control the circulating volume of decentralized blockchain tokens.'
    ],
    keywords: ['Monetary Transmission', 'Currency Substitution', 'Decentralized Ledger', 'Capital Flight', 'Stablecoins', 'Sovereign Control', 'Exchange Volatility']
  },
  {
    id: 'pyq-9',
    title: 'IBPS PO Mains 2024: Essay on the Role of MSMEs in Achieving Sustainable GDP Growth',
    category: 'pyq',
    description: 'Analyze how Micro, Small, and Medium Enterprises (MSMEs) contribute to export earnings and employment. Discuss how green MSME transitions support sustainable development.',
    difficulty: 'medium',
    tags: ['MSMEs', 'GDP Growth', 'Sustainability'],
    exam: 'IBPS PO Mains',
    year: 2024,
    hints: [
      'Highlight the share of MSMEs in national manufacturing GDP and jobs.',
      'Explain the need for clean energy adoption in small factories to meet carbon limits.',
      'Discuss financial initiatives: green credit facilities for upgrading to solar power.',
      'Outline challenges: high initial costs of green machinery, lack of tech expertise.'
    ],
    facts: [
      'MSMEs employ a substantial share of rural and semi-urban labor forces in India.',
      'Small enterprises often face credit bottlenecks when upgrading to fuel-efficient engines.'
    ],
    keywords: ['Sustainable GDP', 'Green MSME', 'Industrial Upgrades', 'Carbon Limitations', 'Clean Energy Finance', 'Job Protection', 'Export Growth']
  },
  {
    id: 'pyq-10',
    title: 'SBI PO Mains 2022: Formal Letter to Bank Manager requesting change in branch layout for elderly customers',
    category: 'pyq',
    description: 'Write a letter to the manager of your home branch requesting modifications in the physical office layout (e.g. ramp access, dedicated senior counters) to assist senior citizens.',
    difficulty: 'easy',
    tags: ['Elderly Care', 'SBI PO Mains', 'Complaint'],
    exam: 'SBI PO Mains',
    year: 2022,
    hints: [
      'Maintain formal block layout addressing the Branch Manager.',
      'Point out that senior citizens face difficulties climbing stairs due to absence of ramp rails.',
      'Suggest dedicated pension payment counters on the ground floor to reduce queue wait times.',
      'Request drinking water facilities and seating near the teller counters.'
    ],
    facts: [
      'RBI guidelines mandate that banks must provide door-step banking and hassle-free branch infrastructure access for disabled and elderly clients.',
      'Dedicated senior citizen desks are standard requirements in major public bank branches.'
    ],
    keywords: ['Senior Citizen counters', 'Physical Accessibility', 'Ramp Access', 'Ground Floor Services', 'Banking Ombudsman rules', 'Passbook Printing', 'Dedicated Teller']
  }
];

// Add word limit and time limit based on category
const processedTopics = rawTopics.map(t => {
  const isEssay = t.category === 'essay' || (t.category === 'pyq' && t.id.includes('essay'));
  const isLetter = t.category === 'formal_letter' || t.category === 'informal_letter' || (t.category === 'pyq' && t.id.includes('letter'));
  
  // Default values if not specified
  let wordLimit = t.category === 'essay' ? 250 : 150;
  let timeLimit = t.category === 'essay' ? 30 : 20;
  
  if (t.category === 'pyq') {
    if (t.title.toLowerCase().includes('letter')) {
      wordLimit = 150;
      timeLimit = 20;
    } else {
      wordLimit = 250;
      timeLimit = 30;
    }
  }

  return {
    ...t,
    wordLimit,
    timeLimit
  };
});

// Format as TypeScript code
let code = `export interface Topic {
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

export const defaultTopics: Topic[] = ${JSON.stringify(processedTopics, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/topics.ts'), code, 'utf-8');
console.log(`Generated topics file with ${processedTopics.length} topics!`);
