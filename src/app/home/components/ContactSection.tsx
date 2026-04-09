'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    destination: '',
    travelers: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        infoRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%' },
        }
      );
      gsap.fromTo(
        formRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        }
      );
    };
    initGsap();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend connection point — connect to CRM or email API here
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full rounded-5xl overflow-hidden shadow-card"
      style={{ backgroundColor: '#F4F1EC' }}
    >
      <div className="px-8 md:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="mb-14 space-y-4">
          <span
            className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ backgroundColor: '#0F1F3D' }}
          >
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-navy leading-tight">
            Let's Plan Your<br />
            <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>
              Next Corporate Trip.
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left — Info */}
          <div ref={infoRef} className="space-y-10 opacity-100">
            <p className="text-navy/65 text-base leading-relaxed font-medium">
              Share your travel requirements and our corporate travel desk will respond within 4 business hours with a fully itemized, no-obligation quote.
            </p>

            {/* Contact details */}
            <div className="space-y-5">
              {[
                { icon: 'PhoneIcon', label: '+91 98765 43210', sub: 'Mon–Sat, 9am–7pm IST' },
                { icon: 'EnvelopeIcon', label: 'corporate@skybirds.in', sub: 'Response within 4 hours' },
                { icon: 'MapPinIcon', label: 'Nariman Point, Mumbai — 400021', sub: 'Walk-ins welcome' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(15,31,61,0.08)' }}
                  >
                    <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} variant="outline" className="text-navy" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{item.label}</p>
                    <p className="text-xs text-navy/45 font-medium">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '500+', label: 'Corporate Clients' },
                { stat: '10 yrs', label: 'Industry Experience' },
                { stat: '50+', label: 'Visa Destinations' },
                { stat: '24/7', label: 'Travel Support' },
              ].map((badge) => (
                <div
                  key={badge.stat}
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: 'white' }}
                >
                  <p className="text-2xl font-bold text-navy tracking-tight">{badge.stat}</p>
                  <p className="text-xs font-semibold text-navy/45 uppercase tracking-wider mt-1">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div
            ref={formRef}
            className="bg-white rounded-4xl p-8 md:p-10 shadow-card-lg opacity-100"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: 'rgba(42,127,212,0.1)' }}
                >
                  <Icon name="CheckCircleIcon" size={32} variant="solid" style={{ color: '#2A7FD4' }} />
                </div>
                <h3 className="text-2xl font-bold text-navy">Request Received!</h3>
                <p className="text-navy/55 text-sm leading-relaxed max-w-xs">
                  Our corporate travel desk will reach out within 4 business hours with a customized quote.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: '#0F1F3D' }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Rahul Mehta"
                      value={formState.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="company">
                      Company Name *
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      placeholder="Acme Pvt. Ltd."
                      value={formState.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="email">
                      Work Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formState.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formState.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="destination">
                      Destination
                    </label>
                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      placeholder="Dubai, Singapore, London…"
                      value={formState.destination}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="travelers">
                      No. of Travelers
                    </label>
                    <select
                      id="travelers"
                      name="travelers"
                      value={formState.travelers}
                      onChange={handleChange}
                      className="form-input"
                      style={{ appearance: 'none' }}
                    >
                      <option value="">Select</option>
                      <option value="1-5">1–5 travelers</option>
                      <option value="6-15">6–15 travelers</option>
                      <option value="16-30">16–30 travelers</option>
                      <option value="30+">30+ travelers</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50" htmlFor="message">
                    Travel Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe your travel needs — dates, preferences, budget range, special requirements…"
                    value={formState.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: '#0F1F3D' }}
                >
                  Send Enquiry
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <p className="text-center text-[10px] text-navy/35 uppercase tracking-wider">
                  No spam. No hidden charges. Response within 4 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}