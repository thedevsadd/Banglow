"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMeetingBySerial, Meeting } from "@/lib/store/meetings";
import { getBookingBySerialOrInvoice, Booking } from "@/lib/store/bookings";
import { PROPERTIES, Property } from "@/lib/data/properties";
import { calculateProgress, ProgressStage } from "@/lib/utils/progressCalculator";
import { formatBDTWord } from "@/lib/utils/formatCurrency";
import { Search, MapPin, Calendar, Clock, Check, User, Info, Building } from "lucide-react";
import Link from "next/link";

export default function TrackPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<{
    type: "meeting" | "booking";
    data: Meeting | Booking;
    property: Property | undefined;
  } | null>(null);

  const handleSearch = (queryVal: string) => {
    const term = queryVal.trim();
    if (!term) return;

    // Check meetings first
    const meeting = getMeetingBySerial(term);
    if (meeting) {
      const prop = PROPERTIES.find(p => p.id === meeting.propertyId);
      setMatchedRecord({
        type: "meeting",
        data: meeting,
        property: prop
      });
      setSearchSubmitted(true);
      return;
    }

    // Check bookings second
    const booking = getBookingBySerialOrInvoice(term);
    if (booking) {
      const prop = PROPERTIES.find(p => p.id === booking.propertyId);
      setMatchedRecord({
        type: "booking",
        data: booking,
        property: prop
      });
      setSearchSubmitted(true);
      return;
    }

    // No match
    setMatchedRecord(null);
    setSearchSubmitted(true);
  };

  // Automatically load serial if passed in query string (e.g. ?serial=BTI-2026-0001)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serialParam = params.get("serial");
      if (serialParam) {
        setTimeout(() => {
          setSearchValue(serialParam);
          handleSearch(serialParam);
        }, 0);
      }
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  // State computed variables
  const progressInfo = matchedRecord
    ? calculateProgress(matchedRecord.data.createdAt, matchedRecord.type)
    : null;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-dark-950">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header intro */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-bold mb-3 block">
              Client Portal
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Track Your Journey
            </h1>
            <p className="text-dark-300 text-sm font-light leading-relaxed">
              Enter your tracking Serial Number (e.g., <code className="text-gold-500 font-mono">BTI-2026-XXXX</code>) or Invoice ID to view meeting status, verification stages, and allotment documentation.
            </p>
          </div>

          {/* Search bar widget */}
          <div className="max-w-xl mx-auto mb-16">
            <form onSubmit={onSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" size={16} />
                <input
                  type="text"
                  required
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter tracking serial or invoice ID"
                  className="w-full bg-dark-900 border border-dark-800 text-white placeholder-dark-500 font-mono text-sm pl-12 pr-4 py-3.5 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-dark-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Track
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchSubmitted && (
            <div className="animate-fade-in">
              {matchedRecord && progressInfo ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Left Column: Progress Timeline */}
                  <div className="lg:col-span-7 bg-dark-900 border border-dark-800 p-8 rounded-sm">
                    <div className="flex justify-between items-center mb-8 border-b border-dark-850 pb-4">
                      <h2 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                        Allotment Timeline
                      </h2>
                      <span className="text-xs font-bold bg-gold-500/10 text-gold-500 border border-gold-500/20 px-3 py-1 rounded-sm">
                        {progressInfo.percent}% Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-dark-950 rounded-full mb-8 overflow-hidden">
                      <div
                        className="h-full bg-gold-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progressInfo.percent}%` }}
                      />
                    </div>

                    {/* Vertical Timeline */}
                    <div className="relative pl-8 border-l border-dark-800 flex flex-col gap-8">
                      {progressInfo.stages.map((stage, idx) => (
                        <div key={idx} className="relative">
                          {/* Circle indicator */}
                          <span
                            className={`absolute -left-11 top-1.5 h-6 w-6 rounded-full flex items-center justify-center border text-xs ${
                              stage.status === "complete"
                                ? "bg-gold-500 border-gold-500 text-dark-950 font-bold"
                                : stage.status === "current"
                                  ? "bg-dark-900 border-gold-500 text-gold-500 font-bold animate-pulse shadow-[0_0_10px_rgba(197,168,128,0.3)]"
                                  : "bg-dark-900 border-dark-800 text-dark-500"
                            }`}
                          >
                            {stage.status === "complete" ? <Check size={12} strokeWidth={3} /> : idx + 1}
                          </span>

                          <div>
                            <h3
                              className={`text-sm font-bold tracking-wide uppercase ${
                                stage.status === "complete"
                                  ? "text-white"
                                  : stage.status === "current"
                                    ? "text-gold-500"
                                    : "text-dark-500"
                              }`}
                            >
                              {stage.label}
                            </h3>
                            <p className="text-xs text-dark-400 font-light mt-1 max-w-sm leading-relaxed">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Demo notice instruction */}
                    <div className="mt-10 p-4 bg-dark-950 border border-dark-850 rounded-sm text-xs text-dark-400 flex items-start gap-2.5">
                      <Info className="text-gold-500 flex-shrink-0 mt-0.5" size={16} />
                      <p className="font-light leading-relaxed">
                        <span className="font-bold text-white">Interactive Demo Pacing:</span> Wait a few minutes (e.g. 2 to 5 minutes) from the time you completed the booking and refresh this tracker to see the stages automatically advance to the next milestones!
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Record details card */}
                  <div className="lg:col-span-5 bg-dark-900 border border-dark-800 p-6 rounded-sm">
                    <h3 className="font-serif text-lg font-bold text-white border-b border-dark-850 pb-3 mb-6 uppercase tracking-wider">
                      allotment profiles
                    </h3>

                    <div className="flex flex-col gap-4 text-xs text-dark-300">
                      <div className="flex justify-between border-b border-dark-850 pb-2">
                        <span>Property Name</span>
                        <span className="text-white font-bold">{matchedRecord.property?.name} Residency</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-dark-850 pb-2">
                        <span>Territory Location</span>
                        <span className="text-white font-medium">{matchedRecord.property?.area}, Dhaka</span>
                      </div>

                      {matchedRecord.type === "booking" && (
                        <>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Allocated Flat</span>
                            <span className="text-white font-semibold">
                              Apartment {(matchedRecord.data as Booking).unitId.replace(`${matchedRecord.property?.slug}-`, "").toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Booking Fee Paid</span>
                            <span className="text-gold-500 font-bold">{formatBDTWord((matchedRecord.data as Booking).bookingMoneyPaid)}</span>
                          </div>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Discussion Date</span>
                            <span className="text-white font-medium">{(matchedRecord.data as Booking).meetingDate}</span>
                          </div>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Discussion Hour</span>
                            <span className="text-white font-medium">{(matchedRecord.data as Booking).meetingTime}</span>
                          </div>
                        </>
                      )}

                      {matchedRecord.type === "meeting" && (
                        <>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Walkthrough Date</span>
                            <span className="text-white font-medium">{(matchedRecord.data as Meeting).date}</span>
                          </div>
                          <div className="flex justify-between border-b border-dark-850 pb-2">
                            <span>Walkthrough Hour</span>
                            <span className="text-white font-medium">{(matchedRecord.data as Meeting).time}</span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between border-b border-dark-850 pb-2">
                        <span>Customer Name</span>
                        <span className="text-white font-medium">{matchedRecord.data.name}</span>
                      </div>

                      <div className="flex justify-between border-b border-dark-850 pb-2 font-mono">
                        <span>Reference ID</span>
                        <span className="text-white font-bold">{matchedRecord.data.serialNumber}</span>
                      </div>

                      {matchedRecord.type === "booking" && (
                        <div className="flex justify-between font-mono">
                          <span>Invoice ID</span>
                          <span className="text-white font-bold">{(matchedRecord.data as Booking).invoiceId}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex flex-col gap-2">
                      <Link
                        href={`/properties/${matchedRecord.property?.slug}`}
                        className="w-full text-center py-2.5 bg-dark-800 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs uppercase tracking-widest rounded-sm transition-all block"
                      >
                        View Project Details
                      </Link>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-sm max-w-xl mx-auto">
                  <div className="text-red-500 font-serif text-3xl font-bold mb-2">Reference ID Not Found</div>
                  <p className="text-sm text-dark-400 max-w-xs mx-auto mb-8 font-light">
                    We could not find any active physical visit or reservation matching the serial number <code className="text-white font-mono">{searchValue}</code>.
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/properties"
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-wider text-xs rounded-sm transition-colors"
                    >
                      Browse Properties
                    </Link>
                    <button
                      onClick={() => {
                        setSearchSubmitted(false);
                        setSearchValue("");
                      }}
                      className="px-6 py-2.5 border border-dark-800 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors hover:bg-dark-950 cursor-pointer"
                    >
                      Search Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
