"use client";

import { CheckCircle2, Clock, Milestone, Radio } from "lucide-react";

export default function RoadmapSection() {
  const milestones = [
    {
      phase: "Phase 1 • Now",
      status: "CURRENT MVP",
      statusColor: "text-accent border-accent/40 bg-accent/10",
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
      phase: "Phase 2 • Next 3 Months",
      status: "IN PLANNING",
      statusColor: "text-text-primary border-white/20 bg-surface-2",
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
      phase: "Phase 3 • 6-12 Months",
      status: "FUTURE VISION",
      statusColor: "text-text-secondary border-white/10 bg-base",
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
    <section id="roadmap" className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Hackathon &amp; Execution Roadmap
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          From hackathon prototype to 500+ Kirana store deployments.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          A disciplined three-phase deployment plan designed to validate CV accuracy on real shelves before expanding to multilingual voice input.
        </p>
      </div>

      {/* 3-Stage Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {milestones.map((milestone, idx) => {
          const IconComp = milestone.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-surface hairline-all space-y-6 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-accent">
                    {milestone.phase}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${milestone.statusColor}`}
                  >
                    {milestone.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <IconComp className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-display font-bold text-text-primary">
                    {milestone.title}
                  </h3>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Deliverables checklist */}
              <div className="pt-6 border-t border-white/5 space-y-2">
                <p className="text-[11px] font-mono text-text-secondary uppercase tracking-wider">
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

      <div className="p-6 rounded-2xl bg-surface-2 hairline-all flex items-center gap-4 text-xs text-text-secondary font-mono justify-center">
        <Milestone className="w-4 h-4 text-accent shrink-0" />
        <span>Summer School &apos;26 AI First Hackathon • Team Pixel Error Roadmap</span>
      </div>
    </section>
  );
}
