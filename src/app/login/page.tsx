'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess('Logged in! Redirecting...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign up failed');
      setSuccess('Sign up successful! You can now log in.');
      setTab('login');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Login/Signup card */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-fuchsia-500 via-blue-500 to-emerald-400">
        <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 mx-4">
          {/* Tabs */}
          <div className="flex mb-8">
            <button
              className={`flex-1 py-2 text-lg font-bold rounded-t-xl transition-colors ${tab === 'login' ? 'bg-white text-fuchsia-700' : 'bg-gray-100 text-gray-400'}`}
              onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-lg font-bold rounded-t-xl transition-colors ${tab === 'signup' ? 'bg-white text-fuchsia-700' : 'bg-gray-100 text-gray-400'}`}
              onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
            >
              Sign Up
            </button>
          </div>
          {/* Login Tab */}
          {tab === 'login' && (
            <form className="w-full" onSubmit={handleLogin}>
              <h1 className="text-2xl font-extrabold text-fuchsia-700 mb-2">Login</h1>
              <p className="text-gray-600 mb-6">Enter your email and password to log in.</p>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-fuchsia-500 focus:outline-none"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-fuchsia-500 focus:outline-none"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
              <button
                type="submit"
                className="w-full py-3 rounded font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors mb-4 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          )}
          {/* Signup Tab */}
          {tab === 'signup' && (
            <form className="w-full" onSubmit={handleSignUp}>
              <h1 className="text-2xl font-extrabold text-fuchsia-700 mb-2">Sign Up</h1>
              <p className="text-gray-600 mb-6">Create an account with your email and password.</p>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-fuchsia-500 focus:outline-none"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-fuchsia-500 focus:outline-none"
                  placeholder="Create password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
              <button
                type="submit"
                className="w-full py-3 rounded font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors mb-4 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Right: Vibrant cosmos image background */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1500&q=80"
          alt="Cosmos background"
          className="object-cover w-full h-full rounded-2xl shadow-2xl max-h-[90vh]"
        />
      </div>
    </div>
  );
} 