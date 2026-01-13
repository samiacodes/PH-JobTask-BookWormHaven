import { BookOpen, Star, Users } from 'lucide-react';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  genre: string[];
  averageRating: number;
  totalReviews: number;
  isFeatured?: boolean;
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  return (
    <Link href={`/books/${book._id}`}>
      <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer">
        {/* Cover placeholder with gradient */}
        <div className="h-48 rounded-xl mb-6 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-white/50" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-gray-400 text-sm mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {renderStars(book.averageRating)}
          </div>
          <span className="text-gray-400 text-sm">({book.totalReviews})</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {book.genre.slice(0, 2).map((g, idx) => (
            <span 
              key={idx} 
              className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
            >
              {g}
            </span>
          ))}
          {book.genre.length > 2 && (
            <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full">
              +{book.genre.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}