import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';

export async function PATCH(request: NextRequest) {
  try {
    await connectDb();

    const { ids, status } = await request.json();

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Please provide an array of review IDs' 
        }, 
        { status: 400 }
      );
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid status value' 
        }, 
        { status: 400 }
      );
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const validIds = ids.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No valid review IDs provided' 
        }, 
        { status: 400 }
      );
    }

    // Update multiple reviews
    const result = await Review.updateMany(
      { _id: { $in: validIds } },
      { status }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} review(s) updated successfully`,
      modifiedCount: result.modifiedCount,
      totalRequested: ids.length
    });

  } catch (error: any) {
    console.error('Error in bulk update:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update reviews', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}