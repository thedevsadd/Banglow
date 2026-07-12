import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Banglow | Premium Real Estate Brand, Bangladesh",
    template: "%s | Banglow Real Estate",
  },
  description: "Experience modern, luxury living in Dhaka with Banglow. Explore our premium residential apartment projects in Gulshan, Dhanmondi, Uttara, and Purbachal.",
  keywords: ["Real Estate Bangladesh", "Premium Apartments Dhaka", "Luxury Living Dhaka", "Banglow Real Estate", "Gulshan Apartments", "Dhanmondi Apartments"],
  openGraph: {
    title: "Banglow | Premium Real Estate Brand, Bangladesh",
    description: "Experience modern, luxury living in Dhaka with Banglow. Explore our premium residential apartment projects.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-950 text-dark-50 selection:bg-gold-500 selection:text-dark-950">
        {children}
      </body>
    </html>
  );
}
