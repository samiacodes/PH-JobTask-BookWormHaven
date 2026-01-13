import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build filter object
    const filter: any = {}; // Show all books (no approval needed)
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (genre && genre !== 'all') {
      filter.genre = { $in: [new RegExp(genre, 'i')] };
    }
    
    if (minRating > 0) {
      filter.averageRating = { $gte: minRating };
    }

    // Build sort object
    const sort: any = {};
    switch (sortBy) {
      case 'highest_rated':
        sort.averageRating = -1;
        break;
      case 'most_reviews':
        sort.totalReviews = -1;
        break;
      case 'newest':
      default:
        sort.createdAt = -1;
        break;
    }

    // Execute query with pagination
    const books = await Book.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Book.countDocuments(filter);

    return NextResponse.json({
      books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      { message: 'Failed to search books', error: error.message },
      { status: 500 }
    );
  }
}