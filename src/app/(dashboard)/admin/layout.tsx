import { ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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