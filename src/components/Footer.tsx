import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/src/components/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-surface hairline-t py-16 px-6 sm:px-8 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        {/* Brand & Hackathon Context */}
        <div className="space-y-3 max-w-md">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo textSize="text-2xl" />
          </Link>
          <p className="text-xs text-text-secondary leading-relaxed">
            AI-powered inventory intelligence for India&apos;s 13M+ Kirana stores. Built for Summer School &apos;26 AI First Hackathon (IIT Jammu I3C) — Track: AI for Industry, Business & Productivity.
          </p>
          <p className="text-xs text-accent/80 font-mono">
            Team Pixel Error • Adani University
          </p>
        </div>

        {/* Navigation & Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <p className="text-text-primary font-mono uppercase tracking-wider mb-3">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#problem" className="hover:text-text-primary transition-colors">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#solution" className="hover:text-text-primary transition-colors">
                  Three Pillars
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-text-primary transition-colors">
                  Live Scanner Demo
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-text-primary transition-colors">
                  Hackathon Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-text-primary font-mono uppercase tracking-wider mb-3">
              App
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-accent transition-colors flex items-center gap-1">
                  <span>Kirana Dashboard</span>
                  <ArrowUpRight className="w-3 h-3 text-accent" />
                </Link>
              </li>
              <li>
                <a href="#technology" className="hover:text-text-primary transition-colors">
                  Architecture Layer
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-text-primary font-mono uppercase tracking-wider mb-3">
              Team
            </p>
            <ul className="space-y-2">
              <li>Prathamesh Naik (Backend)</li>
              <li>Vraj Ramavat (Frontend)</li>
              <li>Heli Gupta (Database)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto hairline-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-text-secondary/70">
        <p>© 2026 StockSaathi. All rights reserved.</p>
      </div>
    </footer>
  );
}
