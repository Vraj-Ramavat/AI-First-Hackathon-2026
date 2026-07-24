"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// Dynamically import ContinuousScrollLayout with SSR disabled for clean client WebGL camera travel
const ContinuousScrollLayout = dynamic(() => import("@/src/components/ContinuousScrollLayout"), {
  ssr: false,
});

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="relative min-h-screen bg-base text-text-primary overflow-x-hidden selection:bg-accent selection:text-base">
      {/* Session-cached Intro Sequence */}
      <IntroSequence />

      {mounted && !isMobile ? (
        /* Desktop Continuous 3D Camera Travel Scene */
        <ContinuousScrollLayout />
      ) : (
        /* Mobile Standard 2D Layout Fallback with Standalone Accents */
        <>
          <Navbar />
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <DemoSection />
          <DifferentiatorsSection />
          <TechnologySection />
          <RoadmapSection />
          <TeamSection />
          <Footer />
        </>
      )}
    </main>
  );
}
