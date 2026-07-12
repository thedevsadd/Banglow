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
    <footer className="bg-dark-950 border-t border-dark-900 pt-16 pb-8 text-dark-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <span className="font-serif text-2xl tracking-[0.2em] font-bold text-gold-500 hover:text-gold-400 transition-colors">
              BANGLOW
            </span>
          </Link>
          <p className="text-dark-300 pr-4 mt-2">
            Crafting architectural landmarks and signature residential addresses across Dhaka. Rooted in premium aesthetics, built for lifetimes.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-dark-400 hover:text-gold-500 transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="text-dark-400 hover:text-gold-500 transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-dark-400 hover:text-gold-500 transition-colors" aria-label="Linkedin">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="font-serif text-gold-500 text-base font-semibold tracking-wider mb-4 uppercase">
            Corporate Links
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/properties" className="hover:text-gold-500 transition-colors">
                Flagship Properties
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-500 transition-colors">
                Our Story & Philosophy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-500 transition-colors">
                Corporate Contact
              </Link>
            </li>
            <li>
              <Link href="/track" className="text-gold-500 hover:text-gold-400 font-semibold flex items-center gap-1.5 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                  My Call (Track Booking)
              </Link>
            </li>
          </ul>
        </div>

        {/* Featured Areas Column */}
        <div>
          <h4 className="font-serif text-gold-500 text-base font-semibold tracking-wider mb-4 uppercase">
            Key Territories
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/properties?area=Gulshan" className="hover:text-gold-500 transition-colors">
                Gulshan Enclave
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Dhanmondi" className="hover:text-gold-500 transition-colors">
                Dhanmondi Heritage
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Uttara" className="hover:text-gold-500 transition-colors">
                Uttara Neighborhood
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Purbachal" className="hover:text-gold-500 transition-colors">
                Purbachal Green City
              </Link>
            </li>
            <li>
              <Link href="/properties?area=Bashundhara" className="hover:text-gold-500 transition-colors">
                Bashundhara Urban Core
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="font-serif text-gold-500 text-base font-semibold tracking-wider mb-4 uppercase">
            Head Office
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-gold-500 mt-1 flex-shrink-0" />
              <span>Banglow Tower, Plot 8B, Road 44, Gulshan 1, Dhaka 1212, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-gold-500 flex-shrink-0" />
              <span>+880 9612-BANGLOW</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-gold-500 flex-shrink-0" />
              <span>concierge@banglow.com.bd</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-dark-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-dark-500">
          &copy; {currentYear} Banglow Real Estate Ltd. All rights reserved. This website is a mockup/practice project.
        </p>
        
        {/* Reset button */}
        <button
          onClick={handleResetDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-500 hover:text-gold-500 hover:border-gold-500/50 border border-dark-800 rounded transition-all active:scale-95"
          title="Clears local data to restart scheduling/booking flows"
        >
          <RefreshCw size={12} />
          Reset Demo Data
        </button>
      </div>
    </footer>
  );
}
