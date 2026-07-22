"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDropzone } from "@/components/input/ImageDropzone";
import { BoundingBoxCanvas } from "@/components/detection/BoundingBoxCanvas";
import { DetectionResultCard } from "@/components/detection/DetectionResultCard";
import { MEDICAL_DISCLAIMER } from "@/lib/inference/constants";
import { formatInferenceTime, formatDateIndonesia } from "@/lib/utils";
import type { InferenceResult } from "@/types/detection";

type PageStatus = "idle" | "model-loading" | "inferencing" | "done" | "error";

export default function UploadPage() {
  const [imageUrl,         setImageUrl]         = useState<string | null>(null);
  const [status,           setStatus]           = useState<PageStatus>("idle");
  const [result,           setResult]           = useState<InferenceResult | null>(null);
  const [errorMsg,         setErrorMsg]         = useState<string>("");
  const [modelLoadProgress, setModelLoadProgress] = useState(0);

  const handleDetect = useCallback(async () => {
    if (!imageUrl) return;
    setStatus("model-loading");
    setResult(null);
    setErrorMsg("");
    setModelLoadProgress(0);

    try {
      const { initializeModel, runInference, isModelReady } = await import("@/lib/inference/yolo-inference");
      if (!isModelReady()) {
        await initializeModel(undefined, (p) => setModelLoadProgress(p));
      }
      setStatus("inferencing");
      const inferenceResult = await runInference(imageUrl);
      setResult(inferenceResult);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.");
      setStatus("error");
    }
  }, [imageUrl]);


  const handleReset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  }, [imageUrl]);

  const handleFileAccepted = useCallback((_file: File, previewUrl: string) => {
    setImageUrl(previewUrl);
    setResult(null);
    setStatus("idle");
  }, []);

  const isProcessing = status === "model-loading" || status === "inferencing";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container flex-1 py-8" id="main-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-teal-500 tracking-widest uppercase">Upload</span>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-500/30 to-transparent" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Deteksi via Citra</h1>
          <p className="text-neutral-500 text-sm max-w-xl">
            Upload citra dermoskopi — model YOLOv11 memproses langsung di browser Anda.
            Data tidak pernah dikirim ke server manapun.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400">1</div>
              <h2 className="text-sm font-semibold text-neutral-200">Pilih Citra Dermoskopi</h2>
            </div>

            <ImageDropzone
              onFileAccepted={handleFileAccepted}
              onError={(msg) => { setErrorMsg(msg); setStatus("error"); }}
              isDisabled={isProcessing}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                id="detect-btn"
                whileHover={!isProcessing && imageUrl ? { scale: 1.02 } : {}}
                whileTap={!isProcessing && imageUrl ? { scale: 0.98 } : {}}
                onClick={handleDetect}
                disabled={!imageUrl || isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: imageUrl && !isProcessing
                    ? "linear-gradient(135deg, #0d9488, #14b8a6)"
                    : "rgba(20,184,166,0.2)",
                  boxShadow: imageUrl && !isProcessing ? "0 4px 20px rgba(20,184,166,0.25)" : "none",
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {status === "model-loading" ? `Memuat Model... ${modelLoadProgress}%` : "Mendeteksi..."}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Jalankan Deteksi
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {(imageUrl || result) && (
                  <motion.button
                    id="reset-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={isProcessing}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-40"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Reset
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Model loading progress bar */}
            <AnimatePresence>
              {status === "model-loading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #0d9488, #14b8a6)", boxShadow: "0 0 10px rgba(20,184,166,0.6)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${modelLoadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1.5 font-mono">
                    Memuat model ONNX: {modelLoadProgress}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  role="alert"
                  className="flex items-start gap-2.5 p-3 rounded-xl text-sm text-rose-400"
                  style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info note */}
            {status === "idle" && !imageUrl && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg text-xs text-neutral-600"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Pastikan <code className="font-mono text-teal-600 mx-0.5">best.onnx</code> tersedia di
                <code className="font-mono text-teal-600 mx-0.5">public/models/</code> sebelum deteksi.
              </div>
            )}
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">2</div>
                <h2 className="text-sm font-semibold text-neutral-200">Hasil Deteksi</h2>
              </div>
              {result && (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Cetak
                </button>
              )}
            </div>

            {/* Inferencing state */}
            <AnimatePresence mode="wait">
              {status === "inferencing" && (
                <motion.div
                  key="inferencing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[300px] gap-4"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
                  </div>
                  <p className="text-sm text-neutral-500">Menjalankan inferensi YOLOv11...</p>
                </motion.div>
              )}

              {/* Done */}
              {status === "done" && result && imageUrl && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <BoundingBoxCanvas imageUrl={imageUrl} result={result} />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    {[
                      { label: "Lesi", value: String(result.detections.length) },
                      { label: "Waktu", value: formatInferenceTime(result.inferenceTimeMs) },
                      { label: "Analisis", value: formatDateIndonesia(result.timestamp).split(" ")[1] ?? "-" },
                    ].map((s) => (
                      <div key={s.label} className="text-center py-3 px-2" style={{ background: "rgba(10,15,30,0.9)" }}>
                        <div className="text-xs text-neutral-600 mb-1">{s.label}</div>
                        <div className="text-sm font-bold font-mono text-neutral-200">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* No detection */}
                  {result.detections.length === 0 && (
                    <div className="text-center py-6 rounded-xl text-sm text-neutral-600" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                      Tidak ada lesi terdeteksi. Coba citra dengan kualitas lebih tinggi.
                    </div>
                  )}

                  {/* Detection cards */}
                  {result.detections.length > 0 && (
                    <motion.div
                      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                        Rincian ({result.detections.length} lesi)
                      </p>
                      {result.detections.map((det, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <DetectionResultCard detection={det} index={i} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Disclaimer */}
                  <div
                    className="flex gap-2.5 items-start p-3 rounded-xl text-xs text-neutral-500 leading-relaxed"
                    style={{ background: "rgba(244,63,94,0.04)", border: "1px solid rgba(244,63,94,0.12)" }}
                  >
                    <svg className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    {MEDICAL_DISCLAIMER}
                  </div>
                </motion.div>
              )}

              {/* Placeholder */}
              {(status === "idle" || status === "model-loading") && !result && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                    <svg className="w-8 h-8 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-600 max-w-xs">
                    Hasil deteksi akan muncul di sini setelah gambar diproses.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
