import Header from "@/components/layout/Header";
import Hero from "@/components/marketing/Hero";
import StatsStrip from "@/components/marketing/StatsStrip";
import FeaturedGrid from "@/components/marketing/FeaturedGrid";
import WhyUs from "@/components/marketing/WhyUs";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Calendar, UserCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Stats Strip */}
        <StatsStrip />

        {/* Featured Grid */}
        <FeaturedGrid />

        {/* Why Us section */}
        <WhyUs />

        {/* Call to Action Banner */}
        <section className="bg-dark-900 border-t border-dark-800 relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-950/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-bold mb-4">
              Begin Your Journey
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
              Experience the Landmarks in Person
            </h2>
            <p className="text-dark-300 font-light text-base md:text-lg mb-10 max-w-xl leading-relaxed">
              Schedule a guided physical tour with our client managers. Tour the units, review structural blueprints, and align your custom floor options.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Link
                href="/properties"
                className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 group w-full"
              >
                <Calendar size={14} />
                Book Site Visit
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/track"
                className="px-8 py-4 border border-dark-800 hover:border-gold-500/50 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 w-full"
              >
                <UserCheck size={14} className="text-gold-500" />
                Track My Bookings
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
