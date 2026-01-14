'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Star, BookOpen, ChevronRight, SlidersHorizontal } from 'lucide-react';
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

}

export default function BrowsePage() {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  const [minPages, setMinPages] = useState<number>(0);
  const [maxPages, setMaxPages] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'highest_rated' | 'most_reviews'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Define all possible genres
  const allGenres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'Self-Help'];

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/books/search');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setFilteredBooks(data.books);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Apply filters and fetch books
  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (selectedGenre && selectedGenre !== 'all') params.append('genre', selectedGenre);
        if (minRating > 0) params.append('minRating', minRating.toString());
        params.append('sortBy', sortBy);
        
        const response = await fetch(`/api/books/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch filtered books');
        }
        const data = await response.json();
        setFilteredBooks(data.books);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredBooks();
  }, [searchQuery, selectedGenre, minRating, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
        <p className="text-gray-400">Discover your next favorite read</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 outline-none focus:border-purple-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 hover:text-white"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400" />
          {['all', ...allGenres].map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-all ${selectedGenre === genre ? 'bg-linear-to-r from-purple-600 to-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={yearRange[0]}
                    onChange={(e) => setYearRange([parseInt(e.target.value) || 1900, yearRange[1]])}
                  />
                  <input
                    type="number"
                    placeholder="To"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={yearRange[1]}
                    onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || new Date().getFullYear()])}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Pages Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={minPages}
                    onChange={(e) => setMinPages(parseInt(e.target.value) || 0)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={maxPages}
                    onChange={(e) => setMaxPages(parseInt(e.target.value) || 10000)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Minimum Rating</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                >
                  <option value={0}>Any Rating</option>
                  <option value={1}>1+ Stars</option>
                  <option value={2}>2+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <label className="text-gray-300 mr-2">Sort by:</label>
                <select
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest</option>
                  <option value="highest_rated">Highest Rated</option>
                  <option value="most_reviews">Most Reviews</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  setYearRange([1900, new Date().getFullYear()]);
                  setMinPages(0);
                  setMaxPages(10000);
                  setMinRating(0);
                  setSortBy('newest');
                }}
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No books found matching your criteria</p>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}