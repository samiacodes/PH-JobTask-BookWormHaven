import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    // Get token to check if user is authenticated
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      author, 
      description, 
      genre, 
      pages, 
      publishedYear, 
      isbn, 
      coverImage 
    } = body;

    // Validate required fields
    if (!title || !author || !description || !genre || genre.length === 0 || !pages || !publishedYear) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate numeric values
    if (typeof pages !== 'number' || pages <= 0) {
      return NextResponse.json(
        { message: 'Pages must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
      return NextResponse.json(
        { message: 'Published year must be between 1000 and current year' },
        { status: 400 }
      );
    }

    // Create new book - only admins can add books now
    const newBook = await Book.create({
      title,
      author,
      description,
      genre,
      pages,
      publishedYear,
      isbn,
      coverImage,
      addedBy: token.id // Use the user's ID from the token
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error: any) {
    console.error('Error creating book:', error);
    
    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create book', error: error.message },
      { status: 500 }
    );
  }
}