'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Star, BookOpen, User, Edit3, Trash2, Search, Filter, Check, X, Save, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  book: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface EditReviewData {
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editData, setEditData] = useState<EditReviewData>({
    text: '',
    rating: 5,
    status: 'pending'
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const fetchReviews = useCallback(async (page: number = 1, search: string = '', status: string = '') => {
    setLoading(true);
    try {
      let url = `/api/admin/reviews?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalReviews(data.pagination.totalReviews);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchReviews(1, searchTerm);
  };

  const handleFilter = (field: string, value: string) => {
    fetchReviews(1, '', value);
  };

  const handleQuickStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success(`Review ${newStatus} successfully!`);
        // Update local state immediately
        setReviews(prev => prev.map(review => 
          review._id === id ? { ...review, status: newStatus } : review
        ));
      } else {
        const error = await response.json();
        throw new Error(error.message || `Failed to update review status to ${newStatus}`);
      }
    } catch (error: any) {
      console.error('Error updating review status:', error);
      toast.error(error.message || 'Error updating review status');
    }
  };

  const handleEditClick = (review: Review) => {
    setSelectedReview(review);
    setEditData({
      text: review.text,
      rating: review.rating,
      status: review.status
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (review: Review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      
      if (response.ok) {
        toast.success('Review updated successfully!');
        setIsEditModalOpen(false);
        // Refresh the list
        fetchReviews(currentPage);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update review');
      }
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Error updating review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Review deleted successfully!');
        // Refresh the list
        fetchReviews(currentPage);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete review');
      }
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Error deleting review');
    }
  };

  // Make sure this function is only defined once - this is the main issue
  const handleBulkApprove = async () => {
    const pendingReviewIds = reviews.filter(r => r.status === 'pending').map(r => r._id);
    
    if (pendingReviewIds.length === 0) {
      toast.error('No pending reviews to approve');
      return;
    }

    if (!window.confirm(`Are you sure you want to approve ${pendingReviewIds.length} pending review(s)?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reviews/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ids: pendingReviewIds, 
          status: 'approved' 
        }),
      });
      
      if (response.ok) {
        toast.success(`${pendingReviewIds.length} review(s) approved successfully!`);
        fetchReviews(currentPage);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve reviews');
      }
    } catch (error: any) {
      console.error('Error in bulk approve:', error);
      toast.error(error.message || 'Error approving reviews');
    }
  };

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  const columns = [
    { 
      key: 'book.title', 
      label: 'Book',
      render: (item: Review) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <BookOpen className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <span className="truncate">{item.book?.title || 'Unknown Book'}</span>
        </div>
      )
    },
    { 
      key: 'user.name', 
      label: 'User',
      render: (item: Review) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate">{item.user?.name || 'Anonymous'}</span>
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (item: Review) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} 
            />
          ))}
          <span className="ml-1 text-slate-400 text-sm">({item.rating})</span>
        </div>
      )
    },
    { 
      key: 'text', 
      label: 'Comment',
      render: (item: Review) => (
        <div className="relative">
          <div 
            className={`text-slate-300 ${expandedReviews.has(item._id) ? '' : 'line-clamp-2'}`}
            onClick={() => toggleReviewExpand(item._id)}
          >
            {item.text}
          </div>
          {item.text.length > 100 && (
            <button
              onClick={() => toggleReviewExpand(item._id)}
              className="mt-1 text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
            >
              {expandedReviews.has(item._id) ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (item: Review) => (
        <div className="text-slate-400 text-sm">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: Review) => (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
          {item.status === 'pending' && (
            <div className="flex gap-1">
              <button
                onClick={() => handleQuickStatusChange(item._id, 'approved')}
                className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded"
                title="Approve"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleQuickStatusChange(item._id, 'rejected')}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                title="Reject"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )
    },
  ];

  const filters = [
    {
      field: 'status',
      label: 'Filter by Status',
      options: [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Moderate Reviews</h1>
          <p className="text-slate-400 text-sm mt-1">Approve, reject, or edit user reviews</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/40 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            Approve All Pending
          </button>
          <button
            onClick={() => fetchReviews()}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Pending Reviews</div>
          <div className="text-2xl font-bold text-amber-400">
            {reviews.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-slate-500 text-xs mt-1">Need attention</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Approved Reviews</div>
          <div className="text-2xl font-bold text-emerald-400">
            {reviews.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-slate-500 text-xs mt-1">Published</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Total Reviews</div>
          <div className="text-2xl font-bold text-slate-100">{totalReviews}</div>
          <div className="text-slate-500 text-xs mt-1">All time</div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-400">Loading reviews...</div>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={reviews}
              total={totalReviews}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              onFilter={handleFilter}
              searchPlaceholder="Search reviews by book, user, or comment..."
              filters={filters}
              actions={(item) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewClick(item)}
                    className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-700/50 rounded"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-slate-400 hover:text-violet-400 p-1 hover:bg-violet-500/10 rounded"
                    title="Edit Review"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-slate-400 hover:text-red-400 p-1 hover:bg-red-500/10 rounded"
                    onClick={() => handleDelete(item._id)}
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
            
            {reviews.length === 0 && !loading && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No reviews found</h3>
                <p className="text-slate-500">Try changing your filters or search terms</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Review"
        size="lg"
      >
        {selectedReview && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Book</label>
                <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  <span className="text-slate-200">{selectedReview.book?.title || 'Unknown Book'}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">User</label>
                <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-slate-200">{selectedReview.user?.name || 'Anonymous'}</div>
                    <div className="text-slate-400 text-sm">{selectedReview.user?.email || ''}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditData({ ...editData, rating })}
                      className={`p-2 rounded-lg transition-colors ${
                        rating <= editData.rating
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${rating <= editData.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-slate-300">{editData.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Review Text</label>
                <textarea
                  value={editData.text}
                  onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Edit review text..."
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
                <div className="flex gap-2">
                  {(['pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEditData({ ...editData, status })}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        editData.status === status
                          ? status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : status === 'rejected'
                              ? 'bg-red-500/20 text-red-400 border-red-500/50'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Review Details"
        size="md"
      >
        {selectedReview && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Book</label>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <BookOpen className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-slate-200 font-medium truncate">
                      {selectedReview.book?.title || 'Unknown Book'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">User</label>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <User className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-slate-200 font-medium truncate">
                      {selectedReview.user?.name || 'Anonymous'}
                    </div>
                    {selectedReview.user?.email && (
                      <div className="text-slate-400 text-sm truncate">{selectedReview.user.email}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < selectedReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} 
                    />
                  ))}
                  <span className="ml-2 text-slate-300 font-medium">{selectedReview.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Review Text</label>
                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <p className="text-slate-200 whitespace-pre-wrap">{selectedReview.text}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Status</label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(selectedReview.status)}`}>
                    {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Submitted</label>
                  <div className="text-slate-200">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditClick(selectedReview);
                }}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Review
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}