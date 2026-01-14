import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import Book from '@/model/book.model';
import '@/model/user.model';
import '@/model/review.model';
import '@/model/genre.model';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDb();

    // Validate book ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    // Fetch book by ID
    const book = await Book.findById(id).lean();

    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate book ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, author, description, genre, coverImage, pages } = body;

    // Validate required fields
    if (!title || !author || !description || !genre || !coverImage || !pages) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDb();

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        description,
        genre: Array.isArray(genre) ? genre : [genre],
        coverImage,
        pages
      },
      { new: true } // Return updated document
    );

    if (!updatedBook) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate book ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // Delete book
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}