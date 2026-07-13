import Hero from "@/components/marketing/Hero";
import StatsStrip from "@/components/marketing/StatsStrip";
import FeaturedGrid from "@/components/marketing/FeaturedGrid";
import WhyUs from "@/components/marketing/WhyUs";
import EnclavesShowcase from "@/components/marketing/EnclavesShowcase";
import EngineeringSpecs from "@/components/marketing/EngineeringSpecs";
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
            <p className="text-cream-500 font-light text-base md:text-lg mb-10 max-w-xl leading-snug">
              Schedule a guided physical tour with our client managers. Tour the units, review structural blueprints, and align your custom floor options.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center w-full max-w-sm">
              <Link
                href="/properties"
                className="px-5 py-2.5 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 group w-full cursor-pointer"
              >
                <Calendar size={13} />
                Book Visit
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/track"
                className="px-5 py-2.5 border border-cream-300 hover:border-primary/55 text-foreground font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 w-full bg-background"
              >
                <UserCheck size={13} className="text-primary" />
                Track Bookings
              </Link>
            </div>
          </div>
        </section>

        {/* Curated Enclaves Neighborhood Showcase */}
        <EnclavesShowcase />

        {/* Technical Standards Specifications */}
        <EngineeringSpecs />
      </main>
    </>
  );
}
