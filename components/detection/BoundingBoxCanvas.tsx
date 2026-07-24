"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InferenceResult } from "@/types/detection";
import { CLASS_MEL } from "@/lib/inference/constants";


interface BoundingBoxCanvasProps {
  imageUrl: string;
  result:   InferenceResult;
}

export function BoundingBoxCanvas({ imageUrl, result }: BoundingBoxCanvasProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      for (const det of result.detections) {
        const { x1, y1, x2, y2 } = det.bbox;
        const w    = x2 - x1;
        const h    = y2 - y1;
        // Gunakan classId (0=MEL, 1=NV) bukan className string untuk pengecekan warna
        // className berisi "Melanoma"/"Melanocytic Nevus" (dari CLASS_LABELS_ID), BUKAN "MEL"/"NV"
        const isMEL = det.classId === CLASS_MEL;

        // Hex colors — merah untuk MEL (ganas), hijau untuk NV (jinak)
        const hexColor    = isMEL ? "#f43f5e" : "#10b981";
        const hexColorBg  = isMEL ? "rgba(244,63,94,0.12)" : "rgba(16,185,129,0.12)";

        // Shadow glow
        ctx.shadowColor = hexColor;
        ctx.shadowBlur  = 16;

        // Bounding box
        ctx.strokeStyle = hexColor;
        ctx.lineWidth   = Math.max(2, Math.min(4, img.naturalWidth / 250));
        ctx.strokeRect(x1, y1, w, h);
        ctx.shadowBlur = 0;

        // Fill (subtle)
        ctx.fillStyle = hexColorBg;
        ctx.fillRect(x1, y1, w, h);

        // Label background
        const labelText  = `${det.className}  ${(det.confidence * 100).toFixed(1)}%`;
        const fontSize   = Math.max(12, Math.min(18, img.naturalWidth / 55));
        ctx.font         = `bold ${fontSize}px "JetBrains Mono", monospace`;
        const textW      = ctx.measureText(labelText).width;
        const labelH     = fontSize * 1.8;
        const labelX     = x1;
        const labelY     = y1 > labelH + 4 ? y1 - labelH : y1;

        // Label pill
        ctx.fillStyle   = hexColor;
        const rx = 6;
        ctx.beginPath();
        ctx.moveTo(labelX + rx, labelY);
        ctx.lineTo(labelX + textW + 16 - rx, labelY);
        ctx.quadraticCurveTo(labelX + textW + 16, labelY, labelX + textW + 16, labelY + rx);
        ctx.lineTo(labelX + textW + 16, labelY + labelH - rx);
        ctx.quadraticCurveTo(labelX + textW + 16, labelY + labelH, labelX + textW + 16 - rx, labelY + labelH);
        ctx.lineTo(labelX + rx, labelY + labelH);
        ctx.quadraticCurveTo(labelX, labelY + labelH, labelX, labelY + labelH - rx);
        ctx.lineTo(labelX, labelY + rx);
        ctx.quadraticCurveTo(labelX, labelY, labelX + rx, labelY);
        ctx.closePath();
        ctx.fill();

        // Label text
        ctx.fillStyle   = "#fff";
        ctx.fillText(labelText, labelX + 8, labelY + fontSize * 1.25);

        // Corner brackets (tactical style)
        const bracketLen = Math.max(14, Math.min(30, Math.min(w, h) * 0.18));
        const bw = ctx.lineWidth * 1.5;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth   = bw;
        ctx.lineCap     = "round";

        const corners: [number, number, number, number][] = [
          [x1, y1, 1, 1], [x2, y1, -1, 1], [x1, y2, 1, -1], [x2, y2, -1, -1],
        ];
        for (const [cx, cy, dx, dy] of corners) {
          ctx.beginPath();
          ctx.moveTo(cx + dx * bracketLen, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + dy * bracketLen);
          ctx.stroke();
        }
      }
    };
    img.src = imageUrl;
  }, [loaded, imageUrl, result]);

  const aspectRatio = naturalSize.h > 0 ? naturalSize.w / naturalSize.h : 16 / 9;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-xl w-full"
        style={{
          aspectRatio,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxHeight: "340px",
        }}
      >
        <canvas
          ref={canvasRef}
          id="detection-canvas"
          className="w-full h-full object-contain"
          aria-label={`Hasil deteksi: ${result.detections.length} lesi ditemukan`}
        />

        {/* Detection count badge */}
        {result.detections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: "rgba(4,7,16,0.8)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="text-neutral-300">
              {result.detections.length} lesi
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
