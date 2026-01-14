import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import User from '@/model/user.model';
import Book from '@/model/book.model';
import '@/model/review.model';
import '@/model/genre.model';
import authOptions from '@/lib/auth';

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

    const { bookId, shelfType } = await request.json();
    
    if (!bookId || !shelfType) {
      return NextResponse.json(
        { error: 'Missing bookId or shelfType' },
        { status: 400 }
      );
    }

    await connectDb();

    // Validate shelf type
    if (!['wantToRead', 'currentlyReading', 'read'].includes(shelfType)) {
      return NextResponse.json(
        { error: 'Invalid shelf type' },
        { status: 400 }
      );
    }

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Remove from all other shelves first
    await User.findByIdAndUpdate(session.user.id, {
      $pull: {
        'shelves.wantToRead': bookId,
        'shelves.currentlyReading': bookId,
        'shelves.read': bookId
      }
    });

    // Add to selected shelf
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { [`shelves.${shelfType}`]: bookId }
    });

    return NextResponse.json({
      success: true,
      message: `Book added to ${shelfType} shelf`
    });

  } catch (error) {
    console.error('Add to shelf error:', error);
    return NextResponse.json(
      { error: 'Failed to add to shelf' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookId, shelfType } = await request.json();
    
    if (!bookId || !shelfType) {
      return NextResponse.json(
        { error: 'Missing bookId or shelfType' },
        { status: 400 }
      );
    }

    await connectDb();

    
    // Remove from specified shelf
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { [`shelves.${shelfType}`]: bookId }
    });

    return NextResponse.json({
      success: true,
      message: `Book removed from ${shelfType} shelf`
    });

  } catch (error) {
    console.error('Remove from shelf error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from shelf' },
      { status: 500 }
    );
  }
}

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
    
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    
    if (bookId) {
      // Check if a specific book is in any shelf
      const user = await User.findById(session.user.id);
      
      if (!user || !user.shelves) {
        return NextResponse.json({ shelfType: null });
      }
      
      for (const shelfType of ['wantToRead', 'currentlyReading', 'read']) {
        if (user.shelves[shelfType]?.includes(bookId)) {
          return NextResponse.json({ shelfType });
        }
      }
      
      return NextResponse.json({ shelfType: null });
    } else {
      // Get all shelves
      const user = await User.findById(session.user.id)
        .populate('shelves.wantToRead')
        .populate('shelves.currentlyReading')
        .populate('shelves.read');

      return NextResponse.json({
        success: true,
        shelves: user.shelves || {
          wantToRead: [],
          currentlyReading: [],
          read: []
        }
      });
    }

  } catch (error) {
    console.error('Get shelves error:', error);
    return NextResponse.json(
      { error: 'Failed to get shelves' },
      { status: 500 }
    );
  }
}