"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CameraStream } from "@/components/input/CameraStream";
import { BoundingBoxCanvas } from "@/components/detection/BoundingBoxCanvas";
import { DetectionResultCard } from "@/components/detection/DetectionResultCard";
import { MEDICAL_DISCLAIMER } from "@/lib/inference/constants";
import { formatInferenceTime } from "@/lib/utils";
import type { InferenceResult } from "@/types/detection";

type PageStatus = "idle" | "model-loading" | "inferencing" | "done" | "error";

export default function CameraPage() {
  const [status,           setStatus]           = useState<PageStatus>("idle");
  const [result,           setResult]           = useState<InferenceResult | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [errorMsg,         setErrorMsg]         = useState<string>("");

  const handleCapture = useCallback(async (canvas: HTMLCanvasElement) => {
    setStatus("model-loading");
    setErrorMsg("");
    const imageUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImageUrl(imageUrl);

    try {
      const { initializeModel, runInferenceOnElement, isModelReady } = await import("@/lib/inference/yolo-inference");
      if (!isModelReady()) await initializeModel();
      setStatus("inferencing");
      const inferenceResult = await runInferenceOnElement(canvas);
      setResult(inferenceResult);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menjalankan deteksi.");
      setStatus("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setCapturedImageUrl(null);
    setStatus("idle");
    setErrorMsg("");
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
            <span className="text-xs font-mono text-violet-500 tracking-widest uppercase">Camera</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Deteksi via Kamera</h1>
          <p className="text-neutral-500 text-sm max-w-xl">
            Aktifkan kamera, arahkan ke lesi kulit, lalu tangkap frame untuk dianalisis oleh YOLOv11 secara lokal di browser.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Camera Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">1</div>
                <h2 className="text-sm font-semibold text-neutral-200">Kamera Langsung</h2>
              </div>
              {/* LIVE badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-400"
                style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" style={{ animation: "pulse-dot 1.2s ease-in-out infinite" }} />
                LIVE
              </div>
            </div>

            <CameraStream onCapture={handleCapture} isProcessing={isProcessing} />

            {/* Status messages */}
            <AnimatePresence>
              {status === "model-loading" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-teal-400 p-3 rounded-xl"
                  style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.18)" }}
                >
                  <div className="w-3.5 h-3.5 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin flex-shrink-0" />
                  Memuat model YOLOv11 ONNX... (hanya sekali)
                </motion.div>
              )}
              {status === "inferencing" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-violet-400 p-3 rounded-xl"
                  style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.18)" }}
                >
                  <div className="w-3.5 h-3.5 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin flex-shrink-0" />
                  Menjalankan inferensi YOLOv11...
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-sm text-rose-400 p-3 rounded-xl"
                  style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Result Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400">2</div>
                <h2 className="text-sm font-semibold text-neutral-200">Hasil Tangkapan</h2>
              </div>
              {result && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-teal-400 transition-colors hover:text-teal-300"
                  style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}
                >
                  Tangkap Ulang
                </motion.button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {status === "done" && result && capturedImageUrl && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <BoundingBoxCanvas imageUrl={capturedImageUrl} result={result} />

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    {[
                      { label: "Lesi Terdeteksi", value: `${result.detections.length} lesi` },
                      { label: "Waktu Inferensi",  value: formatInferenceTime(result.inferenceTimeMs) },
                    ].map((s) => (
                      <div key={s.label} className="text-center py-3 px-2" style={{ background: "rgba(10,15,30,0.9)" }}>
                        <div className="text-xs text-neutral-600 mb-1">{s.label}</div>
                        <div className="text-sm font-bold font-mono text-neutral-200">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {result.detections.length === 0 && (
                    <div className="text-center py-6 rounded-xl text-sm text-neutral-600" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                      Tidak ada lesi terdeteksi. Pastikan lesi terlihat jelas dan pencahayaan merata.
                    </div>
                  )}

                  {result.detections.length > 0 && (
                    <div className="space-y-3">
                      {result.detections.map((det, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                          <DetectionResultCard detection={det} index={i} />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex gap-2.5 items-start p-3 rounded-xl text-xs text-neutral-500"
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

              {status !== "done" && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}
                  >
                    <svg className="w-8 h-8 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">
                    Aktifkan kamera → arahkan ke lesi → tekan{" "}
                    <strong className="text-teal-600">Tangkap & Deteksi</strong>
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
