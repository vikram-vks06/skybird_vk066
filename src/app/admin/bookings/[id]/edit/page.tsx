"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const bookingTypes = [
  { label: "Ticket", value: "ticket" },
  { label: "Hotel", value: "hotel" },
  { label: "Other", value: "other" },
];

export default function EditBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    members: 1,
    destination: "",
    description: "",
    bookingTypes: [],
    uploads: {},
    bookingAmount: "",
    typeDescriptions: {},
    attachments: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name: data.clientId?.name || "",
          email: data.clientId?.email || "",
          phone: data.clientId?.phone || "",
          members: data.travelers || 1,
          destination: data.destination || "",
          description: data.notes || "",
          bookingTypes: data.services || [],
          bookingAmount: data.totalAmount || "",
          typeDescriptions: data.typeDescriptions || {},
          attachments: data.attachments || [],
        }));
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const arr = prev.bookingTypes.includes(value)
          ? prev.bookingTypes.filter((v) => v !== value)
          : [...prev.bookingTypes, value];
        return { ...prev, bookingTypes: arr };
      });
    } else if (type === "file") {
      setForm((prev) => ({
        ...prev,
        uploads: { ...prev.uploads, [name]: e.target.files[0] },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeDescription = (type, value) => {
    setForm((prev) => ({
      ...prev,
      typeDescriptions: { ...prev.typeDescriptions, [type]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      // TODO: handle file uploads and update attachments
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: form.destination,
          description: form.description,
          bookingTypes: form.bookingTypes,
          bookingAmount: form.bookingAmount,
          typeDescriptions: form.typeDescriptions,
          // attachments: ...
        }),
      });
      if (res.ok) {
        toast.success("Booking updated!");
        router.push("/admin/bookings");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update booking");
      }
    } catch (err) {
      toast.error("Failed to update booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-navy/40">Loading booking...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-4xl shadow-card-lg p-0 mt-12 mb-16 overflow-hidden border border-navy/10">
      <div className="bg-gradient-to-r from-sky-brand/10 to-amber-brand/10 px-8 py-7 border-b border-navy/10">
        <h2 className="text-3xl font-bold text-navy tracking-tight mb-1">Edit Booking</h2>
        <p className="text-navy/50 text-base">Update the details for this booking.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Name</label>
            <input name="name" value={form.name} disabled className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base" />
          </div>
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Email</label>
            <input name="email" type="email" value={form.email} disabled className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base" />
          </div>
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Primary Phone</label>
            <input name="phone" value={form.phone} disabled className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base" />
          </div>
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Members</label>
            <input name="members" type="number" min="1" value={form.members} disabled className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Destination</label>
            <input name="destination" value={form.destination} onChange={handleChange} required className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base focus:ring-2 focus:ring-sky-brand outline-none transition" placeholder="Destination" />
          </div>
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Description <span className="text-navy/30">(optional)</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base focus:ring-2 focus:ring-sky-brand outline-none transition min-h-[48px]" placeholder="Booking notes or requirements" />
          </div>
        </div>
        <div>
          <label className="block text-[15px] font-semibold mb-2 text-navy">Booking For</label>
          <div className="flex gap-6 flex-wrap">
            {bookingTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-base font-medium text-navy/80 cursor-pointer">
                <input
                  type="checkbox"
                  name="bookingTypes"
                  value={type.value}
                  checked={form.bookingTypes.includes(type.value)}
                  onChange={handleChange}
                  className="accent-sky-brand w-5 h-5 rounded border border-navy/20"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
        {form.bookingTypes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.bookingTypes.map((type) => (
              <div key={type} className="rounded-2xl border border-sky-brand/20 bg-sky-brand/5 p-5 mt-2">
                <label className="block text-xs font-semibold mb-1 text-navy">Upload Document for {type.charAt(0).toUpperCase() + type.slice(1)}</label>
                <input type="file" name={type} onChange={handleChange} className="w-full rounded-lg border border-navy/10 bg-white px-3 py-2 text-navy text-sm focus:ring-2 focus:ring-sky-brand outline-none transition" />
                <label className="block text-xs font-semibold mt-2 mb-1 text-navy">Description <span className="text-navy/30">(optional)</span></label>
                <input
                  type="text"
                  value={form.typeDescriptions[type] || ""}
                  onChange={(e) => handleTypeDescription(type, e.target.value)}
                  className="w-full rounded-lg border border-navy/10 bg-white px-3 py-2 text-navy text-sm focus:ring-2 focus:ring-sky-brand outline-none transition"
                  placeholder={`Details for ${type}`}
                />
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-navy">Booking Amount</label>
            <input name="bookingAmount" type="number" min="0" value={form.bookingAmount} onChange={handleChange} required className="w-full rounded-xl border border-navy/10 bg-bg px-4 py-3 text-navy text-base focus:ring-2 focus:ring-sky-brand outline-none transition" placeholder="Amount (INR)" />
          </div>
        </div>
        {/* Existing attachments */}
        {form.attachments && form.attachments.length > 0 && (
          <div className="mt-6">
            <label className="block text-[15px] font-semibold mb-2 text-navy">Existing Attachments</label>
            <ul className="space-y-2">
              {form.attachments.map((att, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-navy/70">{att.type}</span>
                  <a href={att.url} target="_blank" rel="noopener" className="text-sky-brand underline">View Attachment</a>
                  {att.description && <span className="text-navy/40">{att.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-6 flex justify-end">
          <button type="submit" className="px-8 py-3 rounded-full bg-sky-brand text-white font-bold text-lg shadow-amber hover:bg-sky-brand/90 transition-all min-w-[180px]" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
