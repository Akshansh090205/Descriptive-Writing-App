import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import type { PracticeSession as HistorySession } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { PracticeSession } from './components/PracticeSession';
import { EvaluationResult } from './components/EvaluationResult';
import { StatsDashboard } from './components/StatsDashboard';
import { PYQSection } from './components/PYQSection';
import { VocabSection } from './components/VocabSection';
import { GrammarSection } from './components/GrammarSection';
import { TemplatesSection } from './components/TemplatesSection';
import { Settings } from './components/Settings';
import { MockTestSession } from './components/MockTestSession';
import { MockTestResult } from './components/MockTestResult';
import type { Topic } from './data/topics';
import type { EvaluationResultData } from './services/geminiService';
import { 
  PenTool, 
  Settings as SettingsIcon, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  LayoutDashboard,
  Menu,
  X,
  Flame,
  BookMarked
} from 'lucide-react';

function AppContent() {
  const { streak, settings, updateSettings, saveSession } = useApp();
  const [view, setView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States to pass into Practice & Evaluation Views
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeResult, setActiveResult] = useState<EvaluationResultData | null>(null);
  const [activeUserText, setActiveUserText] = useState<string>('');
  const [activeTimeSpent, setActiveTimeSpent] = useState<number>(0);
  const [isHistoryView, setIsHistoryView] = useState<boolean>(false);

  // Mock Test States
  const [activeMockEssayResult, setActiveMockEssayResult] = useState<EvaluationResultData | null>(null);
  const [activeMockLetterResult, setActiveMockLetterResult] = useState<EvaluationResultData | null>(null);
  const [activeMockEssayText, setActiveMockEssayText] = useState('');
  const [activeMockLetterText, setActiveMockLetterText] = useState('');
  const [activeMockEssayTopic, setActiveMockEssayTopic] = useState<Topic | null>(null);
  const [activeMockLetterTopic, setActiveMockLetterTopic] = useState<Topic | null>(null);
  const [activeMockTimeSpent, setActiveMockTimeSpent] = useState(0);

  const handleFinishMockTest = (
    essayResult: EvaluationResultData,
    letterResult: EvaluationResultData,
    essayText: string,
    letterText: string,
    essayTopic: Topic,
    letterTopic: Topic,
    timeSpent: number
  ) => {
    // Save Essay session to history
    saveSession({
      topicId: essayTopic.id,
      topicTitle: essayTopic.title,
      category: essayTopic.category,
      userText: essayText,
      wordLimit: essayTopic.wordLimit,
      timeSpentSeconds: Math.round(timeSpent * 0.6),
      evaluation: essayResult
    });

    // Save Letter session to history
    saveSession({
      topicId: letterTopic.id,
      topicTitle: letterTopic.title,
      category: letterTopic.category,
      userText: letterText,
      wordLimit: letterTopic.wordLimit,
      timeSpentSeconds: Math.round(timeSpent * 0.4),
      evaluation: letterResult
    });

    setActiveMockEssayResult(essayResult);
    setActiveMockLetterResult(letterResult);
    setActiveMockEssayText(essayText);
    setActiveMockLetterText(letterText);
    setActiveMockEssayTopic(essayTopic);
    setActiveMockLetterTopic(letterTopic);
    setActiveMockTimeSpent(timeSpent);
    setView('mockresults');
  };

  const handleStartPractice = (topic: Topic) => {
    setActiveTopic(topic);
    setView('practice');
    setMobileMenuOpen(false);
  };

  const handleFinishEvaluation = (result: EvaluationResultData, userText: string, timeSpent: number) => {
    setActiveResult(result);
    setActiveUserText(userText);
    setActiveTimeSpent(timeSpent);
    setIsHistoryView(false);
    setView('results');
  };

  const handleViewPastSession = (session: HistorySession) => {
    // Reconstruct topic representation
    setActiveTopic({
      id: session.topicId,
      title: session.topicTitle,
      category: session.category,
      description: '', // Optional for result review
      wordLimit: session.wordLimit,
      timeLimit: Math.round(session.timeSpentSeconds / 60) || 20,
      difficulty: 'medium',
      tags: []
    });
    
    setActiveResult(session.evaluation);
    setActiveUserText(session.userText);
    setActiveTimeSpent(session.timeSpentSeconds);
    setIsHistoryView(true);
    setView('results');
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'contrast' : 'light';
    updateSettings({ theme: nextTheme });
  };

  // Nav config
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pyqs', label: 'PYQ Practice', icon: BookOpen },
    { id: 'templates', label: 'Writing Templates', icon: FileText },
    { id: 'vocabulary', label: 'Vocab Builder', icon: BookMarked },
    { id: 'grammar', label: 'Grammar Practice', icon: PenTool },
    { id: 'stats', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Central Header Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/60 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              DescriptiveAce
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  view === item.id 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' 
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/40'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            ))}
          </nav>

          {/* Toggles & Streaks Row */}
          <div className="flex items-center gap-3">
            {/* Streak Widget */}
            {streak > 0 && (
              <div 
                title="Your daily practice streak"
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200/30 text-xs font-bold shadow-xs select-none"
              >
                <Flame className="w-4 h-4 animate-bounce" />
                <span>{streak}d Streak</span>
              </div>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors cursor-pointer"
              title="Toggle view theme mode"
            >
              <span className="text-xs uppercase font-bold tracking-wider">
                {settings.theme === 'light' ? '☀' : settings.theme === 'dark' ? '🌙' : '👁'}
              </span>
            </button>

            {/* Mobile Burger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-md animate-slide-down">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-left cursor-pointer transition-all ${
                  view === item.id
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <Dashboard 
            onStartPractice={handleStartPractice} 
            setView={setView}
            setSelectedSession={handleViewPastSession}
          />
        )}
        {view === 'practice' && activeTopic && (
          <PracticeSession 
            topic={activeTopic} 
            onFinishEvaluation={handleFinishEvaluation}
            onBackToDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'results' && activeResult && (
          <EvaluationResult 
            evaluation={activeResult}
            initialUserText={activeUserText}
            topicTitle={activeTopic?.title || 'Practice evaluation report'}
            topicCategory={activeTopic?.category || 'essay'}
            topicDescription={activeTopic?.description || ''}
            timeSpentSeconds={activeTimeSpent}
            onBackToDashboard={() => setView('dashboard')}
            isHistoryView={isHistoryView}
          />
        )}
        {view === 'mocktest' && (
          <MockTestSession 
            onFinishMockTest={handleFinishMockTest}
            onBackToDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'mockresults' && activeMockEssayResult && activeMockLetterResult && (
          <MockTestResult 
            essayResult={activeMockEssayResult}
            letterResult={activeMockLetterResult}
            essayText={activeMockEssayText}
            letterText={activeMockLetterText}
            essayTopic={activeMockEssayTopic!}
            letterTopic={activeMockLetterTopic!}
            timeSpentSeconds={activeMockTimeSpent}
            onBackToDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'stats' && <StatsDashboard />}
        {view === 'pyqs' && <PYQSection onStartPractice={handleStartPractice} />}
        {view === 'vocabulary' && <VocabSection />}
        {view === 'grammar' && <GrammarSection />}
        {view === 'templates' && <TemplatesSection />}
        {view === 'settings' && <Settings />}
      </main>

      {/* Footer copyright section */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/60 py-6 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DescriptiveAce. Designed for SBI PO & IBPS PO Mains.</p>
          <div className="flex gap-4">
            <button onClick={() => setView('settings')} className="hover:underline font-semibold cursor-pointer text-slate-500">API Key Studio</button>
            <span className="text-slate-300">|</span>
            <button onClick={() => setView('templates')} className="hover:underline font-semibold cursor-pointer text-slate-500">Layout Formats</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
