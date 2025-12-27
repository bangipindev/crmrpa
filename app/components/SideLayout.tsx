"use client";

import React from 'react';
import {
  ShoppingCart,
  Search,
  AlertTriangle,
  Menu,
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

import { Product, Customer, Supplier, Transaction, Adjustment } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS } from '../mockData';

import { NavItem } from './NavItem';
import { Modals } from './Modals';
import { useLayout } from '../context/LayoutContext';

interface SideLayoutProps {
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

export function SideLayout({
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
}: SideLayoutProps) {
  const { layoutPreference, setLayoutPreference } = useLayout();

  return (
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

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-2 mb-2">Menu</p>
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
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Administration</p>     
          <NavItem href="/pages/system-settings" icon={SettingsIcon} label="System Settings" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/user-management" icon={UserCog} label="User Management" setIsSidebarOpen={setIsSidebarOpen} />
          <NavItem href="/pages/role-management" icon={ShieldCheck} label="Role Management" setIsSidebarOpen={setIsSidebarOpen} />
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
            <SettingsIcon size={16} className="text-[#484f58] cursor-pointer hover:text-white transition-colors" />
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
            <button 
              onClick={() => setLayoutPreference(layoutPreference === 'side' ? 'top' : 'side')} 
              className="p-2.5 text-[#8b949e] hover:text-white hover:bg-[#1f2937] rounded-xl transition-all"
            >
              {layoutPreference === 'side' ? 'Switch to Top Nav' : 'Switch to Side Nav'}
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
  );
}



