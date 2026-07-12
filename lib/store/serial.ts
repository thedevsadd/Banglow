export function getNextSerialNumber(prefix: "BTI" | "INV"): string {
  if (typeof window === "undefined") {
    return `${prefix}-2026-0000`;
  }

  const COUNTER_KEY = "bti_serial_counter";
  const currentCounterStr = localStorage.getItem(COUNTER_KEY);
  let nextCounter = 1;

  if (currentCounterStr) {
    const val = parseInt(currentCounterStr, 10);
    if (!isNaN(val)) {
      nextCounter = val + 1;
    }
  }

  localStorage.setItem(COUNTER_KEY, nextCounter.toString());
  
  const padded = nextCounter.toString().padStart(4, "0");
  const year = new Date().getFullYear();
  
  return `${prefix}-${year}-${padded}`;
}
