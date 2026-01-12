/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // User profile images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', 
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', 
      },
      
      // Book cover images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      
      // Own CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;