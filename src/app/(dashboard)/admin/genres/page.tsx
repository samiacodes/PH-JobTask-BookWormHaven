'use client';

import { useState } from 'react';
import { Tag, Plus, Edit3, Trash2 } from 'lucide-react';

interface Genre {
  id: string;
  name: string;
  bookCount: number;
  createdAt: string;
}

export default function GenresManagement() {
  const [genres, setGenres] = useState<Genre[]>([
    { id: '1', name: 'Fiction', bookCount: 1200, createdAt: '2023-01-15' },
    { id: '2', name: 'Non-Fiction', bookCount: 850, createdAt: '2023-01-16' },
    { id: '3', name: 'Sci-Fi', bookCount: 650, createdAt: '2023-02-01' },
    { id: '4', name: 'Fantasy', bookCount: 720, createdAt: '2023-02-10' },
    { id: '5', name: 'Mystery', bookCount: 580, createdAt: '2023-03-05' },
    { id: '6', name: 'Romance', bookCount: 920, createdAt: '2023-03-12' },
    { id: '7', name: 'Biography', bookCount: 450, createdAt: '2023-04-01' },
    { id: '8', name: 'Self-Help', bookCount: 630, createdAt: '2023-04-15' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');

  const handleAddGenre = () => {
    if (newGenreName.trim()) {
      const newGenre: Genre = {
        id: (genres.length + 1).toString(),
        name: newGenreName.trim(),
        bookCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setGenres([...genres, newGenre]);
      setNewGenreName('');
      setShowAddModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setGenres(genres.filter(genre => genre.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Genres</h1>
        <button 
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Genre
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="pb-3 font-medium">Genre</th>
                <th className="pb-3 font-medium">Book Count</th>
                <th className="pb-3 font-medium">Created Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-700/30">
                  <td className="py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-violet-500" />
                      {genre.name}
                    </div>
                  </td>
                  <td className="py-4">{genre.bookCount}</td>
                  <td className="py-4 text-slate-400">{genre.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-200 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDelete(genre.id)}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Genre</h2>
            <input
              type="text"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              placeholder="Enter genre name"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleAddGenre}
              >
                Add Genre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}