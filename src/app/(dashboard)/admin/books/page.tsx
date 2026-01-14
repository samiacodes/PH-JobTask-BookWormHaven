'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit3, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string[];
  coverImage: string;
  pages: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchBooks = async (page: number = 1, search: string = '', genre: string = '') => {
    setLoading(true);
    try {
      let url = `/api/books?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalBooks(data.pagination.totalBooks);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchBooks(1, searchTerm);
  };

  const handleFilter = (field: string, value: string) => {
    fetchBooks(1, '', value);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the list
          fetchBooks(currentPage);
        } else {
          alert('Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book');
      }
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { 
      key: 'genre', 
      label: 'Genre',
      render: (item: Book) => (
        <div className="flex flex-wrap gap-1">
          {item.genre.map((g, idx) => (
            <span key={idx} className="bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded-full">
              {g}
            </span>
          ))}
        </div>
      )
    },
    { key: 'pages', label: 'Pages' },
    { 
      key: 'averageRating', 
      label: 'Rating',
      render: (item: Book) => (
        <div className="flex items-center gap-1">
          <span>{item.averageRating.toFixed(1)}</span>
        </div>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Added Date',
      render: (item: Book) => new Date(item.createdAt).toLocaleDateString()
    },
  ];

  const filters = [
    {
      field: 'genre',
      label: 'Filter by Genre',
      options: [
        { value: '', label: 'All Genres' },
        { value: 'Fiction', label: 'Fiction' },
        { value: 'Non-Fiction', label: 'Non-Fiction' },
        { value: 'Sci-Fi', label: 'Sci-Fi' },
        { value: 'Mystery', label: 'Mystery' },
        { value: 'Romance', label: 'Romance' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <a href="/admin/books/add" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add New Book
        </a>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-400">Loading books...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={books}
            total={totalBooks}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchPlaceholder="Search books by title or author..."
            filters={filters}
            actions={(item) => (
              <div className="flex items-center gap-2">
                <a 
                  href={`/admin/books/edit/${item._id}`}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <Edit3 className="w-4 h-4" />
                </a>
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