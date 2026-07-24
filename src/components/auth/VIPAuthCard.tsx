"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, User, Store as StoreIcon, AlertCircle, Eye, EyeOff } from "lucide-react";

interface VIPAuthCardProps {
  initialTab?: "login" | "signup";
  onBackClick?: () => void;
  hideHeader?: boolean;
}

export default function VIPAuthCard({ initialTab = "login", onBackClick, hideHeader = false }: VIPAuthCardProps) {
  const router = useRouter();
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
    <div className="min-h-screen relative w-full overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 bg-black text-white selection:bg-[#C9A84C] selection:text-black">
      
      {/* Full-Bleed Dark Editorial Background Image & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2000&auto=format&fit=crop"
          alt="VIP Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-40 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* Top-Left Back Link (Rendered only when hideHeader is false) */}
      {!hideHeader && (
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-40">
          {onBackClick ? (
            <button
              type="button"
              onClick={onBackClick}
              className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A84C] hover:text-white transition-colors flex items-center gap-2 group relative py-1.5 px-4 bg-black/70 backdrop-blur-md rounded-full border border-[#C9A84C]/50 shadow-2xl"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span>BACK TO DASHBOARD</span>
            </button>
          ) : (
            <Link
              href="/"
              className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/70 hover:text-[#C9A84C] transition-colors flex items-center gap-2 group relative py-1"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span>BACK TO SHOP</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
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
          className="bg-black/75 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-8 relative overflow-hidden"
        >
          
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-80" />

          {/* Optional Branding Header (Hidden when hideHeader=true to avoid double branding) */}
          {!hideHeader && (
            <div className="text-center space-y-2">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] font-mono text-[10px] tracking-[0.3em] uppercase mb-1">
                VIP MEMBER PORTAL
              </div>
              
              <h1 className="text-3xl font-display font-extrabold uppercase tracking-widest text-white">
                Stock<span className="text-[#C9A84C]">Saathi</span>
              </h1>

              <p className="text-xs text-white/60 font-sans leading-relaxed max-w-xs mx-auto pt-1">
                Elevate your experience with exclusive perks, early releases, and special rewards.
              </p>
            </div>
          )}

          {/* Login / Signup Tab Toggle Header */}
          <div className="flex items-center justify-center gap-4 border-b border-white/10 pb-4 text-xs font-mono tracking-[0.2em] relative">
            
            {/* LOGIN TAB */}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={() => handleTabSwitch("login")}
              className={`relative py-1 transition-colors duration-200 uppercase ${
                activeTab === "login"
                  ? "text-white font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              LOGIN
              {activeTab === "login" && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#C9A84C] shadow-[0_0_10px_#C9A84C]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <span className="text-white/20 select-none">//</span>

            {/* SIGN UP TAB */}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={() => handleTabSwitch("signup")}
              className={`relative py-1 transition-colors duration-200 uppercase ${
                activeTab === "signup"
                  ? "text-white font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              SIGN UP
              {activeTab === "signup" && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#C9A84C] shadow-[0_0_10px_#C9A84C]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Form Section Label */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#C9A84C] tracking-[0.2em] uppercase">
            <span>{activeTab === "login" ? "[01] LOGIN" : "[02] SIGN UP"}</span>
            <span className="text-white/40 font-normal">SECURE AUTH</span>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono tracking-wider flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
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
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  
                  {/* Floating Underline Input: Email */}
                  <div className="relative group pt-4">
                    <input
                      type="email"
                      required
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="login-email"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      EMAIL ADDRESS *
                    </label>
                  </div>

                  {/* Floating Underline Input: Password */}
                  <div className="relative group pt-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 pr-8 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="login-password"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      PASSWORD *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 bottom-2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Sub-actions */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Password reset link sent to your email.")}
                      className="relative py-0.5 hover:text-[#C9A84C] transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9A84C] hover:after:w-full after:transition-all"
                    >
                      FORGOT PASSWORD?
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch("signup")}
                      className="relative py-0.5 text-[#C9A84C] hover:text-white transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all"
                    >
                      NEW MEMBER? JOIN
                    </button>
                  </div>

                  {/* Full-Width Streetwear Hover Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full overflow-hidden group py-4 bg-white text-black font-display font-extrabold uppercase tracking-[0.25em] text-xs transition-all duration-300 shadow-xl disabled:opacity-50 mt-4 rounded-xl"
                  >
                    <span className="absolute inset-0 bg-[#C9A84C] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>ENTER VIP PORTAL</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              ) : (
                /* ================= SIGNUP FORM ================= */
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  
                  {/* Full Name */}
                  <div className="relative group pt-4">
                    <input
                      type="text"
                      required
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="signup-name"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      FULL NAME *
                    </label>
                  </div>

                  {/* Email Address */}
                  <div className="relative group pt-4">
                    <input
                      type="email"
                      required
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="signup-email"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      EMAIL ADDRESS *
                    </label>
                  </div>

                  {/* Password */}
                  <div className="relative group pt-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 pr-8 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="signup-password"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      PASSWORD (MIN 8 CHARS) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 bottom-2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Store Name (Optional) */}
                  <div className="relative group pt-4">
                    <input
                      type="text"
                      id="signup-store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 text-sm text-white py-2 focus:border-[#C9A84C] focus:outline-none transition-colors font-mono tracking-wide placeholder-transparent"
                    />
                    <label
                      htmlFor="signup-store"
                      className="absolute left-0 top-0 text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#C9A84C]"
                    >
                      STORE NAME (OPTIONAL)
                    </label>
                  </div>

                  {/* Full-Width Streetwear Hover Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full overflow-hidden group py-4 bg-white text-black font-display font-extrabold uppercase tracking-[0.25em] text-xs transition-all duration-300 shadow-xl disabled:opacity-50 mt-4 rounded-xl"
                  >
                    <span className="absolute inset-0 bg-[#C9A84C] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>CREATE VIP ACCOUNT</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
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
