'use client';

import { Settings, User, Shield, Lock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-violet-500" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="admin@bookworm.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Admin Panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Panel
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              System Configuration
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              Backup & Restore
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              Maintenance Mode
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors">
              Log Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}