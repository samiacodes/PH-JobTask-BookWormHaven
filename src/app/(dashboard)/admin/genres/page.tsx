'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Edit3, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';

interface Genre {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function GenresManagement() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGenres, setTotalGenres] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');

  const fetchGenres = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      let url = `/api/genres?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalGenres(data.pagination.totalGenres);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handlePageChange = (page: number) => {
    fetchGenres(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchGenres(1, searchTerm);
  };

  const handleAddGenre = async () => {
    if (newGenreName.trim()) {
      try {
        const response = await fetch('/api/genres', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newGenreName.trim() }),
        });
        
        if (response.ok) {
          setNewGenreName('');
          setShowAddModal(false);
          // Refresh the list
          fetchGenres(currentPage);
        } else {
          alert('Failed to add genre');
        }
      } catch (error) {
        console.error('Error adding genre:', error);
        alert('Error adding genre');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        const response = await fetch(`/api/genres/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the list
          fetchGenres(currentPage);
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete genre');
        }
      } catch (error) {
        console.error('Error deleting genre:', error);
        alert('Error deleting genre');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Genre' },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'createdAt', 
      label: 'Created Date',
      render: (item: Genre) => new Date(item.createdAt).toLocaleDateString()
    },
  ];

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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-400">Loading genres...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={genres}
            total={totalGenres}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            searchPlaceholder="Search genres..."
            actions={(item) => (
              <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-slate-200 p-1">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  className="text-slate-400 hover:text-red-400 p-1"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        )}
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