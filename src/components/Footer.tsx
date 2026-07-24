"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/src/components/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-base border-t border-white/10 py-12 sm:py-16 text-text-secondary text-sm">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          
          {/* Brand Info */}
          <div className="space-y-3 max-w-md">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="font-display font-bold text-2xl text-text-primary">
                Stock
              </span>
              <span className="font-display font-bold text-2xl text-accent">
                Saathi
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              AI-powered inventory intelligence for India&apos;s 13M+ Kirana stores. Built for Summer School &apos;26 AI First Hackathon (IIT Jammu I3C) — Track: AI for Industry, Business &amp; Productivity.
            </p>
            <p className="text-xs text-accent font-mono">
              Team Pixel Error • Adani University
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-xs w-full md:w-auto">
            <div>
              <p className="text-text-primary font-mono uppercase tracking-wider mb-3 font-semibold">
                Navigation
              </p>
              <ul className="space-y-2">
                <li><a href="#problem" className="hover:text-text-primary transition-colors">The Problem</a></li>
                <li><a href="#solution" className="hover:text-text-primary transition-colors">Three Pillars</a></li>
                <li><a href="#demo" className="hover:text-text-primary transition-colors">Live Scanner Demo</a></li>
                <li><a href="#roadmap" className="hover:text-text-primary transition-colors">Hackathon Roadmap</a></li>
              </ul>
            </div>

            <div>
              <p className="text-text-primary font-mono uppercase tracking-wider mb-3 font-semibold">
                App
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors inline-flex items-center gap-1">
                    <span>Kirana Dashboard</span>
                    <ArrowUpRight className="w-3 h-3 text-accent shrink-0" />
                  </Link>
                </li>
                <li><a href="#technology" className="hover:text-text-primary transition-colors">Architecture Layer</a></li>
              </ul>
            </div>

            <div>
              <p className="text-text-primary font-mono uppercase tracking-wider mb-3 font-semibold">
                Team
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li>Prathamesh Naik (Backend)</li>
                <li>Vraj Ramavat (Frontend)</li>
                <li>Heli Gupta (Database)</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-xs text-text-secondary/70 font-mono">
          <p>© 2026 StockSaathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}