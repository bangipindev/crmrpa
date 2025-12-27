"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIStateContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}

interface UIStateProviderProps {
  children: ReactNode;
}

export function UIStateProvider({ children }: UIStateProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <UIStateContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
}

