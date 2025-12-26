"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  History,
  Layers,
  DollarSign,
  Settings,
  X,
  CheckCircle2,
  Trash2,
  Menu,
  MoreVertical,
  FileText,
  PlusCircle,
  PieChart,
  Calendar,
  RefreshCw,
  UserPlus,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

// --- Types ---
type View = 'dashboard' | 'products' | 'customers' | 'suppliers' | 'transactions' | 'reports' | 'adjustments';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: 'Kg' | 'Ekor' | 'Pack';
  stock: number;
  minStock: number;
  maxStock: number;
  buyPrice: number;
  sellPrice: number;
  agentPrice: number;
  distributorPrice: number;
}

interface Customer {
  id: string;
  name: string;
  type: 'Retail' | 'Agent' | 'Distributor';
  phone: string;
  address: string;
  totalOrders: number;
  debt: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  location: string;
  reliability: number;
}

interface TransactionItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'Purchase' | 'Sale';
  entityName: string;
  total: number;
  items: TransactionItem[];
  status: 'Completed' | 'Pending';
}

interface Adjustment {
  id: string;
  date: string;
  productId: string;
  productName: string;
  qtyChange: number;
  reason: 'Shrinkage' | 'Damaged' | 'Bonus' | 'Correction';
  user: string;
}

