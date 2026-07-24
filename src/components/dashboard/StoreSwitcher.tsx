"use client";

import { useState } from "react";
import { Store as StoreIcon, ChevronDown, Plus, Check } from "lucide-react";

export interface StoreItem {
  id: string;
  name: string;
  location?: string;
  role: string;
}

interface StoreSwitcherProps {
  stores: StoreItem[];
  currentStoreId: string;
  onSelectStore: (storeId: string) => void;
  onAddStoreClick: () => void;
}

export default function StoreSwitcher({
  stores,
  currentStoreId,
  onSelectStore,
  onAddStoreClick,
}: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);

  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0];

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-2/80 hover:bg-surface-2 hairline-all text-xs font-mono text-text-primary transition-all"
      >
        <div className="flex items-center gap-2.5 truncate">
          <StoreIcon className="w-4 h-4 text-accent shrink-0" />
          <div className="text-left truncate">
            <p className="font-semibold text-text-primary leading-none truncate">
              {currentStore ? currentStore.name : "Select Store"}
            </p>
            {currentStore?.location && (
              <p className="text-[10px] text-text-secondary/70 mt-1 leading-none truncate">
                {currentStore.location}
              </p>
            )}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-text-secondary shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-full min-w-[220px] rounded-2xl bg-surface-2 border border-white/10 shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-white/5">
              Your Kirana Stores ({stores.length})
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {stores.map((store) => {
                const isSelected = store.id === currentStoreId;
                return (
                  <button
                    key={store.id}
                    onClick={() => {
                      onSelectStore(store.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                      isSelected
                        ? "bg-accent/15 text-accent font-semibold"
                        : "text-text-primary hover:bg-base/60"
                    }`}
                  >
                    <div className="truncate text-left">
                      <p className="truncate">{store.name}</p>
                      {store.location && (
                        <p className="text-[10px] text-text-secondary/70 truncate">
                          {store.location}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-white/5">
              <button
                onClick={() => {
                  setOpen(false);
                  onAddStoreClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-accent hover:bg-accent/10 transition-colors font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-accent" />
                <span>+ Add New Store</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
