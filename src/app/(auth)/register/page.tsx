'use client';

import React, { useState } from 'react';
import { Github, Facebook, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // Validation
  if (!agreeToTerms) {
    setError('Please agree to the Terms of Service and Privacy Policy');
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters long');
    setLoading(false);
    return;
  }

  if (!firstName.trim() || !lastName.trim()) {
    setError('First name and last name are required');
    setLoading(false);
    return;
  }

  try {
    // Combine first and last name
    const fullName = `${firstName} ${lastName}`.trim();
    
    const result = await axios.post('/api/auth/register', {
      name: fullName,
      email,
      password
    });
    
    // Auto-login after successful registration
    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (signInResult?.error) {
      // If auto-login fails, redirect to login page
      router.push('/login?registered=true');
    } else {
      // If auto-login succeeds, redirect to home
      router.push('/');
    }
  } catch (error: any) {
    console.log('Full error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      setError('An account with this email already exists. Please login or use a different email.');
    } else if (error.response?.status === 400) {
      setError(error.response.data?.message || 'Please check your input and try again.');
    } else if (error.code === 'ERR_NETWORK') {
      setError('Network error. Please check your connection and try again.');
    } else {
      setError('Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      await signIn(provider, {
        callbackUrl: '/'
      });
    } catch (error) {
      console.error('Social login error:', error);
      setError('Social login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-purple-700/30 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col md:flex-row-reverse items-center justify-between gap-12 z-10">
        
        {/* Right Section */}
        <div className="flex-1 space-y-8 text-right md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Join the <br /> Community .!
          </h1>
          <div className="inline-block border-2 border-white px-8 py-3 group cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
            <span className="text-2xl italic font-light">Start for free ?</span>
          </div>
          <div className="w-full h-px border-t border-dashed border-gray-800 mt-4" />
        </div>

        {/* Glassmorphic Register Card */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-500 text-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-500 text-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded border-gray-700 bg-transparent accent-blue-600 cursor-pointer"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-[10px] text-gray-400 leading-tight">
                I agree to the <span className="text-white underline cursor-pointer">Terms of Service</span> and <span className="text-white underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register Now'}
            </button>

            <div className="flex items-center gap-4 text-gray-700 py-2">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[10px] italic">or sign up with</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <div className="flex justify-center gap-6">
              <button 
                type="button" 
                className="p-2 hover:scale-110 transition-transform"
                onClick={() => handleSocialLogin('google')}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              </button>
              <button 
                type="button" 
                className="p-2 hover:scale-110 transition-transform text-[#1877F2]"
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="w-6 h-6 fill-current" />
              </button>
              <button 
                type="button" 
                className="p-2 hover:scale-110 transition-transform text-white"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-gray-400">
                Already have an account? <Link href="/login" className="text-white font-medium hover:underline">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;