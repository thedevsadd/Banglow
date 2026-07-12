"use client";

import React from "react";
import { Compass, ShieldCheck, Clock, HeartHandshake } from "lucide-react";

export default function WhyUs() {
  const pillars = [
    {
      icon: <Compass className="text-primary" size={32} />,
      title: "Architectural Purity",
      description: "We collaborate with award-winning biophilic architects to design towers that prioritize wind flows, light angles, and organic flora integration."
    },
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Construction Integrity",
      description: "Utilizing grade-A stone aggregates, certified 72.5 grade steel, and double-depth pilings to ensure structural endurance for generations."
    },
    {
      icon: <Clock className="text-primary" size={32} />,
      title: "Uncompromised Timelines",
      description: "A flawless track record of timely handovers. Every project phase is monitored via real-time logic to meet scheduled completions."
    },
    {
      icon: <HeartHandshake className="text-primary" size={32} />,
      title: "Lifetime Support",
      description: "Our dedicated post-handover team manages building facilities, maintenance, and utility audits for 5 years after move-in."
    }
  ];

  return (
    <section className="bg-background py-24 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
            Our Foundation
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-6">
            The Philosophy of No Compromise
          </h2>
          <p className="text-cream-500 font-light leading-relaxed">
            At Banglow, we do not build houses. We craft residential landmarks that combine structural safety with refined aesthetic lifestyles.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 bg-cream-200 border border-cream-300 hover:border-primary/20 rounded-sm transition-all duration-300 flex flex-col items-start hover:shadow-md group"
            >
              <div className="p-3 bg-cream-100 rounded-sm mb-6 border border-cream-300 group-hover:border-primary/20 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {pillar.title}
              </h3>
              <p className="text-cream-500 text-sm font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
