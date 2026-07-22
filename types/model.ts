// ============================================================
// types/model.ts
// Type definitions untuk konfigurasi model ONNX
// ============================================================

/**
 * Konfigurasi model YOLOv11 ONNX.
 */
export interface ModelConfig {
  /** Path ke file model ONNX (relatif dari /public) */
  modelPath: string;
  /** Ukuran input model dalam piksel (default: 640) */
  inputSize: number;
  /** Confidence threshold minimum untuk menampilkan deteksi */
  confidenceThreshold: number;
  /** IoU threshold untuk Non-Maximum Suppression */
  iouThreshold: number;
  /** Jumlah kelas yang dapat dideteksi */
  numClasses: number;
  /** Nama-nama kelas sesuai urutan training */
  classNames: string[];
}

/**
 * Status sesi ONNX Runtime.
 */
export interface OrtSessionState {
  /** Session ONNX Runtime (null jika belum diinisialisasi) */
  session: unknown | null;
  /** Status loading */
  status: "idle" | "loading" | "ready" | "error";
  /** Pesan error jika ada */
  error: string | null;
}

/**
 * Informasi eksekusi provider ONNX Runtime.
 */
export type ExecutionProvider = "webgpu" | "webgl" | "wasm" | "cpu";

/**
 * Informasi tentang model yang sedang digunakan.
 */
export interface ModelInfo {
  /** Nama model */
  name: string;
  /** Versi model */
  version: string;
  /** Tanggal training */
  trainedAt: string;
  /** Metrik evaluasi final */
  metrics: {
    mAP50: number;
    mAP5095: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  /** Dataset yang digunakan untuk training */
  dataset: string;
  /** Jumlah epoch training */
  epochs: number;
}
