"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Box, Compass, Feather, Shield } from "lucide-react";
import gsap from "gsap";

const STAGES = [
  {
    id: "canopy",
    num: "01",
    icon: Compass,
    title: "The Canopy & Sky Gardens",
    tagline: "Volumetric Air & Leisure",
    desc: "Perched at the highest elevations, our sky canopy decks merge private cigar lounges, water pools, and lush gardens into a tranquil rooftop sanctuary overlooking the city skyline.",
    bg: "#faf7f2", // Cream (Light)
    isDarkBg: false,
    image: "/Assets/Belmonte (Gulshan)/Gulshan-cover.jpeg",
    metric: "Elevated Sky Sanctuary",
  },
  {
    id: "core",
    num: "02",
    icon: Box,
    title: "The Residential Core",
    tagline: "Volumetric Freedom",
    desc: "Residential spaces designed around 11-foot clear height ceilings, allowing light to cascade deep into the home. Screened by double-glazed low-E facades to reject tropical heat.",
    bg: "#f0eae0", // Muted Warm (Light)
    isDarkBg: false,
    image: "/Assets/Anindya (Uttara)/uttara-cover.jpeg",
    metric: "11.0' Clear Ceilings",
  },
  {
    id: "lobby",
    num: "03",
    icon: Feather,
    title: "Double-Height Courtyards",
    tagline: "Architectural Grandeur",
    desc: "A transition zone of absolute quiet. Our double-height ground lobbies open directly onto reflecting pools and waterfront boardwalks, shielding you from metropolitan noise.",
    bg: "#211e1a", // Deep Charcoal (Dark)
    isDarkBg: true,
    image: "/Assets/Nilashri (Jalshiri)/Jalshiri-cover.jpeg",
    metric: "-42dB Acoustic Isolation",
  },
  {
    id: "foundations",
    num: "04",
    icon: Shield,
    title: "Substructure Foundations",
    tagline: "Uncompromised Integrity",
    desc: "Deep-soil concrete piling engineered to withstand seismic shifts. Integrated with underground parking, smart garages, and redundant structural vaults for lifetime safety.",
    bg: "#171513", // Matte Obsidian (Dark)
    isDarkBg: true,
    image: "/Assets/Aronno (Purbachal)/Purbachal-cover.jpeg",
    metric: "Seismic Buffer Grade",
  },
];

