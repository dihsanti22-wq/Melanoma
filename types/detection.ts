// ============================================================
// types/detection.ts
// Type definitions untuk hasil deteksi YOLOv11
// ============================================================

/**
 * Representasi satu bounding box hasil deteksi objek.
 * Koordinat dalam format [x1, y1, x2, y2] (sudut kiri-atas dan kanan-bawah).
 */
export interface BoundingBox {
  /** Koordinat x sudut kiri atas (piksel) */
  x1: number;
  /** Koordinat y sudut kiri atas (piksel) */
  y1: number;
  /** Koordinat x sudut kanan bawah (piksel) */
  x2: number;
  /** Koordinat y sudut kanan bawah (piksel) */
  y2: number;
}

/**
 * Kelas yang dapat dideteksi oleh model.
 * MEL = Melanoma (ganas), NV = Melanocytic Nevus (jinak)
 */
export type DetectionClass = "MEL" | "NV";

/**
 * Satu hasil deteksi dari model YOLOv11.
 */
export interface Detection {
  /** ID kelas numerik (0 = MEL, 1 = NV) */
  classId: number;
  /** Nama kelas yang terdeteksi */
  className: DetectionClass;
  /** Skor kepercayaan deteksi (0.0 - 1.0) */
  confidence: number;
  /** Koordinat bounding box */
  bbox: BoundingBox;
}

/**
 * Hasil lengkap inferensi dari satu citra input.
 */
export interface InferenceResult {
  /** Daftar semua objek yang terdeteksi */
  detections: Detection[];
  /** Waktu inferensi dalam milidetik */
  inferenceTimeMs: number;
  /** Dimensi citra input yang diproses (setelah resize) */
  processedImageSize: { width: number; height: number };
  /** Timestamp eksekusi inferensi */
  timestamp: Date;
}

/**
 * Status loading model ONNX.
 */
export type ModelLoadStatus = "idle" | "loading" | "ready" | "error";

/**
 * Props untuk komponen yang menampilkan hasil deteksi.
 */
export interface DetectionDisplayProps {
  result: InferenceResult | null;
  originalImageUrl: string | null;
  isLoading: boolean;
}
