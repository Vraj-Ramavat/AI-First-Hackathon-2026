"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MouseRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function MouseReveal({ children, className = "" }: MouseRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth cursor tracking
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);

  const x = useSpring(rawX, { stiffness: 300, damping: 30 });
  const y = useSpring(rawY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    rawX.set(xPct);
    rawY.set(yPct);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group cursor-crosshair ${className}`}
    >
      {/* Primary Visual Content */}
      {children}

      {/* Dynamic Cursor Spotlight Radial Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${x.get()}% ${y.get()}%, rgba(201, 168, 76, 0.18), transparent 80%)`,
        }}
      />

      {/* Subtle Hairline Border Highlight Follower */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(300px circle at ${x.get()}% ${y.get()}%, rgba(201, 168, 76, 0.4), transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
    </div>
  );
}
