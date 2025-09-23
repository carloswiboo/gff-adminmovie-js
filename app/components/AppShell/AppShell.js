"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import TopNavbar from '../TopNavbar/TopNavbar';

export default function AppShell({ children }) {
  const pathname = usePathname();

  // Hide sidebar and top navbar on the root page ("/") — show on other pages
  const isRoot = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isRoot && <TopNavbar />}

      <div className="flex flex-1">
        {!isRoot && <Sidebar />}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
