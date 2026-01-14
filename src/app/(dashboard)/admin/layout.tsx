'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/90 backdrop-blur-sm text-slate-50 rounded-lg shadow-lg border border-slate-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:sticky md:top-0
        w-64 md:w-72
        h-screen
        bg-gradient-to-b from-slate-900 to-slate-800
        border-r border-slate-700/50
        transition-transform duration-300 ease-in-out
        z-40 md:z-10
        flex-shrink-0
      `}>
        <div className="h-full overflow-y-auto">
          <AdminSidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className={`
        flex-1
        min-h-screen
        overflow-y-auto
        transition-all duration-300
        ${sidebarOpen ? 'ml-0' : 'ml-0 md:ml-0'}
      `}>
        <div className="h-full w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}