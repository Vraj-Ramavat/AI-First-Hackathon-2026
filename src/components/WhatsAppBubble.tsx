"use client";

import { CheckCheck } from "lucide-react";

interface WhatsAppBubbleProps {
  storeName?: string;
  supplierName?: string;
  items?: Array<{ name: string; qty: string; alertType: "CRITICAL" | "LOW" }>;
  timestamp?: string;
  status?: "sent" | "delivered" | "read";
  className?: string;
}

export default function WhatsAppBubble({
  storeName = "Gupta Kirana Store",
  supplierName = "Wholesale Mart Distributors",
  items = [
    { name: "Maggi 70g Masala Noodles", qty: "48 pkts (2 crates)", alertType: "CRITICAL" },
    { name: "Parle-G 80g Biscuit", qty: "30 pkts", alertType: "LOW" },
  ],
  timestamp = "10:42 AM",
  status = "read",
  className = "",
}: WhatsAppBubbleProps) {
  return (
    <div className={`w-full max-w-sm rounded-lg p-3 shadow-xl bg-[#075E54] text-white font-sans text-xs sm:text-sm border border-[#128C7E]/40 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#25D366] text-black font-bold flex items-center justify-center text-[10px]">
            WA
          </div>
          <div>
            <p className="font-semibold text-white leading-none text-xs">{storeName}</p>
            <p className="text-[10px] text-white/70">To: {supplierName}</p>
          </div>
        </div>
        <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full font-mono font-medium">
          Auto-Reorder Draft
        </span>
      </div>

      {/* Message Body */}
      <div className="space-y-1.5 text-white/95">
        <p className="text-xs">
          Namaste Ji! 🙏 StockSaathi automated inventory alert:
        </p>

        <div className="bg-[#054C44] p-2.5 rounded border border-white/10 space-y-1 my-2">
          <p className="text-[11px] font-mono text-[#25D366] uppercase tracking-wider mb-1">
            Recommended Order List:
          </p>
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 last:border-0 pb-1 last:pb-0">
              <span className="font-medium text-white/90">
                • {item.name}
              </span>
              <span className="font-mono text-white/80 text-[11px] bg-black/20 px-1.5 py-0.5 rounded">
                {item.qty}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/80 italic">
          Please confirm dispatch by replying &quot;YES&quot; to this message.
        </p>
      </div>

      {/* WhatsApp Message Footer Timestamp & Checkmarks */}
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-white/60">
        <span>{timestamp}</span>
        <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
      </div>
    </div>
  );
}
