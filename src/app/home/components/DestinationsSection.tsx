'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Destination {
  city: string;
  country: string;
  tagline: string;
  accent: string;
  image: string;
  alt: string;
  tag: string;
}

const fallbackDestinations: Destination[] = [
{
  city: 'Dubai',
  country: 'UAE',
  tagline: 'MICE, incentive travel, and luxury corporate retreats.',
  accent: 'text-amber-brand',
  image: "https://images.unsplash.com/photo-1603632633851-561a1b08da15",
  alt: 'Dubai skyline at dusk, deep shadows, dramatic low-angle golden light on skyscrapers, dark purple sky with city reflections in water, moody atmospheric haze',
  tag: 'Top Booked'
},
{
  city: 'Singapore',
  country: 'Asia-Pacific',
  tagline: 'Conference hubs, fintech corridors, and seamless transit.',
  accent: 'text-sky-brand',
  image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
  alt: 'Singapore Marina Bay at night, dark dramatic sky, city lights reflecting on bay water, deep shadows between towers, moody cinematic atmosphere',
  tag: 'Business Hub'
},
{
  city: 'Mumbai',
  country: 'India',
  tagline: 'Financial capital — seamless domestic corporate travel.',
  accent: 'text-amber-light',
  image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
  alt: 'Mumbai Marine Drive at night, deep dark sky, city lights creating golden streaks along the curved coastline, dense shadows, atmospheric low-light urban scene',
  tag: 'Domestic'
},
{
  city: 'London',
  country: 'United Kingdom',
  tagline: 'European business travel, conferences, and client meetings.',
  accent: 'text-white',
  image: "https://images.unsplash.com/photo-1648476871040-47da9bfc67a4",
  alt: 'London skyline at dusk, Tower Bridge silhouette against deep navy sky, dark Thames river below, moody atmospheric fog, dramatic low-key lighting',
  tag: 'International'
}];


export default function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>(fallbackDestinations);

  useEffect(() => {
    fetch('/api/destinations').then(r => r.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setDestinations(data.map((d: { city: string; country: string; tagline: string; imageUrl?: string; accentColor?: string; tag?: string }) => {
          const cityKey = (d.city || '').trim().toLowerCase();
          const fallback = fallbackDestinations.find((item) => cityKey.startsWith(item.city.toLowerCase()));

          return ({
          city: d.city,
          country: d.country,
          tagline: d.tagline,
          accent: 'text-amber-brand',
          image: (typeof d.imageUrl === 'string' && d.imageUrl.trim())
            || fallback?.image
            || '/assets/images/no_image.png',
          alt: `${d.city} photo`,
          tag: d.tag || fallback?.tag || '',
        });
      }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const cards = sectionRef.current?.querySelectorAll('.dest-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' }
          }
        );
      });
    };
    initGsap();
  }, []);

  const handleContactClick = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full py-0">
      
      {/* Header */}
      <div className="bg-white rounded-5xl shadow-card px-8 md:px-16 pt-16 pb-10 mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: '#0F1F3D' }}>
              
              Popular Routes
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-navy leading-tight">
              Where Business<br />
              <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>Takes You.</span>
            </h2>
          </div>
          <p className="text-sm text-navy/50 max-w-xs uppercase tracking-wider leading-relaxed font-semibold">
            Our most-booked corporate corridors — each with dedicated support and pre-negotiated rates.
          </p>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {destinations.map((dest, idx) =>
        <div
          key={idx}
          className="dest-card relative overflow-hidden rounded-4xl aspect-[3/4] shadow-card group cursor-pointer opacity-100"
          onClick={handleContactClick}
          role="button"
          tabIndex={0}
          aria-label={`Book ${dest.city} corporate travel`}
          onKeyDown={(e) => e.key === 'Enter' && handleContactClick()}>
          
            <AppImage
            src={dest.image}
            alt={dest.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Tag top-right */}
            <div className="absolute top-4 right-4 glass-dark px-3 py-1 rounded-full">
              <span className="text-white text-[9px] font-bold uppercase tracking-widest">{dest.tag}</span>
            </div>

            {/* Content bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="dest-title-wrap">
                <p className={`font-serif italic text-2xl mb-0.5 ${dest.accent}`}>{dest.city}</p>
                <h3 className="text-xl font-bold text-white">{dest.country}</h3>
              </div>
              <p className="dest-desc text-sm text-white/70 leading-relaxed mt-3">{dest.tagline}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}