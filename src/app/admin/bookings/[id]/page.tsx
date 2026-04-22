'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface BookingDetail {
  _id: string; destination: string; travelDate: string; returnDate: string; travelers: number; services: string[]; totalAmount: number;
  status: string; paymentStatus: string; razorpayOrderId: string; razorpayPaymentId: string; notes: string; createdAt: string;
  clientId?: { _id: string; name: string; email: string; phone: string; company: string };
}

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`).then(r => r.json()).then((data) => {
      if (data._id) setBooking(data); else router.push('/admin/bookings');
      setLoading(false);
    });
  }, [params.id, router]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/bookings/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) { const d = await res.json(); setBooking(d); toast.success('Status updated'); } else { toast.error('Failed'); }
  };

  const statusColor = (s: string) => {
    switch (s) { case 'confirmed': case 'paid': return 'bg-green-100 text-green-700'; case 'pending': return 'bg-amber-100 text-amber-700'; case 'cancelled': case 'failed': return 'bg-red-100 text-red-700'; default: return 'bg-blue-100 text-blue-700'; }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-navy/20" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;
  if (!booking) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/bookings" className="text-sm text-navy/40 hover:text-navy font-semibold mb-6 inline-block">← Back to Bookings</Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-navy">{booking.destination}</h2>
            <p className="text-navy/40 text-sm">Ref: {booking._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor(booking.status)}`}>{booking.status}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
          </div>
        </div>

        {/* Client Info */}
        {booking.clientId && (
          <div className="bg-white rounded-3xl p-6 shadow-card mb-5">
            <h3 className="font-bold text-navy mb-3 text-sm">Client Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-navy/40">Name:</span> <span className="font-semibold text-navy ml-2">{booking.clientId.name}</span></div>
              <div><span className="text-navy/40">Email:</span> <span className="font-semibold text-navy ml-2">{booking.clientId.email}</span></div>
              {booking.clientId.phone && <div><span className="text-navy/40">Phone:</span> <span className="font-semibold text-navy ml-2">{booking.clientId.phone}</span></div>}
              {booking.clientId.company && <div><span className="text-navy/40">Company:</span> <span className="font-semibold text-navy ml-2">{booking.clientId.company}</span></div>}
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="bg-white rounded-3xl p-6 shadow-card mb-5">
          <h3 className="font-bold text-navy mb-4 text-sm">Trip Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Travel Date', value: format(new Date(booking.travelDate), 'dd MMMM yyyy') },
              { label: 'Return Date', value: format(new Date(booking.returnDate), 'dd MMMM yyyy') },
              { label: 'Travelers', value: String(booking.travelers) },
              ...(booking.services.length > 0 ? [{ label: 'Services', value: booking.services.join(', ') }] : []),
              ...(booking.notes ? [{ label: 'Notes', value: booking.notes }] : []),
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: 'rgba(15,31,61,0.06)' }}>
                <span className="text-navy/50">{r.label}</span>
                <span className="font-semibold text-navy text-right max-w-xs">{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="font-bold text-navy">Total Amount</span>
              <span className="text-2xl font-bold" style={{ color: '#2A7FD4' }}>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {(booking.razorpayOrderId || booking.razorpayPaymentId) && (
          <div className="bg-white rounded-3xl p-6 shadow-card mb-5">
            <h3 className="font-bold text-navy mb-3 text-sm">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {booking.razorpayOrderId && <div><span className="text-navy/40">Order ID:</span> <span className="font-mono ml-2 text-navy">{booking.razorpayOrderId}</span></div>}
              {booking.razorpayPaymentId && <div><span className="text-navy/40">Payment ID:</span> <span className="font-mono ml-2 text-navy">{booking.razorpayPaymentId}</span></div>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <h3 className="font-bold text-navy mb-4 text-sm">Update Status</h3>
          <div className="flex gap-2 flex-wrap">
            {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => updateStatus(s)} disabled={booking.status === s}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${booking.status === s ? 'bg-navy text-white' : 'border border-navy/10 text-navy/50 hover:bg-bg'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
