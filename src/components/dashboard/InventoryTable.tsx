"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";

export interface KiranaProduct {
  id: string;
  name: string;
  category: string;
  stockLevelPercent: number;
  estUnitsLeft: number;
  dailyConsumptionAvg: number;
  status: "CRITICAL" | "LOW" | "IN_STOCK";
  sparklineData: Array<{ day: string; stock: number }>;
}

const mockProducts: KiranaProduct[] = [
  {
    id: "P-101",
    name: "Maggi 70g Masala Noodles",
    category: "Instant Noodles",
    stockLevelPercent: 12,
    estUnitsLeft: 8,
    dailyConsumptionAvg: 24,
    status: "CRITICAL",
    sparklineData: [
      { day: "M", stock: 85 },
      { day: "T", stock: 68 },
      { day: "W", stock: 50 },
      { day: "T", stock: 35 },
      { day: "F", stock: 22 },
      { day: "S", stock: 15 },
      { day: "S", stock: 8 },
    ],
  },
  {
    id: "P-102",
    name: "Fortune Sunlite Oil 1L",
    category: "Edible Oil",
    stockLevelPercent: 15,
    estUnitsLeft: 6,
    dailyConsumptionAvg: 12,
    status: "CRITICAL",
    sparklineData: [
      { day: "M", stock: 90 },
      { day: "T", stock: 75 },
      { day: "W", stock: 60 },
      { day: "T", stock: 42 },
      { day: "F", stock: 30 },
      { day: "S", stock: 20 },
      { day: "S", stock: 6 },
    ],
  },
  {
    id: "P-103",
    name: "Parle-G 80g Biscuit",
    category: "Biscuits",
    stockLevelPercent: 28,
    estUnitsLeft: 22,
    dailyConsumptionAvg: 40,
    status: "LOW",
    sparklineData: [
      { day: "M", stock: 100 },
      { day: "T", stock: 85 },
      { day: "W", stock: 70 },
      { day: "T", stock: 55 },
      { day: "F", stock: 40 },
      { day: "S", stock: 30 },
      { day: "S", stock: 22 },
    ],
  },
  {
    id: "P-104",
    name: "Colgate Strong Teeth 100g",
    category: "Oral Care",
    stockLevelPercent: 32,
    estUnitsLeft: 14,
    dailyConsumptionAvg: 10,
    status: "LOW",
    sparklineData: [
      { day: "M", stock: 70 },
      { day: "T", stock: 62 },
      { day: "W", stock: 50 },
      { day: "T", stock: 40 },
      { day: "F", stock: 32 },
      { day: "S", stock: 20 },
      { day: "S", stock: 14 },
    ],
  },
  {
    id: "P-105",
    name: "Amul Taaza Milk 500ml",
    category: "Dairy & Eggs",
    stockLevelPercent: 85,
    estUnitsLeft: 42,
    dailyConsumptionAvg: 50,
    status: "IN_STOCK",
    sparklineData: [
      { day: "M", stock: 20 },
      { day: "T", stock: 95 },
      { day: "W", stock: 80 },
      { day: "T", stock: 90 },
      { day: "F", stock: 85 },
      { day: "S", stock: 70 },
      { day: "S", stock: 42 },
    ],
  },
  {
    id: "P-106",
    name: "Tata Salt 1kg Pack",
    category: "Staples & Spices",
    stockLevelPercent: 90,
    estUnitsLeft: 58,
    dailyConsumptionAvg: 15,
    status: "IN_STOCK",
    sparklineData: [
      { day: "M", stock: 98 },
      { day: "T", stock: 94 },
      { day: "W", stock: 92 },
      { day: "T", stock: 88 },
      { day: "F", stock: 85 },
      { day: "S", stock: 72 },
      { day: "S", stock: 58 },
    ],
  },
];

export default function InventoryTable() {
  return (
    <div className="w-full bg-surface rounded-2xl hairline-all overflow-hidden">
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-text-primary">
            Kirana Live Inventory Monitor
          </h2>
          <p className="text-xs text-text-secondary">
            Estimates derived from computer vision shelf reading &amp; sales history forecasting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Synced with Gupta Kirana Store</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-2 text-text-secondary font-mono border-b border-white/10">
              <th className="py-3.5 px-6 font-medium">SKU ID</th>
              <th className="py-3.5 px-6 font-medium">PRODUCT NAME</th>
              <th className="py-3.5 px-6 font-medium">CATEGORY</th>
              <th className="py-3.5 px-6 font-medium">EST. STOCK %</th>
              <th className="py-3.5 px-6 font-medium">7-DAY FORECAST</th>
              <th className="py-3.5 px-6 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockProducts.map((prod) => (
              <tr key={prod.id} className="hover:bg-surface-2/60 transition-colors">
                {/* ID */}
                <td className="py-4 px-6 font-mono text-text-secondary">
                  {prod.id}
                </td>

                {/* Product Name */}
                <td className="py-4 px-6 font-medium text-text-primary">
                  {prod.name}
                  <span className="block text-[10px] font-mono text-text-secondary font-normal">
                    {prod.estUnitsLeft} units left (Avg {prod.dailyConsumptionAvg}/day)
                  </span>
                </td>

                {/* Category */}
                <td className="py-4 px-6 text-text-secondary font-mono">
                  {prod.category}
                </td>

                {/* Stock Level Bar */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-primary font-bold min-w-[36px]">
                      {prod.stockLevelPercent}%
                    </span>
                    <div className="w-24 h-2 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          prod.status === "CRITICAL"
                            ? "bg-status-critical"
                            : prod.status === "LOW"
                            ? "bg-status-low"
                            : "bg-status-stock"
                        }`}
                        style={{ width: `${prod.stockLevelPercent}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Sparkline Chart */}
                <td className="py-4 px-6 w-36">
                  <div className="h-8 w-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prod.sparklineData}>
                        <Line
                          type="monotone"
                          dataKey="stock"
                          stroke={
                            prod.status === "CRITICAL"
                              ? "#EF4444"
                              : prod.status === "LOW"
                              ? "#F59E0B"
                              : "#4ADE80"
                          }
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>

                {/* Desaturated Status Badge */}
                <td className="py-4 px-6 font-mono">
                  {prod.status === "CRITICAL" && (
                    <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                      CRITICAL DEPLETION
                    </span>
                  )}
                  {prod.status === "LOW" && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                      REORDER SOON
                    </span>
                  )}
                  {prod.status === "IN_STOCK" && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      IN STOCK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
