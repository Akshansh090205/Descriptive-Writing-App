import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Key, 
  Trash2, 
  Sun, 
  Moon, 
  Eye, 
  Info,
  ChevronRight
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, clearHistory } = useApp();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ apiKey: apiKey.trim() });
    alert('Gemini API key saved locally! Your evaluations will now use high-fidelity AI.');
  };

  const handleClearKey = () => {
    setApiKey('');
    updateSettings({ apiKey: '' });
    alert('API key cleared.');
  };

  const handleClearHistoryClick = () => {
    if (confirm("Are you sure you want to clear your entire practice history? This action is permanent and cannot be undone.")) {
      clearHistory();
      alert("All practice history cleared successfully.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">App Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your AI engine, visual themes, and local database</p>
      </div>

      {/* Gemini AI Key Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Gemini AI Credentials</h3>
            <p className="text-[11px] text-slate-400">Enable high-fidelity AI evaluations directly from your browser</p>
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-indigo-950/20 border border-blue-100/50 dark:border-indigo-950/30 p-4 rounded-xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-bold flex items-center gap-1"><Info className="w-4 h-4 text-blue-500" /> Privacy & Cost Shield:</p>
          <p>
            Your API key is stored **only in your browser\'s local storage**. It is never sent to any external server (except directly to the Gemini API endpoint client-side).
          </p>
          <p>
            DescriptiveAce is 100% free and has no server storage. If no API key is specified, the coach automatically falls back to a rule-based offline scoring module.
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Gemini API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm cursor-pointer transition-colors"
              >
                Save Key
              </button>
              {settings.apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl text-sm cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] font-bold text-indigo-500 hover:underline mt-1.5"
            >
              Get a Free Gemini API Key from Google AI Studio <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">AI Model Model Selection</label>
            <select
              value={settings.customModel}
              onChange={(e) => updateSettings({ customModel: e.target.value })}
              className="w-full max-w-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Recommended)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Standard)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Detail)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Visual Configuration Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Visuals & Accessibility</h3>
            <p className="text-[11px] text-slate-400">Customize color modes and text sizes for focused practice</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Theme Preference</span>
            <div className="flex gap-2">
              {[
                { id: 'light', label: 'Light Mode', icon: Sun },
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'contrast', label: 'High Contrast', icon: Eye }
              ].map(themeOpt => (
                <button
                  key={themeOpt.id}
                  onClick={() => updateSettings({ theme: themeOpt.id as any })}
                  className={`flex-1 py-3 px-4 border rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    settings.theme === themeOpt.id
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-slate-900 dark:border-slate-100'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <themeOpt.icon className="w-4 h-4" /> {themeOpt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Editor Font Size</span>
            <div className="flex gap-2 max-w-xs">
              {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`flex-1 py-2 px-3 border rounded-xl font-bold uppercase text-xs cursor-pointer transition-all ${
                    settings.fontSize === size
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-slate-900 dark:border-slate-100'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Database control panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Local Database Admin</h3>
              <p className="text-[11px] text-slate-400">Clear cache or reset user profiles stored in this browser</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-rose-50/20 dark:bg-rose-950/10 p-4 rounded-xl border border-rose-100/30">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-rose-800 dark:text-rose-400">Reset Practice History</p>
            <p className="text-[11px] text-slate-400">Delete all drafts, feedback reports, and streak details.</p>
          </div>
          <button
            onClick={handleClearHistoryClick}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-colors"
          >
            Clear All History
          </button>
        </div>
      </div>

    </div>
  );
};
