'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, TrendingUp, RotateCcw, Sparkles } from 'lucide-react';
import BookCard from '@/app/components/BookCard';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  genre: string[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  pages: number;
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchRecommendations();
    }
  }, [status, session, router]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecommendedBooks(data.books);
        setExplanation(data.explanation || '');
      } else {
        throw new Error(data.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      console.error('Error loading recommendations:', err);
      setError(err.message || 'An error occurred while loading recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect effect will happen in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  Personalized Recommendations
                </h1>
                {explanation && (
                  <p className="text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {explanation}
                  </p>
                )}
              </div>
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recommendedBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No recommendations yet</h3>
              <p className="text-gray-400 mb-4">Start reading books to get personalized recommendations</p>
              <button 
                onClick={() => router.push('/browse')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium"
              >
                Browse Books
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => router.push('/browse')}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 rounded-lg transition-colors"
                >
                  Browse More Books
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}