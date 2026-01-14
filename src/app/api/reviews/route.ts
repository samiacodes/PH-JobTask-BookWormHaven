import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
// Import models to ensure they are registered
import Review from '@/model/review.model';
import Book from '@/model/book.model';
import '@/model/user.model';
import '@/model/genre.model';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json(
        { message: 'Unauthorized: User access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookId, rating, text } = body;

    // Validate required fields
    if (!bookId || !rating || !text) {
      return NextResponse.json(
        { message: 'Missing required fields: bookId, rating, and text are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate book ID
    if (!Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if user already submitted a review for this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: token.sub
    });

    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already submitted a review for this book' },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      book: bookId,
      user: token.sub,
      rating,
      text,
      status: 'pending' // Default to pending for admin approval
    });

    await newReview.save();

    return NextResponse.json(
      { 
        message: 'Review submitted successfully and is pending approval', 
        review: newReview 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const bookId = searchParams.get('bookId');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build filter object
    const filter: any = {};
    
    // If bookId is provided, filter by book
    if (bookId) {
      if (!Types.ObjectId.isValid(bookId)) {
        return NextResponse.json(
          { message: 'Invalid book ID' },
          { status: 400 }
        );
      }
      filter.book = bookId;
      
      // For public access to book reviews, only show approved reviews
      filter.status = 'approved';
    } else {
      // For admin access, check authentication and allow all statuses
      const token = await getToken({ req: request });
      if (!token || token.role !== 'admin') {
        // If not admin, only allow access to approved reviews for specific book
        return NextResponse.json(
          { message: 'Unauthorized: Admin access required for general review listing' },
          { status: 401 }
        );
      }
      
      if (status) {
        filter.status = status;
      } else {
        // Default to pending reviews if no status specified for admin
        filter.status = 'pending';
      }
    }
    
    if (search && bookId) {
      // This would require populating book and user data for search
      // For simplicity, we'll just return reviews based on status
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch reviews with filter, pagination and sorting
    const reviews = await Review.find(filter)
      .populate('book', 'title')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Review.countDocuments(filter);

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalReviews: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}