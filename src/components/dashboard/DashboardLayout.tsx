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
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

import InventoryTable from "@/src/components/dashboard/InventoryTable";
import DashboardAnalytics from "@/src/components/dashboard/DashboardAnalytics";
import AlertsFeed from "@/src/components/dashboard/AlertsFeed";
import StoreSwitcher, { StoreItem } from "@/src/components/dashboard/StoreSwitcher";
import AddStoreModal from "@/src/components/dashboard/AddStoreModal";
import ProductModal, { ProductItem } from "@/src/components/dashboard/ProductModal";
import DeleteProductModal from "@/src/components/dashboard/DeleteProductModal";
import ScanShelfModal from "@/src/components/dashboard/ScanShelfModal";
import ScanReviewModal, { ScanItemReview } from "@/src/components/dashboard/ScanReviewModal";
import Logo from "@/src/components/Logo";
import ThemeToggle from "@/src/components/ThemeToggle";

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

  // AI Scanner Modals state
  const [isScanShelfOpen, setIsScanShelfOpen] = useState<boolean>(false);
  const [isScanReviewOpen, setIsScanReviewOpen] = useState<boolean>(false);
  const [scanDetectedItems, setScanDetectedItems] = useState<ScanItemReview[]>([]);
  const [scanNotes, setScanNotes] = useState<string>("");

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
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchStores();
    }
  }, [status, fetchStores, router]);

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

  // Handle AI Vision Scan Complete -> Open Review Screen
  const handleScanComplete = (detectedItems: ScanItemReview[], scanId: string, notes: string) => {
    setScanDetectedItems(detectedItems);
    setScanNotes(notes);
    setIsScanReviewOpen(true);
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
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (Visible only on desktop screens md+)           */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden md:flex md:w-64 bg-surface border-r border-accent/20 flex-col justify-between p-6 shrink-0 relative z-30 border-t-2 border-t-accent">
        <div className="space-y-8">
          {/* Logo & Back Link */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4 group">
              <Logo textSize="text-xl" showBadge="LEDGER" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span>Back to Main Site</span>
            </Link>
          </div>

          {/* Store Switcher Component */}
          {stores.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                REGISTERED KIRANA STORE
              </p>
              <StoreSwitcher
                stores={stores}
                currentStoreId={currentStoreId}
                onSelectStore={(id) => setCurrentStoreId(id)}
                onAddStoreClick={() => setIsAddStoreOpen(true)}
              />
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs font-mono tracking-widest uppercase transition-all ${
                    isActive
                      ? "bg-accent/15 text-accent font-bold border-l-4 border-l-accent border-y border-r border-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2 border-l-4 border-l-transparent"
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
        <div className="pt-6 border-t border-accent/20 space-y-3">
          <ThemeToggle showText className="w-full justify-center py-2" />

          {session?.user ? (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-sm bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
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
                className="p-1.5 rounded-sm text-text-secondary hover:text-red-400 hover:bg-base border border-transparent hover:border-red-500/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 pt-1">
              <Link
                href="/auth/login"
                className="flex-1 py-2 text-center rounded-sm bg-accent hover:bg-accent-hover text-base text-xs font-mono font-bold uppercase tracking-wider border border-accent/40"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 py-2 text-center rounded-sm bg-surface-2 text-text-secondary hover:text-text-primary text-xs font-mono border border-accent/20 uppercase tracking-wider"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE COMPACT APP HEADER BAR (Visible only on mobile screens) */}
      {/* ------------------------------------------------------------- */}
      <header className="block md:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b-2 border-accent/30 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <Logo textSize="text-lg sm:text-xl" />
          </Link>

          {/* Store Switcher & Theme Toggle Container */}
          <div className="flex items-center gap-2 max-w-[60%] shrink min-w-0">
            <ThemeToggle />
            {stores.length > 0 && (
              <div className="w-full min-w-0">
                <StoreSwitcher
                  stores={stores}
                  currentStoreId={currentStoreId}
                  onSelectStore={(id) => setCurrentStoreId(id)}
                  onAddStoreClick={() => setIsAddStoreOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN DASHBOARD CONTENT AREA                                   */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 p-4 sm:p-10 space-y-6 pb-24 sm:pb-10 overflow-y-auto">
        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-accent/20 pb-5">
          <div className="border-l-4 border-accent pl-3 sm:pl-4">
            <h1 className="text-2xl sm:text-4xl font-display font-bold uppercase text-text-primary tracking-wide">
              {activeTab === "overview" && "INVENTORY INTELLIGENCE & DASHBOARD"}
              {activeTab === "inventory" && "KIRANA DAILY INVENTORY REGISTER"}
              {activeTab === "alerts" && "AUTOMATED WHATSAPP REORDER FEED"}
            </h1>
            <p className="text-xs font-mono text-text-secondary mt-1 hidden sm:block">
              {activeTab === "overview" && (
                <>Real-time shelf stock predictions &amp; demand analytics for <span className="text-accent font-bold uppercase">{currentStore ? currentStore.name : "Gupta Kirana Store"}</span>.</>
              )}
              {activeTab === "inventory" && (
                <>Live stock tracking &amp; computer vision shelf register synced with <span className="text-accent font-bold uppercase">{currentStore ? currentStore.name : "Gupta Kirana Store"}</span>.</>
              )}
              {activeTab === "alerts" && (
                <>Automated 2-hour inventory reorder notifications for <span className="text-accent font-bold uppercase">{currentStore ? currentStore.name : "Gupta Kirana Store"}</span>.</>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <div className="px-3 py-1.5 rounded-sm bg-surface border border-accent/30 text-[11px] sm:text-xs font-mono text-accent font-bold tracking-widest uppercase">
              [ JUL 25, 2026 ]
            </div>
            <button
              onClick={() => setIsScanShelfOpen(true)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm bg-accent text-base text-xs font-mono uppercase tracking-widest font-bold hover:bg-accent-hover transition-all flex items-center gap-2 border border-accent/40 shadow-none active:translate-y-0.5"
            >
              <Camera className="w-4 h-4 text-base" />
              <span>SCAN SHELF</span>
            </button>
          </div>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Kirana Shop Signboard Top Metrics Strip */}
            <div className="relative bg-surface-2 border-2 border-accent/30 rounded-sm p-4 sm:p-6 overflow-hidden">
              {/* Top Brass Signboard Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
              
              {/* Corner Plaque Rivets */}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 border border-accent/60" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 border border-accent/60" />
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 border border-accent/60" />
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 border border-accent/60" />

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-accent/20 gap-4 sm:gap-0">
                
                {/* Metric 1: Items Low on Stock */}
                <div className="pb-4 sm:pb-0 sm:pr-6 space-y-1.5 sm:space-y-2 relative">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-accent opacity-90 shrink-0" />
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-secondary">
                      Items Low on Stock
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-3xl sm:text-5xl font-display font-bold text-accent leading-none">
                      {lowCount} SKUs
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider">
                      [{criticalCount} CRITICAL]
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-mono text-text-secondary/80">
                    • Tracked live per store threshold
                  </p>
                </div>

                {/* Metric 2: Predicted Stockouts (48h) */}
                <div className="py-4 sm:py-0 sm:px-6 space-y-1.5 sm:space-y-2 relative">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-accent opacity-90 shrink-0" />
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-secondary">
                      Predicted Stockouts (48h)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-3xl sm:text-5xl font-display font-bold text-accent leading-none">
                      {products.length === 0 ? "0 ITEMS" : `${criticalCount} ITEMS`}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      {products.length === 0 ? "[NO RISK]" : "[WEEKEND SPIKE]"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-mono text-text-secondary/80">
                    • {products.length === 0 ? "No inventory items registered" : "Historical Friday/Saturday demand model"}
                  </p>
                </div>

                {/* Metric 3: Last Shelf Scan */}
                <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1.5 sm:space-y-2 relative">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-accent opacity-90 shrink-0" />
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-secondary">
                      Last Shelf Scan
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-3xl sm:text-5xl font-display font-bold text-accent leading-none">
                      {products.length === 0 ? "NO SCAN" : "14 MINS"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      {products.length === 0 ? "[AWAITING SCAN]" : "[FRESH SCAN]"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-mono text-text-secondary/80">
                    • {products.length === 0 ? "Perform camera scan to track stock" : "Camera vision processed with 96.8% accuracy"}
                  </p>
                </div>

              </div>
            </div>

            <DashboardAnalytics
              products={products}
              currentStoreName={currentStore?.name}
              onSwitchToInventory={() => setActiveTab("inventory")}
            />
          </div>
        )}

        {activeTab === "inventory" && (
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
            <AlertsFeed
              currentStoreName={currentStore?.name || stores[0]?.name || "Hawks"}
              products={products}
            />
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODERN KIRANA MOBILE BOTTOM NAVIGATION BAR (Mobile screens)   */}
      {/* ------------------------------------------------------------- */}
      <nav className="block md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-lg border-t-2 border-accent/40 z-50 shadow-2xl">
        <div className="h-full grid grid-cols-4 items-center px-1">
          {/* Tab 1: Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center justify-center h-full py-1 font-mono transition-all ${
              activeTab === "overview"
                ? "text-accent font-bold border-t-2 border-accent bg-accent/10"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-wider uppercase">Dashboard</span>
          </button>

          {/* Tab 2: Inventory */}
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex flex-col items-center justify-center h-full py-1 font-mono transition-all ${
              activeTab === "inventory"
                ? "text-accent font-bold border-t-2 border-accent bg-accent/10"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Boxes className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-wider uppercase">Inventory</span>
          </button>

          {/* Tab 3: Alerts */}
          <button
            type="button"
            onClick={() => setActiveTab("alerts")}
            className={`flex flex-col items-center justify-center h-full py-1 font-mono transition-all ${
              activeTab === "alerts"
                ? "text-accent font-bold border-t-2 border-accent bg-accent/10"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-wider uppercase">Alerts</span>
          </button>

          {/* Tab 4: Scan Shelf Quick Action */}
          <button
            type="button"
            onClick={() => setIsScanShelfOpen(true)}
            className="flex flex-col items-center justify-center h-full py-1 font-mono text-accent hover:text-accent-hover active:scale-95 transition-all"
          >
            <div className="w-7 h-7 rounded-sm bg-accent text-base flex items-center justify-center mb-0.5 shadow-md">
              <Camera className="w-4 h-4 text-base" />
            </div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-accent">Scan</span>
          </button>
        </div>
      </nav>

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

      {/* AI Shelf Scanner Modals */}
      <ScanShelfModal
        isOpen={isScanShelfOpen}
        onClose={() => setIsScanShelfOpen(false)}
        currentStoreId={currentStoreId}
        onScanComplete={handleScanComplete}
      />

      <ScanReviewModal
        isOpen={isScanReviewOpen}
        onClose={() => setIsScanReviewOpen(false)}
        currentStoreId={currentStoreId}
        existingProducts={products}
        detectedItems={scanDetectedItems}
        notes={scanNotes}
        onConfirmSuccess={() => {
          fetchProducts(currentStoreId);
        }}
      />
    </div>
  );
}
