"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building, ChevronDown, Search } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  
  // Custom dropdown states
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Refs for click outside
  const areaRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside to close custom dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        setIsAreaOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          backgroundImage: `url('https://raw.githubusercontent.com/thedevsadd/Banglow/assets-store/public/Assets/Hero-bg.jpeg')`,
        }}
      />

      {/* Main Content Wrapper - Set to max-w-6xl to align with header grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 h-full flex flex-col justify-between">
        
        {/* Left Aligned Text Block with responsive padding */}
        <div className="flex-grow flex flex-col justify-center items-start text-left pt-36 pb-8 max-w-3xl pl-0">
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

        {/* Centered Compact Search Bar - Sized to max-w-3xl for compact pill layout */}
        <div
          ref={searchWidgetRef}
          className="w-full flex justify-center pb-16 z-20"
        >
          <div className="w-full max-w-3xl p-3 sm:p-1 bg-white/15 border border-white/25 rounded-2xl sm:rounded-full shadow-lg backdrop-blur-md relative px-4 sm:px-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
              
              {/* Select Area - Custom Dropdown Pill */}
              <div 
                ref={areaRef}
                onClick={() => setIsAreaOpen(!isAreaOpen)}
                className="w-full sm:flex-1 flex items-center gap-3 px-3 sm:px-4.5 py-2 sm:py-1.5 hover:bg-white/10 rounded-xl sm:rounded-full transition-colors cursor-pointer relative group border-b border-white/10 sm:border-b-0 pb-3 sm:pb-1.5"
              >
                <MapPin className="text-primary flex-shrink-0" size={16} />
                <div className="flex-grow text-left">
                  <span className="block text-[8px] md:text-[9px] uppercase tracking-widest text-cream-500 font-bold mb-0.5 pointer-events-none">
                    Select Area
                  </span>
                  <span className="text-foreground font-bold text-xs select-none block min-h-[16px]">
                    {area || "All Locations"}
                  </span>
                </div>
                <ChevronDown className="absolute right-3 sm:right-5 text-primary pointer-events-none group-hover:translate-y-0.5 transition-transform" size={14} />
                
                {/* Custom Area Dropdown List */}
                {isAreaOpen && (
                  <div className="absolute bottom-[110%] left-0 w-full bg-cream-100/95 backdrop-blur-md border border-cream-300 rounded-sm shadow-xl py-1 z-30 max-h-48 overflow-y-auto">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setArea("");
                        setIsAreaOpen(false);
                      }}
                      className="px-4 py-2 text-xs text-cream-500 hover:bg-[#211E1A] hover:text-white transition-colors cursor-pointer text-left font-bold"
                    >
                      All Locations
                    </div>
                    {areas.map((a) => (
                      <div
                        key={a}
                        onClick={(e) => {
                          e.stopPropagation();
                          setArea(a);
                          setIsAreaOpen(false);
                        }}
                        className={`px-4 py-2 text-xs hover:bg-[#211E1A] hover:text-white transition-colors cursor-pointer text-left font-bold ${
                          area === a ? "text-primary bg-cream-200" : "text-foreground"
                        }`}
                      >
                        {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Status - Custom Dropdown Pill */}
              <div 
                ref={statusRef}
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full sm:w-[35%] flex items-center gap-3 px-3 sm:px-4.5 py-2 sm:py-1.5 hover:bg-white/10 rounded-xl sm:rounded-full transition-colors cursor-pointer relative group border-b border-white/10 sm:border-b-0 pb-3 sm:pb-1.5"
              >
                <Building className="text-primary flex-shrink-0" size={16} />
                <div className="flex-grow text-left">
                  <span className="block text-[8px] md:text-[9px] uppercase tracking-widest text-cream-500 font-bold mb-0.5 pointer-events-none">
                    Project Status
                  </span>
                  <span className="text-foreground font-bold text-xs select-none block min-h-[16px]">
                    {status === "ongoing" ? "Ongoing Development" : status === "upcoming" ? "Upcoming Release" : "All Statuses"}
                  </span>
                </div>
                <ChevronDown className="absolute right-3 sm:right-5 text-primary pointer-events-none group-hover:translate-y-0.5 transition-transform" size={14} />
                
                {/* Custom Status Dropdown List */}
                {isStatusOpen && (
                  <div className="absolute bottom-[110%] left-0 w-full bg-cream-100/95 backdrop-blur-md border border-cream-300 rounded-sm shadow-xl py-1 z-30">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatus("");
                        setIsStatusOpen(false);
                      }}
                      className="px-4 py-2 text-xs text-cream-500 hover:bg-[#211E1A] hover:text-white transition-colors cursor-pointer text-left font-bold"
                    >
                      All Statuses
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatus("ongoing");
                        setIsStatusOpen(false);
                      }}
                      className={`px-4 py-2 text-xs hover:bg-[#211E1A] hover:text-white transition-colors cursor-pointer text-left font-bold ${
                        status === "ongoing" ? "text-primary bg-cream-200" : "text-foreground"
                      }`}
                    >
                      Ongoing Development
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatus("upcoming");
                        setIsStatusOpen(false);
                      }}
                      className={`px-4 py-2 text-xs hover:bg-[#211E1A] hover:text-white transition-colors cursor-pointer text-left font-bold ${
                        status === "upcoming" ? "text-primary bg-cream-200" : "text-foreground"
                      }`}
                    >
                      Upcoming Release
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="w-full sm:w-auto p-1 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-3 sm:py-2 bg-primary text-cream-100 font-bold uppercase tracking-wider text-xs rounded-xl sm:rounded-full hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-1.5 group whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <Search size={12} />
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
