"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import VIPAuthCard from "./VIPAuthCard";
import { Sparkles, ArrowRight, ShieldCheck, Sparkle, Zap, Bot, Layers } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";

interface PanelData {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

const PANELS: PanelData[] = [
  {
    id: 1,
    title: "AI SHELF VISION",
    subtitle: "Real-time computer vision packaging detection",
    tag: "[01] SCANNER",
    image: "/kirana-scanner-pillar.jpg",
  },
  {
    id: 2,
    title: "INVENTORY MATRIX",
    subtitle: "7-day demand forecasting & SKU tracking",
    tag: "[02] ANALYTICS",
    image: "/kirana-analytics-pillar.jpg",
  },
  {
    id: 3,
    title: "WHATSAPP REORDER",
    subtitle: "2-hour automated zero-click supplier dispatch",
    tag: "[03] AUTOMATION",
    image: "/kirana-automation-pillar.jpg",
  },
  {
    id: 4,
    title: "KIRANA BRAND",
    subtitle: "Empowering 12M+ Indian retail storefronts",
    tag: "[04] ECOSYSTEM",
    image: "/kirana-ecosystem-pillar.jpg",
  },
];

export default function DashboardFlipTransitionAuth() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isLoginActive, setIsLoginActive] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Controls dual-ball animation stage: "idle" | "rolling" | "expanded"
  const [ballStage, setBallStage] = useState<"idle" | "rolling" | "expanded">("idle");

  // Trigger 3D Staggered Flip Entrance to Login
  const handleOpenLogin = () => {
    if (isFlipping || isLoginActive) return;
    setIsFlipping(true);
    setIsLoginActive(true);

    // Sequence timing:
    // 1. 0ms - 500ms: 4 Panels 3D flip away
    // 2. 500ms - 1300ms: 3D Spherical Gold Orbs roll slowly inward with Z+Y rotation & realistic shadows
    // 3. 1300ms - 1800ms: 3D Spheres expand clipPath outward to reveal left & right pages
    setTimeout(() => {
      setBallStage("rolling");
    }, 500);

    setTimeout(() => {
      setBallStage("expanded");
    }, 1300);

    setTimeout(() => {
      setIsFlipping(false);
    }, 1850);
  };

  // Trigger 3D Staggered Reverse Flip back to Dashboard Collage
  const handleCloseLogin = () => {
    if (isFlipping || !isLoginActive) return;
    setIsFlipping(true);

    // Reverse sequence timing:
    // 1. 0ms - 500ms: Shrink dual balls clipPath back to 3D sphere
    // 2. 500ms - 1100ms: Roll 3D spheres outward off-screen
    // 3. 1100ms: Unflip 4 panels back into view
    setBallStage("rolling");

    setTimeout(() => {
      setBallStage("idle");
    }, 550);

    setTimeout(() => {
      setIsLoginActive(false);
      setIsFlipping(false);
    }, 1150);
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-300 ${isLight ? "bg-base text-text-primary" : "bg-black text-white selection:bg-[#C9A84C] selection:text-black"}`}>

      {/* Perspective Container for 3D Flips & Spherical Motion */}
      <div className="relative min-h-screen w-full perspective-1200 overflow-hidden flex flex-col justify-center items-center">

        {/* Layer 2: Dual 3D Spherical Rolling Orbs Reveal Layer */}
        <AnimatePresence>
          {isLoginActive && (
            <div className="absolute inset-0 z-10 w-full h-full flex flex-col md:flex-row items-center justify-center overflow-hidden">

              {/* Back to Landing Page Floating Link */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-40">
                <Link
                  href="/"
                  className={`text-[11px] font-mono uppercase tracking-[0.25em] transition-colors flex items-center gap-2 group py-1.5 px-4 rounded-full border shadow-2xl ${isLight
                      ? "bg-surface text-accent border-accent/40 hover:bg-surface-2"
                      : "bg-black/80 text-[#C9A84C] border-[#C9A84C]/50 hover:text-white"
                    }`}
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                  <span>BACK TO LANDING PAGE</span>
                </Link>
              </div>

              {/* LEFT 3D SPHERE: Slow 3D Roll Inward + Sequential Circular ClipPath Expansion */}
              <motion.div
                initial={{
                  x: "-120%",
                  rotateZ: -360,
                  rotateY: -180,
                  clipPath: "circle(55px at 50% 50%)",
                  opacity: 1,
                }}
                animate={{
                  x: ballStage === "idle" ? "-120%" : "0%",
                  rotateZ: ballStage === "idle" ? -360 : 0,
                  rotateY: ballStage === "idle" ? -180 : 0,
                  clipPath: ballStage === "expanded" ? "circle(160% at 50% 50%)" : "circle(55px at 50% 50%)",
                  opacity: 1,
                }}
                transition={{
                  x: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  rotateZ: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  rotateY: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  clipPath: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`hidden md:flex md:w-1/2 md:h-full flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden shadow-2xl transition-colors duration-300 ${isLight
                  ? "bg-surface-2 border-r border-accent/30 text-text-primary"
                  : "bg-gradient-to-br from-black via-zinc-950 to-black border-r border-white/10 text-white"
                  }`}
              >
                {/* 3D Gold Orb Specular Lighting Overlay during Roll */}
                {ballStage !== "expanded" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="w-[110px] h-[110px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF_0%,#F5E6AA_25%,#C9A84C_55%,#684E17_80%,#140D03_100%)] shadow-[0_15px_45px_rgba(201,168,76,0.8),inset_0_0_25px_rgba(255,255,255,0.9)] border border-[#FFF3D1]/60 relative flex items-center justify-center transform-gpu">
                      <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/70 blur-[2px] transform -rotate-12" />
                      <div className="absolute inset-1 rounded-full border border-white/30 opacity-70" />
                      <div className="w-12 h-12 rounded-full border border-[#C9A84C] opacity-50 animate-spin" />
                    </div>
                  </div>
                )}

                {/* Subtle Gold Radial Ambient Backdrop */}
                <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

                {/* Left Page Content (Fades & slides up ONLY after ball expansion finishes) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: ballStage === "expanded" ? 1 : 0,
                    y: ballStage === "expanded" ? 0 : 20,
                  }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative z-10 text-center max-w-sm space-y-6"
                >
                  {/* StockSaathi Website Logo & VIP Badge */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 via-surface-2 to-surface border border-accent/40 flex items-center justify-center p-2.5 shadow-2xl shadow-accent/20 perspective-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <motion.img
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        src="/logo.svg"
                        alt="StockSaathi Logo"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(201,168,76,0.6)] transform-gpu"
                      />
                    </div>

                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-accent bg-accent/10 px-3 py-0.5 rounded-full border border-accent/30">
                      KIRANA INTELLIGENCE V2.4
                    </span>
                  </div>

                  {/* Brand Heading & Slogan */}
                  <div className="space-y-2">
                    <h1 className={`text-4xl font-display font-extrabold uppercase tracking-widest ${isLight ? "text-text-primary" : "text-white"}`}>
                      Stock<span className="text-accent">Saathi</span>
                    </h1>

                    <p className={`text-xs font-sans leading-relaxed max-w-xs mx-auto ${isLight ? "text-text-secondary" : "text-white/70"}`}>
                      Elevate your experience with exclusive perks, early releases, and special rewards.
                    </p>
                  </div>

                  {/* Feature Highlights Grid */}
                  <div className={`grid grid-cols-2 gap-3 pt-4 border-t text-left ${isLight ? "border-accent/20" : "border-white/10"}`}>
                    <div className={`p-3 rounded-xl flex items-start gap-2.5 ${isLight ? "bg-surface border border-accent/20" : "bg-white/5 border border-white/5"}`}>
                      <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className={`text-[11px] font-mono font-bold uppercase ${isLight ? "text-text-primary" : "text-white"}`}>AI VISION</div>
                        <div className={`text-[10px] ${isLight ? "text-text-secondary" : "text-white/50"}`}>Instant shelf scan</div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl flex items-start gap-2.5 ${isLight ? "bg-surface border border-accent/20" : "bg-white/5 border border-white/5"}`}>
                      <Bot className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className={`text-[11px] font-mono font-bold uppercase ${isLight ? "text-text-primary" : "text-white"}`}>WHATSAPP</div>
                        <div className={`text-[10px] ${isLight ? "text-text-secondary" : "text-white/50"}`}>2-hr auto reorder</div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </motion.div>

              {/* RIGHT 3D SPHERE: Slow 3D Roll Inward + Sequential Circular ClipPath Expansion */}
              <motion.div
                initial={{
                  x: "120%",
                  rotateZ: 360,
                  rotateY: 180,
                  clipPath: "circle(55px at 50% 50%)",
                  opacity: 1,
                }}
                animate={{
                  x: ballStage === "idle" ? "120%" : "0%",
                  rotateZ: ballStage === "idle" ? 360 : 0,
                  rotateY: ballStage === "idle" ? 180 : 0,
                  clipPath: ballStage === "expanded" ? "circle(160% at 50% 50%)" : "circle(55px at 50% 50%)",
                  opacity: 1,
                }}
                transition={{
                  x: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  rotateZ: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  rotateY: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  clipPath: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`w-full md:w-1/2 h-full flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300 ${isLight ? "bg-base text-text-primary" : "bg-black text-white"
                  }`}
              >
                {/* 3D Gold Orb Specular Lighting Overlay during Roll */}
                {ballStage !== "expanded" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="w-[110px] h-[110px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF_0%,#F5E6AA_25%,#C9A84C_55%,#684E17_80%,#140D03_100%)] shadow-[0_15px_45px_rgba(201,168,76,0.8),inset_0_0_25px_rgba(255,255,255,0.9)] border border-[#FFF3D1]/60 relative flex items-center justify-center transform-gpu">
                      <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/70 blur-[2px] transform -rotate-12" />
                      <div className="absolute inset-1 rounded-full border border-white/30 opacity-70" />
                      <div className="w-12 h-12 rounded-full border border-[#C9A84C] opacity-50 animate-spin" />
                    </div>
                  </div>
                )}

                {/* Background Image inside Right Ball */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2000&auto=format&fit=crop"
                  alt="VIP Form Background"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale brightness-40 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90" />

                {/* Right Page Content (Fades & slides up ONLY after ball expansion finishes) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: ballStage === "expanded" ? 1 : 0,
                    y: ballStage === "expanded" ? 0 : 20,
                  }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="relative z-10 w-full max-w-md"
                >
                  <VIPAuthCard initialTab="login" onBackClick={handleCloseLogin} hideHeader={true} />
                </motion.div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

        {/* Layer 1: 4 Equal Vertical Panels (25% Width Each) Sitting on Top */}
        <AnimatePresence>
          {!isLoginActive && (
            <motion.div
              key="dashboard-collage-layer"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="absolute inset-0 z-20 w-full h-full grid grid-cols-1 md:grid-cols-4 pointer-events-auto"
            >
              {PANELS.map((panel, idx) => {
                // Forward stagger delay (Panel 1: 0ms, Panel 2: 80ms, Panel 3: 160ms, Panel 4: 240ms)
                const staggerDelay = idx * 0.08;

                return (
                  <motion.div
                    key={panel.id}
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{
                      rotateY: -95,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: staggerDelay,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                    className="relative w-full h-full overflow-hidden border-r border-white/10 last:border-0 group cursor-pointer"
                    onClick={handleOpenLogin}
                  >
                    {/* Panel Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={panel.image}
                      alt={panel.title}
                      className="w-full h-full object-cover filter brightness-60 contrast-110 group-hover:scale-105 group-hover:brightness-90 transition-all duration-500 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 group-hover:from-black/90 transition-colors duration-300" />

                    {/* Panel Editorial Text Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 text-white">
                      {/* Top Tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A84C] uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C9A84C]/30">
                          {panel.tag}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">0{panel.id} / 04</span>
                      </div>

                      {/* Bottom Copy */}
                      <div className="space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="text-xl font-display font-extrabold tracking-wider uppercase text-white group-hover:text-[#C9A84C] transition-colors">
                          {panel.title}
                        </h3>
                        <p className="text-xs font-mono text-white/70 leading-relaxed">
                          {panel.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Fixed Center Action Banner Over Collage */}
              <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-black/80 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] max-w-md pointer-events-auto space-y-5"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-mono tracking-[0.25em] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>STOCKSAATHI AI PLATFORM</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase tracking-wider">
                    EXPLORE THE FUTURE OF KIRANA
                  </h2>

                  <p className="text-xs font-mono text-white/70 leading-relaxed">
                    Click anywhere on the preview panels or the button below to trigger the 3D rolling-ball portal transition.
                  </p>

                  <button
                    type="button"
                    onClick={handleOpenLogin}
                    disabled={isFlipping}
                    className="relative w-full overflow-hidden group py-4 px-6 bg-white text-black font-display font-extrabold uppercase tracking-[0.25em] text-xs transition-all duration-300 shadow-xl rounded-xl"
                  >
                    <span className="absolute inset-0 bg-[#C9A84C] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors">
                      <span>SIGN IN TO VIP PORTAL</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
