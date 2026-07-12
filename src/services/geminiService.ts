import { GoogleGenerativeAI } from '@google/generative-ai';

export interface InlineHighlight {
  text: string; // The exact text to highlight
  type: 'error' | 'warning' | 'excellent';
  correction?: string;
  explanation: string;
  suggestions?: string[];
  startIndex?: number; // Calculated dynamically in frontend
  endIndex?: number;   // Calculated dynamically in frontend
}

export interface EvaluationResultData {
  overallScore: number;
  scores: {
    grammar: number;
    vocabulary: number;
    sentenceStructure: number;
    organization: number;
    contentRelevance: number;
    presentation: number;
  };
  readability: 'Easy' | 'Medium' | 'Advanced' | 'Professional';
  wordCount: {
    current: number;
    required: number;
    ideal: string;
  };
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  highlights: InlineHighlight[];
  betterConclusion: string;
  professionalVersion: string;
  samplePerfectAnswer: string;
  estimatedIBPSEvaluation: string;
  probabilityOfFullMarks: string;
  isFallback?: boolean;
}

// Utility to find substrings in text and create accurate highlights
export function computeHighlightIndices(text: string, highlights: InlineHighlight[]): InlineHighlight[] {
  const result: InlineHighlight[] = [];
  const lowercaseText = text.toLowerCase();

  // Sort highlights by length of text descending to avoid sub-string replacement conflicts
  const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);

  // Keep track of matched ranges to avoid overlapping highlights
  const matchedRanges: { start: number; end: number }[] = [];

  for (const hl of sortedHighlights) {
    if (!hl.text || hl.text.trim().length === 0) continue;
    
    let index = lowercaseText.indexOf(hl.text.toLowerCase());
    
    // Find the first occurrence that does not overlap with existing highlights
    while (index !== -1) {
      const end = index + hl.text.length;
      const overlaps = matchedRanges.some(r => 
        (index >= r.start && index < r.end) || 
        (end > r.start && end <= r.end) ||
        (index <= r.start && end >= r.end)
      );

      if (!overlaps) {
        matchedRanges.push({ start: index, end });
        result.push({
          ...hl,
          startIndex: index,
          endIndex: end,
          // Extract actual original casing from the user's text
          text: text.substring(index, end)
        });
        break;
      }
      
      // Look for next occurrence
      index = lowercaseText.indexOf(hl.text.toLowerCase(), index + 1);
    }
  }

  // Sort result back by start index ascending for easy rendering
  return result.sort((a, b) => (a.startIndex || 0) - (b.startIndex || 0));
}

