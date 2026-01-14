import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import Book from '@/model/book.model';
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

    const stats = {
      booksRead: shelves.read.length,
      booksReading: shelves.currentlyReading.length,
      booksToRead: shelves.wantToRead.length,
      avgRating: 0 // We'll calculate this later if needed
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

    // For recommendations, get popular books or similar to user's taste
    // For now, we'll get the latest books added to the platform
    const recommendations = await Book.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id title author coverImage pages');

    // Debug logging to check the data
    console.log('Dashboard - Stats:', stats);
    console.log('Dashboard - Recent Books Count:', recentBooks.length);
    console.log('Dashboard - Recent Books Sample:', recentBooks.slice(0, 2));
    console.log('Dashboard - Recommendations Count:', recommendations.length);
    
    const responseData = {
      success: true,
      data: {
        stats,
        recentBooks,
        recommendations
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