"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Scene3DProps {
  scrollProgress: number; // 0 to 1
}

// Keyframes for the 7 camera anchors along 3D space
// Camera shifted so 3D objects sit strictly in the right visual column (X >= 2.5)
const anchors = [
  { pos: new THREE.Vector3(0, 0, 4.5), lookAt: new THREE.Vector3(0.5, 0, 0) },         // 0: Hero
  { pos: new THREE.Vector3(0, -2, -8), lookAt: new THREE.Vector3(0.8, -2, -12) },      // 1: Problem
  { pos: new THREE.Vector3(0, -4, -18), lookAt: new THREE.Vector3(1.2, -4, -22) },    // 2: Solution
  { pos: new THREE.Vector3(0, -6, -28), lookAt: new THREE.Vector3(0, -6, -32) },       // 3: Demo
  { pos: new THREE.Vector3(0, -8, -38), lookAt: new THREE.Vector3(1.2, -8, -42) },    // 4: Differentiators
  { pos: new THREE.Vector3(0, -10, -48), lookAt: new THREE.Vector3(1.2, -10, -52) },  // 5: Roadmap
  { pos: new THREE.Vector3(0, -12, -58), lookAt: new THREE.Vector3(0, -12, -62) },     // 6: Team
];

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!anchors || anchors.length === 0) return;

    // Normalize progress between 0 and 1
    const clampedProgress = Math.min(Math.max(0, scrollProgress), 1);
    const totalSegments = anchors.length - 1;
    const scaled = clampedProgress * totalSegments;

    // Safely clamp index so it never runs past the array bounds
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const alpha = scaled - index;

    // Safe fallbacks so currAnchor and nextAnchor are never undefined
    const currAnchor = anchors[index] || anchors[0];
    const nextAnchor = anchors[Math.min(index + 1, totalSegments)] || currAnchor;

    if (!currAnchor?.pos || !nextAnchor?.pos) return;

    // Lerp Camera Position
    const targetPos = new THREE.Vector3().lerpVectors(currAnchor.pos, nextAnchor.pos, alpha);
    state.camera.position.lerp(targetPos, 0.08);

    // Lerp Camera Target / LookAt
    if (currAnchor.lookAt && nextAnchor.lookAt) {
      const targetLookAt = new THREE.Vector3().lerpVectors(currAnchor.lookAt, nextAnchor.lookAt, alpha);
      currentLookAt.current.lerp(targetLookAt, 0.08);
      state.camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

// 7 3D Visual Anchor Compositions (Shifted Right to X >= 2.5 to avoid covering left-side text)
function SceneObjects({ scrollProgress }: { scrollProgress: number }) {
  const heroGroup = useRef<THREE.Group>(null);
  const problemGroup = useRef<THREE.Group>(null);
  const solutionGroup = useRef<THREE.Group>(null);
  const differentiatorsGroup = useRef<THREE.Group>(null);
  const roadmapGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (heroGroup.current) heroGroup.current.rotation.y += delta * 0.25;
    if (problemGroup.current) problemGroup.current.rotation.y += delta * 0.15;
    if (solutionGroup.current) solutionGroup.current.rotation.y += delta * 0.2;
    if (differentiatorsGroup.current) differentiatorsGroup.current.rotation.y += delta * 0.2;
    if (roadmapGroup.current) roadmapGroup.current.rotation.y += delta * 0.25;
  });

  return (
    <>
      {/* Anchor 0: Hero 3D Gold Accent Ring */}
      <group ref={heroGroup} position={[2.8, -0.2, 0]}>
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[1.6, 0.03, 16, 64]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Anchor 1: Problem Clutter / Disorder (Shifted right to X = 2.8) */}
      <group ref={problemGroup} position={[2.8, -2.2, -12]}>
        <mesh position={[-0.4, 0.3, 0.2]} rotation={[0.4, 0.2, -0.3]}>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color="#282521" roughness={0.6} />
        </mesh>
        <mesh position={[0.4, -0.3, -0.2]} rotation={[-0.3, 0.5, 0.2]}>
          <boxGeometry args={[0.75, 0.45, 0.5]} />
          <meshStandardMaterial color="#1C1915" roughness={0.5} />
        </mesh>
        <mesh position={[0.1, 0.5, -0.1]} rotation={[0.2, -0.4, 0.4]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Anchor 2: Solution 3 Pillars (Shifted right to X = 3.0) */}
      <group ref={solutionGroup} position={[3.0, -4.2, -22]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.55, 1.0, 0.3]} />
          <meshStandardMaterial color="#1C1915" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.25, 0.15]}>
          <boxGeometry args={[0.55, 1.3, 0.3]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.6, -0.15, -0.1]}>
          <cylinderGeometry args={[0.22, 0.22, 0.8, 24]} />
          <meshStandardMaterial color="#282521" roughness={0.4} />
        </mesh>
      </group>

      {/* Anchor 3: Demo Ambient Frame (z = -30, subtle background behind UI) */}
      <group position={[3.0, -6, -32]}>
        <mesh rotation={[0.1, 0.2, 0]}>
          <torusGeometry args={[1.3, 0.06, 16, 64]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Anchor 4: Differentiators Spatial Comparison (Shifted right to X = 3.0) */}
      <group ref={differentiatorsGroup} position={[3.0, -8.2, -42]}>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.6, 1.0, 0.3]} />
          <meshStandardMaterial color="#141210" roughness={0.7} />
        </mesh>
        <mesh position={[0.5, 0.2, 0.2]}>
          <boxGeometry args={[0.7, 1.2, 0.3]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>

      {/* Anchor 5: Roadmap Growth Clusters (Shifted right to X = 3.0) */}
      <group ref={roadmapGroup} position={[3.0, -10.2, -52]}>
        <mesh position={[-0.6, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.55, 0.75, 0.3]} />
          <meshStandardMaterial color="#1C1915" roughness={0.4} />
        </mesh>
        <mesh position={[0.7, 0.3, -0.15]}>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>

      {/* Anchor 6: Team Composition (Shifted right to X = 3.0) */}
      <group position={[3.0, -12, -62]}>
        <mesh rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.18]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
    </>
  );
}

export default function Scene3DCanvas({ scrollProgress }: Scene3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#F2EDE4" />
        <pointLight position={[-4, -2, 2]} intensity={0.8} color="#C9A84C" />
        <pointLight position={[3, -3, -2]} intensity={0.4} color="#F2EDE4" />

        <CameraController scrollProgress={scrollProgress} />
        <SceneObjects scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}