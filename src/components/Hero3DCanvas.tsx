"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Abstracted Sculptural Product Packets 3D Composition Component
function ProductCluster({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Mouse move event listener for subtle parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      targetRotation.current = {
        x: yPct * 0.2, // Max ~11 degrees tilt
        y: xPct * 0.3,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Frame Loop: Continuous subtle auto-rotation + mouse parallax lerp
  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // 1. Slow continuous auto-rotation
    groupRef.current.rotation.y += delta * 0.25;

    // 2. Smooth lerp tilt towards mouse position
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetRotation.current.y * 0.2,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Box 1: Primary Kirana Packet (Dark Surface) */}
      <mesh position={[-0.4, 0, 0]} rotation={[0.1, 0.2, -0.05]}>
        <boxGeometry args={[1.2, 1.6, 0.4]} />
        <meshStandardMaterial
          color="#1C1915"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Box 2: Highlight Accent Kirana Packet (Turmeric Gold Accent) */}
      <mesh position={[0.4, 0.2, 0.3]} rotation={[-0.1, -0.3, 0.1]}>
        <boxGeometry args={[1.0, 1.4, 0.35]} />
        <meshStandardMaterial
          color="#C9A84C"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Box 3: Compact Snack Packet (Surface 2 Tone) */}
      <mesh position={[-0.1, 0.7, -0.2]} rotation={[0.2, -0.1, 0.15]}>
        <boxGeometry args={[0.9, 0.9, 0.3]} />
        <meshStandardMaterial
          color="#282521"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Cylinder 1: Oil Can / Container (Gold Accent Highlight) */}
      <mesh position={[0.6, -0.5, -0.1]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.32, 0.32, 1.1, 32]} />
        <meshStandardMaterial
          color="#C9A84C"
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Box 4: Base Support Block (Near Black Base) */}
      <mesh position={[0, -0.9, 0]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[2.0, 0.3, 0.8]} />
        <meshStandardMaterial
          color="#141210"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Client-side mount check to prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Intersection Observer: Pause animation when hero is scrolled out of view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-surface-2/40 via-surface/20 to-base"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Shading & Lighting Setup */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#F2EDE4"
        />
        <pointLight
          position={[-4, -2, 2]}
          intensity={0.9}
          color="#C9A84C"
        />
        <pointLight
          position={[3, -3, -2]}
          intensity={0.4}
          color="#F2EDE4"
        />

        {/* Product Cluster Scene */}
        <ProductCluster isVisible={isVisible} />
      </Canvas>

      {/* Subtle Bottom Ambient Caption */}
      <div className="absolute bottom-4 inset-x-0 text-center text-[10px] font-mono text-text-secondary/60 pointer-events-none">
        Interactive 3D Shelf Composition • Move mouse to tilt
      </div>
    </div>
  );
}