// Local Fallback Evaluator: Generates reasonable rule-based feedback offline
export function evaluateOffline(text: string, title: string, category: string, requiredWords: number): EvaluationResultData {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCountVal = words.length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  
  // Calculate basic metrics
  const avgSentenceLength = wordCountVal / sentenceCount;
  const highlights: InlineHighlight[] = [];

  // Gibberish & Spelling Analysis
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  const commonAbbreviations = ['atm', 'kyc', 'sbi', 'rbi', 'upi', 'gst', 'npa', 'psb', 'pyq', 'pdf', 'otp', 'mfa', 'dbt', 'aeps'];
  const consonantWhitelist = ['strengths', 'weights', 'knights', 'flights', 'insights', 'thoughts', 'through', 'straight'];
  let gibberishWordCount = 0;

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    // Remove trailing punctuation for vowel checks
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    
    // Extract core word by stripping all leading/trailing non-alphanumeric punctuation
    const coreWord = rawWord.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    if (cleanWord.length > 0) {
      const hasVowels = cleanWord.split('').some(char => vowels.includes(char));
      const isAbbreviation = commonAbbreviations.includes(cleanWord);
      const isWhitelisted = consonantWhitelist.includes(cleanWord);

      // Check 1: Long word with no vowels (and not a whitelisted abbreviation)
      const isNoVowelGibberish = cleanWord.length > 3 && !hasVowels && !isAbbreviation;
      
      // Check 2: 5 or more consecutive consonants (and not whitelisted)
      const hasImpossibleConsonants = /(?:[bcdfghjklmnpqrstvwxz]{5,})/i.test(cleanWord) && !isWhitelisted && !isAbbreviation;

      // Check 3: Raw character count mismatch (gibberish string length)
      const isExtremelyLong = cleanWord.length > 22;

      // Check 4: Contains weird non-letter characters embedded inside the word structure
      const hasEmbeddedGarbage = /[^a-zA-Z0-9'-]/.test(coreWord) && !/^\d+$/.test(coreWord);

      if (isNoVowelGibberish || hasImpossibleConsonants || isExtremelyLong || hasEmbeddedGarbage) {
        gibberishWordCount++;
        highlights.push({
          text: rawWord,
          type: 'error',
          correction: '[check spelling]',
          explanation: `"${rawWord}" appears to be misspelled or contains unrecognized gibberish character clutter.`
        });
      }
    }
  }

  // Capitalization Checks
  const sentenceStarts = text.split(/[.!?]+\s+/);
  for (const s of sentenceStarts) {
    const trimmed = s.trim();
    if (trimmed.length > 0) {
      const firstChar = trimmed.charAt(0);
      if (firstChar >= 'a' && firstChar <= 'z') {
        const firstWord = trimmed.split(/\s+/)[0];
        highlights.push({
          text: firstWord,
          type: 'error',
          correction: firstChar.toUpperCase() + firstWord.substring(1),
          explanation: 'This sentence begins with a lowercase letter. Start sentences with capital letters.'
        });
      }
    }
  }

  // Spacing Errors (e.g. space before punctuation)
  const spacingRegex = /\s+([.,!?;:])/g;
  let spacingMatch;
  while ((spacingMatch = spacingRegex.exec(text)) !== null) {
    highlights.push({
      text: spacingMatch[0],
      type: 'error',
      correction: spacingMatch[1],
      explanation: `Delete the unnecessary space before the punctuation mark "${spacingMatch[1]}".`
    });
  }

  // Basic spell check for common preposition patterns
  const commonMistakes = [
    { pattern: /\bthe\s+the\b/i, text: 'the the', type: 'error', correction: 'the', explanation: 'Duplicate word detected.' },
    { pattern: /\band\s+and\b/i, text: 'and and', type: 'error', correction: 'and', explanation: 'Duplicate word detected.' },
    { pattern: /\bcomply\s+to\b/i, text: 'comply to', type: 'error', correction: 'comply with', explanation: 'The verb "comply" matches with the preposition "with".' },
    { pattern: /\bcope\s+up\s+with\b/i, text: 'cope up with', type: 'error', correction: 'cope with', explanation: 'The idiom is "cope with", not "cope up with".' },
    { pattern: /\bdiscuss\s+about\b/i, text: 'discuss about', type: 'error', correction: 'discuss', explanation: 'The verb "discuss" is transitive; do not use "about" after it.' },
    { pattern: /\baccording\s+to\s+me\b/i, text: 'according to me', type: 'warning', correction: 'in my opinion', explanation: 'Use "in my opinion" or "from my perspective" for formal banking tone.' },
    { pattern: /\bshow\b/i, text: 'show', type: 'warning', correction: 'demonstrate', explanation: 'Consider a more advanced synonym like "demonstrate", "illustrate", or "exhibit".', suggestions: ['demonstrate', 'illustrate', 'exhibit'] },
    { pattern: /\bgood\b/i, text: 'good', type: 'warning', correction: 'beneficial', explanation: 'Consider a more professional banking synonym.', suggestions: ['beneficial', 'advantageous', 'meritorious'] },
    { pattern: /\bbad\b/i, text: 'bad', type: 'warning', correction: 'adverse', explanation: 'Consider a more professional banking synonym.', suggestions: ['adverse', 'detrimental', 'unfavorable'] }
  ];

  for (const rule of commonMistakes) {
    const match = text.match(rule.pattern);
    if (match) {
      highlights.push({
        text: match[0],
        type: rule.type as any,
        correction: rule.correction,
        explanation: rule.explanation,
        suggestions: rule.suggestions
      });
    }
  }

  // Find sentences that are too long
  const sentences = text.split(/([.!?]+)/);
  for (let i = 0; i < sentences.length; i += 2) {
    const s = sentences[i];
    if (!s) continue;
    const sWords = s.trim().split(/\s+/).filter(w => w.length > 0);
    if (sWords.length > 25) {
      highlights.push({
        text: s.trim().substring(0, 40) + '...',
        type: 'warning',
        explanation: `This sentence is very long (${sWords.length} words). Consider breaking it down to improve readability.`,
        correction: s.substring(0, Math.floor(s.length/2)) + '... [Split]'
      });
    }
  }

  // Score adjustments based on prompt rules
  const totalWords = wordCountVal || 1;
  const gibberishRate = gibberishWordCount / totalWords;
  const isHardGibberish = gibberishRate > 0.20 || (totalWords < 5 && gibberishWordCount > 0);

  const errors = highlights.filter(h => h.type === 'error').length;
  const warnings = highlights.filter(h => h.type === 'warning').length;

  let grammarScore = 0;
  let vocabScore = 0;
  let sentenceStructure = 0;
  let organization = 0;
  let contentRelevance = 0;
  let presentation = 0;

  if (category === 'essay') {
    // Essay Marking Scheme (Total: 15 Marks)
    if (isHardGibberish) {
      contentRelevance = 0.5;
      grammarScore = 0.5;
      organization = 0.5;
      presentation = 0.5;
    } else {
      // Content & Topical Relevance (6 Marks)
      contentRelevance = 6;
      const ratio = totalWords / requiredWords;
      if (ratio < 0.5) contentRelevance = 2;
      else if (ratio < 0.8) contentRelevance = 4;
      else if (ratio < 0.9) contentRelevance = 5;

      // Grammar, Spelling & Punctuation (4 Marks)
      grammarScore = Math.max(0.5, 4 - (errors * 0.5));

      // Structure & Paragraphing (3 Marks)
      organization = text.includes('\n') ? 3 : 1.5;

      // Word Count Compliance (2 Marks)
      presentation = (totalWords >= 230 && totalWords <= 270) ? 2 : 1;
    }
  } else {
    // Letter Marking Scheme (Total: 10 Marks)
    if (isHardGibberish) {
      organization = 0.5;
      contentRelevance = 0.5;
      grammarScore = 0.5;
      presentation = 0.5;
    } else {
      // Format & Layout (3 Marks)
      organization = text.includes('\n') ? 3 : 1.5;

      // Content & Communication (3 Marks)
      contentRelevance = 3;
      if (totalWords < 40) contentRelevance = 1;
      else if (totalWords < 80) contentRelevance = 2;

      // Grammar & Vocabulary (2 Marks)
      grammarScore = Math.max(0.5, 2 - (errors * 0.3) - (warnings * 0.1));

      // Word Count & Rules - Anonymity check (2 Marks)
      const hasRealNames = /\b(akshansh|pal)\b/i.test(text); // Check local user profile names
      const staysWithinRange = totalWords >= 135 && totalWords <= 210;
      presentation = 2;
      if (!staysWithinRange) presentation -= 0.5;
      if (hasRealNames) presentation -= 1;
      presentation = Math.max(0.5, presentation);
    }
  }

  const totalScore = Math.round((grammarScore + vocabScore + sentenceStructure + organization + contentRelevance + presentation) * 10) / 10;

  // Determine readability
  let readability: 'Easy' | 'Medium' | 'Advanced' | 'Professional' = 'Medium';
  if (isHardGibberish) readability = 'Easy';
  else if (avgSentenceLength > 25) readability = 'Professional';
  else if (avgSentenceLength > 18) readability = 'Advanced';
  else if (avgSentenceLength < 12) readability = 'Easy';

  // Construct fallback evaluation response
  return {
    overallScore: totalScore,
    scores: {
      grammar: grammarScore,
      vocabulary: vocabScore,
      sentenceStructure: sentenceStructure,
      organization: organization,
      contentRelevance: contentRelevance,
      presentation: presentation
    },
    readability,
    wordCount: {
      current: wordCountVal,
      required: requiredWords,
      ideal: `${Math.round(requiredWords * 0.9)}-${Math.round(requiredWords * 1.1)}`
    },
    strengths: isHardGibberish 
      ? ['Draft submitted successfully for evaluation.'] 
      : [
          wordCountVal >= requiredWords * 0.9 ? 'Adequate length matching exam requirements.' : 'Draft starts to formulate details.',
          text.includes('\n') ? 'Proper layout separation using paragraphs.' : 'Basic typing coherence.',
          avgSentenceLength >= 14 && avgSentenceLength <= 22 ? 'Good average sentence length (ideal for readable flows).' : 'Vocalized key concepts.'
        ],
    weaknesses: isHardGibberish
      ? ['Extremely high density of unrecognized or gibberish characters.', 'Lacks meaningful English words or banking terms.', 'Fails standard paragraph layout constraints.']
      : [
          wordCountVal < requiredWords * 0.9 ? `Word count is too low (${wordCountVal}/${requiredWords}). Try expanding your arguments.` : '',
          !text.includes('\n') ? 'No paragraph separation detected. Keep introduction, body, and conclusion distinct.' : '',
          highlights.length > 3 ? 'Multiple grammar/vocabulary improvements spotted.' : ''
        ].filter(w => w.length > 0),
    tips: isHardGibberish
      ? [
          'Please enter a structured response using meaningful English words.',
          'Verify that you are using letters and standard spacing.',
          'Format essays into Introduction, Body, and Conclusion paragraphs.'
        ]
      : [
          'Structure your essay into exactly 4 paragraphs: Introduction, Positive side, Challenges, and Conclusion.',
          'Ensure standard prepositions are used (e.g. "comply with", "discuss" without "about").',
          'Use strong transitional keywords such as "Furthermore", "In addition", "On the contrary", and "Consequently".',
          'Spend the first 2 minutes planning your key facts/data points and the last 3 minutes proofreading spelling.'
        ],
    highlights: computeHighlightIndices(text, highlights),
    betterConclusion: category === 'essay' 
      ? 'In conclusion, while the transition poses distinct challenges, its long-term benefits for India are substantial. By resolving security concerns and fostering digital literacy, we can build a strong economic foundation.' 
      : 'Thanking you in anticipation. I request your immediate assistance to resolve this issue as soon as possible.',
    professionalVersion: isHardGibberish ? '[Draft is too low quality to rewrite]' : text.replace(/\bshow\b/g, 'demonstrate').replace(/\bgood\b/g, 'beneficial'),
    samplePerfectAnswer: `This is an ideal response written in standard exam format.\n\n[Topic: ${title}]\n\nIntroduction:\nIn the contemporary banking era, the subject of ${title} plays a pivotal role in accelerating economic growth. With the rise of digital integration, it has reshaped the landscape of customer interactions.\n\nBody Paragraph:\nOne of the most profound benefits is the democratization of financial accessibility. However, high transitions costs and safety concerns pose significant hurdles that must be addressed immediately.\n\nConclusion:\nTo summarize, standard regulatory sandboxes and public literacy drives are critical to optimize this path forward.`,
    estimatedIBPSEvaluation: isHardGibberish 
      ? 'Failing grade. The response is incomprehensible and contains non-English characters or gibberish. Scoring is heavily penalized.'
      : 'Average performance. Satisfies baseline requirements but needs improvement in structure, vocabulary, and vocabulary richness.',
    probabilityOfFullMarks: isHardGibberish ? '0%' : `${Math.round(totalScore * 0.9)}%`,
    isFallback: true
  };
}

