'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Contact { _id: string; fullName: string; company: string; email: string; phone: string; destination: string; message: string; isRead: boolean; createdAt: string; }

export default function AdminContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const res = await fetch('/api/contacts');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); fetchItems(); } else { toast.error('Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-navy/20" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;

  const unreadCount = items.filter(c => !c.isRead).length;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-navy">Contact Inquiries</h2>
            {unreadCount > 0 && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#dc2626' }}>{unreadCount} new</span>}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-card text-center"><p className="text-navy/40">No inquiries yet.</p></div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className={`bg-white rounded-2xl p-5 shadow-card flex items-start gap-4 ${!item.isRead ? 'border-l-4' : ''}`} style={!item.isRead ? { borderLeftColor: '#2A7FD4' } : {}}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${!item.isRead ? '' : 'opacity-50'}`} style={{ backgroundColor: '#0F1F3D' }}>
                  {item.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-navy text-sm">{item.fullName}</h3>
                    {!item.isRead && <span className="w-2 h-2 rounded-full bg-sky-brand" />}
                  </div>
                  <p className="text-xs text-navy/40">{item.email} · {item.phone}</p>
                  {item.destination && <p className="text-xs text-navy/40 mt-0.5">Destination: {item.destination}</p>}
                  <p className="text-sm text-navy/60 mt-2 line-clamp-2">{item.message}</p>
                  <p className="text-[11px] text-navy/25 mt-2">{format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!item.isRead && <button onClick={() => markRead(item._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100">Mark Read</button>}
                  <Link href={`/admin/contacts/${item._id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-brand/10 text-sky-brand">View</Link>
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
