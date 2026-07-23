import IntroSequence from "@/src/components/IntroSequence";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

import HeroSection from "@/src/components/sections/HeroSection";
import ProblemSection from "@/src/components/sections/ProblemSection";
import SolutionSection from "@/src/components/sections/SolutionSection";
import DemoSection from "@/src/components/sections/DemoSection";
import DifferentiatorsSection from "@/src/components/sections/DifferentiatorsSection";
import TechnologySection from "@/src/components/sections/TechnologySection";
import RoadmapSection from "@/src/components/sections/RoadmapSection";
import TeamSection from "@/src/components/sections/TeamSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-base text-text-primary overflow-x-hidden selection:bg-accent selection:text-base">
      {/* Session-cached Intro Sequence */}
      <IntroSequence />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* The Problem (Split into stats & narrative moments) */}
      <ProblemSection />

      {/* Three Pillars Solution */}
      <SolutionSection />

      {/* Interactive Kirana Shelf Scanner Demo */}
      <DemoSection />

      {/* Why StockSaathi is Different */}
      <DifferentiatorsSection />

      {/* Architectural Layer Breakdown */}
      <TechnologySection />

      {/* 3-Stage Hackathon Roadmap */}
      <RoadmapSection />

      {/* Team Pixel Error & Hackathon Context */}
      <TeamSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
