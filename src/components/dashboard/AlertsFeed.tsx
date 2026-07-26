"use client";

import { useState, useEffect } from "react";
import { CheckCheck, MessageSquare, Send, Phone, Sparkles, AlertTriangle, CheckCircle2, Edit3, Save, Check, Clock, Zap, BellRing, RefreshCw, ShieldCheck, Key } from "lucide-react";
import WhatsAppBubble from "@/src/components/WhatsAppBubble";
import { ProductItem } from "./ProductModal";

interface AlertsFeedProps {
  currentStoreName?: string;
  products?: ProductItem[];
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export default function AlertsFeed({
  currentStoreName = "Hawks",
  products = [],
}: AlertsFeedProps) {
  const [ownerPhone, setOwnerPhone] = useState<string>("9876543210");
  const [tempPhone, setTempPhone] = useState<string>("9876543210");
  // Twilio Official WhatsApp Gateway Credentials
  const [twilioSid, setTwilioSid] = useState<string>("");
  const [twilioAuthToken, setTwilioAuthToken] = useState<string>("");
  const [twilioPhone, setTwilioPhone] = useState<string>("whatsapp:+14155238886");

  const [tempTwilioSid, setTempTwilioSid] = useState<string>("");
  const [tempTwilioAuthToken, setTempTwilioAuthToken] = useState<string>("");
  const [tempTwilioPhone, setTempTwilioPhone] = useState<string>("whatsapp:+14155238886");
  const [isEditingTwilio, setIsEditingTwilio] = useState<boolean>(false);

  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [sentAlerts, setSentAlerts] = useState<Record<string, boolean>>({});

  // 2-Hour Persistent Target Timestamp & Dispatcher State
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState<boolean>(true);
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(7200);
  const [lastAutoTriggerTime, setLastAutoTriggerTime] = useState<string | null>(null);
  const [isCronRunning, setIsCronRunning] = useState<boolean>(false);
  const [lastAutoDispatchStatus, setLastAutoDispatchStatus] = useState<string | null>(null);

  // Load saved configuration on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem("stocksaathi_owner_phone");
    if (savedPhone) {
      setOwnerPhone(savedPhone);
      setTempPhone(savedPhone);
    }

    const savedTwilioSid = localStorage.getItem("stocksaathi_twilio_sid");
    if (savedTwilioSid) {
      setTwilioSid(savedTwilioSid);
      setTempTwilioSid(savedTwilioSid);
    }

    const savedTwilioToken = localStorage.getItem("stocksaathi_twilio_token");
    if (savedTwilioToken) {
      setTwilioAuthToken(savedTwilioToken);
      setTempTwilioAuthToken(savedTwilioToken);
    }

    const savedTwilioPhone = localStorage.getItem("stocksaathi_twilio_phone");
    if (savedTwilioPhone) {
      setTwilioPhone(savedTwilioPhone);
      setTempTwilioPhone(savedTwilioPhone);
    }

    const savedAuto = localStorage.getItem("stocksaathi_auto_whatsapp_schedule");
    if (savedAuto !== null) {
      setAutoScheduleEnabled(savedAuto === "true");
    }

    const savedTime = localStorage.getItem("stocksaathi_last_auto_time");
    if (savedTime) setLastAutoTriggerTime(savedTime);

    // Initialize or load persistent target expiration timestamp
    let target = Number(localStorage.getItem("stocksaathi_timer_target_timestamp"));
    const now = Date.now();

    // If target is missing, invalid, or expired, set next 2-hour target
    if (!target || isNaN(target) || target <= now) {
      target = now + TWO_HOURS_MS;
      localStorage.setItem("stocksaathi_timer_target_timestamp", String(target));
      setTargetTimestamp(target);
      setSecondsRemaining(TWO_HOURS_MS / 1000);
    } else {
      // Timer is actively running within the 2-hour window
      setTargetTimestamp(target);
      setSecondsRemaining(Math.max(0, Math.floor((target - now) / 1000)));
    }
  }, []);

  // 2-Hour Live Persistent Timer Loop
  useEffect(() => {
    if (!autoScheduleEnabled || !targetTimestamp) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((targetTimestamp - now) / 1000));
      setSecondsRemaining(diffSecs);

      if (diffSecs <= 0) {
        // 2 Hours elapsed! Fire automated zero-click dispatch & advance target timestamp
        const nextTarget = Date.now() + TWO_HOURS_MS;
        setTargetTimestamp(nextTarget);
        localStorage.setItem("stocksaathi_timer_target_timestamp", String(nextTarget));
        triggerAutoScheduleScan();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [autoScheduleEnabled, targetTimestamp]);

  const handleSavePhone = () => {
    const clean = tempPhone.replace(/[^0-9]/g, "");
    if (!clean || clean.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOwnerPhone(clean);
    localStorage.setItem("stocksaathi_owner_phone", clean);
    setIsEditingPhone(false);
    setSavedNotice(true);
  };

  const handleSaveTwilio = () => {
    const sid = tempTwilioSid.trim();
    const token = tempTwilioAuthToken.trim();
    const phone = tempTwilioPhone.trim() || "whatsapp:+14155238886";

    setTwilioSid(sid);
    setTwilioAuthToken(token);
    setTwilioPhone(phone);

    localStorage.setItem("stocksaathi_twilio_sid", sid);
    localStorage.setItem("stocksaathi_twilio_token", token);
    localStorage.setItem("stocksaathi_twilio_phone", phone);

    setIsEditingTwilio(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const toggleAutoSchedule = () => {
    const nextState = !autoScheduleEnabled;
    setAutoScheduleEnabled(nextState);
    localStorage.setItem("stocksaathi_auto_whatsapp_schedule", String(nextState));

    // Preserve running timer target unless no valid target exists or target has expired
    let target = Number(localStorage.getItem("stocksaathi_timer_target_timestamp"));
    const now = Date.now();
    if (!target || isNaN(target) || target <= now) {
      target = now + TWO_HOURS_MS;
      localStorage.setItem("stocksaathi_timer_target_timestamp", String(target));
      setTargetTimestamp(target);
      setSecondsRemaining(TWO_HOURS_MS / 1000);
    } else {
      setTargetTimestamp(target);
      setSecondsRemaining(Math.max(0, Math.floor((target - now) / 1000)));
    }
  };

  // Format remaining seconds into HH:MM:SS
  const formatCountdown = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Derive real low stock products from inventory
  const criticalProducts = products.filter(
    (p) => p.quantity <= 5 || p.status === "OUT_OF_STOCK" || p.status === "CRITICAL"
  );
  const lowProducts = products.filter(
    (p) => p.quantity > 5 && (p.quantity <= (p.lowStockThreshold ?? 15) || p.status === "LOW_STOCK")
  );

  const hasRealAlerts = criticalProducts.length > 0 || lowProducts.length > 0;

  // Automated Zero-Click Server Dispatcher Function for active store (e.g. "Hawks")
  const dispatchWhatsAppMessage = async (
    alertId: string,
    alertTitle: string,
    items: Array<{ name: string; qty: string }>
  ) => {
    const cleanPhone = ownerPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      alert("Please enter a valid mobile number.");
      setIsEditingPhone(true);
      return;
    }

    const activeStoreName = currentStoreName || "Hawks";

    let text = `🛒 *StockSaathi AI Automated Alert*\n`;
    text += `🏪 Store: *${activeStoreName}*\n\n`;
    text += `⚠️ *${alertTitle}*\n\n`;
    text += `*Items Needing Immediate Reorder:*\n`;
    items.forEach((it) => {
      text += `• *${it.name}*: ${it.qty}\n`;
    });
    text += `\n📦 *Action Required:* Restock order generated for ${activeStoreName}.\n\n_Automated Schedule by StockSaathi_`;

    try {
      const res = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          message: text,
          storeName: activeStoreName,
          twilioAccountSid: twilioSid,
          twilioAuthToken: twilioAuthToken,
          twilioPhoneNumber: twilioPhone,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setLastAutoDispatchStatus(`[TWILIO DISPATCH ERROR] ${data.error}`);
      } else if (data.provider === "twilio") {
        setSentAlerts((prev) => ({ ...prev, [alertId]: true }));
        setLastAutoDispatchStatus(`[TWILIO ZERO-CLICK SENT] WhatsApp message automatically delivered to +91 ${cleanPhone} for store '${activeStoreName}'!`);
      } else if (data.whatsappUrl) {
        // Fallback: If no API key, open WhatsApp URL with auto-focus
        window.open(data.whatsappUrl, "_blank");
        setSentAlerts((prev) => ({ ...prev, [alertId]: true }));
        setLastAutoDispatchStatus(`WhatsApp draft opened for store '${activeStoreName}'. (Tip: Configure Twilio API credentials below for 100% zero-click background delivery without Enter press).`);
      }
    } catch (err: any) {
      console.warn("Zero-click dispatch error:", err);
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // Automatic 2-Hour Trigger Handler
  const triggerAutoScheduleScan = async () => {
    setIsCronRunning(true);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastAutoTriggerTime(nowStr);
    localStorage.setItem("stocksaathi_last_auto_time", nowStr);

    try {
      await fetch("/api/cron/whatsapp-alerts");
    } catch (e) {
      console.warn("Backend cron trigger error:", e);
    } finally {
      setIsCronRunning(false);
    }

    const activeStoreName = currentStoreName || "Hawks";

    // Auto-dispatch message for current store
    if (criticalProducts.length > 0) {
      await dispatchWhatsAppMessage(
        "critical-auto",
        `AUTOMATED CRITICAL ALERT (${activeStoreName})`,
        criticalProducts.map((p) => ({ name: p.name, qty: `${p.quantity} ${p.unit} left (CRITICAL)` }))
      );
    } else if (lowProducts.length > 0) {
      await dispatchWhatsAppMessage(
        "low-auto",
        `AUTOMATED REORDER ALERT (${activeStoreName})`,
        lowProducts.map((p) => ({ name: p.name, qty: `${p.quantity} ${p.unit} left` }))
      );
    } else if (products.length > 0) {
      // All products in store are healthy
      await dispatchWhatsAppMessage(
        "healthy-auto",
        `AUTOMATED INVENTORY STATUS (${activeStoreName})`,
        products.slice(0, 5).map((p) => ({ name: p.name, qty: `${p.quantity} ${p.unit} in stock (OPTIMAL)` }))
      );
    } else {
      // 0 Products in new store
      await dispatchWhatsAppMessage(
        "empty-store-auto",
        `NEW STORE INITIALIZATION (${activeStoreName})`,
        [{ name: "Store Register Status", qty: "0 products logged. Store registered and active for automated WhatsApp monitoring." }]
      );
    }
  };

  const activeStoreName = currentStoreName || "Hawks";

  return (
    <div className="w-full bg-surface border-2 border-accent/30 rounded-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-accent/30 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
            <span>AUTOMATED WHATSAPP REORDER FEED ({activeStoreName})</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </h2>
          <p className="text-xs font-mono text-text-secondary mt-0.5">
            Automatic 2-hour inventory alerts sent directly from store <strong className="text-accent">{activeStoreName}</strong> to owner&apos;s mobile number.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#25D366]/10 text-[#25D366] text-xs font-mono border border-[#25D366]/30 shrink-0 font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ACTIVE STORE: {activeStoreName}</span>
        </div>
      </div>

      {/* 2-Hour Persistent Automated Scheduler Control Panel */}
      <div className="p-5 rounded-sm bg-surface-2 border border-accent/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-accent/10 border border-accent/30 text-accent">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                  2-Hour Auto-WhatsApp Dispatcher ({activeStoreName})
                </h4>
                <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold tracking-wider ${
                  autoScheduleEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40" : "bg-red-500/10 text-red-400 border border-red-500/40"
                }`}>
                  {autoScheduleEnabled ? "RUNNING (PERSISTENT)" : "PAUSED"}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary font-mono mt-0.5">
                Automatically scans inventory &amp; dispatches low-stock alerts for store <strong>{activeStoreName}</strong> every 2 hours.
              </p>
            </div>
          </div>

          {/* Toggle Switch & Countdown Badge */}
          <div className="flex items-center gap-3 shrink-0">
            {autoScheduleEnabled && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-base border border-accent/30 text-xs font-mono text-accent font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Next Alert: <strong>{formatCountdown(secondsRemaining)}</strong></span>
              </div>
            )}

            <button
              type="button"
              onClick={toggleAutoSchedule}
              className={`px-4 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                autoScheduleEnabled
                  ? "bg-accent hover:bg-accent-hover text-text-primary border-accent/40"
                  : "bg-surface-2 hover:bg-base text-text-secondary border-accent/20"
              }`}
            >
              {autoScheduleEnabled ? "Pause 2-Hour Schedule" : "Enable 2-Hour Auto Schedule"}
            </button>
          </div>
        </div>

        {/* Quick Manual Test Trigger Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-accent/20 text-xs font-mono text-text-secondary">
          <span className="flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-accent" />
            Last Auto Alert for {activeStoreName}: <strong className="text-text-primary">{lastAutoTriggerTime || "Not yet run today"}</strong>
          </span>
          
          <button
            type="button"
            onClick={triggerAutoScheduleScan}
            disabled={isCronRunning}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1.5 disabled:opacity-50 uppercase font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCronRunning ? "animate-spin" : ""}`} />
            <span>Run 2-Hour Auto Dispatch Now ({activeStoreName})</span>
          </button>
        </div>

        {lastAutoDispatchStatus && (
          <div className="p-2.5 rounded-sm bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastAutoDispatchStatus}</span>
          </div>
        )}
      </div>

      {/* Target Phone & Zero-Click Twilio Gateway Config Card */}
      <div className="p-5 rounded-2xl bg-surface-2 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                  Store &amp; Owner WhatsApp Number
                </h4>
                {savedNotice && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>
              
              {!isEditingPhone ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-mono font-bold text-accent">+91 {ownerPhone}</span>
                  <span className="text-[11px] text-text-secondary font-mono">
                    (Target recipient for store <strong>{activeStoreName}</strong>)
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-text-secondary font-mono mt-0.5">
                  Enter 10-digit mobile number for store {activeStoreName}.
                </p>
              )}
            </div>
          </div>

          {/* Edit / Save Actions */}
          <div className="flex items-center gap-2">
            {!isEditingPhone ? (
              <button
                type="button"
                onClick={() => {
                  setTempPhone(ownerPhone);
                  setIsEditingPhone(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-base border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-accent" />
                <span>Change Number</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-base border border-white/20 rounded-xl px-2 py-1">
                  <span className="text-xs font-mono text-text-secondary">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="9876543210"
                    className="bg-transparent text-xs font-mono text-text-primary focus:outline-none w-28"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSavePhone}
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black text-xs font-mono font-bold flex items-center gap-1 hover:bg-[#20bd5a] transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPhone(false)}
                  className="px-2.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-text-secondary hover:bg-base"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Twilio Official Zero-Click WhatsApp API Configuration */}
        <div className="pt-3 border-t border-accent/20 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-text-primary font-bold">
              <Key className="w-4 h-4 text-accent shrink-0" />
              <span>Twilio Official WhatsApp API (Primary Provider)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-none font-bold uppercase ${
                twilioSid && twilioAuthToken ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-accent/10 text-accent border border-accent/30"
              }`}>
                {twilioSid && twilioAuthToken ? "ACTIVE (ZERO-CLICK)" : "NOT CONFIGURED"}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setTempTwilioSid(twilioSid);
                setTempTwilioAuthToken(twilioAuthToken);
                setTempTwilioPhone(twilioPhone || "whatsapp:+14155238886");
                setIsEditingTwilio(!isEditingTwilio);
              }}
              className="text-accent hover:underline font-bold text-[11px] uppercase tracking-wider cursor-pointer"
            >
              {isEditingTwilio ? "Cancel Edit" : twilioSid ? "Edit Twilio Keys" : "+ Configure Twilio API Keys"}
            </button>
          </div>

          {isEditingTwilio && (
            <div className="p-4 rounded-sm bg-base border border-accent/30 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-text-secondary uppercase font-bold">TWILIO ACCOUNT SID *</label>
                  <input
                    type="text"
                    value={tempTwilioSid}
                    onChange={(e) => setTempTwilioSid(e.target.value)}
                    placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full bg-surface border border-accent/30 rounded-sm px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-text-secondary uppercase font-bold">TWILIO AUTH TOKEN *</label>
                  <input
                    type="password"
                    value={tempTwilioAuthToken}
                    onChange={(e) => setTempTwilioAuthToken(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="w-full bg-surface border border-accent/30 rounded-sm px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] text-text-secondary uppercase font-bold">TWILIO WHATSAPP SENDER NUMBER (FOR SANDBOX: MUST BE whatsapp:+14155238886)</label>
                  <button
                    type="button"
                    onClick={() => setTempTwilioPhone("whatsapp:+14155238886")}
                    className="text-[10px] text-accent hover:underline font-bold uppercase"
                  >
                    Use Sandbox Default (+14155238886)
                  </button>
                </div>
                <input
                  type="text"
                  value={tempTwilioPhone}
                  onChange={(e) => setTempTwilioPhone(e.target.value)}
                  placeholder="whatsapp:+14155238886"
                  className="w-full bg-surface border border-accent/30 rounded-sm px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-accent hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Get Free Twilio Sandbox Keys (30s setup) ➔</span>
                </a>

                <button
                  type="button"
                  onClick={handleSaveTwilio}
                  className="px-4 py-1.5 bg-accent text-text-primary text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-accent-hover transition-all cursor-pointer"
                >
                  Save Twilio Credentials
                </button>
              </div>
            </div>
          )}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        
        {/* Real Critical Stock Alert (If Critical Products Exist) */}
        {criticalProducts.length > 0 && (
          <div className="p-5 rounded-2xl bg-surface-2 border border-red-500/20 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> CRITICAL REORDER ALERT ({criticalProducts.length} SKUs)
              </span>
              <span className="text-text-secondary">Automated 2-Hour Cycle ({activeStoreName})</span>
            </div>

            <WhatsAppBubble
              storeName={activeStoreName}
              supplierName="Primary FMCG Distributor"
              items={criticalProducts.map((p) => ({
                name: p.name,
                qty: `${p.quantity} ${p.unit} remaining (CRITICAL)`,
                alertType: "CRITICAL",
              }))}
              timestamp="Just Now"
              status="sent"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <span className="text-xs text-red-300 font-mono">
                {sentAlerts["critical"] ? `✓ Alert Dispatched for ${activeStoreName}` : `Targeting ${activeStoreName}: +91 ${ownerPhone}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  dispatchWhatsAppMessage(
                    "critical",
                    `CRITICAL LOW-STOCK ALERT (${activeStoreName})`,
                    criticalProducts.map((p) => ({
                      name: p.name,
                      qty: `${p.quantity} ${p.unit} left (CRITICAL)`,
                    }))
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#25D366] text-black text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp from {activeStoreName} (+91 {ownerPhone})</span>
              </button>
            </div>
          </div>
        )}

        {/* Real Low Stock Alert (If Low Products Exist) */}
        {lowProducts.length > 0 && (
          <div className="p-5 rounded-2xl bg-surface-2 border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> REORDER SOON ALERT ({lowProducts.length} SKUs)
              </span>
              <span className="text-text-secondary">Automated 2-Hour Cycle ({activeStoreName})</span>
            </div>

            <WhatsAppBubble
              storeName={activeStoreName}
              supplierName="Wholesale FMCG Agency"
              items={lowProducts.map((p) => ({
                name: p.name,
                qty: `${p.quantity} ${p.unit} remaining (Low Stock)`,
                alertType: "LOW",
              }))}
              timestamp="Today"
              status="delivered"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <span className="text-xs text-amber-300 font-mono">
                {sentAlerts["low"] ? `✓ Alert Dispatched for ${activeStoreName}` : `Targeting ${activeStoreName}: +91 ${ownerPhone}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  dispatchWhatsAppMessage(
                    "low",
                    `REORDER SOON ALERT (${activeStoreName})`,
                    lowProducts.map((p) => ({
                      name: p.name,
                      qty: `${p.quantity} ${p.unit} left`,
                    }))
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#25D366] text-black text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp from {activeStoreName} (+91 {ownerPhone})</span>
              </button>
            </div>
          </div>
        )}

        {/* If no low stock items in store inventory, render interactive test restock sender! */}
        {!hasRealAlerts && (
          <div className="p-6 rounded-2xl bg-surface-2 border border-emerald-500/20 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">All Store Products Well Stocked</h4>
                <p className="text-xs font-mono text-text-secondary">
                  No SKUs currently below low-stock threshold in store <strong className="text-accent">{activeStoreName}</strong>. Persistent 2-hour zero-click scheduler is active.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-base border border-white/5 space-y-3">
              <p className="text-xs font-mono text-text-secondary">
                Test Automated WhatsApp Messaging for Store {activeStoreName}:
              </p>
              <WhatsAppBubble
                storeName={activeStoreName}
                supplierName="Mahalakshmi Wholesale FMCG"
                items={[
                  { name: "Maggi 70g Masala Noodles", qty: "48 pkts (2 crates)", alertType: "CRITICAL" },
                  { name: "Parle-G 80g Biscuit", qty: "30 pkts", alertType: "LOW" },
                ]}
                timestamp="Test Alert"
                status="read"
              />
              <button
                type="button"
                onClick={() =>
                  dispatchWhatsAppMessage(
                    "test",
                    `TEST INVENTORY ALERT (${activeStoreName})`,
                    [
                      { name: "Maggi 70g Masala Noodles", qty: "48 pkts (2 crates)" },
                      { name: "Parle-G 80g Biscuit", qty: "30 pkts" },
                    ]
                  )
                }
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] text-black text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
              >
                <Send className="w-4 h-4" />
                <span>Send Sample WhatsApp Alert from {activeStoreName} (+91 {ownerPhone})</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
    </div>
  );
}
