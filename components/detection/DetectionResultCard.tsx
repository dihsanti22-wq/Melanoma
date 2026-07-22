"use client";

import { motion } from "framer-motion";
import type { Detection } from "@/types/detection";
import { CLASS_INFO } from "@/lib/inference/constants";
import { formatConfidence } from "@/lib/utils";

interface DetectionResultCardProps {
  detection: Detection;
  index:     number;
}

export function DetectionResultCard({ detection, index }: DetectionResultCardProps) {
  const info       = CLASS_INFO[detection.classId];
  const confidence = detection.confidence;
  const isMEL      = detection.className === "MEL";

  // All colors from CSS variables — responsive to dark/light mode
  const colorVar  = isMEL ? "var(--mel-color)"      : "var(--nv-color)";
  const bgVar     = isMEL ? "var(--mel-dim)"         : "var(--nv-dim)";
  const borderVar = isMEL ? "var(--mel-border)"      : "var(--nv-border)";
  const numBgVar  = isMEL ? "var(--mel-num-bg)"      : "var(--nv-num-bg)";
  const barVar    = isMEL ? "var(--accent-rose-bar)" : "var(--accent-emerald-bar)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-xl p-4 space-y-3"
      style={{ background: bgVar, border: `1px solid ${borderVar}` }}
    >
      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Index badge */}
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: numBgVar, color: colorVar, border: `1px solid ${borderVar}` }}
          >
            {index + 1}
          </span>

          {/* Class badge */}
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
            style={{ background: numBgVar, color: colorVar, border: `1px solid ${borderVar}` }}
          >
            {detection.className}
          </span>

          {/* Label */}
          <span className="text-xs font-semibold" style={{ color: colorVar }}>
            {info?.label ?? detection.className}
          </span>
        </div>

        {/* Confidence pct */}
        <span className="font-mono text-sm font-bold" style={{ color: colorVar }}>
          {formatConfidence(confidence)}
        </span>
      </div>

      {/* ── Confidence bar ── */}
      <div>
        <div className="flex justify-between mb-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
          <span>Confidence</span>
          <span className="font-mono">{formatConfidence(confidence)}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: index * 0.06 + 0.15 }}
            className="h-full rounded-full"
            style={{ background: barVar }}
          />
        </div>
      </div>

      {/* ── Description ── */}
      {info?.description && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {info.description}
        </p>
      )}

      {/* ── BBox coordinates ── */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "X1", value: Math.round(detection.bbox.x1) },
          { label: "Y1", value: Math.round(detection.bbox.y1) },
          { label: "W",  value: Math.round(detection.bbox.x2 - detection.bbox.x1) },
          { label: "H",  value: Math.round(detection.bbox.y2 - detection.bbox.y1) },
        ].map((coord) => (
          <div
            key={coord.label}
            className="text-center py-1.5 rounded-lg"
            style={{ background: "var(--bg-badge)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>{coord.label}</div>
            <div className="text-[10px] font-bold font-mono" style={{ color: "var(--text-secondary)" }}>{coord.value}px</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
