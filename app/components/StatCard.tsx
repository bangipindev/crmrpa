import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: any; 
  color: string;
  trend?: string;
  isAlert?: boolean;
}

export function StatCard({ label, value, icon: Icon, color, trend, isAlert }: StatCardProps) {
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

