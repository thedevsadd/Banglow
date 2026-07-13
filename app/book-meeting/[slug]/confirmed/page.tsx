"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { PROPERTIES } from "@/lib/data/properties";
import { getMeetingBySerial, Meeting } from "@/lib/store/meetings";
import { CheckCircle, Copy, Check, Calendar, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

function ConfirmedPageContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serial = searchParams.get("serial");
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) {
    notFound();
  }

  useEffect(() => {
    if (serial) {
      const data = getMeetingBySerial(serial);
      if (data) {
        setTimeout(() => {
          setMeeting(data);
        }, 0);
      }
    }
  }, [serial]);

  if (!serial || !meeting) {
    return (
      <div className="text-center py-20 bg-cream-200 border border-cream-300 rounded-sm shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-2">Booking Not Found</h3>
        <p className="text-sm text-cream-500 mb-6">We could not retrieve details for this booking.</p>
        <Link href="/" className="px-6 py-2 bg-primary text-cream-100 font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-terracotta-600 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const handleCopySerial = () => {
    navigator.clipboard.writeText(meeting.serialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    const parts = time.split(":");
    let hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const getCalendarDates = () => {
    const { hours, minutes } = parseTime(meeting.time);
    const dateParts = meeting.date.split("-").map(Number);
    
    const start = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    
    const formatDateISO = (d: Date) => {
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const dayStr = pad(d.getDate());
      const h = pad(d.getHours());
      const minStr = pad(d.getMinutes());
      return `${y}${m}${dayStr}T${h}${minStr}00`;
    };

    return {
      start: formatDateISO(start),
      end: formatDateISO(end)
    };
  };

  const generateGoogleCalendarUrl = () => {
    const { start, end } = getCalendarDates();
    const title = encodeURIComponent(`Site Visit: ${property.name}`);
    const details = encodeURIComponent(`Guided site walkthrough of ${property.name} Residency. Reference Serial: ${meeting.serialNumber}`);
    const location = encodeURIComponent(property.fullAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const generateIcsDataUri = () => {
    const { start, end } = getCalendarDates();
    
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Banglow Real Estate//Site Visit Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Site Visit: ${property.name}`,
      `DESCRIPTION:Guided site walkthrough of ${property.name} Residency. Reference Serial: ${meeting.serialNumber}`,
      `LOCATION:${property.fullAddress}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines.join("\r\n"))}`;
  };

  return (
    <div className="max-w-md mx-auto bg-cream-200 border border-cream-300 p-6 rounded-sm text-center relative overflow-hidden shadow-sm">
      
      {/* Background radial accent */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <CheckCircle className="text-primary mx-auto mb-6" size={64} />
      
      <span className="text-xs uppercase tracking-widest text-primary font-bold mb-2 block">
        Booking Confirmed
      </span>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">
        Walkthrough Scheduled
      </h1>

      <p className="text-cream-500 text-sm font-light leading-relaxed max-w-sm mx-auto mb-8">
        Your slot is officially locked. Our client relationship officer has been assigned and will receive you at the site lobby.
      </p>

      {/* Serial Card */}
      <div className="bg-background border border-cream-300 p-4 rounded-sm flex items-center justify-between mb-6 w-full max-w-[360px] mx-auto text-left">
        <div>
          <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold block mb-0.5">
            Your tracking Serial
          </span>
          <span className="font-serif text-lg font-bold text-foreground tracking-wider">
            {meeting.serialNumber}
          </span>
        </div>
        <button
          onClick={handleCopySerial}
          type="button"
          className="p-2 border border-cream-300 hover:border-primary/50 text-cream-500 hover:text-primary rounded-sm transition-all flex items-center gap-1 text-xs uppercase tracking-wider font-semibold cursor-pointer active:scale-95 bg-background"
        >
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Details Box */}
      <div className="bg-background/40 border border-cream-300/80 p-5 rounded-sm text-left text-xs text-cream-500 w-full max-w-[360px] mx-auto flex flex-col gap-3 mb-6">
        <div className="flex justify-between border-b border-cream-300/40 pb-2">
          <span>Project Address:</span>
          <span className="text-foreground font-semibold max-w-[200px] text-right truncate" title={property.fullAddress}>
            {property.fullAddress}
          </span>
        </div>
        <div className="flex justify-between border-b border-cream-300/40 pb-2">
          <span>Walkthrough Date:</span>
          <span className="text-foreground font-semibold">{meeting.date}</span>
        </div>
        <div className="flex justify-between border-b border-cream-300/40 pb-2">
          <span>Walkthrough Time:</span>
          <span className="text-foreground font-semibold">{meeting.time}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer Contact:</span>
          <span className="text-foreground font-semibold">{meeting.phone}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto">
        <div className="relative">
          <button
            onClick={() => setShowCalendarMenu(!showCalendarMenu)}
            type="button"
            className="w-full py-3.5 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-widest text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Calendar size={14} /> Add to Calendar
          </button>
          
          {showCalendarMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-cream-100 border border-cream-300 rounded shadow-lg overflow-hidden flex flex-col text-left text-xs uppercase tracking-wider font-bold">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCalendarMenu(false)}
                className="px-4 py-3 hover:bg-cream-200 text-foreground hover:text-primary border-b border-cream-300"
              >
                Sync with Google Calendar
              </a>
              <a
                href={generateIcsDataUri()}
                download={`site-visit-${meeting.serialNumber}.ics`}
                onClick={() => setShowCalendarMenu(false)}
                className="px-4 py-3 hover:bg-cream-200 text-foreground hover:text-primary text-left cursor-pointer"
              >
                Download iCal (.ics) file
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/track"
            className="w-1/2 py-3 border border-cream-300 hover:border-primary/50 text-foreground bg-background hover:bg-cream-200/50 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            Track Status <ArrowRight size={12} />
          </Link>
          <Link
            href="/"
            className="w-1/2 py-3 border border-cream-300 hover:bg-cream-200/50 text-cream-500 bg-background text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Home size={12} /> Return Home
          </Link>
        </div>
      </div>
      
    </div>
  );
}

interface BookingConfirmedPageProps {
  params: Promise<{ slug: string }>;
}

export default function BookingConfirmedPage({ params }: BookingConfirmedPageProps) {
  const { slug } = use(params);

  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <Suspense fallback={
            <div className="text-center py-20">
              <span className="font-serif text-lg text-primary animate-pulse font-bold">Retrieving confirmation...</span>
            </div>
          }>
            <ConfirmedPageContent slug={slug} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
