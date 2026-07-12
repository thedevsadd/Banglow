"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDTWord } from "@/lib/utils/formatCurrency";

// 3 avatar placeholder faces using a deterministic color
const AVATARS = [
  { initials: "R", bg: "#c9b8a8" },
  { initials: "S", bg: "#b5a090" },
  { initials: "A", bg: "#a08878" },
  { initials: "M", bg: "#8a7060" },
  { initials: "T", bg: "#74605a" },
];

export default function FeaturedGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = PROPERTIES.length;

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  // We always show 3 cards: [active, next, next+1]
  const visibleIndices = [
    activeIndex % total,
    (activeIndex + 1) % total,
    (activeIndex + 2) % total,
  ];

  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-extrabold mb-3 block">
              Flagship Collection
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground leading-tight">
              Signature Residential<br className="hidden md:block" /> Landmarks
            </h2>
          </div>

          {/* Arrow Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous property"
              className="w-10 h-10 rounded-full border border-cream-300 bg-background hover:bg-[#211E1A] hover:border-[#211E1A] hover:text-white text-foreground transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next property"
              className="w-10 h-10 rounded-full border border-cream-300 bg-background hover:bg-[#211E1A] hover:border-[#211E1A] hover:text-white text-foreground transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ArrowRight size={16} />
            </button>
            <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold ml-1">
              {activeIndex + 1} / {total}
            </span>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[480px]">

          {/* ───── LEFT TRUST PANEL ───── */}
          <div className="w-full lg:w-[280px] flex-shrink-0 bg-[#211E1A] rounded-sm p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle grain texture */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
              }}
            />

            <div className="relative z-10">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-extrabold mb-8 block">
                Trusted Nationwide
              </span>

              {/* Avatar Stack */}
              <div className="flex items-center mb-6">
                {AVATARS.map((av, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#211E1A] flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      backgroundColor: av.bg,
                      marginLeft: i === 0 ? 0 : "-10px",
                      zIndex: AVATARS.length - i,
                      position: "relative",
                    }}
                  >
                    {av.initials}
                  </div>
                ))}
                <div
                  className="w-9 h-9 rounded-full border-2 border-[#211E1A] bg-white/10 flex items-center justify-center text-white/60 text-[9px] font-bold flex-shrink-0"
                  style={{ marginLeft: "-10px", position: "relative", zIndex: 0 }}
                >
                  +
                </div>
              </div>

              {/* Trust Number */}
              <div className="mb-3">
                <span className="font-poppins text-4xl font-extrabold text-white tracking-tight leading-none">
                  150k+
                </span>
              </div>
              <p className="text-white/55 text-xs font-light leading-relaxed max-w-[180px]">
                Families across Dhaka have trusted Banglow to deliver their signature home.
              </p>
            </div>

            {/* Bottom — View All link */}
            <div className="relative z-10 mt-8">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-[10px] text-white/50 hover:text-white uppercase tracking-widest font-bold transition-colors group"
              >
                Explore All Properties
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ───── RIGHT PROPERTY CAROUSEL ───── */}
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-5 h-full">
              {visibleIndices.map((propIdx, slotIdx) => {
                const property = PROPERTIES[propIdx];
                const isActive = slotIdx === 0;
                const isHidden = slotIdx === 2;

                return (
                  <div
                    key={`${propIdx}-${slotIdx}`}
                    className={`flex-shrink-0 transition-all duration-500 ease-in-out ${
                      isActive
                        ? "w-full md:w-[55%] lg:w-[48%] opacity-100"
                        : isHidden
                        ? "hidden xl:block xl:w-[26%] opacity-30 blur-[2px] pointer-events-none select-none"
                        : "hidden md:block md:w-[40%] lg:w-[35%] opacity-40 blur-[1px] pointer-events-none select-none"
                    }`}
                  >
                    <Link
                      href={isActive ? `/properties/${property.slug}` : "#"}
                      tabIndex={isActive ? 0 : -1}
                      className={`group block h-full ${!isActive ? "cursor-default" : ""}`}
                    >
                      {/* Card - 3:2 ratio image */}
                      <div className="bg-cream-200 border border-cream-300 rounded-sm overflow-hidden flex flex-col h-full">
                        
                        {/* Image - aspect-[3/2] */}
                        <div className="relative w-full aspect-[3/2] overflow-hidden">
                          <img
                            src={property.heroImage}
                            alt={property.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? "group-hover:scale-105" : ""}`}
                          />

                          {/* Status badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm border backdrop-blur-md ${
                                property.status === "ongoing"
                                  ? "bg-[#211E1A]/80 border-white/10 text-white"
                                  : "bg-white/80 border-cream-300 text-foreground"
                              }`}
                            >
                              {property.status}
                            </span>
                          </div>

                          {/* Price tag bottom-right */}
                          <div className="absolute bottom-3 right-3">
                            <span className="text-[10px] font-bold bg-background/90 border border-cream-300 text-foreground px-2.5 py-1 rounded-sm backdrop-blur-md">
                              From {formatBDTWord(property.pricing.totalPriceMin)}
                            </span>
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-cream-500 text-[10px] mb-1.5">
                              <MapPin size={10} className="text-primary" />
                              <span>{property.area}, Dhaka</span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground mb-1 leading-tight">
                              {property.name}
                            </h3>
                            <p className="text-cream-500 text-xs font-light line-clamp-2 leading-relaxed">
                              {property.tagline}
                            </p>
                          </div>
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
