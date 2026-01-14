import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import User from '@/model/user.model';
import Book from '@/model/book.model';
import '@/model/review.model';
import '@/model/genre.model';
import authOptions from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDb();

    // Get user's library data to calculate stats
    const user = await User.findById(session.user.id)
      .populate('shelves.wantToRead')
      .populate('shelves.currentlyReading')
      .populate('shelves.read');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats from library data
    const shelves = user.shelves || {
      wantToRead: [],
      currentlyReading: [],
      read: []
    };

    // Calculate more detailed stats
    const booksRead = shelves.read || [];
    const booksReading = shelves.currentlyReading || [];
    const booksToRead = shelves.wantToRead || [];
    
    // Calculate pages read from books in 'read' shelf (assuming books have pages property)
    const pagesRead = booksRead.reduce((total: number, book: any) => total + (book.pages || 0), 0 as number);
    
    // Calculate average rating from user's reviews
    let avgRating = 0;
    if (booksRead.length > 0) {
      const totalRatings = booksRead.reduce((sum: number, book: any) => sum + (book.averageRating || 0), 0 as number);
      avgRating = booksRead.length > 0 ? totalRatings / booksRead.length : 0;
    }
    
    // Calculate books read this year
    const currentYear = new Date().getFullYear();
    const booksThisYear = booksRead.filter((book: any) => {
      const bookDate = new Date(book.createdAt || book.updatedAt || Date.now());
      return bookDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate favorite genre
    const genreCounts: Record<string, number> = {};
    booksRead.forEach((book: any) => {
      if (book.genre && Array.isArray(book.genre)) {
        book.genre.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    const favoriteGenre = Object.keys(genreCounts).length > 0 
      ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
      : 'N/A';
    
    // Simple reading streak calculation (placeholder)
    const readingStreak = Math.min(Math.floor(booksThisYear / 2), 30); // Just a simple calculation
    
    const stats = {
      booksRead: booksRead.length,
      booksReading: booksReading.length,
      booksToRead: booksToRead.length,
      avgRating: parseFloat(avgRating.toFixed(2)),
      pagesRead,
      readingStreak,
      favoriteGenre,
      booksThisYear
    };

    // Get recent books (most recently added to shelves)
    const allBooks = [
      ...(shelves.wantToRead || []).map((book: any) => ({ ...book, shelf: 'wantToRead' })),
      ...(shelves.currentlyReading || []).map((book: any) => ({ ...book, shelf: 'currentlyReading' })),
      ...(shelves.read || []).map((book: any) => ({ ...book, shelf: 'read' }))
    ];

    // Filter books to ensure they have proper IDs and sort by most recent addition
    const validBooks = allBooks.filter(book => book && book._id);
    
    // Sort by most recent addition (using createdAt)
    const sortedBooks = validBooks.sort((a: any, b: any) => 
      new Date(b.createdAt || b.updatedAt || Date.now()).getTime() - new Date(a.createdAt || a.updatedAt || Date.now()).getTime()
    );

    // Get first 3 recent books
    const recentBooks = sortedBooks.slice(0, 3);

    // Fetch personalized recommendations
    // First try to get personalized recommendations based on user's reading history
    let recommendations = [];
    
    // Algorithm 1: Based on user's favorite genres
    if (shelves.read.length >= 3) {
      // Get most common genres from read books
      const genreCounts: Record<string, number> = {};
      shelves.read.forEach((book: any) => {
        const genreList = Array.isArray(book.genre) ? book.genre : [book.genre];
        genreList.forEach((genre: string) => {
          if (genre) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        });
      });
      
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(g => g[0]);
      
      if (topGenres.length > 0) {
        // Find highly-rated books in user's favorite genres
        recommendations = await Book.find({
          genre: { $in: topGenres },
          _id: { $nin: shelves.read.map((b: any) => b._id) } // Exclude already read
        })
        .sort({ averageRating: -1 })
        .limit(5);
      }
    }
    
    // If not enough personalized recommendations, add popular books
    if (recommendations.length < 3) {
      const popularBooks = await Book.find({
        _id: { $nin: [...shelves.read.map((b: any) => b._id), ...recommendations.map((b: any) => b._id)] }
      })
      .sort({ totalReviews: -1, averageRating: -1 })
      .limit(5 - recommendations.length);
      
      recommendations = [...recommendations, ...popularBooks];
    }
    
    // Remove duplicates
    const uniqueIds = new Set();
    const finalRecommendations = [];
    
    for (const book of recommendations) {
      if (!uniqueIds.has(book._id.toString())) {
        uniqueIds.add(book._id.toString());
        finalRecommendations.push(book);
      }
    }

    // Debug logging to check the data
    console.log('Dashboard - Stats:', stats);
    console.log('Dashboard - Recent Books Count:', recentBooks.length);
    console.log('Dashboard - Recent Books Sample:', recentBooks.slice(0, 2));
    console.log('Dashboard - Recommendations Count:', recommendations.length);
    
    // Calculate explanation for recommendations
    let explanation = "Popular books among all readers";
    if (shelves.read.length >= 3) {
      const genreCounts: Record<string, number> = {};
      shelves.read.forEach((book: any) => {
        const genreList = Array.isArray(book.genre) ? book.genre : [book.genre];
        genreList.forEach((genre: string) => {
          if (genre) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        });
      });
      
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(g => g[0]);
      
      if (topGenres.length > 0) {
        explanation = `Based on your interest in ${topGenres.join(' and ')}`;
      }
    }
    
    const responseData = {
      success: true,
      data: {
        stats,
        recentBooks,
        recommendations: finalRecommendations,
        explanation
      }
    };
    
    console.log('Dashboard API response:', responseData); // Debug log
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to get dashboard data' },
      { status: 500 }
    );
  }
}