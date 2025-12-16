import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Goal, INITIAL_STATE, SavingsEntry, UserSettings } from '@/lib/types';

interface AppContextType extends AppState {
  addEntry: (amount: number, date: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setActiveGoal: (id: string) => void;
  resetData: () => void;
  totalSaved: number;
  daysSober: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('sober-savings-state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('sober-savings-state', JSON.stringify(state));
  }, [state]);

  const addEntry = (amount: number, date: string) => {
    const newEntry: SavingsEntry = {
      id: crypto.randomUUID(),
      amount,
      date,
    };
    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const setActiveGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeGoalId: id,
    }));
  };

  const resetData = () => {
    setState(INITIAL_STATE);
  };

  // Calculate derived stats
  const calculateTotalSaved = () => {
    const start = new Date(state.settings.startDate).getTime();
    const now = new Date().getTime();
    const daysDiff = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    
    // Base savings from daily target * days
    const baseSavings = daysDiff * state.settings.dailyTarget;
    
    // Plus any manual entries (if we were tracking "extra" savings, but for now let's just use the daily target logic primarily, 
    // or we can treat entries as "money actually put aside". 
    // For this MVP, let's assume "Total Saved" = (Days Sober * Daily Target) + (Manual Extra Entries)
    const manualSavings = state.entries.reduce((acc, curr) => acc + curr.amount, 0);
    
    return baseSavings + manualSavings;
  };

  const calculateDaysSober = () => {
    const start = new Date(state.settings.startDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addEntry,
        updateSettings,
        setActiveGoal,
        resetData,
        totalSaved: calculateTotalSaved(),
        daysSober: calculateDaysSober(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
