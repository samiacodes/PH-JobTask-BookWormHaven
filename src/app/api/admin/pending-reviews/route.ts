import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const count = await Review.countDocuments({ status: 'pending' });

    return NextResponse.json({ 
      count,
      message: 'Pending reviews count fetched successfully'
    });

  } catch (error: any) {
    console.error('Error fetching pending reviews count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch pending reviews count', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}