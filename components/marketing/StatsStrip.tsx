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
    <section className="bg-cream-200 border-y border-cream-300 py-5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center border-r last:border-r-0 border-cream-300 last:border-none px-4"
          >
            <div className="font-poppins text-lg sm:text-xl md:text-2xl font-extrabold text-foreground mb-0.5 tracking-tight">
              <Ticker value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-cream-500 font-extrabold text-center mt-0.5 leading-none">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
