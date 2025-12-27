import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: any;
  label: string;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function NavItem({ href, icon: Icon, label, setIsSidebarOpen }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={() => setIsSidebarOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-[#2f81f7] text-white shadow-lg shadow-[#2f81f7]/20 font-bold' 
          : 'text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 hover:text-[#c9d1d9] dark:hover:text-[#c9d1d9] hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

