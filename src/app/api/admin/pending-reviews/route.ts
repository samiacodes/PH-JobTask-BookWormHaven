import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';
import User from '@/model/user.model';
import Book from '@/model/book.model';
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

    const pendingReviews = await Review.find({ status: 'pending' })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'book',
        select: 'title author'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(pendingReviews);
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return NextResponse.json(
      { message: 'Failed to fetch pending reviews' },
      { status: 500 }
    );
  }
}