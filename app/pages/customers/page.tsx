"use client";

import React, { useState } from 'react';
import {
  UserPlus,
} from 'lucide-react';
import { Customer } from '../../types'; // Adjusted import path for types
import { INITIAL_CUSTOMERS } from '../../mockData';

interface CustomerViewProps {
  // customers: Customer[]; // No longer a prop
}

export default function CustomerPage() {
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);

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
        {customers.map((c: Customer) => (
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

