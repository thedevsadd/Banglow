"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDTWord } from "@/lib/utils/formatCurrency";
import { MapPin, Minimize2, Layers, ArrowUpDown, Filter } from "lucide-react";
import Link from "next/link";

function PropertyListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters state
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Sync state with URL params
  useEffect(() => {
    const areaParam = searchParams.get("area");
    const statusParam = searchParams.get("status");
    setTimeout(() => {
      if (areaParam) setSelectedArea(areaParam);
      if (statusParam) setSelectedStatus(statusParam);
    }, 0);
  }, [searchParams]);

  // Derived properties
  const filteredProperties = PROPERTIES.filter((property) => {
    const matchArea = selectedArea ? property.area === selectedArea : true;
    const matchStatus = selectedStatus ? property.status === selectedStatus : true;
    return matchArea && matchStatus;
  }).sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.pricing.totalPriceMin - b.pricing.totalPriceMin;
    } else if (sortBy === "price-desc") {
      return b.pricing.totalPriceMin - a.pricing.totalPriceMin;
    }
    return 0; // natural order
  });

  const areas = ["Gulshan", "Dhanmondi", "Uttara", "Purbachal", "Jalshiri", "Bashundhara"];

  const handleResetFilters = () => {
    setSelectedArea("");
    setSelectedStatus("");
    setSortBy("");
    router.replace("/properties");
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Intro */}
      <div className="mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
          Elite Portfolio
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
          Flagship Developments
        </h1>
        <p className="text-cream-500 text-base font-light max-w-2xl leading-relaxed">
          Browse our collection of architectural benchmarks across Dhaka. Filter by area or stage, and book a physical site walkthrough today.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream-100/90 backdrop-blur-md p-4 border border-cream-300 rounded-sm mb-12 flex flex-col lg:flex-row gap-4 justify-between items-center z-20 sticky top-20 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Area filter */}
          <div className="flex items-center gap-2 bg-background border border-cream-300 px-3 py-2 rounded-sm text-sm">
            <MapPin size={16} className="text-primary" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer pr-4 font-semibold border-none p-0"
            >
              <option value="" className="bg-cream-100 text-cream-500">All Areas</option>
              {areas.map((a) => (
                <option key={a} value={a} className="bg-cream-100 text-foreground">
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 bg-background border border-cream-300 px-3 py-2 rounded-sm text-sm">
            <Layers size={16} className="text-primary" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer pr-4 font-semibold border-none p-0"
            >
              <option value="" className="bg-cream-100 text-cream-500">All Statuses</option>
              <option value="ongoing" className="bg-cream-100 text-foreground">Ongoing</option>
              <option value="upcoming" className="bg-cream-100 text-foreground">Upcoming</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 bg-background border border-cream-300 px-3 py-2 rounded-sm text-sm">
            <ArrowUpDown size={16} className="text-primary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer pr-4 font-semibold border-none p-0"
            >
              <option value="" className="bg-cream-100 text-cream-500">Sort By</option>
              <option value="price-asc" className="bg-cream-100 text-foreground">Price: Low to High</option>
              <option value="price-desc" className="bg-cream-100 text-foreground">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedArea || selectedStatus || sortBy) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-primary hover:text-terracotta-600 underline underline-offset-4 font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid List */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-cream-200 border border-cream-300 hover:border-primary/20 rounded-sm overflow-hidden flex flex-col transition-all duration-300 relative shadow-sm"
            >
              {/* Cover Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={property.heroImage}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                
                {/* Status */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${
                      property.status === "ongoing"
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-cream-100/90 border-cream-300 text-foreground"
                    } backdrop-blur-md`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Pricing minimum */}
                <div className="absolute bottom-4 right-4 z-10">
                  <span className="text-xs font-bold bg-background/90 border border-cream-300 text-primary px-3 py-1.5 rounded-sm backdrop-blur-md">
                    From {formatBDTWord(property.pricing.totalPriceMin)}
                  </span>
                </div>
              </div>

              {/* Data info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-cream-500 text-xs mb-2">
                    <MapPin size={12} className="text-primary" />
                    <span>{property.area}, Dhaka</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-cream-500 text-sm font-light line-clamp-2 mb-6 leading-relaxed">
                    {property.tagline}
                  </p>
                </div>

                <div className="border-t border-cream-300 pt-4 mt-auto">
                  <div className="flex justify-between items-center text-xs text-cream-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Minimize2 size={12} className="text-primary" />
                      <span>{property.atAGlance.unitSizeRange}</span>
                    </div>
                    <span>{property.atAGlance.floors} Floors</span>
                  </div>

                  <Link
                    href={`/properties/${property.slug}`}
                    className="w-full text-center block py-3 rounded-sm border border-cream-300 text-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-cream-100 font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-cream-200 border border-cream-300 rounded-sm mb-24 shadow-sm">
          <Filter size={48} className="text-cream-500 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No Properties Found</h3>
          <p className="text-cream-500 text-sm max-w-md mx-auto mb-6 font-light">
            We currently do not have any listings matching your specific combination of filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-primary text-cream-100 font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-terracotta-600 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function PropertiesListing() {
  return (
    <>
      <main className="flex-grow pt-32">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <span className="font-serif text-xl text-primary animate-pulse">Loading Collection...</span>
          </div>
        }>
          <PropertyListingContent />
        </Suspense>
      </main>
    </>
  );
}
