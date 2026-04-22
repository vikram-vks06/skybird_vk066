'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Contact { _id: string; fullName: string; company: string; email: string; phone: string; destination: string; travelers: number; message: string; isRead: boolean; createdAt: string; }

export default function AdminContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contacts/${params.id}`).then(r => r.json()).then((data) => {
      if (data._id) {
        setContact(data);
        if (!data.isRead) {
          fetch(`/api/contacts/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
        }
      } else { router.push('/admin/contacts'); }
      setLoading(false);
    });
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/contacts/${params.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); router.push('/admin/contacts'); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-navy/20" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;
  if (!contact) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/contacts" className="text-sm text-navy/40 hover:text-navy font-semibold mb-6 inline-block">← Back to Inquiries</Link>

        <div className="bg-white rounded-3xl p-8 shadow-card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: '#0F1F3D' }}>
                {contact.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">{contact.fullName}</h2>
                <p className="text-sm text-navy/40">{contact.company}</p>
              </div>
            </div>
            <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { label: 'Email', value: contact.email },
              { label: 'Phone', value: contact.phone },
              ...(contact.destination ? [{ label: 'Destination', value: contact.destination }] : []),
              ...(contact.travelers ? [{ label: 'Travelers', value: String(contact.travelers) }] : []),
              { label: 'Submitted', value: format(new Date(contact.createdAt), 'dd MMMM yyyy, hh:mm a') },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(15,31,61,0.06)' }}>
                <span className="text-navy/50 text-sm">{row.label}</span>
                <span className="font-semibold text-navy text-sm">{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-2">Message</p>
            <div className="bg-bg rounded-2xl p-5">
              <p className="text-navy text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
