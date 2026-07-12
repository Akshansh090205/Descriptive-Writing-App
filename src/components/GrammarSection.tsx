import React, { useState } from 'react';
import { grammarQuestions } from '../data/grammarExercises';
import type { GrammarQuestion } from '../data/grammarExercises';
import { CheckCircle2, XCircle, RefreshCw, Award, Info } from 'lucide-react';

export const GrammarSection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  const handleSelectOption = (qId: string, opt: string) => {
    if (submitted[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitQuestion = (q: GrammarQuestion) => {
    if (submitted[q.id] || !answers[q.id]) return;

    setSubmitted(prev => ({ ...prev, [q.id]: true }));
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setSubmitted({});
    setScore(0);
  };

  const totalQuestions = grammarQuestions.length;
  const quizFinished = Object.keys(submitted).length === totalQuestions;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grammar Correction Practice</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Targeted drills for error spotting, prepositions, tenses, and agreement rules</p>
        </div>
        
        {/* Score widget */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border px-4 py-2 rounded-2xl shadow-xs">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-bold">Score: {score} / {totalQuestions}</span>
          {(quizFinished || Object.keys(submitted).length > 0) && (
            <button 
              onClick={handleResetQuiz}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Reset drill"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {grammarQuestions.map((q, index) => {
          const isSubmitted = submitted[q.id];
          const selectedAnswer = answers[q.id];
          const isCorrect = selectedAnswer === q.correctAnswer;

          return (
            <div 
              key={q.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
                  Question {index + 1} • {q.category.replace('_', ' ')}
                </span>
                <span className="text-slate-400 text-[10px] uppercase font-bold">{q.type.replace('_', ' ')}</span>
              </div>

              {/* Sentence */}
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {q.sentence}
              </p>

              {/* Input options (Multiple Choice) */}
              {q.options ? (
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map(opt => {
                    const isSelected = selectedAnswer === opt;
                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100';
                    
                    if (isSelected) {
                      optStyle = 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:border-indigo-500 dark:text-indigo-300';
                    }
                    if (isSubmitted) {
                      if (opt === q.correctAnswer) {
                        optStyle = 'border-green-600 bg-green-50/30 text-green-700 dark:border-green-500 dark:text-green-400 font-semibold';
                      } else if (isSelected) {
                        optStyle = 'border-rose-600 bg-rose-50/30 text-rose-700 dark:border-rose-500 dark:text-rose-400';
                      } else {
                        optStyle = 'border-slate-100 text-slate-400 opacity-60';
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
                /* For Error Spotting simple letters options: A, B, C, D */
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const isSelected = selectedAnswer === opt;
                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100';
                    
                    if (isSelected) {
                      optStyle = 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:border-indigo-500 dark:text-indigo-300';
                    }
                    if (isSubmitted) {
                      if (opt === q.correctAnswer) {
                        optStyle = 'border-green-600 bg-green-50/30 text-green-700 dark:border-green-500 dark:text-green-400 font-semibold';
                      } else if (isSelected) {
                        optStyle = 'border-rose-600 bg-rose-50/30 text-rose-700 dark:border-rose-500 dark:text-rose-400';
                      } else {
                        optStyle = 'border-slate-100 text-slate-400 opacity-60';
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

              {/* Submit trigger for question */}
              {!isSubmitted && (
                <button
                  disabled={!selectedAnswer}
                  onClick={() => handleSubmitQuestion(q)}
                  className="px-4 py-2 bg-slate-800 dark:bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
                >
                  Verify Answer
                </button>
              )}

              {/* Detailed Explanation Panel */}
              {isSubmitted && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 animate-slide-down">
                  <div className="flex items-center gap-1.5 text-xs">
                    {isCorrect ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                        <XCircle className="w-4 h-4" /> Incorrect Choice
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                    <Info className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                    <span><strong>Rule Explanation:</strong> {q.explanation}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
