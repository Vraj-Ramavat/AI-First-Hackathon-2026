"use client";

import { Code2, Layout, Database, Award } from "lucide-react";

export default function TeamSection() {
  const members = [
    {
      name: "Prathamesh Naik",
      role: "Backend Architect",
      focus: "Computer Vision & Forecasting Models",
      icon: Code2,
      bio: "Leads CV model training, time-series demand forecasting algorithm integration, and backend API design.",
    },
    {
      name: "Vraj Ramavat",
      role: "Frontend Engineer",
      focus: "Design System & UI/UX",
      icon: Layout,
      bio: "Crafts the modern single-accent interface, interactive scanner simulation, and Kirana dashboard application.",
    },
    {
      name: "Heli Gupta",
      role: "Database Engineer",
      focus: "Data Pipelines & Kirana Schemas",
      icon: Database,
      bio: "Architects high-performance sales history databases, product SKU catalogs, and alert queue state management.",
    },
  ];

  return (
    <section id="team" className="py-10 sm:py-12 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Built by Team Pixel Error
        </p>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          Adani University engineers building for Indian Kiranas.
        </h2>
        <p className="text-text-primary text-xs sm:text-sm leading-relaxed">
          Developed for Summer School &apos;26 AI First Hackathon (IIT Jammu I3C) in the AI for Industry, Business &amp; Productivity track.
        </p>
      </div>

      {/* Team Cards (White Bio & Focus Text) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {members.map((member, idx) => {
          const IconComp = member.icon;
          return (
            <div
              key={idx}
              className="space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <IconComp className="w-5 h-5 text-accent" />

                <div>
                  <h3 className="text-xl font-display font-bold text-text-primary">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-accent uppercase tracking-wider mt-0.5">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs font-mono text-text-primary">
                Focus: {member.focus}
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing Banner */}
      <div className="py-8 hairline-t text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/60 text-xs font-mono text-accent">
          <Award className="w-3.5 h-3.5 text-accent" />
          <span>IIT Jammu I3C Summer School &apos;26 AI First Hackathon</span>
        </div>
        
        <h3 className="text-xl sm:text-3xl font-display font-bold text-text-primary max-w-2xl mx-auto">
          Ready to empower 13 million Kirana shopkeepers with camera AI?
        </h3>

        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <a
            href="#demo"
            className="px-5 py-2.5 rounded-full bg-accent text-base text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors"
          >
            Run Scanner Demo
          </a>
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-surface-2/60 hairline-all text-text-primary text-xs font-mono uppercase tracking-wider font-medium hover:bg-surface-2 transition-colors"
          >
            Launch Dashboard
          </a>
        </div>
      </div>
    </section>
  );
}