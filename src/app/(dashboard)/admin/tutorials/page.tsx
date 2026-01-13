'use client';

import { useState } from 'react';
import { Video, Plus, Edit3, Trash2, Search, Filter } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  url: string;
  category: string;
  addedDate: string;
  status: 'active' | 'inactive';
}

export default function TutorialsManagement() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([
    { id: '1', title: 'How to Read Faster', url: 'https://youtube.com/watch?v=12345', category: 'Reading Tips', addedDate: '2023-05-15', status: 'active' },
    { id: '2', title: 'Building Your Personal Library', url: 'https://youtube.com/watch?v=67890', category: 'Organization', addedDate: '2023-05-20', status: 'active' },
    { id: '3', title: 'Understanding Literary Genres', url: 'https://youtube.com/watch?v=abcde', category: 'Education', addedDate: '2023-06-01', status: 'active' },
    { id: '4', title: 'Book Review Writing Guide', url: 'https://youtube.com/watch?v=fghij', category: 'Writing', addedDate: '2023-06-10', status: 'inactive' },
    { id: '5', title: 'Creating Reading Lists', url: 'https://youtube.com/watch?v=klmno', category: 'Planning', addedDate: '2023-06-15', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tutorial.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || tutorial.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setTutorials(tutorials.filter(tutorial => tutorial.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Tutorials</h1>
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Tutorial
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tutorials..."
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
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Added Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTutorials.map((tutorial) => (
                <tr key={tutorial.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-700/30">
                  <td className="py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-violet-500" />
                      {tutorial.title}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded-full">
                      {tutorial.category}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{tutorial.addedDate}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tutorial.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {tutorial.status.charAt(0).toUpperCase() + tutorial.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-200 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDelete(tutorial.id)}
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