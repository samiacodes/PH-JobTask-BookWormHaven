'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  BookOpen, 
  Tag, 
  Users, 
  MessageSquare, 
  Video, 
  Settings,
  User
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard/Overview' },
  { href: '/admin/books', icon: BookOpen, label: 'Manage Books' },
  { href: '/admin/genres', icon: Tag, label: 'Manage Genres' },
  { href: '/admin/users', icon: Users, label: 'Manage Users' },
  { href: '/admin/reviews', icon: MessageSquare, label: 'Moderate Reviews' },
  { href: '/admin/tutorials', icon: Video, label: 'Manage Tutorials' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-violet-500">BookWorm Admin</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-violet-500/20 text-violet-500 border border-violet-500/30' 
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-emerald-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-sm text-slate-400">admin@bookworm.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}