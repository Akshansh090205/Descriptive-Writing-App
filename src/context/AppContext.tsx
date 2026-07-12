import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '../data/topics';
import type { EvaluationResultData } from '../services/geminiService';


export interface PracticeSession {
  id: string;
  topicId: string;
  topicTitle: string;
  category: 'essay' | 'formal_letter' | 'informal_letter' | 'pyq';
  userText: string;
  wordLimit: number;
  timeSpentSeconds: number;
  timestamp: string;
  evaluation: EvaluationResultData;
}

export interface AppSettings {
  apiKey: string;
  customModel: string;
  theme: 'light' | 'dark' | 'contrast';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  history: PracticeSession[];
  saveSession: (session: Omit<PracticeSession, 'id' | 'timestamp'>) => void;
  deleteSession: (id: string) => void;
  clearHistory: () => void;
  streak: number;
  customTopics: Topic[];
  addCustomTopic: (topic: Omit<Topic, 'id'>) => Topic;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from local storage or set defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('descriptive_ace_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          apiKey: parsed.apiKey || '',
          customModel: parsed.customModel || 'gemini-1.5-flash',
          theme: parsed.theme || 'light',
          fontSize: parsed.fontSize || 'base',
        };
      } catch (e) {
        console.error("Error parsing settings", e);
      }
    }
    return {
      apiKey: '',
      customModel: 'gemini-1.5-flash',
      theme: 'light',
      fontSize: 'base',
    };
  });

  // Load history
  const [history, setHistory] = useState<PracticeSession[]>(() => {
    const saved = localStorage.getItem('descriptive_ace_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing history", e);
      }
    }
    return [];
  });

  // Load custom topics
  const [customTopics, setCustomTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('descriptive_ace_custom_topics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing custom topics", e);
      }
    }
    return [];
  });

  const [streak, setStreak] = useState<number>(0);

  // Sync settings to local storage and update body classes
  useEffect(() => {
    localStorage.setItem('descriptive_ace_settings', JSON.stringify(settings));
    
    // Manage class names on document.documentElement
    const root = document.documentElement;
    root.classList.remove('dark', 'contrast');
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'contrast') {
      root.classList.add('contrast', 'dark'); // High contrast is usually dark-based or bright-yellow on black
    }
  }, [settings]);

  // Sync history to local storage and compute streak
  useEffect(() => {
    localStorage.setItem('descriptive_ace_history', JSON.stringify(history));
    computeStreak(history);
  }, [history]);

  // Sync custom topics
  useEffect(() => {
    localStorage.setItem('descriptive_ace_custom_topics', JSON.stringify(customTopics));
  }, [customTopics]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSession = (sessionData: Omit<PracticeSession, 'id' | 'timestamp'>) => {
    const newSession: PracticeSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newSession, ...prev]);
  };

  const deleteSession = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    setStreak(0);
  };

  const addCustomTopic = (topicData: Omit<Topic, 'id'>): Topic => {
    const newTopic: Topic = {
      ...topicData,
      id: `custom-topic-${Date.now()}`
    };
    setCustomTopics(prev => [newTopic, ...prev]);
    return newTopic;
  };

  // Streak logic: check how many consecutive calendar days have evaluations
  const computeStreak = (sessions: PracticeSession[]) => {
    if (sessions.length === 0) {
      setStreak(0);
      return;
    }

    // Get sorted unique dates (local time YYYY-MM-DD)
    const uniqueDates = Array.from(new Set(
      sessions.map(s => {
        const date = new Date(s.timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    )).sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)

    if (uniqueDates.length === 0) {
      setStreak(0);
      return;
    }

    const todayStr = getLocalDateStr(new Date());
    const yesterdayStr = getLocalDateStr(new Date(Date.now() - 24 * 60 * 60 * 1000));

    // Check if the most recent practice was today or yesterday. If not, streak is broken.
    const newestPracticeDate = uniqueDates[0];
    if (newestPracticeDate !== todayStr && newestPracticeDate !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let currentStreak = 1;
    let expectedDate = new Date(newestPracticeDate);

    for (let i = 1; i < uniqueDates.length; i++) {
      // Subtract 1 day
      expectedDate.setDate(expectedDate.getDate() - 1);
      const expectedStr = getLocalDateStr(expectedDate);

      if (uniqueDates[i] === expectedStr) {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    }

    setStreak(currentStreak);
  };

  const getLocalDateStr = (d: Date): string => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      history,
      saveSession,
      deleteSession,
      clearHistory,
      streak,
      customTopics,
      addCustomTopic
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
