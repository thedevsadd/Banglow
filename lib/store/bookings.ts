import { getNextSerialNumber } from "./serial";
import { addDummySlot } from "./dummySlots";

export interface Booking {
  invoiceId: string;            // "INV-2026-0091"
  serialNumber: string;         // "BTI-2026-0091"
  propertyId: string;
  unitId: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: "bank" | "mfs";
  bookingMoneyPaid: number;
  totalUnitPrice: number;
  remainingBalance: number;
  meetingDate: string;          // project discussion meeting date
  meetingTime: string;          // project discussion meeting time
  status: "paid" | "verified";
  createdAt: string;
}

const STORAGE_KEY = "bti_bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveBooking(bookingData: Omit<Booking, "invoiceId" | "serialNumber" | "status" | "createdAt">): Booking {
  const invoiceId = getNextSerialNumber("INV");
  const serialNumber = getNextSerialNumber("BTI");
  
  const newBooking: Booking = {
    ...bookingData,
    invoiceId,
    serialNumber,
    status: "paid", // Initially paid, transitions to verified during demo/tracking
    createdAt: new Date().toISOString(),
  };

  const bookings = getBookings();
  bookings.push(newBooking);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    // Book the discussion slot in dummy calendar
    addDummySlot(bookingData.meetingDate, bookingData.meetingTime);
  }

  return newBooking;
}

export function getBookingBySerialOrInvoice(id: string): Booking | undefined {
  const bookings = getBookings();
  const searchId = id.trim().toLowerCase();
  return bookings.find(
    b => b.serialNumber.toLowerCase() === searchId || b.invoiceId.toLowerCase() === searchId
  );
}

export function clearBookings(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
