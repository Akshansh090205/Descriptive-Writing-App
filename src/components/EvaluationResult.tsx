import React, { useState, useEffect } from 'react';
import type { EvaluationResultData, InlineHighlight } from '../services/geminiService';
import { rewriteText } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  ThumbsUp, 
  TrendingUp
} from 'lucide-react';

interface EvaluationResultProps {
  evaluation: EvaluationResultData;
  initialUserText: string;
  topicTitle: string;
  topicCategory: string;
  topicDescription: string;
  timeSpentSeconds: number;
  onBackToDashboard: () => void;
  isHistoryView?: boolean;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  evaluation,
  initialUserText,
  topicTitle,
  topicCategory,
  topicDescription: _topicDescription,
  timeSpentSeconds,
  onBackToDashboard,
  isHistoryView = false
}) => {
  const { settings, saveSession } = useApp();

  const isEssay = topicCategory === 'essay' || (evaluation.wordCount && evaluation.wordCount.required > 200);
  const maxScore = isEssay ? 15 : 10;
  
  // Dynamic scaling checker for old 100-point attempts stored in local storage
  const isOldScore = (
    evaluation.scores.grammar + 
    (evaluation.scores.vocabulary || 0) + 
    (evaluation.scores.sentenceStructure || 0) + 
    evaluation.scores.organization + 
    evaluation.scores.contentRelevance + 
    evaluation.scores.presentation
  ) > 25;

  const overallScoreScaled = evaluation.overallScore > 15
    ? Math.round(((evaluation.overallScore / 100) * maxScore) * 10) / 10
    : evaluation.overallScore;

  const getScaledParamScore = (paramName: 'grammar' | 'vocabulary' | 'sentenceStructure' | 'organization' | 'contentRelevance' | 'presentation', max: number, oldMax: number) => {
    const raw = evaluation.scores[paramName] || 0;
    if (isOldScore) {
      return Math.round(((raw / oldMax) * max) * 10) / 10;
    }
    return raw;
  };
  
  // States
  const [userText, setUserText] = useState(initialUserText);
  const [highlights, setHighlights] = useState<InlineHighlight[]>([]);
  const [, setActiveHighlight] = useState<InlineHighlight | null>(null);
  
  const [activeTab, setActiveTab] = useState<'feedback' | 'highlight' | 'compare' | 'model'>('feedback');
  
  // Rewrite engine states
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [isRewriting, setIsRewriting] = useState(false);

  // Initializing highlights
  useEffect(() => {
    if (evaluation.highlights) {
      setHighlights(evaluation.highlights);
    }
  }, [evaluation]);

  // Save session to history only if it's a new evaluation, not viewing past items
  useEffect(() => {
    if (!isHistoryView) {
      saveSession({
        topicId: `topic-${Date.now()}`,
        topicTitle,
        category: topicCategory as any,
        userText: initialUserText,
        wordLimit: evaluation.wordCount.required,
        timeSpentSeconds,
        evaluation
      });
    }
  }, []);

  // Grammarly click-to-correct logic
  const handleApplyCorrection = (hl: InlineHighlight) => {
    if (!hl.correction) return;
    const start = hl.startIndex || 0;
    const end = hl.endIndex || 0;
    
    const newText = userText.substring(0, start) + hl.correction + userText.substring(end);
    setUserText(newText);

    // Shift all subsequent highlight offsets
    const diff = hl.correction.length - (end - start);
    const updated = highlights
      .filter(h => h.startIndex !== hl.startIndex)
      .map(h => {
        if ((h.startIndex || 0) > start) {
          return {
            ...h,
            startIndex: (h.startIndex || 0) + diff,
            endIndex: (h.endIndex || 0) + diff
          };
        }
        return h;
      });

    setHighlights(updated);
    setActiveHighlight(null);
  };

  const handleApplyAlternative = (hl: InlineHighlight, alternative: string) => {
    const start = hl.startIndex || 0;
    const end = hl.endIndex || 0;
    
    const newText = userText.substring(0, start) + alternative + userText.substring(end);
    setUserText(newText);

    const diff = alternative.length - (end - start);
    const updated = highlights
      .filter(h => h.startIndex !== hl.startIndex)
      .map(h => {
        if ((h.startIndex || 0) > start) {
          return {
            ...h,
            startIndex: (h.startIndex || 0) + diff,
            endIndex: (h.endIndex || 0) + diff
          };
        }
        return h;
      });

    setHighlights(updated);
    setActiveHighlight(null);
  };

  // Run AI rewrite module
  const handleTriggerRewrite = async (action: 'professional' | 'vocabulary' | 'reduce' | 'expand' | 'tone') => {
    setIsRewriting(true);
    try {
      const result = await rewriteText(settings.apiKey, userText, action);
      setRewrittenText(result);
    } catch (e) {
      console.error(e);
      setRewrittenText("AI rewrite failed. Please check connectivity.");
    } finally {
      setIsRewriting(false);
    }
  };

  // Copy drafts
  const handleCopyText = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    alert(`${label} copied to clipboard!`);
  };

  // Format time helper
  const formatSpentTime = (secs: number) => {
    if (secs < 60) return `${secs} seconds`;
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}m ${remaining}s`;
  };

  // Custom Inline Highlight rendering
  const renderHighlights = () => {
    if (highlights.length === 0) {
      return <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{userText}</p>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights.forEach((hl, idx) => {
      const start = hl.startIndex || 0;
      const end = hl.endIndex || 0;

      if (start > lastIndex) {
        elements.push(
          <span key={`txt-${lastIndex}`} className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
            {userText.substring(lastIndex, start)}
          </span>
        );
      }

      const colorStyle = hl.type === 'error'
        ? 'bg-rose-100 border-b-2 border-rose-500 hover:bg-rose-200 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-400'
        : 'bg-amber-100 border-b-2 border-amber-500 hover:bg-amber-200 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-400';

      elements.push(
        <span
          key={`hl-${idx}`}
          onClick={() => setActiveHighlight(hl)}
          className={`relative inline px-1 py-0.5 rounded-xs transition-colors cursor-pointer group/item font-semibold select-none ${colorStyle}`}
        >
          {userText.substring(start, end)}

          {/* Inline Tooltip */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-4 rounded-xl shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all z-40 pointer-events-auto font-sans font-normal text-xs leading-normal">
            <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-400 dark:text-indigo-600 mb-1">
              {hl.type === 'error' ? 'Grammar Correction' : 'Vocabulary Suggestion'}
            </span>
            <p className="italic text-slate-300 dark:text-slate-600 font-semibold mb-1.5">"{userText.substring(start, end)}"</p>
            
            {hl.correction && (
              <div className="mb-2">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Correction suggestion (Click to apply):</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyCorrection(hl);
                  }}
                  className="mt-0.5 inline-block text-left px-2 py-1 bg-green-500 hover:bg-green-600 text-white dark:text-white font-extrabold rounded-md text-xs cursor-pointer shadow-xs"
                >
                  Apply: {hl.correction}
                </button>
              </div>
            )}

            <p className="border-t border-slate-800 dark:border-slate-100 pt-1.5 text-slate-200 dark:text-slate-700">
              {hl.explanation}
            </p>

            {hl.suggestions && hl.suggestions.length > 0 && (
              <div className="mt-2 border-t border-slate-800 dark:border-slate-100 pt-1.5">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] mb-1">Alternative vocabulary:</span>
                <div className="flex flex-wrap gap-1">
                  {hl.suggestions.map((s, si) => (
                    <button
                      key={si}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyAlternative(hl, s);
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 text-[10px] font-bold rounded cursor-pointer border border-slate-700 dark:border-slate-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </span>
        </span>
      );

      lastIndex = end;
    });

    if (lastIndex < userText.length) {
      elements.push(
        <span key="txt-end" className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
          {userText.substring(lastIndex)}
        </span>
      );
    }

    return <div className="leading-relaxed whitespace-pre-wrap">{elements}</div>;
  };

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:text-black">
      
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-full">
              Evaluation Analysis
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {topicTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* Main evaluation score dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Score Ring Widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Score</h3>
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - overallScoreScaled / maxScore)}
                className={`transition-all duration-1000 ${
                  (overallScoreScaled / maxScore) >= 0.8 ? 'text-green-500' :
                  (overallScoreScaled / maxScore) >= 0.6 ? 'text-amber-500' :
                  'text-rose-500'
                }`}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-100">
                {overallScoreScaled}
              </span>
              <span className="text-slate-400 block text-xs">out of {maxScore}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold">{evaluation.estimatedIBPSEvaluation}</p>
            <p className="text-xs text-slate-400">
              Probability of full marks: <strong>{evaluation.probabilityOfFullMarks}</strong>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Time Spent: {formatSpentTime(timeSpentSeconds)}
            </p>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Scoring Parameters Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isEssay ? (
              // Essay Parameters
              [
                { label: 'Content & Topical Relevance', score: getScaledParamScore('contentRelevance', 6, 20), max: 6 },
                { label: 'Grammar, Spelling & Punctuation', score: getScaledParamScore('grammar', 4, 20), max: 4 },
                { label: 'Structure & Paragraphing', score: getScaledParamScore('organization', 3, 20), max: 3 },
                { label: 'Word Count Compliance', score: getScaledParamScore('presentation', 2, 10), max: 2 }
              ].map((param, idx) => (
                <div key={idx} className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span className="truncate max-w-[170px]">{param.label}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{param.score}/{param.max}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                      style={{ width: `${(param.score / param.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              // Letter Parameters
              [
                { label: 'Format & Layout', score: getScaledParamScore('organization', 3, 20), max: 3 },
                { label: 'Content & Communication', score: getScaledParamScore('contentRelevance', 3, 20), max: 3 },
                { label: 'Grammar & Vocabulary', score: getScaledParamScore('grammar', 2, 20), max: 2 },
                { label: 'Word Count & Rules (Anonymity)', score: getScaledParamScore('presentation', 2, 10), max: 2 }
              ].map((param, idx) => (
                <div key={idx} className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span className="truncate max-w-[170px]">{param.label}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{param.score}/{param.max}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                      style={{ width: `${(param.score / param.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-400">
            <span>Readability Metric: <strong className="text-slate-800 dark:text-slate-200">{evaluation.readability}</strong></span>
            <span>Word count: <strong className="text-slate-800 dark:text-slate-200">{evaluation.wordCount.current}</strong> / {evaluation.wordCount.required} words</span>
          </div>
        </div>

      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 no-print">
        {[
          { id: 'feedback', label: 'Detailed Feedback', icon: ThumbsUp },
          { id: 'highlight', label: 'Mistake Highlighter', icon: AlertTriangle },
          { id: 'compare', label: 'Compare Mode', icon: BookOpen },
          { id: 'model', label: 'Model Answer', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-6">
        
        {/* TAB 1: Detailed Feedback */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths & Weaknesses */}
            <div className="space-y-6">
              <div className="bg-green-50/50 dark:bg-emerald-950/15 border border-green-200/50 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3 text-left">
                <h3 className="font-extrabold text-sm text-green-700 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Strong Aspects
                </h3>
                <ul className="list-disc list-outside pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/50 dark:bg-rose-950/15 border border-rose-200/50 dark:border-rose-900/30 p-5 rounded-2xl space-y-3 text-left">
                <h3 className="font-extrabold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                </h3>
                <ul className="list-disc list-outside pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  {evaluation.weaknesses.map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvement tips */}
            <div className="bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100/50 dark:border-slate-800 p-5 rounded-2xl space-y-4 text-left">
              <h3 className="font-extrabold text-sm text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> 5 Key Improvement Tips
              </h3>
              
              <div className="space-y-3">
                {evaluation.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full mt-0.5 shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">{tip}</p>
                  </div>
                ))}
              </div>

              {evaluation.betterConclusion && (
                <div className="border-t border-indigo-100/60 dark:border-slate-800 pt-4 mt-4">
                  <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wide mb-1">Recommended Closing Wrap:</h4>
                  <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-indigo-50">
                    "{evaluation.betterConclusion}"
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Mistake Highlighter & Rewrite Console */}
        {activeTab === 'highlight' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Highlighter panel */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border">
                <span className="font-medium">Interact with highlighted items to apply fixes</span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500"></span> Grammar
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span> Vocab/Sentence
                </span>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner min-h-[300px]">
                {renderHighlights()}
              </div>
            </div>

            {/* Rewrite Panel Console */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> AI Rewrite Console
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Optimize your text using specific target operations. Stored in local sandbox.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { action: 'professional', label: 'Make Professional' },
                  { action: 'vocabulary', label: 'Increase Vocabulary' },
                  { action: 'reduce', label: 'Reduce Word Count' },
                  { action: 'expand', label: 'Expand Answer' },
                  { action: 'tone', label: 'Formal Tone' }
                ].map(item => (
                  <button
                    key={item.action}
                    onClick={() => handleTriggerRewrite(item.action as any)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 hover:text-indigo-600 border rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {isRewriting ? (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-dashed text-center py-6 space-y-2">
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Rewriting answer...</p>
                </div>
              ) : rewrittenText ? (
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-indigo-100/50 space-y-2 relative group">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">AI Rewritten Draft</span>
                    <button 
                      onClick={() => handleCopyText(rewrittenText, 'AI rewrite')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 rounded cursor-pointer"
                      title="Copy rewrite"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap select-all max-h-48 overflow-y-auto">
                    {rewrittenText}
                  </p>
                  <button
                    onClick={() => {
                      setUserText(rewrittenText);
                      setRewrittenText('');
                      // Remove highlight since content replaced completely
                      setHighlights([]);
                    }}
                    className="w-full mt-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg text-center cursor-pointer shadow-xs transition-colors"
                  >
                    Apply Rewrite to Editor
                  </button>
                </div>
              ) : null}
            </div>

          </div>
        )}

        {/* TAB 3: Compare Mode */}
        {activeTab === 'compare' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Your Practice Draft</h4>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs leading-relaxed max-h-[450px] overflow-y-auto min-h-[300px] whitespace-pre-wrap select-text">
                {userText}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Model Perfect Answer</h4>
                <button 
                  onClick={() => handleCopyText(evaluation.samplePerfectAnswer, 'Model answer')}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy Model Answer
                </button>
              </div>
              <div className="p-5 bg-gradient-to-br from-indigo-50/10 to-blue-50/10 dark:from-slate-900 dark:to-indigo-950/15 border border-indigo-100/50 dark:border-indigo-950/40 rounded-2xl text-xs leading-relaxed max-h-[450px] overflow-y-auto min-h-[300px] whitespace-pre-wrap select-text text-slate-800 dark:text-slate-200">
                {evaluation.samplePerfectAnswer}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Model Answer */}
        {activeTab === 'model' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Model Practice Response</h4>
                <p className="text-xs text-slate-400 mt-0.5">Written under constraints matching SBI PO standards.</p>
              </div>
              <button
                onClick={() => handleCopyText(evaluation.samplePerfectAnswer, 'Model answer')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg border cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Draft
              </button>
            </div>
            
            <div className="text-sm leading-relaxed whitespace-pre-wrap select-text font-sans text-slate-700 dark:text-slate-300">
              {evaluation.samplePerfectAnswer}
            </div>

            {evaluation.professionalVersion && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Professional Polish of your work:</h5>
                  <button
                    onClick={() => handleCopyText(evaluation.professionalVersion, 'Professional version')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Copy This
                  </button>
                </div>
                <p className="text-xs italic text-slate-600 dark:text-slate-400 whitespace-pre-wrap select-text bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border">
                  {evaluation.professionalVersion}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
