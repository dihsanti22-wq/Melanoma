"use client";

import { motion } from "framer-motion";

interface ConfidenceBarProps {
  confidence: number;
  classId:    number;
  delay?:     number;
}

export function ConfidenceBar({ confidence, classId, delay = 0 }: ConfidenceBarProps) {
  const isMEL = classId === 0;
  const pct   = Math.round(confidence * 100);
  const colorVar  = isMEL ? "var(--mel-color)"  : "var(--nv-color)";
  const barVar    = isMEL ? "var(--accent-rose-bar)" : "var(--accent-emerald-bar)";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px]">
        <span style={{ color: "var(--text-muted)" }}>Confidence</span>
        <span className="font-mono font-bold" style={{ color: colorVar }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay }}
          className="h-full rounded-full"
          style={{ background: barVar }}
        />
      </div>
    </div>
  );
}
