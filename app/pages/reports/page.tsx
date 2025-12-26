"use client";

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  PieChart,
  Package,
  Download,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { ReportCard } from '../../components/ReportCard'; // Adjusted import path for ReportCard
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from '../../mockData';
import { Product, Transaction } from '../../types';

interface ReportsPageProps {
  // stats: {
  //   mtdSales: number;
  //   profit: number;
  // }; // No longer a prop
}

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

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

