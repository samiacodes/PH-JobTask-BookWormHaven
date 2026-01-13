'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Star, AlertTriangle, Trash2, CheckCircle, X } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';
import GradientButton from '@/app/components/GradientButton';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre: string[];
  pages: number;
  publishedYear: number;
  isbn?: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;

  addedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function EditBookPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: [] as string[],
    pages: '',
    publishedYear: '',
    isbn: '',
    coverImage: '',
    isFeatured: false
  });

  // Available genres
  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 
    'Mystery', 'Romance', 'Biography', 'Self-Help'
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        setBook(data);
        
        // Set form data
        setFormData({
          title: data.title,
          author: data.author,
          description: data.description,
          genre: data.genre,
          pages: data.pages.toString(),
          publishedYear: data.publishedYear.toString(),
          isbn: data.isbn || '',
          coverImage: data.coverImage || '',
          isFeatured: data.isFeatured
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleGenreToggle = (genre: string) => {
    if (formData.genre.includes(genre)) {
      setFormData({
        ...formData,
        genre: formData.genre.filter(g => g !== genre)
      });
    } else {
      setFormData({
        ...formData,
        genre: [...formData.genre, genre]
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Skip status field since it no longer exists
    if (name === 'status') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    
    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.author.trim()) {
        throw new Error('Author is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.genre.length === 0) {
        throw new Error('At least one genre is required');
      }
      if (!formData.pages.trim()) {
        throw new Error('Pages is required');
      }
      if (!formData.publishedYear.trim()) {
        throw new Error('Published year is required');
      }

      // Validate numeric values
      const pagesNum = parseInt(formData.pages);
      const yearNum = parseInt(formData.publishedYear);
      
      if (isNaN(pagesNum) || pagesNum <= 0) {
        throw new Error('Pages must be a positive number');
      }
      
      if (isNaN(yearNum) || yearNum < 1000 || yearNum > new Date().getFullYear()) {
        throw new Error('Published year must be between 1000 and current year');
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        pages: pagesNum,
        publishedYear: yearNum
      };

      // Make API call
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update book');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/books/${id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete book');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">Only admins can edit books.</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-gray-400">The book you're trying to edit doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Edit <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Book</span>
            </h1>
            <p className="text-gray-400">Update book details and settings</p>
          </div>

          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 text-green-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Book updated successfully! Redirecting...
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Describe the book"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Genre *</label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        formData.genre.includes(genre)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {formData.genre.length === 0 && (
                  <p className="text-red-400 text-sm mt-1">At least one genre is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Pages *</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Number of pages"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Published Year *</label>
                  <input
                    type="number"
                    name="publishedYear"
                    value={formData.publishedYear}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Year published"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="ISBN (optional)"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Cover Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Image URL (optional)"
                  />
                </div>
              </div>

              {/* Admin-only fields */}
              <div className="pt-6 border-t border-white/10">
                <h2 className="text-xl font-bold mb-4 text-purple-400">Admin Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 rounded bg-white/10 border-white/20 accent-purple-500"
                      />
                      <span className="text-gray-300">Feature this book</span>
                    </label>
                  </div>

                  <div>
                    {/* Status field removed - no approval needed */}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <GradientButton 
                  type="submit" 
                  disabled={updating}
                  className="flex-1"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Book'
                  )}
                </GradientButton>
                
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Delete Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 mx-auto"
            >
              <Trash2 className="w-5 h-5" />
              Delete Book
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-red-400">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-full border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}