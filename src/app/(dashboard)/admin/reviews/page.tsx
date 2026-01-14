'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Star, BookOpen, User, Edit3, Trash2, Search, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';

interface Review {
  _id: string;
  book: {
    title: string;
  };
  user: {
    name: string;
    email: string;
  };
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async (page: number = 1, search: string = '', status: string = '') => {
    setLoading(true);
    try {
      let url = `/api/reviews?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalReviews(data.pagination.totalReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchReviews(1, searchTerm);
  };

  const handleFilter = (field: string, value: string) => {
    fetchReviews(1, '', value);
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refresh the list
        fetchReviews(currentPage);
      } else {
        alert(`Failed to update review status to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Error updating review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the list
          fetchReviews(currentPage);
        } else {
          alert('Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const columns = [
    { 
      key: 'book.title', 
      label: 'Book',
      render: (item: Review) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500" />
          {item.book.title}
        </div>
      )
    },
    { 
      key: 'user.name', 
      label: 'User',
      render: (item: Review) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          {item.user.name}
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (item: Review) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} 
            />
          ))}
          <span className="ml-1 text-slate-400">({item.rating})</span>
        </div>
      )
    },
    { 
      key: 'text', 
      label: 'Comment',
      render: (item: Review) => (
        <div className="max-w-xs truncate text-slate-300">
          {item.text}
        </div>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (item: Review) => new Date(item.createdAt).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: Review) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item._id, e.target.value as 'approved' | 'rejected' | 'pending')}
          className={`w-full max-w-[120px] rounded-full text-xs px-2 py-1 focus:outline-none ${
            item.status === 'approved' 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : item.status === 'pending'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-red-500/20 text-red-300'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      )
    },
  ];

  const filters = [
    {
      field: 'status',
      label: 'Filter by Status',
      options: [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Moderate Reviews</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-400">Loading reviews...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={reviews}
            total={totalReviews}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchPlaceholder="Search reviews..."
            filters={filters}
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