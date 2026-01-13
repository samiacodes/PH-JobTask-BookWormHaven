// /api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import Book from '@/model/book.model';
import Review from '@/model/review.model';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
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

    const [totalUsers, totalBooks, pendingReviews] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Review.countDocuments({ status: 'pending' })
    ]);

    return NextResponse.json({
      totalUsers,
      totalBooks,
      pendingBooks: 0, // No more pending books
      pendingReviews
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}