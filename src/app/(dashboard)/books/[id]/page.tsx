'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { BookOpen, Star, Heart, Bookmark, Eye, Calendar, Book, FileText, AlertCircle } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';
import GradientButton from '@/app/components/GradientButton';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre: string[];
  pages: number;
  publishedYear: number;
  isbn?: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;

  addedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [libraryStatus, setLibraryStatus] = useState<'wantToRead' | 'currentlyReading' | 'read' | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch book with ID:', id);
        const response = await fetch(`/api/books/${id}`);
        console.log('API Response Status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch book');
        }
        const data = await response.json();
        console.log('API Response Data:', data);
        setBook(data.book || data); // Handle both formats
        
        // Check user's library status for this book
        if (session) {
          const libraryResponse = await fetch(`/api/user/library`);
          if (libraryResponse.ok) {
            const libraryData = await libraryResponse.json();
            
            // Check which shelf contains this book
            if (libraryData.shelves.wantToRead.some((b: any) => b._id === id)) {
              setLibraryStatus('wantToRead');
            } else if (libraryData.shelves.currentlyReading.some((b: any) => b._id === id)) {
              setLibraryStatus('currentlyReading');
            } else if (libraryData.shelves.read.some((b: any) => b._id === id)) {
              setLibraryStatus('read');
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching book:', err);
        setError(err.message || 'An error occurred while loading the book');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, session]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  const handleShelfAction = async (shelfType: 'wantToRead' | 'currentlyReading' | 'read') => {
    if (!session) {
      alert('Please login to add books to your library');
      return;
    }
    
    if (!book) return;
    
    try {
      // Determine the action based on current status
      if (libraryStatus === shelfType) {
        // Remove from this shelf
        const response = await fetch('/api/user/shelf', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookId: book._id,
            shelfType
          }),
        });
        
        if (response.ok) {
          setLibraryStatus(null);
          alert('Removed from shelf');
        } else {
          alert('Failed to remove from shelf');
        }
      } else {
        // Add to the new shelf
        const response = await fetch('/api/user/shelf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookId: book._id,
            shelfType
          }),
        });
        
        if (response.ok) {
          setLibraryStatus(shelfType);
          alert('Added to shelf');
        } else {
          alert('Failed to add to shelf');
        }
      }
    } catch (error) {
      console.error('Error updating shelf:', error);
      alert('An error occurred while updating your library');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Book</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-gray-400">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 blur-[120px] -z-10"></div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="h-80 w-60 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-2xl">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  ) : (
                    <BookOpen className="w-24 h-24 text-white/50" />
                  )}
                </div>
                

              </div>
            </div>
            
            {/* Book Info */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {book.title}
                </h1>
                <button 
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      window.location.href = '/user/browse';
                    }
                  }} 
                  className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>
              
              <p className="text-2xl text-gray-300 mb-6">by {book.author}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(book?.averageRating || 0)}
                  </div>
                  <span className="ml-2 text-gray-300">{(book?.averageRating || 0).toFixed(1)}</span>
                  <span className="text-gray-500">({book?.totalReviews || 0} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>{book.publishedYear}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Book className="w-5 h-5" />
                  <span>{book.pages} pages</span>
                </div>
              </div>
              
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {book.genre.map((g, idx) => (
                  <span 
                    key={idx} 
                    className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => handleShelfAction('wantToRead')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all ${
                    libraryStatus === 'wantToRead'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  {libraryStatus === 'wantToRead' ? 'In Want to Read' : 'Want to Read'}
                </button>
                
                <button 
                  onClick={() => handleShelfAction('currentlyReading')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all ${
                    libraryStatus === 'currentlyReading'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  {libraryStatus === 'currentlyReading' ? 'Currently Reading' : 'Currently Reading'}
                </button>
                
                <button 
                  onClick={() => handleShelfAction('read')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all ${
                    libraryStatus === 'read'
                      ? 'border-green-500 bg-green-500/20 text-green-300'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  {libraryStatus === 'read' ? 'Mark as Read' : 'Read'}
                </button>
              </div>
              

            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </GlassCard>
          </div>
          
          {/* Book Info Card */}
          <div>
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6">Book Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Author</h3>
                  <p className="text-white">{book.author}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Published Year</h3>
                  <p className="text-white">{book.publishedYear}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Pages</h3>
                  <p className="text-white">{book.pages}</p>
                </div>
                
                {book.isbn && (
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">ISBN</h3>
                    <p className="text-white">{book.isbn}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Added By</h3>
                  <p className="text-white">{book.addedBy.name}</p>
                  <p className="text-gray-500 text-sm">{book.addedBy.email}</p>
                </div>
                

              </div>
            </GlassCard>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <GlassCard>
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <p className="text-gray-400">Reviews will appear here once added by users.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}