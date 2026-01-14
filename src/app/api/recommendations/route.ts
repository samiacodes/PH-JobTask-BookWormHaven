import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import User from '@/model/user.model';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDb();
    
    const user = await User.findById(session.user.id)
      .populate('shelves.read')
      .populate('shelves.currentlyReading');
    
    // Get user's reading history
    const readBooks = user.shelves.read || [];
    const currentlyReading = user.shelves.currentlyReading || [];
    
    let recommendations = [];
    let explanation = "";
    
    // Algorithm 1: Based on user's favorite genres
    if (readBooks.length >= 3) {
      // Get most common genres from read books
      const genreCounts: Record<string, number> = {};
      readBooks.forEach((book: any) => {
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
          _id: { $nin: readBooks.map((b: any) => b._id) } // Exclude already read
        })
        .sort({ averageRating: -1 })
        .limit(8);
        
        explanation = `Based on your interest in ${topGenres.join(' and ')}`;
      }
    }
    
    // Algorithm 2: Similar to highly-rated books (collaborative filtering light)
    if (recommendations.length < 6 && readBooks.length > 0) {
      const userAvgRating = readBooks.reduce((sum: number, book: any) => 
        sum + (book.averageRating || 0), 0) / readBooks.length;
      
      const additionalBooks = await Book.find({
        averageRating: { $gte: Math.max(3.5, userAvgRating - 0.5) },
        _id: { 
          $nin: [
            ...readBooks.map((b: any) => b._id),
            ...recommendations.map((b: any) => b._id)
          ]
        }
      })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(6 - recommendations.length);
      
      recommendations = [...recommendations, ...additionalBooks];
      
      if (!explanation) {
        explanation = "Popular highly-rated books you might enjoy";
      }
    }
    
    // Algorithm 3: Fallback - Popular books for new users
    if (recommendations.length < 6) {
      const popularBooks = await Book.find({
        _id: { $nin: recommendations.map((b: any) => b._id) }
      })
      .sort({ totalReviews: -1, averageRating: -1 })
      .limit(12 - recommendations.length);
      
      recommendations = [...recommendations, ...popularBooks];
      explanation = "Popular books among all readers";
    }
    
    // Remove duplicates and limit to 12
    const uniqueIds = new Set();
    const finalRecommendations = [];
    
    for (const book of recommendations) {
      if (!uniqueIds.has(book._id.toString()) && finalRecommendations.length < 12) {
        uniqueIds.add(book._id.toString());
        finalRecommendations.push(book);
      }
    }
    
    return NextResponse.json({
      success: true,
      books: finalRecommendations,
      explanation,
      userStats: {
        booksRead: readBooks.length,
        favoriteGenres: getTopGenres(readBooks)
      }
    });
    
  } catch (error) {
    console.error('Recommendation error:', error);
    // Fallback to popular books
    try {
      await connectDb();
      const popularBooks = await Book.find()
        .sort({ averageRating: -1, totalReviews: -1 })
        .limit(12);
      
      return NextResponse.json({
        success: true,
        books: popularBooks,
        explanation: "Popular books you might like",
        fallback: true
      });
    } catch (fallbackError) {
      console.error('Fallback recommendation error:', fallbackError);
      return NextResponse.json({
        success: true,
        books: [],
        explanation: "Popular books you might like",
        fallback: true
      });
    }
  }
}

// Helper function
function getTopGenres(books: any[]) {
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    const genreList = Array.isArray(book.genre) ? book.genre : [book.genre];
    genreList.forEach((genre: string) => {
      if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre, count]) => ({ genre, count }));
}