'use client';

import { useState } from 'react';
import { BookOpen, Upload } from 'lucide-react';

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: [] as string[],
    pages: '',
    publishedYear: '',
    isbn: '',
    coverImage: '',
  });

  const genres = [
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 
    'Mystery', 'Romance', 'Biography', 'Self-Help'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding book:', formData);
    // Here you would typically send the data to your API
    alert('Book added successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      
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
            
            <div>
              <label className="block text-slate-300 mb-2">Cover Image URL</label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Image URL (optional)"
              />
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
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
}