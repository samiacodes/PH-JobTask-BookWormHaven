import mongoose from 'mongoose';

// Import models to ensure they are registered before connecting
import '@/model/user.model';
import '@/model/book.model';
import '@/model/review.model';
import '@/model/genre.model';

const MONGODB_URI: string = (process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/bookworm') as string;

if (MONGODB_URI.includes('your_mongodb_connection_string')) {
  throw new Error('Please update your .env.local file with a real MongoDB connection string');
}

// Global to maintain singleton connection across hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using cached DB connection");
    }
    return cached.conn;
  }

  if (!cached.promise) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Creating new DB connection");
    }
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => m.connection);
  }

  try {
    cached.conn = await cached.promise;
    if (process.env.NODE_ENV === 'development') {
      console.log("Database connected successfully");
    }
  } catch (e) {
    cached.promise = null;
    console.error("Database connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDb;