'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ChangePasswordPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  if (status === 'unauthenticated') { router.push('/login'); }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/client/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to change password');
      } else {
        toast.success('Password changed!');
        router.push('/profile');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b sticky top-0 z-30" style={{ borderColor: 'rgba(15,31,61,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/profile" className="text-sm font-semibold text-navy/50 hover:text-navy transition-colors">← Back to Profile</Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-4xl p-8 md:p-10 shadow-card">
          <h2 className="text-2xl font-bold text-navy mb-8">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Current Password</label>
              <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className="form-input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">New Password</label>
              <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Min. 6 characters" className="form-input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Confirm New Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="form-input" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-card-lg disabled:opacity-50" style={{ backgroundColor: '#0F1F3D' }}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