// Call the Gemini API to evaluate candidate writing
export async function evaluateWithGemini(
  apiKey: string,
  text: string,
  topic: { title: string; category: string; description: string; wordLimit: number },
  customModel?: string
): Promise<EvaluationResultData> {
  if (!apiKey || apiKey.trim() === '') {
    return evaluateOffline(text, topic.title, topic.category, topic.wordLimit);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = customModel || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an expert banking exam evaluator for SBI PO, IBPS PO, and RBI Grade B descriptive papers.
Evaluate the candidate's answer based on the following topic details:
- Topic Title: "${topic.title}"
- Practice Category: "${topic.category}" (essay, formal_letter, or informal_letter)
- Description/Question: "${topic.description}"
- Target Word Limit: ${topic.wordLimit} words

Here is the Candidate's Answer:
"""
${text}
"""

Evaluate this answer and output ONLY a JSON object matching this TypeScript interface structure:
interface EvaluationResponse {
  overallScore: number; // For Essays: Total out of 15. For Letters: Total out of 10.
  scores: {
    // For Essays (Total: 15 Marks):
    // - contentRelevance: out of 6 (Content & Topical Relevance)
    // - grammar: out of 4 (Grammar, Spelling & Punctuation)
    // - organization: out of 3 (Structure & Paragraphing)
    // - presentation: out of 2 (Word Count Compliance)
    // - vocabulary: 0 (Set to 0 for essays)
    // - sentenceStructure: 0 (Set to 0 for essays)
    //
    // For Letters (Total: 10 Marks):
    // - organization: out of 3 (Format & Layout)
    // - contentRelevance: out of 3 (Content & Communication)
    // - grammar: out of 2 (Grammar & Vocabulary)
    // - presentation: out of 2 (Word Count & Rules - Anonymity check)
    // - vocabulary: 0 (Set to 0 for letters)
    // - sentenceStructure: 0 (Set to 0 for letters)
    grammar: number;
    vocabulary: number;
    sentenceStructure: number;
    organization: number;
    contentRelevance: number;
    presentation: number;
  };
  readability: 'Easy' | 'Medium' | 'Advanced' | 'Professional';
  strengths: string[]; // List 2-3 specific strengths
  weaknesses: string[]; // List 2-3 specific weaknesses
  tips: string[]; // List 3-5 specific, actionable tips to score higher in the banking exam
  grammarErrors: {
    text: string; // The exact phrase or word in the candidate's text that has a spelling, grammar, article, preposition or punctuation error
    correction: string; // The suggested correction
    explanation: string; // Why it is incorrect
  }[];
  vocabularySuggestions: {
    text: string; // The exact word in the candidate's text that is weak or repeated (e.g. "good", "get")
    suggestions: string[]; // 2-3 advanced alternatives (e.g., "beneficial", "acquire")
    explanation: string; // Brief reasoning
  }[];
  sentenceImprovements: {
    text: string; // The exact sentence in the candidate's text that is run-on, fragment, too passive, or clunky
    improvement: string; // Better, restructured version of the sentence
    explanation: string; // Why it is better
  }[];
  betterConclusion: string; // A re-written, highly impactful conclusion or letter ending in proper exam style
  professionalVersion: string; // The entire candidate's answer rewritten to sound highly professional, keeping original points
  samplePerfectAnswer: string; // A model perfect answer written exactly in banking exam style within the target word limit, featuring rich vocabulary and correct grammar
  estimatedIBPSEvaluation: string; // A brief summary evaluation of how a real IBPS evaluator would rate this (e.g. "Excellent vocabulary but layout misses letter formatting...")
  probabilityOfFullMarks: string; // e.g. "75%" or "40%"
}

CRITICAL SCORING RULES:
1. Return ONLY the JSON object. Do not wrap in markdown or any other tags.
2. In 'grammarErrors', 'vocabularySuggestions', and 'sentenceImprovements', the "text" property MUST match EXACTLY, character-for-character, a substring from the candidate's original text, including whitespace and capitalization.
3. Strict Marking Schemes:
   A. If category is "essay":
      - Total Score is out of 15 marks.
      - Content & Topical Relevance is worth 6 marks (deduct if off-topic, lacks logical flow or facts).
      - Grammar, Spelling & Punctuation is worth 4 marks (deduct heavily for any spelling mistakes or typos).
      - Structure & Paragraphing is worth 3 marks (deduct if not divided into 3-4 paragraphs or lacks transitions).
      - Word Count Compliance is worth 2 marks (deduct if outside the 230-270 safe buffer).
      - set vocabulary and sentenceStructure score components to 0.
   B. If category is "formal_letter" or "informal_letter":
      - Total Score is out of 10 marks.
      - Format & Layout is worth 3 marks (deduct if block left-alignment or addresses/salutation/sign-off layout is wrong).
      - Content & Communication is worth 3 marks (deduct if purpose is not in opening sentence, details are missing, or tone is wrong).
      - Grammar & Vocabulary is worth 2 marks (deduct for poor phrasing or misspelled operational words like "Sincerely" / "Faithfully").
      - Word Count & Rules is worth 2 marks (deduct if outside 150-200 words, OR if the anonymity rule is broken - i.e., user wrote real names instead of placeholders like XYZ/ABC).
      - set vocabulary and sentenceStructure score components to 0.
4. Be very strict and realistic for banking descriptive examinations.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON output
    const parsedData = JSON.parse(responseText);

    // Dynamic extraction of highlights to populate start/end indexes
    const rawHighlights: InlineHighlight[] = [];
    
    if (parsedData.grammarErrors) {
      for (const err of parsedData.grammarErrors) {
        rawHighlights.push({
          text: err.text,
          type: 'error',
          correction: err.correction,
          explanation: err.explanation
        });
      }
    }
    
    if (parsedData.vocabularySuggestions) {
      for (const voc of parsedData.vocabularySuggestions) {
        rawHighlights.push({
          text: voc.text,
          type: 'warning',
          explanation: voc.explanation,
          suggestions: voc.suggestions,
          correction: voc.suggestions?.[0]
        });
      }
    }

    if (parsedData.sentenceImprovements) {
      for (const sent of parsedData.sentenceImprovements) {
        rawHighlights.push({
          text: sent.text,
          type: 'warning',
          explanation: sent.explanation,
          correction: sent.improvement
        });
      }
    }

    const computedHighlights = computeHighlightIndices(text, rawHighlights);

    return {
      overallScore: parsedData.overallScore || 70,
      scores: parsedData.scores || { grammar: 14, vocabulary: 11, sentenceStructure: 11, organization: 14, contentRelevance: 14, presentation: 6 },
      readability: parsedData.readability || 'Medium',
      wordCount: {
        current: text.trim().split(/\s+/).filter(w => w.length > 0).length,
        required: topic.wordLimit,
        ideal: `${Math.round(topic.wordLimit * 0.9)}-${Math.round(topic.wordLimit * 1.1)}`
      },
      strengths: parsedData.strengths || [],
      weaknesses: parsedData.weaknesses || [],
      tips: parsedData.tips || [],
      highlights: computedHighlights,
      betterConclusion: parsedData.betterConclusion || '',
      professionalVersion: parsedData.professionalVersion || text,
      samplePerfectAnswer: parsedData.samplePerfectAnswer || '',
      estimatedIBPSEvaluation: parsedData.estimatedIBPSEvaluation || '',
      probabilityOfFullMarks: parsedData.probabilityOfFullMarks || '50%'
    };

  } catch (error) {
    console.error("Gemini API evaluation failed. Falling back to offline evaluation.", error);
    return evaluateOffline(text, topic.title, topic.category, topic.wordLimit);
  }
}

