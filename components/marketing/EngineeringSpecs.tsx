"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ShieldCheck, Wind, VolumeX } from "lucide-react";

const SPECS = [
  {
    id: "height",
    icon: Wind,
    title: "11ft Volumetric Height",
    label: "Spatially Unrestricted Span",
    desc: "Every residence features clear 11-foot finished ceilings. Spatially engineered to optimize vertical ventilation cycles, promote thermodynamic dispersion, and allow natural daylight cascades deep into focal points.",
    stats: "11.0' Clear Ceiling",
  },
  {
    id: "noise",
    icon: VolumeX,
    title: "Acoustic Decibel Isolation",
    label: "Multilayer Decibel Buffers",
    desc: "Integrated core assemblies absorb urban noise frequencies. Heavy structural slabs combined with double-acoustic interior partition dampening screens metropolitan decibels down to serene library levels.",
    stats: "-42 dB Acoustic Drop",
  },
  {
    id: "thermal",
    icon: ShieldCheck,
    title: "Low-E Thermal Shields",
    label: "Dual-Insulated Glazing",
    desc: "Glazing frames utilize double-pane low-emissivity glass facades. The invisible reflective metallic screens filter out infrared thermal rays while allowing complete, pristine optical transparency.",
    stats: "92% Solar Heat screen",
  },
];

export default function EngineeringSpecs() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Scroll trigger fade-in animations for cards using basic intersection observer and GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            gsap.fromTo(
              entry.target,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: index * 0.15, ease: "power2.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = (idx: number) => {
    const icon = iconRefs.current[idx];
    if (icon) {
      gsap.to(icon, {
        scale: 1.12,
        rotate: 5,
        color: "#ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (idx: number) => {
    const icon = iconRefs.current[idx];
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        color: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section className="bg-[#171513] py-24 relative overflow-visible text-white">
      {/* Curved Top Divider - Matches organic hand-drawn arch */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-visible leading-[0] transform -translate-y-[99%] pointer-events-none z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[30px] sm:h-[45px] md:h-[60px]"
          fill="#171513"
        >
          <path d="M0,120 Q600,0 1200,120 Z" />
        </svg>
      </div>

      {/* Subtle blueprints lines background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-extrabold mb-3 block">
            Technical Standards
          </span>
          <h2 className="font-space-grotesk text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Engineering the Intangible
          </h2>
          <p className="text-white/45 font-light text-xs sm:text-sm mt-4 leading-relaxed max-w-xl">
            True luxury is experienced through details that remain unseen. Our landmarks are structural vaults built for absolute serenity.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {SPECS.map((spec, idx) => {
            const IconComponent = spec.icon;

            return (
              <div
                key={spec.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-index={idx}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="group border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] p-8 rounded-sm flex flex-col justify-between transition-all duration-300 shadow-lg relative opacity-0"
              >
                {/* Top: Icon and Title */}
                <div>
                  <div
                    ref={(el) => {
                      iconRefs.current[idx] = el;
                    }}
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 mb-8 border border-white/10 transition-colors duration-300"
                  >
                    <IconComponent size={20} />
                  </div>

                  <span className="text-[8px] uppercase tracking-[0.25em] text-white/35 font-extrabold block mb-2 font-space-grotesk">
                    {spec.label}
                  </span>
                  <h3 className="font-space-grotesk text-lg font-bold mb-4 group-hover:text-white transition-colors tracking-tight">
                    {spec.title}
                  </h3>
                  <p className="text-white/45 font-light text-xs leading-relaxed max-w-[280px]">
                    {spec.desc}
                  </p>
                </div>

                {/* Bottom: Technical Metric Label */}
                <div className="border-t border-white/10 pt-5 mt-8 flex justify-between items-center">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/35 font-extrabold font-space-grotesk">
                    Structural Metric
                  </span>
                  <span className="font-space-grotesk text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                    {spec.stats}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
