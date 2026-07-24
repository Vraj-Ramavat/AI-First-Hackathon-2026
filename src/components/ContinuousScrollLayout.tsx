"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
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

// Dynamically import Scene3DCanvas with SSR disabled
const Scene3DCanvas = dynamic(() => import("@/src/components/Scene3DCanvas"), {
  ssr: false,
});

/**
 * Calculates crisp, non-overlapping section opacity:
 * - progress < start => 0
 * - start <= progress < peekStart => fade in (0 -> 1)
 * - peekStart <= progress <= peekEnd => 1 (hold)
 * - peekEnd < progress <= end => fade out (1 -> 0)
 * - progress > end => 0
 */
function getSectionOpacity(
  progress: number,
  start: number,
  peekStart: number,
  peekEnd: number,
  end: number
): number {
  if (progress < start || progress > end) return 0;
  if (progress >= peekStart && progress <= peekEnd) return 1;
  if (progress < peekStart) {
    return (progress - start) / (peekStart - start);
  }
  // progress > peekEnd
  return 1 - (progress - peekEnd) / (end - peekEnd);
}

export default function ContinuousScrollLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring physics for camera scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Section Opacities with strict non-overlapping bounds
  const opacities = [
    getSectionOpacity(scrollProgress, 0.00, 0.00, 0.09, 0.12), // 0: Hero
    getSectionOpacity(scrollProgress, 0.12, 0.15, 0.23, 0.26), // 1: Problem
    getSectionOpacity(scrollProgress, 0.26, 0.29, 0.38, 0.41), // 2: Solution
    getSectionOpacity(scrollProgress, 0.41, 0.44, 0.53, 0.56), // 3: Demo
    getSectionOpacity(scrollProgress, 0.56, 0.59, 0.68, 0.71), // 4: Differentiators
    getSectionOpacity(scrollProgress, 0.71, 0.74, 0.83, 0.86), // 5: Roadmap
    getSectionOpacity(scrollProgress, 0.86, 0.89, 1.00, 1.00), // 6: Team & Footer
  ];

  return (
    <div ref={containerRef} className="relative bg-base text-text-primary">
      {/* Persistent Single 3D Canvas Background */}
      <Scene3DCanvas scrollProgress={scrollProgress} />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Tall Scroll Track (700vh for 7 Anchor Sections) */}
      <div className="relative w-full h-[700vh]">
        
        {/* Section 0: Hero */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[0],
              pointerEvents: opacities[0] > 0.5 ? "auto" : "none",
            }}
            className="w-full"
          >
            <HeroSection />
          </motion.div>
        </div>

        {/* Section 1: Problem */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[1],
              pointerEvents: opacities[1] > 0.5 ? "auto" : "none",
            }}
            className="w-full"
          >
            <ProblemSection />
          </motion.div>
        </div>

        {/* Section 2: Solution */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[2],
              pointerEvents: opacities[2] > 0.5 ? "auto" : "none",
            }}
            className="w-full"
          >
            <SolutionSection />
          </motion.div>
        </div>

        {/* Section 3: Demo */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[3],
              pointerEvents: opacities[3] > 0.5 ? "auto" : "none",
            }}
            className="w-full"
          >
            <DemoSection />
          </motion.div>
        </div>

        {/* Section 4: Differentiators & Tech */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[4],
              pointerEvents: opacities[4] > 0.5 ? "auto" : "none",
            }}
            className="w-full overflow-y-auto max-h-[calc(100vh-7rem)]"
          >
            <DifferentiatorsSection />
            <TechnologySection />
          </motion.div>
        </div>

        {/* Section 5: Roadmap */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-center pointer-events-none z-10 overflow-visible">
          <motion.div
            style={{
              opacity: opacities[5],
              pointerEvents: opacities[5] > 0.5 ? "auto" : "none",
            }}
            className="w-full"
          >
            <RoadmapSection />
          </motion.div>
        </div>

        {/* Section 6: Team & Footer */}
        <div className="sticky top-0 h-screen pt-28 pb-8 flex flex-col justify-between pointer-events-none z-10 overflow-y-auto">
          <motion.div
            style={{
              opacity: opacities[6],
              pointerEvents: opacities[6] > 0.5 ? "auto" : "none",
            }}
            className="w-full min-h-[calc(100vh-7rem)] flex flex-col justify-between"
          >
            <TeamSection />
            <Footer />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
