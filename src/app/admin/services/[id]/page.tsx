'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ icon: '', title: '', description: '', tag: '', colSpan: 1, isActive: true, order: 0 });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/services/${params.id}`).then(r => r.json()).then((data) => {
        if (data._id) setForm({ icon: data.icon || '', title: data.title || '', description: data.description || '', tag: data.tag || '', colSpan: data.colSpan || 1, isActive: data.isActive ?? true, order: data.order || 0 });
      });
    }
  }, [params.id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isNew ? '/api/services' : `/api/services/${params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { toast.success(isNew ? 'Created!' : 'Updated!'); router.push('/admin/services'); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/services" className="text-sm text-navy/40 hover:text-navy font-semibold mb-6 inline-block">← Back to Services</Link>
        <h2 className="text-2xl font-bold text-navy mb-6">{isNew ? 'Add Service' : 'Edit Service'}</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-card space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Icon (SVG or Emoji) *</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="form-input" placeholder='e.g. ✈️ or <svg>...' required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input min-h-[80px] resize-none" required />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Tag</label>
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="form-input" placeholder="e.g. Core Service" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Column Span</label>
              <select value={form.colSpan} onChange={(e) => setForm({ ...form, colSpan: parseInt(e.target.value) })} className="form-input">
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns (Wide)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="form-input" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-navy/20" />
            <span className="text-sm font-semibold text-navy">Active</span>
          </label>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-full text-white font-bold text-sm disabled:opacity-50" style={{ backgroundColor: '#0F1F3D' }}>{loading ? 'Saving...' : isNew ? 'Create' : 'Update'}</button>
            <Link href="/admin/services" className="px-6 py-3 rounded-full text-navy/50 font-bold text-sm border border-navy/10 hover:bg-bg">Cancel</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
