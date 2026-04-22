'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';

interface Destination { _id: string; city: string; country: string; tagline: string; imageUrl?: string; tag: string; isActive: boolean; order: number; }

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const res = await fetch('/api/destinations?all=1');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this destination?')) return;
    const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); fetchItems(); } else { toast.error('Failed'); }
  };

  const toggleActive = async (item: Destination) => {
    await fetch(`/api/destinations/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-navy/20" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy">Destinations</h2>
          <Link href="/admin/destinations/new" className="px-5 py-2.5 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#0F1F3D' }}>+ Add New</Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-card text-center"><p className="text-navy/40">No destinations yet.</p></div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <AppImage
                    src={item.imageUrl || '/assets/images/no_image.png'}
                    alt={`${item.city} photo`}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-navy text-sm">{item.city}, {item.country}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
                    {item.tag && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-navy/5 text-navy/40">{item.tag}</span>}
                  </div>
                  <p className="text-xs text-navy/40 mt-0.5">{item.tagline}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleActive(item)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-navy/10 hover:bg-bg transition-colors">{item.isActive ? 'Hide' : 'Show'}</button>
                  <Link href={`/admin/destinations/${item._id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-brand/10 text-sky-brand">Edit</Link>
                  <button onClick={() => handleDelete(item._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
