"use client";

import React, { createContext, useContext } from 'react';

interface ModalContextType {
  setActiveModal: (modal: 'sale' | 'purchase' | 'adjustment' | 'product' | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children, setActiveModal }: { children: React.ReactNode; setActiveModal: (modal: 'sale' | 'purchase' | 'adjustment' | 'product' | null) => void; }) {
  return (
    <ModalContext.Provider value={{ setActiveModal }}>
      {children}
    </ModalContext.Provider>
  );
}

