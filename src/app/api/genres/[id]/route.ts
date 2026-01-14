import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Genre from '@/model/genre.model';
import Book from '@/model/book.model';
import { Types } from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate genre ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid genre ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: 'Genre name is required' },
        { status: 400 }
      );
    }

    await connectDb();

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/--+/g, '-');

    // Update genre
    const updatedGenre = await Genre.findByIdAndUpdate(
      id,
      {
        name,
        slug
      },
      { new: true } // Return updated document
    );

    if (!updatedGenre) {
      return NextResponse.json(
        { message: 'Genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Genre updated successfully',
      genre: updatedGenre
    });
  } catch (error) {
    console.error('Error updating genre:', error);
    
    // Handle duplicate name error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { message: 'A genre with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate genre ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid genre ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if any books are associated with this genre
    const booksWithGenre = await Book.countDocuments({ genre: id });
    
    if (booksWithGenre > 0) {
      return NextResponse.json(
        { message: 'Cannot delete genre: books are associated with this genre' },
        { status: 400 }
      );
    }

    // Delete genre
    const deletedGenre = await Genre.findByIdAndDelete(id);

    if (!deletedGenre) {
      return NextResponse.json(
        { message: 'Genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Genre deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting genre:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}