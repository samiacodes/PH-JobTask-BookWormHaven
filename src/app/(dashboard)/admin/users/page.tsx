'use client';

import { useState } from 'react';
import { Users, Mail, Calendar, Edit3, Trash2, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
  status: 'active' | 'inactive';
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', joinDate: '2023-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', joinDate: '2023-02-01', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', joinDate: '2023-02-10', status: 'inactive' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'user', joinDate: '2023-03-05', status: 'active' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', joinDate: '2023-03-12', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 w-4 h-4" />
            <select
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Join Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-700/30">
                  <td className="py-4 font-medium">{user.name}</td>
                  <td className="py-4 flex items-center gap-1 text-slate-300">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-violet-500/20 text-violet-300' 
                        : 'bg-slate-600/20 text-slate-300'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {user.joinDate}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-200 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}