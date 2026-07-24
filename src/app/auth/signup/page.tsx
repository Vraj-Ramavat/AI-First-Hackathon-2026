"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, Store as StoreIcon, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name) {
      setError("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
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
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Auto-login after successful signup
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
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col justify-center py-12 px-6 sm:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-1 group mb-6">
          <span className="font-display font-bold text-3xl text-text-primary tracking-tight">
            Stock
          </span>
          <span className="font-display font-bold text-3xl text-accent tracking-tight group-hover:text-accent-hover transition-colors">
            Saathi
          </span>
        </Link>

        <h2 className="text-center text-2xl font-display font-bold text-text-primary tracking-tight">
          Create Kirana Store Account
        </h2>
        <p className="mt-2 text-center text-sm font-mono text-text-secondary">
          Get started with AI-powered shelf inventory intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-surface/80 backdrop-blur-md p-8 rounded-3xl hairline-all shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Patel"
                  className="w-full bg-base border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@kirana.com"
                  className="w-full bg-base border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Password (Min 8 Chars)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-base border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5">
                Store Name (Optional)
              </label>
              <div className="relative">
                <StoreIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Patel Super Store"
                  className="w-full bg-base border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-text-primary font-semibold text-sm transition-all shadow-lg shadow-accent/10 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account &amp; Provision Store</span>
                  <ArrowRight className="w-4 h-4 text-text-primary" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-text-secondary font-mono">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
