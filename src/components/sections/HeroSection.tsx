"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Camera, Sparkles, ArrowRight } from "lucide-react";
import MouseReveal from "@/src/components/MouseReveal";

// Dynamically import Hero3DCanvas with SSR disabled for clean client-side WebGL rendering
const Hero3DCanvas = dynamic(() => import("@/src/components/Hero3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl bg-surface-2/40 animate-pulse border border-white/5" />
  ),
});

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Upper Hackathon Badge */}
      <div className="flex justify-start mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2/60 hairline-all text-xs font-mono text-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>IIT Jammu I3C Summer School &apos;26 Hackathon • Team Pixel Error</span>
        </div>
      </div>

      {/* Hero Grid: Left Content, Right Dominant 3D Object Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
        
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-text-primary tracking-tight leading-[0.95]">
            AI that reads shelves, <span className="text-accent">predicts demand</span>, &amp; alerts Kiranas.
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
            Zero barcodes. Zero POS hardware. A phone camera snaps a shelf photo, computer vision estimates stock levels, and automated WhatsApp alerts trigger before items run out.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#demo"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-accent text-base font-semibold text-text-primary hover:bg-accent-hover transition-all shadow-lg shadow-accent/10"
            >
              <Camera className="w-4 h-4 text-base" />
              <span>Try Interactive Scanner</span>
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-2/60 hairline-all text-text-primary hover:bg-surface-2 transition-all"
            >
              <span>View Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
          </div>
        </div>

        {/* Right Column: Dominant 3D R3F Object (Desktop) / Static CSS Fallback (Mobile) */}
        <div className="lg:col-span-5 w-full">
          {!isMobile ? (
            /* Desktop R3F 3D Canvas Object */
            <Hero3DCanvas />
          ) : (
            /* Mobile Static Fallback Visual */
            <MouseReveal className="w-full rounded-3xl relative p-1">
              <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-surface-2/80 via-surface/40 to-base p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base/90 text-[11px] font-mono text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span>CV Model Shelf Scan</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent">96.8% Acc</span>
                </div>

                <div className="relative z-10 my-auto space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-base/60 backdrop-blur border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Maggi 70g Masala</p>
                      <p className="text-[10px] font-mono text-text-secondary">Est. Stock: 8 units</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-400">12% FULL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-base/60 backdrop-blur border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Parle-G 80g Biscuit</p>
                      <p className="text-[10px] font-mono text-text-secondary">Est. Stock: 24 units</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">35% FULL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-base/60 backdrop-blur border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Amul Milk 500ml</p>
                      <p className="text-[10px] font-mono text-text-secondary">Est. Stock: 42 pouches</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">85% FULL</span>
                  </div>
                </div>

                <div className="relative z-10 text-center text-[10px] font-mono text-text-secondary/70">
                  Kirana Inventory Intelligence
                </div>
              </div>
            </MouseReveal>
          )}
        </div>

      </div>
    </section>
  );
}
