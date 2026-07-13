"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
  }, [pathname]);

  const isHome = pathname === "/";
  const useDarkHeaderStyle = isScrolled || !isHome;

  const navLinks = [
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useDarkHeaderStyle
            ? "bg-cream-100/90 backdrop-blur-md py-2 shadow-sm border-b border-cream-300"
            : "bg-transparent py-3"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative w-full h-12 md:h-auto">
          {/* Mobile Menu Button - Left on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 focus:outline-none transition-colors duration-300 z-10 ${
              useDarkHeaderStyle ? "text-[#211E1A]" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo - Centered on mobile, Left on desktop */}
          <Link 
            href="/" 
            className="flex items-center group transition-all duration-300 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img 
              src="/Assets/Logo-Banglow.png" 
              alt="Banglow Logo" 
              className={`h-11 w-auto object-contain transition-all duration-300 group-hover:scale-102 ${
                useDarkHeaderStyle ? "" : "brightness-0 invert"
              }`} 
            />
          </Link>
 
          {/* Desktop Nav in a capsule container - dynamically colored */}
          <nav className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 ${
            useDarkHeaderStyle 
              ? "border-cream-300 bg-cream-200/50" 
              : "border-white/10 bg-black/25"
          } backdrop-blur-md shadow-xs`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[10px] tracking-widest uppercase transition-all relative py-1.5 px-3.5 font-bold rounded-full z-10 ${
                    isActive
                      ? "text-white"
                      : (useDarkHeaderStyle ? "text-cream-500 hover:text-[#211E1A]" : "text-white/80 hover:text-white")
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-[#211E1A] rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
 
          {/* Desktop Meeting Button - Slim capsule styled */}
          <div className="hidden md:flex items-center">
            <Link
              href="/book-meeting"
              className={`px-4.5 py-1.5 rounded-full border transition-all duration-300 text-[10px] uppercase tracking-widest font-extrabold ${
                useDarkHeaderStyle
                  ? "border-cream-300 bg-white text-[#211E1A] hover:bg-cream-100 hover:shadow-md hover:-translate-y-0.5"
                  : "border-white/15 bg-white text-black hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              Meeting
            </Link>
          </div>

          {/* Mobile Meeting Link Icon - Right on mobile */}
          <Link
            href="/book-meeting"
            className={`md:hidden p-2 transition-colors duration-300 flex items-center justify-center z-10 ${
              useDarkHeaderStyle ? "text-[#211E1A]" : "text-white"
            }`}
            aria-label="Book a meeting"
          >
            <PhoneCall size={18} />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-cream-100 pt-28 px-8 flex flex-col justify-between pb-12 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-serif tracking-wider block ${
                        isActive ? "text-primary font-bold" : "text-cream-500"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Optional tracker added for mobile access */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3 * 0.05 }}
              >
                <Link
                  href="/track"
                  className={`text-2xl font-serif tracking-wider block text-primary font-bold`}
                >
                  Track Progress
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-col gap-6">
              <Link
                href="/book-meeting"
                className="w-full text-center py-4 rounded-sm bg-primary text-cream-100 hover:bg-terracotta-600 transition-colors uppercase tracking-widest font-semibold text-sm"
              >
                Meeting
              </Link>
              <div className="flex items-center justify-around text-cream-500 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary" /> Gulshan, Dhaka
                </span>
                <span className="flex items-center gap-1">
                  <PhoneCall size={14} className="text-primary" /> +880 9612-BANGLOW
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
