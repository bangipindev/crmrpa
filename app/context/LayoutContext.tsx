"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LayoutPreference = 'side' | 'top';

interface LayoutContextType {
  layoutPreference: LayoutPreference;
  setLayoutPreference: (preference: LayoutPreference) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [layoutPreference, setLayoutPreference] = useState<LayoutPreference>('side');

  useEffect(() => {
    // Load preference from localStorage
    const savedPreference = localStorage.getItem('layoutPreference') as LayoutPreference;
    if (savedPreference) {
      setLayoutPreference(savedPreference);
    }
  }, []);

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('layoutPreference', layoutPreference);
  }, [layoutPreference]);

  return (
    <LayoutContext.Provider value={{ layoutPreference, setLayoutPreference }}>
      {children}
    </LayoutContext.Provider>
  );
}



