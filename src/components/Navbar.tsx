"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-base/90 backdrop-blur-md hairline-b py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
            Stock
          </span>
          <span className="font-display font-bold text-xl sm:text-2xl text-accent tracking-tight group-hover:text-accent-hover transition-colors">
            Saathi
          </span>
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
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase border border-accent/40 text-accent hover:bg-accent/10 transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
          </Link>
        </div>
      </div>
    </header>
  );
}
