'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }

    setLoading(true);
    const res = await signIn('client-login', { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      toast.error('Invalid email or password. Make sure your email is verified.');
    } else {
      toast.success('Welcome back!');
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#0F1F3D' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, #E8A020 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #2A7FD4 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-20">
          <Link href="/" className="mb-12">
            <span className="font-sans text-3xl tracking-tight text-white" style={{ fontWeight: 800 }}>
              Sky<span style={{ color: '#E8A020' }}>Birds</span>
            </span>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-white leading-tight mb-6"
          >
            Welcome<br />
            <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>Back.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base max-w-sm leading-relaxed"
          >
            Sign in to manage your bookings, track your trips, and access exclusive corporate travel deals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-8 mt-16"
          >
            {[{ stat: '500+', label: 'Clients' }, { stat: '50+', label: 'Destinations' }, { stat: '24/7', label: 'Support' }].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-bold text-white">{item.stat}</p>
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-10">
            <Link href="/">
              <span className="font-sans text-2xl tracking-tight text-navy" style={{ fontWeight: 800 }}>
                Sky<span style={{ color: '#E8A020' }}>Birds</span>
              </span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-navy mb-2">Sign In</h2>
          <p className="text-navy/50 text-sm mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold" style={{ color: '#2A7FD4' }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="form-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy transition-colors text-sm font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold" style={{ color: '#2A7FD4' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 hover:shadow-card-lg disabled:opacity-50"
              style={{ backgroundColor: '#0F1F3D' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-navy/30 mt-8">
            Admin?{' '}
            <Link href="/admin/login" className="font-semibold text-navy/50 hover:text-navy transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
