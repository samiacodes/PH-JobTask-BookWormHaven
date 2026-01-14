import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import { Types } from 'mongoose';

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

    // Validate tutorial ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid tutorial ID' },
        { status: 400 }
      );
    }

    await connectDb();

    // In a real implementation, you would delete from your database here
    // For now, returning success
    return NextResponse.json({
      message: 'Tutorial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Validate tutorial ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid tutorial ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, url, category, thumbnail } = body;

    // Validate required fields
    if (!title || !url || !category) {
      return NextResponse.json(
        { message: 'Missing required fields: title, url, and category are required' },
        { status: 400 }
      );
    }

    await connectDb();

    // In a real implementation, you would update in your database here
    // For now, returning mock data
    const updatedTutorial = {
      _id: id,
      title,
      url,
      category,
      thumbnail,
      updatedAt: new Date()
    };

    return NextResponse.json({
      message: 'Tutorial updated successfully',
      tutorial: updatedTutorial
    });
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}