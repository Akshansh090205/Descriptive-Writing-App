import React, { useState, useEffect, useRef } from 'react';
import type { Topic } from '../data/topics';
import { defaultTopics } from '../data/topics';
import { useApp } from '../context/AppContext';
import { evaluateWithGemini, generateAIHints } from '../services/geminiService';
import type { EvaluationResultData } from '../services/geminiService';
import { writingTemplates } from '../data/writingTemplates';
import { 
  Timer, 
  FileText, 
  ArrowLeft, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface MockTestSessionProps {
  onFinishMockTest: (
    essayResult: EvaluationResultData,
    letterResult: EvaluationResultData,
    essayText: string,
    letterText: string,
    essayTopic: Topic,
    letterTopic: Topic,
    timeSpent: number
  ) => void;
  onBackToDashboard: () => void;
}

export const MockTestSession: React.FC<MockTestSessionProps> = ({ 
  onFinishMockTest, 
  onBackToDashboard 
}) => {
  const { settings } = useApp();

  // Select random essay and letter topics upon mount
  const [essayTopic] = useState<Topic>(() => {
    const essays = defaultTopics.filter(t => t.category === 'essay' || (t.category === 'pyq' && t.wordLimit === 250));
    return essays[Math.floor(Math.random() * essays.length)];
  });

  const [letterTopic] = useState<Topic>(() => {
    const letters = defaultTopics.filter(t => t.category === 'formal_letter' || t.category === 'informal_letter' || (t.category === 'pyq' && t.wordLimit === 150));
    return letters[Math.floor(Math.random() * letters.length)];
  });

  // Editor states
  const [essayText, setEssayText] = useState('');
  const [letterText, setLetterText] = useState('');
  const [activeTab, setActiveTab] = useState<'essay' | 'letter'>('essay');

  // Timer: 30 minutes total for both questions
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 1800 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const secondsSpent = useRef(0);

  // Layout sidebar states
  const [showLayoutHelper, setShowLayoutHelper] = useState(false);
  const [showAIHints, setShowAIHints] = useState(false);
  const [aiHintsData, setAiHintsData] = useState<{
    essay: { hints: string[]; facts: string[]; keywords: string[] } | null;
    letter: { hints: string[]; facts: string[]; keywords: string[] } | null;
  }>({ essay: null, letter: null });
  const [isLoadingHints, setIsLoadingHints] = useState(false);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgressMsg, setEvalProgressMsg] = useState('');

  // Auto-save drafts
  useEffect(() => {
    const savedEssay = localStorage.getItem(`descriptive_ace_mock_essay_${essayTopic.id}`);
    const savedLetter = localStorage.getItem(`descriptive_ace_mock_letter_${letterTopic.id}`);
    if (savedEssay) setEssayText(savedEssay);
    if (savedLetter) setLetterText(savedLetter);
  }, [essayTopic.id, letterTopic.id]);

  useEffect(() => {
    localStorage.setItem(`descriptive_ace_mock_essay_${essayTopic.id}`, essayText);
  }, [essayText, essayTopic.id]);

  useEffect(() => {
    localStorage.setItem(`descriptive_ace_mock_letter_${letterTopic.id}`, letterText);
  }, [letterText, letterTopic.id]);

  // Leak-proof timer countdown
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          handleAutoSubmit();
          return 0;
        }
        secondsSpent.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  // Trigger AI hints load for current tab
  const handleLoadAIHints = async () => {
    const currentTopic = activeTab === 'essay' ? essayTopic : letterTopic;
    if (aiHintsData[activeTab] || isLoadingHints) return;

    setIsLoadingHints(true);
    try {
      const data = await generateAIHints(settings.apiKey, currentTopic.title, currentTopic.description);
      setAiHintsData(prev => ({
        ...prev,
        [activeTab]: data
      }));
      setShowAIHints(true);
    } catch (e) {
      console.error("Failed loading hints", e);
    } finally {
      setIsLoadingHints(false);
    }
  };

  // Submit and evaluate BOTH sections
  const handleSubmit = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    const apiKey = settings.apiKey;
    const isOffline = !apiKey || apiKey.trim() === '';

    try {
      // 1. Evaluate Essay
      setEvalProgressMsg(isOffline 
        ? 'Running offline analysis for Essay prompt...' 
        : 'Connecting to Gemini AI for Essay evaluation...'
      );
      const essayResult = await evaluateWithGemini(
        apiKey,
        essayText,
        {
          title: essayTopic.title,
          category: essayTopic.category,
          description: essayTopic.description,
          wordLimit: essayTopic.wordLimit
        },
        settings.customModel
      );

      // 2. Evaluate Letter
      setEvalProgressMsg(isOffline 
        ? 'Running offline analysis for Letter prompt...' 
        : 'Connecting to Gemini AI for Letter evaluation...'
      );
      const letterResult = await evaluateWithGemini(
        apiKey,
        letterText,
        {
          title: letterTopic.title,
          category: letterTopic.category,
          description: letterTopic.description,
          wordLimit: letterTopic.wordLimit
        },
        settings.customModel
      );

      // Clear cached mock drafts on success
      localStorage.removeItem(`descriptive_ace_mock_essay_${essayTopic.id}`);
      localStorage.removeItem(`descriptive_ace_mock_letter_${letterTopic.id}`);

      // Finish Mock
      onFinishMockTest(
        essayResult,
        letterResult,
        essayText,
        letterText,
        essayTopic,
        letterTopic,
        secondsSpent.current
      );

    } catch (error) {
      console.error("Mock test evaluation failed", error);
      alert("Evaluation failed. Please verify internet connection or API settings.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Helpers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (txt: string) => {
    return txt.trim() === '' ? 0 : txt.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const essayWordCount = getWordCount(essayText);
  const letterWordCount = getWordCount(letterText);

  // Layout template lookup
  const activeTemplate = writingTemplates.find(t => 
    activeTab === 'essay' ? t.category === 'essay' : t.category === 'formal_letter'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToDashboard}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-1.5">
              Descriptive Mock Test <span className="text-xs uppercase bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">Exam Mode</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Solve both prompts within the consolidated 30-minute block.</p>
          </div>
        </div>

        {/* Timer Console */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-center">
          <Timer className={`w-4 h-4 ${timeRemaining < 180 ? 'text-rose-500 animate-pulse' : 'text-indigo-500'}`} />
          <span className={`font-mono text-base font-extrabold tracking-wider ${timeRemaining < 180 ? 'text-rose-500 font-black' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
          <button 
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="text-[10px] uppercase font-black px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-all"
          >
            {isTimerActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {isEvaluating ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Descriptive Paper Submission</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{evalProgressMsg}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Pane (5 cols): Topics and Prompts details */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Mock Instructions */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/30 p-5 rounded-3xl space-y-3">
              <h3 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" /> SBI / IBPS PO Descriptive Guidelines
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                <li>Total Marks: **50 Marks** (Essay: 30 Marks, Letter: 20 Marks).</li>
                <li>Consolidated timer: **30 minutes** for both screens.</li>
                <li>Suggested split: Spend **18 mins** on Essay and **12 mins** on Letter.</li>
                <li>Write Essay within **250 words** and Letter within **150 words**.</li>
              </ul>
            </div>

            {/* Prompt View Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              {/* Tab Selector for Prompt Details */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
                <button
                  onClick={() => setActiveTab('essay')}
                  className={`flex-1 pb-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'essay'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Prompt 1: Essay
                </button>
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`flex-1 pb-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'letter'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Prompt 2: Letter
                </button>
              </div>

              {/* Active Prompt Details */}
              <div className="space-y-4 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase px-2 py-0.5 rounded border">
                      {activeTab === 'essay' ? 'Essay (250 Words)' : 'Letter (150 Words)'}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">
                      {activeTab === 'essay' ? essayTopic.difficulty : letterTopic.difficulty}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 mt-2 text-base leading-snug">
                    {activeTab === 'essay' ? essayTopic.title : letterTopic.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {activeTab === 'essay' ? essayTopic.description : letterTopic.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Target: {activeTab === 'essay' ? '250 words' : '150 words'}</span>
                  <span>Suggested time: {activeTab === 'essay' ? '18 mins' : '12 mins'}</span>
                </div>
              </div>
            </div>

            {/* Submit Mock Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Essay Words: {essayWordCount} / 250</span>
                  <span className={essayWordCount > 275 || essayWordCount < 225 ? 'text-amber-500' : 'text-green-500'}>
                    {essayWordCount >= 225 && essayWordCount <= 275 ? '✓ Ideal Length' : 'Adjust count'}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Letter Words: {letterWordCount} / 150</span>
                  <span className={letterWordCount > 165 || letterWordCount < 135 ? 'text-amber-500' : 'text-green-500'}>
                    {letterWordCount >= 135 && letterWordCount <= 165 ? '✓ Ideal Length' : 'Adjust count'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={essayWordCount < 20 || letterWordCount < 10}
                className={`w-full py-3 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                  (essayWordCount < 20 || letterWordCount < 10)
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Submit Mock Paper <Check className="w-4 h-4" />
              </button>
              {(essayWordCount < 20 || letterWordCount < 10) && (
                <p className="text-[10px] text-slate-400 text-center">Type at least 20 words for Essay and 10 words for Letter to activate submission.</p>
              )}
            </div>

          </div>

          {/* Right Editor Pane (7 cols): Writing Canvas */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Editor Workspace Tab Selection */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-xs">
              <button
                onClick={() => setActiveTab('essay')}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'essay'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Essay Workspace
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'essay' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                  {essayWordCount} w
                </span>
              </button>
              <button
                onClick={() => setActiveTab('letter')}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'letter'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Letter Workspace
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'letter' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                  {letterWordCount} w
                </span>
              </button>
            </div>

            {/* The Textarea Workspace */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-slate-400">
                  {activeTab === 'essay' 
                    ? `Writing Area: Essay (Target: 225-275 words)` 
                    : `Writing Area: Letter (Target: 135-165 words)`
                  }
                </span>

                <div className="flex gap-2">
                  <button 
                    onClick={handleLoadAIHints}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 px-2.5 py-1.5 rounded-lg border border-indigo-200/50 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> AI Hints
                  </button>
                  <button
                    onClick={() => {
                      setShowLayoutHelper(!showLayoutHelper);
                      setShowAIHints(false);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Structure Format
                  </button>
                </div>
              </div>

              {/* Text Editors */}
              <div className="relative">
                {activeTab === 'essay' ? (
                  <textarea
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Type your essay introduction, body, and conclusion paragraphs here..."
                    className={`w-full min-h-[350px] bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-${settings.fontSize} font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed`}
                  />
                ) : (
                  <textarea
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    placeholder="Type your formal/informal letter formatting (Sender address, date, subject, salutation, body paragraphs, sign-off) here..."
                    className={`w-full min-h-[350px] bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-${settings.fontSize} font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed`}
                  />
                )}
              </div>
            </div>

            {/* Helper Drawer Panel */}
            {showLayoutHelper && activeTemplate && (
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 animate-slide-up">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">Format Structure: {activeTemplate.title}</h3>
                  <button 
                    onClick={() => setShowLayoutHelper(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {activeTemplate.structure.map((sect, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-1">
                      <p className="text-[10px] font-bold text-indigo-500">{sect.sectionName}</p>
                      <p className="text-[11px] text-slate-500 leading-normal">{sect.description}</p>
                      {sect.sampleText && (
                        <pre className="text-[10px] bg-slate-50 dark:bg-slate-900 p-2 rounded-md font-mono mt-1 whitespace-pre-wrap select-all">
                          {sect.sampleText}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showAIHints && (
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 animate-slide-up">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Hints for "{activeTab === 'essay' ? essayTopic.title : letterTopic.title}"
                  </h3>
                  <button 
                    onClick={() => setShowAIHints(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                {aiHintsData[activeTab] ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300">Core Points to Cover:</h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500">
                        {aiHintsData[activeTab]?.hints.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300">Relevant Facts / Figures:</h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500">
                        {aiHintsData[activeTab]?.facts.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300">Crucial Keywords:</h4>
                      <div className="flex flex-wrap gap-1">
                        {aiHintsData[activeTab]?.keywords.map((k, i) => (
                          <span key={i} className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100/30">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Failed to fetch AI hints. Write using your current understanding or configure an API Key.
                  </div>
                )}
              </div>
            )}

            {isLoadingHints && (
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl text-center text-slate-500 text-xs animate-pulse">
                Fetching key points and facts from Gemini AI...
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
