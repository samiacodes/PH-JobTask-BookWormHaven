'use client';

import { useState, useEffect } from 'react';
import { Video, Plus, Edit3, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';

interface Tutorial {
  _id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function TutorialsManagement() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTutorials, setTotalTutorials] = useState(0);

  const fetchTutorials = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      let url = `/api/tutorials?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTutorials(data.tutorials);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalTutorials(data.pagination.totalTutorials);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handlePageChange = (page: number) => {
    fetchTutorials(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchTutorials(1, searchTerm);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        const response = await fetch(`/api/tutorials/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the list
          fetchTutorials(currentPage);
        } else {
          alert('Failed to delete tutorial');
        }
      } catch (error) {
        console.error('Error deleting tutorial:', error);
        alert('Error deleting tutorial');
      }
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (item: Tutorial) => (
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-500" />
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {item.title}
          </a>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { 
      key: 'createdAt', 
      label: 'Added Date',
      render: (item: Tutorial) => new Date(item.createdAt).toLocaleDateString()
    },
  ];

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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-400">Loading tutorials...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tutorials}
            total={totalTutorials}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            searchPlaceholder="Search tutorials..."
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
    </div>
  );
}