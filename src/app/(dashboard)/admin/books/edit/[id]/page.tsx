'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { BookOpen } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: [] as string[],
    pages: '',
    publishedYear: '',
    isbn: '',
    coverImage: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 
    'Mystery', 'Romance', 'Biography', 'Self-Help', 'Thriller'
  ];

  // Fetch book data when component mounts
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.book.title,
            author: data.book.author,
            description: data.book.description,
            genre: Array.isArray(data.book.genre) ? data.book.genre : [data.book.genre],
            pages: data.book.pages.toString(),
            publishedYear: data.book.publishedYear?.toString() || '',
            isbn: data.book.isbn || '',
            coverImage: data.book.coverImage,
            isFeatured: data.book.isFeatured || false,
          });
        } else {
          alert('Failed to load book data');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        alert('Error loading book data');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Book deleted successfully!');
          // Redirect to books list page
          window.location.href = '/admin/books';
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          genre: formData.genre,
          coverImage: formData.coverImage,
          pages: parseInt(formData.pages),
          publishedYear: parseInt(formData.publishedYear),
          isbn: formData.isbn,
          isFeatured: formData.isFeatured,
        }),
      });
      
      if (response.ok) {
        alert('Book updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('An error occurred while updating the book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Book Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter book title"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter author name"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">Pages</label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Number of pages"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Year published"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="ISBN (optional)"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Cover Image</label>
              <ImageUpload onUpload={handleImageUpload} currentImageUrl={formData.coverImage} />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-slate-300 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Describe the book"
            ></textarea>
          </div>
          
          <div className="mt-6">
            <label className="block text-slate-300 mb-2">Genre *</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    formData.genre.includes(genre)
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded bg-slate-600 border-slate-500 accent-violet-500"
              />
              <span className="text-slate-300">Feature this book</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Update Book
          </button>
        </div>
      </form>
    </div>
  );
}