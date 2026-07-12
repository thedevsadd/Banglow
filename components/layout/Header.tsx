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

  const navLinks = [
    { name: "Properties", href: "/properties" },
    { name: "About Brand", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Track Progress", href: "/track" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-cream-100/90 backdrop-blur-md py-4 shadow-sm border-b border-cream-300"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/Assets/Logo-Banglow.png" alt="Banglow Logo" className="h-8 w-auto object-contain" />
            <span className="font-serif text-xl md:text-2xl tracking-[0.18em] font-bold text-foreground transition-colors group-hover:text-primary">
              BANGLOW
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-widest uppercase transition-colors relative py-1 font-semibold ${
                    isActive
                      ? "text-primary"
                      : "text-cream-500 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Booking Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/properties"
              className="px-5 py-2.5 rounded-sm border border-primary text-primary hover:bg-primary hover:text-cream-100 transition-all duration-300 text-xs uppercase tracking-widest font-semibold"
            >
              Book Site Visit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-primary p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
            </div>

            <div className="flex flex-col gap-6">
              <Link
                href="/properties"
                className="w-full text-center py-4 rounded-sm bg-primary text-cream-100 hover:bg-terracotta-600 transition-colors uppercase tracking-widest font-semibold text-sm"
              >
                Explore Properties
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
