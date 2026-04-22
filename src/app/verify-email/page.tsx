'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (token && email) {
      setStatus('verifying');
      fetch('/api/client/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setStatus('error');
            toast.error(data.error);
          } else {
            setStatus('success');
            toast.success('Email verified!');
          }
        })
        .catch(() => setStatus('error'));
    }
  }, [token, email]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <Link href="/" className="inline-block mb-10">
          <span className="font-sans text-2xl tracking-tight text-navy" style={{ fontWeight: 800 }}>
            Sky<span style={{ color: '#E8A020' }}>Birds</span>
          </span>
        </Link>

        {status === 'pending' && (
          <div className="bg-white rounded-4xl p-10 shadow-card">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}>
              <span className="text-4xl">✉️</span>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Check Your Email</h2>
            <p className="text-navy/50 text-sm leading-relaxed mb-2">
              We&apos;ve sent a verification link to
            </p>
            {email && <p className="font-bold text-navy text-sm mb-6">{decodeURIComponent(email)}</p>}
            <p className="text-navy/40 text-xs">Click the link in the email to verify your account. Check your spam folder if you don&apos;t see it.</p>
          </div>
        )}

        {status === 'verifying' && (
          <div className="bg-white rounded-4xl p-10 shadow-card">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}>
              <svg className="animate-spin h-8 w-8" style={{ color: '#2A7FD4' }} viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Verifying...</h2>
            <p className="text-navy/50 text-sm">Please wait while we verify your email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-4xl p-10 shadow-card">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}>
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Email Verified!</h2>
            <p className="text-navy/50 text-sm leading-relaxed mb-8">Your account has been verified. You can now sign in and start booking.</p>
            <Link
              href="/login"
              className="inline-block px-8 py-3.5 rounded-full text-white font-bold text-sm transition-all hover:shadow-card-lg"
              style={{ backgroundColor: '#0F1F3D' }}
            >
              Sign In Now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-4xl p-10 shadow-card">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(232,160,32,0.1)' }}>
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Verification Failed</h2>
            <p className="text-navy/50 text-sm leading-relaxed mb-8">The link may be expired or invalid. Please try registering again.</p>
            <Link
              href="/register"
              className="inline-block px-8 py-3.5 rounded-full text-white font-bold text-sm transition-all hover:shadow-card-lg"
              style={{ backgroundColor: '#0F1F3D' }}
            >
              Register Again
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-navy/50">Loading...</p></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
