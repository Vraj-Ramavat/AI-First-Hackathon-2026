"use client";

import { useState } from "react";
import { Store as StoreIcon, MapPin, X, Plus } from "lucide-react";
import { StoreItem } from "./StoreSwitcher";

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreCreated: (newStore: StoreItem) => void;
}

export default function AddStoreModal({
  isOpen,
  onClose,
  onStoreCreated,
}: AddStoreModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || name.trim().length < 2) {
      setError("Store name must be at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), location: location.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create store");
        setLoading(false);
        return;
      }

      onStoreCreated({
        id: data.store.id,
        name: data.store.name,
        location: data.store.location,
        role: "owner",
      });

      setName("");
      setLocation("");
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
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <StoreIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                Add New Store
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Provision a new Kirana store location
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
              Store Name *
            </label>
            <div className="relative">
              <StoreIcon className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Patel FMCG &amp; Provisions"
                className="w-full bg-base border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
              Location / Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Navrangpura, Ahmedabad"
                className="w-full bg-base border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
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
                  <Plus className="w-4 h-4" />
                  <span>Create Store</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
