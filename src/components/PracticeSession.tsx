import React, { useState, useEffect, useRef } from 'react';
import type { Topic } from '../data/topics';
import { useApp } from '../context/AppContext';
import { evaluateWithGemini, generateAIHints } from '../services/geminiService';
import type { EvaluationResultData } from '../services/geminiService';
import { writingTemplates } from '../data/writingTemplates';
import { 
  Timer, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  FileText, 
  ArrowLeft, 
  Copy, 
  Printer, 
  Download, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

interface PracticeSessionProps {
  topic: Topic;
  onFinishEvaluation: (result: EvaluationResultData, userText: string, timeSpent: number) => void;
  onBackToDashboard: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({ topic, onFinishEvaluation, onBackToDashboard }) => {
  const { settings } = useApp();
  
  // States
  const [text, setText] = useState(() => {
    // Try to load auto-saved draft
    const saved = localStorage.getItem(`descriptive_ace_draft_${topic.id}`);
    return saved || '';
  });
  
  const [timeRemaining, setTimeRemaining] = useState(topic.timeLimit * 60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  
  // Drawers
  const [activeSidebarTab, setActiveSidebarTab] = useState<'none' | 'hints' | 'template'>('none');
  
  // Evaluation loading
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgressMsg, setEvalProgressMsg] = useState('');
  
  // Custom hints state from AI (if triggered)
  const [aiHints, setAiHints] = useState<{ hints: string[]; facts: string[]; keywords: string[] } | null>(null);
  const [isLoadingHints, setIsLoadingHints] = useState(false);

  const secondsSpent = useRef(0);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem(`descriptive_ace_draft_${topic.id}`, text);
  }, [text, topic.id]);

  // Countdown timer logic (leak-proof single-interval approach)
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          handleSubmit(true); // Auto submit when timer runs out
          return 0;
        }
        secondsSpent.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Calculations
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Fetch AI Hints client side
  const handleFetchAIHints = async () => {
    if (settings.apiKey) {
      setIsLoadingHints(true);
      try {
        const res = await generateAIHints(settings.apiKey, topic.title, topic.description);
        setAiHints(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingHints(false);
      }
    }
  };

  // Submit and evaluate
  const handleSubmit = async (_isTimeUp = false) => {
    if (!text.trim() || isEvaluating) return;
    
    setIsEvaluating(true);
    setEvalProgressMsg(settings.apiKey ? 'Connecting to Gemini AI for strict evaluation...' : 'Running offline rule-based scoring module...');
    
    try {
      const evaluationResult = await evaluateWithGemini(
        settings.apiKey, 
        text, 
        topic, 
        settings.customModel
      );
      
      // Remove the draft after successful evaluation submission
      localStorage.removeItem(`descriptive_ace_draft_${topic.id}`);
      
      onFinishEvaluation(evaluationResult, text, secondsSpent.current);
    } catch (e) {
      console.error(e);
      alert("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Utilities
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Answer draft copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `DescriptiveAce - Practice Draft\nTopic: ${topic.title}\nCategory: ${topic.category}\nDate: ${new Date().toLocaleDateString()}\n\n---\n\n${text}`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Select corresponding templates for sidebar reference
  const currentTemplate = writingTemplates.find(t => 
    topic.category === t.category || 
    (topic.category === 'pyq' && t.category === 'essay')
  );

  return (
    <div className={`space-y-6 ${isDistractionFree ? 'fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 p-6 md:p-12 overflow-y-auto space-y-8' : ''}`}>
      
      {/* Editor Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToDashboard}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-full">
              {topic.category.replace('_', ' ')}
            </span>
            <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 max-w-xl truncate">
              {topic.title}
            </h2>
          </div>
        </div>

        {/* Timer Panel */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 px-4 py-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <Timer className={`w-4 h-4 ${timeRemaining < 120 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
            <span className={`font-mono text-lg font-bold ${timeRemaining < 120 ? 'text-rose-600 animate-pulse-ring' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <button 
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-md cursor-pointer transition-colors"
          >
            {isTimerActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Topic Context Details / Sidebar */}
        <div className={`lg:col-span-1 space-y-6 ${isDistractionFree && activeSidebarTab === 'none' ? 'hidden' : ''}`}>
          
          {/* Question / Description Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Exam Instruction</h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1 leading-relaxed">
                {topic.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              {topic.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 font-semibold px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-slate-700/30">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Drawer Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSidebarTab(activeSidebarTab === 'hints' ? 'none' : 'hints')}
              className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSidebarTab === 'hints' 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Need writing hints?
            </button>
            <button
              onClick={() => setActiveSidebarTab(activeSidebarTab === 'template' ? 'none' : 'template')}
              className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSidebarTab === 'template'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" /> View Layout Template
            </button>
          </div>

          {/* Dynamic Sidebar content container */}
          {activeSidebarTab === 'hints' && (
            <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-900/60 dark:to-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/30 p-5 rounded-2xl space-y-4 animate-slide-down">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Writing Hints & Facts
                </h4>
                {settings.apiKey && !aiHints && (
                  <button 
                    onClick={handleFetchAIHints}
                    disabled={isLoadingHints}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border shadow-xs hover:bg-slate-50 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isLoadingHints ? 'animate-spin' : ''}`} /> Generate AI Hints
                  </button>
                )}
              </div>

              {/* Render hints */}
              <div className="space-y-4 text-left">
                {/* Key Points */}
                <div>
                  <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Key Points</h5>
                  <ul className="list-disc list-outside pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1 mt-1">
                    {(aiHints?.hints || topic.hints || []).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Facts & Data */}
                {((aiHints?.facts || topic.facts || []).length > 0) && (
                  <div>
                    <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Facts & Figure Data</h5>
                    <ul className="list-disc list-outside pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1 mt-1">
                      {(aiHints?.facts || topic.facts || []).map((f, i) => (
                        <li key={i} className="italic">{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {((aiHints?.keywords || topic.keywords || []).length > 0) && (
                  <div>
                    <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Recommended Vocabulary</h5>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(aiHints?.keywords || topic.keywords || []).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSidebarTab === 'template' && currentTemplate && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-4 animate-slide-down max-h-[450px] overflow-y-auto">
              <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" /> Structure: {currentTemplate.title}
              </h4>
              
              <div className="space-y-4 text-left">
                {currentTemplate.structure.map((sect, idx) => (
                  <div key={idx} className="border-l-2 border-slate-200 dark:border-slate-800 pl-3 py-0.5 space-y-1">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">{sect.sectionName}</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">{sect.description}</p>
                    {sect.sampleText && (
                      <pre className="text-[10px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded-md font-sans text-slate-600 dark:text-slate-300 whitespace-pre-wrap mt-1 select-all cursor-pointer hover:bg-slate-100">
                        {sect.sampleText}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side / Centered: Main Input Editor */}
        <div className={`lg:col-span-2 space-y-4 ${isDistractionFree && activeSidebarTab !== 'none' ? 'lg:col-span-2' : isDistractionFree ? 'lg:col-span-3 w-full max-w-4xl mx-auto' : ''}`}>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <button 
                onClick={() => setIsDistractionFree(!isDistractionFree)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {isDistractionFree ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {isDistractionFree ? 'Exit Distraction Free' : 'Distraction-Free Mode'}
              </button>
              
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg text-slate-600 dark:text-slate-300 font-semibold select-none">
                <span className="text-[10px]">Font:</span>
                <button onClick={() => setFontSize('sm')} className={`px-1 rounded-sm ${fontSize === 'sm' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950' : ''}`}>A-</button>
                <button onClick={() => setFontSize('base')} className={`px-1 rounded-sm ${fontSize === 'base' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950' : ''}`}>A</button>
                <button onClick={() => setFontSize('lg')} className={`px-1 rounded-sm ${fontSize === 'lg' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950' : ''}`}>A+</button>
              </div>
            </div>

            {/* Utility exports */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handleCopy} 
                title="Copy text draft"
                className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 rounded-lg cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handlePrint} 
                title="Print answer page"
                className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 rounded-lg cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleDownload} 
                title="Download draft as .txt"
                className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 rounded-lg cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Textarea Interface */}
          <div className="relative">
            <textarea
              required
              rows={16}
              disabled={isEvaluating}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your exam response here... Ensure you follow the layout rules. Submitting will launch the evaluation coach."
              className={`w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl shadow-sm outline-none resize-none tracking-normal font-sans leading-relaxed text-slate-800 dark:text-white transition-all ${
                fontSize === 'sm' ? 'text-sm' :
                fontSize === 'base' ? 'text-base' :
                fontSize === 'lg' ? 'text-lg' : 'text-xl'
              }`}
              style={{ minHeight: '400px' }}
            />
            {text.length === 0 && (
              <div className="absolute top-24 left-6 right-6 text-slate-400 pointer-events-none select-none text-sm space-y-2 border-l border-slate-200 pl-4 py-1">
                <p className="font-semibold flex items-center gap-1 text-slate-500"><Info className="w-4 h-4" /> Tip for Banking Exams:</p>
                <p>Do NOT use keyboard shortcuts (Ctrl+C, Ctrl+V) if you want to replicate real exam pressure. Type everything manually.</p>
              </div>
            )}
          </div>

          {/* Word counts, character progress bar, and Submit Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            
            {/* Word details */}
            <div className="space-y-1 flex-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Word Count: <strong className="text-slate-800 dark:text-slate-200">{wordCount}</strong> / {topic.wordLimit}</span>
                <span>{Math.round((wordCount / topic.wordLimit) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    wordCount > topic.wordLimit * 1.1 ? 'bg-rose-500' :
                    wordCount >= topic.wordLimit * 0.9 ? 'bg-green-500' :
                    'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, (wordCount / topic.wordLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Character count: {charCount} | Ideal range: {Math.round(topic.wordLimit * 0.9)} - {Math.round(topic.wordLimit * 1.1)} words.
              </p>
            </div>

            {/* Submit operations */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubmit(false)}
                disabled={wordCount === 0 || isEvaluating}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Evaluate My Answer
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading overlay panel */}
          {isEvaluating && (
            <div className="bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-300">{evalProgressMsg}</p>
              <p className="text-xs text-slate-400">This checks grammar patterns, highlights suggestions, checks templates and matches synonym lists.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
