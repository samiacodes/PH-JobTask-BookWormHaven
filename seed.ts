import connectDb from './src/lib/db';
import User from './src/model/user.model';
import Book from './src/model/book.model';
import Review from './src/model/review.model';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    await connectDb();

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bookworm.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@bookworm.com',
      password: userPassword,
      role: 'user',
      isActive: true
    });

    // Create sample books
    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel set in the Jazz Age.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2076&auto=format&fit=crop',
        genre: ['Fiction', 'Classic'],
        pages: 180,
        publishedYear: 1925,
        isbn: '978-0-7432-7356-5',
        averageRating: 0,
        totalReviews: 0,
        isFeatured: true,
        addedBy: adminUser._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2076&auto=format&fit=crop',
        genre: ['Fiction', 'Classic'],
        pages: 281,
        publishedYear: 1960,
        isbn: '978-0-06-112008-4',
        averageRating: 0,
        totalReviews: 0,
        isFeatured: true,
        addedBy: regularUser._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian social science fiction novel.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2076&auto=format&fit=crop',
        genre: ['Fiction', 'Dystopian'],
        pages: 328,
        publishedYear: 1949,
        isbn: '978-0-452-28423-4',
        averageRating: 0,
        totalReviews: 0,
        isFeatured: false,
        addedBy: regularUser._id
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel of manners.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2076&auto=format&fit=crop',
        genre: ['Romance', 'Classic'],
        pages: 432,
        publishedYear: 1813,
        isbn: '978-0-14-143951-8',
        averageRating: 0,
        totalReviews: 0,
        isFeatured: false,
        addedBy: regularUser._id
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'A story about teenage rebellion and angst.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2076&auto=format&fit=crop',
        genre: ['Fiction', 'Coming-of-age'],
        pages: 277,
        publishedYear: 1951,
        isbn: '978-0-316-76948-0',
        averageRating: 0,
        totalReviews: 0,
        isFeatured: false,
        addedBy: adminUser._id
      }
    ];

    const createdBooks = await Book.insertMany(sampleBooks);

    // Create sample reviews
    const sampleReviews = [
      {
        book: createdBooks[0]._id,
        user: regularUser._id,
        rating: 5,
        comment: 'Amazing book! Truly captures the essence of the Jazz Age.',
        status: 'approved'
      },
      {
        book: createdBooks[0]._id,
        user: adminUser._id,
        rating: 4,
        comment: 'A masterpiece of American literature.',
        status: 'approved'
      },
      {
        book: createdBooks[1]._id,
        user: regularUser._id,
        rating: 5,
        comment: 'Brilliant portrayal of moral courage.',
        status: 'pending'
      },
      {
        book: createdBooks[1]._id,
        user: adminUser._id,
        rating: 3,
        comment: 'Good book but a bit slow in parts.',
        status: 'rejected'
      },
      {
        book: createdBooks[2]._id,
        user: regularUser._id,
        rating: 4,
        comment: 'Thought-provoking dystopian novel.',
        status: 'pending'
      }
    ];

    await Review.insertMany(sampleReviews);

    // Update book ratings based on approved reviews
    for (const book of createdBooks) {
      const approvedReviews = await Review.find({
        book: book._id,
        status: 'approved'
      });
      
      if (approvedReviews.length > 0) {
        const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / approvedReviews.length;
        
        await Book.findByIdAndUpdate(book._id, {
          averageRating,
          totalReviews: approvedReviews.length
        });
      }
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdBooks.length} books`);
    console.log(`Created 2 users (1 admin, 1 regular)`);
    console.log(`Created ${sampleReviews.length} reviews`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();