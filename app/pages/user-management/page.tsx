"use client";

import React, { useEffect, useRef } from 'react';
import { Tabulator } from 'tabulator-tables';
import { users } from '../../mockData';
import { Users } from '@/app/types';
import { MoreVertical } from 'lucide-react';

export default function UserManagementPage() {
  const userTableRef = useRef(null);

  useEffect(() => {
    if (userTableRef.current) {
      new Tabulator(userTableRef.current, {
        data: users,
        layout: 'fitColumns',
        renderHorizontal:"virtual",
        columns: [
          { title: 'ID', field: 'id', width: 50 },
          { title: 'Name', field: 'name' },
          { title: 'Email', field: 'email' },
          { title: 'Role', field: 'role' },
        ],
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
      <p className="text-[#8b949e] font-medium">Manage user accounts and permissions.</p>
      {/* <div ref={userTableRef}></div> */}

      <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c2128] text-[#8b949e] text-[10px] uppercase font-black tracking-widest border-b border-[#30363d]">
                <th className="px-8 py-6">Id</th>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6">Email</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {users.map((p: Users) => {
                return (
                  <tr key={p.id} className="hover:bg-[#1f2937]/30 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl border border-[#30363d] flex items-center justify-center font-black text-lg '}`}>
                          {p.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-black text-white">{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-[#21262d] text-[#8b949e] text-[10px] font-black rounded-lg border border-[#30363d] uppercase tracking-tighter">{p.email}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-white text-sm">{p.role}</td>
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



