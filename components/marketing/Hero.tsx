"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: "power4.out" }
      );
      gsap.fromTo(
        searchWidgetRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: "power4.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let query = "/properties?";
    if (area) query += `area=${area}&`;
    if (status) query += `status=${status}`;
    router.push(query);
  };

  const areas = ["Gulshan", "Dhanmondi", "Uttara", "Purbachal", "Jalshiri", "Bashundhara"];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden bg-background"
    >
      {/* Background Image with warm cream overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 scale-102"
        style={{
          backgroundImage: `url('/Assets/Hero-bg.jpeg')`,
        }}
      />
      {/* Soft warm gradients for masking */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-primary font-bold mb-4 md:mb-6">
          Banglow Real Estate
        </span>
        
        <h1
          ref={titleRef}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6 max-w-4xl leading-[1.15]"
        >
          Signature Landmarks of <span className="text-primary italic font-normal">Silent Luxury</span>
        </h1>
        
        <p
          ref={subtitleRef}
          className="text-cream-500 text-base md:text-lg font-light tracking-wide max-w-2xl mb-12 leading-relaxed"
        >
          An architect-first builder crafting high-design residential sanctuaries across Dhaka’s premium enclaves.
        </p>

        {/* Search Widget - Stationery beige design */}
        <div
          ref={searchWidgetRef}
          className="w-full max-w-4xl p-2 rounded-sm border border-cream-300 bg-cream-200 shadow-xl relative overflow-hidden"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
            {/* Area Filter */}
            <div className="w-full md:w-5/12 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-cream-300">
              <MapPin className="text-primary flex-shrink-0" size={18} />
              <div className="w-full text-left">
                <label className="block text-[10px] uppercase tracking-widest text-cream-500 font-semibold mb-0.5">
                  Select Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="bg-transparent text-foreground font-semibold text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8 border-none p-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%23b5623a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="" className="bg-cream-100 text-cream-500">All Locations</option>
                  {areas.map((a) => (
                    <option key={a} value={a} className="bg-cream-100 text-foreground">{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-4/12 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-cream-300">
              <Building className="text-primary flex-shrink-0" size={18} />
              <div className="w-full text-left">
                <label className="block text-[10px] uppercase tracking-widest text-cream-500 font-semibold mb-0.5">
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent text-foreground font-semibold text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8 border-none p-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%23b5623a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="" className="bg-cream-100 text-cream-500">All Statuses</option>
                  <option value="ongoing" className="bg-cream-100 text-foreground">Ongoing Development</option>
                  <option value="upcoming" className="bg-cream-100 text-foreground">Upcoming Release</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-3/12 px-2 py-1 flex items-center justify-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-primary text-cream-100 font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
              >
                Find Residencies
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
