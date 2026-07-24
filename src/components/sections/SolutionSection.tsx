"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Camera, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

const Pillar3DCanvas = dynamic(() => import("@/src/components/Pillar3DCanvas"), {
  ssr: false,
  loading: () => <div className="w-20 h-20 rounded-2xl bg-surface-2/40 animate-pulse shrink-0" />,
});

export default function SolutionSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pillars = [
    {
      step: "01",
      icon: Camera,
      type: "reading" as const,
      title: "Smart Stock Reading",
      subtitle: "Computer Vision Shelf Analytics",
      description:
        "The store owner simply snaps a quick shelf photo using their existing smartphone camera. StockSaathi's CV model detects individual product packaging and accurately estimates shelf volume and fullness without scanning single barcodes.",
    },
    {
      step: "02",
      icon: TrendingUp,
      type: "forecasting" as const,
      title: "Demand Forecasting",
      subtitle: "Hyper-Local Time-Series AI",
      description:
        "A time-series engine analyzes store-specific sales history and local calendar patterns. It predicts upcoming demand spikes, accounting for weekday rushes, local festivals, and seasonal shifts.",
    },
    {
      step: "03",
      icon: MessageSquare,
      type: "reordering" as const,
      title: "Auto Reorder Alerts",
      subtitle: "Proactive WhatsApp Decision Engine",
      description:
        "Before inventory reaches critical depletion, the decision engine drafts a formatted WhatsApp purchase order. A single tap sends the order straight to the store's trusted wholesaler.",
    },
  ];

  return (
    <section id="solution" className="py-12 sm:py-16 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-12">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Three Pillars • One Phone Camera
        </p>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          How StockSaathi transforms shelf photos into timely reorder messages.
        </h2>
      </div>

      <div className="space-y-8">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={pillar.step}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start py-6 hairline-b last:border-b-0"
            >
              <div className="md:col-span-3 flex items-center gap-4">
                {!isMobile ? (
                  <Pillar3DCanvas pillarType={pillar.type} />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-surface-2/60 hairline-all flex items-center justify-center shrink-0">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                )}
                <div>
                  <span className="text-3xl font-display font-extrabold text-accent/40 font-mono block">
                    {pillar.step}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">
                    Pillar {pillar.step}
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 space-y-1">
                <p className="text-xs font-mono text-accent uppercase tracking-wider">
                  {pillar.subtitle}
                </p>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                  {pillar.title}
                </h3>
              </div>

              <div className="md:col-span-5 text-text-secondary text-xs sm:text-sm leading-relaxed">
                {pillar.description}
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-8 border-t border-b border-white/5 space-y-6">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-text-secondary">
          The StockSaathi End-to-End Workflow
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div className="space-y-1 w-full">
            <span className="text-xs font-mono text-accent block">STEP 1</span>
            <p className="text-sm font-semibold text-text-primary">Shelf Photo</p>
          </div>

          <ArrowRight className="w-4 h-4 text-accent shrink-0 rotate-90 sm:rotate-0 opacity-60" />

          <div className="space-y-1 w-full">
            <span className="text-xs font-mono text-accent block">STEP 2</span>
            <p className="text-sm font-semibold text-text-primary">CV Model Reading</p>
          </div>

          <ArrowRight className="w-4 h-4 text-accent shrink-0 rotate-90 sm:rotate-0 opacity-60" />

          <div className="space-y-1 w-full">
            <span className="text-xs font-mono text-accent block">STEP 3</span>
            <p className="text-sm font-semibold text-text-primary">Forecast Engine</p>
          </div>

          <ArrowRight className="w-4 h-4 text-accent shrink-0 rotate-90 sm:rotate-0 opacity-60" />

          <div className="space-y-1 w-full">
            <span className="text-xs font-mono text-accent block">STEP 4</span>
            <p className="text-sm font-semibold text-text-primary">WhatsApp Alert</p>
          </div>
        </div>
      </div>
    </section>
  );
}