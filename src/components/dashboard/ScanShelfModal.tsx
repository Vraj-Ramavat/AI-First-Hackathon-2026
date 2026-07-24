"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface ScanShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStoreId: string;
  onScanComplete: (detectedItems: any[], scanId: string, notes: string) => void;
}

export default function ScanShelfModal({
  isOpen,
  onClose,
  currentStoreId,
  onScanComplete,
}: ScanShelfModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle 1-second countdown timer for post-scan cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError("Please select a JPG, PNG, or WebP photo.");
      return;
    }

    // Validate size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError("Image file is too large. Maximum size is 8MB.");
      return;
    }

    setFileObject(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFileObject(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    // Prevent double-firing or click submissions during analysis or active cooldown
    if (!selectedImage || !currentStoreId || isAnalyzing || cooldown > 0) return;

    setIsAnalyzing(true);
    setError("");

    try {
      let res: Response;

      if (fileObject) {
        const formData = new FormData();
        formData.append("file", fileObject);
        res = await fetch(`/api/stores/${currentStoreId}/scan`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`/api/stores/${currentStoreId}/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: selectedImage }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Too many scans right now — please wait a moment and try again.");
        setCooldown(5); // 5-second cooldown after rate-limit or API error
        return;
      }

      onScanComplete(data.detected_items || [], data.scanId || "", data.notes || "");
      handleReset();
      onClose();
    } catch (err: any) {
      setError("Network or API failure. Please check your connection and try again.");
      setCooldown(5);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-surface-2 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Camera className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                AI Kirana Shelf Scanner
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Computer vision stock estimation powered by Gemini
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isAnalyzing}
            className="p-1.5 rounded-full hover:bg-base/60 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!currentStoreId && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>No Active Store Selected</span>
            </div>
            <p>You must be signed in to an active Kirana store to scan and manage inventory.</p>
          </div>
        )}

        {/* Hidden Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {!selectedImage ? (
          /* Step 1: Upload or Capture Selection */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl bg-base/60 hover:bg-base border border-white/10 hover:border-accent/40 flex flex-col items-center justify-center gap-3 text-center transition-all group"
            >
              <div className="p-3 rounded-2xl bg-surface-2 group-hover:bg-accent/10 border border-white/5 group-hover:border-accent/20 transition-colors">
                <Upload className="w-6 h-6 text-text-secondary group-hover:text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Upload Shelf Photo</p>
                <p className="text-[11px] font-mono text-text-secondary mt-0.5">Select image from gallery</p>
              </div>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-6 rounded-2xl bg-base/60 hover:bg-base border border-white/10 hover:border-accent/40 flex flex-col items-center justify-center gap-3 text-center transition-all group"
            >
              <div className="p-3 rounded-2xl bg-surface-2 group-hover:bg-accent/10 border border-white/5 group-hover:border-accent/20 transition-colors">
                <Camera className="w-6 h-6 text-text-secondary group-hover:text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Take Photo</p>
                <p className="text-[11px] font-mono text-text-secondary mt-0.5">Use rear phone camera</p>
              </div>
            </button>
          </div>
        ) : (
          /* Step 2 & 3: Preview & Analyzing */
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-base">
              {/* Image Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Kirana Shelf Preview"
                className="w-full h-full object-cover"
              />

              {/* Scanning Animation Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-full h-1 bg-accent shadow-[0_0_15px_#C9A84C] animate-bounce mb-6" />
                  <div className="p-3 rounded-2xl bg-accent/20 border border-accent/40 animate-pulse mb-3">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-base font-display font-bold text-text-primary">
                    Analyzing Kirana Shelf Photo...
                  </h4>
                  <p className="text-xs font-mono text-text-secondary max-w-xs mt-1">
                    Detecting packaging SKUs &amp; estimating stock counts via Google Gemini AI
                  </p>
                </div>
              )}
            </div>

            {!isAnalyzing && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={cooldown > 0}
                  className="py-3 px-4 rounded-xl border border-white/10 text-xs font-mono text-text-secondary hover:bg-base flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || cooldown > 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-xs font-mono font-bold text-text-primary shadow-lg shadow-accent/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isAnalyzing
                      ? "Analyzing..."
                      : cooldown > 0
                      ? `Please wait (${cooldown}s)...`
                      : "Run AI Vision Scan"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
