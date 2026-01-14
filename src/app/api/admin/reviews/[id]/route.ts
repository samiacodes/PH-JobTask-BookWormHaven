import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';

// GET single review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const review = await Review.findById(params.id)
      .populate({
        path: 'book',
        select: 'title author coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .lean();

    if (!review) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Review not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch review', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// PATCH - Update review status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid status value. Must be pending, approved, or rejected' 
        }, 
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
      .populate({
        path: 'book',
        select: 'title author coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .lean();

    if (!review) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Review not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review ${status} successfully`,
      review
    });

  } catch (error: any) {
    console.error('Error updating review status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update review status', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// PUT - Update full review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { text, rating, status } = await request.json();

    // Validation
    if (!text?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Review text is required' 
        }, 
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Rating must be a number between 1 and 5' 
        }, 
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid status value' 
        }, 
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      params.id,
      { 
        text: text.trim(),
        rating: Math.round(rating), // Ensure integer rating
        status 
      },
      { new: true }
    )
      .populate({
        path: 'book',
        select: 'title author coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .lean();

    if (!review) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Review not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update review', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const review = await Review.findByIdAndDelete(params.id);

    if (!review) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Review not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete review', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}