"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, RefreshCw } from "lucide-react";
import { clearMeetings } from "@/lib/store/meetings";
import { clearBookings } from "@/lib/store/bookings";

export default function Footer() {
  const handleResetDemoData = () => {
    if (typeof window !== "undefined") {
      if (confirm("Are you sure you want to reset all simulated database entries? This will delete all booked visits, units, and custom serials.")) {
        clearMeetings();
        clearBookings();
        localStorage.removeItem("bti_serial_counter");
        localStorage.removeItem("bti_dummy_slots");
        alert("Demo data has been reset to defaults.");
        window.location.href = "/";
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1815] text-[#FAF7F2]/80 border-t border-stone-850 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/Assets/Logo-Banglow.png" alt="Banglow Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            <span className="font-serif text-xl md:text-2xl tracking-[0.18em] font-bold text-[#FAF7F2] group-hover:text-primary transition-colors">
              BANGLOW
            </span>
          </Link>
          <p className="text-[#FAF7F2]/70 pr-4 mt-2 font-light leading-relaxed">
            Crafting architectural landmarks and signature residential addresses across Dhaka. Rooted in premium aesthetics, built for lifetimes.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-[#FAF7F2]/60 hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="text-[#FAF7F2]/60 hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-[#FAF7F2]/60 hover:text-primary transition-colors" aria-label="Linkedin">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="font-serif text-primary text-base font-semibold tracking-wider mb-4 uppercase">
            Corporate Links
          </h4>
          <ul className="flex flex-col gap-3 font-light text-[#FAF7F2]/70">
            <li>
              <Link href="/properties" className="hover:text-primary transition-colors">
                Flagship Properties
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                Our Story & Philosophy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Corporate Contact
              </Link>
            </li>
            <li>
              <Link href="/track" className="text-primary hover:text-terracotta-400 font-semibold flex items-center gap-1.5 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                My Call (Track Booking)
              </Link>
            </li>
          </ul>
        </div>

        {/* Featured Areas Column */}
        <div>
          <h4 className="font-serif text-primary text-base font-semibold tracking-wider mb-4 uppercase">
            Key Territories
          </h4>
          <ul className="flex flex-col gap-3 font-light text-[#FAF7F2]/70">
            <li>
              <Link href="/properties?area=Gulshan" className="hover:text-primary transition-colors">
                Gulshan Enclave
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Dhanmondi" className="hover:text-primary transition-colors">
                Dhanmondi Heritage
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Uttara" className="hover:text-primary transition-colors">
                Uttara Neighborhood
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Purbachal" className="hover:text-primary transition-colors">
                Purbachal Green City
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Bashundhara" className="hover:text-primary transition-colors">
                Bashundhara Urban Core
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="font-serif text-primary text-base font-semibold tracking-wider mb-4 uppercase">
            Head Office
          </h4>
          <ul className="flex flex-col gap-3 font-light text-[#FAF7F2]/70">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
              <span>Banglow Tower, Plot 8B, Road 44, Gulshan 1, Dhaka 1212, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-primary flex-shrink-0" />
              <span>+880 9612-BANGLOW</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-primary flex-shrink-0" />
              <span>concierge@banglow.com.bd</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-850 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#FAF7F2]/50">
          &copy; {currentYear} Banglow Real Estate Ltd. All rights reserved. Mockup practice demo.
        </p>
        
        {/* Reset button */}
        <button
          onClick={handleResetDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#FAF7F2]/40 hover:text-primary hover:border-primary/50 border border-stone-800 rounded transition-all active:scale-95 cursor-pointer"
          title="Clears local data to restart scheduling/booking flows"
        >
          <RefreshCw size={12} />
          Reset Demo Data
        </button>
      </div>
    </footer>
  );
}
