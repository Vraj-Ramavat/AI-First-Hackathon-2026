"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useScroll, useSpring } from "framer-motion";
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

const Scene3DCanvas = dynamic(() => import("@/src/components/Scene3DCanvas"), {
  ssr: false,
});

export default function ContinuousScrollLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <div ref={containerRef} className="relative bg-base text-text-primary min-h-screen w-full overflow-x-hidden">
      {/* Fixed 3D Background */}
      <Scene3DCanvas scrollProgress={scrollProgress} />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Inner Width-Restricted Page Content */}
      <main className="relative z-10 space-y-12 sm:space-y-16 pt-4 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DemoSection />
        <DifferentiatorsSection />
        <TechnologySection />
        <RoadmapSection />
        <TeamSection />
      </main>

      {/* FULL-WIDTH FOOTER (Outside the <main> container) */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}