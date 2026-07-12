"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDT, formatBDTWord } from "@/lib/utils/formatCurrency";
import { 
  MapPin, Calendar, Compass, Ruler, Building, ArrowLeft, 
  ChevronLeft, ChevronRight, CheckCircle, Info, Send 
} from "lucide-react";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = use(params);
  const property = PROPERTIES.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  // Active image state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  
  // Floorplan modal state
  const [activeFloorplan, setActiveFloorplan] = useState<number | null>(null);
  
  // Interest form state
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", message: `I am interested in ${property.name}. Please contact me.` });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === property.gallery.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? property.gallery.length - 1 : prev - 1));
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) return;

    // Simulate saving lead to localStorage
    if (typeof window !== "undefined") {
      const leads = localStorage.getItem("bti_leads") ? JSON.parse(localStorage.getItem("bti_leads")!) : [];
      leads.push({
        ...leadForm,
        propertyId: property.id,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("bti_leads", JSON.stringify(leads));
    }
    
    setFormSubmitted(true);
  };

  // Map Iframe URL construction (Dhaka local coordinates)
  const mapLat = property.location.lat;
  const mapLng = property.location.lng;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.003}%2C${mapLat - 0.003}%2C${mapLng + 0.003}%2C${mapLat + 0.003}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-500 hover:text-gold-400 font-semibold mb-8"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>

          {/* Title block */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-dark-400 text-sm mb-3">
              <MapPin size={16} className="text-gold-500" />
              <span className="font-medium">{property.fullAddress}</span>
              <span className="text-dark-600">|</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border ${
                  property.status === "ongoing"
                    ? "bg-gold-500/10 border-gold-500/30 text-gold-500"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                {property.status}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
              {property.name}
            </h1>
            <p className="text-gold-500 font-light text-lg md:text-xl tracking-wide max-w-3xl italic">
              &ldquo;{property.tagline}&rdquo;
            </p>
          </div>

          {/* Grid Layout: Left Gallery + Info, Right Sticky Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Photo Carousel */}
              <div className="relative group w-full bg-dark-900 border border-dark-800 rounded-sm overflow-hidden">
                <div className="relative aspect-video w-full">
                  <img
                    src={property.gallery[activeImageIdx] || property.heroImage}
                    alt={`${property.name} interior preview`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  
                  {/* Left / Right Nav buttons */}
                  {property.gallery.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-950/80 border border-dark-800 text-white hover:text-gold-500 hover:border-gold-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-950/80 border border-dark-800 text-white hover:text-gold-500 hover:border-gold-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails strip */}
                {property.gallery.length > 1 && (
                  <div className="flex gap-2 p-3 bg-dark-950 overflow-x-auto border-t border-dark-800">
                    {property.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-20 h-14 relative flex-shrink-0 border rounded-sm overflow-hidden ${
                          activeImageIdx === idx ? "border-gold-500" : "border-dark-800 hover:border-dark-600"
                        }`}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Architectural Narrative</h3>
                <p className="text-dark-300 font-light text-base leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Floor Plans List */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-6">Signature Unit Floorplans</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {property.floorPlans.map((fp, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveFloorplan(idx)}
                      className="p-4 bg-dark-900 border border-dark-800 hover:border-gold-500/20 rounded-sm cursor-pointer group transition-all"
                    >
                      <div className="aspect-video w-full bg-dark-950 border border-dark-800 overflow-hidden mb-3 relative flex items-center justify-center">
                        <img
                          src={fp.image}
                          alt={fp.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                        />
                        <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-colors flex items-center justify-center">
                          <span className="text-xs uppercase tracking-widest text-gold-500 border border-gold-500/40 px-3 py-1.5 rounded-sm bg-dark-950/80">
                            Enlarge Layout
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors">
                        {fp.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unit Availability Grid */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-6">Unit Allocation & Pricing</h3>
                <div className="overflow-x-auto border border-dark-800 rounded-sm">
                  <table className="w-full border-collapse text-left text-sm text-dark-300">
                    <thead className="bg-dark-900 border-b border-dark-800 text-gold-500 text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-4">Unit Number</th>
                        <th className="p-4">Floor</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Layout</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800">
                      {property.units.map((unit) => (
                        <tr key={unit.id} className="hover:bg-dark-900/50 transition-colors">
                          <td className="p-4 font-bold text-white">{unit.unitNumber}</td>
                          <td className="p-4">{unit.floor}th Floor</td>
                          <td className="p-4">{unit.sizeSqft.toLocaleString()} sft</td>
                          <td className="p-4">{unit.bedroom} Bed / {unit.bathroom} Bath</td>
                          <td className="p-4 font-semibold text-white">{formatBDTWord(unit.totalPrice)}</td>
                          <td className="p-4 text-right">
                            {unit.available ? (
                              <Link
                                href={`/checkout/${property.slug}?unit=${unit.id}`}
                                className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold text-[10px] uppercase tracking-wider rounded-sm transition-colors"
                              >
                                Reserve Unit
                              </Link>
                            ) : (
                              <span className="text-[10px] uppercase tracking-wider text-dark-500 border border-dark-800 px-2 py-1 rounded bg-dark-950 font-medium">
                                Allocated
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Location Map Section */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">Location Coordinates</h3>
                <p className="text-dark-400 text-sm mb-6 font-light">
                  {property.fullAddress}
                </p>
                <div className="h-[350px] w-full border border-dark-800 rounded-sm overflow-hidden relative">
                  {/* OSM Embed */}
                  <iframe
                    title="OpenStreetMap Embed"
                    src={mapUrl}
                    className="w-full h-full grayscale opacity-80 invert contrast-125"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  {/* Subtle Map Card Floating */}
                  <div className="absolute bottom-4 left-4 z-10 glassmorphism p-4 rounded-sm border border-dark-800 max-w-xs pointer-events-none">
                    <span className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">Location Coordinates</span>
                    <h4 className="font-serif text-base font-bold text-white mt-1">{property.name}</h4>
                    <p className="text-xs text-dark-300 mt-1 line-clamp-2">{property.fullAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) - At a Glance Sticky */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-8">
              
              {/* At a Glance Box */}
              <div className="bg-dark-900 border border-dark-800 p-6 rounded-sm">
                <h3 className="font-serif text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-dark-800 pb-3 flex items-center gap-2">
                  <Info size={16} className="text-gold-500" /> At a Glance
                </h3>

                <div className="flex flex-col gap-4 text-sm mb-8">
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Land Area</span>
                    <span className="text-white font-medium">{property.atAGlance.landArea}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Structure</span>
                    <span className="text-white font-medium">{property.atAGlance.floors}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Apts per Floor</span>
                    <span className="text-white font-medium">{property.atAGlance.apartmentsPerFloor} units</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Unit Size Range</span>
                    <span className="text-white font-medium">{property.atAGlance.unitSizeRange}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Bed / Bath</span>
                    <span className="text-white font-medium">3-4 Bed / 3-5 Bath</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Launch Date</span>
                    <span className="text-white font-medium">{property.atAGlance.launchDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Expected Handover</span>
                    <span className="text-white font-medium">{property.atAGlance.expectedCompletion}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-dark-400">Price per Sqft</span>
                    <span className="text-white font-medium">
                      {formatBDT(property.pricing.pricePerSqftMin)} - {formatBDT(property.pricing.pricePerSqftMax)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-dark-400">Booking Money</span>
                    <span className="text-gold-500 font-bold">{property.pricing.bookingMoneyPercent}% Reservation</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/book-meeting/${property.slug}`}
                    className="w-full text-center py-3.5 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors block"
                  >
                    Book Site walkthrough
                  </Link>
                  <Link
                    href={`/checkout/${property.slug}`}
                    className="w-full text-center py-3.5 border border-dark-800 hover:border-gold-500/50 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-all block"
                  >
                    Select & Reserve Unit
                  </Link>
                </div>
              </div>

              {/* Lead/Interest Form */}
              <div className="bg-dark-900 border border-dark-800 p-6 rounded-sm">
                <h3 className="font-serif text-lg font-bold text-white mb-4">Request Callback</h3>
                {formSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle className="text-gold-500 mx-auto mb-3" size={32} />
                    <h4 className="text-white font-bold text-sm mb-1">Request Received</h4>
                    <p className="text-xs text-dark-400 leading-relaxed">
                      Our relationship manager will contact you within 24 hours via phone/email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInterestSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                        placeholder="+880 17XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Message</label>
                      <textarea
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        rows={3}
                        className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-dark-800 hover:bg-gold-500 hover:text-dark-950 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={12} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Floorplan viewer */}
      {activeFloorplan !== null && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/95 flex items-center justify-center p-6"
          onClick={() => setActiveFloorplan(null)}
        >
          <div
            className="relative bg-dark-900 border border-dark-800 p-2 max-w-4xl w-full rounded-sm max-h-[85vh] overflow-hidden flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-dark-950 flex items-center justify-center">
              <img
                src={property.floorPlans[activeFloorplan].image}
                alt={property.floorPlans[activeFloorplan].title}
                className="max-h-[70vh] object-contain"
              />
            </div>
            
            <div className="flex justify-between items-center p-4 border-t border-dark-800">
              <h4 className="font-serif text-lg font-bold text-white">
                {property.floorPlans[activeFloorplan].title}
              </h4>
              <button
                onClick={() => setActiveFloorplan(null)}
                className="px-4 py-2 border border-dark-800 text-white hover:text-gold-500 hover:border-gold-500 text-xs uppercase tracking-widest font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
