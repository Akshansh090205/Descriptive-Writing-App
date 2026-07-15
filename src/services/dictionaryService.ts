import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VocabWord } from '../data/dailyVocabulary';

// Interface for raw API response from Free Dictionary API
interface FreeDictionaryDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface FreeDictionaryMeaning {
  partOfSpeech: string;
  definitions: FreeDictionaryDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface FreeDictionaryResponse {
  word: string;
  meanings: FreeDictionaryMeaning[];
}

/**
 * Searches the public Free Dictionary API for word metadata.
 */
export async function fetchFromFreeDictionary(word: string): Promise<VocabWord> {
  const cleanWord = word.trim().toLowerCase();
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Word "${word}" not found in online dictionary.`);
  }

  const data: FreeDictionaryResponse[] = await response.json();
  if (!data || data.length === 0) {
    throw new Error(`No data received for word "${word}".`);
  }

  const entry = data[0];
  const firstMeaning = entry.meanings?.[0];
  const partOfSpeech = firstMeaning?.partOfSpeech || 'noun';
  const firstDefObj = firstMeaning?.definitions?.[0];
  const meaning = firstDefObj?.definition || 'No definition available.';
  const example = firstDefObj?.example || `We need to understand the concept of ${entry.word} to proceed.`;

  // Aggregate synonyms and antonyms from all meanings/definitions
  const synonymsSet = new Set<string>();
  const antonymsSet = new Set<string>();

  const processList = (list?: string[]) => {
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (typeof item === 'string' && item.trim().length > 0) {
          synonymsSet.add(item.toLowerCase());
        }
      });
    }
  };

  entry.meanings?.forEach(meaningObj => {
    processList(meaningObj.synonyms);
    processList(meaningObj.antonyms);

    meaningObj.definitions?.forEach(def => {
      processList(def.synonyms);
      processList(def.antonyms);
    });
  });

  const synonyms = Array.from(synonymsSet);
  const antonyms = Array.from(antonymsSet);

  // Capitalize word
  const capitalizedWord = entry.word.charAt(0).toUpperCase() + entry.word.slice(1);

  // Generate generic banking context usage
  const bankingContextUsage = `In banking and financial exams, utilizing terms like "${entry.word}" can enhance writing clarity when discussing structural reforms or policy impacts.`;

  return {
    word: capitalizedWord,
    partOfSpeech,
    meaning,
    synonyms: synonyms.length > 0 ? synonyms.slice(0, 5) : ['equivalent term', 'related term'],
    antonyms: antonyms.length > 0 ? antonyms.slice(0, 5) : ['opposite term'],
    example,
    bankingContextUsage
  };
}

/**
 * Uses Gemini AI to generate a rich dictionary definition customized for banking exams.
 */
export async function fetchFromGemini(apiKey: string, word: string): Promise<VocabWord> {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash as it is fast and supports JSON response MIME type
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
You are a professional dictionary database and banking exam vocabulary generator.
Generate a rich definition, parts of speech, synonyms, antonyms, general example, and custom banking-relevant exam context usage for the word: "${word}".

Output ONLY a JSON object matching this TypeScript interface:
interface VocabWord {
  word: string; // The word itself (matching casing)
  partOfSpeech: string; // e.g. "verb", "noun", "adjective"
  meaning: string; // Clear, academic definition
  synonyms: string[]; // List of 4-6 synonyms
  antonyms: string[]; // List of 4-6 antonyms
  example: string; // Standard example sentence illustrating normal usage
  bankingContextUsage: string; // High-scoring sentence utilizing the word in a banking, finance, economy, or cybersecurity exam context
}

Do NOT wrap the output in markdown, code blocks, or comments. Output strictly the JSON.
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const parsedData = JSON.parse(responseText) as VocabWord;

  // Make sure fields exist and are normalized
  return {
    word: parsedData.word || word,
    partOfSpeech: parsedData.partOfSpeech || 'noun',
    meaning: parsedData.meaning || 'No definition found.',
    synonyms: Array.isArray(parsedData.synonyms) && parsedData.synonyms.length > 0 ? parsedData.synonyms : ['synonym'],
    antonyms: Array.isArray(parsedData.antonyms) && parsedData.antonyms.length > 0 ? parsedData.antonyms : ['antonym'],
    example: parsedData.example || `Usage of the word ${word}.`,
    bankingContextUsage: parsedData.bankingContextUsage || `Usage of the word ${word} in banking exams.`
  };
}

/**
 * Combined service lookup. Attempts Gemini AI if API key is present, falls back to the Free Dictionary API.
 */
export async function lookupVocabularyWord(word: string, apiKey?: string): Promise<VocabWord> {
  const cleanWord = word.trim();
  if (!cleanWord) {
    throw new Error('Please enter a valid word to search.');
  }

  // If API Key is present, try Gemini first
  if (apiKey && apiKey.trim().length > 0) {
    try {
      return await fetchFromGemini(apiKey, cleanWord);
    } catch (error) {
      console.warn('Gemini vocabulary lookup failed. Falling back to public dictionary API.', error);
      // Fallback
      return await fetchFromFreeDictionary(cleanWord);
    }
  }

  // Direct public API call
  return await fetchFromFreeDictionary(cleanWord);
}
