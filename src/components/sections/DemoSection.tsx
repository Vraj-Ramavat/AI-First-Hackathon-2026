"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Camera, Sparkles, Check, Send, RotateCcw } from "lucide-react";
import WhatsAppBubble from "@/src/components/WhatsAppBubble";

const Demo3DCanvas = dynamic(() => import("@/src/components/Demo3DCanvas"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 rounded-xl bg-surface-2/30 animate-pulse shrink-0" />,
});

interface ShelfSample {
  id: string;
  title: string;
  category: string;
  imageBg: string;
  itemsDetected: Array<{ name: string; estimatedStock: string; fillPercent: number; urgency: "CRITICAL" | "LOW" | "HEALTHY" }>;
  reorderDraft: Array<{ name: string; qty: string; alertType: "CRITICAL" | "LOW" }>;
}

export default function DemoSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const samples: ShelfSample[] = [
    {
      id: "maggi",
      title: "Maggi & Noodles Shelf",
      category: "Snacks & Instant Food",
      imageBg: "from-amber-950/20 via-base to-base",
      itemsDetected: [
        { name: "Maggi 70g Masala Noodles", estimatedStock: "8 pkts left", fillPercent: 12, urgency: "CRITICAL" },
        { name: "Yippee 60g Noodles", estimatedStock: "28 pkts left", fillPercent: 45, urgency: "LOW" },
        { name: "Knorr Instant Soups", estimatedStock: "42 pkts left", fillPercent: 80, urgency: "HEALTHY" },
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
      imageBg: "from-yellow-950/20 via-base to-base",
      itemsDetected: [
        { name: "Parle-G 80g Biscuit", estimatedStock: "18 pkts left", fillPercent: 22, urgency: "CRITICAL" },
        { name: "Britannia Good Day 100g", estimatedStock: "35 pkts left", fillPercent: 60, urgency: "HEALTHY" },
        { name: "Monaco 75g Biscuit", estimatedStock: "12 pkts left", fillPercent: 28, urgency: "LOW" },
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
      imageBg: "from-blue-950/20 via-base to-base",
      itemsDetected: [
        { name: "Amul Taaza Milk 500ml", estimatedStock: "6 pouches left", fillPercent: 10, urgency: "CRITICAL" },
        { name: "Amul Butter 100g", estimatedStock: "15 units left", fillPercent: 40, urgency: "LOW" },
        { name: "Amul Curd 400g Pouch", estimatedStock: "24 units left", fillPercent: 75, urgency: "HEALTHY" },
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
    <section id="demo" className="py-12 sm:py-16 px-6 sm:px-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-accent">
            Interactive Live Simulator
          </p>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
            Snap a shelf. Watch computer vision scan &amp; trigger WhatsApp reorders.
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            Select a sample Kirana shelf below to simulate StockSaathi&apos;s computer vision inference and automated supplier ordering workflow in real-time.
          </p>
        </div>

        {!isMobile && <Demo3DCanvas />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => {
              setSelectedSample(sample);
              setOrderSent(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
              selectedSample.id === sample.id
                ? "bg-accent text-base font-bold shadow-md shadow-accent/10"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
            }`}
          >
            {sample.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-text-primary font-medium uppercase tracking-wider">
                Kirana Camera Feed • {selectedSample.category}
              </span>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:underline transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>Rescan Photo</span>
            </button>
          </div>

          <div className={`relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b ${selectedSample.imageBg} hairline-all p-5 flex flex-col justify-between overflow-hidden`}>
            {isScanning && (
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-line z-20" />
            )}

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-text-secondary">
              <span className="bg-base/80 px-2.5 py-1 rounded border border-white/10">
                1080p Lens Feed
              </span>
              <span className="text-accent">
                {isScanning ? "Running CV Model..." : "Inference Ready"}
              </span>
            </div>

            <div className="relative z-10 space-y-2.5 my-auto">
              {selectedSample.itemsDetected.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl bg-base/85 backdrop-blur transition-all duration-300 ${
                    hasScanned ? "opacity-100 scale-100" : "opacity-40 scale-95"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-text-primary">{item.name}</p>
                    <p className="text-[10px] font-mono text-text-secondary">{item.estimatedStock}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold block ${
                        item.urgency === "CRITICAL"
                          ? "text-red-400"
                          : item.urgency === "LOW"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {item.fillPercent}% FULL
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase ${
                        item.urgency === "CRITICAL"
                          ? "text-red-400/80"
                          : item.urgency === "LOW"
                          ? "text-amber-400/80"
                          : "text-emerald-400/80"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-text-secondary">
              <span>Model: Kirana-CV-v2.1</span>
              <span>Accuracy: 96.8%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <span>Estimates fullness directly from visual volume—no barcode guns required.</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1 border-b border-white/10 pb-3">
            <p className="text-xs font-mono text-accent uppercase tracking-wider">
              Step 3 Result • Auto Decision Engine
            </p>
            <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary">
              Generated WhatsApp Reorder Alert
            </h3>
            <p className="text-xs text-text-secondary">
              Based on sales velocity &amp; current stock, StockSaathi has drafted the supplier message below:
            </p>
          </div>

          <div className="flex justify-center py-1">
            <WhatsAppBubble
              storeName="Gupta Kirana Store (Ahmedabad)"
              supplierName="Mahalakshmi Wholesale FMCG"
              items={selectedSample.reorderDraft}
              timestamp="Just now"
              status="sent"
            />
          </div>

          <div className="space-y-2 pt-1">
            {orderSent ? (
              <div className="p-3 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>WhatsApp reorder transmitted to wholesaler!</span>
              </div>
            ) : (
              <button
                onClick={() => setOrderSent(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
              >
                <Send className="w-4 h-4" />
                <span>Approve &amp; Send WhatsApp Order</span>
              </button>
            )}

            <p className="text-[10px] text-text-secondary text-center">
              Requires 1-tap confirmation from shopkeeper.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}