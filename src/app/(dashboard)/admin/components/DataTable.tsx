'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilter?: (field: string, value: string) => void;
  searchPlaceholder?: string;
  filters?: { field: string; label: string; options: { value: string; label: string }[] }[];
  actions?: (item: any) => React.ReactNode;
}

export default function DataTable({
  columns,
  data,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilter,
  searchPlaceholder = 'Search...',
  filters = [],
  actions
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch]);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filterValues, [field]: value };
    setFilterValues(newFilters);
    
    if (onFilter) {
      onFilter(field, value);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {filters.map((filter) => (
          <div key={filter.field} className="flex items-center gap-2">
            <Filter className="text-slate-400 w-4 h-4" />
            <select
              value={filterValues[filter.field] || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(filter.field, e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border border-slate-700 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-slate-800/50 divide-y divide-slate-700">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-slate-700/50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-sm text-slate-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1 
                      ? "bg-violet-600 border border-violet-600 text-white" 
                      : "border border-slate-600 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}