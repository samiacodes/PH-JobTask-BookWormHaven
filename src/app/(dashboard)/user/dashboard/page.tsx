'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, TrendingUp, Clock, Bookmark, CheckCircle, Eye } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  pages: number;
  progress?: number;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      booksRead: 0,
      booksReading: 0,
      booksToRead: 0,
      avgRating: 0,
      pagesRead: 0,
      readingStreak: 0,
      favoriteGenre: '',
      booksThisYear: 0
    },
    recentBooks: [] as Book[],
    recommendations: [] as Book[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user?.role === "admin") {
        router.push("/admin");
      } else {
        fetchDashboardData();
      }
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's dashboard data from API
      const response = await fetch('/api/user/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      setDashboardData({
        stats: data.data.stats,
        recentBooks: data.data.recentBooks,
        recommendations: data.data.recommendations
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      
      // Set default empty data
      setDashboardData({
        stats: {
          booksRead: 0,
          booksReading: 0,
          booksToRead: 0,
          avgRating: 0,
          pagesRead: 0,
          readingStreak: 0,
          favoriteGenre: '',
          booksThisYear: 0
        },
        recentBooks: [],
        recommendations: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
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
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Welcome Back, <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{session?.user?.name}</span>
            </h1>
            <p className="text-gray-400">Continue your reading journey</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-600/20">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">{dashboardData.stats.booksRead}</div>
              </div>
              <div className="text-sm text-gray-400">Books Read</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-600/20">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{dashboardData.stats.pagesRead}</div>
              </div>
              <div className="text-sm text-gray-400">Pages Read</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-600/20">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold">{dashboardData.stats.readingStreak}</div>
              </div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-600/20">
                  <Star className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold">{(dashboardData.stats.avgRating || 0).toFixed(1)}</div>
              </div>
              <div className="text-sm text-gray-400">Avg Rating</div>
            </div>
          </div>
          
          {/* Additional Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-600/20">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold">{dashboardData.stats.booksThisYear}</div>
              </div>
              <div className="text-sm text-gray-400">This Year</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-pink-600/20">
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-2xl font-bold">{dashboardData.stats.favoriteGenre || 'N/A'}</div>
              </div>
              <div className="text-sm text-gray-400">Favorite Genre</div>
            </div>
          </div>

          {/* Recent Books & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Books */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recently Added
              </h2>
              <div className="space-y-4">
                {(dashboardData.recentBooks || []).map((book, index) => {
                  // Generate a safe key using the book ID or a fallback
                  const bookKey = book._id || `recent-book-${index}-${book.title}`;
                  
                  return (
                    <div key={bookKey} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      onClick={() => book._id && router.push(`/books/${book._id}`)}>
                      <div className="bg-gray-800 border border-white/10 rounded-lg w-12 h-16 flex-shrink-0 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-400">{book.author}</p>
                      </div>
                      {book.progress && (
                        <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          {Math.round((book.progress / book.pages) * 100)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                className="w-full mt-4 py-2 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                onClick={() => router.push('/user/library')}
              >
                View All
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recommended for You
              </h2>
              <div className="space-y-4">
                {(dashboardData.recommendations || []).map((book, index) => {
                  // Generate a safe key using the book ID or a fallback
                  const bookKey = book._id || `recommendation-book-${index}-${book.title}`;
                  
                  return (
                    <div key={bookKey} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      onClick={() => book._id && router.push(`/books/${book._id}`)}>
                      <div className="bg-gray-800 border border-white/10 rounded-lg w-12 h-16 flex-shrink-0 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-400">{book.author}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                className="w-full mt-4 py-2 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                onClick={() => router.push('/user/browse')}
              >
                Browse More Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}