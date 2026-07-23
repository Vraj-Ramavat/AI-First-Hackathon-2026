"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  MessageSquare,
  Settings,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Camera,
} from "lucide-react";
import InventoryTable from "@/src/components/dashboard/InventoryTable";
import AlertsFeed from "@/src/components/dashboard/AlertsFeed";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "alerts">("overview");

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "alerts", label: "WhatsApp Alerts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface hairline-r flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo & Navigation Back */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4 group">
              <span className="font-display font-bold text-xl text-text-primary">
                Stock
              </span>
              <span className="font-display font-bold text-xl text-accent">
                Saathi
              </span>
              <span className="text-[10px] font-mono text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded ml-1">
                DASHBOARD
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span>Back to Overview</span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent font-bold border border-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  }`}
                >
                  <IconComp className="w-4 h-4 text-accent" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Store Meta */}
        <div className="pt-6 border-t border-white/5 text-xs space-y-1">
          <p className="font-bold text-text-primary">Gupta Kirana Store</p>
          <p className="text-text-secondary text-[11px]">Navrangpura, Ahmedabad</p>
          <p className="text-[10px] font-mono text-accent pt-1">Kirana ID: #IN-8092</p>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
              Inventory Intelligence
            </h1>
            <p className="text-xs text-text-secondary">
              Real-time stock readings and 7-day demand predictions for Gupta Kirana Store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-surface hairline-all text-xs font-mono text-text-secondary">
              <span>Jul 24, 2026</span>
            </div>
            <Link
              href="/#demo"
              className="px-4 py-2 rounded-full bg-accent text-base text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Shelf</span>
            </Link>
          </div>
        </div>

        {/* Exactly 3 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Card 1: Items Low on Stock */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Items Low on Stock
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                4 SKUs
              </span>
              <span className="text-xs font-mono text-red-400 font-medium">
                (2 Critical)
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Maggi 70g &amp; Fortune Oil below 15% threshold.
            </p>
          </div>

          {/* Card 2: Predicted Stockouts (48h) */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Predicted Stockouts (48h)
              </span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                3 Items
              </span>
              <span className="text-xs font-mono text-amber-400 font-medium">
                Weekend Spike
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Based on historical Friday/Saturday demand surge.
            </p>
          </div>

          {/* Card 3: Last Shelf Scan */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Last Shelf Scan
              </span>
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                14 mins
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium">
                Fresh Scan
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Camera photo processed with 96.8% accuracy.
            </p>
          </div>

        </div>

        {/* Content based on Active Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <InventoryTable />
            <AlertsFeed />
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-8">
            <InventoryTable />
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-8">
            <AlertsFeed />
          </div>
        )}
      </main>
    </div>
  );
}
