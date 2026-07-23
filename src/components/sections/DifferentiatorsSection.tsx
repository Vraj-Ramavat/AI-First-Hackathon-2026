"use client";

import { Smartphone, ShieldCheck, Cpu } from "lucide-react";

export default function DifferentiatorsSection() {
  const differentiators = [
    {
      icon: Smartphone,
      title: "Zero POS & Scanner Hardware",
      description:
        "Enterprise solutions demand ₹50,000+ POS terminals and handheld barcode guns. StockSaathi requires only the smartphone already in the store owner's pocket.",
    },
    {
      icon: ShieldCheck,
      title: "Built & Priced for Kirana Scale",
      description:
        "Designed specifically for single-owner retail shops with zero technical complexity, minimal touchpoints, and ultra-affordable Kirana-friendly pricing.",
    },
    {
      icon: Cpu,
      title: "Adaptive Store Demand Learning",
      description:
        "Unlike fixed reorder rules, our engine learns each individual store's unique demand shifts—detecting weekday evening surges, festival demand, and neighborhood habits.",
    },
  ];

  return (
    <section className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Why StockSaathi Stands Apart
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Engineered for Kirana reality, not enterprise boardrooms.
        </h2>
      </div>

      {/* Floating Differentiators (No Box Containers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
        {differentiators.map((diff, index) => {
          const IconComp = diff.icon;
          return (
            <div
              key={index}
              className="space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <IconComp className="w-6 h-6 text-accent" />
                <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                  {diff.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {diff.description}
                </p>
              </div>

              <div className="pt-4 text-xs font-mono text-accent">
                Kirana First Advantage
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
