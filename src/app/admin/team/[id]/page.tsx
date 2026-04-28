'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminTeamFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', designation: '', bio: '', imageUrl: '', accentColor: '#2A7FD4', isActive: true, order: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/team/${params.id}`).then(r => r.json()).then((data) => {
        if (data._id) setForm({ name: data.name || '', designation: data.designation || '', bio: data.bio || '', imageUrl: data.imageUrl || '', accentColor: data.accentColor || '#2A7FD4', isActive: data.isActive ?? true, order: data.order || 0 });
      });
    }
  }, [params.id, isNew]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isNew ? '/api/team' : `/api/team/${params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('designation', form.designation);
    payload.append('bio', form.bio);
    payload.append('accentColor', form.accentColor);
    payload.append('isActive', String(form.isActive));
    payload.append('order', String(form.order));
    payload.append('imageUrl', form.imageUrl || '');
    if (imageFile) payload.append('image', imageFile);
    const res = await fetch(url, { method, body: payload });
    if (res.ok) {
      toast.success(isNew ? 'Team member created!' : 'Team member updated!');
      router.push('/admin/team');
    } else {
      const data = await res.json();
      toast.error(data.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/team" className="text-sm text-navy/40 hover:text-navy font-semibold mb-6 inline-block">← Back to Team</Link>
        <h2 className="text-2xl font-bold text-navy mb-6">{isNew ? 'Add Team Member' : 'Edit Team Member'}</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-card space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Designation *</label>
              <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="form-input" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Accent Color</label>
              <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="form-input w-12 h-8 p-0 border-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="form-input" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {previewUrl || form.imageUrl ? (
              <img src={previewUrl || form.imageUrl} alt="Preview" className="w-24 h-24 rounded-xl mt-2 object-cover border" />
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
            <button type="submit" className="px-6 py-2 rounded-full text-white font-bold" style={{ backgroundColor: '#0F1F3D' }} disabled={loading}>{loading ? 'Saving...' : isNew ? 'Add' : 'Update'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
