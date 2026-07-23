"use client";

import { useState } from "react";
import { Camera, Sparkles, Check, Send, RotateCcw } from "lucide-react";
import WhatsAppBubble from "@/src/components/WhatsAppBubble";

interface ShelfSample {
  id: string;
  title: string;
  category: string;
  imageBg: string;
  itemsDetected: Array<{ name: string; estimatedStock: string; fillPercent: number; urgency: "CRITICAL" | "LOW" | "HEALTHY" }>;
  reorderDraft: Array<{ name: string; qty: string; alertType: "CRITICAL" | "LOW" }>;
}

export default function DemoSection() {
  const samples: ShelfSample[] = [
    {
      id: "maggi",
      title: "Maggi & Noodles Shelf",
      category: "Snacks & Instant Food",
      imageBg: "from-amber-900/30 via-amber-950/20 to-base",
      itemsDetected: [
        { name: "Maggi 70g Masala Noodles", estimatedStock: "8 pkts", fillPercent: 12, urgency: "CRITICAL" },
        { name: "Yippee 60g Noodles", estimatedStock: "28 pkts", fillPercent: 45, urgency: "LOW" },
        { name: "Knorr Soups", estimatedStock: "42 pkts", fillPercent: 80, urgency: "HEALTHY" },
      ],
      reorderDraft: [
        { name: "Maggi 70g Masala Noodles", qty: "48 pkts (2 crates)", alertType: "CRITICAL" },
        { name: "Yippee 60g Noodles", qty: "24 pkts (1 crate)", alertType: "LOW" },
      ],
    },
    {
      id: "parleg",
      title: "Parle-G & Biscuits Rack",
      category: "Biscuits & Bakery",
      imageBg: "from-yellow-900/30 via-yellow-950/20 to-base",
      itemsDetected: [
        { name: "Parle-G 80g Biscuit", estimatedStock: "18 pkts", fillPercent: 22, urgency: "CRITICAL" },
        { name: "Britannia Good Day 100g", estimatedStock: "35 pkts", fillPercent: 60, urgency: "HEALTHY" },
        { name: "Monaco 75g Biscuit", estimatedStock: "12 pkts", fillPercent: 28, urgency: "LOW" },
      ],
      reorderDraft: [
        { name: "Parle-G 80g Biscuit", qty: "60 pkts (3 cartons)", alertType: "CRITICAL" },
        { name: "Monaco 75g Biscuit", qty: "30 pkts (1 carton)", alertType: "LOW" },
      ],
    },
    {
      id: "amul",
      title: "Amul Milk & Dairy Chiller",
      category: "Dairy & Perishables",
      imageBg: "from-blue-900/30 via-blue-950/20 to-base",
      itemsDetected: [
        { name: "Amul Taaza Milk 500ml", estimatedStock: "6 pouches", fillPercent: 10, urgency: "CRITICAL" },
        { name: "Amul Butter 100g", estimatedStock: "15 units", fillPercent: 40, urgency: "LOW" },
        { name: "Amul Curd 400g Pouch", estimatedStock: "24 units", fillPercent: 75, urgency: "HEALTHY" },
      ],
      reorderDraft: [
        { name: "Amul Taaza Milk 500ml", qty: "40 pouches (2 crates)", alertType: "CRITICAL" },
        { name: "Amul Butter 100g", qty: "20 units", alertType: "LOW" },
      ],
    },
  ];

  const [selectedSample, setSelectedSample] = useState<ShelfSample>(samples[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);
  const [orderSent, setOrderSent] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setOrderSent(false);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1400);
  };

  return (
    <section id="demo" className="py-32 sm:py-40 px-6 sm:px-8 max-w-7xl mx-auto hairline-t space-y-16 my-8">
      {/* Section Header */}
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          Interactive Live Simulator
        </p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Snap a shelf. Watch computer vision scan &amp; trigger WhatsApp reorders.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Select a sample Kirana shelf below to simulate StockSaathi&apos;s computer vision inference and automated supplier ordering workflow in real-time.
        </p>
      </div>

      {/* Sample Selector Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => {
              setSelectedSample(sample);
              setOrderSent(false);
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
              selectedSample.id === sample.id
                ? "bg-accent text-base font-bold shadow-md shadow-accent/10"
                : "bg-surface hairline-all text-text-secondary hover:text-text-primary hover:bg-surface-2"
            }`}
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Interactive Demo Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Simulated Camera Scanner Mockup */}
        <div className="lg:col-span-7 rounded-3xl bg-surface hairline-all p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-text-primary font-medium uppercase tracking-wider">
                Kirana Camera Feed • {selectedSample.category}
              </span>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 hairline-all text-xs font-mono text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>Rescan Photo</span>
            </button>
          </div>

          {/* Scanner Viewport */}
          <div className={`relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${selectedSample.imageBg} hairline-all p-6 flex flex-col justify-between overflow-hidden`}>
            
            {/* Simulated Shelf Visual Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1915_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

            {/* Scanning Line Effect during scan */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-line z-20" />
            )}

            {/* Top HUD overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-text-secondary">
              <span className="bg-base/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10">
                Resolution: 1080p
              </span>
              <span className="bg-base/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 text-accent">
                {isScanning ? "Running CV Inference..." : "Scan Complete"}
              </span>
            </div>

            {/* Shelf Items Overlay Bounding Boxes */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
              {selectedSample.itemsDetected.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl backdrop-blur transition-all duration-500 border ${
                    hasScanned ? "bg-base/85 opacity-100 scale-100" : "opacity-40 scale-95"
                  } ${
                    item.urgency === "CRITICAL"
                      ? "border-red-500/50 shadow-lg shadow-red-500/10"
                      : item.urgency === "LOW"
                      ? "border-amber-500/50"
                      : "border-emerald-500/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-text-primary leading-tight">
                      {item.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        item.urgency === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : item.urgency === "LOW"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {item.fillPercent}% FULL
                    </span>
                  </div>

                  {/* Stock Fill Progress Bar */}
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        item.urgency === "CRITICAL"
                          ? "bg-red-500"
                          : item.urgency === "LOW"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${item.fillPercent}%` }}
                    />
                  </div>

                  <p className="text-[10px] font-mono text-text-secondary">
                    Est. Stock: <span className="text-text-primary font-bold">{item.estimatedStock}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom HUD */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-text-secondary">
              <span>Model: Kirana-CV-v2.1</span>
              <span>Confidence: 96.8%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <span>AI calculates stock levels directly from packaging volume—no manual scanning required.</span>
          </div>

        </div>

        {/* Right Column: Automated WhatsApp Reorder Alert Preview */}
        <div className="lg:col-span-5 rounded-3xl bg-surface hairline-all p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-2 border-b border-white/10 pb-4">
            <p className="text-xs font-mono text-accent uppercase tracking-wider">
              Step 3 Result • Auto Decision Engine
            </p>
            <h3 className="text-xl font-display font-bold text-text-primary">
              Generated WhatsApp Reorder Alert
            </h3>
            <p className="text-xs text-text-secondary">
              Based on sales velocity &amp; current stock, StockSaathi has drafted the supplier message below:
            </p>
          </div>

          {/* WhatsApp Authentic Preview */}
          <div className="flex justify-center py-2">
            <WhatsAppBubble
              storeName="Gupta Kirana Store (Ahmadabad)"
              supplierName="Mahalakshmi Wholesale FMCG"
              items={selectedSample.reorderDraft}
              timestamp="Just now"
              status="sent"
            />
          </div>

          {/* Reorder Action Simulator */}
          <div className="space-y-3 pt-2">
            {orderSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-400 font-mono">
                <Check className="w-4 h-4 shrink-0" />
                <span>WhatsApp reorder successfully transmitted to wholesaler!</span>
              </div>
            ) : (
              <button
                onClick={() => setOrderSent(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
              >
                <Send className="w-4 h-4" />
                <span>Approve &amp; Send WhatsApp Order</span>
              </button>
            )}

            <p className="text-[11px] text-text-secondary text-center">
              Requires 1-tap confirmation from the store owner to avoid unwanted orders.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
