import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Genre from '@/model/genre.model';
import Book from '@/model/book.model';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch genres with filter, pagination and sorting
    const genres = await Genre.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Genre.countDocuments(filter);

    return NextResponse.json({
      genres,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalGenres: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
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
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: 'Genre name is required' },
        { status: 400 }
      );
    }

    await connectDb();

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/--+/g, '-');

    // Create new genre
    const newGenre = new Genre({
      name,
      slug
    });

    await newGenre.save();

    return NextResponse.json(
      { message: 'Genre created successfully', genre: newGenre },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating genre:', error);
    
    // Handle duplicate name error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { message: 'A genre with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}