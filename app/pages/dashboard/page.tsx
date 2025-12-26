"use client";

import React, { useState, useMemo } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Truck,
  Layers,
  DollarSign,
} from 'lucide-react';
import { Transaction, Product } from '../../types';
import { StatCard } from '../../components/StatCard';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from '../../mockData';
import { useModal } from '../../context/ModalContext';

export default function DashboardPage() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const { setActiveModal } = useModal();

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

  // Placeholder for modal actions - actual modal logic still resides in RootLayout
  const handlePurchaseClick = () => { console.log('Purchase clicked on Dashboard'); setActiveModal('purchase'); };
  const handleSaleClick = () => { console.log('Sale clicked on Dashboard'); setActiveModal('sale'); };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Operational Pulse</h1>
          <p className="text-[#8b949e] font-medium">Real-time intelligence from slaughterhouse and distribution.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={handlePurchaseClick}
            className="flex-1 md:flex-none px-6 py-3.5 bg-[#161b22] text-[#8b949e] border border-[#30363d] rounded-2xl text-sm font-black hover:text-white hover:border-[#484f58] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <Truck size={18} />
            Purchase Inbound
          </button>
           <button 
            onClick={handleSaleClick}
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
