"use client";

interface ClassBadgeProps {
  className: string; // "MEL" | "NV"
  size?: "sm" | "md";
}

export function ClassBadge({ className: cls, size = "md" }: ClassBadgeProps) {
  const isMEL  = cls === "MEL";
  const color  = isMEL ? "var(--mel-color)"   : "var(--nv-color)";
  const bg     = isMEL ? "var(--mel-dim)"     : "var(--nv-dim)";
  const border = isMEL ? "var(--mel-border)"  : "var(--nv-border)";
  const label  = isMEL ? "Melanoma"           : "Melanocytic Nevus";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {cls} · {label}
    </span>
  );
}
