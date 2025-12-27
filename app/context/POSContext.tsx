"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product, Customer, Transaction } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS } from '../mockData';
import { useData } from './DataContext';
import { useModal } from './ModalContext';

interface POSContextType {
  selectedCustId: string;
  setSelectedCustId: (id: string) => void;
  selectedProdId: string;
  setSelectedProdId: (id: string) => void;
  trxQty: number;
  setTrxQty: (qty: number) => void;
  currentProduct: Product | undefined;
  currentCustomer: Customer | undefined;
  calculatedPrice: number;
  handleAddTransaction: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}

interface POSProviderProps {
  children: ReactNode;
}

export function POSProvider({ children }: POSProviderProps) {
  const { products, setProducts, customers, suppliers, transactions, setTransactions } = useData();
  const { activeModal, setActiveModal } = useModal();
  
  const [selectedCustId, setSelectedCustId] = useState(INITIAL_CUSTOMERS[0].id);
  const [selectedProdId, setSelectedProdId] = useState(INITIAL_PRODUCTS[0].id);
  const [trxQty, setTrxQty] = useState(1);

  const currentCustomer = customers.find(c => c.id === selectedCustId);
  const currentProduct = products.find(p => p.id === selectedProdId);

  const calculatedPrice = useMemo(() => {
    if (!currentProduct || !currentCustomer) return 0;
    if (currentCustomer.type === 'Agent') return currentProduct.agentPrice;
    if (currentCustomer.type === 'Distributor') return currentProduct.distributorPrice;
    return currentProduct.sellPrice;
  }, [currentProduct, currentCustomer]);

  const handleAddTransaction = () => {
    if (!currentProduct || !currentCustomer) return;

    const type = activeModal === 'purchase' ? 'Purchase' : 'Sale';
    const total = (activeModal === 'purchase' ? currentProduct.buyPrice : calculatedPrice) * trxQty;

    const newTrx: Transaction = {
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type,
      entityName: activeModal === 'purchase' ? suppliers[0].name : currentCustomer.name,
      total,
      items: [{ productId: currentProduct.id, name: currentProduct.name, qty: trxQty, price: total / trxQty }],
      status: 'Completed'
    };

    setTransactions([newTrx, ...transactions]);

    // Update Stock
    setProducts(prev => prev.map(p => {
      if (p.id === currentProduct.id) {
        return {
          ...p,
          stock: type === 'Sale' ? p.stock - trxQty : p.stock + trxQty
        };
      }
      return p;
    }));

    setActiveModal(null);
    setTrxQty(1);
  };

  return (
    <POSContext.Provider
      value={{
        selectedCustId,
        setSelectedCustId,
        selectedProdId,
        setSelectedProdId,
        trxQty,
        setTrxQty,
        currentProduct,
        currentCustomer,
        calculatedPrice,
        handleAddTransaction,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

