"use client";

import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  MoreVertical,
} from 'lucide-react';
import { Product } from '../../types'; // Adjusted import path for types
import { INITIAL_PRODUCTS } from '../../mockData';
import { useModal } from '../../context/ModalContext';

export default function InventoryPage() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const { setActiveModal } = useModal();

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
              {products.map((p: Product) => {
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

