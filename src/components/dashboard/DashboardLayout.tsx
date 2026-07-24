"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Camera,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import InventoryTable from "@/src/components/dashboard/InventoryTable";
import AlertsFeed from "@/src/components/dashboard/AlertsFeed";
import StoreSwitcher, { StoreItem } from "@/src/components/dashboard/StoreSwitcher";
import AddStoreModal from "@/src/components/dashboard/AddStoreModal";
import ProductModal, { ProductItem } from "@/src/components/dashboard/ProductModal";
import DeleteProductModal from "@/src/components/dashboard/DeleteProductModal";

export default function DashboardLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "alerts">("overview");

  // Stores & Products state
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string>("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // Modals state
  const [isAddStoreOpen, setIsAddStoreOpen] = useState<boolean>(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  // Fetch all user stores
  const fetchStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const res = await fetch("/api/stores");
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores || []);
        if (data.stores && data.stores.length > 0 && !currentStoreId) {
          setCurrentStoreId(data.stores[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoadingStores(false);
    }
  }, [currentStoreId]);

  // Fetch products for current active store
  const fetchProducts = useCallback(async (storeId: string) => {
    if (!storeId) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/stores/${storeId}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStores();
    }
  }, [status, fetchStores]);

  useEffect(() => {
    if (currentStoreId) {
      fetchProducts(currentStoreId);
    }
  }, [currentStoreId, fetchProducts]);

  // Handle Quick Quantity adjustment
  const handleQuickQuantityChange = async (productId: string, newQuantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p))
    );

    try {
      await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchProducts(currentStoreId);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Handle Store Created
  const handleStoreCreated = (newStore: StoreItem) => {
    setStores((prev) => [...prev, newStore]);
    setCurrentStoreId(newStore.id);
  };

  // Handle Product Saved (Add or Edit)
  const handleProductSaved = (savedProduct: ProductItem) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    fetchProducts(currentStoreId);
  };

  // Handle Product Deleted
  const handleProductDeleted = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0];

  const criticalCount = products.filter((p) => p.status === "CRITICAL").length;
  const lowCount = products.filter((p) => p.status === "LOW" || p.status === "CRITICAL").length;

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "alerts", label: "WhatsApp Alerts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface hairline-r flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo & Back Link */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4 group">
              <span className="font-display font-bold text-xl text-text-primary">
                Stock
              </span>
              <span className="font-display font-bold text-xl text-accent">
                Saathi
              </span>
              <span className="text-[10px] font-mono text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded ml-1">
                DASHBOARD
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span>Back to Main Site</span>
            </Link>
          </div>

          {/* Store Switcher Component */}
          {stores.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">
                Active Kirana Store
              </p>
              <StoreSwitcher
                stores={stores}
                currentStoreId={currentStoreId}
                onSelectStore={(id) => setCurrentStoreId(id)}
                onAddStoreClick={() => setIsAddStoreOpen(true)}
              />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent font-bold border border-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  }`}
                >
                  <IconComp className="w-4 h-4 text-accent" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & Logout Footer */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          {session?.user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="truncate text-xs font-mono">
                  <p className="font-bold text-text-primary truncate">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-[10px] text-text-secondary truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-base transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/auth/login"
                className="flex-1 py-2 text-center rounded-xl bg-accent text-text-primary text-xs font-mono font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 py-2 text-center rounded-xl bg-surface-2 text-text-secondary hover:text-text-primary text-xs font-mono"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
              Inventory Intelligence
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Real-time shelf stock predictions for{" "}
              <span className="text-text-primary font-semibold">
                {currentStore ? currentStore.name : "Gupta Kirana Store"}
              </span>
              .
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-surface hairline-all text-xs font-mono text-text-secondary">
              <span>Jul 24, 2026</span>
            </div>
            <Link
              href="/#demo"
              className="px-4 py-2 rounded-full bg-accent text-text-primary text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Shelf</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Card 1: Items Low on Stock */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Items Low on Stock
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                {lowCount} SKUs
              </span>
              <span className="text-xs font-mono text-red-400 font-medium">
                ({criticalCount} Critical)
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Tracked live per store threshold.
            </p>
          </div>

          {/* Card 2: Predicted Stockouts (48h) */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Predicted Stockouts (48h)
              </span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                {Math.max(1, criticalCount)} Items
              </span>
              <span className="text-xs font-mono text-amber-400 font-medium">
                Weekend Spike
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Based on historical Friday/Saturday demand surge.
            </p>
          </div>

          {/* Card 3: Last Shelf Scan */}
          <div className="p-6 rounded-2xl bg-surface hairline-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                Last Shelf Scan
              </span>
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-accent">
                14 mins
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium">
                Fresh Scan
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Camera photo processed with 96.8% accuracy.
            </p>
          </div>

        </div>

        {/* Content based on Active Tab */}
        {(activeTab === "overview" || activeTab === "inventory") && (
          <div className="space-y-8">
            <InventoryTable
              products={products}
              loading={loadingProducts}
              currentStoreName={currentStore?.name}
              onAddProductClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProductClick={(prod) => {
                setEditingProduct(prod);
                setIsProductModalOpen(true);
              }}
              onDeleteProductClick={(prod) => {
                setDeletingProduct(prod);
              }}
              onQuickQuantityChange={handleQuickQuantityChange}
            />
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-8">
            <AlertsFeed />
          </div>
        )}
      </main>

      {/* Modals */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        currentStoreId={currentStoreId}
        onProductSaved={handleProductSaved}
      />

      <DeleteProductModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}