export default function EnclavesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Trigger GSAP Background Color Morph and Card Image Wipe Reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const activeStage = STAGES[activeIdx];

    // 1. Morph background color of the section
    gsap.to(section, {
      backgroundColor: activeStage.bg,
      duration: 0.75,
      ease: "power2.out",
    });

    // 2. Animate image reveal with vertical wipe (clipPath inset mask)
    STAGES.forEach((_, idx) => {
      const imgContainer = imageRefs.current[idx];
      if (!imgContainer) return;

      if (idx === activeIdx) {
        // Kill existing animations on this target to prevent conflicts
        gsap.killTweensOf(imgContainer);
        
        // Wipe in from bottom
        gsap.fromTo(
          imgContainer,
          { 
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.05,
            opacity: 0.7
          },
          { 
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: "power3.inOut"
          }
        );
      } else {
        // Reset inactive images instantly
        gsap.set(imgContainer, { 
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 0 
        });
      }
    });
  }, [activeIdx]);

  const activeStage = STAGES[activeIdx];
  const textClass = activeStage.isDarkBg ? "text-white" : "text-[#211E1A]";
  const mutedTextClass = activeStage.isDarkBg ? "text-white/40" : "text-cream-500";
  const borderClass = activeStage.isDarkBg ? "border-white/10" : "border-cream-300";

  return (
    <section
      ref={sectionRef}
      id="philosophy-section"
      className="py-24 relative overflow-hidden transition-colors duration-700 bg-[#faf7f2]"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header Row */}
        <div className="mb-16">
          <span className={`text-[10px] uppercase tracking-[0.3em] font-extrabold mb-3 block transition-colors duration-500 ${mutedTextClass}`}>
            Design Anatomy
          </span>
          <h2 className={`font-space-grotesk text-3xl md:text-5xl font-bold tracking-tight leading-tight transition-colors duration-500 ${textClass}`}>
            Crafting the Silent Landmark
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Interactive Tab Buttons */}
          <div className="lg:col-span-7 flex flex-col gap-1 w-full">
            {STAGES.map((stage, idx) => {
              const isActive = idx === activeIdx;
              const IconComp = stage.icon;
              const isCurrentDark = STAGES[activeIdx].isDarkBg;

              const titleColorClass = isActive
                ? textClass
                : isCurrentDark
                  ? "text-white/35 group-hover:text-white"
                  : "text-[#211E1A]/40 group-hover:text-[#211E1A]";

              const numColorClass = isActive
                ? textClass
                : isCurrentDark
                  ? "text-white/20 group-hover:text-white/60"
                  : "text-[#211E1A]/25 group-hover:text-[#211E1A]/60";

              const iconColorClass = isActive
                ? textClass
                : isCurrentDark
                  ? "text-white/20 group-hover:text-white/60"
                  : "text-[#211E1A]/25 group-hover:text-[#211E1A]/60";

              const arrowColorClass = isActive
                ? textClass
                : isCurrentDark
                  ? "text-white/20 group-hover:text-white"
                  : "text-[#211E1A]/20 group-hover:text-[#211E1A]";

              return (
                <div
                  key={stage.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`w-full border-b py-6 relative cursor-pointer group transition-colors duration-500 ${borderClass}`}
                >
                  <div className="flex items-start gap-6 px-4 relative z-10">
                    {/* Number */}
                    <span className={`font-space-grotesk text-xs font-extrabold tracking-widest transition-colors duration-500 ${numColorClass}`}>
                      {stage.num}
                    </span>

                    {/* Icon */}
                    <div className={`mt-0.5 transition-colors duration-500 ${iconColorClass}`}>
                      <IconComp size={18} />
                    </div>

                    {/* Title & Desc */}
                    <div className="flex-grow">
                      <h3 className={`font-space-grotesk text-lg sm:text-xl font-bold mb-2 tracking-tight transition-colors duration-500 ${titleColorClass}`}>
                        {stage.title}
                      </h3>
                      
                      <div className={`transition-all duration-500 overflow-hidden ${
                        isActive 
                          ? "max-h-40 opacity-100 mt-2" 
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}>
                        <p className={`text-xs font-light leading-relaxed max-w-xl transition-colors duration-500 ${mutedTextClass}`}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="flex-shrink-0 self-center">
                      <ArrowRight
                        size={15}
                        className={`transition-all duration-300 group-hover:translate-x-1 ${arrowColorClass}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Architectural Wipe Reveal Image Container */}
          <div className="lg:col-span-5 relative w-full h-[400px] max-w-[340px] mx-auto rounded-sm overflow-hidden bg-cream-200 border shadow-2xl border-cream-300">
            {STAGES.map((stage, idx) => (
              <div
                key={stage.id}
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ 
                  clipPath: idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  zIndex: idx === activeIdx ? 10 : 1
                }}
              >
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover"
                />

                {/* Subtitle / Overlay metrics panel */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#211E1A]/85 border border-white/10 rounded-sm text-white backdrop-blur-md">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-white/50 font-extrabold mb-1 block">
                    {stage.tagline}
                  </span>
                  <h4 className="font-serif text-sm font-bold leading-tight">
                    {stage.title}
                  </h4>
                  <div className="border-t border-white/10 pt-2.5 mt-2.5 flex justify-between items-center">
                    <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold font-space-grotesk">
                      Anatomy Metric
                    </span>
                    <span className="text-[10px] text-white/80 font-bold font-space-grotesk">
                      {stage.metric}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
