// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
      
      {/* Simple auth footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-sm">
            © 2024 BookWorm. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
            <a href="/privacy" className="hover:text-gray-400">Privacy</a>
            <a href="/terms" className="hover:text-gray-400">Terms</a>
            <a href="/contact" className="hover:text-gray-400">Contact</a>
            <a href="/help" className="hover:text-gray-400">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}