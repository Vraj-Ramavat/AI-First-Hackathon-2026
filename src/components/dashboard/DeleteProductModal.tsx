"use client";

import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { ProductItem } from "./ProductModal";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onProductDeleted: (productId: string) => void;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onProductDeleted,
}: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete product");
        setLoading(false);
        return;
      }

      onProductDeleted(product.id);
      onClose();
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-2 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/40">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                Delete Product
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Confirm inventory deletion
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

        <p className="text-sm text-text-secondary leading-relaxed">
          Are you sure you want to delete <strong className="text-text-primary">{product.name}</strong> from this store&apos;s inventory? This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-text-secondary hover:bg-base/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-mono font-bold text-white shadow-lg shadow-red-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
