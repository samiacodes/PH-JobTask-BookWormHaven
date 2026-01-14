import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';
import Book from '@/model/book.model';
import { Types } from 'mongoose';


export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  
) {
  try {
  
    const { id } = await context.params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate review ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate required fields
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status (pending/approved/rejected) is required' },
        { status: 400 }
      );
    }

    await connectDb();

    // Update review status
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated document
    )
    .populate('book', '_id')
    .populate('user', '_id');

    if (!updatedReview) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    // If the review is approved, update the book's average rating and total reviews
    if (status === 'approved') {
      // Get all approved reviews for this book
      const bookId = updatedReview.book._id || updatedReview.book;
      const approvedReviews = await Review.find({
        book: bookId,
        status: 'approved'
      });

      // Calculate new average rating
      const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / approvedReviews.length;

      // Update book with new average rating and total reviews
      await Book.findByIdAndUpdate(bookId, {
        averageRating,
        totalReviews: approvedReviews.length
      });
    }

    return NextResponse.json({
      message: `Review ${status} successfully`,
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  
) {
  try {
    
    const { id } = await context.params;
    

    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate review ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // Delete review
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    // After deleting the review, recalculate the book's average rating and total reviews
    const bookId = deletedReview.book._id || deletedReview.book;
    const approvedReviews = await Review.find({
      book: bookId,
      status: 'approved'
    });

    // Calculate new average rating
    const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;

    // Update book with new average rating and total reviews
    await Book.findByIdAndUpdate(bookId, {
      averageRating,
      totalReviews: approvedReviews.length
    });

    return NextResponse.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate review ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // Find review by ID
    const review = await Review.findById(id)
      .populate('book', 'title author')
      .populate('user', 'name email');

    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}