import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import { getToken } from 'next-auth/jwt';
import { Types } from 'mongoose';

// Handle PUT request to update book details
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();

    // Get token to check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, author, description, genre, pages, publishedYear, isbn, coverImage, isFeatured } = body;



    // Validate required fields if they're provided
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    if (author !== undefined && !author.trim()) {
      return NextResponse.json(
        { message: 'Author is required' },
        { status: 400 }
      );
    }

    if (pages !== undefined && (typeof pages !== 'number' || pages <= 0)) {
      return NextResponse.json(
        { message: 'Pages must be a positive number' },
        { status: 400 }
      );
    }

    if (publishedYear !== undefined && (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear())) {
      return NextResponse.json(
        { message: 'Published year must be between 1000 and current year' },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateObj: any = {};
    if (title !== undefined) updateObj.title = title;
    if (author !== undefined) updateObj.author = author;
    if (description !== undefined) updateObj.description = description;
    if (genre !== undefined) updateObj.genre = genre;
    if (pages !== undefined) updateObj.pages = pages;
    if (publishedYear !== undefined) updateObj.publishedYear = publishedYear;
    if (isbn !== undefined) updateObj.isbn = isbn;
    if (coverImage !== undefined) updateObj.coverImage = coverImage;
    if (isFeatured !== undefined) updateObj.isFeatured = isFeatured;

    // Find and update the book
    const book = await Book.findByIdAndUpdate(
      params.id,
      updateObj,
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error: any) {
    console.error('Error updating book:', error);
    
    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update book', error: error.message },
      { status: 500 }
    );
  }
}

// Handle DELETE request to remove a book
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();

    // Get token to check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const book = await Book.findByIdAndDelete(params.id);

    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { message: 'Failed to delete book' },
      { status: 500 }
    );
  }
}