// ============================================================
// lib/utils.ts
// Fungsi utilitas umum
// ============================================================

import { clsx, type ClassValue } from "clsx";

/**
 * Menggabungkan class names dengan dukungan kondisional.
 * Wrapper untuk `clsx`.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format angka confidence menjadi persentase dengan 1 desimal.
 * Contoh: 0.8532 → "85.3%"
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Format waktu inferensi dalam milidetik.
 * Contoh: 145 → "145 ms"
 */
export function formatInferenceTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} detik`;
}

/**
 * Mengubah File menjadi Object URL yang bisa ditampilkan di browser.
 * Ingat untuk memanggil URL.revokeObjectURL() setelah selesai.
 */
export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Validasi apakah file adalah gambar yang diterima sistem.
 */
export function isValidImageFile(file: File): boolean {
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
  return acceptedTypes.includes(file.type);
}

/**
 * Format ukuran file dari bytes ke format yang mudah dibaca.
 * Contoh: 1048576 → "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Debounce function — menunda eksekusi fungsi hingga setelah
 * delay tertentu berlalu tanpa pemanggilan baru.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Kapitalisasi huruf pertama dari sebuah string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format tanggal ke format Indonesia.
 * Contoh: "18 Juli 2026, 00:57"
 */
export function formatDateIndonesia(date: Date): string {
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
