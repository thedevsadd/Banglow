"use client";

import React from "react";
import { Compass, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const achievements = [
    { year: "2000", title: "Inception of Banglow", desc: "Founded with the vision to shift Bangladesh's real estate from building blocks to architectural art." },
    { year: "2007", title: "First Gold Standard Tower", desc: "Completed our flagship 'Orion' tower in Gulshan, setting new local benchmarks for double-glazing and frame shear strength." },
    { year: "2015", title: "Biophilic Framework Adopted", desc: "Pioneered integrated balcony planter structures and water recycling loops in Dhanmondi." },
    { year: "2023", title: "Purbachal Green Initiative", desc: "Secured prime lakefront land plots for next-generation organic garden residences." },
    { year: "2026", title: "Banglow Signature Collection", desc: "Launching 6 flagship properties that represent our ultimate standard of material purity and structural safety." }
  ];

  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background text-foreground">
        
        {/* Intro Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-24">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
            Our Legacy
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-foreground mb-6">
            The Art of Architecture
          </h1>
          <p className="text-cream-500 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Since 2000, Banglow has crafted signature addresses across Dhaka, redefining luxury not by decorative flash, but through clean geometry, structural honesty, and spatial comfort.
          </p>
        </section>

        {/* Corporate Philosophy */}
        <section className="bg-cream-200 border-y border-cream-300 py-24 mb-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Architectural structure detail"
                className="w-full rounded-sm border border-cream-300 shadow-lg"
              />
            </div>
            
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold mb-3 block">
                Founding Philosophy
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Structural Honesty & Spatial Solitude
              </h2>
              <p className="text-cream-500 text-sm leading-relaxed font-light mb-6">
                We believe that a home is a sanctuary, a quiet retreat from metropolitan density. To achieve this, our designers study local microclimates, seasonal wind coordinates, and sun angles. Every Banglow residency features structural columns pushed to the periphery, allowing for open, customizable floor plans.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex gap-3">
                  <Compass className="text-primary flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-foreground mb-1">
                      Solar Tracking Design
                    </h3>
                    <p className="text-xs text-cream-500 font-light leading-relaxed">
                      Slabs and louvers engineered to block harsh summer rays while welcoming winter warmth.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <ShieldCheck className="text-primary flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-foreground mb-1">
                      Material Integrity
                    </h3>
                    <p className="text-xs text-cream-500 font-light leading-relaxed">
                      Fair-faced concrete slabs, exposed brick accents, and local timber frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block text-center">
            Our Journey
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-16">
            Landmarks Through Time
          </h2>
          
          <div className="relative border-l border-cream-300 pl-8 ml-4 space-y-12">
            {achievements.map((item) => (
              <div key={item.year} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[41px] top-1 bg-background border-2 border-primary w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
                
                <div>
                  <span className="font-serif text-xs font-semibold text-primary block">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-foreground mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cream-500 font-light mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
