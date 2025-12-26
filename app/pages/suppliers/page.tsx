"use client";

import React, { useState } from 'react';
import {
  Truck,
} from 'lucide-react';
import { Supplier } from '../../types'; // Adjusted import path for types
import { INITIAL_SUPPLIERS } from '../../mockData';

interface SupplierPageProps {
  // suppliers: Supplier[]; // No longer a prop
}

export default function SupplierPage() {
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

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
        {suppliers.map((s: Supplier) => (
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

