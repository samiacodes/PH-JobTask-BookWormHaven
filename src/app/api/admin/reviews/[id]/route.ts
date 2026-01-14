import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Review from '@/model/review.model';
import Book from '@/model/book.model';
import { getToken } from 'next-auth/jwt';

// Handle PUT request to update review status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDb();

    // Get token to check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    // Update the review status
    review.status = status;
    await review.save();

    // If the review is approved, update the book's average rating
    if (status === 'approved') {
      // Recalculate the book's average rating and total reviews
      const book = await Book.findById(review.book);
      if (book) {
        // Get all approved reviews for this book
        const approvedReviews = await Review.find({
          book: book._id,
          status: 'approved'
        });

        // Calculate new average rating
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        book.averageRating = totalRating / approvedReviews.length || 0;
        book.totalReviews = approvedReviews.length;

        await book.save();
      }
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json(
      { message: 'Failed to update review status' },
      { status: 500 }
    );
  }
}

// Handle DELETE request to remove a review
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDb();

    // Get token to check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    // If the deleted review was approved, recalculate the book's average rating
    if (review.status === 'approved') {
      const book = await Book.findById(review.book);
      if (book) {
        // Get all approved reviews for this book
        const approvedReviews = await Review.find({
          book: book._id,
          status: 'approved'
        });

        // Calculate new average rating
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        book.averageRating = totalRating / approvedReviews.length || 0;
        book.totalReviews = approvedReviews.length;

        await book.save();
      }
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}