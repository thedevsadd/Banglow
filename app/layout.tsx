import type { Metadata } from "next";
import { Inter, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Banglow | Premium Real Estate Brand, Bangladesh",
    template: "%s | Banglow Real Estate",
  },
  description: "Experience soft, warm, premium luxury living in Dhaka with Banglow. Explore our signature residential projects in Gulshan, Dhanmondi, Uttara, and Purbachal.",
  keywords: ["Real Estate Bangladesh", "Premium Apartments Dhaka", "Luxury Living Dhaka", "Banglow Real Estate", "Gulshan Apartments", "Dhanmondi Apartments"],
  openGraph: {
    title: "Banglow | Premium Real Estate Brand, Bangladesh",
    description: "Experience modern, luxury living in Dhaka with Banglow. Explore our premium residential apartment projects.",
    type: "website",
    locale: "en_BD",
  },
  icons: {
    icon: "/favicon.png",
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
      className={`${inter.variable} ${fraunces.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent">
        <Header />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
