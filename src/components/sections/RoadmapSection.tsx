"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, Clock, Milestone, Radio } from "lucide-react";

const Roadmap3DCanvas = dynamic(() => import("@/src/components/Roadmap3DCanvas"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 rounded-2xl bg-surface-2/40 animate-pulse shrink-0" />,
});

export default function RoadmapSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const milestones = [
    {
      stage: "now" as const,
      phase: "Phase 1 • Now",
      status: "CURRENT MVP",
      statusColor: "text-accent font-bold",
      icon: CheckCircle2,
      title: "Hackathon Prototype & Simulated Analytics",
      description:
        "Completed time-series forecasting model, MVP shelf stock reader, and automated WhatsApp alert decision engine running on simulated Kirana sales datasets.",
      deliverables: [
        "Core forecasting model working",
        "WhatsApp alert generator active",
        "Mock Kirana inventory dashboard",
      ],
    },
    {
      stage: "months3" as const,
      phase: "Phase 2 • Next 3 Months",
      status: "IN PLANNING",
      statusColor: "text-text-primary font-bold",
      icon: Clock,
      title: "Live Store Pilots & Trained Detector",
      description:
        "Deploying pilot installations across 2-3 real Kirana stores in local market networks. Replacing MVP heuristic visual reading with a custom trained object detector.",
      deliverables: [
        "2-3 Kirana store live pilots",
        "Custom FMCG packaging CV model",
        "Wholesaler API connectivity test",
      ],
    },
    {
      stage: "months12" as const,
      phase: "Phase 3 • 6-12 Months",
      status: "FUTURE VISION",
      statusColor: "text-text-secondary font-bold",
      icon: Radio,
      title: "Multilingual Voice & Supplier Auto-Order",
      description:
        "Integrating multilingual voice commands (Hindi, Gujarati, Hinglish) for voice-assisted stock updates, paired with direct automated ordering into FMCG supplier ERPs.",
      deliverables: [
        "Multilingual voice input",
        "Direct FMCG distributor integration",
        "Scale across 500+ Kiranas",
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-12 sm:py-16 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-12">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Hackathon &amp; Execution Roadmap
        </p>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          From hackathon prototype to 500+ Kirana store deployments.
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
          A disciplined three-phase deployment plan designed to validate CV accuracy on real shelves before expanding to multilingual voice input.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
        {milestones.map((milestone, idx) => {
          const IconComp = milestone.icon;
          return (
            <div
              key={idx}
              className="space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-accent">
                    {milestone.phase}
                  </span>
                  <span className={`text-[10px] font-mono ${milestone.statusColor}`}>
                    {milestone.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!isMobile ? (
                    <Roadmap3DCanvas stage={milestone.stage} />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-surface-2/60 hairline-all flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary">
                    {milestone.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1.5">
                <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                  Key Targets:
                </p>
                {milestone.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-4 border-t border-white/5 flex items-center gap-3 text-xs text-text-secondary font-mono justify-center">
        <Milestone className="w-4 h-4 text-accent shrink-0" />
        <span>Summer School &apos;26 AI First Hackathon • Team Pixel Error Roadmap</span>
      </div>
    </section>
  );
}