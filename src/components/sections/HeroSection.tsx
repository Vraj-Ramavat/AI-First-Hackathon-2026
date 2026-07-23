"use client";

import Link from "next/link";
import { Camera, Sparkles, ArrowRight } from "lucide-react";
import MouseReveal from "@/src/components/MouseReveal";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Upper Badge */}
      <div className="flex justify-start mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 hairline-all text-xs font-mono text-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>IIT Jammu I3C Summer School &apos;26 Hackathon • Track: AI for Industry</span>
        </div>
      </div>

      {/* Main Display Headline & Tagline */}
      <div className="max-w-4xl space-y-6 mb-12">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-text-primary tracking-tight leading-[0.95]">
          AI that reads shelves, <span className="text-accent">predicts demand</span>, &amp; alerts Kiranas.
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
          Zero barcodes. Zero POS hardware. A phone camera snaps a shelf photo, computer vision estimates stock levels, and automated WhatsApp alerts trigger before items run out.
        </p>

        {/* CTA Buttons */}
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface hairline-all text-text-primary hover:bg-surface-2 transition-all"
          >
            <span>View Live Dashboard</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </Link>
        </div>
      </div>

      {/* Hero Dominant Focal Point: Smartphone Kirana Shelf Scan Mockup with MouseReveal */}
      <div className="w-full mt-6">
        <MouseReveal className="w-full rounded-2xl bg-surface hairline-all p-4 sm:p-8 relative">
          <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-xl bg-base overflow-hidden flex items-center justify-center border border-white/5">
            
            {/* Mockup Kirana Shelf Visual Representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1915_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Simulated Shelves & Products */}
            <div className="relative z-10 w-full max-w-4xl px-4 grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
              
              {/* Product Card 1: Maggi */}
              <div className="relative group bg-surface-2 p-3 sm:p-4 rounded-xl hairline-all flex flex-col items-center justify-between text-center space-y-2">
                <div className="w-full h-24 sm:h-32 bg-amber-900/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-amber-500/20">
                  <span className="font-bold text-amber-200 text-xs sm:text-sm">Maggi 70g</span>
                  <div className="absolute top-2 right-2 bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    12% FULL
                  </div>
                  {/* Bounding Box Accent */}
                  <div className="absolute inset-1 border border-dashed border-red-500/50 rounded pointer-events-none" />
                </div>
                <div className="w-full text-left">
                  <p className="text-[11px] font-mono text-text-secondary">Est. Stock: 8 units</p>
                  <p className="text-[10px] text-red-400 font-mono">Stockout in 1.2 days</p>
                </div>
              </div>

              {/* Product Card 2: Parle-G */}
              <div className="relative group bg-surface-2 p-3 sm:p-4 rounded-xl hairline-all flex flex-col items-center justify-between text-center space-y-2">
                <div className="w-full h-24 sm:h-32 bg-yellow-900/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-yellow-500/20">
                  <span className="font-bold text-yellow-200 text-xs sm:text-sm">Parle-G 80g</span>
                  <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    35% FULL
                  </div>
                  <div className="absolute inset-1 border border-dashed border-amber-500/50 rounded pointer-events-none" />
                </div>
                <div className="w-full text-left">
                  <p className="text-[11px] font-mono text-text-secondary">Est. Stock: 24 units</p>
                  <p className="text-[10px] text-amber-400 font-mono">Reorder in 2 days</p>
                </div>
              </div>

              {/* Product Card 3: Amul Milk */}
              <div className="relative group bg-surface-2 p-3 sm:p-4 rounded-xl hairline-all flex flex-col items-center justify-between text-center space-y-2">
                <div className="w-full h-24 sm:h-32 bg-blue-900/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-blue-500/20">
                  <span className="font-bold text-blue-200 text-xs sm:text-sm">Amul Milk 500ml</span>
                  <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    85% FULL
                  </div>
                  <div className="absolute inset-1 border border-dashed border-emerald-500/50 rounded pointer-events-none" />
                </div>
                <div className="w-full text-left">
                  <p className="text-[11px] font-mono text-text-secondary">Est. Stock: 42 units</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Healthy Stock</p>
                </div>
              </div>

              {/* Product Card 4: Tata Salt (Hidden on mobile) */}
              <div className="hidden sm:flex relative group bg-surface-2 p-3 sm:p-4 rounded-xl hairline-all flex-col items-center justify-between text-center space-y-2">
                <div className="w-full h-24 sm:h-32 bg-gray-800/40 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-500/20">
                  <span className="font-bold text-gray-200 text-xs sm:text-sm">Tata Salt 1kg</span>
                  <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    90% FULL
                  </div>
                  <div className="absolute inset-1 border border-dashed border-emerald-500/50 rounded pointer-events-none" />
                </div>
                <div className="w-full text-left">
                  <p className="text-[11px] font-mono text-text-secondary">Est. Stock: 50 units</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Healthy Stock</p>
                </div>
              </div>

            </div>

            {/* Scanning Line Animation Overlay */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-line pointer-events-none opacity-80" />

            {/* Overlay Corner Hud Labels */}
            <div className="absolute top-4 left-4 bg-base/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>CV Model Live Analysis</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-base/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-accent">
              Hover mouse to reveal spotlight
            </div>
          </div>
        </MouseReveal>
      </div>
    </section>
  );
}
