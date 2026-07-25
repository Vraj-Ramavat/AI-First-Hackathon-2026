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
        className="w-full flex items-center justify-between px-2 py-1.5 sm:px-3.5 sm:py-2.5 rounded-sm bg-surface-2 hover:bg-surface border border-accent/30 text-xs font-mono text-text-primary transition-all overflow-hidden"
      >
        <div className="flex items-center gap-1.5 sm:gap-2.5 truncate min-w-0">
          <StoreIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
          <div className="text-left truncate min-w-0">
            <p className="font-bold text-text-primary leading-none truncate uppercase tracking-wider text-[11px] sm:text-xs">
              {currentStore ? currentStore.name : "Select Store"}
            </p>
            {currentStore?.location && (
              <p className="text-[9px] sm:text-[10px] text-accent/80 mt-0.5 sm:mt-1 leading-none truncate uppercase font-mono hidden sm:block">
                [ {currentStore.location} ]
              </p>
            )}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-accent shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 max-w-[85vw] sm:w-full sm:min-w-[220px] sm:left-0 sm:right-auto rounded-sm bg-surface-2 border-2 border-accent/40 shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-accent font-bold border-b border-accent/20">
              REGISTERED STORES ({stores.length})
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-mono transition-colors ${
                      isSelected
                        ? "bg-accent/15 text-accent font-bold border-l-2 border-accent"
                        : "text-text-primary hover:bg-base/60"
                    }`}
                  >
                    <div className="truncate text-left">
                      <p className="truncate uppercase font-bold">{store.name}</p>
                      {store.location && (
                        <p className="text-[10px] text-text-secondary truncate">
                          {store.location}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-accent/20">
              <button
                onClick={() => {
                  setOpen(false);
                  onAddStoreClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-none text-xs font-mono text-accent hover:bg-accent/10 transition-colors font-bold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5 text-accent" />
                <span>+ ADD NEW KIRANA STORE</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
