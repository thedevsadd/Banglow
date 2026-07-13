"use client";

import React, { useState, useEffect, Suspense, use, useCallback } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PROPERTIES, Unit } from "@/lib/data/properties";
import { getDummySlots, TIME_SLOTS } from "@/lib/store/dummySlots";
import { saveBooking, Booking } from "@/lib/store/bookings";
import { formatBDT, formatBDTWord } from "@/lib/utils/formatCurrency";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
import { 
  CreditCard, Smartphone, CheckCircle, 
  Clock, Download, ArrowRight, ArrowLeft, 
  MapPin, ShieldAlert
} from "lucide-react";

// Dynamically import PDF link to avoid SSR build bugs
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

function CheckoutContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const property = PROPERTIES.find((p) => p.slug === slug);
  const initialUnitId = searchParams.get("unit");

  if (!property) {
    notFound();
  }

  // Pre-seed and load dummy slots on mount
  useEffect(() => {
    getDummySlots();
  }, []);

  const [currentStep, setCurrentStep] = useState(1); // 1: Unit, 2: Payment, 3: Details & Meet, 4: Verification, 5: Success
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "mfs">("bank");
  const [transactionRef, setTransactionRef] = useState("");
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [meetingDateStr, setMeetingDateStr] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [verificationLog, setVerificationLog] = useState("Verifying transaction details...");
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  useEffect(() => {
    if (initialUnitId) {
      const u = property.units.find(x => x.id === initialUnitId);
      if (u && u.available) {
        setTimeout(() => {
          setSelectedUnit(u);
        }, 0);
      }
    }
  }, [initialUnitId, property]);

  const handleFinishVerification = useCallback(() => {
    if (!selectedUnit) return;
    
    // Save to localStorage
    const booking = saveBooking({
      propertyId: property.id,
      unitId: selectedUnit.id,
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      paymentMethod,
      bookingMoneyPaid: selectedUnit.totalPrice * (property.pricing.bookingMoneyPercent / 100),
      totalUnitPrice: selectedUnit.totalPrice,
      remainingBalance: selectedUnit.totalPrice * (1 - property.pricing.bookingMoneyPercent / 100),
      meetingDate: meetingDateStr,
      meetingTime,
    });

    setCreatedBooking(booking);
    setCurrentStep(5);
  }, [selectedUnit, property.id, property.pricing.bookingMoneyPercent, contactInfo, paymentMethod, meetingDateStr, meetingTime]);

  useEffect(() => {
    if (currentStep !== 4) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishVerification();
          return 0;
        }

        const left = prev - 1;
        if (left > 40) {
          setVerificationLog("Verifying transaction details with clearing network...");
        } else if (left > 15) {
          setVerificationLog("Confirming credit transfer with Bank/MFS gateway...");
        } else {
          setVerificationLog("Finalizing flat allotment reservation & booking receipts...");
        }

        return left;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, handleFinishVerification]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;

    const dateObj = new Date(year, currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) return;

    setMeetingDateStr(dateStr);
    setMeetingTime("");
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isPast = cellDate < today;
    const isToday = cellDate.toDateString() === new Date().toDateString();
    
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;
    
    const isSelected = meetingDateStr === dateStr;

    let cellClass = "h-8 w-8 flex items-center justify-center rounded-sm text-xs font-semibold transition-all cursor-pointer ";
    if (isPast) {
      cellClass += "text-cream-300 cursor-not-allowed";
    } else if (isSelected) {
      cellClass += "bg-primary text-cream-100 font-bold";
    } else if (isToday) {
      cellClass += "border border-primary text-primary hover:bg-primary/10";
    } else {
      cellClass += "text-foreground bg-cream-100 hover:border hover:border-primary/30";
    }

    calendarCells.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isPast}
        onClick={() => handleDateSelect(day)}
        className={cellClass}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      
      {currentStep < 4 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 bg-cream-200 border border-cream-300 rounded-sm mb-8 sm:mb-12 shadow-xs text-center sm:text-left">
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold text-foreground uppercase tracking-wider block">
              {property.name} Reservation
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-cream-500">
            <span className={currentStep === 1 ? "text-primary" : ""}>01 Unit</span>
            <span>&rarr;</span>
            <span className={currentStep === 2 ? "text-primary" : ""}>02 Payment</span>
            <span>&rarr;</span>
            <span className={currentStep === 3 ? "text-primary" : ""}>03 Details</span>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Select Your Apartment</h2>
            <p className="text-cream-500 text-sm font-light">Pick an available layout configuration to initiate reservation papers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.units.map((unit) => (
              <div
                key={unit.id}
                onClick={() => unit.available && setSelectedUnit(unit)}
                className={`p-6 border rounded-sm transition-all relative flex flex-col justify-between shadow-xs ${
                  !unit.available 
                    ? "border-cream-300 bg-cream-100/50 opacity-40 cursor-not-allowed" 
                    : selectedUnit?.id === unit.id
                      ? "border-primary bg-primary/5 cursor-pointer"
                      : "border-cream-300 bg-cream-200 hover:border-cream-450 cursor-pointer"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-foreground text-lg">Unit {unit.unitNumber}</span>
                    <span className="text-xs text-cream-500">{unit.floor}th Floor</span>
                  </div>
                  
                  <div className="text-xs text-cream-500 flex flex-col gap-1.5 mb-6">
                    <p>Dimensions: <span className="text-foreground font-semibold">{unit.sizeSqft} sft</span></p>
                    <p>Rooms: <span className="text-foreground font-semibold">{unit.bedroom} Bedroom / {unit.bathroom} Bathroom</span></p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-cream-300/80 pt-4 mt-auto">
                  <div>
                    <p className="text-[10px] text-cream-500 uppercase tracking-widest font-bold">Total Price</p>
                    <p className="text-foreground font-serif text-lg font-bold">{formatBDTWord(unit.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-cream-500 uppercase tracking-widest font-bold text-right font-semibold">Reservation Token ({property.pricing.bookingMoneyPercent}%)</p>
                    <p className="text-primary text-base font-bold text-right">
                      {formatBDTWord(unit.totalPrice * (property.pricing.bookingMoneyPercent / 100))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedUnit && (
            <button
              onClick={() => setCurrentStep(2)}
              type="button"
              className="w-full md:w-auto self-end px-8 py-4 bg-primary hover:bg-terracotta-600 text-cream-100 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
            >
              Configure Reservation Payment
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}

      {currentStep === 2 && selectedUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-cream-200 border border-cream-300 p-6 rounded-sm shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Simulated Reservation Payment</h2>
              
              {/* Payment tabs */}
              <div className="flex border-b border-cream-300 mb-6 w-full">
                <button
                  onClick={() => setPaymentMethod("bank")}
                  type="button"
                  className={`w-1/2 py-3 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === "bank" ? "border-primary text-primary" : "border-transparent text-cream-500 hover:text-foreground"
                  }`}
                >
                  <CreditCard size={13} className="flex-shrink-0" />
                  <span>Bank <span className="hidden sm:inline">Wire</span> Transfer</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("mfs")}
                  type="button"
                  className={`w-1/2 py-3 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === "mfs" ? "border-primary text-primary" : "border-transparent text-cream-500 hover:text-foreground"
                  }`}
                >
                  <Smartphone size={13} className="flex-shrink-0" />
                  <span>Mobile <span className="hidden sm:inline">Banking</span> (MFS)</span>
                </button>
              </div>

              <div className="p-4 bg-terracotta-50 border border-terracotta-200 rounded-sm text-xs text-terracotta-700 flex items-start gap-2.5 mb-6">
                <ShieldAlert className="text-primary flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold">Simulated Sandbox Environment</p>
                  <p className="mt-0.5 font-light opacity-90 leading-relaxed">
                    This transaction is fully simulated for testing and demonstration purposes. Do NOT input actual bank details or credit card accounts.
                  </p>
                </div>
              </div>

              {paymentMethod === "bank" ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-background p-5 border border-cream-300 rounded-sm">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-3">Merchant Bank Account</span>
                    <div className="grid grid-cols-2 gap-4 text-xs text-cream-500">
                      <div>
                        <span className="text-cream-500 block mb-0.5">Account Name</span>
                        <span className="text-foreground font-semibold">Banglow Real Estate Ltd.</span>
                      </div>
                      <div>
                        <span className="text-cream-500 block mb-0.5">Account Number</span>
                        <span className="text-foreground font-semibold font-mono">0125-9612-4242</span>
                      </div>
                      <div>
                        <span className="text-cream-500 block mb-0.5">Bank Name</span>
                        <span className="text-foreground font-semibold">The City Bank Ltd.</span>
                      </div>
                      <div>
                        <span className="text-cream-500 block mb-0.5">Branch Location</span>
                        <span className="text-foreground font-semibold">Gulshan 1 Branch, Dhaka</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream-500 font-bold mb-2">
                      Transaction reference / ID (Type anything to test)
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. TXN987654321"
                      className="w-full bg-background border border-cream-300 text-foreground text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-background p-5 border border-cream-300 rounded-sm">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-3">bKash / Nagad Wallet Account</span>
                    <div className="text-xs">
                      <span className="text-cream-500 block mb-0.5">Merchant Wallet Number</span>
                      <span className="text-foreground text-lg font-bold tracking-wider font-mono">+880 1796-124242</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream-500 font-bold mb-2">
                      MFS Transaction ID (Type anything to test)
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. bK719A2BC3"
                      className="w-full bg-background border border-cream-300 text-foreground text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 bg-cream-200 border border-cream-300 p-6 rounded-sm flex flex-col justify-between min-h-[380px] shadow-sm">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground border-b border-cream-300 pb-3 mb-6 uppercase tracking-wider">
                Booking Cost sheet
              </h3>

              <div className="flex flex-col gap-4 text-xs text-cream-500 mb-8">
                <div className="flex justify-between border-b border-cream-300/60 pb-2">
                  <span>Selected Unit:</span>
                  <span className="text-foreground font-bold">{selectedUnit.unitNumber}</span>
                </div>
                <div className="flex justify-between border-b border-cream-300/60 pb-2">
                  <span>Total Unit Price:</span>
                  <span className="text-foreground font-bold">{formatBDT(selectedUnit.totalPrice)}</span>
                </div>
                <div className="flex justify-between border-b border-cream-300/60 pb-2">
                  <span>Reservation Money due ({property.pricing.bookingMoneyPercent}%):</span>
                  <span className="text-primary font-bold text-sm">
                    {formatBDT(selectedUnit.totalPrice * (property.pricing.bookingMoneyPercent / 100))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Installment Balance:</span>
                  <span className="text-foreground font-semibold">
                    {formatBDT(selectedUnit.totalPrice * (1 - property.pricing.bookingMoneyPercent / 100))}
                  </span>
                </div>
                <p className="text-[10px] text-cream-500 font-light leading-relaxed mt-2 italic">
                  * Remaining balance payable in structured quarterly installments through the building construction window.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-3.5 border border-cream-300 text-cream-500 hover:text-foreground bg-background text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!transactionRef}
                onClick={() => setCurrentStep(3)}
                className="w-2/3 py-3.5 bg-primary hover:bg-terracotta-600 disabled:bg-cream-100 disabled:text-cream-500 disabled:border-cream-300 disabled:cursor-not-allowed text-cream-100 font-bold uppercase tracking-widest text-xs border border-transparent rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                Proceed <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      )}

      {currentStep === 3 && selectedUnit && (
        <div className="bg-cream-200 border border-cream-300 p-8 rounded-sm max-w-2xl mx-auto shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6 border-b border-cream-300 pb-4">
            Reservation Profiles & Meeting Set
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-6 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-primary font-bold border-b border-cream-300 pb-1.5 mb-2">
                Allotment Owner Details
              </h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="Owner's full name"
                  className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="owner@domain.com"
                  className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-primary font-bold border-b border-cream-300 pb-1.5 mb-2">
                Allotment Meeting slot
              </h3>

              {/* Month Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-foreground">
                <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
              </div>

              <div className="p-3 bg-background border border-cream-300 rounded-sm">
                <div className="grid grid-cols-7 gap-1 text-center text-[8px] text-cream-500 font-bold mb-1">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells}
                </div>
              </div>

              {/* Time slot picker - premium selectable chips grid */}
              {meetingDateStr && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-cream-550 font-bold mb-2">Available Hour</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.slice(0, 6).map(time => {
                      const isSelected = meetingTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setMeetingTime(time)}
                          className={`py-2 text-center text-xs font-semibold rounded-sm border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary border-primary text-cream-100 font-bold shadow-xs"
                              : "bg-background border-cream-300 text-foreground hover:border-primary/40"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-4 border-t border-cream-300">
            <button
              onClick={() => setCurrentStep(2)}
              type="button"
              className="w-full sm:w-1/3 py-3 border border-cream-300 text-cream-500 hover:text-foreground bg-background text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || !meetingDateStr || !meetingTime}
              onClick={() => setCurrentStep(4)}
              type="button"
              className="w-full sm:w-2/3 py-3 bg-primary hover:bg-terracotta-600 disabled:bg-cream-100 disabled:text-cream-500 disabled:border-cream-300 disabled:cursor-not-allowed text-cream-100 font-bold uppercase tracking-widest text-xs border border-transparent rounded-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Confirm Allotment Payment
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-cream-200 border border-cream-300 p-12 rounded-sm max-w-md mx-auto text-center flex flex-col items-center justify-center shadow-sm">
          <div className="relative w-36 h-36 flex items-center justify-center mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#e4dcd0"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#b5623a"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * (60 - secondsLeft)) / 60}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <Clock className="text-primary animate-pulse mb-1" size={24} />
              <span className="font-serif text-3xl font-bold text-foreground">{secondsLeft}s</span>
              <span className="text-[9px] uppercase tracking-widest text-cream-500">Remaining</span>
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold text-foreground mb-2">Simulated Bank Verification</h2>
          <p className="text-xs text-cream-500 max-w-xs leading-relaxed mb-6 font-light">
            We are verifying your simulated transaction reference codes and securing the unit allotment reservation. Please do not close this window.
          </p>

          <div className="w-full bg-background border border-cream-300 p-4 rounded-sm text-[10px] text-primary font-mono tracking-wide text-center">
            {verificationLog}
          </div>
        </div>
      )}

      {currentStep === 5 && createdBooking && (
        <div className="max-w-2xl mx-auto bg-cream-200 border border-cream-300 p-8 rounded-sm text-center relative overflow-hidden shadow-sm">
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <CheckCircle className="text-primary mx-auto mb-6" size={64} />
          
          <span className="text-xs uppercase tracking-widest text-primary font-bold mb-2 block">
            Allotment Reserved
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Congratulations
          </h2>
          <p className="text-cream-500 text-sm font-light leading-relaxed max-w-md mx-auto mb-8">
            Your booking money has been logged. Unit {createdBooking.unitId.replace(`${property.slug}-`, "").toUpperCase()} is officially reserved under your profile. A receipt and allotment agreement has been compiled below.
          </p>

          {/* Preview receipt (HTML style) */}
          <div className="bg-background border border-cream-300 p-6 rounded-sm text-left text-xs text-cream-500 mb-8 max-w-lg mx-auto flex flex-col gap-3 shadow-xs">
            <div className="flex justify-between border-b border-cream-300 pb-2.5">
              <span className="font-bold text-foreground uppercase tracking-wider text-xs">Receipt Preview</span>
              <span className="text-primary font-bold">{createdBooking.invoiceId}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b border-cream-300/60 pb-2">
              <div>
                <span className="text-cream-500 block mb-0.5">Purchaser</span>
                <span className="text-foreground font-semibold">{createdBooking.name}</span>
              </div>
              <div>
                <span className="text-cream-500 block mb-0.5">Contact Phone</span>
                <span className="text-foreground font-semibold">{createdBooking.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-cream-300/60 pb-2">
              <div>
                <span className="text-cream-500 block mb-0.5">Signature Property</span>
                <span className="text-foreground font-semibold">{property.name}</span>
              </div>
              <div>
                <span className="text-cream-500 block mb-0.5">Allocated Flat</span>
                <span className="text-foreground font-semibold">Apartment {createdBooking.unitId.replace(`${property.slug}-`, "").toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-cream-300/60 pb-2">
              <div>
                <span className="text-cream-500 block mb-0.5">Unit Price</span>
                <span className="text-foreground font-semibold">{formatBDTWord(createdBooking.totalUnitPrice)}</span>
              </div>
              <div>
                <span className="text-cream-500 block mb-0.5">Amount Paid</span>
                <span className="text-primary font-bold">{formatBDTWord(createdBooking.bookingMoneyPaid)}</span>
              </div>
              <div>
                <span className="text-cream-500 block mb-0.5">Balance Due</span>
                <span className="text-foreground font-semibold">{formatBDTWord(createdBooking.remainingBalance)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-cream-500 block mb-0.5">Meeting Schedule</span>
                <span className="text-foreground font-semibold">{createdBooking.meetingDate} @ {createdBooking.meetingTime}</span>
              </div>
              <div>
                <span className="text-cream-500 block mb-0.5">Tracker Serial</span>
                <span className="text-foreground font-semibold font-mono">{createdBooking.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            {/* Dynamic PDF Download */}
            <PDFDownloadLink
              document={<InvoiceDocument booking={createdBooking} property={property} />}
              fileName={`invoice-${createdBooking.invoiceId}.pdf`}
              className="w-full sm:w-1/2 py-3.5 bg-primary hover:bg-terracotta-600 text-cream-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {({ loading }) => (
                <>
                  <Download size={14} />
                  {loading ? "Generating..." : "Download PDF Receipt"}
                </>
              )}
            </PDFDownloadLink>

            <Link
              href="/track"
              className="w-full sm:w-1/2 py-3.5 border border-cream-300 hover:border-primary/50 text-foreground bg-background hover:bg-cream-200/50 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Track Construction Status <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = use(params);

  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background">
        <Suspense fallback={
          <div className="text-center py-20">
            <span className="font-serif text-lg text-primary animate-pulse font-bold">Initializing Reservation checkout...</span>
          </div>
        }>
          <CheckoutContent slug={slug} />
        </Suspense>
      </main>
    </>
  );
}
