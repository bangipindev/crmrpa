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
  Briefcase,
  Handshake,
  Calculator,
  Building2,
  Menu,
} from 'lucide-react';
import { NavItem } from './NavItem';
import { DropdownNavItem } from './DropdownNavItem';

interface TopNavigationProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}

export function TopNavigation({ setIsSidebarOpen, isSidebarOpen }: TopNavigationProps) {
  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar px-4 lg:px-6 xl:px-10 py-4 bg-[#0d1117] dark:bg-[#0d1117] bg-white border-b border-[#30363d] dark:border-[#30363d] border-gray-200">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="lg:hidden text-[#8b949e] dark:text-[#8b949e] text-gray-600 p-2 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 rounded-lg transition-colors mr-2"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#2f81f7] to-[#1f6feb] rounded-xl flex items-center justify-center shadow-lg shadow-[#2f81f7]/20">
          <ShoppingCart className="text-white" size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-white dark:text-white text-gray-900 tracking-tight text-lg leading-none">RPA PRO</h1>
          <p className="text-[10px] text-[#8b949e] dark:text-[#8b949e] text-gray-500 uppercase tracking-[0.2em] mt-1">Intelligence</p>
        </div>
      </div>
      
      {/* Desktop Navigation - Hidden on Mobile */}
      <div className="hidden lg:flex items-center gap-0.5">
        <NavItem href="/pages/dashboard" icon={LayoutDashboard} label="Overview" setIsSidebarOpen={setIsSidebarOpen} />
        
        <DropdownNavItem
          label="Operations"
          icon={Briefcase}
          items={[
            { href: "/pages/products", icon: Package, label: "Inventory Control" },
            { href: "/pages/transactions", icon: History, label: "Logistics History" },
            { href: "/pages/adjustments", icon: RefreshCw, label: "Stock Adjustments" },
          ]}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <DropdownNavItem
          label="Relationships"
          icon={Handshake}
          items={[
            { href: "/pages/customers", icon: Users, label: "Customer Base" },
            { href: "/pages/suppliers", icon: Truck, label: "Supply Chain" },
          ]}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <DropdownNavItem
          label="Accounting"
          icon={Calculator}
          items={[
            { href: "/pages/reports", icon: ClipboardList, label: "Performance Data" },
          ]}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <DropdownNavItem
          label="Administration"
          icon={Building2}
          items={[
            { href: "/pages/system-settings", icon: SettingsIcon, label: "System Settings" },
            { href: "/pages/user-management", icon: UserCog, label: "User Management" },
            { href: "/pages/role-management", icon: ShieldCheck, label: "Role Management" },
          ]}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </nav>
  );
}



