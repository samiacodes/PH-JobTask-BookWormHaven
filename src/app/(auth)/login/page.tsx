"use client";
import React, { useState, useEffect } from 'react';
import { Github, Facebook, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";


  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("not found")) {
          setError("No account found with this email. Please register first.");
        } else if (result.error.includes("Incorrect password")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "github") => {
    try {
      setError("");
      await signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Social login error:", error);
      setError(`Failed to login with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[10%] right-[30%] w-72 h-72 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[5%] w-64 h-64 bg-purple-800/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        
        {/* Left Section - Welcome */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-2 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">
              Book<span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Worm</span>
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Welcome Back.
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl">
            Continue your reading journey. Track progress, discover new books, and connect with fellow readers.
          </p>
          
          <div className="inline-block border-2 border-white/30 px-8 py-3 rounded-full group cursor-pointer hover:bg-white/10 transition-all duration-300">
            <span className="text-xl italic font-light">Your library awaits</span>
          </div>
          
          <div className="w-full h-px border-t border-dashed border-gray-800 mt-4" />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-gray-400 text-sm mt-1">Glad you're back.!</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Email" 
                className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative space-y-2">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-300 text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-700 bg-transparent accent-purple-600 focus:ring-0 cursor-pointer" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Forgot password ?
              </button>
            </div>

            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[10px] italic">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Social Login Icons */}
            <div className="flex justify-center gap-6">
              <button 
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="p-2 hover:scale-110 transition-transform"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Facebook className="w-6 h-6 text-[#1877F2] fill-[#1877F2]" />
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Github className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Don't have an account ? <Link href="/register" className="text-white font-medium hover:underline">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;