"use client";

import React, { useState, useEffect, Suspense, use, useCallback } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PROPERTIES, Unit } from "@/lib/data/properties";
import { getDummySlots, TIME_SLOTS } from "@/lib/store/dummySlots";
import { saveBooking, Booking } from "@/lib/store/bookings";
import { formatBDT, formatBDTWord } from "@/lib/utils/formatCurrency";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
import { 
  Building, CreditCard, DollarSign, Smartphone, CheckCircle, 
  Clock, Download, Calendar as CalendarIcon, ArrowRight, ArrowLeft, 
  MapPin, ShieldAlert, FileText, ExternalLink
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

  const [currentStep, setCurrentStep] = useState(1); // 1: Unit, 2: Payment, 3: Contact & Meet, 4: Verification, 5: Success
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "mfs">("bank");
  const [transactionRef, setTransactionRef] = useState("");
  
  // Contact & Meeting state
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [meetingDateStr, setMeetingDateStr] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Verification timer state
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [verificationLog, setVerificationLog] = useState("Verifying transaction details...");

  // Created booking reference
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Set initial unit if passed in query
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

  // Run 60-second timer in Step 4
  useEffect(() => {
    if (currentStep !== 4) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishVerification();
          return 0;
        }

        // Change logs sequentially
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

  // Calendar Helpers for Discussion meeting
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

    // Disable past dates
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

    let cellClass = "h-8 w-8 flex items-center justify-center rounded-sm text-xs font-medium transition-all cursor-pointer ";
    if (isPast) {
      cellClass += "text-dark-600 cursor-not-allowed";
    } else if (isSelected) {
      cellClass += "bg-gold-500 text-dark-950 font-bold";
    } else if (isToday) {
      cellClass += "border border-gold-500 text-gold-500 hover:bg-gold-500/10";
    } else {
      cellClass += "text-white bg-dark-900 hover:border hover:border-gold-500/30";
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
      
      {/* Step Banner (Hidden in step 4 & 5) */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between p-6 bg-dark-900 border border-dark-800 rounded-sm mb-12">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-bold text-white uppercase tracking-wider">
              {property.name} Reservation
            </span>
          </div>
          
          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-dark-400">
            <span className={currentStep === 1 ? "text-gold-500" : ""}>01 Unit</span>
            <span>&rarr;</span>
            <span className={currentStep === 2 ? "text-gold-500" : ""}>02 Payment</span>
            <span>&rarr;</span>
            <span className={currentStep === 3 ? "text-gold-500" : ""}>03 Details</span>
          </div>
        </div>
      )}

      {/* STEP 1: Unit Selection */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Select Your Apartment</h2>
            <p className="text-dark-400 text-sm font-light">Pick an available layout configuration to initiate reservation papers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.units.map((unit) => (
              <div
                key={unit.id}
                onClick={() => unit.available && setSelectedUnit(unit)}
                className={`p-6 border rounded-sm transition-all relative flex flex-col justify-between ${
                  !unit.available 
                    ? "border-dark-900 bg-dark-950/40 opacity-40 cursor-not-allowed" 
                    : selectedUnit?.id === unit.id
                      ? "border-gold-500 bg-gold-500/5 cursor-pointer"
                      : "border-dark-800 bg-dark-900 hover:border-dark-600 cursor-pointer"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-white text-lg">Unit {unit.unitNumber}</span>
                    <span className="text-xs text-dark-400">{unit.floor}th Floor</span>
                  </div>
                  
                  <div className="text-xs text-dark-300 flex flex-col gap-1.5 mb-6">
                    <p>Dimensions: <span className="text-white font-medium">{unit.sizeSqft} sft</span></p>
                    <p>Rooms: <span className="text-white font-medium">{unit.bedroom} Bedroom / {unit.bathroom} Bathroom</span></p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-dark-800/80 pt-4 mt-auto">
                  <div>
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest font-bold">Total Price</p>
                    <p className="text-white font-serif text-lg font-bold">{formatBDTWord(unit.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest font-bold text-right">Reservation Token ({property.pricing.bookingMoneyPercent}%)</p>
                    <p className="text-gold-500 text-base font-bold text-right">
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
              className="w-full md:w-auto self-end px-8 py-4 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              Configure Reservation Payment
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}

      {/* STEP 2: Payment Details */}
      {currentStep === 2 && selectedUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main payment columns */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-dark-900 border border-dark-800 p-6 rounded-sm">
              <h2 className="font-serif text-2xl font-bold text-white mb-6">Simulated Reservation Payment</h2>
              
              {/* Payment tabs */}
              <div className="flex border-b border-dark-800 mb-6">
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`w-1/2 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "bank" ? "border-gold-500 text-gold-500" : "border-transparent text-dark-400 hover:text-white"
                  }`}
                >
                  <CreditCard size={14} /> Bank Wire Transfer
                </button>
                <button
                  onClick={() => setPaymentMethod("mfs")}
                  className={`w-1/2 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "mfs" ? "border-gold-500 text-gold-500" : "border-transparent text-dark-400 hover:text-white"
                  }`}
                >
                  <Smartphone size={14} /> Mobile Financial Services (MFS)
                </button>
              </div>

              {/* Warning box */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-xs text-red-200 flex items-start gap-2.5 mb-6">
                <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold">Simulated Sandbox Environment</p>
                  <p className="mt-0.5 font-light opacity-90">
                    This transaction is fully simulated for testing and demonstration purposes. Do NOT input actual bank details or credit card accounts.
                  </p>
                </div>
              </div>

              {/* Bank Details View */}
              {paymentMethod === "bank" ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-dark-950 p-5 border border-dark-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block mb-3">Merchant Bank Account</span>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-dark-500 block mb-0.5">Account Name</span>
                        <span className="text-white font-semibold">Banglow Real Estate Ltd.</span>
                      </div>
                      <div>
                        <span className="text-dark-500 block mb-0.5">Account Number</span>
                        <span className="text-white font-semibold font-mono">0125-9612-4242</span>
                      </div>
                      <div>
                        <span className="text-dark-500 block mb-0.5">Bank Name</span>
                        <span className="text-white font-semibold">The City Bank Ltd.</span>
                      </div>
                      <div>
                        <span className="text-dark-500 block mb-0.5">Branch Location</span>
                        <span className="text-white font-semibold">Gulshan 1 Branch, Dhaka</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2">
                      Transaction reference / ID (Type anything to test)
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. TXN987654321"
                      className="w-full bg-dark-950 border border-dark-800 text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              ) : (
                /* MFS Details View */
                <div className="flex flex-col gap-4">
                  <div className="bg-dark-950 p-5 border border-dark-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block mb-3">bKash / Nagad Wallet Account</span>
                    <div className="text-xs">
                      <span className="text-dark-500 block mb-0.5">Merchant Wallet Number</span>
                      <span className="text-white font-serif text-lg font-bold tracking-wider">+880 1796-124242</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2">
                      MFS Transaction ID (Type anything to test)
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. bK719A2BC3"
                      className="w-full bg-dark-950 border border-dark-800 text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: pricing break-down */}
          <div className="lg:col-span-4 bg-dark-900 border border-dark-800 p-6 rounded-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="font-serif text-lg font-bold text-white border-b border-dark-800 pb-3 mb-6 uppercase tracking-wider">
                Booking Cost sheet
              </h3>

              <div className="flex flex-col gap-4 text-xs text-dark-300 mb-8">
                <div className="flex justify-between border-b border-dark-850 pb-2">
                  <span>Selected Unit:</span>
                  <span className="text-white font-bold">{selectedUnit.unitNumber}</span>
                </div>
                <div className="flex justify-between border-b border-dark-850 pb-2">
                  <span>Total Unit Price:</span>
                  <span className="text-white font-bold">{formatBDT(selectedUnit.totalPrice)}</span>
                </div>
                <div className="flex justify-between border-b border-dark-850 pb-2">
                  <span>Reservation Money due ({property.pricing.bookingMoneyPercent}%):</span>
                  <span className="text-gold-500 font-bold text-sm">
                    {formatBDT(selectedUnit.totalPrice * (property.pricing.bookingMoneyPercent / 100))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Installment Balance:</span>
                  <span className="text-white font-medium">
                    {formatBDT(selectedUnit.totalPrice * (1 - property.pricing.bookingMoneyPercent / 100))}
                  </span>
                </div>
                <p className="text-[10px] text-dark-500 font-light leading-relaxed mt-2 italic">
                  * Remaining balance payable in structured quarterly installments through the building construction window.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-3.5 border border-dark-800 text-dark-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!transactionRef}
                onClick={() => setCurrentStep(3)}
                className="w-2/3 py-3.5 bg-gold-500 hover:bg-gold-600 disabled:bg-dark-800 disabled:text-dark-500 disabled:cursor-not-allowed text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Proceed <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Details & Meeting scheduling */}
      {currentStep === 3 && selectedUnit && (
        <div className="bg-dark-900 border border-dark-800 p-8 rounded-sm max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-white mb-6 border-b border-dark-850 pb-4">
            Reservation Profiles & Meeting Set
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Contact details */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-bold border-b border-dark-850 pb-1.5 mb-2">
                Allotment Owner Details
              </h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="Owner's full name"
                  className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="owner@domain.com"
                  className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Discussion meeting calendar */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-bold border-b border-dark-850 pb-1.5 mb-2">
                Allotment Meeting slot
              </h3>

              {/* Month Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-white">
                <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
              </div>

              {/* Simple inline calendar */}
              <div className="p-3 bg-dark-950 border border-dark-850 rounded-sm">
                <div className="grid grid-cols-7 gap-1 text-center text-[8px] text-dark-500 font-bold mb-1">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells}
                </div>
              </div>

              {/* Time slot picker */}
              {meetingDateStr && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-1">Available Hour</label>
                  <select
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                  >
                    <option value="">Select Hour</option>
                    {TIME_SLOTS.slice(0, 5).map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-4 border-t border-dark-850">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-1/3 py-3 border border-dark-800 text-dark-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || !meetingDateStr || !meetingTime}
              onClick={() => setCurrentStep(4)}
              className="w-2/3 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-dark-800 disabled:text-dark-500 disabled:cursor-not-allowed text-dark-950 font-bold uppercase tracking-widest text-xs rounded-sm transition-colors cursor-pointer"
            >
              Confirm Allotment Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: 60-Second Simulated Verification */}
      {currentStep === 4 && (
        <div className="bg-dark-900 border border-dark-800 p-12 rounded-sm max-w-md mx-auto text-center flex flex-col items-center justify-center">
          {/* Circular Countdown Loader */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-8">
            {/* SVG circle track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#1f1f1f"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#c5a880"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * (60 - secondsLeft)) / 60}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <Clock className="text-gold-500 animate-pulse mb-1" size={24} />
              <span className="font-serif text-3xl font-bold text-white">{secondsLeft}s</span>
              <span className="text-[9px] uppercase tracking-widest text-dark-500">Remaining</span>
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold text-white mb-2">Simulated Bank Verification</h2>
          <p className="text-xs text-dark-400 max-w-xs leading-relaxed mb-6 font-light">
            We are verifying your simulated transaction reference codes and securing the unit allotment reservation. Please do not close this window.
          </p>

          {/* Running logs block */}
          <div className="w-full bg-dark-950/80 border border-dark-850 p-4 rounded-sm text-[10px] text-gold-500 font-mono tracking-wide text-center">
            {verificationLog}
          </div>
        </div>
      )}

      {/* STEP 5: Success & Invoice Download */}
      {currentStep === 5 && createdBooking && (
        <div className="max-w-2xl mx-auto bg-dark-900 border border-dark-800 p-8 rounded-sm text-center relative overflow-hidden">
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <CheckCircle className="text-gold-500 mx-auto mb-6" size={64} />
          
          <span className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-2 block">
            Allotment Reserved
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Congratulations
          </h2>
          <p className="text-dark-300 text-sm font-light leading-relaxed max-w-md mx-auto mb-8">
            Your booking money has been logged. Unit {createdBooking.unitId.replace(`${property.slug}-`, "").toUpperCase()} is officially reserved under your profile. A receipt and allotment agreement has been compiled below.
          </p>

          {/* Preview receipt (HTML style) */}
          <div className="bg-dark-950 border border-dark-800 p-6 rounded-sm text-left text-xs text-dark-300 mb-8 max-w-lg mx-auto flex flex-col gap-3">
            <div className="flex justify-between border-b border-dark-800 pb-2.5">
              <span className="font-bold text-white uppercase tracking-wider text-xs">Receipt Preview</span>
              <span className="text-gold-500 font-bold">{createdBooking.invoiceId}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b border-dark-850 pb-2">
              <div>
                <span className="text-dark-500 block mb-0.5">Purchaser</span>
                <span className="text-white font-medium">{createdBooking.name}</span>
              </div>
              <div>
                <span className="text-dark-500 block mb-0.5">Contact Phone</span>
                <span className="text-white font-medium">{createdBooking.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-dark-850 pb-2">
              <div>
                <span className="text-dark-500 block mb-0.5">Signature Property</span>
                <span className="text-white font-medium">{property.name}</span>
              </div>
              <div>
                <span className="text-dark-500 block mb-0.5">Allocated Flat</span>
                <span className="text-white font-medium">Apartment {createdBooking.unitId.replace(`${property.slug}-`, "").toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-dark-850 pb-2">
              <div>
                <span className="text-dark-500 block mb-0.5">Unit Price</span>
                <span className="text-white font-medium">{formatBDTWord(createdBooking.totalUnitPrice)}</span>
              </div>
              <div>
                <span className="text-dark-500 block mb-0.5">Amount Paid</span>
                <span className="text-gold-500 font-bold">{formatBDTWord(createdBooking.bookingMoneyPaid)}</span>
              </div>
              <div>
                <span className="text-dark-500 block mb-0.5">Balance Due</span>
                <span className="text-white font-medium">{formatBDTWord(createdBooking.remainingBalance)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-500 block mb-0.5">Meeting Schedule</span>
                <span className="text-white font-medium">{createdBooking.meetingDate} @ {createdBooking.meetingTime}</span>
              </div>
              <div>
                <span className="text-dark-500 block mb-0.5">Tracker Serial</span>
                <span className="text-white font-medium font-mono">{createdBooking.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            {/* Dynamic PDF Download */}
            <PDFDownloadLink
              document={<InvoiceDocument booking={createdBooking} property={property} />}
              fileName={`invoice-${createdBooking.invoiceId}.pdf`}
              className="w-full sm:w-1/2 py-3.5 bg-gold-500 hover:bg-gold-600 text-dark-950 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Download PDF Receipt
            </PDFDownloadLink>

            <Link
              href="/track"
              className="w-full sm:w-1/2 py-3.5 border border-dark-800 hover:border-gold-500/50 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
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
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-dark-950">
        <Suspense fallback={
          <div className="text-center py-20">
            <span className="font-serif text-lg text-gold-500 animate-pulse font-bold">Initializing Reservation checkout...</span>
          </div>
        }>
          <CheckoutContent slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
