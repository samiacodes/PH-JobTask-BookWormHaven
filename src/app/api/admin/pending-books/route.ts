import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db'; // Updated import path
import Book from '@/model/book.model'; // Updated import path
import User from '@/model/user.model'; // Updated import path   
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
    const pendingBooks = await Book.find({ status: 'pending' })
      .populate({
        path: 'addedBy',
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(pendingBooks);
  } catch (error) {
    console.error('Error fetching pending books:', error);
    return NextResponse.json(
      { message: 'Failed to fetch pending books' },
      { status: 500 }
    );
  }
}