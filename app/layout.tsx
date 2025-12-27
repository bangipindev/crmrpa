"use client";

import React, { useState, useMemo } from 'react';
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import {
  ShoppingCart,
  Search,
  AlertTriangle,
  Menu,
  Settings,
  X,
  LayoutDashboard,
  Package,
  History,
  RefreshCw,
  Users,
  Truck,
  ClipboardList,
  Settings as SettingsIcon,
  UserCog,
  ShieldCheck,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Product, Customer, Supplier, Transaction, Adjustment } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS } from './mockData';

import { NavItem } from './components/NavItem';
import { Modals } from './components/Modals';
import { TopNavigation } from './components/TopNavigation';
import { SideLayout } from './components/SideLayout';
import { TopLayout } from './components/TopLayout';
import { ModalProvider } from './context/ModalContext';
import { LayoutProvider, useLayout } from './context/LayoutContext';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'], 
  display: 'swap',
});


function LayoutContent({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'sale' | 'purchase' | 'adjustment' | 'product' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { layoutPreference, setLayoutPreference } = useLayout();


  // POS State
  const [selectedCustId, setSelectedCustId] = useState(INITIAL_CUSTOMERS[0].id);
  const [selectedProdId, setSelectedProdId] = useState(INITIAL_PRODUCTS[0].id);
  const [trxQty, setTrxQty] = useState(1);

  // Calculate stats dynamically
  const stats = useMemo(() => {
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    const overStockItems = products.filter(p => p.stock > p.maxStock);
    const today = new Date().toISOString().split('T')[0];
    
    const dailySales = transactions
      .filter(t => t.type === 'Sale' && t.date.startsWith(today))
      .reduce((acc, t) => acc + t.total, 0);
      
    const mtdSales = transactions
      .filter(t => t.type === 'Sale')
      .reduce((acc, t) => acc + t.total, 0);

    const mtdPurchases = transactions
      .filter(t => t.type === 'Purchase')
      .reduce((acc, t) => acc + t.total, 0);
    
    return { 
      totalStock, 
      lowStockCount: lowStockItems.length, 
      overStockCount: overStockItems.length,
      dailySales, 
      mtdSales,
      mtdPurchases,
      lowStockItems,
      overStockItems,
      profit: mtdSales - mtdPurchases
    };
  }, [products, transactions]);

  // POS Logic
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
    <ModalProvider setActiveModal={setActiveModal}>
      {layoutPreference === 'side' ? (
        <SideLayout 
          products={products}
          setProducts={setProducts}
          customers={customers}
          suppliers={suppliers}
          transactions={transactions}
          setTransactions={setTransactions}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCustId={selectedCustId}
          setSelectedCustId={setSelectedCustId}
          selectedProdId={selectedProdId}
          setSelectedProdId={setSelectedProdId}
          trxQty={trxQty}
          setTrxQty={setTrxQty}
          currentProduct={currentProduct}
          currentCustomer={currentCustomer}
          calculatedPrice={calculatedPrice}
          handleAddTransaction={handleAddTransaction}
          stats={stats}
        >
          {children}
        </SideLayout>
      ) : (
        <TopLayout
          products={products}
          setProducts={setProducts}
          customers={customers}
          suppliers={suppliers}
          transactions={transactions}
          setTransactions={setTransactions}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCustId={selectedCustId}
          setSelectedCustId={setSelectedCustId}
          selectedProdId={selectedProdId}
          setSelectedProdId={setSelectedProdId}
          trxQty={trxQty}
          setTrxQty={setTrxQty}
          currentProduct={currentProduct}
          currentCustomer={currentCustomer}
          calculatedPrice={calculatedPrice}
          handleAddTransaction={handleAddTransaction}
          stats={stats}
        >
          {children}
        </TopLayout>
      )}
    </ModalProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <LayoutProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </LayoutProvider>
      </body>
    </html>
  );
}