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
    // GSAP entrance animations
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
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden bg-dark-950"
    >
      {/* Background Image with dark overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      {/* Gradient Vignette overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold-500 font-bold mb-4 md:mb-6">
          Banglow Real Estate
        </span>
        
        <h1
          ref={titleRef}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl leading-[1.1]"
        >
          Signature Landmarks of <span className="gold-gradient-text">Silent Luxury</span>
        </h1>
        
        <p
          ref={subtitleRef}
          className="text-dark-300 text-base md:text-xl font-light tracking-wide max-w-2xl mb-12"
        >
          An architect-first builder crafting high-design residential sanctuaries across Dhaka’s premium enclaves.
        </p>

        {/* Search Widget */}
        <div
          ref={searchWidgetRef}
          className="w-full max-w-4xl p-1.5 rounded-lg border border-dark-800 glassmorphism shadow-2xl relative overflow-hidden"
        >
          {/* Subtle inside glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent pointer-events-none" />
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
            {/* Area Filter */}
            <div className="w-full md:w-5/12 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-dark-800">
              <MapPin className="text-gold-500 flex-shrink-0" size={18} />
              <div className="w-full text-left">
                <label className="block text-[10px] uppercase tracking-widest text-dark-500 font-semibold mb-0.5">
                  Select Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="bg-transparent text-white font-medium text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%23c5a880' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="" className="bg-dark-900 text-dark-300">All Locations</option>
                  {areas.map((a) => (
                    <option key={a} value={a} className="bg-dark-900 text-white">{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-4/12 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-dark-800">
              <Building className="text-gold-500 flex-shrink-0" size={18} />
              <div className="w-full text-left">
                <label className="block text-[10px] uppercase tracking-widest text-dark-500 font-semibold mb-0.5">
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent text-white font-medium text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%23c5a880' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="" className="bg-dark-900 text-dark-300">All Statuses</option>
                  <option value="ongoing" className="bg-dark-900 text-white">Ongoing Development</option>
                  <option value="upcoming" className="bg-dark-900 text-white">Upcoming Release</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-3/12 px-2 py-1 flex items-center justify-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gold-500 text-dark-950 font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 group whitespace-nowrap"
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
