/**
 * Formats a number to Bangladeshi Taka (BDT) with traditional formatting (comma-separated).
 * Traditional formatting: ৳XX,XX,XXX (3 digits at end, then groups of 2)
 */
export function formatBDT(amount: number): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR", // INR shares the same Lakh/Crore punctuation pattern
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  // Replace rupee symbol with BDT symbol (৳)
  return formatter.format(amount).replace("₹", "৳").replace("INR", "৳").trim();
}

/**
 * Formats a number into Crore/Lakh words for display
 * Example: 24500000 -> "৳2.45 Crore"
 * Example: 750000 -> "৳7.5 Lakh"
 */
export function formatBDTWord(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    // Format to 2 decimal places if there is a fraction, otherwise whole number
    const formatted = Number(crore.toFixed(2));
    return `৳${formatted} Crore`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = Number(lakh.toFixed(2));
    return `৳${formatted} Lakh`;
  }
  return formatBDT(amount);
}
