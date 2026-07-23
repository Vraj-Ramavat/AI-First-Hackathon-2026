"use client";

import { Camera, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

export default function SolutionSection() {
  const pillars = [
    {
      step: "01",
      icon: Camera,
      title: "Smart Stock Reading",
      subtitle: "Computer Vision Shelf Analytics",
      description:
        "The store owner simply snaps a quick shelf photo using their existing smartphone camera. StockSaathi's CV model detects individual product packaging and accurately estimates shelf volume and fullness without scanning single barcodes.",
    },
    {
      step: "02",
      icon: TrendingUp,
      title: "Demand Forecasting",
      subtitle: "Hyper-Local Time-Series AI",
      description:
        "A time-series engine analyzes store-specific sales history and local calendar patterns. It predicts upcoming demand spikes, accounting for weekday rushes, local festivals, and seasonal shifts.",
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Auto Reorder Alerts",
      subtitle: "Proactive WhatsApp Decision Engine",
      description:
        "Before inventory reaches critical depletion, the decision engine drafts a formatted WhatsApp purchase order. A single tap sends the order straight to the store's trusted wholesaler.",
    },
  ];

  return (
    <section id="solution" className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-24">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Three Pillars • One Phone Camera
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          How StockSaathi transforms shelf photos into timely reorder messages.
        </h2>
      </div>

      {/* 3 Solution Pillar Sequential Scroll Moments */}
      <div className="space-y-12">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={pillar.step}
              className="p-8 sm:p-12 rounded-3xl bg-surface hairline-all grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:border-accent/30 transition-all duration-300"
            >
              {/* Step Numeral */}
              <div className="md:col-span-2 flex items-center gap-4">
                <span className="text-5xl font-display font-extrabold text-accent/40 font-mono">
                  {pillar.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-base hairline-all flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-accent" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="md:col-span-4 space-y-1">
                <p className="text-xs font-mono text-accent uppercase tracking-wider">
                  {pillar.subtitle}
                </p>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                  {pillar.title}
                </h3>
              </div>

              {/* Description */}
              <div className="md:col-span-6 text-text-secondary text-sm leading-relaxed">
                {pillar.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow Diagram Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-surface-2 hairline-all">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-text-secondary mb-8">
          The StockSaathi End-to-End Workflow
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          
          <div className="flex-1 p-4 bg-base rounded-xl hairline-all w-full">
            <span className="text-xs font-mono text-accent block mb-1">STEP 1</span>
            <p className="text-sm font-semibold text-text-primary">Shelf Photo</p>
          </div>

          <ArrowRight className="w-5 h-5 text-accent shrink-0 rotate-90 sm:rotate-0" />

          <div className="flex-1 p-4 bg-base rounded-xl hairline-all w-full">
            <span className="text-xs font-mono text-accent block mb-1">STEP 2</span>
            <p className="text-sm font-semibold text-text-primary">CV Model Reading</p>
          </div>

          <ArrowRight className="w-5 h-5 text-accent shrink-0 rotate-90 sm:rotate-0" />

          <div className="flex-1 p-4 bg-base rounded-xl hairline-all w-full">
            <span className="text-xs font-mono text-accent block mb-1">STEP 3</span>
            <p className="text-sm font-semibold text-text-primary">Forecast Engine</p>
          </div>

          <ArrowRight className="w-5 h-5 text-accent shrink-0 rotate-90 sm:rotate-0" />

          <div className="flex-1 p-4 bg-base rounded-xl hairline-all w-full">
            <span className="text-xs font-mono text-accent block mb-1">STEP 4</span>
            <p className="text-sm font-semibold text-text-primary">WhatsApp Alert</p>
          </div>

        </div>
      </div>
    </section>
  );
}
