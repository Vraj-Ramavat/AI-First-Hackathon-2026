"use client";

import { useState, useEffect } from "react";
import { Check, X, Sparkles, Plus, Edit2, AlertCircle, RefreshCw } from "lucide-react";
import { ProductItem } from "./ProductModal";

export interface ScanItemReview {
  id: string;
  action: "CREATE_NEW" | "UPDATE_EXISTING";
  existingProductId?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  confidence: "high" | "medium" | "low";
  included: boolean;
}

interface ScanReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStoreId: string;
  existingProducts: ProductItem[];
  detectedItems: ScanItemReview[];
  notes?: string;
  onConfirmSuccess: () => void;
}

export default function ScanReviewModal({
  isOpen,
  onClose,
  currentStoreId,
  existingProducts,
  detectedItems: initialItems,
  notes,
  onConfirmSuccess,
}: ScanReviewModalProps) {
  const [items, setItems] = useState<ScanItemReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems, isOpen]);

  if (!isOpen) return null;

  const toggleInclude = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, included: !item.included } : item))
    );
  };

  const updateItemField = (id: string, field: keyof ScanItemReview, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const selectedCount = items.filter((i) => i.included).length;

  const handleConfirm = async () => {
    setError("");
    const selectedItems = items.filter((i) => i.included);

    if (selectedItems.length === 0) {
      setError("Please select at least one item to add to your inventory.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process selected items sequentially through existing store product APIs
      for (const item of selectedItems) {
        if (item.action === "UPDATE_EXISTING" && item.existingProductId) {
          // Update existing product
          await fetch(`/api/products/${item.existingProductId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: Number(item.quantity),
              ...(item.name && { name: item.name }),
              ...(item.category && { category: item.category }),
              ...(item.unit && { unit: item.unit }),
              ...(item.price !== undefined && { price: Number(item.price) }),
            }),
          });
        } else {
          // Create new product
          await fetch(`/api/stores/${currentStoreId}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: item.name,
              category: item.category || "General FMCG",
              quantity: Number(item.quantity),
              unit: item.unit || "pkts",
              price: Number(item.price || 0),
              lowStockThreshold: 15,
            }),
          });
        }
      }

      onConfirmSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to apply inventory updates. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-surface-2 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                Review &amp; Confirm AI Scan Output
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Review detected items before saving. Nothing is written to your database until confirmed.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-base/60 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notes && (
          <div className="p-3 rounded-xl bg-surface/60 border border-white/5 text-xs font-mono text-text-secondary flex items-center justify-between">
            <span>AI Notes: {notes}</span>
            <span className="text-accent text-[10px] font-bold uppercase">Human Review Step</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-red-300 text-xs shrink-0">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Review Items Table */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-text-secondary font-mono text-xs">
              <p className="font-semibold text-text-primary">No products clearly identified</p>
              <p>Couldn&apos;t detect packaging items. Try taking a closer or better-lit photo.</p>
            </div>
          ) : (
            items.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    item.included
                      ? "bg-surface border-white/10"
                      : "bg-surface/30 border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Include Checkbox & Action Pill */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.included}
                        onChange={() => toggleInclude(item.id)}
                        className="w-4 h-4 rounded border-white/20 bg-base text-accent focus:ring-accent"
                      />
                      {item.action === "UPDATE_EXISTING" ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                          UPDATE EXISTING PRODUCT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                          NEW PRODUCT
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-text-secondary">
                      Confidence: <strong className="text-text-primary uppercase">{item.confidence}</strong>
                    </span>
                  </div>

                  {/* Editable Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Name */}
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        disabled={!item.included}
                        onChange={(e) => updateItemField(item.id, "name", e.target.value)}
                        className="w-full bg-base border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent disabled:opacity-50"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">
                        Est. Quantity
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          disabled={!item.included}
                          onChange={(e) => updateItemField(item.id, "quantity", Number(e.target.value))}
                          className="w-full bg-base border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:border-accent disabled:opacity-50"
                        />
                        <span className="text-xs font-mono text-text-secondary">{item.unit}</span>
                      </div>
                    </div>

                    {/* Action Selector Override */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">
                        Match Action
                      </label>
                      <select
                        value={item.action === "UPDATE_EXISTING" ? item.existingProductId : "NEW"}
                        disabled={!item.included}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "NEW") {
                            updateItemField(item.id, "action", "CREATE_NEW");
                            updateItemField(item.id, "existingProductId", undefined);
                          } else {
                            updateItemField(item.id, "action", "UPDATE_EXISTING");
                            updateItemField(item.id, "existingProductId", val);
                          }
                        }}
                        className="w-full bg-base border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent disabled:opacity-50 truncate"
                      >
                        <option value="NEW">+ Create as New Product</option>
                        {existingProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            Update: {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-white/10 text-xs font-mono text-text-secondary hover:bg-base/60"
          >
            Discard Scan
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || selectedCount === 0}
            className="py-2.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-xs font-mono font-bold text-text-primary shadow-lg shadow-accent/10 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Apply ({selectedCount} Selected)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
