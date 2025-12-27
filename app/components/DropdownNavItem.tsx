"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  href: string;
  icon: any;
  label: string;
}

interface DropdownNavItemProps {
  label: string;
  icon: any;
  items: DropdownItem[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function DropdownNavItem({ label, icon: Icon, items, setIsSidebarOpen }: DropdownNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);


  // Check if any child item is active
  const isActive = items.some(item => pathname === item.href);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
  
      setDropdownPos({
        top: rect.bottom + 6, // jarak dropdown
        left: rect.left,
      });
    }
  }, [isOpen]);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
          isActive
            ? 'bg-[#2f81f7] text-white shadow-lg shadow-[#2f81f7]/20 font-bold' 
            : 'text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 hover:text-[#c9d1d9] dark:hover:text-[#c9d1d9] hover:text-gray-900'
        }`}
      >
        <Icon size={18} />
        <span className="text-sm">{label}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && dropdownPos && (
        <div className="fixed top-full left-0 mt-1 w-56 bg-[#161b22] dark:bg-[#161b22] bg-white border border-[#30363d] dark:border-[#30363d] border-gray-200 rounded-xl shadow-xl z-[10000]" style={{
          top: dropdownPos.top,
          left: dropdownPos.left,
        }}>
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isItemActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  isItemActive
                    ? 'bg-[#2f81f7]/20 text-[#2f81f7] font-bold border-l-2 border-[#2f81f7]' 
                    : 'text-[#8b949e] dark:text-[#8b949e] text-gray-600 hover:bg-[#1f2937] dark:hover:bg-[#1f2937] hover:bg-gray-100 hover:text-[#c9d1d9] dark:hover:text-[#c9d1d9] hover:text-gray-900'
                }`}
              >
                <ItemIcon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

