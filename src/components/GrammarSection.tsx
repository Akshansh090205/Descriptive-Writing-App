import React, { useState, useEffect } from 'react';
import { practiceSets } from '../data/grammarExercises';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Info, 
  ArrowLeft, 
  ChevronRight, 
  Check
} from 'lucide-react';

export const GrammarSection: React.FC = () => {
  // Load progress from localStorage
  const [completedSets, setCompletedSets] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('descriptive_ace_completed_grammar_sets');
    return saved ? JSON.parse(saved) : {};
  });

  // States
  const [activeSetId, setActiveSetId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync progress to localStorage
  useEffect(() => {
    localStorage.setItem('descriptive_ace_completed_grammar_sets', JSON.stringify(completedSets));
  }, [completedSets]);

  // Find active set details
  const activeSet = practiceSets.find(s => s.id === activeSetId);

  const handleSelectOption = (qId: string, opt: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitSet = () => {
    if (!activeSet || isSubmitted) return;

    // Calculate score
    let tempScore = 0;
    activeSet.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        tempScore++;
      }
    });

    // Save score in completed sets
    setCompletedSets(prev => ({
      ...prev,
      [activeSet.id]: tempScore
    }));

    setIsSubmitted(true);
    // Scroll to top of review sheet
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSet = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleBackToList = () => {
    setActiveSetId(null);
    setAnswers({});
    setIsSubmitted(false);
  };

  // Filter sets based on search query
  const filteredSets = practiceSets.filter(set => 
    set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `Set ${set.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalSets = practiceSets.length;
  const completedCount = Object.keys(completedSets).length;
  const averageScore = completedCount > 0
    ? Math.round(Object.values(completedSets).reduce((a, b) => a + b, 0) / completedCount)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
      
      {/* 1. SELECTION SCREEN: Show all 100 practice sets */}
      {activeSetId === null ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Grammar Correction Practice</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Solve 100 exam-level practice sets (3,000 questions) modeled after IBPS PO & SO Prelims English section</p>
            </div>

            {/* Overall Stats box */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 border px-4 py-2 rounded-2xl shadow-xs">
              <Award className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sets Solved: <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong> / {totalSets}
              </span>
              {completedCount > 0 && (
                <span className="text-xs font-bold text-slate-400 border-l pl-3">
                  Avg Score: <strong className="text-indigo-600 dark:text-indigo-400">{averageScore} / 30</strong>
                </span>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
            <input
              type="text"
              placeholder="Search or enter set number (e.g. Set 5)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder-slate-400 font-medium pl-2"
            />
          </div>

          {/* Grid of Sets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSets.map(set => {
              const previousScore = completedSets[set.id];
              const isDone = previousScore !== undefined;
              const accuracy = isDone ? Math.round((previousScore / 30) * 100) : 0;

              return (
                <div 
                  key={set.id}
                  onClick={() => {
                    setActiveSetId(set.id);
                    setIsSubmitted(false);
                  }}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between ${
                    isDone 
                      ? 'border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5'
                      : 'border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Paper Set {set.id}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-100/30">
                          <Check className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-snug">
                      {set.name}
                    </h3>
                    
                    <p className="text-[11px] text-slate-400 font-semibold">
                      Contains 30 Questions (30 Marks total)
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between">
                    {isDone ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Score: {previousScore} / 30 ({accuracy}%)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Not attempted
                      </span>
                    )}
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Start Set <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        /* 2. ACTIVE TEST WORKSPACE SCREEN */
        activeSet && (
          <div className="space-y-6">
            
            {/* Top info and action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full border border-emerald-500/10">
                    {activeSet.name}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                    IBPS Grammar Drill Paper
                  </h2>
                </div>
              </div>

              {/* Status or Score widget */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 px-4 py-2 rounded-2xl shadow-xs">
                <Award className="w-5 h-5 text-emerald-500" />
                {isSubmitted ? (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Final Score: {completedSets[activeSet.id]} / 30
                  </span>
                ) : (
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Progress: {Object.keys(answers).length} / 30 Solved
                  </span>
                )}
              </div>
            </div>

            {/* Rules guidelines info block */}
            {!isSubmitted && (
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/30 p-5 rounded-3xl space-y-3">
                <h3 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" /> Mock Paper Instructions
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                  <li>This set contains exactly **30 questions** modeled after Prelims structure.</li>
                  <li>Questions 1–10: **Error Spotting** (Locate grammatical mismatch segments).</li>
                  <li>Questions 11–20: **Fill in the Blanks** (Select ideal grammar preposition or tense).</li>
                  <li>Questions 21–30: **Sentence Correction** (Choose grammatically polished substitute).</li>
                  <li>Tap the options to mark your response, then click **Submit Exam Paper** at the bottom to get scores and explanations.</li>
                </ul>
              </div>
            )}

            {/* Questions review layout */}
            <div className="space-y-6">
              {activeSet.questions.map((q, index) => {
                const selectedAnswer = answers[q.id];
                const isCorrect = selectedAnswer === q.correctAnswer;

                return (
                  <div 
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
                        Question {index + 1} • {q.category.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">{q.type.replace('_', ' ')}</span>
                    </div>

                    {/* Question sentence */}
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                      {q.sentence}
                    </p>

                    {/* Choice selections */}
                    {q.options ? (
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map(opt => {
                          const isSelected = selectedAnswer === opt;
                          let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-800 dark:text-white';
                          
                          if (isSelected) {
                            optStyle = 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:border-indigo-500 dark:text-indigo-300';
                          }
                          if (isSubmitted) {
                            if (opt === q.correctAnswer) {
                              optStyle = 'border-green-600 bg-green-50/30 text-green-700 dark:border-green-500 dark:text-green-400 font-semibold';
                            } else if (isSelected) {
                              optStyle = 'border-rose-600 bg-rose-50/30 text-rose-700 dark:border-rose-500 dark:text-rose-400';
                            } else {
                              optStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`text-left px-4 py-3 rounded-xl border text-xs cursor-pointer transition-all ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Error spotting direct inputs */
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D'].map(opt => {
                          const isSelected = selectedAnswer === opt;
                          let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-800 dark:text-white';
                          
                          if (isSelected) {
                            optStyle = 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:border-indigo-500 dark:text-indigo-300';
                          }
                          if (isSubmitted) {
                            if (opt === q.correctAnswer) {
                              optStyle = 'border-green-600 bg-green-50/30 text-green-700 dark:border-green-500 dark:text-green-400 font-semibold';
                            } else if (isSelected) {
                              optStyle = 'border-rose-600 bg-rose-50/30 text-rose-700 dark:border-rose-500 dark:text-rose-400';
                            } else {
                              optStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`w-12 h-12 flex items-center justify-center rounded-xl border text-sm font-bold cursor-pointer transition-all ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanations shown only after submitting the full set */}
                    {isSubmitted && (
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 animate-slide-down">
                        <div className="flex items-center gap-1.5 text-xs">
                          {isCorrect ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> Correct (+1 Mark)
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                              <XCircle className="w-4 h-4" /> Incorrect (Correct: {q.correctAnswer})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-white flex items-start gap-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                          <Info className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                          <span><strong>Rule Explanation:</strong> {q.explanation}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Floating submission footer */}
            <div className="flex gap-4 border-t pt-6">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitSet}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-colors text-center uppercase tracking-wider text-xs"
                >
                  Submit Practice Set Paper
                </button>
              ) : (
                <>
                  <button
                    onClick={handleResetSet}
                    className="flex-1 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-center text-xs uppercase"
                  >
                    Reset & Retake Drill
                  </button>
                  <button
                    onClick={handleBackToList}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-colors text-center text-xs uppercase"
                  >
                    Back to Practice Sets
                  </button>
                </>
              )}
            </div>

          </div>
        )
      )}

    </div>
  );
};
