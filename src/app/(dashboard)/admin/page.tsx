'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, BookOpen, MessageSquare, Users, Calendar, TrendingUp, Clock, Star, Eye, Plus, FileText, CheckCircle, AlertCircle, TrendingDown, ChevronRight, Activity, RefreshCw } from 'lucide-react';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardCharts from './components/DashboardCharts';
import RecentActivity from './components/RecentActivity';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingReviews: 0,
    totalUsers: 0,
    booksAddedToday: 0,
    recentBooks: [],
    recentReviews: []
  });
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [userGrowth, setUserGrowth] = useState([]);
  const [monthlyBooks, setMonthlyBooks] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [dataTime, setDataTime] = useState<string>('');
  const router = useRouter();
  const { data: session } = useSession();

  // Memoized stats data to prevent unnecessary re-renders
  const statsData = useMemo(() => [
    { 
      title: 'Total Books', 
      value: loading ? 'Loading...' : stats.totalBooks.toLocaleString(), 
      icon: <BookOpen className="w-5 h-5" />, 
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      trend: '+12%'
    },
    { 
      title: 'Books Today', 
      value: loading ? 'Loading...' : stats.booksAddedToday.toLocaleString(), 
      icon: <Activity className="w-5 h-5" />, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+8%'
    },
    { 
      title: 'Pending Reviews', 
      value: loading ? 'Loading...' : stats.pendingReviews.toLocaleString(), 
      icon: <MessageSquare className="w-5 h-5" />, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      trend: pendingCount > 0 ? 'Needs Attention' : 'All Clear'
    },
    { 
      title: 'Total Users', 
      value: loading ? 'Loading...' : stats.totalUsers.toLocaleString(), 
      icon: <Users className="w-5 h-5" />, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+15%'
    },
  ], [loading, stats, pendingCount]);

  const fetchAllData = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    try {
      // Fetch main stats including pending reviews count
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        setPendingCount(statsData.pendingReviews || 0);
      } else {
        console.error('Failed to fetch stats');
      }
      
      // Fetch pending reviews count separately if needed
      try {
        const pendingResponse = await fetch('/api/admin/pending-reviews');
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setPendingCount(pendingData.count || 0);
        }
      } catch (pendingError) {
        console.warn('Could not fetch pending reviews count:', pendingError);
      }
      
      // Fetch chart data
      try {
        const userGrowthRes = await fetch('/api/admin/stats/user-growth');
        if (userGrowthRes.ok) {
          const userGrowthData = await userGrowthRes.json();
          // Limit to last 7 days for better mobile display
          const limitedData = userGrowthData.slice(-7);
          const transformedUserGrowth = limitedData.map((item: any) => ({
            name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: item.users || 0
          }));
          setUserGrowth(transformedUserGrowth);
        }
      } catch (userGrowthError) {
        console.warn('Could not fetch user growth data:', userGrowthError);
      }
      
      try {
        const monthlyBooksRes = await fetch('/api/admin/stats/books-monthly');
        if (monthlyBooksRes.ok) {
          const monthlyBooksData = await monthlyBooksRes.json();
          // Limit to last 6 months
          const limitedData = monthlyBooksData.slice(-6);
          const transformedMonthlyBooks = limitedData.map((item: any) => ({
            name: item.month?.substring(0, 3) || 'N/A', // Short month names
            value: item.books || 0
          }));
          setMonthlyBooks(transformedMonthlyBooks);
        }
      } catch (monthlyBooksError) {
        console.warn('Could not fetch monthly books data:', monthlyBooksError);
      }
      
      try {
        const booksByGenreRes = await fetch('/api/admin/stats/books-genre');
        if (booksByGenreRes.ok) {
          const booksByGenreData = await booksByGenreRes.json();
          // Limit to top 8 genres
          const limitedData = booksByGenreData.slice(0, 8);
          setBooksByGenre(limitedData);
        }
      } catch (booksByGenreError) {
        console.warn('Could not fetch books by genre data:', booksByGenreError);
      }

      // Set data timestamp
      setDataTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchAllData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleRefresh = (e: React.MouseEvent) => {
    fetchAllData(e);
  };

  const handleQuickAction = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(path);
  };

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      {/* Enhanced Responsive Header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg sm:rounded-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base mt-1">
                  Welcome back, {session?.user?.name || 'Admin'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-auto">
              <div className="flex items-center justify-between">
                <div className="text-slate-300 text-xs sm:text-sm font-medium">Last Updated</div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-100 text-xs sm:text-sm font-semibold">
                    {dataTime || 'Just now'}
                  </span>
                </div>
              </div>
              <div className="text-slate-400 text-xs mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={() => alert('Report generation feature coming soon!')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Responsive Stats Overview */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100">Overview</h2>
          </div>
          <div className="text-slate-400 text-xs sm:text-sm">
            Real-time stats
          </div>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} group-hover:scale-105 transition-transform duration-200`}>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                  stat.title === 'Pending Reviews' && pendingCount > 0 
                    ? 'text-amber-400' 
                    : 'text-emerald-400'
                }`}>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                  {stat.title}
                </h3>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Updated {dataTime ? `at ${dataTime}` : 'just now'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Responsive Analytics Section */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100">Analytics</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-violet-500"></div>
              <span>Last 7 days</span>
            </div>
            <button 
              onClick={() => router.push('/admin/analytics')}
              className="text-slate-400 hover:text-slate-300 text-xs sm:text-sm flex items-center gap-1 transition-colors"
            >
              <span>Details</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          {loading ? (
            <div className="h-64 sm:h-80 flex items-center justify-center">
              <div className="text-slate-400">Loading charts...</div>
            </div>
          ) : (
            <DashboardCharts 
              booksPerGenre={booksByGenre}
              monthlyBooks={monthlyBooks}
              userGrowth={userGrowth}
            />
          )}
        </div>
      </section>

      {/* Enhanced Responsive Activity Feed */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100">Recent Activity</h2>
          </div>
          <div className="text-slate-400 text-xs sm:text-sm">
            Last 24 hours
          </div>
        </div>
              
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Books Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">Recent Books</h3>
                </div>
                <span className="text-xs sm:text-sm text-slate-400 bg-slate-700/50 px-2 sm:px-3 py-1 rounded-full">
                  {stats.recentBooks?.length || 0} new
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
              <RecentActivity type="books" data={stats.recentBooks} />
            </div>
          </div>
                
          {/* Recent Reviews Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">Recent Reviews</h3>
                </div>
                <span className="text-xs sm:text-sm text-slate-400 bg-slate-700/50 px-2 sm:px-3 py-1 rounded-full">
                  {stats.recentReviews?.length || 0} new
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
              <RecentActivity type="reviews" data={stats.recentReviews} />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Responsive Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100">Quick Actions</h2>
          </div>
          <div className="text-slate-400 text-xs sm:text-sm">
            One-click access
          </div>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <button 
            onClick={handleQuickAction('/admin/books/add')}
            className="group bg-gradient-to-br from-violet-600/90 to-purple-600/90 backdrop-blur-sm border border-violet-500/30 hover:border-violet-400/50 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl group-hover:bg-white/20 transition-colors">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </div>
              <Plus className="w-3 h-3 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold mb-1">Add Book</h3>
            <p className="text-violet-200 text-xs sm:text-sm opacity-90">Create new book listing</p>
          </button>
          
          <button 
            onClick={handleQuickAction('/admin/reviews')}
            className="group bg-gradient-to-br from-amber-600/90 to-orange-600/90 backdrop-blur-sm border border-amber-500/30 hover:border-amber-400/50 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 text-left relative"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl group-hover:bg-white/20 transition-colors">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </div>
              <AlertCircle className="w-3 h-3 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold mb-1">Manage Reviews</h3>
            <p className="text-amber-200 text-xs sm:text-sm opacity-90">Review user feedback</p>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg animate-pulse">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={handleQuickAction('/admin/users')}
            className="group bg-gradient-to-br from-emerald-600/90 to-teal-600/90 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl group-hover:bg-white/20 transition-colors">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </div>
              <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold mb-1">Manage Users</h3>
            <p className="text-emerald-200 text-xs sm:text-sm opacity-90">User accounts & settings</p>
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              alert('Report generation feature coming soon!');
            }}
            className="group bg-gradient-to-br from-blue-600/90 to-cyan-600/90 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl group-hover:bg-white/20 transition-colors">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold mb-1">Generate Report</h3>
            <p className="text-blue-200 text-xs sm:text-sm opacity-90">Export analytics data</p>
          </button>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-3 flex justify-around lg:hidden z-10">
        <button 
          onClick={handleQuickAction('/admin/books')}
          className="flex flex-col items-center text-xs text-slate-400 hover:text-violet-400 transition-colors"
        >
          <BookOpen className="w-5 h-5 mb-1" />
          Books
        </button>
        <button 
          onClick={handleQuickAction('/admin/reviews')}
          className="flex flex-col items-center text-xs text-slate-400 hover:text-amber-400 transition-colors relative"
        >
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
          <MessageSquare className="w-5 h-5 mb-1" />
          Reviews
        </button>
        <button 
          onClick={handleQuickAction('/admin/users')}
          className="flex flex-col items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          Users
        </button>
        <button 
          onClick={handleRefresh}
          className="flex flex-col items-center text-xs text-slate-400 hover:text-blue-400 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mb-1" />
          Refresh
        </button>
      </div>
    </div>
  );
}