"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DemoMeshAccent({ isVisible }: { isVisible: boolean }) {
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
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0.2, 0.4, 0]}>
        <torusGeometry args={[0.6, 0.18, 16, 32]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

export default function Demo3DCanvas() {
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
      className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-2/30 hairline-all flex items-center justify-center shrink-0"
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} color="#F2EDE4" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#C9A84C" />
        <DemoMeshAccent isVisible={isVisible} />
      </Canvas>
    </div>
  );
}
