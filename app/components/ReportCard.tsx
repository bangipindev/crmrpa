import React from 'react';

interface ReportCardProps {
  label: string;
  value: string;
  icon: any; 
  color: string;
}

export function ReportCard({ label, value, icon: Icon, color }: ReportCardProps) {
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

