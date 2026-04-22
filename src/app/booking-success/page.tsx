'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-md w-full text-center">
        <div className="bg-white rounded-4xl p-10 shadow-card">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}
          >
            <span className="text-5xl">🎉</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-navy mb-3">Booking Confirmed!</h1>
          <p className="text-navy/50 text-sm leading-relaxed mb-6">
            Your payment was successful and your trip is being processed. Our team will reach out within 24 hours with your detailed itinerary.
          </p>

          {bookingId && (
            <div className="bg-bg rounded-2xl p-4 mb-6">
              <p className="text-xs text-navy/40 uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-lg font-bold text-navy tracking-wider">{bookingId.slice(-8).toUpperCase()}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/bookings" className="px-6 py-3 rounded-full text-white font-bold text-sm transition-all hover:shadow-card-lg" style={{ backgroundColor: '#0F1F3D' }}>
              View My Bookings
            </Link>
            <Link href="/profile" className="px-6 py-3 rounded-full text-navy font-bold text-sm border border-navy/10 hover:bg-navy hover:text-white transition-all">
              Go to Profile
            </Link>
          </div>
        </div>

        <p className="text-xs text-navy/25 mt-8">A confirmation email has been sent to your registered email address.</p>
      </motion.div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-navy/50">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
