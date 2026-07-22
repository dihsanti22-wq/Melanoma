// ============================================================
// lib/inference/constants.ts
// Konstanta konfigurasi model YOLOv11 Melanoma Detector
// ============================================================

import type { ModelConfig } from "@/types/model";

// ─── Konfigurasi Model ────────────────────────────────────────────────────

/**
 * Konfigurasi default model YOLOv11 untuk deteksi lesi melanoma.
 *
 * Catatan untuk peneliti:
 * - confidenceThreshold: 0.25 sesuai rekomendasi Ultralytics default
 * - iouThreshold: 0.45 sesuai parameter NMS standar YOLOv11
 * - inputSize: 640x640 sesuai resolusi training dataset HAM10000
 */
export const MODEL_CONFIG: ModelConfig = {
  modelPath: "/models/best.onnx",
  // Model ONNX sudah di-export dengan fixed input 640×640 — JANGAN diubah
  // tanpa export ulang model dari training
  inputSize: 640,
  confidenceThreshold: 0.25,
  iouThreshold: 0.45,
  numClasses: 2,
  classNames: ["MEL", "NV"],
};


// ─── Indeks Kelas ─────────────────────────────────────────────────────────

/** ID numerik kelas Melanoma (sesuai urutan training) */
export const CLASS_MEL = 0;

/** ID numerik kelas Melanocytic Nevus (sesuai urutan training) */
export const CLASS_NV = 1;

// ─── Tampilan Visual ──────────────────────────────────────────────────────

/**
 * Warna bounding box per kelas.
 * - Merah (#ef4444): Melanoma — sinyal bahaya/ganas
 * - Hijau (#22c55e): Melanocytic Nevus — sinyal aman/jinak
 */
export const CLASS_COLORS: Record<number, string> = {
  [CLASS_MEL]: "#ef4444", // Merah — Melanoma (Ganas)
  [CLASS_NV]: "#22c55e", // Hijau — Melanocytic Nevus (Jinak)
};

/**
 * Label tampilan bahasa Indonesia per kelas.
 */
export const CLASS_LABELS_ID: Record<number, string> = {
  [CLASS_MEL]: "Melanoma",
  [CLASS_NV]: "Melanocytic Nevus",
};

/**
 * Deskripsi singkat per kelas untuk antarmuka pengguna.
 */
export const CLASS_DESCRIPTIONS: Record<number, string> = {
  [CLASS_MEL]:
    "Lesi yang terdeteksi berpotensi bersifat ganas. Segera konsultasikan dengan dokter spesialis kulit (dermatolog).",
  [CLASS_NV]:
    "Lesi yang terdeteksi berpotensi bersifat jinak (tahi lalat). Tetap pantau perkembangan secara berkala.",
};

/**
 * Ketebalan garis bounding box dalam piksel.
 */
export const BBOX_LINE_WIDTH = 2;

/**
 * Ukuran font label teks di atas bounding box.
 */
export const BBOX_FONT_SIZE = 14;

// ─── Pesan Disclaimer Medis ───────────────────────────────────────────────

/**
 * Teks disclaimer resmi yang WAJIB ditampilkan di setiap halaman hasil.
 * Sesuai standar etika medis dalam penelitian AI diagnosis.
 */
export const MEDICAL_DISCLAIMER =
  "⚠️ PERHATIAN: Sistem ini merupakan alat bantu skrining awal berbasis kecerdasan buatan dan BUKAN pengganti diagnosis medis profesional. Hasil deteksi sistem ini tidak boleh dijadikan dasar keputusan medis tanpa konfirmasi dari dokter spesialis kulit (dermatolog) yang berkompeten. Selalu konsultasikan kondisi kulit Anda kepada tenaga medis profesional.";

// ─── Format File yang Diterima ────────────────────────────────────────────

/** Format file citra yang diterima sistem */
export const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

/** Ukuran file maksimum: 10 MB */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// ─── CLASS_INFO (gabungan label + deskripsi per kelas) ───────────────────────

/**
 * Informasi lengkap per kelas: label tampilan dan deskripsi klinis.
 * Digunakan oleh komponen DetectionResultCard.
 */
export const CLASS_INFO: Record<number, { label: string; description: string }> = {
  [CLASS_MEL]: {
    label: "Melanoma (Ganas)",
    description: CLASS_DESCRIPTIONS[CLASS_MEL],
  },
  [CLASS_NV]: {
    label: "Melanocytic Nevus (Jinak)",
    description: CLASS_DESCRIPTIONS[CLASS_NV],
  },
};

