import { getNextSerialNumber } from "./serial";
import { addDummySlot } from "./dummySlots";

export interface Meeting {
  serialNumber: string;        // "BTI-2026-0042"
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  date: string;                 // "YYYY-MM-DD"
  time: string;                 // "11:00 AM"
  status: "requested" | "confirmed" | "completed";
  createdAt: string;
}

const STORAGE_KEY = "bti_meetings";

export function getMeetings(): Meeting[] {
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

export function saveMeeting(meetingData: Omit<Meeting, "serialNumber" | "status" | "createdAt">): Meeting {
  const serialNumber = getNextSerialNumber("BTI");
  const newMeeting: Meeting = {
    ...meetingData,
    serialNumber,
    status: "requested",
    createdAt: new Date().toISOString(),
  };

  const meetings = getMeetings();
  meetings.push(newMeeting);
  
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    // Also add this to seeded booked slots so no one else can book this date/time during the demo session
    addDummySlot(meetingData.date, meetingData.time);
  }

  return newMeeting;
}

export function getMeetingBySerial(serial: string): Meeting | undefined {
  const meetings = getMeetings();
  return meetings.find(m => m.serialNumber.toLowerCase() === serial.trim().toLowerCase());
}

export function clearMeetings(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