// Service to generate a new custom topic using Gemini
export async function generateAITopic(
  apiKey: string,
  difficulty: 'easy' | 'medium' | 'hard',
  category: 'Current Affairs' | 'Economy' | 'Banking' | 'Technology' | 'Society' | 'Education' | 'Environment' | 'Women' | 'Finance' | 'Government Schemes'
): Promise<{ title: string; description: string; wordLimit: number; timeLimit: number; tags: string[]; hints: string[]; facts: string[]; keywords: string[] }> {
  const defaultRes = {
    title: `Current Trends in ${category} (${difficulty})`,
    description: `Evaluate the latest advancements in the field of ${category} and their direct implications on the Indian banking ecosystem.`,
    wordLimit: 250,
    timeLimit: 30,
    tags: [category, 'AI Generated'],
    hints: ['Analyze the primary factors driving changes.', 'Point out banking and financial linkages.'],
    facts: ['Digital transitions are scaling rapid growth.'],
    keywords: [category, 'Innovation']
  };

  if (!apiKey || apiKey.trim() === '') {
    return defaultRes;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an exam convener setting questions for banking descriptive tests (SBI PO and IBPS PO).
Generate a brand-new practice topic with the following settings:
- Difficulty level: ${difficulty}
- Domain Category: ${category}

Output ONLY a JSON object matching this structure:
{
  "title": "A concise, realistic exam topic heading",
  "description": "The detailed descriptive writing question prompt",
  "wordLimit": 250, // 250 for essays, 150 for letters
  "timeLimit": 30, // 30 for essays, 20 for letters
  "tags": ["Tag1", "Tag2"],
  "hints": ["Key point 1", "Key point 2", "Key point 3"],
  "facts": ["Fact or data point 1", "Fact or data point 2"],
  "keywords": ["Keyword1", "Keyword2", "Keyword3"]
}
`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Topic generation failed", error);
    return defaultRes;
  }
}

// Service to generate writing hints using Gemini
export async function generateAIHints(
  apiKey: string,
  title: string,
  description: string
): Promise<{ hints: string[]; facts: string[]; keywords: string[] }> {
  const defaultRes = {
    hints: ['Structure your thoughts into clear paragraphs.', 'Introduce the core problem first.', 'Offer balanced viewpoints.'],
    facts: ['Financial sectors represent the backbone of rural growth.'],
    keywords: ['Development', 'Regulation', 'Efficiency']
  };

  if (!apiKey || apiKey.trim() === '') {
    return defaultRes;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
Provide quick writing hints, relevant general facts, and crucial banking/economic keywords to help a candidate write an essay or letter on the following topic:
Topic: "${title}"
Description: "${description}"

Output ONLY a JSON object matching this structure:
{
  "hints": ["Hint 1", "Hint 2", "Hint 3", "Hint 4"],
  "facts": ["Fact 1", "Fact 2"],
  "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"]
}
`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Hints generation failed", error);
    return defaultRes;
  }
}

