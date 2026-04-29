'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
// Simple testimonials array (replace with API if needed)
const testimonials = [
  {
    text: 'Sky Birds made our business travel seamless and cost-effective. Highly recommended!',
    name: 'Rahul Mehta',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    rating: 5
  },
  {
    text: 'Excellent service and transparent pricing. Our team loved the experience.',
    name: 'Priya Nair',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    rating: 4.5
  },
  {
    text: 'Professional, reliable, and always available. Sky Birds is our go-to travel partner.',
    name: 'Arjun Krishnamurthy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 5
  },
];

const differentiators = [
{
  icon: 'CurrencyRupeeIcon',
  title: 'Transparent Pricing',
  desc: 'Every quote is itemized. No hidden fees, no surprises at checkout. What you see is exactly what you pay.'
},
{
  icon: 'AdjustmentsHorizontalIcon',
  title: 'Fully Customized Itineraries',
  desc: "No one-size-fits-all packages. Your team's schedule, preferences, and budget — we build around you."
},
{
  icon: 'BriefcaseIcon', title: 'Corporate Account Management', desc: 'Dedicated relationship manager, consolidated invoicing, GST-compliant billing, and travel policy compliance.'
},
{
  icon: 'ShieldCheckIcon', title: 'Risk-Free Travel Planning', desc: 'Flexible cancellation, rebooking support, and travel insurance options — so disruptions don\'t derail your business.'
}];


export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance testimonial every 5 seconds
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full bg-white rounded-5xl shadow-card px-8 md:px-16 py-16 md:py-20">
      <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">

        {/* Left — Testimonial Carousel in Circle with spinning border */}
        <div className="relative opacity-100 flex flex-col items-center justify-center min-h-[520px]">
          <div className="relative flex items-center justify-center w-[420px] h-[420px] max-w-full max-h-full">
            {/* Spinning dashed ring wraps only the testimonial circle */}
            <div
              className="absolute animate-spin-slow rounded-full border-2 border-dashed pointer-events-none"
              style={{
                width: 'calc(100% + 32px)',
                height: 'calc(100% + 32px)',
                borderColor: 'rgba(232,160,32,0.35)',
                left: '-16px',
                top: '-16px',
              }}
            />
            {/* Circular testimonial */}
            <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-card-lg relative z-10 flex items-center justify-center bg-[#F8F8F8] w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-full w-full p-8 text-center"
                >
                  <p className="font-serif italic text-lg md:text-2xl mb-4 text-navy">“{testimonials[current].text}”</p>
                  <span className="font-bold text-navy text-base md:text-lg">{testimonials[current].name}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Client image - further down right, above ring */}
            <div className="absolute z-20" style={{ bottom: '-56px', right: '-56px' }}>
              <div className="flex flex-col items-center">
                <span className="block rounded-full shadow bg-white p-[8px]">
                  <img src={testimonials[current].image} alt={testimonials[current].name} className="w-36 h-36 rounded-full object-cover shadow-xl" />
                </span>
                <p className="font-serif italic text-2xl mt-2 mb-0.5" style={{ color: '#E8A020' }}>{testimonials[current].rating}★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Differentiators */}
        <div className="space-y-8 bg-white rounded-3xl p-8 md:p-10">
          <div className="space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-navy bg-white border border-navy/10 shadow-sm"
            >
              Why Sky Birds
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-navy leading-tight">
              Crafting Journeys <br />
              <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>Not Just Booking Trips.</span>
            </h2>
            <p className="text-navy/70 text-base leading-relaxed font-medium">
              We act as your in-house travel desk — proactive, accountable, and always aligned with your business goals.
            </p>
          </div>

          <div ref={listRef} className="space-y-5">
            {differentiators.map((item) =>
              <div
                key={item.title}
                className="diff-item flex gap-5 items-start p-5 rounded-2xl hover:shadow-xl transition-all duration-200 opacity-100 bg-white border border-navy/10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#E8A020]/10 to-[#2A7FD4]/10 shadow-sm">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={24} variant="outline" style={{ color: '#2A7FD4' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

}