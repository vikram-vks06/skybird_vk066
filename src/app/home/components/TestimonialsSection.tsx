'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  alt: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
{
  name: 'Rahul Mehta',
  role: 'VP Operations',
  company: 'Tata Consultancy Services',
  quote: '"Sky Birds cut our travel spend by 22% in the first quarter — without reducing comfort. Their itemized invoices finally gave us clarity on where the budget was going."',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7bca6b4-1763295393217.png",
  alt: 'Professional Indian man in business suit, confident corporate headshot',
  accentColor: '#E8A020'
},
{
  name: 'Priya Nair',
  role: 'Head of HR & Admin',
  company: 'Infosys BPM',
  quote: '"We manage travel for 300+ employees. Sky Birds assigned us a dedicated coordinator who handles everything from visa letters to airport pickups. Genuinely seamless."',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_196e49a93-1763300561401.png",
  alt: 'Professional Indian woman in corporate attire, confident business headshot',
  accentColor: '#2A7FD4'
},
{
  name: 'Arjun Krishnamurthy',
  role: 'Managing Director',
  company: 'Mahindra Logistics',
  quote: '"Three international conferences, six cities, forty delegates — Sky Birds handled it all without a single escalation. That reliability is priceless for us."',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1472905b6-1763296356546.png",
  alt: 'Senior Indian business executive in formal suit, authoritative corporate portrait',
  accentColor: '#E8A020'
}];


export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const cards = sectionRef.current?.querySelectorAll('.testi-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' }
          }
        );
      });
    };
    initGsap();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full rounded-5xl overflow-hidden shadow-card"
      style={{ backgroundColor: '#0F1F3D' }}>
      
      <div className="px-8 md:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              
              Client Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              What Corporate India<br />
              <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>
                Says About Us.
              </span>
            </h2>
          </div>
          <p className="text-sm max-w-xs uppercase tracking-wider leading-relaxed font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Real outcomes from real business travel managers across India.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) =>
          <div
            key={t.name}
            className="testi-card rounded-4xl p-8 space-y-6 opacity-100 transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            
              {/* Image */}
              <div className="aspect-square rounded-2xl overflow-hidden">
                <AppImage
                src={t.image}
                alt={t.alt}
                width={300}
                height={300}
                className="w-full h-full object-cover" />
              
              </div>

              {/* Quote */}
              <div>
                <svg className="mb-3 opacity-30" width="28" height="20" viewBox="0 0 28 20" fill="white" aria-hidden="true">
                  <path d="M0 20V12.5C0 5.833 3.167 1.667 9.5 0L11 2.5C8.167 3.5 6.583 5.417 6.25 8.25H11V20H0zm17 0V12.5C17 5.833 20.167 1.667 26.5 0L28 2.5C25.167 3.5 23.583 5.417 23.25 8.25H28V20H17z" />
                </svg>
                <p className="text-sm leading-relaxed font-serif italic" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.quote}
                </p>
              </div>

              {/* Author */}
              <div>
                <p className="font-bold text-white text-base">{t.name}</p>
                <p className="text-xs font-medium" style={{ color: t.accentColor }}>{t.role}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.company}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}