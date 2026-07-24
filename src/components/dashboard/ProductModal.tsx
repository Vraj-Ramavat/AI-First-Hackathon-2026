"use client";

import { useState, useEffect } from "react";
import { Package, X, Check, Save } from "lucide-react";

export interface ProductItem {
  id: string;
  storeId: string;
  name: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit: string;
  price?: number;
  lowStockThreshold?: number;
  stockLevelPercent?: number;
  status?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductItem | null; // Null for Add, ProductItem for Edit
  currentStoreId: string;
  onProductSaved: (savedProduct: ProductItem) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  currentStoreId,
  onProductSaved,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General FMCG");
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState("pkts");
  const [price, setPrice] = useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "General FMCG");
      setQuantity(product.quantity || 0);
      setUnit(product.unit || "pkts");
      setPrice(product.price || 0);
      setLowStockThreshold(product.lowStockThreshold || 15);
    } else {
      setName("");
      setCategory("General FMCG");
      setQuantity(10);
      setUnit("pkts");
      setPrice(0);
      setLowStockThreshold(15);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || name.trim().length === 0) {
      setError("Product name is required");
      return;
    }

    if (quantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/products/${product.id}`
        : `/api/stores/${currentStoreId}/products`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          quantity: Number(quantity),
          unit: unit.trim(),
          price: Number(price),
          lowStockThreshold: Number(lowStockThreshold),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product");
        setLoading(false);
        return;
      }

      onProductSaved(data.product);
      onClose();
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface-2 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                {isEdit ? "Edit Kirana Product" : "Add New FMCG Product"}
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                {isEdit ? `Updating ${product.name}` : "Add an inventory item to this store"}
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

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maggi 70g Masala Noodles"
              className="w-full bg-base border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-base border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="General FMCG">General FMCG</option>
                <option value="Instant Noodles">Instant Noodles</option>
                <option value="Biscuits">Biscuits</option>
                <option value="Dairy &amp; Eggs">Dairy &amp; Eggs</option>
                <option value="Edible Oil">Edible Oil</option>
                <option value="Staples &amp; Spices">Staples &amp; Spices</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Unit Type
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-base border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="pkts">Packets (pkts)</option>
                <option value="pouches">Pouches</option>
                <option value="tins">Tins / Bottles</option>
                <option value="crates">Crates / Cartons</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="units">Units / Pieces</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min={0}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-base border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-base border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Low Threshold
              </label>
              <input
                type="number"
                min={1}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full bg-base border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-text-secondary hover:bg-base/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-xs font-mono font-bold text-text-primary shadow-lg shadow-accent/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? "Save Changes" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
