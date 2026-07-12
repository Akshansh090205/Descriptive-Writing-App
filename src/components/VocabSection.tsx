import React, { useState } from 'react';
import { dailyVocabulary } from '../data/dailyVocabulary';
import type { VocabWord } from '../data/dailyVocabulary';
import { Search, Copy, Check } from 'lucide-react';

export const VocabSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const filtered = dailyVocabulary.filter(v => 
    v.word.toLowerCase().includes(search.toLowerCase()) ||
    v.meaning.toLowerCase().includes(search.toLowerCase()) ||
    v.synonyms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Vocabulary Builder</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Master high-scoring words customized for banking descriptive exams</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search words or meanings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((vocab: VocabWord) => (
          <div 
            key={vocab.word}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{vocab.word}</h3>
                  <span className="text-xs italic text-indigo-500 font-semibold">{vocab.partOfSpeech}</span>
                </div>
                <button
                  onClick={() => handleCopyWord(vocab.word)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                  title="Copy word"
                >
                  {copiedWord === vocab.word ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="space-y-3 mt-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Definition:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-0.5">{vocab.meaning}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Synonyms:</span>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{vocab.synonyms.slice(0, 3).join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Antonyms:</span>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{vocab.antonyms.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block">Exam Context Usage:</span>
                  <p className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed mt-0.5">
                    "{vocab.bankingContextUsage}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
