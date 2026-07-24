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
    <div className="w-full bg-surface rounded-2xl hairline-all overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
            <span>Kirana Live Inventory Monitor</span>
            <span className="text-xs font-mono font-normal text-text-secondary px-2.5 py-0.5 rounded-full bg-surface-2 border border-white/5">
              {products.length} Items
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time stock management &amp; computer vision shelf reading synced with{" "}
            <span className="text-accent font-semibold">{currentStoreName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddProductClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-text-primary text-xs font-mono font-semibold transition-all shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4 text-text-primary" />
            <span>Add FMCG Product</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-2 text-text-secondary font-mono border-b border-white/10">
              <th className="py-3.5 px-6 font-medium">PRODUCT NAME</th>
              <th className="py-3.5 px-6 font-medium">CATEGORY</th>
              <th className="py-3.5 px-6 font-medium">QUANTITY &amp; ADJUST</th>
              <th className="py-3.5 px-6 font-medium">EST. STOCK %</th>
              <th className="py-3.5 px-6 font-medium">STATUS</th>
              <th className="py-3.5 px-6 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-mono text-text-secondary">
                  <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-2" />
                  <p>Loading store inventory...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-mono text-text-secondary space-y-2">
                  <Package className="w-8 h-8 text-accent/40 mx-auto" />
                  <p className="font-semibold text-text-primary">No products in this store yet</p>
                  <p>Click &quot;Add FMCG Product&quot; above to start tracking stock.</p>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const percent = prod.stockLevelPercent ?? 100;
                const status = prod.status || (percent <= 20 ? "CRITICAL" : percent <= 40 ? "LOW" : "IN_STOCK");

                return (
                  <tr key={prod.id} className="hover:bg-surface-2/60 transition-colors">
                    {/* Product Name */}
                    <td className="py-4 px-6 font-medium text-text-primary">
                      {prod.name}
                      {prod.price ? (
                        <span className="block text-[10px] font-mono text-accent">
                          ₹{prod.price.toFixed(2)} per {prod.unit || "unit"}
                        </span>
                      ) : null}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-text-secondary font-mono">
                      {prod.category || "General FMCG"}
                    </td>

                    {/* Quantity & Quick Adjust */}
                    <td className="py-4 px-6 font-mono">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickQuantityChange(prod.id, Math.max(0, prod.quantity - 1))}
                          className="w-6 h-6 rounded-md bg-surface-2 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-base"
                          title="Quick Decrement (Sold)"
                        >
                          -
                        </button>
                        <span className="font-bold text-text-primary text-xs px-1 min-w-[40px] text-center">
                          {prod.quantity} {prod.unit}
                        </span>
                        <button
                          onClick={() => onQuickQuantityChange(prod.id, prod.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-surface-2 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-base"
                          title="Quick Increment (Stock Received)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Stock Level Bar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-text-primary font-bold min-w-[36px]">
                          {percent}%
                        </span>
                        <div className="w-24 h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              status === "CRITICAL"
                                ? "bg-status-critical"
                                : status === "LOW"
                                ? "bg-status-low"
                                : "bg-status-stock"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Desaturated Status Badge */}
                    <td className="py-4 px-6 font-mono">
                      {status === "CRITICAL" && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                          CRITICAL DEPLETION
                        </span>
                      )}
                      {status === "LOW" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          REORDER SOON
                        </span>
                      )}
                      {status === "IN_STOCK" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProductClick(prod)}
                          className="p-1.5 rounded-lg bg-surface-2/80 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-accent" />
                        </button>
                        <button
                          onClick={() => onDeleteProductClick(prod)}
                          className="p-1.5 rounded-lg bg-surface-2/80 hover:bg-surface-2 text-text-secondary hover:text-red-400 transition-colors"
                          title="Delete Product"
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
