'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ServiceCard {
  id: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  colSpan: string;
}

const fallbackServices: ServiceCard[] = [
  {
    id: 'ticketing',
    icon: 'TicketIcon',
    title: 'Flight Ticketing',
    desc: 'Domestic and international bookings at competitive fares. Multi-city, open-jaw, and corporate account rates available.',
    tag: 'Air Travel',
    colSpan: 'lg:col-span-1',
  },
  {
    id: 'hotels',
    icon: 'BuildingOffice2Icon',
    title: 'Hotel Booking',
    desc: 'Curated stays from business hotels to luxury resorts — pre-negotiated corporate rates across 80+ cities.',
    tag: 'Accommodation',
    colSpan: 'lg:col-span-1',
  },
  {
    id: 'transport',
    icon: 'TruckIcon',
    title: 'Local Transport',
    desc: 'Airport transfers, inter-city cabs, chauffeur services, and coach hire — coordinated seamlessly with your itinerary.',
    tag: 'Ground Mobility',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'sightseeing',
    icon: 'MapIcon',
    title: 'Sightseeing & Tours',
    desc: 'Guided excursions, cultural experiences, and leisure extensions built around your business schedule.',
    tag: 'Experiences',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'visa',
    icon: 'DocumentCheckIcon',
    title: 'Visa Assistance',
    desc: 'End-to-end visa documentation support for 50+ countries. Express processing for urgent corporate travel.',
    tag: 'Documentation',
    colSpan: 'lg:col-span-1',
  },
  {
    id: 'support',
    icon: 'PhoneArrowUpRightIcon',
    title: '24/7 Support',
    desc: 'Dedicated travel desk reachable around the clock. Real humans, not bots — because corporate travel never sleeps.',
    tag: 'Always On',
    colSpan: 'lg:col-span-1',
  },
];

const colSpanMap: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2' };

