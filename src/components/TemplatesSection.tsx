import React, { useState } from 'react';
import { writingTemplates } from '../data/writingTemplates';
import { Copy, Check, Info } from 'lucide-react';

export const TemplatesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'essay' | 'formal_letter' | 'informal_letter'>('essay');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const selectedTemplate = writingTemplates.find(t => t.category === activeCategory);

  const handleCopySample = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight dark:text-indigo-400">Writing Formats & Layout Templates</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Review standard layout structure scoring templates for Essays and Letters</p>
      </div>

      {/* Categories Toggle Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        {(['essay', 'formal_letter', 'informal_letter'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-3 font-bold text-xs border-b-2 transition-all cursor-pointer capitalize ${
              activeCategory === cat
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Selected Template Details */}
      {selectedTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left 2 Cols: Layout Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-emerald-600 dark:text-emerald-400">{selectedTemplate.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedTemplate.description}</p>
            </div>

            <div className="space-y-4">
              {selectedTemplate.structure.map((section, idx) => {
                const uniqueId = `${activeCategory}-${idx}`;
                return (
                  <div 
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{section.sectionName}</h4>
                      {section.sampleText && (
                        <button
                          onClick={() => handleCopySample(section.sampleText!, uniqueId)}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSection === uniqueId ? (
                            <>
                              <Check className="w-3 h-3 text-green-500" /> Copied Structure
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Sample
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{section.description}</p>
                    {section.sampleText && (
                      <pre className="text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                        {section.sampleText}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: Exam Tips sidebar */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/30 p-5 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500 animate-pulse" /> Format Scoring Tips
            </h3>
            
            <div className="space-y-3 text-xs">
              {selectedTemplate.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300 leading-normal">{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};
