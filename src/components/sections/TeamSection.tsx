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
      focus: "Hubtown Visual System & UI/UX",
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
    <section id="team" className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Built by Team Pixel Error
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Adani University engineers building for Indian Kiranas.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Developed for Summer School &apos;26 AI First Hackathon (IIT Jammu I3C) in the AI for Industry, Business &amp; Productivity track.
        </p>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, idx) => {
          const IconComp = member.icon;
          return (
            <div
              key={idx}
              className="p-8 sm:p-10 rounded-3xl bg-surface hairline-all space-y-6 flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-base hairline-all flex items-center justify-center">
                  <IconComp className="w-6 h-6 text-accent" />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold text-text-primary">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-accent uppercase tracking-wider mt-1">
                    {member.role}
                  </p>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs font-mono text-text-secondary">
                Focus: {member.focus}
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing CTA Box */}
      <div className="p-10 sm:p-14 rounded-3xl bg-surface-2 hairline-all text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base hairline-all text-xs font-mono text-accent">
          <Award className="w-3.5 h-3.5 text-accent" />
          <span>IIT Jammu I3C Summer School &apos;26 AI First Hackathon</span>
        </div>
        
        <h3 className="text-2xl sm:text-4xl font-display font-bold text-text-primary max-w-2xl mx-auto">
          Ready to empower 13 million Kirana shopkeepers with camera AI?
        </h3>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#demo"
            className="px-6 py-3 rounded-full bg-accent text-base text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors"
          >
            Run Scanner Demo
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-full bg-surface hairline-all text-text-primary text-xs font-mono uppercase tracking-wider font-medium hover:bg-surface-2 transition-colors"
          >
            Launch Dashboard
          </a>
        </div>
      </div>
    </section>
  );
}