// --- Initial Mock Data ---
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: 'AYM-001', name: 'Ayam Broiler Hidup', category: 'Live', unit: 'Kg', stock: 450, minStock: 100, maxStock: 1000, buyPrice: 22000, sellPrice: 25000, agentPrice: 24000, distributorPrice: 23500 },
  { id: '2', code: 'KKS-001', name: 'Karkas Whole 0.8kg', category: 'Carcass', unit: 'Ekor', stock: 120, minStock: 50, maxStock: 500, buyPrice: 28000, sellPrice: 32000, agentPrice: 31000, distributorPrice: 30000 },
  { id: '3', code: 'PRT-001', name: 'Sayap Ayam', category: 'Parting', unit: 'Kg', stock: 25, minStock: 30, maxStock: 200, buyPrice: 15000, sellPrice: 18000, agentPrice: 17500, distributorPrice: 17000 },
  { id: '4', code: 'PRT-002', name: 'Paha Bawah', category: 'Parting', unit: 'Kg', stock: 1050, minStock: 20, maxStock: 1000, buyPrice: 32000, sellPrice: 38000, agentPrice: 37000, distributorPrice: 36000 },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Warung Bu Siti', type: 'Retail', phone: '0812345678', address: 'Pasar Baru', totalOrders: 45, debt: 0 },
  { id: 'c2', name: 'PT Food Nusantara', type: 'Distributor', phone: '0812333444', address: 'Kawasan Industri', totalOrders: 120, debt: 15000000 },
  { id: 'c3', name: 'Resto Ayam Penyet', type: 'Agent', phone: '0819998887', address: 'Pusat Kota', totalOrders: 88, debt: 250000 },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Farm Fresh Jaya', contact: '08111222333', location: 'Bogor', reliability: 98 },
  { id: 's2', name: 'Kemitraan Mandiri', contact: '08555666777', location: 'Sukabumi', reliability: 85 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-921', date: '2023-10-24 14:20', type: 'Purchase', entityName: 'Farm Fresh Jaya', total: 8500000, items: [], status: 'Completed' },
  { id: 'TRX-922', date: '2023-10-25 09:30', type: 'Sale', entityName: 'Warung Bu Siti', total: 750000, items: [], status: 'Completed' },
  { id: 'TRX-923', date: '2023-10-25 11:15', type: 'Sale', entityName: 'PT Food Nusantara', total: 12500000, items: [], status: 'Completed' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  const NavItem = ({ id, icon: Icon, label }: { id: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(id);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === id 
          ? 'bg-[#2f81f7] text-white shadow-lg shadow-[#2f81f7]/20 font-bold' 
          : 'text-[#8b949e] hover:bg-[#1f2937] hover:text-[#c9d1d9]'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </button>
  );

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

        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-2 mb-2">Analytics</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Operations</p>
          <NavItem id="products" icon={Package} label="Inventory Control" />
          <NavItem id="transactions" icon={History} label="Logistics History" />
          <NavItem id="adjustments" icon={RefreshCw} label="Stock Adjustments" />
          
          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Relationships</p>
          <NavItem id="customers" icon={Users} label="Customer Base" />
          <NavItem id="suppliers" icon={Truck} label="Supply Chain" />

          <p className="px-4 text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mt-6 mb-2">Accounting</p>
          <NavItem id="reports" icon={ClipboardList} label="Performance Data" />
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
            {currentView === 'dashboard' && <DashboardView stats={stats} transactions={transactions} setActiveModal={setActiveModal} />}
            {currentView === 'products' && <InventoryView products={products} setActiveModal={setActiveModal} />}
            {currentView === 'customers' && <CustomerView customers={customers} />}
            {currentView === 'suppliers' && <SupplierView suppliers={suppliers} />}
            {currentView === 'transactions' && <TransactionsView transactions={transactions} />}
            {currentView === 'reports' && <ReportsView stats={stats} />}
            {currentView === 'adjustments' && <AdjustmentView adjustments={adjustments} setActiveModal={setActiveModal} />}
          </div>
        </div>
      </main>

      {/* Dynamic Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in" onClick={() => setActiveModal(null)} />
          <div className="bg-[#161b22] border border-[#30363d] w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 overflow-hidden">
             <div className="p-6 border-b border-[#30363d] flex items-center justify-between bg-[#1c2128]">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeModal === 'sale' ? 'Record Sales Outbound' : 
                     activeModal === 'purchase' ? 'Procurement Inbound' : 
                     activeModal === 'adjustment' ? 'Stock Adjustment' : 'Register Product'}
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-1">Updating the live ledger and inventory database.</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-[#30363d] rounded-xl transition-colors">
                  <X size={20} />
                </button>
             </div>
             
             <div className="p-8 space-y-5">
                {/* Entity Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                    {activeModal === 'purchase' ? 'Supplier Source' : 'Customer Account'}
                  </label>
                  <select 
                    value={selectedCustId} 
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7] appearance-none"
                  >
                    {activeModal === 'purchase' ? (
                      suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                    ) : (
                      customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)
                    )}
                  </select>
                </div>

                {/* Product Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Inventory Item</label>
                  <select 
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7] appearance-none"
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.stock} {p.unit} Available</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Quantity / Weight</label>
                    <input 
                      type="number" 
                      value={trxQty}
                      onChange={(e) => setTrxQty(Number(e.target.value))}
                      placeholder="0.00" 
                      className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Unit</label>
                    <input disabled value={currentProduct?.unit || 'Kg'} className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-[#484f58] outline-none" />
                  </div>
                </div>

                {/* Price Preview */}
                <div className="p-4 bg-[#2f81f7]/5 border border-[#2f81f7]/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#2f81f7] uppercase">Calculated Total</p>
                    <p className="text-xl font-black text-white">Rp {(activeModal === 'purchase' ? (currentProduct?.buyPrice || 0) * trxQty : calculatedPrice * trxQty).toLocaleString()}</p>
                  </div>
                  {activeModal === 'sale' && (
                    <span className="px-3 py-1 bg-[#2f81f7] text-white text-[10px] font-bold rounded-lg uppercase">
                      {currentCustomer?.type} PRICING
                    </span>
                  )}
                </div>
             </div>

             <div className="p-6 bg-[#0d1117]/50 border-t border-[#30363d] flex gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3.5 text-[#8b949e] font-bold hover:text-white transition-colors">Discard</button>
                <button 
                  onClick={handleAddTransaction}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-[#2f81f7] to-[#1f6feb] text-white font-black rounded-2xl shadow-xl shadow-[#2f81f7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {activeModal === 'purchase' ? 'Post Purchase' : 'Process Transaction'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- View Sub-Components ---

function DashboardView({ stats, transactions, setActiveModal }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Operational Pulse</h1>
          <p className="text-[#8b949e] font-medium">Real-time intelligence from slaughterhouse and distribution.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setActiveModal('purchase')}
            className="flex-1 md:flex-none px-6 py-3.5 bg-[#161b22] text-[#8b949e] border border-[#30363d] rounded-2xl text-sm font-black hover:text-white hover:border-[#484f58] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <Truck size={18} />
            Purchase Inbound
          </button>
           <button 
            onClick={() => setActiveModal('sale')}
            className="flex-1 md:flex-none px-6 py-3.5 bg-white text-[#0d1117] rounded-2xl text-sm font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
          >
            <Plus size={18} strokeWidth={3} />
            POS Sale
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Global Inventory" value={`${stats.totalStock.toLocaleString()} Kg`} icon={Layers} color="#2f81f7" trend="Live" />
        <StatCard label="Daily Omzet" value={`Rp ${stats.dailySales.toLocaleString()}`} icon={DollarSign} color="#3fb950" trend="+12%" />
        <StatCard label="Monthly Procurement" value={`Rp ${stats.mtdPurchases.toLocaleString()}`} icon={TrendingUp} color="#d29922" trend="MTD" />
        <StatCard label="Alerts (Low/Over)" value={`${stats.lowStockCount}/${stats.overStockCount}`} icon={AlertTriangle} color="#f85149" isAlert={stats.lowStockCount > 0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-[#161b22] border border-[#30363d] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2f81f7]/10 flex items-center justify-center text-[#2f81f7]">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Production Flow</h3>
                <p className="text-xs text-[#8b949e]">Daily items processed vs sold (Last 7 days)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 mr-4">
                 <div className="w-2 h-2 rounded-full bg-[#2f81f7] shadow-[0_0_8px_rgba(47,129,247,0.5)]" />
                 <span className="text-[10px] font-bold text-[#8b949e] uppercase">Inbound</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_8px_rgba(63,185,80,0.5)]" />
                 <span className="text-[10px] font-bold text-[#8b949e] uppercase">Outbound</span>
               </div>
            </div>
          </div>
          
          <div className="h-64 w-full flex items-end gap-3 sm:gap-6 px-2">
            {[35, 75, 55, 90, 45, 100, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full flex gap-1.5 items-end justify-center">
                   <div style={{ height: `${h}%` }} className="w-3 bg-[#2f81f7] rounded-full transition-all duration-700 group-hover:scale-y-110 opacity-80 group-hover:opacity-100" />
                   <div style={{ height: `${h * 0.7}%` }} className="w-3 bg-[#3fb950] rounded-full transition-all duration-700 group-hover:scale-y-110 group-hover:bg-[#2ea043] shadow-[0_0_15px_rgba(63,185,80,0.2)]" />
                </div>
                <span className="text-[9px] text-[#484f58] font-black uppercase tracking-widest">D-{6-i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Critical Stock Monitoring</h3>
              <Package size={18} className="text-[#484f58]" />
            </div>
            <div className="space-y-4">
              {stats.lowStockItems.length > 0 ? (
                 stats.lowStockItems.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#f85149]/50 transition-all cursor-pointer group/item">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f85149]/10 flex items-center justify-center text-[#f85149] font-bold text-xs uppercase">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-[#8b949e]">{p.stock} {p.unit} remaining</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#f85149] uppercase">Low</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-xs text-[#484f58] font-bold uppercase">All stock healthy</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2f81f7] to-[#1f6feb] rounded-3xl p-6 text-white shadow-2xl shadow-[#2f81f7]/20">
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Estimated P/L (MTD)</h4>
            <p className="text-2xl font-black mb-6">Rp {stats.profit.toLocaleString()}</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all">
              Download Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryView({ products, setActiveModal }: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Inventory Hub</h1>
          <p className="text-[#8b949e] font-medium">Manage pricing tiers and live stock levels.</p>
        </div>
        <button 
          onClick={() => setActiveModal('product')}
          className="px-5 py-3 bg-[#2f81f7] text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-[#2f81f7]/20"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c2128] text-[#8b949e] text-[10px] uppercase font-black tracking-widest border-b border-[#30363d]">
                <th className="px-8 py-6">Product Identification</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Stock Status</th>
                <th className="px-8 py-6 text-right">Buy Price</th>
                <th className="px-8 py-6 text-right">Sell / Agent / Dist</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {products.map((p: any) => {
                const isOver = p.stock > p.maxStock;
                const isLow = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-[#1f2937]/30 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl border border-[#30363d] flex items-center justify-center font-black text-lg ${isLow ? 'bg-[#f85149]/10 text-[#f85149]' : isOver ? 'bg-[#d29922]/10 text-[#d29922]' : 'bg-[#0d1117] text-[#2f81f7]'}`}>
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#8b949e] uppercase mt-0.5">{p.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-[#21262d] text-[#8b949e] text-[10px] font-black rounded-lg border border-[#30363d] uppercase tracking-tighter">{p.category}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={isLow ? 'text-[#f85149]' : isOver ? 'text-[#d29922]' : 'text-[#8b949e]'}>
                            {p.stock} <span className="font-normal opacity-50 uppercase">{p.unit}</span>
                          </span>
                          <span className={isLow ? 'text-[#f85149]' : isOver ? 'text-[#d29922]' : 'text-[#3fb950]'}>
                            {Math.round((p.stock/p.maxStock) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-32 bg-[#0d1117] rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${Math.min((p.stock / p.maxStock) * 100, 100)}%` }} 
                              className={`h-full transition-all duration-1000 ${isLow ? 'bg-[#f85149]' : isOver ? 'bg-[#d29922]' : 'bg-[#2f81f7]'}`} 
                            />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-white text-sm">Rp {p.buyPrice.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white flex items-center justify-end gap-1.5 font-bold">Retail <span className="text-[#2f81f7]">Rp {p.sellPrice.toLocaleString()}</span></p>
                        <p className="text-[10px] text-[#8b949e] flex items-center justify-end gap-1.5 font-bold">Agent <span className="text-[#3fb950]">Rp {p.agentPrice.toLocaleString()}</span></p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 hover:bg-[#30363d] rounded-xl text-[#484f58] hover:text-white transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })} 
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerView({ customers }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Customer Network</h1>
          <p className="text-[#8b949e] font-medium">Manage pricing tiers and trade credit levels.</p>
        </div>
        <button className="px-5 py-3 bg-[#3fb950] text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-[#3fb950]/20">
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c: any) => (
          <div key={c.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl hover:border-[#484f58] transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-xl font-black text-[#2f81f7]">
                {c.name[0]}
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.type === 'Distributor' ? 'bg-[#2f81f7]/10 text-[#2f81f7]' : c.type === 'Agent' ? 'bg-[#3fb950]/10 text-[#3fb950]' : 'bg-[#8b949e]/10 text-[#8b949e]'}`}>
                {c.type}
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-[#2f81f7] transition-colors">{c.name}</h3>
            <p className="text-xs text-[#8b949e] font-medium mt-2">{c.address}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#30363d]">
               <div>
                 <p className="text-[10px] uppercase font-black text-[#484f58] tracking-widest mb-1">Trade Vol</p>
                 <p className="text-lg font-black text-white">{c.totalOrders} TRX</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] uppercase font-black text-[#484f58] tracking-widest mb-1">Receivables</p>
                 <p className={`text-lg font-black ${c.debt > 0 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>Rp {c.debt.toLocaleString()}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupplierView({ suppliers }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Supply Chain</h1>
          <p className="text-[#8b949e] font-medium">Manage livestock vendors and reliability scores.</p>
        </div>
        <button className="px-5 py-3 bg-[#161b22] text-[#c9d1d9] border border-[#30363d] rounded-2xl text-sm font-black flex items-center gap-2">
          <Truck size={18} />
          Register Supplier
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((s: any) => (
          <div key={s.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#0d1117] rounded-2xl flex items-center justify-center text-2xl font-black text-[#2f81f7] border border-[#30363d]">
                   {s.name[0]}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-white">{s.name}</h3>
                   <p className="text-xs text-[#8b949e]">{s.location}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] uppercase font-black text-[#484f58] tracking-widest">Reliability</p>
                 <p className="text-xl font-black text-[#3fb950]">{s.reliability}%</p>
               </div>
             </div>
             <div className="flex gap-4">
                <button className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white hover:border-[#484f58]">Call Supplier</button>
                <button className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white hover:border-[#484f58]">Order History</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionsView({ transactions }: any) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white tracking-tight">Logistics History</h1>
      <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c2128] text-[#8b949e] text-[10px] uppercase font-black tracking-widest border-b border-[#30363d]">
                <th className="px-8 py-6">Reference & Date</th>
                <th className="px-8 py-6">Direction</th>
                <th className="px-8 py-6">Counterparty</th>
                <th className="px-8 py-6 text-right">Grand Total</th>
                <th className="px-8 py-6 text-center">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-[#1f2937]/30 transition-all cursor-pointer group">
                  <td className="px-8 py-5 font-black text-sm text-white">
                    {t.id}
                    <p className="text-[10px] text-[#484f58] font-bold mt-1 uppercase">{t.date}</p>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 w-fit ${t.type === 'Sale' ? 'bg-[#3fb950]/10 text-[#3fb950]' : 'bg-[#2f81f7]/10 text-[#2f81f7]'}`}>
                       {t.type === 'Sale' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                       {t.type}
                     </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-white">{t.entityName}</td>
                  <td className="px-8 py-5 text-right font-black text-white">Rp {t.total.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 text-[#3fb950] text-[10px] font-black uppercase bg-[#3fb950]/5 py-2 rounded-full border border-[#3fb950]/10">
                      <CheckCircle2 size={12} />
                      {t.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdjustmentView({ adjustments, setActiveModal }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Shrinkage & Audit</h1>
          <p className="text-[#8b949e] font-medium">Track weight loss (susut) and stock corrections.</p>
        </div>
        <button 
          onClick={() => setActiveModal('adjustment')}
          className="px-5 py-3 bg-[#d29922] text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-[#d29922]/20"
        >
          <RefreshCw size={18} />
          Log Adjustment
        </button>
      </div>

      {adjustments.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] border-dashed rounded-3xl p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#0d1117] flex items-center justify-center text-[#30363d] mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">Clean Audit Logs</h3>
          <p className="text-[#8b949e] text-sm mt-2 max-w-xs">Your stock levels are currently consistent with your transaction history.</p>
        </div>
      ) : (
        <div className="bg-[#161b22] rounded-3xl overflow-hidden">{/* Adjustment history table */}</div>
      )}
    </div>
  );
}

function ReportsView({ stats }: any) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <h1 className="text-3xl font-black text-white tracking-tight">Performance Analytics</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReportCard label="Gross Revenue (MTD)" value={`Rp ${stats.mtdSales.toLocaleString()}`} icon={TrendingUp} color="#2f81f7" />
          <ReportCard label="Gross Margin Est." value={`Rp ${stats.profit.toLocaleString()}`} icon={PieChart} color="#3fb950" />
          <ReportCard label="Product Movement" value={`${(stats.mtdSales/30000).toFixed(0)} Units`} icon={Package} color="#d29922" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <Download size={40} className="text-[#2f81f7] mb-6" />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Export Ledger Data</h3>
            <p className="text-[#8b949e] mt-2 mb-8 max-w-sm font-medium">Compile all sales, purchases, and shrinkage logs into a single accounting document.</p>
            <div className="flex gap-4 w-full sm:w-auto">
               <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 sm:flex-none px-8 py-4 bg-[#2f81f7] text-white font-black rounded-2xl shadow-xl shadow-[#2f81f7]/20 flex items-center justify-center gap-2"
               >
                 {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
                 {isExporting ? 'Generating...' : 'Export PDF'}
               </button>
               <button className="flex-1 sm:flex-none px-8 py-4 bg-[#21262d] text-white font-black rounded-2xl border border-[#30363d]">Export CSV</button>
            </div>
         </div>

         <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#3fb950]/10 rounded-2xl flex items-center justify-center text-[#3fb950]">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
                <p className="text-xs text-[#8b949e]">Market behavior indicators</p>
              </div>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8b949e] font-bold">Retail Conversion</span>
                  <span className="text-sm text-white font-black">42%</span>
               </div>
               <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-[#3fb950]" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8b949e] font-bold">Agent Loyalty Rate</span>
                  <span className="text-sm text-white font-black">88%</span>
               </div>
               <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                  <div className="h-full w-[88%] bg-[#2f81f7]" />
               </div>
            </div>
         </div>
       </div>
    </div>
  );
}

// --- Utilities ---

function StatCard({ label, value, icon: Icon, color, trend, isAlert }: any) {
  return (
    <div className={`bg-[#161b22] border ${isAlert ? 'border-[#f85149]/30' : 'border-[#30363d]'} p-6 rounded-3xl hover:border-[#484f58] transition-all group relative overflow-hidden shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-[#0d1117] border border-[#30363d] transition-transform group-hover:scale-110">
          <Icon size={20} style={{ color }} />
        </div>
        {trend && <span className="text-[10px] font-black px-2.5 py-1 bg-white/5 text-[#8b949e] rounded-lg tracking-widest uppercase">{trend}</span>}
      </div>
      <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </div>
  );
}

function ReportCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl flex items-center justify-between group cursor-default shadow-xl">
      <div className="space-y-1">
        <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center transition-transform group-hover:rotate-12">
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  );
}
