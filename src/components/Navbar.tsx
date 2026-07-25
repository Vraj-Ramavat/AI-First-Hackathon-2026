"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, User } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-base/90 backdrop-blur-md hairline-b ${
        scrolled ? "py-4 shadow-lg shadow-black/40" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-2">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          {/* 3D Rotating Logo Badge matching login page style */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 via-black to-black border border-[#C9A84C]/40 flex items-center justify-center p-1.5 shadow-lg shadow-[#C9A84C]/10 relative overflow-hidden shrink-0" style={{ perspective: "600px" }}>
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,243,209,0.15),transparent_70%)] pointer-events-none" />
            <motion.div
              animate={{
                rotateY: [0, 360],
                rotateX: [6, -6, 6],
                filter: [
                  "brightness(1.2) drop-shadow(0 0 8px rgba(201,168,76,0.8))",
                  "brightness(0.7) drop-shadow(0 0 3px rgba(201,168,76,0.3))",
                  "brightness(1.2) drop-shadow(0 0 8px rgba(201,168,76,0.8))",
                ],
              }}
              transition={{
                rotateY: { duration: 5.5, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 2.75, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 2.75, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full h-full flex items-center justify-center transform-gpu"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="StockSaathi Logo"
                className="w-full h-full object-contain"
                style={{ transform: "translateZ(3px)" }}
              />
            </motion.div>
          </div>

          {/* Brand Text */}
          <div className="flex items-center gap-0.5">
            <span className="font-display font-bold text-lg sm:text-2xl text-text-primary tracking-tight">
              Stock
            </span>
            <span className="font-display font-bold text-lg sm:text-2xl text-accent tracking-tight group-hover:text-accent-hover transition-colors">
              Saathi
            </span>
          </div>
        </Link>


        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-text-secondary">
          <a
            href="#problem"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            The Challenge
          </a>
          <a
            href="#solution"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            3 Pillars
          </a>
          <a
            href="#demo"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            Live Demo
          </a>
          <a
            href="#technology"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            Technology
          </a>
          <a
            href="#roadmap"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            Roadmap
          </a>
          <a
            href="#team"
            className="hover:text-text-primary transition-colors hover:font-medium"
          >
            Team
          </a>
        </nav>

        {/* Action Button Right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          {!session ? (
            <Link
              href="/auth/login"
              className="text-[11px] sm:text-xs font-mono text-text-secondary hover:text-text-primary px-2 py-1 transition-colors shrink-0"
            >
              Sign In
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              <User className="w-3 h-3" />
              <span>{session.user?.name || "Logged In"}</span>
            </span>
          )}

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono tracking-wider uppercase bg-accent text-base font-bold hover:bg-accent-hover transition-all whitespace-nowrap shrink-0 shadow-md shadow-accent/20 border border-accent/40 active:scale-95"
          >
            <span className="hidden sm:inline">Launch </span>
            <span>Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-base" />
          </Link>
        </div>
      </div>
    </header>
  );
}
