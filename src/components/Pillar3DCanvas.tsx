"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Pillar3DProps {
  pillarType: "reading" | "forecasting" | "reordering";
}

function PillarMeshGroup({ pillarType, isVisible }: Pillar3DProps & { isVisible: boolean }) {
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

    // Slow auto-rotation
    groupRef.current.rotation.y += delta * 0.3;

    // Smooth lerp for mouse parallax tilt
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
      {pillarType === "reading" && (
        <>
          {/* Smart Stock Reading: Packaging Box & Camera Cylinder */}
          <mesh position={[-0.2, 0, 0]} rotation={[0.1, 0.2, 0]}>
            <boxGeometry args={[0.9, 1.2, 0.3]} />
            <meshStandardMaterial color="#1C1915" roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[0.3, 0.2, 0.2]} rotation={[0.2, -0.3, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.8, 24]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.5} />
          </mesh>
        </>
      )}

      {pillarType === "forecasting" && (
        <>
          {/* Demand Forecasting: Upward Trending Geometric Steps */}
          <mesh position={[-0.5, -0.4, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.3]} />
            <meshStandardMaterial color="#141210" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.4, 0.7, 0.3]} />
            <meshStandardMaterial color="#282521" roughness={0.4} />
          </mesh>
          <mesh position={[0.5, 0.3, 0]}>
            <boxGeometry args={[0.4, 1.1, 0.3]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.4} />
          </mesh>
        </>
      )}

      {pillarType === "reordering" && (
        <>
          {/* Auto Reorder Alerts: Central Order Block with Floating Alert Cube */}
          <mesh position={[0, -0.1, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[1.1, 0.9, 0.35]} />
            <meshStandardMaterial color="#1C1915" roughness={0.4} />
          </mesh>
          <mesh position={[0.3, 0.4, 0.2]} rotation={[0.3, 0.1, 0.2]}>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Pillar3DCanvas({ pillarType }: Pillar3DProps) {
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
      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-surface-2/40 hairline-all flex items-center justify-center shrink-0"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} color="#F2EDE4" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#C9A84C" />

        <PillarMeshGroup pillarType={pillarType} isVisible={isVisible} />
      </Canvas>
    </div>
  );
}
