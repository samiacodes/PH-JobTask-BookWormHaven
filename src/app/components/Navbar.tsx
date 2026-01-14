'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  BookOpen,
  Home,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-2 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">
            Book<span className="text-purple-400">Worm</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/" icon={<Home />} label="Home" />
          <NavLink href="/browse" icon={<Search />} label="Browse" />
          <NavLink href="/recommendations" icon={<Sparkles />} label="Recommend" />

          {session && (
            <NavLink href="/library" icon={<BookOpen />} label="My Library" />
          )}

          {isAdmin && (
            <NavLink href="/add-book" icon={<BookOpen />} label="Add Book" />
          )}

          {/* Auth */}
          {status === 'loading' ? null : session ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <User className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-40 bg-gray-900 rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <Link href="/profile" className="block px-4 py-2 hover:bg-white/5">
                  Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2 hover:bg-white/5">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-purple-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 border border-white/10 rounded"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <MobileLink href="/" label="Home" setOpen={setOpen} />
          <MobileLink href="/browse" label="Browse" setOpen={setOpen} />
          <MobileLink href="/recommendations" label="Recommendations" setOpen={setOpen} />

          {session && (
            <MobileLink href="/library" label="My Library" setOpen={setOpen} />
          )}

          {isAdmin && (
            <MobileLink href="/add-book" label="Add Book" setOpen={setOpen} />
          )}

          {session ? (
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-red-400"
            >
              Logout
            </button>
          ) : (
            <MobileLink href="/login" label="Login" setOpen={setOpen} />
          )}
        </div>
      )}
    </nav>
  );
}

/* Helper Components */
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-gray-300 hover:text-white">
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ href, label, setOpen }: { href: string; label: string; setOpen: (open: boolean) => void }) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="block px-4 py-2 rounded hover:bg-white/5"
    >
      {label}
    </Link>
  );
}
