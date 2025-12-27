"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Mapping path ke title
const pageTitles: Record<string, string> = {
  '/pages/dashboard': 'Overview - RPA PRO',
  '/pages/products': 'Inventory Control - RPA PRO',
  '/pages/transactions': 'Logistics History - RPA PRO',
  '/pages/adjustments': 'Stock Adjustments - RPA PRO',
  '/pages/customers': 'Customer Base - RPA PRO',
  '/pages/suppliers': 'Supply Chain - RPA PRO',
  '/pages/reports': 'Performance Data - RPA PRO',
  '/pages/system-settings': 'System Settings - RPA PRO',
  '/pages/user-management': 'User Management - RPA PRO',
  '/pages/role-management': 'Role Management - RPA PRO',
};

const defaultTitle = 'RPA PRO - Intelligence';

export function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Update document title berdasarkan pathname
    const title = pageTitles[pathname] || defaultTitle;
    document.title = title;

    // Update meta description jika diperlukan
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `RPA PRO Intelligence - ${title.split(' - ')[0]}`);
    } else {
      // Create meta description jika belum ada
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `RPA PRO Intelligence - ${title.split(' - ')[0]}`;
      document.head.appendChild(meta);
    }
  }, [pathname]);

  return null;
}

