'use client';

import { BarChart3, BookOpen, MessageSquare, Users } from 'lucide-react';
import StatsCard from './components/StatsCard';
import ActivityTimeline from './components/ActivityTimeline';

export default function AdminDashboard() {
  const statsData = [
    { title: 'Total Books', value: '6,875', icon: <BookOpen className="w-5 h-5" />, color: 'text-violet-500' },
    { title: 'Books Read Today', value: '576', icon: <BarChart3 className="w-5 h-5" />, color: 'text-emerald-500' },
    { title: 'Pending Reviews', value: '20', icon: <MessageSquare className="w-5 h-5" />, color: 'text-amber-500' },
    { title: 'New Users', value: '250', icon: <Users className="w-5 h-5" />, color: 'text-blue-500' },
  ];

  const recentActivities = [
    { id: 1, text: "User 'John' added review for 'The Silent Patient'", time: '2 minutes ago', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 2, text: "Admin approved 5 book requests", time: '15 minutes ago', icon: <BookOpen className="w-4 h-4" /> },
    { id: 3, text: "New genre 'Science Fiction' added", time: '1 hour ago', icon: <BookOpen className="w-4 h-4" /> },
  ];

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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Total Books Report</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48 rounded-full border-8 border-violet-500 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-8 border-emerald-500 border-t-transparent border-r-transparent" style={{ transform: 'rotate(45deg)' }}></div>
              <div className="absolute w-full h-full rounded-full border-8 border-amber-500 border-t-transparent border-r-transparent border-b-transparent" style={{ transform: 'rotate(90deg)' }}></div>
              <div className="absolute w-full h-full rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent border-b-transparent border-l-transparent" style={{ transform: 'rotate(135deg)' }}></div>
              <div className="text-center">
                <div className="text-2xl font-bold">6,875</div>
                <div className="text-sm text-slate-400">Total Books</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-sm">New Books: 44.4%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm">Approved: 33.3%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">Pending: 11.1%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Rejected: 11.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <div className="flex items-center justify-center h-64">
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Line Chart Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="mt-0.5 text-violet-500">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-slate-300">{activity.text}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="mt-0.5 text-amber-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-300">John reviewed 'Atomic Habits'</p>
                <p className="text-xs text-slate-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="mt-0.5 text-amber-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-300">Sarah rated 'The Silent Patient' 5 stars</p>
                <p className="text-xs text-slate-500">45 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="mt-0.5 text-amber-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-300">Mike added a comment to 'Project Hail Mary'</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
          </div>
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