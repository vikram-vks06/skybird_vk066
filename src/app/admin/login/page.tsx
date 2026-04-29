'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const res = await signIn('admin-login', { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      console.log('Admin login failed:', res.error);
      toast.error('Invalid admin credentials');
    } else {
      toast.success('Welcome, Admin!');
      router.push('/admin');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#0F1F3D' }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, #E8A020 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #2A7FD4 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <AppLogo width={180} className="h-auto" />
          </Link>
          <p className="text-white/30 text-xs uppercase tracking-widest mt-3 font-semibold">
            Admin Portal
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-8">Admin Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skybirds.in"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-brand/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-brand/50 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-sm text-navy transition-all hover:shadow-amber disabled:opacity-50"
              style={{ backgroundColor: '#E8A020' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/" className="hover:text-white/40 transition-colors">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
