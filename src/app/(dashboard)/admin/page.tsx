'use client';

import { useState, useEffect } from 'react';
import { BarChart3, BookOpen, MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from './components/StatsCard';
import DashboardCharts from './components/DashboardCharts';
import LoadingSpinner from './components/LoadingSpinner';
import RecentActivity from './components/RecentActivity';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingReviews: 0,
    totalUsers: 0,
    booksAddedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Mock chart data - in a real app, this would come from the API
  const booksPerGenre = [
    { name: 'Fiction', value: 2500 },
    { name: 'Non-Fiction', value: 1800 },
    { name: 'Sci-Fi', value: 1200 },
    { name: 'Mystery', value: 800 },
    { name: 'Romance', value: 575 }
  ];
  
  const monthlyBooks = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 195 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 220 },
    { name: 'May', value: 180 },
    { name: 'Jun', value: 250 },
    { name: 'Jul', value: 210 },
    { name: 'Aug', value: 280 },
    { name: 'Sep', value: 240 },
    { name: 'Oct', value: 310 },
    { name: 'Nov', value: 275 },
    { name: 'Dec', value: 320 }
  ];
  
  const userGrowth = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 62 },
    { name: 'Mar', value: 58 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 92 },
    { name: 'Jun', value: 108 },
    { name: 'Jul', value: 135 },
    { name: 'Aug', value: 152 },
    { name: 'Sep', value: 178 },
    { name: 'Oct', value: 205 },
    { name: 'Nov', value: 230 },
    { name: 'Dec', value: 265 }
  ];
  
  const statsData = [
    { title: 'Total Books', value: loading ? 'Loading...' : stats.totalBooks.toLocaleString(), icon: <BookOpen className="w-5 h-5" />, color: 'text-violet-500' },
    { title: 'Books Read Today', value: loading ? 'Loading...' : stats.booksAddedToday.toLocaleString(), icon: <BarChart3 className="w-5 h-5" />, color: 'text-emerald-500' },
    { title: 'Pending Reviews', value: loading ? 'Loading...' : stats.pendingReviews.toLocaleString(), icon: <MessageSquare className="w-5 h-5" />, color: 'text-amber-500' },
    { title: 'Total Users', value: loading ? 'Loading...' : stats.totalUsers.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'text-blue-500' },
  ];

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* TOP: Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Welcome Back, Admin</h1>
          <p className="text-slate-400 mt-1">Here's what's happening today</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors">
              Quick Stats
            </button>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: Stats Cards (4 in a row) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            color={stat.color}
          />
        ))}
      </section>

      {/* SECTION 2: Charts & Reports */}
      <DashboardCharts 
        booksPerGenre={booksPerGenre}
        monthlyBooks={monthlyBooks}
        userGrowth={userGrowth}
      />

      {/* SECTION 3: Recent Activity - Would come from API in real implementation */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Books Added</h3>
          <RecentActivity />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <RecentActivity />
        </div>
      </section>

      {/* SECTION 4: Quick Actions */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5" />
            Add New Book
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
            View Pending Reviews
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            Manage Users
          </button>
        </div>
      </section>
    </div>
  );
}