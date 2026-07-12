"use client";

import React from "react";
import { PROPERTIES } from "@/lib/data/properties";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GenericBookMeeting() {
  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-6">
          {/* Title */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
              Consultations
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-4">
              Book a Consultation Call
            </h1>
            <p className="text-cream-500 text-sm font-light leading-relaxed">
              Select one of our signature residential projects below to schedule your site-visit meeting or a call with our allotment directors.
            </p>
          </div>

          {/* Properties Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {PROPERTIES.map((property) => (
              <Link
                key={property.id}
                href={`/book-meeting/${property.slug}`}
                className="group bg-cream-200 border border-cream-300 hover:border-primary/20 p-5 rounded-sm flex flex-col justify-between transition-all duration-300 shadow-xs cursor-pointer hover:shadow-md"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={property.heroImage}
                    alt={property.name}
                    className="h-16 w-24 object-cover rounded-sm border border-cream-300 group-hover:scale-102 transition-transform"
                  />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-cream-500 mt-1">
                      <MapPin size={12} className="text-primary" />
                      <span>{property.area}, Dhaka</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cream-300 pt-4 mt-5 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                  <span>Schedule Consultation</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
