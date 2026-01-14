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

    // Get count of pending reviews
    const pendingReviewsCount = await Review.countDocuments({ status: 'pending' });

    return NextResponse.json({
      count: pendingReviewsCount
    });
  } catch (error) {
    console.error('Error fetching pending reviews count:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}