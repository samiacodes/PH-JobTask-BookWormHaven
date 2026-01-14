import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';
import Book from '@/model/book.model';
import User from '@/model/user.model';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by status
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // Get book IDs that match search
      const matchingBooks = await Book.find({
        $or: [
          { title: searchRegex },
          { author: searchRegex }
        ]
      }).select('_id');

      // Get user IDs that match search
      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');

      query.$or = [
        { text: searchRegex },
        { book: { $in: matchingBooks.map(b => b._id) } },
        { user: { $in: matchingUsers.map(u => u._id) } }
      ];
    }

    // Get reviews with populated data
    const reviews = await Review.find(query)
      .populate({
        path: 'book',
        select: 'title author coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        limit
      }
    });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch reviews', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}