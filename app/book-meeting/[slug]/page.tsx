"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PROPERTIES } from "@/lib/data/properties";
import { getDummySlots, TIME_SLOTS, isSlotBooked } from "@/lib/store/dummySlots";
import { saveMeeting } from "@/lib/store/meetings";
import { MapPin, Calendar as CalendarIcon, Clock, User, Phone, Mail, ArrowRight, ArrowLeft } from "lucide-react";

interface BookMeetingPageProps {
  params: Promise<{ slug: string }>;
}

export default function BookMeetingPage({ params }: BookMeetingPageProps) {
  const { slug } = use(params);
  const property = PROPERTIES.find((p) => p.slug === slug);
  const router = useRouter();

  if (!property) {
    notFound();
  }

  // Pre-seed and load dummy slots on mount
  useEffect(() => {
    getDummySlots();
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  
  // Date state
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Time state
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Contact state
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar generation helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 is Sunday
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;

    // Disable past dates
    const dateObj = new Date(year, currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) return;

    setSelectedDateStr(dateStr);
    setSelectedTime(""); // Reset time on date change
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    // Prevent navigating before today's month
    const today = new Date();
    if (newMonth.getFullYear() < today.getFullYear() || 
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  // Check if a specific date has all slots booked
  const isDateFullyBooked = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;
    
    return TIME_SLOTS.every(time => isSlotBooked(dateStr, time));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const handleNextStep = () => {
    if (currentStep === 1 && selectedDateStr && selectedTime) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) return;

    setIsSubmitting(true);
    
    // Artificial slight delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    const meeting = saveMeeting({
      propertyId: property.id,
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      date: selectedDateStr,
      time: selectedTime,
    });

    setIsSubmitting(false);
    router.push(`/book-meeting/${property.slug}/confirmed?serial=${meeting.serialNumber}`);
  };

  // Generate blank leading cells for calendar
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  // Generate days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isPast = cellDate < today;
    const isToday = cellDate.toDateString() === new Date().toDateString();
    
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;
    
    const isSelected = selectedDateStr === dateStr;
    const isFull = isDateFullyBooked(day);

    let cellClass = "h-10 w-10 flex items-center justify-center rounded-sm text-sm font-medium transition-all cursor-pointer ";
    
    if (isPast) {
      cellClass += "text-dark-600 cursor-not-allowed";
    } else if (isSelected) {
      cellClass += "bg-gold-500 text-dark-950 font-bold";
    } else if (isFull) {
      cellClass += "text-dark-500 line-through decoration-dark-600 bg-dark-900/30 cursor-not-allowed";
    } else if (isToday) {
      cellClass += "border border-gold-500 text-gold-500 hover:bg-gold-500/10";
    } else {
      cellClass += "text-white bg-dark-900 hover:border hover:border-gold-500/30";
    }

    calendarCells.push(
      <button
        key={`day-${day}`}
        disabled={isPast || isFull}
        onClick={() => handleDateSelect(day)}
        className={cellClass}
      >
        {day}
      </button>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-dark-950">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header context card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-dark-900 border border-dark-800 rounded-sm mb-12">
            <img
              src={property.heroImage}
              alt={property.name}
              className="h-20 w-32 object-cover rounded-sm border border-dark-800"
            />
            <div className="text-center sm:text-left flex-grow">
              <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block mb-1">
                Scheduling site walkthrough
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mb-1">
                {property.name} Residency
              </h2>
              <div className="flex justify-center sm:justify-start items-center gap-1 text-xs text-dark-400">
                <MapPin size={12} className="text-gold-500" />
                <span>{property.fullAddress}</span>
              </div>
            </div>
            
            <Link
              href={`/properties/${property.slug}`}
              className="text-xs uppercase tracking-widest text-dark-400 hover:text-gold-500 font-bold border border-dark-800 hover:border-gold-500/20 px-4 py-2 rounded-sm"
            >
              Cancel
            </Link>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm border ${
                currentStep === 1
                  ? "border-gold-500 text-gold-500 bg-gold-500/5"
                  : "border-dark-800 text-dark-500"
              }`}
            >
              Step 1: Choose Date & Time
            </span>
            <div className="h-px w-8 bg-dark-800" />
            <span
              className={`text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm border ${
                currentStep === 2
                  ? "border-gold-500 text-gold-500 bg-gold-500/5"
                  : "border-dark-800 text-dark-500"
              }`}
            >
              Step 2: Contact Profiles
            </span>
          </div>

          {/* STEP 1: Date & Time Picker */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Calendar Column */}
              <div className="md:col-span-7 bg-dark-900 border border-dark-800 p-6 rounded-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon size={16} className="text-gold-500" /> {monthName}
                  </h3>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMonthChange("prev")}
                      className="p-1.5 border border-dark-800 text-dark-300 hover:text-gold-500 rounded-sm active:scale-95 disabled:opacity-40"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      onClick={() => handleMonthChange("next")}
                      className="p-1.5 border border-dark-800 text-dark-300 hover:text-gold-500 rounded-sm active:scale-95"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Day letters */}
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-dark-500 font-bold uppercase tracking-wider mb-2">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>

                {/* Days numbers */}
                <div className="grid grid-cols-7 gap-2 justify-items-center">
                  {calendarCells}
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4 text-xs text-dark-500 border-t border-dark-800/50 pt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded-sm border border-gold-500 bg-gold-500/10"></span>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded-sm bg-dark-900"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded-sm text-dark-500 line-through bg-dark-900/30"></span>
                    <span>Fully Booked</span>
                  </div>
                </div>
              </div>

              {/* Time Slots Column */}
              <div className="md:col-span-5 bg-dark-900 border border-dark-800 p-6 rounded-sm min-h-[340px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-dark-800 pb-3">
                    <Clock size={16} className="text-gold-500" /> Hourly Availability
                  </h3>
                  
                  {selectedDateStr ? (
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map((time) => {
                        const isBooked = isSlotBooked(selectedDateStr, time);
                        const isSelected = selectedTime === time;
                        
                        let btnClass = "py-2.5 px-2 text-xs font-semibold rounded-sm border text-center transition-all ";
                        
                        if (isBooked) {
                          btnClass += "border-dark-800 text-dark-500 cursor-not-allowed bg-dark-950";
                        } else if (isSelected) {
                          btnClass += "bg-gold-500 border-gold-500 text-dark-950 font-bold";
                        } else {
                          btnClass += "border-dark-850 hover:border-gold-500 text-white hover:text-gold-500 cursor-pointer";
                        }

                        return (
                          <button
                            key={time}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={btnClass}
                          >
                            {time} {isBooked && "(Booked)"}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-dark-500">
                      <CalendarIcon size={32} className="mb-2 opacity-50" />
                      <p className="text-xs">Please select a date on the calendar to see available slots.</p>
                    </div>
                  )}
                </div>

                {selectedDateStr && selectedTime && (
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-3 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Continue to Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Contact Details Form */}
          {currentStep === 2 && (
            <div className="bg-dark-900 border border-dark-800 p-8 rounded-sm max-w-xl mx-auto">
              <h3 className="font-serif text-xl font-bold text-white mb-6 border-b border-dark-800 pb-4">
                Confirm Client Details
              </h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2 flex items-center gap-1">
                    <User size={14} className="text-gold-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-800 text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2 flex items-center gap-1">
                    <Mail size={14} className="text-gold-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-800 text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500"
                    placeholder="name@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2 flex items-center gap-1">
                    <Phone size={14} className="text-gold-500" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-800 text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>

                <div className="bg-dark-950 p-4 border border-dark-800/80 rounded-sm text-xs text-dark-400">
                  <p className="font-semibold text-white mb-1">Appointment Summary:</p>
                  <p>Walkthrough site tour of <span className="text-gold-500 font-bold">{property.name}</span></p>
                  <p>Date: <span className="text-white font-medium">{selectedDateStr}</span></p>
                  <p>Time: <span className="text-white font-medium">{selectedTime}</span></p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 py-3 border.5 border-dark-800 text-dark-300 hover:text-white rounded-sm font-semibold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Schedule"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
