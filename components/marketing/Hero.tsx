"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building, ChevronDown, Search } from "lucide-react";
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
      className="relative h-screen flex flex-col justify-between overflow-hidden bg-background"
    >
      {/* Background Image - Bright, full screen with no fading overlay masks */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100 scale-102"
        style={{
          backgroundImage: `url('/Assets/Hero-bg.jpeg')`,
        }}
      />

      {/* Main Content Wrapper - Set to max-w-6xl to align with header grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 h-full flex flex-col justify-between">
        
        {/* Left Aligned Text Block with responsive padding */}
        <div className="flex-grow flex flex-col justify-center items-start text-left pt-36 pb-8 max-w-3xl pl-6 lg:pl-16">
          <span className="text-xs uppercase tracking-[0.35em] text-primary font-extrabold mb-4">
            Banglow Real Estate
          </span>
          
          <h1
            ref={titleRef}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-2xl leading-[1.12]"
          >
            Signature Landmarks of <span className="text-primary italic font-normal">Silent Luxury</span>
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-cream-500 text-xs sm:text-sm font-light max-w-md leading-snug mt-1"
          >
            An architect-first builder crafting high-design residential sanctuaries across Dhaka’s premium enclaves.
          </p>
        </div>

        {/* Centered Compact Search Bar - Sized to max-w-4xl for readability */}
        <div
          ref={searchWidgetRef}
          className="w-full flex justify-center pb-16 z-20"
        >
          <div className="w-full max-w-4xl p-1.5 bg-cream-200 border border-cream-300 rounded-full shadow-lg relative overflow-hidden px-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
              
              {/* Select Area - Premium styling */}
              <div className="w-full sm:flex-1 flex items-center gap-3 px-5 py-3 hover:bg-cream-100/50 rounded-full transition-colors cursor-pointer relative group">
                <MapPin className="text-primary flex-shrink-0" size={18} />
                <div className="flex-grow text-left">
                  <label className="block text-[9px] md:text-[10px] uppercase tracking-widest text-cream-550 font-bold mb-0.5">
                    Select Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="bg-transparent text-foreground font-bold text-xs md:text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8 border-none p-0 relative z-10"
                  >
                    <option value="" className="bg-cream-100 text-cream-500">All Locations</option>
                    {areas.map((a) => (
                      <option key={a} value={a} className="bg-cream-100 text-foreground">{a}</option>
                    ))}
                  </select>
                </div>
                <ChevronDown className="absolute right-5 text-primary pointer-events-none group-hover:translate-y-0.5 transition-transform" size={14} />
              </div>

              {/* Select Status - Premium styling */}
              <div className="w-full sm:w-[35%] flex items-center gap-3 px-5 py-3 hover:bg-cream-100/50 rounded-full transition-colors cursor-pointer relative group">
                <Building className="text-primary flex-shrink-0" size={18} />
                <div className="flex-grow text-left">
                  <label className="block text-[9px] md:text-[10px] uppercase tracking-widest text-cream-550 font-bold mb-0.5">
                    Project Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-transparent text-foreground font-bold text-xs md:text-sm focus:outline-none w-full cursor-pointer appearance-none pr-8 border-none p-0 relative z-10"
                  >
                    <option value="" className="bg-cream-100 text-cream-500">All Statuses</option>
                    <option value="ongoing" className="bg-cream-100 text-foreground">Ongoing Development</option>
                    <option value="upcoming" className="bg-cream-100 text-foreground">Upcoming Release</option>
                  </select>
                </div>
                <ChevronDown className="absolute right-5 text-primary pointer-events-none group-hover:translate-y-0.5 transition-transform" size={14} />
              </div>

              {/* Search Button */}
              <div className="w-full sm:w-auto p-1 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-primary text-cream-100 font-bold uppercase tracking-wider text-xs rounded-full hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-1.5 group whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <Search size={14} />
                  Find Residencies
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
