import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDb from '@/lib/db';
import Book from '@/model/book.model';
import Genre from '@/model/genre.model';

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

    // Get books by genre data
    const booksByGenre = await Book.aggregate([
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genreInfo"
        }
      },
      { $unwind: "$genreInfo" },
      {
        $group: {
          _id: "$genreInfo.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Format the result
    const result = booksByGenre.map(item => ({
      name: item._id,
      value: item.count
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching books by genre data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}