/* Number label for each card */
const serviceNumbers = ['01', '02', '03', '04', '05', '06'];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<ServiceCard[]>(fallbackServices);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setServices(data.map((s: { _id: string; icon: string; title: string; description: string; tag: string; colSpan?: number }) => ({
          id: s._id, icon: s.icon || 'CogIcon', title: s.title, desc: s.description, tag: s.tag || '',
          colSpan: colSpanMap[s.colSpan || 1] || 'lg:col-span-1',
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      /* ── Header elements ── */
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-badge'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-heading'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-subtext'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      /* ── Animated line ── */
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-line'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1, delay: 0.3, ease: 'power3.inOut', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      /* ── Cards stagger from different directions ── */
      const cards = sectionRef.current.querySelectorAll('.svc-card');
      cards.forEach((card, i) => {
        const isEven = i % 2 === 0;
        gsap.fromTo(
          card,
          { y: isEven ? 60 : 40, x: isEven ? -20 : 20, opacity: 0, scale: 0.95 },
          {
            y: 0, x: 0, opacity: 1, scale: 1,
            duration: 0.9, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });

      /* ── Floating counter badge ── */
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-counter'),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.8, ease: 'back.out(1.7)', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );

      /* ── Bottom CTA ── */
      gsap.fromTo(
        sectionRef.current.querySelector('.svc-cta'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current.querySelector('.svc-cta'), start: 'top 92%' } }
      );
    };
    initGsap();
  }, [services]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full rounded-5xl overflow-hidden shadow-card"
      style={{ backgroundColor: '#0F1F3D' }}
    >
      <div className="px-8 md:px-16 py-16 md:py-24 relative">

        {/* ═══ Background decorations ═══ */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(42,127,212,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 70%)' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* ═══ Header ═══ */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div className="space-y-5">
            <span className="svc-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0"
              style={{ backgroundColor: 'rgba(232,160,32,0.15)', color: '#E8A020' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-amber" style={{ backgroundColor: '#E8A020' }} />
              What We Do
            </span>
            <h2 className="svc-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] opacity-0">
              End-to-End Travel,<br />
              <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>
                One Partner.
              </span>
            </h2>
          </div>
          <div className="flex items-end gap-6">
            <p className="svc-subtext text-sm max-w-xs leading-relaxed font-medium opacity-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
              From first flight to final transfer — every detail handled, nothing outsourced. Six pillars of corporate travel, one seamless experience.
            </p>
            {/* Counter badge */}
            <div className="svc-counter hidden md:flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0 opacity-0"
              style={{ backgroundColor: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.2)' }}>
              <span className="text-2xl font-bold" style={{ color: '#E8A020' }}>{services.length}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: 'rgba(232,160,32,0.6)' }}>Services</span>
            </div>
          </div>
        </div>

        {/* ═══ Animated line separator ═══ */}
        <div className="svc-line h-px w-full mb-12 origin-left" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

        {/* ═══ Bento Grid ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {services.map((svc, i) => {
            const isActive = activeCard === svc.id;
            const num = serviceNumbers[i] || String(i + 1).padStart(2, '0');
            return (
              <div
                key={svc.id}
                className={`svc-card group relative rounded-[28px] p-7 md:p-9 cursor-default transition-all duration-500 opacity-0 ${svc.colSpan}`}
                style={{
                  backgroundColor: isActive ? 'rgba(42,127,212,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(42,127,212,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}
                onMouseEnter={() => setActiveCard(svc.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Number watermark */}
                <span className="absolute top-5 right-6 text-[64px] font-bold leading-none transition-all duration-500 select-none pointer-events-none"
                  style={{ color: isActive ? 'rgba(42,127,212,0.12)' : 'rgba(255,255,255,0.03)' }}>
                  {num}
                </span>

                {/* Icon with animated ring */}
                <div className="relative w-14 h-14 mb-7">
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.06)',
                      transform: isActive ? 'rotate(6deg) scale(1.05)' : 'rotate(0deg) scale(1)',
                    }}
                  />
                  <div className="relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-500"
                    style={{ backgroundColor: isActive ? 'rgba(232,160,32,0.2)' : 'rgba(255,255,255,0.08)' }}>
                    <Icon
                      name={svc.icon as Parameters<typeof Icon>[0]['name']}
                      size={24}
                      variant="outline"
                      className="transition-colors duration-500"
                      style={{ color: isActive ? '#E8A020' : 'rgba(255,255,255,0.7)' }}
                    />
                  </div>
                </div>

                {/* Tag */}
                <span className="inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 transition-all duration-500"
                  style={{
                    backgroundColor: isActive ? 'rgba(42,127,212,0.15)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#4A9FE4' : 'rgba(255,255,255,0.3)',
                  }}>
                  {svc.tag}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 transition-all duration-500"
                  style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)' }}>
                  {svc.title}
                </h3>

                {/* Description with reveal */}
                <p className="text-[13px] leading-relaxed font-medium transition-all duration-500"
                  style={{ color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)' }}>
                  {svc.desc}
                </p>

                {/* Bottom arrow indicator */}
                <div className="mt-6 flex items-center gap-2 transition-all duration-500"
                  style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0)' : 'translateX(-8px)' }}>
                  <div className="w-8 h-px" style={{ backgroundColor: '#E8A020' }} />
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#E8A020' }}>
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: isActive ? 1 : 0,
                    boxShadow: '0 0 80px rgba(42,127,212,0.08) inset',
                  }} />
              </div>
            );
          })}
        </div>

        {/* ═══ Bottom highlight strip ═══ */}
        <div className="svc-cta mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-3xl opacity-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-5">
            {/* Animated dots */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full animate-ping" style={{ backgroundColor: 'rgba(232,160,32,0.1)' }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(232,160,32,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-base">Need a custom travel solution?</p>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Our experts build bespoke packages for teams of any size.</p>
            </div>
          </div>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group/btn flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-amber shrink-0"
            style={{ backgroundColor: '#E8A020', color: '#0F1F3D' }}
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-1">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}