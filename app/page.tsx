import Hero from "@/components/marketing/Hero";
import StatsStrip from "@/components/marketing/StatsStrip";
import FeaturedGrid from "@/components/marketing/FeaturedGrid";
import WhyUs from "@/components/marketing/WhyUs";
import Link from "next/link";
import { ArrowRight, Calendar, UserCheck } from "lucide-react";

export default function Home() {
  return (
    <>
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
        <section className="bg-cream-200 border-t border-cream-300 relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4">
              Begin Your Journey
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-6">
              Experience the Landmarks in Person
            </h2>
            <p className="text-cream-500 font-light text-base md:text-lg mb-10 max-w-xl leading-relaxed">
              Schedule a guided physical tour with our client managers. Tour the units, review structural blueprints, and align your custom floor options.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Link
                href="/properties"
                className="px-8 py-4 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 group w-full cursor-pointer"
              >
                <Calendar size={14} />
                Book Site Visit
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/track"
                className="px-8 py-4 border border-cream-300 hover:border-primary/55 text-foreground font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 w-full bg-background"
              >
                <UserCheck size={14} className="text-primary" />
                Track My Bookings
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
