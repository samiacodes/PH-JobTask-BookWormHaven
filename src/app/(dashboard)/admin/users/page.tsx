'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Edit3, Trash2, Search, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page: number = 1, search: string = '', role: string = '') => {
    setLoading(true);
    try {
      let url = `/api/users?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (role) url += `&role=${encodeURIComponent(role)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.totalUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchUsers(1, searchTerm);
  };

  const handleFilter = (field: string, value: string) => {
    fetchUsers(1, '', value);
  };

  const handleRoleChange = async (id: string, newRole: 'admin' | 'user') => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        // Refresh the list
        fetchUsers(currentPage);
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the list
          fetchUsers(currentPage);
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'email', 
      label: 'Email',
      render: (item: User) => (
        <div className="flex items-center gap-1 text-slate-300">
          <Mail className="w-4 h-4" />
          {item.email}
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (item: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.role === 'admin' 
            ? 'bg-violet-500/20 text-violet-300' 
            : 'bg-slate-600/20 text-slate-300'
        }`}>
          {item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'User'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Join Date',
      render: (item: User) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    },
  ];

  const filters = [
    {
      field: 'role',
      label: 'Filter by Role',
      options: [
        { value: '', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-400">Loading users...</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            total={totalUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchPlaceholder="Search users by name or email..."
            filters={filters}
            actions={(item) => (
              <div className="flex items-center gap-2">
                <select
                  value={item.role}
                  onChange={(e) => handleRoleChange(item._id, e.target.value as 'admin' | 'user')}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button 
                  className="text-slate-400 hover:text-red-400 p-1"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}