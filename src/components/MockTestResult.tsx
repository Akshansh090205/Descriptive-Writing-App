import React, { useState } from 'react';
import { EvaluationResult } from './EvaluationResult';
import type { EvaluationResultData } from '../services/geminiService';
import type { Topic } from '../data/topics';
import { FileText, ArrowLeft, Printer } from 'lucide-react';

interface MockTestResultProps {
  essayResult: EvaluationResultData;
  letterResult: EvaluationResultData;
  essayText: string;
  letterText: string;
  essayTopic: Topic;
  letterTopic: Topic;
  timeSpentSeconds: number;
  onBackToDashboard: () => void;
}

export const MockTestResult: React.FC<MockTestResultProps> = ({
  essayResult,
  letterResult,
  essayText,
  letterText,
  essayTopic,
  letterTopic,
  timeSpentSeconds,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'essay' | 'letter'>('essay');

  // Score aggregations in banking exam style (Out of 25 marks total)
  // Essay: 15 marks, Letter: 10 marks
  const essayScaledScore = essayResult.overallScore; // Already out of 15
  const letterScaledScore = letterResult.overallScore; // Already out of 10
  const totalMarks = Math.round((essayScaledScore + letterScaledScore) * 10) / 10;

  const totalPossible = 25;
  const totalPercentage = Math.round((totalMarks / totalPossible) * 100);

  const formatSpentTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* Back button and page title */}
      <div className="flex items-center gap-3 no-print">
        <button 
          onClick={onBackToDashboard}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold">Mock Test Evaluation Report</h2>
          <p className="text-xs text-slate-400 mt-0.5">Performance analytics for SBI/IBPS PO descriptive writing simulation.</p>
        </div>
      </div>

      {/* Combined Score Card Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Total Score Circular view */}
        <div className="flex flex-col items-center justify-center p-4 border-r border-slate-100 dark:border-slate-800/80">
          <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={301.6}
                strokeDashoffset={301.6 - (301.6 * totalPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalMarks}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">/ {totalPossible} Marks</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mt-3 uppercase tracking-wider">Exam Grade Summary</span>
        </div>

        {/* Breakdown details */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Descriptive Section Score Card</h3>
            <p className="text-[11px] text-slate-400">SBI PO Descriptive section consists of 1 Essay (15M) + 1 Letter (10M).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Essay mark detail */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-black">Essay Section</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{essayTopic.title}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{essayScaledScore}</span>
                <span className="text-[10px] text-slate-400 block font-bold">/ 15 Marks</span>
              </div>
            </div>

            {/* Letter mark detail */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-black">Letter Section</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{letterTopic.title}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{letterScaledScore}</span>
                <span className="text-[10px] text-slate-400 block font-bold">/ 10 Marks</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Total Time Invested: **{formatSpentTime(timeSpentSeconds)}**</span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 font-bold text-indigo-500 hover:underline no-print"
            >
              <Printer className="w-3.5 h-3.5" /> Print Report Card
            </button>
          </div>
        </div>

      </div>

      {/* Review Tab Selection */}
      <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-xs no-print">
        <button
          onClick={() => setActiveTab('essay')}
          className={`flex-1 py-3.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'essay'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Review Essay Section
        </button>
        <button
          onClick={() => setActiveTab('letter')}
          className={`flex-1 py-3.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'letter'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Review Letter Section
        </button>
      </div>

      {/* Nested Single Evaluation Reviews */}
      <div className="bg-transparent">
        {activeTab === 'essay' ? (
          <EvaluationResult
            evaluation={essayResult}
            initialUserText={essayText}
            timeSpentSeconds={Math.round(timeSpentSeconds * 0.6)} // Approximate time split
            topicTitle={essayTopic.title}
            topicCategory={essayTopic.category}
            topicDescription={essayTopic.description}
            isHistoryView={true}
            onBackToDashboard={onBackToDashboard}
          />
        ) : (
          <EvaluationResult
            evaluation={letterResult}
            initialUserText={letterText}
            timeSpentSeconds={Math.round(timeSpentSeconds * 0.4)} // Approximate time split
            topicTitle={letterTopic.title}
            topicCategory={letterTopic.category}
            topicDescription={letterTopic.description}
            isHistoryView={true}
            onBackToDashboard={onBackToDashboard}
          />
        )}
      </div>

    </div>
  );
};
