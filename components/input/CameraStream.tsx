"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CameraStatus = "idle" | "loading" | "active" | "error";

interface CameraStreamProps {
  onCapture:    (canvas: HTMLCanvasElement) => void;
  isProcessing: boolean;
}

export function CameraStream({ onCapture, isProcessing }: CameraStreamProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status,      setStatus]      = useState<CameraStatus>("idle");
  const [errorMsg,    setErrorMsg]    = useState("");
  const [facingMode,  setFacingMode]  = useState<"user" | "environment">("environment");
  const [flashActive, setFlashActive] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { return () => { stopCamera(); }; }, []);

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(() => { startCamera(); }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setStatus("loading");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (err) {
      const e = err as DOMException;
      if (e.name === "NotAllowedError")
        setErrorMsg("Akses kamera ditolak. Izinkan akses kamera di pengaturan browser.");
      else if (e.name === "NotFoundError")
        setErrorMsg("Kamera tidak ditemukan di perangkat ini.");
      else
        setErrorMsg("Gagal mengakses kamera: " + e.message);
      setStatus("error");
    }
  }, [facingMode, stopCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || status !== "active" || isProcessing) return;
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 250);
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    onCapture(canvas);
  }, [status, isProcessing, onCapture]);

  const handleFlip = useCallback(async () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    stopCamera();
    setStatus("idle");
  }, [stopCamera]);

  return (
    <div className="space-y-3">
      {/* ── Viewfinder ── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "16/9",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-subtle)",
          minHeight: "220px",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef} autoPlay playsInline muted id="camera-viewfinder"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            status === "active" ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />

        {/* Scan line (active only) */}
        <AnimatePresence>
          {status === "active" && !isProcessing && (
            <motion.div
              key="scanline"
              initial={{ top: "0%", opacity: 0 }}
              animate={{ top: ["0%", "100%", "0%"], opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px pointer-events-none z-20"
              style={{ background: "linear-gradient(90deg, transparent, var(--scanner-line), transparent)" }}
            />
          )}
        </AnimatePresence>

        {/* Corner brackets (active only) */}
        {status === "active" && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-tl-md" style={{ borderTop: "2px solid var(--scanner-bracket)", borderLeft: "2px solid var(--scanner-bracket)" }} />
            <div className="absolute top-4 right-4 w-8 h-8 rounded-tr-md" style={{ borderTop: "2px solid var(--scanner-bracket)", borderRight: "2px solid var(--scanner-bracket)" }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 rounded-bl-md" style={{ borderBottom: "2px solid var(--scanner-bracket)", borderLeft: "2px solid var(--scanner-bracket)" }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-br-md" style={{ borderBottom: "2px solid var(--scanner-bracket)", borderRight: "2px solid var(--scanner-bracket)" }} />
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
              <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: "var(--scanner-crosshair)" }} />
              <div className="absolute left-1/2 top-0 bottom-0 w-px"  style={{ background: "var(--scanner-crosshair)" }} />
            </div>
          </div>
        )}

        {/* Capture flash */}
        <AnimatePresence>
          {flashActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 pointer-events-none z-30"
              style={{ background: "white" }}
            />
          )}
        </AnimatePresence>

        {/* Processing overlay */}
        <AnimatePresence>
          {isProcessing && status === "active" && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
              style={{ background: "var(--scanner-overlay)", backdropFilter: "blur(4px)" }}
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "var(--accent-teal-dim)" }} />
                <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "var(--accent-teal)" }} />
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--accent-teal)" }}>Mendeteksi lesi...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle / Loading / Error overlay */}
        <AnimatePresence>
          {status !== "active" && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            >
              {status === "loading" ? (
                <>
                  <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "var(--accent-teal-dim)", borderTopColor: "var(--accent-teal)" }} />
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Mengakses kamera...</p>
                </>
              ) : status === "error" ? (
                <div className="text-center px-8 space-y-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: "var(--mel-dim)", border: "1px solid var(--mel-border)" }}
                  >
                    <svg className="w-5 h-5" style={{ color: "var(--mel-color)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--mel-color)" }}>{errorMsg}</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "var(--bg-badge)", border: "1px dashed var(--border-default)" }}
                  >
                    <svg className="w-6 h-6" style={{ color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kamera belum aktif</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ── */}
      <div className="flex gap-2.5">
        {status !== "active" ? (
          <motion.button
            id="start-camera-btn"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={startCamera} disabled={status === "loading"}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: "var(--btn-secondary-bg)", color: "var(--btn-primary-text)" }}
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            )}
            {status === "error" ? "Coba Lagi" : "Aktifkan Kamera"}
          </motion.button>
        ) : (
          <>
            {/* Capture */}
            <motion.button
              id="capture-btn"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={handleCapture} disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{
                background: isProcessing ? "var(--accent-teal-dim)" : "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
                boxShadow: isProcessing ? "none" : "var(--btn-primary-shadow)",
              }}
            >
              <div className="w-3 h-3 rounded-full border-2 border-white/60 bg-white/20 flex-shrink-0" />
              Tangkap &amp; Deteksi
            </motion.button>

            {/* Flip */}
            <motion.button
              id="flip-camera-btn"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleFlip} disabled={isProcessing}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              style={{
                background: "var(--btn-ghost-bg)",
                border: "1px solid var(--btn-ghost-border)",
                color: "var(--btn-ghost-text)",
              }}
              title="Flip kamera"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
            </motion.button>

            {/* Stop */}
            <motion.button
              id="stop-camera-btn"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { stopCamera(); setStatus("idle"); }} disabled={isProcessing}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              style={{
                background: "var(--btn-ghost-bg)",
                border: "1px solid var(--btn-ghost-border)",
                color: "var(--btn-ghost-text)",
              }}
              title="Hentikan kamera"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