// Service to rewrite text based on request using Gemini
export async function rewriteText(
  apiKey: string,
  text: string,
  action: 'professional' | 'vocabulary' | 'reduce' | 'expand' | 'tone'
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    if (action === 'professional') return text.replace(/\bshow\b/g, 'demonstrate').replace(/\bgood\b/g, 'beneficial');
    if (action === 'vocabulary') return text.replace(/\bbad\b/g, 'adverse').replace(/\bget\b/g, 'acquire');
    if (action === 'reduce') return text.split(/\s+/).slice(0, Math.floor(text.split(/\s+/).length * 0.8)).join(' ') + '... [Shortened]';
    if (action === 'expand') return text + '\n\nAdditionally, this development plays a critical role in fostering financial stability and rural growth.';
    return text;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let instruction = '';
    if (action === 'professional') instruction = 'Rewrite this text to make it sound highly professional, polished, and suitable for a banking executive exam.';
    else if (action === 'vocabulary') instruction = 'Rewrite this text by increasing the vocabulary level. Replace simple words with advanced synonyms suitable for SBI PO Mains.';
    else if (action === 'reduce') instruction = 'Reduce the word count of this text by about 20% while fully preserving its core meaning and logical flow.';
    else if (action === 'expand') instruction = 'Expand this text by adding relevant arguments, details, and banking facts without drifting off-topic.';
    else if (action === 'tone') instruction = 'Rewrite this text to ensure a strictly objective, formal, and analytical tone (eliminating colloquialisms and emotional words).';

    const prompt = `
Instruction: ${instruction}

Original Text:
"""
${text}
"""

Output ONLY the rewritten text without comments, markdown blocks, or notes.
`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Rewrite failed", error);
    return text;
  }
}
