'use client';

import { useState, useEffect } from 'react';
import { Play, Search, Filter, Clock, Users } from 'lucide-react';

interface Tutorial {
  _id: string;
  title: string;
  url: string;
  category: string;
  thumbnail?: string;
  views: number;
  duration: string;
  createdAt: string;
}

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Mock tutorials data - in a real app, this would come from the API
  const mockTutorials: Tutorial[] = [
    {
      _id: '1',
      title: 'How to Read Faster and Retain More Information',
      url: 'https://www.youtube.com/embed/abc123',
      category: 'Reading Tips',
      views: 2450,
      duration: '12:45',
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'Building Your Personal Digital Library',
      url: 'https://www.youtube.com/embed/def456',
      category: 'Organization',
      views: 1890,
      duration: '18:22',
      createdAt: '2024-01-10'
    },
    {
      _id: '3',
      title: 'Understanding Literary Genres: A Complete Guide',
      url: 'https://www.youtube.com/embed/ghi789',
      category: 'Education',
      views: 3200,
      duration: '22:15',
      createdAt: '2024-01-05'
    },
    {
      _id: '4',
      title: 'How to Write Meaningful Book Reviews',
      url: 'https://www.youtube.com/embed/jkl012',
      category: 'Writing',
      views: 1560,
      duration: '15:30',
      createdAt: '2024-01-01'
    },
    {
      _id: '5',
      title: 'Creating Effective Reading Lists and Goals',
      url: 'https://www.youtube.com/embed/mno345',
      category: 'Planning',
      views: 2100,
      duration: '10:18',
      createdAt: '2023-12-28'
    },
    {
      _id: '6',
      title: 'Speed Reading Techniques for Busy Professionals',
      url: 'https://www.youtube.com/embed/pqr678',
      category: 'Reading Tips',
      views: 4200,
      duration: '25:40',
      createdAt: '2023-12-20'
    },
    {
      _id: '7',
      title: 'Literary Analysis: How to Understand Deeper Meanings',
      url: 'https://www.youtube.com/embed/stu901',
      category: 'Education',
      views: 1750,
      duration: '28:12',
      createdAt: '2023-12-15'
    },
    {
      _id: '8',
      title: 'Digital vs Physical Books: Pros and Cons',
      url: 'https://www.youtube.com/embed/vwx234',
      category: 'Discussion',
      views: 980,
      duration: '14:55',
      createdAt: '2023-12-10'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTutorials(mockTutorials);
      setFilteredTutorials(mockTutorials);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(mockTutorials.map(t => t.category)));
      setCategories(['all', ...uniqueCategories]);
      
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = tutorials;

    if (searchQuery) {
      result = result.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(tutorial => tutorial.category === selectedCategory);
    }

    setFilteredTutorials(result);
  }, [searchQuery, selectedCategory, tutorials]);

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Reading Tutorials</h1>
          <p className="text-gray-400">Learn tips and techniques to enhance your reading experience</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutorials..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 outline-none focus:border-purple-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
              <div className="aspect-video relative">
                <iframe
                  src={tutorial.url.replace('watch?v=', 'embed/')}
                  title={tutorial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tutorial.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatViews(tutorial.views)}
                  </span>
                  
                  <span className="inline-flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {formatDate(tutorial.createdAt)}
                  </span>
                </div>
                
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    {tutorial.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tutorials found matching your criteria</div>
            <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}