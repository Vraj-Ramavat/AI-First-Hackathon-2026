"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// 3D Metallic StockSaathi Logo Model Component
function Logo3DModel({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Mouse move event listener for parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotation.current = {
        x: yPct * 0.25,
        y: xPct * 0.35,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Frame Loop: Continuous 3D Y-axis rotation + floating Y bounce + mouse parallax lerp
  useFrame((state, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Continuous 3D Y-axis rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.7;
    }

    // Floating Y bounce
    groupRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.08;

    // Mouse tilt lerp
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

    if (shadowRef.current) {
      shadowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      
      {/* 3D Rotating Mesh Group */}
      <group ref={meshRef}>
        
        {/* 3D Metallic Gold Medallion Outer Ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 32, 64]} />
          <meshStandardMaterial
            color="#C9A84C"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>


        {/* 3D Transformed Crisp Logo SVG Element inside WebGL Canvas */}
        <Html
          transform
          position={[0, 0, 0.08]}
          scale={0.42}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-[#C9A84C]/30 via-[#1A1408] to-black border-2 border-[#C9A84C] flex items-center justify-center p-6 shadow-[0_0_50px_rgba(201,168,76,0.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="StockSaathi Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(201,168,76,0.8)]"
            />
          </div>
        </Html>

      </group>

      {/* Floating Outer Orbital Gold Ring */}
      <mesh rotation={[Math.PI / 3.5, 0.25, 0]}>
        <torusGeometry args={[2.0, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#C9A84C"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Ground Soft Shadow */}
      <mesh ref={shadowRef} position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial
          color="#C9A84C"
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-surface-2/40 via-surface/20 to-base border border-[#C9A84C]/20 shadow-2xl"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.4}
          color="#F2EDE4"
        />
        <pointLight
          position={[-4, -2, 2]}
          intensity={1.0}
          color="#C9A84C"
        />
        <pointLight
          position={[3, -3, -2]}
          intensity={0.5}
          color="#F2EDE4"
        />

        <Logo3DModel isVisible={isVisible} />
      </Canvas>

      <div className="absolute bottom-4 inset-x-0 text-center text-[10px] font-mono text-text-secondary/60 pointer-events-none">
        Interactive 3D StockSaathi Logo • Move mouse to tilt
      </div>
    </div>
  );
}
