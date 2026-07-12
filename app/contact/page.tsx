"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    if (typeof window !== "undefined") {
      const contactLeads = localStorage.getItem("bti_contact_leads") 
        ? JSON.parse(localStorage.getItem("bti_contact_leads")!) 
        : [];
      contactLeads.push({
        ...form,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("bti_contact_leads", JSON.stringify(contactLeads));
    }

    setSubmitted(true);
  };

  return (
    <>
      <main className="flex-grow pt-32 pb-24 bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Page Title */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3 block">
              Connect With Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-cream-500 text-sm font-light leading-relaxed">
              Have questions regarding specific flat customization options, booking pricing sheets, or structural inspection logs? Reach out to our relationship directors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
            
            {/* Info Cards Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-cream-200 border border-cream-300 p-8 rounded-sm shadow-sm">
                <h3 className="font-serif text-xl font-bold text-foreground mb-6 uppercase tracking-wider border-b border-cream-300 pb-3">
                  Concierge Desk
                </h3>
                
                <ul className="flex flex-col gap-6 text-sm text-cream-500">
                  <li className="flex items-start gap-4">
                    <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold block mb-0.5">Corporate Headquarters</span>
                      <span className="text-foreground font-semibold">Banglow Tower, Plot 8B, Road 44, Gulshan 1, Dhaka 1212, Bangladesh</span>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <Phone size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold block mb-0.5">Hotline lines</span>
                      <span className="text-foreground font-semibold">+880 9612-BANGLOW</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <Mail size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-cream-500 uppercase tracking-widest font-bold block mb-0.5">Email Support</span>
                      <span className="text-foreground font-semibold">concierge@banglow.com.bd</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* OSM Office map box */}
              <div className="h-48 border border-cream-300 rounded-sm overflow-hidden bg-cream-200 flex items-center justify-center p-6 text-center relative shadow-sm">
                <iframe
                  title="OSM Office map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.405%2C23.785%2C90.420%2C23.800&layer=mapnik&marker=23.7915%2C90.4132"
                  className="absolute inset-0 w-full h-full opacity-90"
                  style={{ border: 0 }}
                  loading="lazy"
                />
                <div className="relative bg-cream-100/90 backdrop-blur-md p-4 rounded-sm border border-cream-300 pointer-events-none shadow-md">
                  <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Office Map</span>
                  <p className="text-[11px] text-foreground font-bold mt-1">Gulshan 1, Dhaka</p>
                </div>
              </div>
            </div>

            {/* Message form Column */}
            <div className="lg:col-span-7 bg-cream-200 border border-cream-300 p-8 rounded-sm shadow-sm">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6 uppercase tracking-wider border-b border-cream-300 pb-3">
                Send Direct Message
              </h3>

              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center justify-center">
                  <CheckCircle size={48} className="text-primary mb-4" />
                  <h4 className="font-serif text-lg font-bold text-foreground mb-2">Message Dispatched</h4>
                  <p className="text-xs text-cream-500 max-w-xs leading-relaxed font-light">
                    Your inquiry has been stored. A relationship advisor will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2 border border-cream-300 text-foreground bg-background hover:bg-cream-200/50 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-cream-500 font-semibold mb-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your inquiry here..."
                      className="w-full bg-background border border-cream-300 text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-terracotta-600 text-cream-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send size={12} /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>
    </>
  );
}
