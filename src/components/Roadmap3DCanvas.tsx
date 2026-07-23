"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Roadmap3DProps {
  stage: "now" | "months3" | "months12";
}

function RoadmapMeshGroup({ stage, isVisible }: Roadmap3DProps & { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotation.current = {
        x: yPct * 0.15,
        y: xPct * 0.25,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Independent rotation speed per stage
    const speed = stage === "now" ? 0.35 : stage === "months3" ? 0.25 : 0.2;
    groupRef.current.rotation.y += delta * speed;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetRotation.current.y * 0.15,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {stage === "now" && (
        /* Phase 1: Single Gold Primitive */
        <mesh rotation={[0.2, 0.3, 0.1]}>
          <boxGeometry args={[0.85, 0.85, 0.85]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.4} />
        </mesh>
      )}

      {stage === "months3" && (
        /* Phase 2: Medium Cluster (3 Primitives) */
        <>
          <mesh position={[-0.3, 0, 0]} rotation={[0.1, 0.2, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.4]} />
            <meshStandardMaterial color="#1C1915" roughness={0.4} />
          </mesh>
          <mesh position={[0.3, 0.2, 0.2]} rotation={[-0.2, 0.3, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.4]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, -0.4, -0.2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
            <meshStandardMaterial color="#282521" roughness={0.5} />
          </mesh>
        </>
      )}

      {stage === "months12" && (
        /* Phase 3: High Density Growth Cluster (6 Primitives) */
        <>
          <mesh position={[-0.4, -0.2, 0]} rotation={[0.1, 0.1, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.35]} />
            <meshStandardMaterial color="#1C1915" roughness={0.4} />
          </mesh>
          <mesh position={[0.3, -0.1, 0.2]} rotation={[-0.1, 0.2, 0]}>
            <boxGeometry args={[0.6, 0.9, 0.35]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.4, -0.1]} rotation={[0.2, -0.1, 0]}>
            <boxGeometry args={[0.7, 0.5, 0.35]} />
            <meshStandardMaterial color="#282521" roughness={0.4} />
          </mesh>
          <mesh position={[-0.5, 0.3, 0.1]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0.5, 0.4, -0.2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
            <meshStandardMaterial color="#141210" roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Roadmap3DCanvas({ stage }: Roadmap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-2/40 hairline-all flex items-center justify-center shrink-0"
    >
      <Canvas
        camera={{ position: [0, 0, 3.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} color="#F2EDE4" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#C9A84C" />

        <RoadmapMeshGroup stage={stage} isVisible={isVisible} />
      </Canvas>
    </div>
  );
}
