import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import Book from '@/model/book.model';

export async function PUT(request: NextRequest) {
  try {
    // Verify user authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: User must be logged in' },
        { status: 401 }
      );
    }

    await connectDb();

    const { bookId, pagesRead } = await request.json();
    
    // Validate inputs
    if (!bookId || typeof pagesRead !== 'number' || pagesRead < 0) {
      return NextResponse.json(
        { message: 'Missing required fields or invalid pagesRead value' },
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

    // Update user's progress
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize readingProgress if not exists
    if (!user.readingProgress) {
      user.readingProgress = {};
    }

    // Update progress for the specific book
    user.readingProgress[bookId] = {
      pagesRead,
      totalPages: book.pages,
      percentage: Math.round((pagesRead / book.pages) * 100),
      lastUpdated: new Date()
    };

    await user.save();

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: user.readingProgress[bookId]
    });
  } catch (error) {
    console.error('Error updating reading progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: User must be logged in' },
        { status: 401 }
      );
    }

    await connectDb();

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    // Get user's reading progress
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (bookId) {
      // Return progress for specific book
      const progress = user.readingProgress?.[bookId] || null;
      return NextResponse.json({ progress });
    } else {
      // Return all progress data
      return NextResponse.json({
        progress: user.readingProgress || {}
      });
    }
  } catch (error) {
    console.error('Error getting reading progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: User must be logged in' },
        { status: 401 }
      );
    }

    await connectDb();

    const { bookId } = await request.json();
    
    // Validate inputs
    if (!bookId) {
      return NextResponse.json(
        { message: 'Missing required bookId' },
        { status: 400 }
      );
    }

    // Update user's progress
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.readingProgress && user.readingProgress[bookId]) {
      delete user.readingProgress[bookId];
      await user.save();
    }

    return NextResponse.json({
      message: 'Progress removed successfully'
    });
  } catch (error) {
    console.error('Error removing reading progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}