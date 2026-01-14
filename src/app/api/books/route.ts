import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import Book from '@/model/book.model';
import User from '@/model/user.model';
import '@/model/review.model';
import '@/model/genre.model';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';

    await connectDb();

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) {
      filter.genre = { $in: [genre] }; // Assuming genre is stored as string array
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch books with filter, pagination and sorting
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Book.countDocuments(filter);

    return NextResponse.json({
      books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalBooks: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
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

    // Create new book
    const newBook = new Book({
      title,
      author,
      description,
      genre: Array.isArray(genre) ? genre : [genre],
      coverImage,
      pages,
      addedBy: token.sub // Use the user ID from token
    });

    await newBook.save();

    return NextResponse.json(
      { message: 'Book created successfully', book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}