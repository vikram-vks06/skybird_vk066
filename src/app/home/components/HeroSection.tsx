'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsapInstance: typeof import('gsap').gsap | null = null;

    const initGsap = async () => {
      const { gsap } = await import('gsap');
      gsapInstance = gsap;

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.9 }).
      from(titleRef.current, { y: 60, opacity: 0, duration: 1.1 }, '-=0.5').
      from(subRef.current, { y: 40, opacity: 0, duration: 1 }, '-=0.8').
      from(ctaRef.current, { y: 30, opacity: 0, duration: 0.9 }, '-=0.7').
      from(cardRef.current, { x: 60, opacity: 0, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.8');
    };

    initGsap();
  }, []);

  const handleContactClick = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServicesClick = () => {
    const el = document.querySelector('#services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto min-h-[88vh] rounded-5xl overflow-hidden group"
      style={{ minHeight: '88vh' }}
      aria-label="Sky Birds hero">
      
      {/* Background image */}
      <div className="absolute inset-0">
        <AppImage
          src="https://images.unsplash.com/photo-1634018877917-4381815e0747"
          alt="Aerial view of clouds from aircraft window, bright daylight, blue sky, white cloud formations, calm and expansive atmosphere"
          fill
          priority
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          sizes="100vw" />
        
      </div>

      {/* Gradient overlay — strong at bottom and left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/30 to-navy/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-transparent to-transparent" />

      {/* Top badge */}
      <div className="absolute top-10 left-10 z-20" ref={badgeRef}>
        <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-brand pulse-amber" />
          <span className="text-navy text-xs font-bold uppercase tracking-widest">
            Corporate Travel Partner
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16 pt-32 md:pt-36" style={{ minHeight: '88vh' }}>
        <div className="max-w-2xl">
          <h1
            ref={titleRef}
            className="hero-title text-white mb-6">
            
            Your Journey,<br />
            <span className="font-serif italic font-light" style={{ color: '#F0B830' }}>
              Crafted for You.
            </span>
          </h1>
          <p
            ref={subRef}
            className="text-white/75 text-lg md:text-xl max-w-lg leading-relaxed mb-10 font-medium">
            
            End-to-end corporate travel — flights, hotels, local transport, and sightseeing — 
            fully customized, zero hidden charges.
          </p>
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button
              onClick={handleContactClick}
              className="flex items-center gap-3 bg-amber-brand text-navy px-8 py-4 rounded-full text-sm font-bold hover:bg-amber-light transition-all duration-200 shadow-amber">
              
              Contact Us
              <span className="w-7 h-7 rounded-full bg-navy/20 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <button
              onClick={handleServicesClick}
              className="flex items-center gap-3 bg-white/15 text-white border border-white/25 px-8 py-4 rounded-full text-sm font-bold hover:bg-white/25 transition-all duration-200 backdrop-blur-sm">
              
              Our Services
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mt-12">
          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 transition-colors"
              onClick={handleServicesClick}
              role="button"
              tabIndex={0}
              aria-label="Scroll to services"
              onKeyDown={(e) => e.key === 'Enter' && handleServicesClick()}>
              
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest hidden md:block">Explore</span>
          </div>

          {/* Overlapping stats card */}
          <div
            ref={cardRef}
            className="bg-white rounded-4xl p-8 max-w-xs w-full shadow-card-lg">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-1">Trusted by</p>
                <p className="text-4xl font-bold text-navy tracking-tight">500+</p>
                <p className="text-sm font-semibold text-navy/60">Corporate Clients</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#0F1F3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-navy/30">
              <div className="flex gap-3">
                <span className="text-navy/20">(Est. 2015)</span>
                <span className="text-navy">(Since)</span>
              </div>
              <span className="text-navy/40">10+ yrs</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}