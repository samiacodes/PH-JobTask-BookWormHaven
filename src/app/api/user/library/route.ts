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

    // Get user's library data (shelves and progress)
    const user = await User.findById(session.user.id)
      .populate('shelves.wantToRead')
      .populate('shelves.currentlyReading')
      .populate('shelves.read');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If user has no shelves yet, create empty structure
    if (!user.shelves) {
      user.shelves = {
        wantToRead: [],
        currentlyReading: [],
        read: []
      };
      await user.save();
    }

    // Format the response
    const libraryData = {
      shelves: {
        wantToRead: user.shelves?.wantToRead || [],
        currentlyReading: user.shelves?.currentlyReading || [],
        read: user.shelves?.read || []
      },
      readingProgress: user.readingProgress || {},
      totalBooks: {
        wantToRead: (user.shelves?.wantToRead || []).length,
        currentlyReading: (user.shelves?.currentlyReading || []).length,
        read: (user.shelves?.read || []).length
      }
    };

    // Debug logging to check the data
    console.log('Library - Shelves Data:', {
      wantToReadCount: libraryData.shelves.wantToRead.length,
      currentlyReadingCount: libraryData.shelves.currentlyReading.length,
      readCount: libraryData.shelves.read.length,
      sampleWantToRead: libraryData.shelves.wantToRead.slice(0, 2),
      sampleCurrentlyReading: libraryData.shelves.currentlyReading.slice(0, 2),
      sampleRead: libraryData.shelves.read.slice(0, 2)
    });
    
    console.log('Library API response:', libraryData); // Debug log
    return NextResponse.json(libraryData);
  } catch (error) {
    console.error('Error getting user library:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { bookId, action, shelf } = await request.json();
    
    // Validate inputs
    if (!bookId || !action) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize shelves if not exists
    if (!user.shelves) {
      user.shelves = {
        wantToRead: [],
        currentlyReading: [],
        read: []
      };
    }

    let responseMessage = '';

    switch (action) {
      case 'addToShelf':
        if (!shelf || !['wantToRead', 'currentlyReading', 'read'].includes(shelf)) {
          return NextResponse.json(
            { message: 'Invalid shelf type' },
            { status: 400 }
          );
        }

        // Remove book from other shelves if it exists
        for (const shelfName of Object.keys(user.shelves)) {
          if (Array.isArray(user.shelves[shelfName])) {
            user.shelves[shelfName] = user.shelves[shelfName].filter((id: string) => id !== bookId);
          }
        }

        // Add book to specified shelf
        if (!user.shelves[shelf].includes(bookId)) {
          user.shelves[shelf].push(bookId);
        }
        
        responseMessage = `Book added to ${shelf} shelf`;
        break;

      case 'removeFromShelf':
        if (!shelf) {
          return NextResponse.json(
            { message: 'Shelf type required for removal' },
            { status: 400 }
          );
        }

        if (user.shelves[shelf]) {
          user.shelves[shelf] = user.shelves[shelf].filter((id: string) => id !== bookId);
        }
        
        responseMessage = `Book removed from ${shelf} shelf`;
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    await user.save();

    return NextResponse.json({
      message: responseMessage,
      shelves: user.shelves
    });
  } catch (error) {
    console.error('Error updating user library:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}