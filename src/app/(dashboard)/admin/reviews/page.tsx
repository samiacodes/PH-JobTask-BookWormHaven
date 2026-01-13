'use client';

import { useState } from 'react';
import { MessageSquare, Star, BookOpen, User, Edit3, Trash2, Search, Filter } from 'lucide-react';

interface Review {
  id: string;
  book: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', book: 'The Silent Patient', user: 'John Doe', rating: 5, comment: 'Amazing psychological thriller!', date: '2023-05-15', status: 'approved' },
    { id: '2', book: 'Atomic Habits', user: 'Jane Smith', rating: 4, comment: 'Great insights on building good habits.', date: '2023-05-18', status: 'approved' },
    { id: '3', book: 'Project Hail Mary', user: 'Bob Johnson', rating: 5, comment: 'Another masterpiece from Andy Weir!', date: '2023-05-20', status: 'pending' },
    { id: '4', book: 'Klara and the Sun', user: 'Alice Williams', rating: 3, comment: 'Interesting concept but slow pace.', date: '2023-05-22', status: 'pending' },
    { id: '5', book: 'The Midnight Library', user: 'Charlie Brown', rating: 4, comment: 'Thought-provoking story about life choices.', date: '2023-05-25', status: 'rejected' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.book.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || review.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: newStatus } : review
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Moderate Reviews</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 w-4 h-4" />
            <select
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 font-medium">Comment</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-700/30">
                  <td className="py-4 font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-500" />
                    {review.book}
                  </td>
                  <td className="py-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {review.user}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} 
                        />
                      ))}
                      <span className="ml-1 text-slate-400">({review.rating})</span>
                    </div>
                  </td>
                  <td className="py-4 max-w-xs truncate text-slate-300">{review.comment}</td>
                  <td className="py-4 text-slate-400">{review.date}</td>
                  <td className="py-4">
                    <select
                      value={review.status}
                      onChange={(e) => handleStatusChange(review.id, e.target.value as any)}
                      className={`w-full max-w-[120px] rounded-full text-xs px-2 py-1 focus:outline-none ${
                        review.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : review.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-200 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}