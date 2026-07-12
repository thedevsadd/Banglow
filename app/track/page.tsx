"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMeetingBySerial, Meeting } from "@/lib/store/meetings";
import { getBookingBySerialOrInvoice, Booking } from "@/lib/store/bookings";
import { PROPERTIES, Property } from "@/lib/data/properties";
import { calculateProgress, ProgressStage } from "@/lib/utils/progressCalculator";
import { Search, Calendar, User, FileText, CheckCircle2, Circle } from "lucide-react";

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serialParam = searchParams.get("serial") || "";

  const [serialInput, setSerialInput] = useState(serialParam);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  
  const [timeline, setTimeline] = useState<{ stages: ProgressStage[]; percent: number } | null>(null);
  const [associatedProperty, setAssociatedProperty] = useState<Property | null>(null);

  // Search logic
  const handleSearch = (targetSerial: string) => {
    if (!targetSerial) return;
    setSearchTriggered(true);

    const meeting = getMeetingBySerial(targetSerial);
    const booking = getBookingBySerialOrInvoice(targetSerial);

    if (meeting) {
      setMeetingData(meeting);
      setBookingData(null);
      setTimeline(calculateProgress(meeting.createdAt, "meeting"));
      setAssociatedProperty(PROPERTIES.find(p => p.id === meeting.propertyId) || null);
    } else if (booking) {
      setBookingData(booking);
      setMeetingData(null);
      setTimeline(calculateProgress(booking.createdAt, "booking"));
      setAssociatedProperty(PROPERTIES.find(p => p.id === booking.propertyId) || null);
    } else {
      setMeetingData(null);
      setBookingData(null);
      setTimeline(null);
      setAssociatedProperty(null);
    }
  };

  useEffect(() => {
    if (serialParam) {
      setTimeout(() => {
        handleSearch(serialParam);
      }, 0);
    }
  }, [serialParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    router.replace(`/track?serial=${serialInput.trim()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
          Client Portal
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-4">
          Allotment & Visit Tracker
        </h1>
        <p className="text-cream-500 text-sm font-light leading-relaxed">
          Input your reference tracking code (e.g. <span className="font-mono text-xs text-primary font-bold">BTI-2026-0001</span> or <span className="font-mono text-xs text-primary font-bold">INV-2026-0001</span>) to view site walkthrough schedules, verification states, and allotment steps.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-cream-200 border border-cream-300 p-6 rounded-sm mb-12 max-w-2xl mx-auto shadow-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              required
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value)}
              placeholder="Enter reference number (BTI-... / INV-...)"
              className="w-full bg-background border border-cream-300 text-foreground text-sm pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-primary uppercase placeholder:normal-case font-semibold"
            />
            <Search className="absolute left-3.5 top-3.5 text-cream-500" size={16} />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-wider text-xs rounded-sm transition-colors cursor-pointer shadow-xs"
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchTriggered && (
        <div className="max-w-2xl mx-auto">
          {timeline && associatedProperty ? (
            <div className="bg-cream-200 border border-cream-300 p-8 rounded-sm shadow-sm">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cream-300 pb-6 mb-8">
                <div>
                  <span className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-0.5">
                    {meetingData ? "Site Walkthrough" : "Unit Allotment"}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {associatedProperty.name} Residency
                  </h2>
                  <p className="text-xs text-cream-500 font-light mt-0.5">{associatedProperty.fullAddress}</p>
                </div>
                <div className="bg-background border border-cream-300 px-4 py-2 rounded-sm">
                  <span className="text-[10px] text-cream-500 uppercase tracking-widest block font-medium">Tracking Code</span>
                  <span className="font-serif text-sm font-bold text-foreground tracking-wider uppercase">
                    {meetingData ? meetingData.serialNumber : bookingData?.invoiceId}
                  </span>
                </div>
              </div>

              {/* Progress Summary Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-cream-500 mb-10 bg-background/50 border border-cream-350 p-4 rounded-sm">
                <div>
                  <span className="text-cream-500 block mb-0.5">Customer Name</span>
                  <span className="text-foreground font-semibold flex items-center gap-1">
                    <User size={12} className="text-primary" /> {meetingData ? meetingData.name : bookingData?.name}
                  </span>
                </div>
                <div>
                  <span className="text-cream-500 block mb-0.5">Booking Date</span>
                  <span className="text-foreground font-semibold flex items-center gap-1">
                    <Calendar size={12} className="text-primary" /> {meetingData ? meetingData.date : bookingData?.createdAt.split("T")[0]}
                  </span>
                </div>
                {bookingData && (
                  <div>
                    <span className="text-cream-500 block mb-0.5">Allotment Flat</span>
                    <span className="text-foreground font-semibold flex items-center gap-1">
                      <FileText size={12} className="text-primary" /> Flat {bookingData?.unitId.replace(`${associatedProperty.slug}-`, "").toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Timeline Stepper (Vertical Flow) */}
              <div>
                <h3 className="font-serif text-base font-bold text-foreground mb-8 uppercase tracking-wider">
                  Timeline Status Steps
                </h3>
                
                <div className="relative pl-8 flex flex-col gap-10">
                  {/* Progress Line */}
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-cream-300" />
                  {/* Progress Fill Line */}
                  <div 
                    className="absolute left-3.5 top-2 w-0.5 timeline-line-gradient"
                    style={{ height: `${timeline.percent}%` }}
                  />

                  {timeline.stages.map((stage, idx) => {
                    const isCompleted = stage.status === "complete";
                    const isCurrent = stage.status === "current";
                    
                    return (
                      <div key={idx} className="relative text-left">
                        {/* Milestone Node */}
                        <span className="absolute -left-[28px] top-0.5 z-10 flex items-center justify-center">
                          {isCompleted ? (
                            <CheckCircle2 className="text-primary bg-cream-200 rounded-full" size={18} />
                          ) : isCurrent ? (
                            <span className="h-4.5 w-4.5 rounded-full border border-primary bg-primary/20 flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            </span>
                          ) : (
                            <Circle className="text-cream-300 bg-cream-200 rounded-full" size={18} />
                          )}
                        </span>

                        {/* Milestone Text */}
                        <div>
                          <h4 className={`text-sm font-bold tracking-wide ${isCompleted || isCurrent ? "text-foreground" : "text-cream-400"}`}>
                            {stage.label}
                          </h4>
                          <p className={`text-xs mt-1 leading-relaxed font-light ${isCompleted || isCurrent ? "text-cream-500" : "text-cream-350"}`}>
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-cream-200 border border-cream-300 rounded-sm shadow-sm">
              <span className="font-serif text-xl font-bold text-foreground block mb-2">Tracking Code Not Found</span>
              <p className="text-sm text-cream-500 max-w-sm mx-auto mb-6 font-light">
                We could not find any active site walkthroughs or apartment reservations under the serial &ldquo;{serialInput}&rdquo;.
              </p>
              <button
                onClick={() => setSerialInput("")}
                className="px-5 py-2 bg-primary text-cream-100 font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-terracotta-600 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <span className="font-serif text-xl text-primary animate-pulse font-bold">Querying Tracker ID...</span>
          </div>
        }>
          <TrackContent />
        </Suspense>
      </main>
    </>
  );
}
