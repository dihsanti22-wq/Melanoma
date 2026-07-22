"use client";

export function LoadingSpinner({ size = "md", label = "Memuat..." }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const s = { sm: "w-5 h-5 border-2", md: "w-9 h-9 border-2", lg: "w-14 h-14 border-2" }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <div className={`${s} rounded-full border-teal-500/20 border-t-teal-400 animate-spin`} />
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  );
}
