import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  PenTool
} from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  const { history } = useApp();

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center text-slate-500 animate-fade-in space-y-4">
        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Statistics Available Yet</h2>
        <p className="text-sm max-w-sm mx-auto leading-relaxed">
          Complete at least one practice writing session. Your evaluation metrics and progress analytics will be visualised here.
        </p>
      </div>
    );
  }

  // General aggregates
  const totalAttempts = history.length;
  const averageScore = Math.round(history.reduce((sum, s) => sum + s.evaluation.overallScore, 0) / totalAttempts);
  
  // Average writing speed: wordCount / (timeSpentSeconds / 60)
  const averageSpeed = Math.round(
    history.reduce((sum, s) => {
      const minutes = s.timeSpentSeconds / 60 || 1;
      return sum + (s.evaluation.wordCount.current / minutes);
    }, 0) / totalAttempts
  );

  const averageWordCount = Math.round(history.reduce((sum, s) => sum + s.evaluation.wordCount.current, 0) / totalAttempts);
  const totalTimeSpentSeconds = history.reduce((sum, s) => sum + s.timeSpentSeconds, 0);
  const totalTimeStr = totalTimeSpentSeconds > 3600
    ? `${Math.round(totalTimeSpentSeconds / 3600)} hrs`
    : `${Math.round(totalTimeSpentSeconds / 60)} mins`;

  // Chart Data 1: Scores trend (oldest to newest)
  const scoreTrendData = [...history]
    .reverse()
    .map((session, index) => ({
      name: `Draft ${index + 1}`,
      score: session.evaluation.overallScore,
      title: session.topicTitle
    }));

  // Chart Data 2: Practices per category
  const categoriesMap = history.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryPieData = Object.entries(categoriesMap).map(([key, val]) => ({
    name: key === 'essay' ? 'Essays' :
          key === 'formal_letter' ? 'Formal Letters' :
          key === 'informal_letter' ? 'Informal Letters' : 'PYQ Practice',
    value: val
  }));

  const COLORS = ['#2563eb', '#f59e0b', '#a855f7', '#f43f5e'];

  // Chart Data 3: Parameter Averages
  const paramSum = history.reduce((acc, s) => {
    acc.grammar += s.evaluation.scores.grammar;
    acc.vocabulary += s.evaluation.scores.vocabulary;
    acc.sentenceStructure += s.evaluation.scores.sentenceStructure;
    acc.organization += s.evaluation.scores.organization;
    acc.contentRelevance += s.evaluation.scores.contentRelevance;
    acc.presentation += s.evaluation.scores.presentation;
    return acc;
  }, { grammar: 0, vocabulary: 0, sentenceStructure: 0, organization: 0, contentRelevance: 0, presentation: 0 });

  const paramAvgData = [
    { name: 'Grammar', percentage: Math.round((paramSum.grammar / (totalAttempts * 20)) * 100) },
    { name: 'Vocabulary', percentage: Math.round((paramSum.vocabulary / (totalAttempts * 15)) * 100) },
    { name: 'Sentence Structure', percentage: Math.round((paramSum.sentenceStructure / (totalAttempts * 15)) * 100) },
    { name: 'Organization', percentage: Math.round((paramSum.organization / (totalAttempts * 20)) * 100) },
    { name: 'Content Relevance', percentage: Math.round((paramSum.contentRelevance / (totalAttempts * 20)) * 100) },
    { name: 'Presentation', percentage: Math.round((paramSum.presentation / (totalAttempts * 10)) * 100) }
  ];

  return (
    <div className="space-y-8 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight dark:text-indigo-400">Performance Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize writing score trends, typing speed averages, and parameter accuracy</p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Average Grade</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{averageScore}</h3>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Across all {totalAttempts} submitted essays & letters.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Typing Speed</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{averageSpeed}</h3>
            <span className="text-xs text-slate-400">WPM</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Calculated during active typing sessions.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Average Length</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-indigo-400">{averageWordCount}</h3>
            <span className="text-xs text-slate-400">words</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Matches the 150-250 targets in major exams.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Time Spent</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-3xl font-extrabold text-green-600 dark:text-indigo-400">{totalTimeStr}</h3>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Accumulated evaluation writing sessions.</p>
        </div>
      </div>

      {/* Main Stats Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Score Trend (2/3 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Score Progression Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#60a5fa', fontSize: '11px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart (1/3 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-indigo-500" /> Topic Distribution
          </h3>
          <div className="h-56 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameters Strengths (Full row or 2 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-500" /> Subject-Area Accuracy Ratings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {paramAvgData.slice(0, 3).map((param, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>{param.name}</span>
                    <span>{param.percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${param.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {paramAvgData.slice(3).map((param, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>{param.name}</span>
                    <span>{param.percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${param.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
