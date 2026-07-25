"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, AlertTriangle, ArrowUpRight, Zap, Layers, Activity } from "lucide-react";
import { ProductItem } from "./ProductModal";

interface DashboardAnalyticsProps {
  products: ProductItem[];
  currentStoreName?: string;
  onSwitchToInventory?: () => void;
}

const weeklyDemandData = [
  { day: "MON", demand: 140, stockouts: 1, revenue: 12400 },
  { day: "TUE", demand: 165, stockouts: 0, revenue: 14200 },
  { day: "WED", demand: 180, stockouts: 2, revenue: 15800 },
  { day: "THU", demand: 210, stockouts: 1, revenue: 18900 },
  { day: "FRI", demand: 320, stockouts: 4, revenue: 28500 },
  { day: "SAT", demand: 410, stockouts: 6, revenue: 36200 },
  { day: "SUN", demand: 380, stockouts: 3, revenue: 33100 },
];

const categoryDistribution = [
  { name: "Snacks & FMCG", count: 42, critical: 3, color: "#C9A84C" },
  { name: "Staples & Atta", count: 28, critical: 1, color: "#F59E0B" },
  { name: "Dairy & Edible Oil", count: 19, critical: 4, color: "#EF4444" },
  { name: "Personal & Home", count: 25, critical: 0, color: "#4ADE80" },
];

