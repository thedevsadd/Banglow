"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROPERTIES } from "@/lib/data/properties";
import { formatBDT, formatBDTWord } from "@/lib/utils/formatCurrency";
import { 
  MapPin, ChevronLeft, ChevronRight, CheckCircle, Info, Send, 
  ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [imageLoading, setImageLoading] = useState(false);
  const [activeLoaded, setActiveLoaded] = useState(false);
  
  // Lightbox modal state for architectural visual detail popup
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Dynamically resolve ART-1 to ART-6 images paths based on the gallery folder path
  const getArtImageUrls = () => {
    if (!property.gallery || property.gallery.length === 0) return [];
    const firstUrl = property.gallery[0];
    const lastSlashIndex = firstUrl.lastIndexOf("/");
    const folderPath = firstUrl.substring(0, lastSlashIndex + 1);
    
    return [
      `${folderPath}ART-1.jpeg`,
      `${folderPath}ART-2.jpeg`,
      `${folderPath}ART-3.jpeg`,
      `${folderPath}ART-4.jpeg`,
      `${folderPath}ART-5.jpeg`,
      `${folderPath}ART-6.jpeg`,
    ];
  };

  const artImages = getArtImageUrls();
  
  // Interest form state
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", message: `I am interested in ${property.name}. Please contact me.` });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Set loading state with a delay to prevent flickering on cached assets
  useEffect(() => {
    setActiveLoaded(false);
    
    const timer = setTimeout(() => {
      setActiveLoaded((loaded) => {
        if (!loaded) {
          setImageLoading(true);
        }
        return loaded;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [activeImageIdx]);

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
      <main className="flex-grow pt-28 pb-20 bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-terracotta-600 font-bold mb-8"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>

          {/* Title block */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-2 text-cream-500 text-sm mb-3">
              <MapPin size={16} className="text-primary" />
              <span className="font-semibold text-foreground">{property.fullAddress}</span>
              <span className="text-cream-300">|</span>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border ${
                  property.status === "ongoing"
                    ? "bg-primary/10 border-primary/25 text-primary"
                    : "bg-cream-200 border-cream-300 text-foreground"
                }`}
              >
                {property.status}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4">
              {property.name}
            </h1>
            <p className="text-primary font-serif font-light text-lg md:text-xl tracking-wide max-w-3xl italic">
              &ldquo;{property.tagline}&rdquo;
            </p>
          </div>

          {/* Grid Layout: Left Gallery + Info, Right Sticky Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Photo Carousel */}
              <div className="relative group w-full bg-cream-200 border border-cream-300 rounded-sm overflow-hidden shadow-sm">
                <div className="relative aspect-video w-full overflow-hidden">
                  
                  {/* Elegant Loading Spinner Overlay */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cream-200/85 backdrop-blur-xs z-10 transition-opacity duration-300">
                      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImageIdx}
                      src={property.gallery[activeImageIdx] || property.heroImage}
                      alt={`${property.name} interior preview`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      onLoad={() => {
                        setActiveLoaded(true);
                        setImageLoading(false);
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Left / Right Nav buttons */}
                  {property.gallery.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream-100/90 border border-cream-300 text-foreground hover:text-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100 shadow-md z-15 cursor-pointer active:scale-95"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream-100/90 border border-cream-300 text-foreground hover:text-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100 shadow-md z-15 cursor-pointer active:scale-95"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails strip - dynamic equal width columns grid */}
                {property.gallery.length > 1 && (
                  <div 
                    className="grid gap-2 p-3 bg-cream-100 border-t border-cream-300 w-full"
                    style={{ gridTemplateColumns: `repeat(${property.gallery.length}, minmax(0, 1fr))` }}
                  >
                    {property.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-full h-14 relative border rounded-sm overflow-hidden transition-all duration-300 ${
                          activeImageIdx === idx ? "border-primary ring-1 ring-primary/30" : "border-cream-300 hover:border-cream-450"
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
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Architectural Narrative</h3>
                <p className="text-cream-500 font-light text-base leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Architectural Showcase Gallery */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Architectural Visuals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {artImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxImage(imgUrl)}
                      type="button"
                      className="aspect-video w-full bg-cream-200 border border-cream-300 rounded-sm overflow-hidden relative group shadow-sm cursor-zoom-in text-left focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      <img
                        src={imgUrl}
                        alt={`Architectural Drawing ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit Availability Grid */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Unit Allocation & Pricing</h3>
                <div className="overflow-x-auto border border-cream-300 rounded-sm shadow-sm">
                  <table className="w-full border-collapse text-left text-sm text-cream-500">
                    <thead className="bg-cream-200 border-b border-cream-300 text-primary text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-4">Unit Number</th>
                        <th className="p-4">Floor</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Layout</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-300 bg-background">
                      {property.units.map((unit) => (
                        <tr key={unit.id} className="hover:bg-cream-200/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{unit.unitNumber}</td>
                          <td className="p-4">{unit.floor}th Floor</td>
                          <td className="p-4">{unit.sizeSqft.toLocaleString()} sft</td>
                          <td className="p-4">{unit.bedroom} Bed / {unit.bathroom} Bath</td>
                          <td className="p-4 font-semibold text-foreground">{formatBDTWord(unit.totalPrice)}</td>
                          <td className="p-4 text-right">
                            {unit.available ? (
                              <Link
                                href={`/checkout/${property.slug}?unit=${unit.id}`}
                                className="px-3 py-1.5 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold text-[10px] uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                              >
                                Reserve Unit
                              </Link>
                            ) : (
                              <span className="text-[10px] uppercase tracking-wider text-cream-500 border border-cream-300 px-2 py-1 rounded bg-cream-100 font-medium">
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
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Location Coordinates</h3>
                <p className="text-cream-500 text-sm mb-6 font-light">
                  {property.fullAddress}
                </p>
                <div className="h-[350px] w-full border border-cream-300 rounded-sm overflow-hidden relative shadow-sm">
                  {/* OSM Embed - styled in pure light layout */}
                  <iframe
                    title="OpenStreetMap Embed"
                    src={mapUrl}
                    className="w-full h-full opacity-90"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  {/* Subtle Map Card Floating */}
                  <div className="absolute bottom-4 left-4 z-10 bg-cream-100/90 backdrop-blur-md p-4 rounded-sm border border-cream-300 max-w-xs pointer-events-none shadow-md">
                    <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Location Coordinates</span>
                    <h4 className="font-serif text-base font-bold text-foreground mt-1">{property.name}</h4>
                    <p className="text-xs text-cream-500 mt-1 line-clamp-2">{property.fullAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) - At a Glance Sticky */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-8">
              
              {/* At a Glance Box */}
              <div className="bg-cream-200 border border-cream-300 p-6 rounded-sm shadow-sm">
                <h3 className="font-serif text-base font-bold text-foreground mb-6 uppercase tracking-wider border-b border-cream-300 pb-3 flex items-center gap-2">
                  <Info size={16} className="text-primary" /> At a Glance
                </h3>

                <div className="flex flex-col gap-4 text-sm mb-8">
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Land Area</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.landArea}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Structure</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.floors}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Apts per Floor</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.apartmentsPerFloor} units</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Unit Size Range</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.unitSizeRange}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Bed / Bath</span>
                    <span className="text-foreground font-semibold">3-4 Bed / 3-5 Bath</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Launch Date</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.launchDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Expected Handover</span>
                    <span className="text-foreground font-semibold">{property.atAGlance.expectedCompletion}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-300/60 pb-2">
                    <span className="text-cream-500">Price per Sqft</span>
                    <span className="text-foreground font-semibold">
                      {formatBDT(property.pricing.pricePerSqftMin)} - {formatBDT(property.pricing.pricePerSqftMax)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-cream-500">Booking Money</span>
                    <span className="text-primary font-bold">{property.pricing.bookingMoneyPercent}% Reservation</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/book-meeting/${property.slug}`}
                    className="w-full text-center py-3.5 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors block cursor-pointer"
                  >
                    Book Site walkthrough
                  </Link>
                  <Link
                    href={`/checkout/${property.slug}`}
                    className="w-full text-center py-3.5 border border-cream-300 hover:border-primary/50 text-foreground font-bold uppercase tracking-widest text-xs rounded-sm transition-all bg-background block cursor-pointer"
                  >
                    Select & Reserve Unit
                  </Link>
                </div>
              </div>

              {/* Lead/Interest Form */}
              <div className="bg-cream-200 border border-cream-300 p-6 rounded-sm shadow-sm">
                <h3 className="font-serif text-lg font-bold text-foreground mb-4">Request Callback</h3>
                {formSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle className="text-primary mx-auto mb-3" size={32} />
                    <h4 className="text-foreground font-bold text-sm mb-1">Request Received</h4>
                    <p className="text-xs text-cream-500 leading-relaxed font-light">
                      Our relationship manager will contact you within 24 hours via phone/email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInterestSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-cream-550 font-bold mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-cream-550 font-bold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-cream-550 font-bold mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                        placeholder="+880 17XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-cream-550 font-bold mb-1">Message</label>
                      <textarea
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        rows={3}
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-cream-100 hover:bg-primary hover:text-cream-100 border border-cream-300 text-foreground text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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

      {/* Lightbox Architectural Image Viewer */}
      {lightboxImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6 backdrop-blur-md cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative bg-cream-100 border border-cream-300 p-2 max-w-4xl w-full rounded-sm max-h-[85vh] overflow-hidden flex flex-col justify-between shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-background flex items-center justify-center rounded-sm overflow-hidden">
              <img
                src={lightboxImage}
                alt="Architectural Visual Enlarge"
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            
            <div className="flex justify-between items-center p-4 border-t border-cream-300">
              <h4 className="font-serif text-sm font-bold text-foreground">
                Architectural Detail View
              </h4>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 border border-cream-300 text-foreground hover:text-primary hover:border-primary text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer bg-background"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
