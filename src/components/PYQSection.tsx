import React, { useState } from 'react';
import { defaultTopics } from '../data/topics';
import type { Topic } from '../data/topics';
import { Search, ArrowRight, BookOpen } from 'lucide-react';

interface PYQSectionProps {
  onStartPractice: (topic: Topic) => void;
}

export const PYQSection: React.FC<PYQSectionProps> = ({ onStartPractice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState<'all' | 'SBI PO' | 'IBPS PO' | 'RBI Grade B' | 'IBPS SO'>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '2024' | '2023'>('all');

  const pyqTopics = defaultTopics.filter(t => t.category === 'pyq');

  const filtered = pyqTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (topic.exam && topic.exam.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesExam = examFilter === 'all' || topic.exam?.includes(examFilter);
    const matchesYear = yearFilter === 'all' || topic.year?.toString() === yearFilter;

    return matchesSearch && matchesExam && matchesYear;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Previous Year Exam Questions</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Solve actual essay and letter-writing prompts from previous banking mains papers</p>
      </div>

      {/* Filter Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search exams, topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Exam filter */}
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
          >
            <option value="all">All Exams</option>
            <option value="SBI PO">SBI PO</option>
            <option value="IBPS PO">IBPS PO</option>
            <option value="IBPS SO">IBPS SO</option>
            <option value="RBI Grade B">RBI Grade B</option>
          </select>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Topics list layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length > 0 ? (
          filtered.map(topic => (
            <div 
              key={topic.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-100/30">
                    {topic.exam} ({topic.year})
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    topic.difficulty === 'easy' ? 'text-green-500' :
                    topic.difficulty === 'medium' ? 'text-amber-500' :
                    'text-rose-500'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 leading-snug">{topic.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-4 leading-relaxed">{topic.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 text-xs">
                <span className="text-slate-400 font-semibold">Word target: {topic.wordLimit} words | {topic.timeLimit} mins</span>
                <button
                  onClick={() => onStartPractice(topic)}
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                >
                  Start practice <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white dark:bg-slate-900 border border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-500">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold">No Previous Year Questions match your filter</p>
            <p className="text-xs mt-0.5">Try altering the year or exam selects.</p>
          </div>
        )}
      </div>

    </div>
  );
};
