"use client";

import React, { useState, useMemo } from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Product, Customer, Supplier, Transaction, Adjustment } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS } from './mockData';

import { NavItem } from './components/NavItem';
import { Modals } from './components/Modals';
import { ModalProvider } from './context/ModalContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'sale' | 'purchase' | 'adjustment' | 'product' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModalProvider setActiveModal={setActiveModal}>
          <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#2f81f7]/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
                onClick={() => setIsSidebarOpen(false)} 
              />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
              fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0d1117] border-r border-[#30363d] p-6 flex flex-col gap-8 transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] rounded-xl flex items-center justify-center shadow-lg shadow-[#2f81f7]/20">
                    <ShoppingCart className="text-white" size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="font-black text-white tracking-tight text-lg leading-none">RPA PRO</h1>
                    <p className="text-[10px] text-[#8b949e] uppercase tracking-[0.2em] mt-1">Intelligence</p>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-[#8b949e] p-2">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-2 mb-2">Analytics</p>
                <NavItem href="/pages/dashboard" icon={LayoutDashboard} label="Overview" setIsSidebarOpen={setIsSidebarOpen} />
                
                <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Operations</p>
                <NavItem href="/pages/products" icon={Package} label="Inventory Control" setIsSidebarOpen={setIsSidebarOpen} />
                <NavItem href="/pages/transactions" icon={History} label="Logistics History" setIsSidebarOpen={setIsSidebarOpen} />
                <NavItem href="/pages/adjustments" icon={RefreshCw} label="Stock Adjustments" setIsSidebarOpen={setIsSidebarOpen} />
                
                <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Relationships</p>
                <NavItem href="/pages/customers" icon={Users} label="Customer Base" setIsSidebarOpen={setIsSidebarOpen} />
                <NavItem href="/pages/suppliers" icon={Truck} label="Supply Chain" setIsSidebarOpen={setIsSidebarOpen} />

                <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Accounting</p>
                <NavItem href="/pages/reports" icon={ClipboardList} label="Performance Data" setIsSidebarOpen={setIsSidebarOpen} />
              </nav>

              <div className="mt-auto">
                <div className="p-4 bg-[#161b22] rounded-2xl border border-[#30363d] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Manager Ops</p>
                    <p className="text-[10px] text-[#8b949e] uppercase">Admin Tier 1</p>
                  </div>
                  <Settings size={16} className="text-[#484f58] cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
              {/* Header */}
              <header className="h-20 border-b border-[#30363d] flex items-center justify-between px-6 lg:px-10 bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-30">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#8b949e] p-2 hover:bg-[#1f2937] rounded-lg transition-colors">
                    <Menu size={24} />
                  </button>
                  <div className="hidden md:flex items-center gap-3 bg-[#161b22] border border-[#30363d] px-4 py-2.5 rounded-xl w-64 lg:w-96 transition-all focus-within:border-[#2f81f7] focus-within:ring-4 focus-within:ring-[#2f81f7]/10">
                    <Search size={18} className="text-[#484f58]" />
                    <input 
                      type="text" 
                      placeholder="Search products, TRX, or customers..." 
                      className="bg-transparent border-none outline-none text-sm w-full text-[#c9d1d9] placeholder-[#484f58] font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider">System Online</span>
                  </div>
                  <button className="p-2.5 text-[#8b949e] hover:text-white hover:bg-[#1f2937] rounded-xl transition-all relative">
                    <AlertTriangle size={20} className={stats.lowStockCount > 0 ? 'text-[#f85149]' : ''} />
                    {stats.lowStockCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#f85149] rounded-full border-2 border-[#0d1117]" />
                    )}
                  </button>
                </div>
              </header>

              {/* View Content */}
              <div className="p-6 lg:p-10 overflow-y-auto h-[calc(100vh-80px)]">
                <div className="max-w-7xl mx-auto space-y-8">
                  {children}
                </div>
              </div>
            </main>

            {/* Dynamic Modals */}
            <Modals 
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              products={products}
              customers={customers}
              suppliers={suppliers}
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
            />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}