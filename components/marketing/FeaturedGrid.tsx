"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDTWord } from "@/lib/utils/formatCurrency";
import gsap from "gsap";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

// Real avatar photos from pravatar — deterministic seeds
const AVATARS = [
  { src: "https://i.pravatar.cc/48?img=47", fallback: "RA" },
  { src: "https://i.pravatar.cc/48?img=32", fallback: "SM" },
  { src: "https://i.pravatar.cc/48?img=58", fallback: "AK" },
  { src: "https://i.pravatar.cc/48?img=12", fallback: "MH" },
  { src: "https://i.pravatar.cc/48?img=25", fallback: "TN" },
];

export default function FeaturedGrid() {
  const baseCount = 4;
  // Slice to keep exactly 4 apartments
  const displayProperties = PROPERTIES.slice(0, baseCount);
  
  // Triplicate array for seamless infinite looping scroll
  const tripledProperties = [
    ...displayProperties,
    ...displayProperties,
    ...displayProperties,
  ];

  // Start activeIndex at the first element of the middle set (index 4)
  const [activeIndex, setActiveIndex] = useState(baseCount);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);

  const prev = () => {
    if (isAnimating.current) return;
    setActiveIndex((prevIndex) => prevIndex - 1);
  };

  const next = () => {
    if (isAnimating.current) return;
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  // Synchronize track sliding and morph transitions using GSAP
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 300; // Premium vertical poster width
    const gap = 20; // gap-5 is 20px
    const offset = -activeIndex * (cardWidth + gap);

    isAnimating.current = true;

    // Slide track container
    gsap.to(track, {
      x: offset,
      duration: 0.8,
      ease: "power4.out",
      onComplete: () => {
        isAnimating.current = false;
        
        // Loop Reset Logic (Completely invisible to the user)
        // If activeIndex moves into the third set (>= 8), set back to middle set (4)
        if (activeIndex >= baseCount * 2) {
          const resetIndex = activeIndex - baseCount;
          gsap.set(track, { x: -resetIndex * (cardWidth + gap) });
          setActiveIndex(resetIndex);
        }
        // If activeIndex moves into the first set (<= 3), set back to middle set (7)
        if (activeIndex < baseCount) {
          const resetIndex = activeIndex + baseCount;
          gsap.set(track, { x: -resetIndex * (cardWidth + gap) });
          setActiveIndex(resetIndex);
        }
      },
    });

    // Morph individual card styles based on proximity to activeIndex
    tripledProperties.forEach((_, idx) => {
      const card = cardRefs.current[idx];
      if (!card) return;

      if (idx === activeIndex) {
        // Active card (Fully clear)
        gsap.to(card, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: 0.8,
          ease: "power4.out",
        });
      } else if (idx === activeIndex + 1) {
        // Second card (semi-blurred)
        gsap.to(card, {
          scale: 0.96,
          opacity: 0.35,
          filter: "blur(2px)",
          pointerEvents: "none",
          duration: 0.8,
          ease: "power4.out",
        });
      } else if (idx === activeIndex + 2) {
        // Third card (blurred)
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.15,
          filter: "blur(4px)",
          pointerEvents: "none",
          duration: 0.8,
          ease: "power4.out",
        });
      } else {
        // Out of view
        gsap.to(card, {
          scale: 0.88,
          opacity: 0,
          filter: "blur(8px)",
          pointerEvents: "none",
          duration: 0.8,
          ease: "power4.out",
        });
      }
    });
  }, [activeIndex, baseCount]);

  // Calculate user-facing slide number (1 to 4)
  const currentSlideNumber = (activeIndex % baseCount) + 1;

  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-extrabold mb-3 block">
              Flagship Collection
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground leading-tight">
              Signature Residential<br className="hidden md:block" /> Landmarks
            </h2>
          </div>

          {/* Arrow Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous property"
              className="w-9 h-9 rounded-full border border-cream-300 bg-background hover:bg-[#211E1A] hover:border-[#211E1A] hover:text-white text-foreground transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={next}
              aria-label="Next property"
              className="w-9 h-9 rounded-full border border-cream-300 bg-background hover:bg-[#211E1A] hover:border-[#211E1A] hover:text-white text-foreground transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <ArrowRight size={15} />
            </button>
            <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold ml-1 tabular-nums">
              {String(currentSlideNumber).padStart(2, "0")} / {String(baseCount).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* ───── LEFT TRUST PANEL ───── */}
          <div className="w-full lg:w-[260px] h-[420px] flex-shrink-0 bg-[#211E1A] rounded-sm flex flex-col justify-between relative overflow-hidden p-6 z-10">
            {/* Grain texture */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
              }}
            />

            <div className="relative z-10">
              <span className="text-[8px] uppercase tracking-[0.35em] text-white/35 font-extrabold mb-8 block">
                Trusted Nationwide
              </span>

              {/* Real Photo Avatar Stack */}
              <AvatarGroup className="mb-6">
                {AVATARS.map((av, i) => (
                  <Avatar
                    key={i}
                    className="h-8 w-8 border-2 border-[#211E1A]"
                  >
                    <AvatarImage src={av.src} alt={av.fallback} />
                    <AvatarFallback className="text-[9px] bg-white/15 text-white">
                      {av.fallback}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>

              {/* Trust Number */}
              <div className="mb-2">
                <span className="font-space-grotesk text-[38px] font-extrabold text-white tracking-tight leading-none">
                  150k+
                </span>
              </div>
              <p className="text-white/45 text-[11px] font-light leading-relaxed max-w-[200px]">
                Families across Dhaka trust Banglow to deliver their signature home.
              </p>
            </div>

            {/* Bottom link */}
            <div className="relative z-10">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-[9px] text-white/40 hover:text-white uppercase tracking-widest font-bold transition-colors group"
              >
                Explore All Properties
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ───── RIGHT PROPERTY CAROUSEL ───── */}
          <div className="flex-1 overflow-hidden h-[420px]">
            <div
              ref={trackRef}
              className="flex gap-5 h-full"
              style={{ width: "max-content" }}
            >
              {tripledProperties.map((property, idx) => {
                return (
                  <div
                    key={`${property.id}-${idx}`}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className="w-[300px] h-full flex-shrink-0 relative rounded-sm overflow-hidden bg-cream-200"
                    style={{ transformOrigin: "center left" }}
                  >
                    <Link
                      href={`/properties/${property.slug}`}
                      className="group block h-full w-full"
                    >
                      {/* Image — fills 100% height */}
                      <img
                        src={property.heroImage}
                        alt={property.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />

                      {/* Gradient overlay at bottom for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Status badge — top left */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm border backdrop-blur-md ${
                            property.status === "ongoing"
                              ? "bg-white/15 border-white/20 text-white"
                              : "bg-white/80 border-white/30 text-foreground"
                          }`}
                        >
                          {property.status}
                        </span>
                      </div>

                      {/* Bottom overlay: property info */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <div className="flex items-center gap-1 text-white/60 text-[9px] mb-1.5">
                          <MapPin size={9} />
                          <span>{property.area}, Dhaka</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white leading-tight mb-1">
                          {property.name}
                        </h3>
                        <p className="text-white/60 text-[10px] font-light line-clamp-2 leading-relaxed mb-4">
                          {property.tagline}
                        </p>
                        {/* Price tag inline with "View" link */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                            From {formatBDTWord(property.pricing.totalPriceMin)}
                          </span>
                          <span className="text-[8px] font-extrabold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
