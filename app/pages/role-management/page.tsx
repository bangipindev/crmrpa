"use client";

import React, { useContext, useEffect, useRef } from 'react';
import { roles } from '../../mockData';
import { Tabulator } from 'tabulator-tables';

export default function RoleManagementPage() {

  const roleTableRef = useRef(null);

  useEffect(() => {
    if (roleTableRef.current) {
      new Tabulator(roleTableRef.current, {
        data: roles,
        layout: 'fitColumns',
        renderHorizontal: "virtual",
        columns: [
          { title: 'ID', field: 'id', width: 50 },
          { title: 'Name', field: 'name' },
          { title: 'Description', field: 'description' },
        ],
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white tracking-tight">Role Management</h1>
      <p className="text-[#8b949e] font-medium">Define and assign roles to users.</p>
      <div ref={roleTableRef}></div>
    </div>
  );
}



