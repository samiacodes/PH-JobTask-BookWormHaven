import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';

// Define a basic Tutorial model schema here since we don't have a dedicated model file
interface ITutorial {
  _id: string;
  title: string;
  url: string;
  category: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Since we don't have a dedicated model, we'll use a generic approach
// In a real application, you would have a Tutorial model defined
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Since we don't have a real Tutorial model, returning mock data for now
    // In a real implementation, you would query your database here
    const mockTutorials = [
      { _id: '1', title: 'How to Read Faster', url: 'https://youtube.com/watch?v=12345', category: 'Reading Tips', createdAt: new Date(), updatedAt: new Date() },
      { _id: '2', title: 'Building Your Personal Library', url: 'https://youtube.com/watch?v=67890', category: 'Organization', createdAt: new Date(), updatedAt: new Date() },
      { _id: '3', title: 'Understanding Literary Genres', url: 'https://youtube.com/watch?v=abcde', category: 'Education', createdAt: new Date(), updatedAt: new Date() },
      { _id: '4', title: 'Book Review Writing Guide', url: 'https://youtube.com/watch?v=fghij', category: 'Writing', createdAt: new Date(), updatedAt: new Date() },
      { _id: '5', title: 'Creating Reading Lists', url: 'https://youtube.com/watch?v=klmno', category: 'Planning', createdAt: new Date(), updatedAt: new Date() },
    ];

    const filteredTutorials = search 
      ? mockTutorials.filter(tut => 
          tut.title.toLowerCase().includes(search.toLowerCase()) || 
          tut.category.toLowerCase().includes(search.toLowerCase())
        )
      : mockTutorials;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTutorials = filteredTutorials.slice(startIndex, endIndex);

    return NextResponse.json({
      tutorials: paginatedTutorials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredTutorials.length / limit),
        totalTutorials: filteredTutorials.length,
        hasNextPage: page < Math.ceil(filteredTutorials.length / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 401 }
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

    // In a real implementation, you would save to your database here
    // For now, returning mock data
    const newTutorial = {
      _id: Date.now().toString(), // In a real app, this would be the MongoDB ID
      title,
      url,
      category,
      thumbnail,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(
      { message: 'Tutorial created successfully', tutorial: newTutorial },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}