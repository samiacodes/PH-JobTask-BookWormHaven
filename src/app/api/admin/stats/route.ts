import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import User from '@/model/user.model';
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

    // Get current date for "today" calculations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all statistics
    const [
      totalBooks,
      pendingReviews,
      totalUsers,
      booksAddedToday
    ] = await Promise.all([
      Book.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      Book.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
    ]);

    return NextResponse.json({
      totalBooks,
      pendingReviews,
      totalUsers,
      booksAddedToday
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}