"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Minimize2 } from "lucide-react";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDTWord } from "@/lib/utils/formatCurrency";

export default function FeaturedGrid() {
  return (
    <section className="bg-dark-950 py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold mb-3 block">
              Flagship Collection
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Signature Residential Landmarks
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 font-semibold tracking-wider uppercase group border-b border-gold-500/20 pb-1"
          >
            Explore All 6 Properties
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((property) => (
            <div
              key={property.id}
              className="group bg-dark-900 border border-dark-800 hover:border-gold-500/30 rounded-sm overflow-hidden flex flex-col transition-all duration-300 relative"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={property.heroImage}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${
                      property.status === "ongoing"
                        ? "bg-gold-500/10 border-gold-500/30 text-gold-500"
                        : "bg-white/10 border-white/20 text-white"
                    } backdrop-blur-md`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-4 right-4 z-10">
                  <span className="text-xs font-bold bg-dark-950/80 border border-dark-800 text-gold-500 px-3 py-1.5 rounded-sm backdrop-blur-md">
                    From {formatBDTWord(property.pricing.totalPriceMin)}
                  </span>
                </div>
              </div>

              {/* Specs & Info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-dark-400 text-xs mb-2">
                    <MapPin size={12} className="text-gold-500" />
                    <span>{property.area}, Dhaka</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-dark-300 text-sm font-light line-clamp-2 mb-6">
                    {property.tagline}
                  </p>
                </div>

                <div className="border-t border-dark-800 pt-4 mt-auto">
                  <div className="flex justify-between items-center text-xs text-dark-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Minimize2 size={12} className="text-gold-500" />
                      <span>{property.atAGlance.unitSizeRange}</span>
                    </div>
                    <span>{property.atAGlance.floors} Floors</span>
                  </div>

                  <Link
                    href={`/properties/${property.slug}`}
                    className="w-full text-center block py-3 rounded-sm border border-dark-800 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-dark-950 font-bold text-xs uppercase tracking-widest transition-all duration-300"
                  >
                    View Residences
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
