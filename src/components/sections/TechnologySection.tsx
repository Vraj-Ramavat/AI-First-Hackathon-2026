"use client";

import { Eye, Activity, BellRing, Cloud } from "lucide-react";

export default function TechnologySection() {
  const techLayers = [
    {
      layer: "01",
      icon: Eye,
      title: "Computer Vision & Visual Model Layer",
      description:
        "Extracts stock level estimates directly from Kirana shelf photos using object detection and bounding box visual density estimation. Handles variable store lighting, overlapping packaging, and loose stacking.",
    },
    {
      layer: "02",
      icon: Activity,
      title: "Demand Forecasting & Time-Series Engine",
      description:
        "Analyzes historical sales logs and local consumption patterns using time-series models to predict item stockouts hours before they occur, accounting for weekend rushes and regional shopping trends.",
    },
    {
      layer: "03",
      icon: BellRing,
      title: "Automation & WhatsApp Alert Engine",
      description:
        "Processes inventory threshold triggers and dynamically builds formatted purchase order drafts sent directly via WhatsApp business messaging APIs to local FMCG distributors.",
    },
    {
      layer: "04",
      icon: Cloud,
      title: "Dashboard & Local Hackathon Stack",
      description:
        "Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Recharts. Currently running as a high-performance local hackathon prototype, ready for AWS cloud deployment during store pilots.",
    },
  ];

  return (
    <section id="technology" className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Technology Architecture
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          A four-layer intelligence stack built for speed &amp; reliability.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Abstracted for simple Kirana store operation, powered by robust computer vision models, time-series forecasting, and automated messaging infrastructure.
        </p>
      </div>

      {/* 4 Architectural Layers (Floating Content, Hairline Separator) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
        {techLayers.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.layer}
              className="space-y-6 flex flex-col justify-between py-6 hairline-b"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <IconComp className="w-6 h-6 text-accent" />
                  <span className="font-mono text-xs text-accent/60 font-bold">
                    LAYER {item.layer}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
