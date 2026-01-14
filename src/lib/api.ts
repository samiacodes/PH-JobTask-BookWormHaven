export async function fetchBookById(id: string) {
  const res = await fetch(`/api/books/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json();
}

export async function fetchBooks(page = 1, limit = 10, search = '', genre = '', minRating = 0, sortBy = 'createdAt') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { q: search }),
    ...(genre && { genre }),
    ...(minRating > 0 && { minRating: minRating.toString() }),
    sortBy,
  });

  const res = await fetch(`/api/books?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch('/api/genres');
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

export async function fetchReviews(bookId?: string) {
  const url = bookId ? `/api/reviews?bookId=${bookId}` : '/api/reviews';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function submitReview(reviewData: any) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to submit review');
  }
  
  return res.json();
}

export async function addToLibrary(bookId: string, status: 'want_to_read' | 'currently_reading' | 'read') {
  const res = await fetch('/api/library', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookId, status }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to add to library');
  }
  
  return res.json();
}

export async function fetchUserLibrary(userId: string) {
  const res = await fetch(`/api/users/${userId}/library`);
  if (!res.ok) throw new Error('Failed to fetch user library');
  return res.json();
}

export async function searchBooks(query: string, genre?: string, minRating?: number) {
  const params = new URLSearchParams({ q: query });
  if (genre) params.append('genre', genre);
  if (minRating !== undefined) params.append('minRating', minRating.toString());
  
  const res = await fetch(`/api/books/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search books');
  return res.json();
}