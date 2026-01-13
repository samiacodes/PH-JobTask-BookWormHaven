import Link from 'next/link';
import { BookOpen, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-1.5 rounded">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold">
              Book<span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Worm</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Help
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Star className="w-3 h-3 text-red-400" /> • © 2026 BookWorm
          </div>
        </div>
      </div>
    </footer>
  );
}