'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, X, CheckCircle } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';
import GradientButton from '@/app/components/GradientButton';

export default function AddBookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: [] as string[],
    pages: '',
    publishedYear: '',
    isbn: '',
    coverImage: ''
  });

  // Available genres
  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 
    'Mystery', 'Romance', 'Biography', 'Self-Help'
  ];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        publishedYear: yearNum,
        addedBy: session?.user?.id
      };

      // Make API call
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add book');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/library');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">Only admins can add books.</p>
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
              Add New <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Book</span>
            </h1>
            <p className="text-gray-400">Share your favorite books with the community</p>
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
                  Book submitted successfully! Redirecting...
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

              <div className="pt-4">
                <GradientButton 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Book for Review'
                  )}
                </GradientButton>
              </div>
            </form>
          </GlassCard>

          {/* Preview Card */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Preview</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
              <div className="h-48 rounded-xl mb-6 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                {formData.coverImage ? (
                  <img 
                    src={formData.coverImage} 
                    alt={formData.title} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-white/50" />
                )}
              </div>

              <h3 className="font-bold text-lg mb-1 line-clamp-2">
                {formData.title || 'Book Title'}
              </h3>

              <p className="text-gray-400 text-sm mb-3">{formData.author || 'Author Name'}</p>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(0)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.genre.slice(0, 2).map((g, idx) => (
                  <span 
                    key={idx} 
                    className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
                {formData.genre.length > 2 && (
                  <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full">
                    +{formData.genre.length - 2}
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm line-clamp-3">
                {formData.description || 'Book description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}