'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Filter, Heart, Eye, Bookmark } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
  genre: string[];
  pages: number;
  publishedYear: number;
  averageRating: number;
  totalReviews: number;
}

export default function BrowseBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user?.role === "admin") {
        router.push("/admin");
      } else {
        fetchBooks();
      }
    }
  }, [status, session, router]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = search 
        ? `/api/books/search?q=${encodeURIComponent(search)}` 
        : '/api/books';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.books || []);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.message || 'An error occurred while fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleAddToShelf = async (bookId: string, shelfType: 'wantToRead' | 'currentlyReading' | 'read') => {
    if (!session) {
      alert('Please login to add books to your library');
      return;
    }

    try {
      const response = await fetch('/api/user/shelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          shelfType
        }),
      });

      if (response.ok) {
        alert(`Added to ${shelfType.replace(/([A-Z])/g, ' $1').toLowerCase()} shelf`);
      } else {
        alert('Failed to add to shelf');
      }
    } catch (error) {
      console.error('Error adding to shelf:', error);
      alert('An error occurred while adding to shelf');
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role === "admin") {
    return null; // Redirect effect will happen in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-4xl font-bold">
                Browse <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Books</span>
              </h1>
              <button 
                onClick={() => router.push('/user/dashboard')} 
                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            <p className="text-gray-400 text-center md:text-left">Discover new books to add to your library</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {/* Books Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No books found</h3>
              <p className="text-gray-500 mb-6">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex gap-4">
                    <div className="bg-gray-800 border border-white/10 rounded-lg w-16 h-24 flex-shrink-0 flex items-center justify-center">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-full h-full object-cover rounded" 
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white line-clamp-2">{book.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {book.author}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <span>{book.pages} pages</span>
                        <span>•</span>
                        <span>{book.publishedYear}</span>
                      </div>
                      
                      {/* Shelf Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAddToShelf(book._id, 'wantToRead')}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          title="Add to Want to Read"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAddToShelf(book._id, 'currentlyReading')}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          title="Add to Currently Reading"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAddToShelf(book._id, 'read')}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          title="Add to Read"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(book.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400">
                        {(book.averageRating || 0).toFixed(1)} ({book.totalReviews || 0})
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/books/${book._id}`)}
                      className="text-xs bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}