'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Search, User, LogOut, LogIn, BookOpen, Home, Library, Sparkles, Video } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">
              Book<span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Worm</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              href="/browse" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse
            </Link>
            <Link 
              href="/library" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Library className="w-4 h-4" />
              Library
            </Link>
            {session?.user?.role === 'admin' && (
              <Link 
                href="/add-book" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Add Book
              </Link>
            )}
            <Link 
              href="/recommendations" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              For You
            </Link>
            <Link 
              href="/tutorials" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Video className="w-4 h-4" />
              Tutorials
            </Link>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            {/* User Profile/Auth */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {/* Admin link for admin users */}
                {session.user?.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/library"
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors"
                >
                  My Shelf
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-lg">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      Settings
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                      >
                        <Sparkles className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border border-white/10 rounded-lg"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                href="/browse" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                Browse
              </Link>
              <Link 
                href="/library" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Library className="w-4 h-4" />
                Library
              </Link>
              <Link 
                href="/recommendations" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                For You
              </Link>
              <Link 
                href="/tutorials" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Video className="w-4 h-4" />
                Tutorials
              </Link>
              {session?.user?.role === 'admin' && (
                <Link 
                  href="/add-book" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  Add Book
                </Link>
              )}
              
              <div className="pt-4 border-t border-white/10">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          className="w-10 h-10 rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-gray-400 text-sm">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      className="px-4 py-3 text-center border border-white/10 rounded-lg hover:border-white/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-3 text-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}