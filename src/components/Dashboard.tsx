import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PracticeSession } from '../context/AppContext';
import { defaultTopics } from '../data/topics';
import type { Topic } from '../data/topics';
import { 
  FileText, 
  PenTool, 
  Flame, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  History, 
  ArrowRight, 
  Search, 
  PlusCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onStartPractice: (topic: Topic) => void;
  setView: (view: string) => void;
  setSelectedSession: (session: PracticeSession) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartPractice, setView, setSelectedSession }) => {
  const { history, streak, customTopics, addCustomTopic } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'essay' | 'formal_letter' | 'informal_letter' | 'pyq'>('all');
  const [activeStream, setActiveStream] = useState<'all' | 'po' | 'so_it' | 'so_afo'>('all');
  
  // Custom topic generator state
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<'essay' | 'formal_letter' | 'informal_letter'>('essay');
  const [newTopicLimit, setNewTopicLimit] = useState(250);
  const [newTopicDiff, setNewTopicDiff] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Combined topics list (default + custom)
  const allTopics = [...defaultTopics, ...customTopics];

  // Filter topics
  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    
    let matchesStream = true;
    if (activeStream === 'po') {
      matchesStream = !topic.stream || topic.stream === 'general';
    } else if (activeStream === 'so_it') {
      matchesStream = topic.stream === 'IT';
    } else if (activeStream === 'so_afo') {
      matchesStream = topic.stream === 'AFO';
    }

    return matchesSearch && matchesCategory && matchesStream;
  });

  // Calculate quick stats
  const totalPracticeCount = history.length;
  const avgScore = totalPracticeCount > 0 
    ? Math.round(history.reduce((sum, s) => sum + s.evaluation.overallScore, 0) / totalPracticeCount) 
    : 0;
  
  const bestScore = totalPracticeCount > 0 
    ? Math.max(...history.map(s => s.evaluation.overallScore)) 
    : 0;

  // Daily Challenge topic is deterministic based on the day of the year
  const getDailyChallengeTopic = (): Topic => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % defaultTopics.filter(t => t.category === 'essay').length;
    return defaultTopics.filter(t => t.category === 'essay')[index];
  };

  const dailyChallenge = getDailyChallengeTopic();

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicDesc.trim()) return;

    const newTopic = addCustomTopic({
      title: newTopicTitle,
      description: newTopicDesc,
      category: newTopicCategory,
      wordLimit: newTopicLimit,
      timeLimit: newTopicCategory === 'essay' ? 30 : 20,
      difficulty: newTopicDiff,
      tags: ['Custom', newTopicCategory.replace('_', ' ')],
      hints: ['Flesh out your opening statement.', 'Keep word limits in mind.', 'Present clear paragraphs.'],
      facts: ['Review basic layout structures.'],
      keywords: ['Implementation', 'Standardization']
    });

    setNewTopicTitle('');
    setNewTopicDesc('');
    setShowCreateTopic(false);
    onStartPractice(newTopic);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white/20 text-white rounded-full border border-white/20">
            <Award className="w-3.5 h-3.5" /> High-Performance AI Evaluator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Master Banking Descriptive Papers with DescriptiveAce
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            Practice essays and letter writing with instant, professional grading modeled on SBI PO & IBPS PO Mains standards. Free, privacy-first, and completely offline-capable.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => onStartPractice(dailyChallenge)}
              className="px-6 py-3 bg-white text-indigo-900 hover:bg-slate-100 font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <PenTool className="w-4 h-4" /> Start Daily Challenge
            </button>
            <button 
              onClick={() => setView('mocktest')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" /> Full Exam Simulator (30m)
            </button>
            <button 
              onClick={() => setView('templates')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> View Templates
            </button>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-xl">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</p>
            <h3 className="text-2xl font-bold dark:text-indigo-400">{streak} {streak === 1 ? 'Day' : 'Days'}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Practiced</p>
            <h3 className="text-2xl font-bold dark:text-indigo-400">{totalPracticeCount} drafts</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Score</p>
            <h3 className="text-2xl font-bold dark:text-indigo-400">{avgScore}/100</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Personal Best</p>
            <h3 className="text-2xl font-bold dark:text-indigo-400">{bestScore}/100</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Challenge & Topics vs Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Topics Finder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight dark:text-indigo-400">Practice Dashboard</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Select a banking exam topic below to begin writing</p>
            </div>
            
            <button
              onClick={() => setShowCreateTopic(!showCreateTopic)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/70 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Create Custom Topic
            </button>
          </div>

          {/* Custom Topic Form Drawer */}
          {showCreateTopic && (
            <form onSubmit={handleCreateTopic} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 animate-slide-down">
              <h3 className="font-bold text-lg">Define New Practice Question</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    placeholder="e.g. Impact of Privatisation on Public Sector Banks"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={newTopicCategory}
                    onChange={e => {
                      const cat = e.target.value as any;
                      setNewTopicCategory(cat);
                      setNewTopicLimit(cat === 'essay' ? 250 : 150);
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="essay">Essay Practice (250 words)</option>
                    <option value="formal_letter">Formal Letter (150 words)</option>
                    <option value="informal_letter">Informal Letter (150 words)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prompt / Detailed Instructions</label>
                <textarea
                  required
                  value={newTopicDesc}
                  onChange={e => setNewTopicDesc(e.target.value)}
                  placeholder="Explain arguments for and against... Suggest measures to secure transition..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Word Limit</label>
                  <input
                    type="number"
                    value={newTopicLimit}
                    onChange={e => setNewTopicLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={newTopicDiff}
                    onChange={e => setNewTopicDiff(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTopic(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm cursor-pointer"
                >
                  Create & Practice
                </button>
              </div>
            </form>
          )}

          {/* Exam Stream Selector Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 pb-2.5 mb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Exam Papers' },
              { id: 'po', label: 'PO Exams (SBI / IBPS)' },
              { id: 'so_it', label: 'SO IT Officer' },
              { id: 'so_afo', label: 'SO Agriculture (AFO)' },
            ].map(streamOpt => (
              <button
                key={streamOpt.id}
                onClick={() => setActiveStream(streamOpt.id as any)}
                className={`px-3.5 py-2 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  activeStream === streamOpt.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                }`}
              >
                {streamOpt.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search topics, keywords, or PYQs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              {(['all', 'essay', 'formal_letter', 'informal_letter', 'pyq'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    activeCategory === cat 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Topic List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <div 
                  key={topic.id}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                          topic.category === 'essay' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' :
                          topic.category === 'formal_letter' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                          topic.category === 'informal_letter' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' :
                          'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        }`}>
                          {topic.category.replace('_', ' ')}
                        </span>
                        {topic.stream && topic.stream !== 'general' && (
                          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md">
                            {topic.stream}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${
                        topic.difficulty === 'easy' ? 'text-green-500' :
                        topic.difficulty === 'medium' ? 'text-amber-500' :
                        'text-rose-500'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                      {topic.title}
                    </h3>
                    
                    {topic.exam && (
                      <p className="text-[11px] font-semibold text-indigo-500 mt-0.5">
                        {topic.exam} ({topic.year})
                      </p>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Limit: {topic.wordLimit} words | {topic.timeLimit} mins
                    </span>
                    <button
                      onClick={() => onStartPractice(topic)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer"
                    >
                      Write Answer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">No banking topics match your search query</p>
                <p className="text-xs mt-1">Try refining search parameters or create a custom topic above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Practice History & Vocabulary Builder snippet */}
        <div className="space-y-6">
          
          {/* History Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" /> Recent Attempts
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => setView('stats')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice(0, 4).map(session => (
                  <div 
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      setView('results');
                    }}
                    className="group border border-slate-100 dark:border-slate-800/60 hover:border-indigo-500/30 p-3.5 rounded-xl text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {session.topicTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} | {session.evaluation.wordCount.current} words
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                        session.evaluation.overallScore >= 80 ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' :
                        session.evaluation.overallScore >= 60 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' :
                        'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                      }`}>
                        {session.evaluation.overallScore}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <p>No attempts recorded yet.</p>
                  <p className="mt-1">Completed drafts and evaluations will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Quick Vocab Widget */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Daily Vocabulary</span>
              <button 
                onClick={() => setView('vocabulary')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Expand List
              </button>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">Ameliorate</h4>
              <p className="text-xs italic text-indigo-500 font-semibold">verb</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                To make something bad or unsatisfactory better.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 border border-indigo-100/20">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Banking Example</p>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 italic mt-0.5">
                "Deploying digital banking correspondents helped ameliorate the difficulty of access to physical bank branches..."
              </p>
            </div>
          </div>
          
          {/* Practice Advice Box */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-2">
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Descriptive Writing Exam Tips</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Write clean introduction, middle arguments, and summary paragraphs.</li>
              <li>Avoid abbreviations like "don't" or "can't" in formal letters.</li>
              <li>Leave 3 minutes at the end of the timer to review spelling accuracy.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
