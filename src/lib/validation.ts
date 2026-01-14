// Simple validation functions

// Book validation
export const validateBook = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (!data.author || data.author.trim().length === 0) {
    errors.author = 'Author is required';
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!data.genre || data.genre.length === 0) {
    errors.genre = 'At least one genre is required';
  }
  
  if (data.coverImage && data.coverImage.trim() !== '' && !isValidUrl(data.coverImage)) {
    errors.coverImage = 'Must be a valid URL';
  }
  
  if (!data.pages || isNaN(data.pages) || parseInt(data.pages) <= 0) {
    errors.pages = 'Pages must be a positive number';
  }
  
  if (!data.publishedYear || parseInt(data.publishedYear) < 1000 || parseInt(data.publishedYear) > new Date().getFullYear()) {
    errors.publishedYear = 'Year must be between 1000 and current year';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to validate URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Genre validation
export const validateGenre = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Genre name is required';
  }
  
  if (data.name && data.name.trim().length > 50) {
    errors.name = 'Genre name is too long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// User validation
export const validateUser = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }
  
  if (!data.role || !['user', 'admin'].includes(data.role)) {
    errors.role = 'Role must be either user or admin';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to validate email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Review validation
export const validateReview = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.bookId || data.bookId.trim().length === 0) {
    errors.bookId = 'Book ID is required';
  }
  
  if (!data.userId || data.userId.trim().length === 0) {
    errors.userId = 'User ID is required';
  }
  
  if (!data.rating || parseInt(data.rating) < 1 || parseInt(data.rating) > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  if (!data.text || data.text.trim().length < 10) {
    errors.text = 'Review must be at least 10 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};