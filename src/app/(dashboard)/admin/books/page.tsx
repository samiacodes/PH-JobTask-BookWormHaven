'use client';

import { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Search, Filter } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  addedDate: string;
  status: 'active' | 'inactive';
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', addedDate: '2023-05-15', status: 'active' },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', addedDate: '2023-06-20', status: 'active' },
    { id: '3', title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', addedDate: '2023-07-10', status: 'active' },
    { id: '4', title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi', addedDate: '2023-08-05', status: 'inactive' },
    { id: '5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Fiction', addedDate: '2023-08-12', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || book.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search books..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Author</th>
                <th className="pb-3 font-medium">Genre</th>
                <th className="pb-3 font-medium">Added Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-700/30">
                  <td className="py-4 font-medium">{book.title}</td>
                  <td className="py-4">{book.author}</td>
                  <td className="py-4">
                    <span className="bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{book.addedDate}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-200 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDelete(book.id)}
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