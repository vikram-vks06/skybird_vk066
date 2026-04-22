'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Client { _id: string; name: string; email: string; phone: string; company: string; isVerified: boolean; createdAt: string; }

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/clients').then(r => r.json()).then((data) => {
      setClients(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-navy/20" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy">Registered Clients</h2>
          <span className="text-sm text-navy/40 font-semibold">{clients.length} total</span>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-card text-center"><p className="text-navy/40">No registered clients yet.</p></div>
        ) : (
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(15,31,61,0.06)' }}>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Name</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Email</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Phone</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Company</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-bg/50 transition-colors" style={{ borderColor: 'rgba(15,31,61,0.04)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0F1F3D' }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-navy text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-navy/60">{c.email}</td>
                      <td className="px-5 py-4 text-sm text-navy/60">{c.phone || '—'}</td>
                      <td className="px-5 py-4 text-sm text-navy/60">{c.company || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {c.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-navy/40">{format(new Date(c.createdAt), 'dd MMM yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
