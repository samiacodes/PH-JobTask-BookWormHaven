'use client';

import { useState } from 'react';
import { BookOpen, Clock, CheckCircle, Bookmark, MoreVertical } from 'lucide-react';

const shelves = {
  'want-to-read': [
    { id: 1, title: 'Project Hail Mary', author: 'Andy Weir', progress: 0 },
    { id: 2, title: 'The Midnight Library', author: 'Matt Haig', progress: 0 },
  ],
  'currently-reading': [
    { id: 3, title: 'Dark Matter', author: 'Blake Crouch', progress: 65 },
    { id: 4, title: 'The Silent Patient', author: 'Alex Michaelides', progress: 30 },
  ],
  'read': [
    { id: 5, title: 'Atomic Habits', author: 'James Clear', progress: 100 },
    { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', progress: 100 },
  ],
};

export default function LibraryPage() {
  const [activeShelf, setActiveShelf] = useState('want-to-read');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-gray-400">Manage your reading collection</p>
      </div>

      {/* Shelf Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveShelf('want-to-read')}
          className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeShelf === 'want-to-read' ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
        >
          <Bookmark className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Want to Read</div>
            <div className="text-sm text-gray-300">{shelves['want-to-read'].length} books</div>
          </div>
        </button>

        <button
          onClick={() => setActiveShelf('currently-reading')}
          className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeShelf === 'currently-reading' ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
        >
          <Clock className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Currently Reading</div>
            <div className="text-sm text-gray-300">{shelves['currently-reading'].length} books</div>
          </div>
        </button>

        <button
          onClick={() => setActiveShelf('read')}
          className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeShelf === 'read' ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
        >
          <CheckCircle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Read</div>
            <div className="text-sm text-gray-300">{shelves['read'].length} books</div>
          </div>
        </button>
      </div>

      {/* Books in Selected Shelf */}
      <div className="space-y-4">
        {shelves[activeShelf as keyof typeof shelves].map((book) => (
          <div key={book.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-400">by {book.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Progress Bar */}
                <div className="w-32">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>

                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Book Button */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/20 transition-all">
          <BookOpen className="w-5 h-5" />
          Add New Book to Library
        </button>
      </div>
    </div>
  );
}