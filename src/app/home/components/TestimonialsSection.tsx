'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface TeamMember {
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  accentColor: string;
}

interface TeamApiMember {
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  accentColor?: string;
}

export default function OurTeamSection() {
  const [isFading, setIsFading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(
            data.map((t: TeamApiMember) => ({
              name: t.name,
              designation: t.designation,
              bio: t.bio,
              imageUrl: t.imageUrl,
              accentColor: t.accentColor || '#2A7FD4',
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Auto-loop activeIndex using setTimeout for robust reset
  useEffect(() => {
    if (team.length <= 1) {
      return;
    }
    if (autoLoopRef.current) clearTimeout(autoLoopRef.current);
    autoLoopRef.current = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % team.length);
        setIsFading(false);
      }, 400); // fade duration
    }, 3500);
    return () => {
      if (autoLoopRef.current) clearTimeout(autoLoopRef.current);
    };
  }, [team, activeIndex]);

  // Reset timer and change index on manual click
  const handleSetActiveIndex = (index: number) => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsFading(false);
    }, 400);
  };

  useEffect(() => {
    // Only run GSAP when team data is loaded and DOM is ready
    if (!sectionRef.current || team.length === 0) return;
    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const heading = sectionRef.current.querySelector('.team-heading');
      if (heading) {
        gsap.fromTo(
          heading,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
          }
        );
      }

      const subtext = sectionRef.current.querySelector('.team-subtext');
      if (subtext) {
        gsap.fromTo(
          subtext,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
          }
        );
      }

      const cards = sectionRef.current.querySelectorAll('.team-stage-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
          }
        );
      }

      const selectors = sectionRef.current.querySelectorAll('.team-selector');
      if (selectors.length > 0) {
        gsap.fromTo(
          selectors,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
          }
        );
      }
    };
    initGsap();
  }, [team]);

  const normalizedActiveIndex = team.length === 0 ? 0 : activeIndex % team.length;
  const activeMember = team[normalizedActiveIndex];

  const stageMembers = useMemo(() => {
    if (team.length === 0) return [];
    if (team.length === 1) return [team[0]];
    if (team.length === 2) {
      return [team[(normalizedActiveIndex + 1) % team.length], team[normalizedActiveIndex]];
    }

    const previous = team[(normalizedActiveIndex - 1 + team.length) % team.length];
    const current = team[normalizedActiveIndex];
    const next = team[(normalizedActiveIndex + 1) % team.length];
    return [previous, current, next];
  }, [team, normalizedActiveIndex]);

  return (
    <section
      id="our-team"
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full rounded-5xl overflow-hidden shadow-card"
      style={{ backgroundColor: '#0F1F3D' }}
    >
      <div className="px-8 md:px-16 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
            >
              The Minds Behind Your Seamless Journey
            </span>
            <h2 className="team-heading text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Meet the People
              <br />
              <span className="font-serif italic font-light" style={{ color: '#E8A020' }}>
                Behind Sky Birds
              </span>
            </h2>
          </div>
          <p
            className="team-subtext text-sm max-w-xs uppercase tracking-wider leading-relaxed font-semibold"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            We handle complex visas and logistics so your journeys feel simple, precise, and fully
            under control.
          </p>
        </div>

        {team.length > 0 && activeMember ? (
          <>
            <div className={`grid gap-5 lg:grid-cols-[0.9fr_1.2fr_0.9fr] items-stretch mb-8 transition-all duration-500 ${isFading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}> 
              {stageMembers.map((member, index) => {
                const isCenter =
                  team.length === 1 ||
                  (team.length > 2 ? index === 1 : index === stageMembers.length - 1);
                const memberIndex = team.findIndex((item) => item.name === member.name);

                return (
                  <button
                    key={`${member.name}-${index}`}
                    type="button"
                    className={`team-stage-card text-left rounded-[32px] p-5 md:p-6 transition-all duration-300 ${
                      isCenter ? 'lg:scale-100' : 'lg:scale-[0.96]'
                    }`}
                    style={{
                      backgroundColor: isCenter
                        ? 'rgba(255,255,255,0.09)'
                        : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isCenter ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isCenter ? '0 20px 60px rgba(0,0,0,0.2)' : 'none',
                    }}
                    onClick={() => handleSetActiveIndex(memberIndex)}
                  >
                    <div
                      className={`${isCenter ? 'aspect-[4/5] mb-6' : 'aspect-[5/4] mb-5'} rounded-[24px] overflow-hidden`}
                    >
                      <AppImage
                        src={member.imageUrl}
                        alt={member.name}
                        width={520}
                        height={640}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p
                          className={`${isCenter ? 'text-2xl md:text-[28px]' : 'text-lg'} font-bold text-white`}
                        >
                          {member.name}
                        </p>
                        <p
                          className={`${isCenter ? 'text-sm' : 'text-xs'} font-semibold uppercase tracking-[0.18em]`}
                          style={{ color: member.accentColor }}
                        >
                          {member.designation}
                        </p>
                      </div>

                      <p
                        className={`${isCenter ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed line-clamp-4'}`}
                        style={{ color: 'rgba(255,255,255,0.72)' }}
                      >
                        {member.bio}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {team.map((member, index) => {
                const isActive = index === normalizedActiveIndex;
                return (
                  <button
                    key={member.name}
                    type="button"
                    className="team-selector text-left rounded-2xl p-4 transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                    onClick={() => handleSetActiveIndex(index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p
                          className="text-[11px] font-medium"
                          style={{
                            color: isActive ? member.accentColor : 'rgba(255,255,255,0.45)',
                          }}
                        >
                          {member.designation}
                        </p>
                      </div>
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: isActive ? member.accentColor : 'rgba(255,255,255,0.18)',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className="rounded-4xl p-10 text-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Team profiles will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
