export interface DummySlot {
  date: string; // "YYYY-MM-DD"
  time: string; // "10:00 AM" etc.
}

const STORAGE_KEY = "bti_dummy_slots";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM"
];

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getDummySlots(): DummySlot[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  // Seed data if not exists
  const seeded: DummySlot[] = [];
  const today = new Date();

  // Create some scatter booked slots over the next 30 days
  const offsets = [1, 2, 4, 7, 10, 14, 18, 22, 25, 28];
  
  offsets.forEach((daysAhead, index) => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysAhead);
    const dateStr = formatDate(targetDate);

    // Add 1 to 3 slots for each of these days
    if (index % 3 === 0) {
      seeded.push({ date: dateStr, time: "11:00 AM" });
      seeded.push({ date: dateStr, time: "02:00 PM" });
    } else if (index % 3 === 1) {
      seeded.push({ date: dateStr, time: "10:00 AM" });
      seeded.push({ date: dateStr, time: "03:00 PM" });
      seeded.push({ date: dateStr, time: "05:00 PM" });
    } else {
      seeded.push({ date: dateStr, time: "01:00 PM" });
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function addDummySlot(date: string, time: string): void {
  if (typeof window === "undefined") return;
  const current = getDummySlots();
  current.push({ date, time });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function isSlotBooked(date: string, time: string): boolean {
  const current = getDummySlots();
  return current.some(slot => slot.date === date && slot.time === time);
}

export { TIME_SLOTS };
