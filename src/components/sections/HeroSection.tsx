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
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center pt-24 sm:pt-28 pb-16 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Upper Hackathon Badge */}
      <div className="flex justify-start mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2/60 hairline-all text-xs font-mono text-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>IIT Jammu I3C Summer School &apos;26 Hackathon • Team Pixel Error</span>
        </div>
      </div>

      {/* Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16">
        
        {/* Left Column: Headlines, Mobile 3D Card & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-text-primary tracking-tight leading-[1.0] mt-2">
            AI that reads shelves, <span className="text-accent">predicts demand</span>, &amp; alerts Kiranas.
          </h1>
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
            Zero barcodes. Zero POS hardware. A phone camera snaps a shelf photo, computer vision estimates stock levels, and automated WhatsApp alerts trigger before items run out.
          </p>

          {/* Mobile 3D Canvas Showcase (Visible only on mobile lg:hidden) */}
          <div className="block lg:hidden w-full my-4">
            <Hero3DCanvas />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#demo"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-accent text-base font-semibold text-text-primary hover:bg-accent-hover transition-all shadow-lg shadow-accent/10 active:scale-95"
            >
              <Camera className="w-4 h-4 text-base" />
              <span>Try Interactive Scanner</span>
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-2/60 hairline-all text-text-primary hover:bg-surface-2 transition-all active:scale-95"
            >
              <span>View Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
          </div>
        </div>

        {/* Right Column: Dominant 3D Canvas (Visible on desktop lg:block) */}
        <div className="hidden lg:block lg:col-span-5 w-full">
          <Hero3DCanvas />
        </div>

      </div>
    </section>
  );
}
