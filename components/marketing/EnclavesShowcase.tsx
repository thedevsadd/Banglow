"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import gsap from "gsap";

const ENCLAVES = [
  {
    id: "gulshan",
    num: "01",
    name: "Gulshan Enclave",
    desc: "Dhaka's premier diplomatic cluster. Home to corporate headquarters, premium lakeside boardwalks, and our flagship Belmonte residential tower.",
    image: "/Assets/Belmonte (Gulshan)/Gulshan-cover.jpeg",
    tagline: "Diplomatic Prestige",
    stats: "2 Towers | Ongoing",
  },
  {
    id: "purbachal",
    num: "02",
    name: "Purbachal Frontier",
    desc: "Dhaka's expanding green smart-city frontier. Biophilic skyscrapers like Aronno set deep in nature with sprawling sky gardens.",
    image: "/Assets/Aronno (Purbachal)/Purbachal-cover.jpeg",
    tagline: "Biophilic Smart City",
    stats: "Upcoming Landmark",
  },
  {
    id: "uttara",
    num: "03",
    name: "Uttara Sector 3",
    desc: "A quiet residential pocket with symmetric blocks, low-traffic avenues, and light-filled architecture like our Anindya landmarks.",
    image: "/Assets/Anindya (Uttara)/uttara-cover.jpeg",
    tagline: "Geometric Harmony",
    stats: "Completed & Settled",
  },
  {
    id: "jalshiri",
    num: "04",
    name: "Jalshiri Waterfront",
    desc: "Waterfront enclaves set along central cantonment lakes, offering ultra-transparent glass facades like our lakeside Nilashri tower.",
    image: "/Assets/Nilashri (Jalshiri)/Jalshiri-cover.jpeg",
    tagline: "Waterfront Solitude",
    stats: "1 Landmark | Lakeside",
  },
];

export default function EnclavesShowcase() {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Cross-fade right images based on hoveredIdx
    ENCLAVES.forEach((_, idx) => {
      const img = imageRefs.current[idx];
      if (!img) return;

      if (idx === hoveredIdx) {
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.65,
          ease: "power2.out",
        });
      } else {
        gsap.to(img, {
          opacity: 0,
          scale: 1.05,
          filter: "blur(4px)",
          duration: 0.65,
          ease: "power2.out",
        });
      }
    });
  }, [hoveredIdx]);

  return (
    <section className="bg-background py-24 relative overflow-hidden border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-extrabold mb-3 block">
            Territorial Domains
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground leading-tight">
            Curated Enclaves of <br />Dhaka
          </h2>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Neighborhood List */}
          <div className="lg:col-span-7 flex flex-col gap-1 w-full z-10">
            {ENCLAVES.map((enc, idx) => {
              const isActive = idx === hoveredIdx;

              return (
                <div
                  key={enc.id}
                  ref={(el) => {
                    containerRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="w-full border-b border-cream-300 py-6 relative cursor-pointer group transition-colors duration-300"
                >
                  {/* Sliding capsule background indicator */}
                  <div
                    className={`absolute inset-0 bg-[#211E1A] -z-10 rounded-sm origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100`}
                  />

                  <div className="flex items-start gap-6 px-4 relative z-10">
                    {/* Number */}
                    <span
                      className={`font-space-grotesk text-xs font-extrabold tracking-widest transition-colors duration-300 ${
                        isActive
                          ? "text-primary-foreground"
                          : "text-cream-500 group-hover:text-white/40"
                      }`}
                    >
                      {enc.num}
                    </span>

                    {/* Content block */}
                    <div className="flex-grow">
                      <h3
                        className={`font-serif text-xl sm:text-2xl font-bold mb-2 transition-colors duration-300 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-foreground group-hover:text-white"
                        }`}
                      >
                        {enc.name}
                      </h3>
                      <p
                        className={`text-xs font-light leading-relaxed max-w-xl transition-all duration-300 ${
                          isActive
                            ? "text-white/60 block opacity-100 translate-y-0"
                            : "text-cream-500 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto group-hover:text-white/50 group-hover:mt-1 translate-y-2 group-hover:translate-y-0"
                        }`}
                      >
                        {enc.desc}
                      </p>
                    </div>

                    {/* Arrow/Indicator */}
                    <div className="flex-shrink-0 self-center">
                      <ArrowRight
                        size={16}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-white translate-x-1"
                            : "text-cream-300 group-hover:text-white group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Architectural Image Reveal */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-cream-200 border border-cream-300 shadow-md">
            
            {/* Real Background Images */}
            {ENCLAVES.map((enc, idx) => (
              <img
                key={enc.id}
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                src={enc.image}
                alt={enc.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: idx === 0 ? 1 : 0 }}
              />
            ))}

            {/* Premium glass label */}
            <div className="absolute bottom-4 left-4 z-20 p-4 bg-[#211E1A]/85 backdrop-blur-md border border-white/10 rounded-sm text-white max-w-[200px]">
              <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-white/50 font-extrabold mb-1">
                <MapPin size={9} />
                <span>{ENCLAVES[hoveredIdx].tagline}</span>
              </div>
              <h4 className="font-serif text-sm font-bold leading-tight">
                {ENCLAVES[hoveredIdx].name}
              </h4>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block mt-2 font-bold font-space-grotesk">
                {ENCLAVES[hoveredIdx].stats}
              </span>
            </div>

            {/* Framing overlay */}
            <div className="absolute inset-0 border-[12px] border-background pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