// Custom Tooltip styled like an authentic Kirana Ledger Slip
const CustomLedgerTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border-2 border-accent/40 rounded-sm p-3 font-mono text-xs shadow-2xl space-y-1.5 min-w-[180px] text-text-primary">
        <div className="text-accent font-bold uppercase border-b border-accent/20 pb-1 flex items-center justify-between">
          <span>[ DAY: {label} ]</span>
          <span className="text-[10px] text-text-secondary">LEDGER ENTRY</span>
        </div>
        <div className="text-text-primary flex justify-between">
          <span className="text-text-secondary">Units Demanded:</span>
          <span className="font-bold text-accent">{payload[0]?.value} SKUs</span>
        </div>
        {payload[1] && (
          <div className="text-red-400 flex justify-between">
            <span>Predicted Depletions:</span>
            <span className="font-bold">{payload[1]?.value} Items</span>
          </div>
        )}
        <div className="text-emerald-400 flex justify-between pt-1 border-t border-white/5">
          <span>Est. Sales:</span>
          <span className="font-bold">₹{payload[0]?.payload?.revenue?.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardAnalytics({
  products,
  currentStoreName = "Gupta Kirana Store",
  onSwitchToInventory,
}: DashboardAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");

  const hasProducts = products.length > 0;

  const criticalItems = products.filter((p) => p.quantity <= 5 || p.status === "CRITICAL");
  const lowStockItems = products.filter((p) => p.quantity > 5 && p.quantity <= 15);

  // Calculate Category Distribution dynamically from store products
  const categoryMap: Record<string, { count: number; critical: number }> = {};
  products.forEach((p) => {
    const cat = p.category || "General FMCG";
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, critical: 0 };
    }
    categoryMap[cat].count += 1;
    if (p.quantity <= 5 || p.status === "CRITICAL") {
      categoryMap[cat].critical += 1;
    }
  });

  const colors = ["#C9A84C", "#F59E0B", "#EF4444", "#4ADE80", "#60A5FA", "#A78BFA"];
  const dynamicCategoryDistribution = Object.entries(categoryMap).map(([name, stat], i) => ({
    name,
    count: stat.count,
    critical: stat.critical,
    color: colors[i % colors.length],
  }));

  return (
    <div className="space-y-6 font-mono">
      
      {/* 7-Day Demand Graph & Forecast Plaque */}
      <div className="bg-surface border-2 border-accent/30 rounded-sm p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-accent/30 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
              <span>7-DAY DEMAND FORECAST &amp; CONSUMPTION CURVE</span>
              <Activity className="w-4 h-4 text-accent" />
            </h2>
            <p className="text-xs font-mono text-text-secondary mt-0.5">
              Computer vision &amp; AI-assisted sales trend for <strong className="text-accent uppercase">{currentStoreName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-bold transition-all ${
                timeRange === "7d"
                  ? "bg-accent text-base border border-accent/40"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary border border-accent/20"
              }`}
            >
              7-Day View
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-bold transition-all ${
                timeRange === "30d"
                  ? "bg-accent text-base border border-accent/40"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary border border-accent/20"
              }`}
            >
              30-Day Model
            </button>
          </div>
        </div>

        {/* Recharts Area Chart OR Empty State Plaque */}
        {hasProducts ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(242, 237, 228, 0.08)" />
                <XAxis
                  dataKey="day"
                  stroke="#7A7470"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#7A7470"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomLedgerTooltip />} />
                <Area
                  type="monotone"
                  dataKey="demand"
                  name="Demand Volume"
                  stroke="#C9A84C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="stockouts"
                  name="Stockout Risk"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#redGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-surface-2/60 border border-accent/20 rounded-sm font-mono space-y-3">
            <Activity className="w-10 h-10 text-accent/40" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">[ NO DEMAND FORECAST DATA AVAILABLE ]</h3>
            <p className="text-xs text-text-secondary max-w-md">
              There are currently 0 products in <span className="text-accent uppercase font-bold">{currentStoreName}</span>. Log products in the Inventory register to render demand curves and stockout predictions.
            </p>
            <button
              onClick={onSwitchToInventory}
              className="px-4 py-2 bg-accent text-base text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-accent-hover transition-all border border-accent/40 cursor-pointer"
            >
              + Add Products in Inventory
            </button>
          </div>
        )}

        {/* Graph Footnote Legend */}
        {hasProducts && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-accent/20 font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-none border border-accent/60" />
              <span className="text-text-secondary uppercase">Gold Line:</span>
              <span className="text-text-primary font-bold">Predicted FMCG Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-none border border-red-400" />
              <span className="text-text-secondary uppercase">Red Fill:</span>
              <span className="text-red-400 font-bold">Weekend Stockout Spike</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-accent font-bold uppercase">
              <span>[ Peak Surge: FRI - SAT ]</span>
            </div>
          </div>
        )}

      </div>

      {/* Grid: Category Breakdown & Quick AI Stockout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: FMCG Category Inventory Split */}
        <div className="bg-surface border-2 border-accent/30 rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-accent/20 pb-3">
            <h3 className="text-lg font-display font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span>CATEGORY STOCK DISTRIBUTION</span>
            </h3>
            <span className="text-[11px] font-mono text-accent font-bold border border-accent/30 px-2 py-0.5 rounded-none bg-accent/10">
              {dynamicCategoryDistribution.length} CATEGORIES
            </span>
          </div>

          {hasProducts ? (
            <>
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicCategoryDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(242, 237, 228, 0.08)" horizontal={false} />
                    <XAxis type="number" stroke="#7A7470" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} />
                    <YAxis dataKey="name" type="category" stroke="#7A7470" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} SKUs in Register`, "Tracked Stock"]}
                      contentStyle={{ backgroundColor: "#141210", borderColor: "rgba(201, 168, 76, 0.4)", fontFamily: "var(--font-mono)", fontSize: "11px" }}
                    />
                    <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                      {dynamicCategoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-accent/20 font-mono text-xs">
                {dynamicCategoryDistribution.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center text-text-secondary">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-none" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-bold text-text-primary">
                      {cat.count} SKUs {cat.critical > 0 && <span className="text-red-400">({cat.critical} Critical)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 w-full flex flex-col items-center justify-center text-center p-4 bg-surface-2/60 border border-accent/20 rounded-sm font-mono space-y-2">
              <Layers className="w-8 h-8 text-accent/30" />
              <p className="text-xs font-bold text-text-primary uppercase tracking-wider">[ 0 CATEGORIES TRACKED ]</p>
              <p className="text-[11px] text-text-secondary">Add products in Inventory to view store category distribution.</p>
            </div>
          )}
        </div>

        {/* Card 2: AI Kirana Reorder Action Panel */}
        <div className="bg-surface border-2 border-accent/30 rounded-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-accent/20 pb-3">
              <h3 className="text-lg font-display font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>AI REORDER INSIGHTS &amp; ACTIONS</span>
              </h3>
              <span className={`text-[10px] font-mono font-bold border px-2 py-0.5 rounded-none uppercase ${
                criticalItems.length > 0 ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              }`}>
                {criticalItems.length} HIGH URGENCY
              </span>
            </div>

            <p className="text-xs font-mono text-text-secondary">
              Based on live shelf scans and sales velocity for <strong className="text-accent uppercase">{currentStoreName}</strong>:
            </p>

            <div className="space-y-2 font-mono text-xs">
              {hasProducts ? (
                <>
                  <div className="p-3 bg-surface-2 border-l-4 border-l-red-500 border-y border-r border-accent/20 rounded-none space-y-1">
                    <div className="flex justify-between text-red-400 font-bold uppercase text-[11px]">
                      <span>• Stockout Risk Alert</span>
                      <span>48H HORIZON</span>
                    </div>
                    <p className="text-text-primary text-xs font-semibold">
                      {criticalItems.length > 0
                        ? `${criticalItems.map((p) => p.name).slice(0, 2).join(", ")} will run out before weekend peak.`
                        : "All logged SKUs are currently above critical depletion thresholds."}
                    </p>
                  </div>

                  <div className="p-3 bg-surface-2 border-l-4 border-l-accent border-y border-r border-accent/20 rounded-none space-y-1">
                    <div className="flex justify-between text-accent font-bold uppercase text-[11px]">
                      <span>• Recommended Wholesale Order</span>
                      <span>WHATSAPP READY</span>
                    </div>
                    <p className="text-text-secondary text-xs">
                      Automated reorder list created for primary FMCG distributor.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-surface-2 border-l-4 border-l-accent border-y border-r border-accent/20 rounded-none space-y-1">
                  <div className="text-accent font-bold uppercase text-[11px]">
                    • REGISTER STATUS: EMPTY
                  </div>
                  <p className="text-text-secondary text-xs">
                    No items registered in <strong className="text-accent uppercase">{currentStoreName}</strong>. Add products in the Inventory tab to enable 2-hour WhatsApp reorder feeds.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Nav Action */}
          <div className="pt-4 border-t border-accent/20">
            <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
              <span>View full SKU list &amp; quantities:</span>
              <button
                type="button"
                onClick={onSwitchToInventory}
                className="text-accent hover:text-accent-hover font-bold uppercase flex items-center gap-1 hover:underline transition-colors cursor-pointer"
              >
                <span>SWITCH TO INVENTORY TAB ➔</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
