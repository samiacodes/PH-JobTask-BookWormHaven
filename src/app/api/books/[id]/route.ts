import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import User from '@/model/user.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const book = await Book.findById(params.id)
      .populate({
        path: 'addedBy',
        select: 'name email'
      });

    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if the book is approved or if the requesting user is the admin who added it
    // For simplicity, we're returning the book regardless of status
    // In a real app, you'd control visibility based on status and user permissions

    return NextResponse.json(book);
  } catch (error: any) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { message: 'Failed to fetch book', error: error.message },
      { status: 500 }
    );
  }
}