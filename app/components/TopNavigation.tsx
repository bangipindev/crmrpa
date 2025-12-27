"use client";

import React from 'react';
import {
  LayoutDashboard,
  Package,
  History,
  RefreshCw,
  Users,
  Truck,
  ClipboardList,
  Settings as SettingsIcon,
  UserCog,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { NavItem } from './NavItem';

interface TopNavigationProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function TopNavigation({ setIsSidebarOpen }: TopNavigationProps) {
  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-6 lg:px-10 py-4 bg-[#0d1117] border-b border-[#30363d]">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] rounded-xl flex items-center justify-center shadow-lg shadow-[#2f81f7]/20">
          <ShoppingCart className="text-white" size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-white tracking-tight text-lg leading-none">RPA PRO</h1>
          <p className="text-[10px] text-[#8b949e] uppercase tracking-[0.2em] mt-1">Intelligence</p>
        </div>
      </div>
      <NavItem href="/pages/dashboard" icon={LayoutDashboard} label="Overview" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/products" icon={Package} label="Inventory Control" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/transactions" icon={History} label="Logistics History" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/adjustments" icon={RefreshCw} label="Stock Adjustments" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/customers" icon={Users} label="Customer Base" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/suppliers" icon={Truck} label="Supply Chain" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/reports" icon={ClipboardList} label="Performance Data" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/system-settings" icon={SettingsIcon} label="System Settings" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/user-management" icon={UserCog} label="User Management" setIsSidebarOpen={setIsSidebarOpen} />
      <NavItem href="/pages/role-management" icon={ShieldCheck} label="Role Management" setIsSidebarOpen={setIsSidebarOpen} />
    </nav>
  );
}



