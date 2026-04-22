'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDestinationFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ city: '', country: '', tagline: '', imageUrl: '', accentColor: '#4F8BD2', tag: '', isActive: true, order: 0 });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/destinations/${params.id}`).then(r => r.json()).then((data) => {
        if (data._id) setForm({ city: data.city || '', country: data.country || '', tagline: data.tagline || '', imageUrl: data.imageUrl || '', accentColor: data.accentColor || '#4F8BD2', tag: data.tag || '', isActive: data.isActive ?? true, order: data.order || 0 });
      });
    }
  }, [params.id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isNew ? '/api/destinations' : `/api/destinations/${params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { toast.success(isNew ? 'Created!' : 'Updated!'); router.push('/admin/destinations'); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/destinations" className="text-sm text-navy/40 hover:text-navy font-semibold mb-6 inline-block">← Back to Destinations</Link>
        <h2 className="text-2xl font-bold text-navy mb-6">{isNew ? 'Add Destination' : 'Edit Destination'}</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-card space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">City *</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="form-input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Country *</label>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="form-input" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Tagline *</label>
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="form-input" required />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="form-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Tag</label>
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="form-input" placeholder="e.g. Popular" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Accent Color</label>
              <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="form-input h-10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="form-input" />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-navy/20" />
                <span className="text-sm font-semibold text-navy">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-full text-white font-bold text-sm disabled:opacity-50" style={{ backgroundColor: '#0F1F3D' }}>{loading ? 'Saving...' : isNew ? 'Create' : 'Update'}</button>
            <Link href="/admin/destinations" className="px-6 py-3 rounded-full text-navy/50 font-bold text-sm border border-navy/10 hover:bg-bg">Cancel</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
