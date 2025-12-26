"use client";

import React, { useState } from 'react';
import {
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Adjustment } from '../../types'; // Adjusted import path for types
// import { INITIAL_ADJUSTMENTS } from '../../mockData'; // Assuming no initial adjustments data yet
import { useModal } from '../../context/ModalContext';

export default function AdjustmentPage() {
  const [adjustments] = useState<Adjustment[]>([]); // Initialize as empty for now
  const { setActiveModal } = useModal();

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

