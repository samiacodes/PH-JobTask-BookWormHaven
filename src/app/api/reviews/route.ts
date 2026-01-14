import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    await connectDb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build filter object
    const filter: any = {};
    if (status) {
      filter.status = status;
    } else {
      // Default to pending reviews if no status specified
      filter.status = 'pending';
    }
    if (search) {
      // This would require populating book and user data for search
      // For simplicity, we'll just return reviews based on status
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch reviews with filter, pagination and sorting
    const reviews = await Review.find(filter)
      .populate('book', 'title')
      .populate('user', 'name email')
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