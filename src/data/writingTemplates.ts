export interface TemplateSection {
  sectionName: string;
  description: string;
  sampleText?: string;
}

export interface WritingTemplate {
  id: string;
  category: 'essay' | 'formal_letter' | 'informal_letter';
  title: string;
  description: string;
  structure: TemplateSection[];
  tips: string[];
}

export const writingTemplates: WritingTemplate[] = [
  {
    id: 't-essay',
    category: 'essay',
    title: 'Standard Banking Exam Essay Template',
    description: 'An optimal structural breakdown for a 250-word descriptive essay, designed to score highly in coherence, flow, and structural evaluation.',
    structure: [
      {
        sectionName: 'Introduction (approx. 40-50 words)',
        description: 'Define the topic, introduce current relevance or background, and state the core premise of your essay.',
        sampleText: 'In recent years, [Topic] has emerged as a focal point of discussion in the financial and social landscape of India. Briefly defined as [Brief Definition], it plays a critical role in shaping [Key Sector/Economy]. As India strides toward becoming a digital economy, understanding the implications of [Topic] becomes highly imperative.'
      },
      {
        sectionName: 'Body Paragraph 1: Positive Impacts / Opportunities (approx. 70-80 words)',
        description: 'Detail the advantages, benefits, or positive trends. Back up your points with facts, figures, or government initiatives.',
        sampleText: 'On the positive side, [Topic] provides several notable benefits. First and foremost, it enhances [Benefit 1] by enabling faster access to [Service/Resource]. For instance, government schemes like [Scheme Name] have leveraged this to achieve [Key Metric]. Additionally, it fosters [Benefit 2] and reduces operational inefficiencies, making it a vital catalyst for economic growth.'
      },
      {
        sectionName: 'Body Paragraph 2: Challenges / Concerns (approx. 70-80 words)',
        description: 'Address the bottlenecks, risks, security threats, or limitations associated with the topic.',
        sampleText: 'However, the transition is not without hurdles. The primary concern is [Challenge 1], which restricts its effective adoption, especially in rural areas. Furthermore, issues like [Challenge 2 / e.g., cybersecurity risks or lack of awareness] pose threat to stability. Without addressing these critical gaps, the full potential of [Topic] cannot be fully harnessed.'
      },
      {
        sectionName: 'Conclusion (approx. 40-50 words)',
        description: 'Summarize your key points, offer balanced solutions/recommending actions, and end on a positive, forward-looking note.',
        sampleText: 'In conclusion, while [Topic] presents distinct challenges, its long-term benefits are substantial. By strengthening [Solution 1, e.g., cybersecurity / digital literacy] and executing collaborative regulations, India can successfully overcome these barriers. A balanced approach will ensure that [Topic] acts as a robust engine for inclusive development.'
      }
    ],
    tips: [
      'Strictly adhere to the 250-word limit. Staying between 230 to 260 words is ideal.',
      'Always start with a clear definition in the introduction.',
      'Separate your thoughts into clear, readable paragraphs (avoid writing a single long block of text).',
      'Use transition words like "Furthermore", "On the other hand", "Consequently", and "In conclusion".'
    ]
  },
  {
    id: 't-formal-letter',
    category: 'formal_letter',
    title: 'Formal Letter to Bank Manager Template',
    description: 'Perfect format for formal requests, complaint letters, and official banking correspondence (dispense errors, card blockages, loan requests).',
    structure: [
      {
        sectionName: 'Sender Address',
        description: 'Your details (Name/Masked Address) in the top-left corner. Use a placeholder in the exam.',
        sampleText: 'Sector 4, Dwarka,\nNew Delhi - 110075'
      },
      {
        sectionName: 'Date',
        description: 'Left-aligned, written in standard formal format.',
        sampleText: 'July 12, 2026'
      },
      {
        sectionName: 'Receiver Designation & Address',
        description: 'Designation of the recipient (e.g., The Branch Manager) followed by Bank Name and Branch Address.',
        sampleText: 'The Branch Manager,\nState Bank of India,\nDwarka Sector 10 Branch,\nNew Delhi - 110075'
      },
      {
        sectionName: 'Subject Line',
        description: 'Extremely concise, summarizing the core reason for writing. Keep it under one line.',
        sampleText: 'Subject: Request for replacement of damaged Debit Card (A/C No. XXXXXX1234)'
      },
      {
        sectionName: 'Salutation',
        description: 'Professional greeting.',
        sampleText: 'Respected Sir/Madam,'
      },
      {
        sectionName: 'Body of the Letter (approx. 100-120 words)',
        description: 'Paragraph 1: State your name, account number, and main request. Paragraph 2: Add specific details (transaction dates, ATM IDs, or loan amounts). Paragraph 3: Actionable request and polite close.',
        sampleText: 'I am writing to bring to your kind notice that my debit card associated with savings account number XXXXXX1234 was recently damaged and is no longer being read by ATM machines.\n\nSince this card is essential for my daily banking transactions, I kindly request you to issue a replacement card at the earliest. I have attached the required application form and a copy of my identity proof.\n\nThank you for your prompt attention to this matter.'
      },
      {
        sectionName: 'Sign-off',
        description: 'Standard formal closure.',
        sampleText: 'Yours faithfully,\n[Your Name]'
      }
    ],
    tips: [
      'Maintain strict alignment on the left margin (block format).',
      'The subject line should be bold or underlined (if written) and starts with "Subject:".',
      'Do not write actual personal names or real addresses if the exam guidelines forbid it (use "A.B.C" or "XYZ").',
      'A formal letter must fit within 150 words. Avoid unnecessary descriptions.'
    ]
  },
  {
    id: 't-informal-letter',
    category: 'informal_letter',
    title: 'Informal Letter Template',
    description: 'Structure for writing to friends, parents, or siblings concerning advice, updates, congratulations, or invitations.',
    structure: [
      {
        sectionName: 'Sender Address & Date',
        description: 'Your location and date, placed on the top-left (or top-right depending on preference, top-left is standard in modern format).',
        sampleText: 'Hostel No. 3, ABC College,\nPune - 411007\n\nJuly 12, 2026'
      },
      {
        sectionName: 'Greeting',
        description: 'Warm and affectionate salutation.',
        sampleText: 'Dear [Friend\'s Name] / Dear Father,'
      },
      {
        sectionName: 'Introduction & Warm Up',
        description: 'Inquire about health, express hope that they are well, or refer to a recent event.',
        sampleText: 'I hope this letter finds you in the best of health and spirits. It has been a while since we last spoke, and I wanted to write to catch up on things.'
      },
      {
        sectionName: 'Body of the Letter',
        description: 'Share the main news, offer advice (e.g. savings schemes), or describe your experience in detail. The tone should remain warm, personal, and conversational.',
        sampleText: 'I recently started reading about financial planning, and I realized how important it is for us to start saving early. I would strongly advise you to check out small saving schemes like the Public Provident Fund (PPF). It offers excellent tax benefits and risk-free compounding interest.'
      },
      {
        sectionName: 'Conclusion & Regards',
        description: 'Conclude with a warm summary, send regards to family members, and prompt for a reply.',
        sampleText: 'Please convey my warm regards to uncle and aunt. I hope to hear from you soon about your plans. Take care.'
      },
      {
        sectionName: 'Subscription / Signature',
        description: 'Friendly closing and your first name.',
        sampleText: 'Yours lovingly,\n[Your Name]'
      }
    ],
    tips: [
      'No Subject line is needed in informal letters.',
      'No Receiver Address is required on the page.',
      'The tone should be colloquial yet grammatically correct.',
      'Ensure proper punctuation even in casual expressions.'
    ]
  }
];
