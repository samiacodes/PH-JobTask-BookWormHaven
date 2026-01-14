'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, TrendingUp, Calendar, User, Award, BookText, CheckCircle } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  pages: number;
  progress?: number;
}

interface UserActivity {
  id: string;
  action: string;
  bookTitle: string;
  timestamp: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  joinDate: string;
  stats: {
    booksRead: number;
    pagesRead: number;
    readingGoal: number;
    booksThisYear: number;
    currentReads: number;
    wantToRead: number;
    completedBooks: number;
  };
  topGenres: string[];
  recentActivity: UserActivity[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status, session, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile data from API
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      setUserProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set default profile data
      setUserProfile({
        name: session?.user?.name || 'User',
        email: session?.user?.email || '',
        role: session?.user?.role || 'user',
        joinDate: 'Jan 2025',
        stats: {
          booksRead: 128,
          pagesRead: 42000,
          readingGoal: 60,
          booksThisYear: 39,
          currentReads: 3,
          wantToRead: 24,
          completedBooks: 128
        },
        topGenres: ['Fiction', 'Mystery', 'Sci-Fi', 'Biography'],
        recentActivity: [
          { id: '1', action: 'Finished', bookTitle: 'Atomic Habits', timestamp: '2 hours ago' },
          { id: '2', action: 'Added to Want to Read', bookTitle: 'The Midnight Library', timestamp: '1 day ago' },
          { id: '3', action: 'Rated', bookTitle: 'Project Hail Mary', timestamp: '2 days ago' },
          { id: '4', action: 'Started reading', bookTitle: 'Deep Work', timestamp: '3 days ago' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect effect will happen in useEffect
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load profile data</p>
          <button 
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats } = userProfile;
  const readingProgress = Math.round((stats.booksThisYear / stats.readingGoal) * 100);

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Your Reading Profile
            </h1>
            <p className="text-gray-400">Track your reading journey and achievements</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - User Info */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  <p className="text-gray-400">{userProfile.email}</p>
                  <p className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full inline-block mt-2">
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)} Member
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Member Since
                  </h3>
                  <p className="text-gray-400">{userProfile.joinDate}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Reading Goal 2025
                    </h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(readingProgress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">{stats.booksThisYear}/{stats.readingGoal} books ({readingProgress}%)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-500/20 p-4 rounded-xl border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span className="text-2xl font-bold">{stats.booksRead}</span>
                      </div>
                      <p className="text-sm text-gray-400">Books Read</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <BookText className="w-5 h-5 text-green-400" />
                        <span className="text-2xl font-bold">{stats.pagesRead.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-400">Pages</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle Column - Stats */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Reading Statistics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Currently Reading</span>
                        <span>{stats.currentReads} books</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((stats.currentReads / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Want to Read</span>
                        <span>{stats.wantToRead} books</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((stats.wantToRead / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Completed</span>
                        <span>{stats.completedBooks} books</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Top Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.topGenres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Recent Activity */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {userProfile.recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span> 
                            {' "'}
                            <span className="text-purple-400">{activity.bookTitle}</span>
                            {'"'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}