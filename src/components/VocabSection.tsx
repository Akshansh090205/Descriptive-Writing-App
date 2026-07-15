import React, { useState } from 'react';
import { dailyVocabulary } from '../data/dailyVocabulary';
import type { VocabWord } from '../data/dailyVocabulary';
import { useApp } from '../context/AppContext';
import { lookupVocabularyWord } from '../services/dictionaryService';
import { 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  Trash2, 
  BookOpen, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const VocabSection: React.FC = () => {
  const { settings } = useApp();
  const [search, setSearch] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  
  // States for online lookup
  const [searchedWords, setSearchedWords] = useState<VocabWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter local daily words
  const localFiltered = dailyVocabulary.filter(v => 
    v.word.toLowerCase().includes(search.toLowerCase()) ||
    v.meaning.toLowerCase().includes(search.toLowerCase()) ||
    v.synonyms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const handleOnlineLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const wordToSearch = lookupQuery.trim();
    if (!wordToSearch) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if word is already in searchedWords to avoid duplicate API calls
      const alreadySearched = searchedWords.find(
        w => w.word.toLowerCase() === wordToSearch.toLowerCase()
      );
      
      if (alreadySearched) {
        // Move it to the top of the list
        setSearchedWords(prev => [alreadySearched, ...prev.filter(w => w.word !== alreadySearched.word)]);
        setLookupQuery('');
        setIsLoading(false);
        return;
      }

      // Check if it exists in dailyVocabulary local list
      const localWord = dailyVocabulary.find(
        w => w.word.toLowerCase() === wordToSearch.toLowerCase()
      );

      if (localWord) {
        // Add to searchedWords so it shows in the results section
        setSearchedWords(prev => [localWord, ...prev]);
        setLookupQuery('');
        setIsLoading(false);
        return;
      }

      // If not local, perform online/Gemini lookup
      const result = await lookupVocabularyWord(wordToSearch, settings.apiKey);
      setSearchedWords(prev => [result, ...prev]);
      setLookupQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to find the word. Please check your spelling or connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearches = () => {
    setSearchedWords([]);
    setError(null);
  };

  const isGeminiActive = !!settings.apiKey && settings.apiKey.trim().length > 0;

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-950">
        <div className="absolute right-0 bottom-0 translate-y-10 translate-x-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 -translate-y-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Dictionary Integrations</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Vocabulary & Context Builder</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Explore high-scoring vocabulary and look up any word. Get definitions, synonyms, antonyms, and tailored exam-style context examples.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0 bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Engine Status</span>
            {isGeminiActive ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini AI (Exam Contexts Active)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <Globe className="w-3.5 h-3.5" />
                <span>Free Public Dictionary API</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 leading-normal max-w-xs text-left md:text-right mt-1">
              {isGeminiActive 
                ? 'Generating professional economic & banking usages for your searched words.' 
                : 'Configure a Gemini API key in Settings to unlock custom banking context sentences.'}
            </span>
          </div>
        </div>
      </div>

      {/* Online Lookup Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-lg font-extrabold mb-2 flex items-center gap-2 dark:text-indigo-400">
          <Search className="w-5 h-5 text-indigo-500" />
          <span>Look Up Any Word</span>
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
          Retrieve definitions, synonyms, antonyms, and custom examples instantly.
        </p>

        <form onSubmit={handleOnlineLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Type any word (e.g. Recalcitrant, Vulnerability, Fiscal)..."
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !lookupQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white text-sm font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search Word</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-start gap-2.5 text-xs font-semibold border border-rose-200/30 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Searched Results Section */}
      {searchedWords.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-2">
            <h3 className="text-lg font-extrabold flex items-center gap-2 dark:text-indigo-400">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Searched Definitions ({searchedWords.length})</span>
            </h3>
            <button
              onClick={handleClearSearches}
              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Clear searches"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchedWords.map((vocab: VocabWord, idx) => (
              <div 
                key={`${vocab.word}-${idx}`}
                className="bg-white dark:bg-slate-900 border-2 border-indigo-500/20 dark:border-indigo-500/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group animate-fade-in"
              >
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-l-2xl" />

                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 pl-2">
                    <div className="flex items-baseline gap-2.5">
                      <h4 className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{vocab.word}</h4>
                      <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
                        {vocab.partOfSpeech}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyWord(vocab.word)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg cursor-pointer transition-colors"
                      title="Copy word"
                    >
                      {copiedWord === vocab.word ? <Check className="w-4 h-4 text-green-500 animate-bounce" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-4 mt-4 text-xs pl-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Meaning & Definition:</span>
                      <p className="text-slate-800 dark:text-white font-semibold leading-relaxed mt-1 text-sm">{vocab.meaning}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-500 block tracking-wider mb-1">Synonyms:</span>
                        <div className="flex flex-wrap gap-1">
                          {vocab.synonyms.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-white rounded-md font-semibold text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-500 block tracking-wider mb-1">Antonyms:</span>
                        <div className="flex flex-wrap gap-1">
                          {vocab.antonyms.map(a => (
                            <span key={a} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-white rounded-md font-semibold text-[10px]">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Standard Example:</span>
                      <p className="text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed mt-1">
                        "{vocab.example}"
                      </p>
                    </div>

                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/10">
                      <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Exam Context Usage:</span>
                      </span>
                      <p className="text-slate-800 dark:text-white font-bold leading-relaxed mt-1 italic">
                        "{vocab.bankingContextUsage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-2">
          <div>
            <h3 className="text-lg font-extrabold flex items-center gap-2 dark:text-indigo-400">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Recommended Daily Words</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Master these core banking exam terms.
            </p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter daily words..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {localFiltered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-sm font-semibold">No daily words match your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localFiltered.map((vocab: VocabWord) => (
              <div 
                key={vocab.word}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{vocab.word}</h3>
                      <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
                        {vocab.partOfSpeech}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyWord(vocab.word)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                      title="Copy word"
                    >
                      {copiedWord === vocab.word ? <Check className="w-3.5 h-3.5 text-green-500 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="space-y-4 mt-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Definition:</span>
                      <p className="text-slate-800 dark:text-white font-semibold leading-relaxed mt-1 text-sm">{vocab.meaning}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-500 block tracking-wider mb-1">Synonyms:</span>
                        <div className="flex flex-wrap gap-1">
                          {vocab.synonyms.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-md font-semibold text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-500 block tracking-wider mb-1">Antonyms:</span>
                        <div className="flex flex-wrap gap-1">
                          {vocab.antonyms.slice(0, 3).map(a => (
                            <span key={a} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-md font-semibold text-[10px]">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50/30 dark:bg-indigo-950/10 p-3 rounded-xl border border-indigo-500/10 mt-3">
                      <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Exam Context Usage:</span>
                      </span>
                      <p className="text-slate-800 dark:text-white font-bold leading-relaxed mt-1 italic">
                        "{vocab.bankingContextUsage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
