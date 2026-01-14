'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import LoadingSpinner from './components/LoadingSpinner';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-50">
      {/* Fixed Sidebar - NEVER overlaps */}
      <aside className="w-64 bg-slate-800 fixed h-screen overflow-y-auto border-r border-slate-700 z-10">
        <AdminSidebar />
      </aside>
      
      {/* Main Content - Starts after sidebar */}
      <main className="flex-1 ml-64 bg-slate-900 min-h-screen overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}