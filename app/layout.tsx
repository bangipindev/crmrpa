"use client";

import React from 'react';
import type { Metadata } from 'next'
import { Montserrat } from "next/font/google";
import "./globals.css";

import { SideLayout } from './components/SideLayout';
import { TopLayout } from './components/TopLayout';
import { DynamicTitle } from './components/DynamicTitle';
import { ModalProvider } from './context/ModalContext';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { UIStateProvider } from './context/UIStateContext';
import { POSProvider } from './context/POSContext';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'], 
  display: 'swap',
});

// export const metadata: Metadata = {
//   title: 'Ekspedisi App',
//   description: 'Created with Next.js',
//   generator: 'Next ',
// }

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { layoutPreference } = useLayout();

  return (
    <>
      <DynamicTitle />
      {layoutPreference === 'side' ? (
        <SideLayout>
          {children}
        </SideLayout>
      ) : (
        <TopLayout>
          {children}
        </TopLayout>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>RPA PRO - Intelligence</title>
        <meta name="description" content="RPA PRO Intelligence - Advanced Business Management System" />
      </head>
      <body
        className={`${montserrat.className} antialiased`}
      >
        <ThemeProvider>
          <DataProvider>
            <UIStateProvider>
              <ModalProvider>
                <POSProvider>
                  <LayoutProvider>
                    <LayoutContent>
                      {children}
                    </LayoutContent>
                  </LayoutProvider>
                </POSProvider>
              </ModalProvider>
            </UIStateProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}