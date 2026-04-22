'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }

    setLoading(true);
    try {
      await fetch('/api/client/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      toast.success('If an account exists, a reset link has been sent.');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Link href="/" className="inline-block mb-10">
          <span className="font-sans text-2xl tracking-tight text-navy" style={{ fontWeight: 800 }}>
            Sky<span style={{ color: '#E8A020' }}>Birds</span>
          </span>
        </Link>

        {sent ? (
          <div className="bg-white rounded-4xl p-10 shadow-card text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}>
              <span className="text-4xl">📧</span>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Check Your Email</h2>
            <p className="text-navy/50 text-sm leading-relaxed mb-8">
              If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link.
            </p>
            <Link href="/login" className="text-sm font-bold" style={{ color: '#2A7FD4' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-4xl p-10 shadow-card">
            <h2 className="text-2xl font-bold text-navy mb-2">Forgot Password?</h2>
            <p className="text-navy/50 text-sm mb-8">Enter your email and we&apos;ll send you a reset link.</p>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 hover:shadow-card-lg disabled:opacity-50"
                style={{ backgroundColor: '#0F1F3D' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center mt-6">
              <Link href="/login" className="text-sm font-semibold" style={{ color: '#2A7FD4' }}>Back to Sign In</Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
