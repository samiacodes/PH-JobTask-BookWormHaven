'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, BookOpen, TrendingUp, Users, Clock, Search, Filter, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Sample book data matching your dark theme
const featuredBooks = [
  {
    id: 1,
    title: 'Dark Matter',
    author: 'Blake Crouch',
    rating: 4.6,
    genre: 'Sci-Fi Thriller',
    description: 'A mind-bending journey through alternate realities',
    color: 'from-purple-600 to-blue-500',
  },
  {
    id: 2,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    rating: 4.4,
    genre: 'Fiction',
    description: 'Between life and death there is a library',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 3,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    rating: 4.8,
    genre: 'Sci-Fi',
    description: 'A lone astronaut saves humanity',
    color: 'from-amber-600 to-orange-500',
  },
  {
    id: 4,
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    rating: 4.5,
    genre: 'Thriller',
    description: 'Psychological thriller that keeps you guessing',
    color: 'from-red-600 to-pink-500',
  },
];

const stats = [
  { icon: BookOpen, label: 'Books Tracked', value: '15K+' },
  { icon: Users, label: 'Active Readers', value: '8.2K' },
  { icon: Star, label: 'Avg Rating', value: '4.7' },
  { icon: Clock, label: 'Hours Read', value: '245K' },
];

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Welcome to Your Library</span>
            </div>
            {/* <Image src="/banner1.png" height={500} width={500} alt="" /> */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Your Digital <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Library</span> Awaits
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Track your reading journey, discover hidden gems, and connect with fellow book lovers in your personal sanctuary.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/browse"
                className="group bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Browse Books
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/library"
                className="px-8 py-4 rounded-full font-semibold border border-white/10 hover:border-white/20 transition-all"
              >
                Go to My Library
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${index === 0 ? 'from-purple-600/20 to-blue-500/20' : ''}${index === 1 ? 'from-blue-600/20 to-cyan-500/20' : ''}${index === 2 ? 'from-amber-600/20 to-orange-500/20' : ''}${index === 3 ? 'from-red-600/20 to-pink-500/20' : ''}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Featured <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Books</span>
              </h2>
              <p className="text-gray-400">Curated selection for you</p>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 mt-4 md:mt-0">
              {['all', 'fiction', 'sci-fi', 'thriller', 'non-fiction'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeFilter === filter ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                {/* Book Cover */}
                <div className={`h-48 rounded-xl mb-6 bg-gradient-to-br ${book.color} flex items-center justify-center`}>
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
                
                {/* Book Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-white transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-400 text-sm">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{book.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {book.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {book.genre}
                    </span>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                      Add to shelf
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-12">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/20 transition-all group"
            >
              View All Books
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simple steps to transform your reading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Discover</h3>
              <p className="text-gray-400">
                Browse our curated collection or search for specific titles, authors, or genres.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Track</h3>
              <p className="text-gray-400">
                Add books to your shelves, track progress, and set reading goals.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-gray-400">
                Share reviews, join discussions, and connect with fellow readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-600/10 to-blue-500/10 border border-white/10 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Quick <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Actions</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto text-center">
              Start your reading journey with these quick actions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                href="/library/add-book"
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-600/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Add New Book</h3>
                <p className="text-gray-400 text-sm">Add a book to your personal library</p>
              </Link>
              
              <Link
                href="/reading-challenge"
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-600/20">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Set Reading Goal</h3>
                <p className="text-gray-400 text-sm">Challenge yourself with a reading goal</p>
              </Link>
              
              <Link
                href="/community"
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-amber-600/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Join Community</h3>
                <p className="text-gray-400 text-sm">Connect with other readers</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}