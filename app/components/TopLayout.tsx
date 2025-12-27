"use client";

import React from 'react';
import {
  ShoppingCart,
  Search,
  AlertTriangle,
  Menu,
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
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Product, Customer, Supplier, Transaction, Adjustment } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS } from '../mockData';

import { NavItem } from './NavItem';
import { Modals } from './Modals';
import { TopNavigation } from './TopNavigation';
import { useLayout } from '../context/LayoutContext';
import { useTheme } from '../context/ThemeContext';

interface TopLayoutProps {
  children: React.ReactNode;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  adjustments: Adjustment[];
  setAdjustments: React.Dispatch<React.SetStateAction<Adjustment[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeModal: 'sale' | 'purchase' | 'adjustment' | 'product' | null;
  setActiveModal: (modal: 'sale' | 'purchase' | 'adjustment' | 'product' | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  stats: {
    totalStock: number;
    lowStockCount: number;
    overStockCount: number;
    dailySales: number;
    mtdSales: number;
    mtdPurchases: number;
    lowStockItems: Product[];
    overStockItems: Product[];
    profit: number;
  };
}

export function TopLayout({
  children,
  products,
  setProducts,
  customers,
  suppliers,
  transactions,
  setTransactions,
  adjustments,
  setAdjustments,
  isSidebarOpen,
  setIsSidebarOpen,
  activeModal,
  setActiveModal,
  searchQuery,
  setSearchQuery,
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
  stats,
}: TopLayoutProps) {
  const { layoutPreference, setLayoutPreference } = useLayout();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] dark:bg-[#0d1117] bg-gray-50 text-[#c9d1d9] dark:text-[#c9d1d9] text-gray-900 font-sans selection:bg-[#2f81f7]/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Mobile Sidebar Navigation */}
      <aside className={`
        fixed lg:hidden top-0 left-0 z-50 h-screen w-72 bg-[#0d1117] dark:bg-[#0d1117] bg-white border-r border-[#30363d] dark:border-[#30363d] border-gray-200 p-6 flex flex-col gap-8 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] rounded-xl flex items-center justify-center shadow-lg shadow-[#2f81f7]/20">
              <ShoppingCart className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-black text-white dark:text-white text-gray-900 tracking-tight text-lg leading-none">RPA PRO</h1>
              <p className="text-[10px] text-[#8b949e] dark:text-[#8b949e] text-gray-500 uppercase tracking-[0.2em] mt-1">Intelligence</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-[#8b949e] dark:text-[#8b949e] text-gray-600 p-2">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-bold text-[#484f58] dark:text-[#484f58] text-gray-500 uppercase tracking-[0.2em] mt-2 mb-2">Menu</p>
          <NavItem href="/pages/dashboard" icon={LayoutDashboard} label="Overview" setIsSidebarOpen={setIsSidebarOpen} />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] dark:text-[#484f58] text-gray-500 uppercase tracking-[0.2em] mt-6 mb-2">Operations</p>
          <NavItem href="/pages/products" icon={Package} label="Inventory Control" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/transactions" icon={History} label="Logistics History" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/adjustments" icon={RefreshCw} label="Stock Adjustments" setIsSidebarOpen={setIsSidebarOpen} />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] dark:text-[#484f58] text-gray-500 uppercase tracking-[0.2em] mt-6 mb-2">Relationships</p>
          <NavItem href="/pages/customers" icon={Users} label="Customer Base" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/suppliers" icon={Truck} label="Supply Chain" setIsSidebarOpen={setIsSidebarOpen} />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] dark:text-[#484f58] text-gray-500 uppercase tracking-[0.2em] mt-6 mb-2">Accounting</p>
          <NavItem href="/pages/reports" icon={ClipboardList} label="Performance Data" setIsSidebarOpen={setIsSidebarOpen} />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] dark:text-[#484f58] text-gray-500 uppercase tracking-[0.2em] mt-6 mb-2">Administration</p>     
          <NavItem href="/pages/system-settings" icon={SettingsIcon} label="System Settings" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/user-management" icon={UserCog} label="User Management" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/role-management" icon={ShieldCheck} label="Role Management" setIsSidebarOpen={setIsSidebarOpen} />
        </nav>
      </aside>

      {/* Top Navigation */}
      <TopNavigation setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117] dark:bg-[#0d1117] bg-white">
        {/* Header */}
        <header className="h-20 border-b border-[#30363d] dark:border-[#30363d] border-gray-200 flex items-center justify-between px-6 lg:px-10 bg-[#0d1117]/80 dark:bg-[#0d1117]/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLayoutPreference(layoutPreference === 'side' ? 'top' : 'side')} 
              className="p-2.5 text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 rounded-xl transition-all"
            >
              {layoutPreference === 'side' ? 'Switch to Top Nav' : 'Switch to Side Nav'}
            </button>
            <div className="hidden md:flex items-center gap-3 bg-[#161b22] dark:bg-[#161b22] bg-gray-100 border border-[#30363d] dark:border-[#30363d] border-gray-300 px-4 py-2.5 rounded-xl w-64 lg:w-96 transition-all focus-within:border-[#2f81f7] focus-within:ring-4 focus-within:ring-[#2f81f7]/10">
              <Search size={18} className="text-[#484f58] dark:text-[#484f58] text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products, TRX, or customers..." 
                className="bg-transparent border-none outline-none text-sm w-full text-[#c9d1d9] dark:text-[#c9d1d9] text-gray-900 placeholder-[#484f58] dark:placeholder-[#484f58] placeholder-gray-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider">System Online</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 rounded-xl transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] dark:bg-[#161b22] bg-gray-100 rounded-xl border border-[#30363d] dark:border-[#30363d] border-gray-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] flex items-center justify-center text-white font-bold text-xs">
                M
              </div>
              <div className="hidden lg:block min-w-0">
                <p className="text-xs font-bold text-white dark:text-white text-gray-900 truncate">Manager Ops</p>
                <p className="text-[10px] text-[#8b949e] dark:text-[#8b949e] text-gray-600 uppercase">Admin Tier 1</p>
              </div>
              <SettingsIcon size={16} className="text-[#484f58] dark:text-[#484f58] text-gray-400 cursor-pointer hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors" />
            </div>
            <button className="p-2.5 text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 rounded-xl transition-all relative">
              <AlertTriangle size={20} className={stats.lowStockCount > 0 ? 'text-[#f85149]' : ''} />
              {stats.lowStockCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#f85149] rounded-full border-2 border-[#0d1117] dark:border-[#0d1117] border-white" />
              )}
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 lg:p-10 overflow-y-auto h-[calc(100vh-80px)] bg-[#0d1117] dark:bg-[#0d1117] bg-gray-50">
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
  );
}



