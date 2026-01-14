import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import User from '@/model/user.model';
import Book from '@/model/book.model';
import authOptions from '@/lib/auth';

// Ensure models are registered by accessing them
const userModel = User;
const bookModel = Book;

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

    // Get user's profile and library data
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

    // Get user's library data to calculate stats
    const shelves = user.shelves || {
      wantToRead: [],
      currentlyReading: [],
      read: []
    };

    // Calculate reading stats
    const booksRead = shelves.read || [];
    const currentlyReading = shelves.currentlyReading || [];
    const wantToRead = shelves.wantToRead || [];

    // Calculate pages read (if pages property exists in books)
    let totalPagesRead = 0;
    booksRead.forEach((book: any) => {
      if (book.pages) {
        totalPagesRead += book.pages;
      }
    });

    // Calculate books read this year
    const currentYear = new Date().getFullYear();
    const booksThisYear = booksRead.filter((book: any) => {
      const bookDate = new Date(book.createdAt || book.updatedAt || Date.now());
      return bookDate.getFullYear() === currentYear;
    }).length;

    // Calculate favorite genres
    const genreCounts: Record<string, number> = {};
    booksRead.forEach((book: any) => {
      const genreList = Array.isArray(book.genre) ? book.genre : [book.genre];
      genreList.forEach((genre: string) => {
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([genre]) => genre);

    // Get recent activity (last 4 items)
    const allBooks = [
      ...booksRead.map((book: any) => ({ ...book, shelf: 'read', action: 'Finished' })),
      ...currentlyReading.map((book: any) => ({ ...book, shelf: 'currentlyReading', action: 'Started reading' })),
      ...wantToRead.map((book: any) => ({ ...book, shelf: 'wantToRead', action: 'Added to Want to Read' }))
    ];

    // Sort by most recent activity
    const sortedBooks = allBooks.sort((a: any, b: any) => 
      new Date(b.updatedAt || b.createdAt || Date.now()).getTime() - 
      new Date(a.updatedAt || a.createdAt || Date.now()).getTime()
    );

    // Get recent activity with readable format
    const recentActivity = sortedBooks.slice(0, 4).map((book: any, index) => ({
      id: `${book._id}-${index}`,
      action: book.action,
      bookTitle: book.title,
      timestamp: formatDateRelative(new Date(book.updatedAt || book.createdAt))
    }));

    // Default reading goal (can be customized per user later)
    const readingGoal = 60; // 5 books per month goal

    const profile = {
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: formatDate(user.createdAt),
      stats: {
        booksRead: booksRead.length,
        pagesRead: totalPagesRead,
        readingGoal,
        booksThisYear,
        currentReads: currentlyReading.length,
        wantToRead: wantToRead.length,
        completedBooks: booksRead.length
      },
      topGenres,
      recentActivity
    };

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile data' },
      { status: 500 }
    );
  }
}

// Helper function to format date as readable string
function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper function to format relative time
function formatDateRelative(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}