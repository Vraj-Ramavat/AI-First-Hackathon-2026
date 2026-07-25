"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { ProductItem } from "./ProductModal";

interface InventoryTableProps {
  products: ProductItem[];
  loading?: boolean;
  currentStoreName?: string;
  onAddProductClick: () => void;
  onEditProductClick: (product: ProductItem) => void;
  onDeleteProductClick: (product: ProductItem) => void;
  onQuickQuantityChange: (productId: string, newQuantity: number) => void;
}

export default function InventoryTable({
  products,
  loading,
  currentStoreName = "Kirana Store",
  onAddProductClick,
  onEditProductClick,
  onDeleteProductClick,
  onQuickQuantityChange,
}: InventoryTableProps) {
  return (
    <div className="w-full bg-surface border-2 border-accent/30 rounded-sm overflow-hidden shadow-none">
      {/* Table Header / Ledger Register Banner */}
      <div className="p-6 border-b-2 border-accent/30 bg-gradient-to-r from-surface via-[#181512] to-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-text-primary uppercase tracking-wide flex items-center gap-3">
            <span>KIRANA DAILY INVENTORY REGISTER</span>
            <span className="text-xs font-mono font-bold text-accent px-2.5 py-0.5 rounded-none bg-accent/10 border border-accent/30 tracking-wider">
              [ {products.length} SKUs TRACKED ]
            </span>
          </h2>
          <p className="text-xs font-mono text-text-secondary mt-1">
            Real-time stock management &amp; computer vision shelf reading synced with{" "}
            <span className="text-accent font-bold uppercase">{currentStoreName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddProductClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-text-primary text-xs font-mono uppercase tracking-widest font-bold border border-accent/40 transition-all active:translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-text-primary" />
            <span>ADD FMCG PRODUCT</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE CARDS VIEW (Visible on mobile screens < md)             */}
      {/* ------------------------------------------------------------- */}
      <div className="block md:hidden p-3.5 space-y-3 font-mono">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-text-secondary">
            <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-none animate-spin mb-2" />
            <p className="uppercase tracking-wider">[ READING STORE LEDGER... ]</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-text-secondary space-y-2">
            <Package className="w-8 h-8 text-accent/40 mx-auto" />
            <p className="font-bold text-text-primary uppercase tracking-wider">No products logged in this register yet</p>
            <p className="text-text-secondary">Click &quot;ADD FMCG PRODUCT&quot; above to log items into your ledger.</p>
          </div>
        ) : (
          products.map((prod) => {
            const percent = prod.stockLevelPercent ?? 100;
            const status = prod.status || (percent <= 20 ? "CRITICAL" : percent <= 40 ? "LOW" : "IN_STOCK");

            return (
              <div key={prod.id} className="space-y-3 bg-surface-2/40 border-2 border-accent/25 rounded-sm p-3.5">
                {/* Header: Title + Status Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide">{prod.name}</h3>
                    <p className="text-[11px] text-text-secondary uppercase mt-0.5">{prod.category || "General FMCG"}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="shrink-0">
                    {status === "CRITICAL" && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest text-red-400 bg-red-500/10 border border-red-500/40">
                        CRITICAL
                      </span>
                    )}
                    {status === "LOW" && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/40">
                        REORDER
                      </span>
                    )}
                    {status === "IN_STOCK" && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/40">
                        IN STOCK
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Quantity Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-accent/15 text-xs">
                  {/* Price */}
                  <div>
                    <span className="text-[9px] text-text-secondary uppercase block tracking-wider">PRICE</span>
                    <span className="font-bold text-accent">
                      {prod.price ? `₹${prod.price.toFixed(2)} / ${prod.unit || "unit"}` : "—"}
                    </span>
                  </div>

                  {/* Quantity & Quick Adjust */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQuickQuantityChange(prod.id, Math.max(0, prod.quantity - 1))}
                      className="w-7 h-7 rounded-sm bg-surface border border-accent/30 flex items-center justify-center text-accent font-bold hover:bg-accent hover:text-base text-sm active:scale-95"
                      title="Quick Decrement"
                    >
                      -
                    </button>
                    <div className="text-center px-1">
                      <span className="font-bold text-text-primary text-xs block">
                        {prod.quantity} {prod.unit}
                      </span>
                    </div>
                    <button
                      onClick={() => onQuickQuantityChange(prod.id, prod.quantity + 1)}
                      className="w-7 h-7 rounded-sm bg-surface border border-accent/30 flex items-center justify-center text-accent font-bold hover:bg-accent hover:text-base text-sm active:scale-95"
                      title="Quick Increment"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Stock Level Notched Gauge Bar */}
                <div className="space-y-1 pt-2 border-t border-accent/15">
                  <div className="flex justify-between items-center text-[10px] text-text-secondary">
                    <span>EST. SHELF STOCK GAUGE</span>
                    <span className="text-accent font-bold">{percent}% FULL</span>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-surface border border-accent/20 rounded-sm">
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => {
                      const isFilled = percent >= step;
                      return (
                        <div
                          key={step}
                          className={`flex-1 h-3 rounded-none transition-all ${
                            isFilled
                              ? status === "CRITICAL"
                                ? "bg-red-500"
                                : status === "LOW"
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                              : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-accent/15">
                  <button
                    onClick={() => onEditProductClick(prod)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-accent/30 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>
                  <button
                    onClick={() => onDeleteProductClick(prod)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP LEDGER TABLE (Visible on screens >= md)               */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-[#181512] text-accent font-mono border-b-2 border-accent/30 text-[11px] tracking-widest">
              <th className="py-3.5 px-6 font-bold uppercase">PRODUCT NAME</th>
              <th className="py-3.5 px-6 font-bold uppercase">CATEGORY</th>
              <th className="py-3.5 px-6 font-bold uppercase">QUANTITY &amp; ADJUST</th>
              <th className="py-3.5 px-6 font-bold uppercase">EST. STOCK GAUGE</th>
              <th className="py-3.5 px-6 font-bold uppercase">STATUS TAG</th>
              <th className="py-3.5 px-6 font-bold uppercase text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/15">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-mono text-text-secondary">
                  <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-none animate-spin mb-2" />
                  <p className="uppercase tracking-wider">[ READING STORE LEDGER... ]</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-mono text-text-secondary space-y-2">
                  <Package className="w-8 h-8 text-accent/40 mx-auto" />
                  <p className="font-bold text-text-primary uppercase tracking-wider">No products logged in this register yet</p>
                  <p className="text-text-secondary">Click &quot;ADD FMCG PRODUCT&quot; above to log items into your ledger.</p>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const percent = prod.stockLevelPercent ?? 100;
                const status = prod.status || (percent <= 20 ? "CRITICAL" : percent <= 40 ? "LOW" : "IN_STOCK");

                return (
                  <tr key={prod.id} className="hover:bg-surface-2/60 transition-colors">
                    {/* Product Name */}
                    <td className="py-4 px-6 font-mono font-bold text-text-primary">
                      <div className="text-sm font-semibold tracking-wide text-text-primary">{prod.name}</div>
                      {prod.price ? (
                        <span className="block text-[11px] font-mono text-accent font-bold mt-0.5">
                          ₹{prod.price.toFixed(2)} / {prod.unit || "unit"}
                        </span>
                      ) : null}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-text-secondary font-mono text-xs uppercase tracking-wider">
                      {prod.category || "General FMCG"}
                    </td>

                    {/* Quantity & Quick Adjust */}
                    <td className="py-4 px-6 font-mono">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickQuantityChange(prod.id, Math.max(0, prod.quantity - 1))}
                          className="w-6 h-6 rounded-none bg-surface-2 border border-accent/30 flex items-center justify-center text-accent font-bold hover:bg-accent hover:text-base transition-colors text-xs"
                          title="Quick Decrement (Sold)"
                        >
                          -
                        </button>
                        <span className="font-bold text-text-primary text-xs px-1 min-w-[50px] text-center tracking-wider">
                          {prod.quantity} {prod.unit}
                        </span>
                        <button
                          onClick={() => onQuickQuantityChange(prod.id, prod.quantity + 1)}
                          className="w-6 h-6 rounded-none bg-surface-2 border border-accent/30 flex items-center justify-center text-accent font-bold hover:bg-accent hover:text-base transition-colors text-xs"
                          title="Quick Increment (Stock Received)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Physical Gauge Meter (Notched Tick Fill) */}
                    <td className="py-4 px-6 font-mono">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-accent font-bold min-w-[36px]">
                          {percent}%
                        </span>
                        <div className="flex items-center gap-1 p-1 bg-surface-2 border border-accent/20 rounded-none" title={`Stock level: ${percent}%`}>
                          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => {
                            const isFilled = percent >= step;
                            return (
                              <div
                                key={step}
                                className={`w-1.5 h-3.5 rounded-none transition-all ${
                                  isFilled
                                    ? status === "CRITICAL"
                                      ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                                      : status === "LOW"
                                      ? "bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.5)]"
                                      : "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]"
                                    : "bg-white/10"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Embossed Metal Price Tag / Seal Status Badge */}
                    <td className="py-4 px-6 font-mono">
                      {status === "CRITICAL" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-red-400 bg-red-500/10 border border-red-500/40 rounded-none relative before:w-1 before:h-1 before:bg-base before:border before:border-red-500/60 before:rounded-full">
                          CRITICAL DEPLETION
                        </span>
                      )}
                      {status === "LOW" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded-none relative before:w-1 before:h-1 before:bg-base before:border before:border-amber-500/60 before:rounded-full">
                          REORDER SOON
                        </span>
                      )}
                      {status === "IN_STOCK" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-none relative before:w-1 before:h-1 before:bg-base before:border before:border-emerald-500/60 before:rounded-full">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProductClick(prod)}
                          className="p-1.5 rounded-none bg-surface-2 border border-accent/20 text-accent hover:bg-accent/20 hover:border-accent transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProductClick(prod)}
                          className="p-1.5 rounded-none bg-surface-2 border border-accent/20 text-text-secondary hover:text-red-400 hover:border-red-500/40 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
