"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, User, Store as StoreIcon, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";

interface VIPAuthCardProps {
  initialTab?: "login" | "signup";
  onBackClick?: () => void;
  hideHeader?: boolean;
}

export default function VIPAuthCard({ initialTab = "login", onBackClick, hideHeader = false }: VIPAuthCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [slideDirection, setSlideDirection] = useState<"right" | "left">("right");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounced Tab Switcher Handler
  const handleTabSwitch = (targetTab: "login" | "signup") => {
    if (activeTab === targetTab || isTransitioning) return;

    setError("");
    setIsTransitioning(true);
    setSlideDirection(targetTab === "signup" ? "right" : "left");
    setActiveTab(targetTab);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("PLEASE FILL IN ALL REQUIRED FIELDS");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "INVALID EMAIL OR PASSWORD");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("UNEXPECTED AUTHENTICATION FAILURE");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("PLEASE FILL IN ALL REQUIRED FIELDS");
      return;
    }

    if (password.length < 8) {
      setError("PASSWORD MUST BE AT LEAST 8 CHARACTERS");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, storeName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.toUpperCase() || "ACCOUNT CREATION FAILED");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("UNEXPECTED REGISTRATION FAILURE");
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative w-full overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300 ${isLight ? "bg-base text-text-primary" : "bg-black text-white"}`}>

      {/* Full-Bleed Dark/Light Background Image & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: isLight ? 0.15 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2000&auto=format&fit=crop"
          alt="VIP Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-40 contrast-125"
        />
        <div className={`absolute inset-0 transition-all duration-300 ${isLight ? "bg-base/95" : "bg-gradient-to-t from-black via-black/70 to-black/80"}`} />
      </div>

      {/* Top-Left Back Link (Rendered only when hideHeader is false) */}
      {!hideHeader && (
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-40">
          <Link
            href="/"
            className={`text-[11px] font-mono uppercase tracking-[0.25em] transition-colors flex items-center gap-2 group relative py-1.5 px-4 rounded-full border shadow-2xl ${isLight
                ? "bg-surface text-accent border-accent/40 hover:bg-surface-2"
                : "bg-black/70 text-[#C9A84C] border-[#C9A84C]/50 hover:text-white"
              }`}
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>BACK TO LANDING PAGE</span>
          </Link>
        </div>
      )}

      {/* Centered VIP Card Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10 relative my-auto"
      >
        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
          className={`backdrop-blur-2xl border rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden transition-all duration-300 ${isLight
              ? "bg-surface border-accent/40 text-text-primary shadow-accent/10"
              : "bg-black/75 border-white/10 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            }`}
        >

          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

          {/* Optional Branding Header (Hidden when hideHeader=true to avoid double branding) */}
          {!hideHeader && (
            <div className="text-center space-y-2">
              <div className="inline-block px-3 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-1">
                VIP MEMBER PORTAL
              </div>

              <h1 className={`text-3xl font-display font-extrabold uppercase tracking-widest ${isLight ? "text-text-primary" : "text-white"}`}>
                Stock<span className="text-accent">Saathi</span>
              </h1>

              <p className={`text-xs font-sans leading-relaxed max-w-xs mx-auto pt-1 ${isLight ? "text-text-secondary" : "text-white/60"}`}>
                Elevate your experience with exclusive perks, early releases, and special rewards.
              </p>
            </div>
          )}

          {/* Login / Signup Tab Toggle Header */}
          <div className={`flex items-center justify-center gap-4 border-b pb-4 text-xs font-mono tracking-[0.2em] relative ${isLight ? "border-accent/20" : "border-white/10"}`}>

            {/* LOGIN TAB */}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={() => handleTabSwitch("login")}
              className={`relative py-1 transition-colors duration-200 uppercase ${activeTab === "login"
                  ? isLight ? "text-accent font-bold" : "text-white font-bold"
                  : isLight ? "text-text-secondary hover:text-text-primary" : "text-white/40 hover:text-white/80"
                }`}
            >
              LOGIN
              {activeTab === "login" && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_var(--accent)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <span className={isLight ? "text-text-secondary/40 select-none" : "text-white/20 select-none"}>//</span>

            {/* SIGN UP TAB */}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={() => handleTabSwitch("signup")}
              className={`relative py-1 transition-colors duration-200 uppercase ${activeTab === "signup"
                  ? isLight ? "text-accent font-bold" : "text-white font-bold"
                  : isLight ? "text-text-secondary hover:text-text-primary" : "text-white/40 hover:text-white/80"
                }`}
            >
              SIGN UP
              {activeTab === "signup" && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_var(--accent)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Form Section Label */}
          <div className="flex items-center justify-between text-[11px] font-mono text-accent tracking-[0.2em] uppercase">
            <span>{activeTab === "login" ? "[01] LOGIN" : "[02] SIGN UP"}</span>
            <span className={isLight ? "text-text-secondary/70 font-normal" : "text-white/40 font-normal"}>SECURE AUTH</span>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-500 text-xs font-mono tracking-wider flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Framer Motion AnimatePresence Sequenced Form Exit & Entrance */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                x: slideDirection === "right" ? 30 : -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: slideDirection === "right" ? -30 : 30,
              }}
              transition={{
                duration: 0.22,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {activeTab === "login" ? (
                /* ================= LOGIN FORM ================= */
                <form onSubmit={handleLoginSubmit} className="space-y-4">

                  {/* Input: Email */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="login-email" className="block text-[10px] font-mono tracking-[0.2em] text-accent uppercase font-bold">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@kiranastore.com"
                      className={`auth-input w-full border rounded-xl px-4 py-3 text-sm font-mono transition-all focus:outline-none ${isLight
                          ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                          : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                        }`}
                    />
                  </div>

                  {/* Input: Password */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="login-password" className="block text-[10px] font-mono tracking-[0.2em] text-accent uppercase font-bold">
                      PASSWORD *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`auth-input w-full border rounded-xl px-4 py-3 pr-10 text-sm font-mono transition-all focus:outline-none ${isLight
                            ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                            : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-3.5 transition-colors ${isLight ? "text-text-secondary hover:text-text-primary" : "text-white/40 hover:text-white"}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sub-actions */}
                  <div className={`flex items-center justify-between text-[11px] font-mono pt-1 ${isLight ? "text-text-secondary" : "text-white/60"}`}>
                    <button
                      type="button"
                      onClick={() => alert("Password reset link sent to your email.")}
                      className="hover:text-accent transition-colors underline underline-offset-4"
                    >
                      FORGOT PASSWORD?
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch("signup")}
                      className={`font-bold transition-colors underline underline-offset-4 ${isLight ? "text-accent hover:text-accent-hover" : "text-[#C9A84C] hover:text-white"}`}
                    >
                      NEW MEMBER? JOIN
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 px-6 rounded-xl font-display font-extrabold uppercase tracking-widest text-xs transition-all shadow-lg border flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-4 disabled:opacity-50 ${isLight
                        ? "bg-accent hover:bg-accent-hover text-base border-accent/40 shadow-accent/20"
                        : "bg-[#C9A84C] hover:bg-[#D8B85C] text-black border-[#C9A84C]/50 shadow-[#C9A84C]/20"
                      }`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ENTER VIP PORTAL</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ================= SIGNUP FORM ================= */
                <form onSubmit={handleSignupSubmit} className="space-y-4">

                  {/* Full Name */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="signup-name" className="block text-[10px] font-mono tracking-[0.2em] text-accent uppercase font-bold">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      className={`auth-input w-full border rounded-xl px-4 py-3 text-sm font-mono transition-all focus:outline-none ${isLight
                          ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                          : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                        }`}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="signup-email" className="block text-[10px] font-mono tracking-[0.2em] text-accent uppercase font-bold">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@kiranastore.com"
                      className={`auth-input w-full border rounded-xl px-4 py-3 text-sm font-mono transition-all focus:outline-none ${isLight
                          ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                          : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                        }`}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="signup-password" className="block text-[10px] font-mono tracking-[0.2em] text-accent uppercase font-bold">
                      PASSWORD (MIN 8 CHARS) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`auth-input w-full border rounded-xl px-4 py-3 pr-10 text-sm font-mono transition-all focus:outline-none ${isLight
                            ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                            : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-3.5 transition-colors ${isLight ? "text-text-secondary hover:text-text-primary" : "text-white/40 hover:text-white"}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Store Name (Optional) */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="signup-store" className={`block text-[10px] font-mono tracking-[0.2em] uppercase ${isLight ? "text-text-secondary" : "text-white/50"}`}>
                      STORE NAME (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      id="signup-store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Laxmi Super Store"
                      className={`auth-input w-full border rounded-xl px-4 py-3 text-sm font-mono transition-all focus:outline-none ${isLight
                          ? "bg-surface-2 border-accent/30 text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
                          : "bg-[#141210] border-white/20 text-white placeholder:text-zinc-500 focus:border-[#C9A84C]"
                        }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 px-6 rounded-xl font-display font-extrabold uppercase tracking-widest text-xs transition-all shadow-lg border flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-4 disabled:opacity-50 ${isLight
                        ? "bg-accent hover:bg-accent-hover text-base border-accent/40 shadow-accent/20"
                        : "bg-[#C9A84C] hover:bg-[#D8B85C] text-black border-[#C9A84C]/50 shadow-[#C9A84C]/20"
                      }`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>CREATE VIP ACCOUNT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Terms Note */}
          <div className="pt-2 border-t border-white/5 text-center text-[10px] font-mono text-white/30 tracking-widest uppercase">
            BY JOINING YOU AGREE TO OUR VIP TERMS &amp; PRIVACY
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}
