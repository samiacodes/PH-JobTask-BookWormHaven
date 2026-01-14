"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Bookmark, Eye, CheckCircle, Plus, Search, Filter } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  pages: number;
  progress?: number; 
}

export default function UserLibrary() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wantToRead' | 'currentlyReading' | 'read'>('currentlyReading');
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [shelves, setShelves] = useState({
    wantToRead: [] as Book[],
    currentlyReading: [] as Book[],
    read: [] as Book[]
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user?.role === "admin") {
        router.push("/admin");
      } else {
        // Load user's library data
        loadLibraryData();
      }
    }
  }, [session, status, router]);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      // Fetch user's library from API
      const response = await fetch('/api/user/library');
      if (!response.ok) {
        throw new Error('Failed to fetch library data');
      }
      const data = await response.json();
      
      // Update shelves with real data
      setShelves({
        wantToRead: data.shelves.wantToRead || [],
        currentlyReading: data.shelves.currentlyReading || [],
        read: data.shelves.read || []
      });
    } catch (error) {
      console.error("Error loading library:", error);
      // Fallback to empty arrays
      setShelves({
        wantToRead: [],
        currentlyReading: [],
        read: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your library...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role === "admin") {
    return null; // Redirect effect will happen in useEffect
  }

  const currentBooks = shelves[activeTab];
  const filteredBooks = currentBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-4xl font-bold">
                My <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Library</span>
              </h1>
              <button 
                onClick={() => router.push('/user/dashboard')} 
                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            <p className="text-gray-400 text-center md:text-left">Manage your reading journey</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 border border-white/10 rounded-full p-1 flex">
              {[
                { id: 'wantToRead', label: 'Want to Read', icon: Bookmark, count: shelves.wantToRead.length },
                { id: 'currentlyReading', label: 'Currently Reading', icon: Eye, count: shelves.currentlyReading.length },
                { id: 'read', label: 'Read', icon: CheckCircle, count: shelves.read.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label} {tab.count > 0 && <span className="bg-white/20 text-xs rounded-full px-2 py-1 ml-1">{tab.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books in your library..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No books in this shelf</h3>
              <p className="text-gray-500 mb-6">Add some books to your {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()} shelf</p>
              <button 
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-full mx-auto hover:opacity-90 transition-opacity"
                onClick={() => router.push('/browse')}
              >
                <Plus className="w-4 h-4" />
                Browse Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredBooks || []).map((book, index) => {
                // Generate a safe key using the book ID or a fallback
                const bookKey = book._id || `library-book-${index}-${book.title}`;
                
                return (
                  <div key={bookKey} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex gap-4">
                      <div className="bg-gray-800 border border-white/10 rounded-lg w-16 h-24 flex-shrink-0 flex items-center justify-center">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded" />
                        ) : (
                          <BookOpen className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white line-clamp-2">{book.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{book.author}</p>
                        
                        {activeTab === 'currentlyReading' && book.progress !== undefined && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress: {Math.round((book.progress / book.pages) * 100)}%</span>
                              <span>{book.progress}/{book.pages} pages</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full" 
                                style={{ width: `${(book.progress / book.pages) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{book.pages} pages</span>
                          {activeTab === 'currentlyReading' && (
                            <button 
                              className="text-purple-400 hover:text-purple-300"
                              onClick={() => book._id && router.push(`/books/${book._id}`)}
                            >
                              Update Progress
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex-1"
                        onClick={() => book._id && router.push(`/books/${book._id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="text-xs bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity"
                        onClick={() => {
                          // Move book to different shelf based on current tab
                          if (activeTab === 'currentlyReading') {
                            // Move to 'read' shelf
                            setShelves(prev => ({
                              ...prev,
                              currentlyReading: prev.currentlyReading.filter(b => b._id !== book._id),
                              read: [...prev.read, book]
                            }));
                          }
                        }}
                      >
                        {activeTab === 'currentlyReading' ? 'Mark Read' : 'Move'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}