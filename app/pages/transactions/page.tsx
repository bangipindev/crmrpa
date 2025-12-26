"use client";

import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { Transaction } from '../../types'; // Adjusted import path for types
import { INITIAL_TRANSACTIONS } from '../../mockData';

interface TransactionsViewProps {
  // transactions: Transaction[]; // No longer a prop
}

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

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
              {transactions.map((t: Transaction) => (
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

