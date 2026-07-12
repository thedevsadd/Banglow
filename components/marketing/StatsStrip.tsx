"use client";

import React, { useState, useEffect, useRef } from "react";

interface TickerProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function Ticker({ value, suffix = "", duration = 2000 }: TickerProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const start = 0;
    const end = value;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    // Safety check for very small stepTimes (e.g. 0)
    const minStepTime = Math.max(stepTime, 16); // cap at ~60fps
    const stepAmount = Math.max(Math.floor(range / (duration / minStepTime)), 1);

    const timer = setInterval(() => {
      current += stepAmount * increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, minStepTime);

    return () => clearInterval(timer);
  }, [hasAnimated, value, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsStrip() {
  const stats = [
    { value: 2400000, suffix: " sqft", label: "Premium Space Delivered" },
    { value: 48, suffix: "+", label: "Completed Landmarks" },
    { value: 26, suffix: "+", label: "Years of Trust" },
    { value: 1200, suffix: "+", label: "Affluent Families Housed" },
  ];

  return (
    <section className="bg-dark-900 border-y border-dark-800 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center border-r last:border-r-0 border-dark-800 last:border-none px-4"
          >
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gold-500 mb-1">
              <Ticker value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs uppercase tracking-widest text-dark-400 font-semibold text-center mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
