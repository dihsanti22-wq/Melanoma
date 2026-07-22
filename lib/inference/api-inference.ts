// ============================================================
// lib/inference/api-inference.ts
// Inferensi via Flask API (server-side onnxruntime)
// Jauh lebih cepat dari browser WASM!
// ============================================================

import type { InferenceResult, Detection } from "@/types/detection";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ApiResponse {
  detections: Array<{
    classId: number;
    className: string;
    confidence: number;
    bbox: { x: number; y: number; width: number; height: number };
  }>;
  inferenceTimeMs: number;
  imageSize: { width: number; height: number };
}

/**
 * Kirim gambar ke Flask backend untuk inferensi YOLOv11.
 * Server memproses dengan onnxruntime Python (~20-50ms).
 */
export async function runInferenceViaAPI(
  imageFile: File | Blob,
  imageUrl: string
): Promise<InferenceResult> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum diset. Tambahkan di Vercel Environment Variables."
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const startTime = performance.now();

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`API Error: ${err.error ?? response.statusText}`);
  }

  const data: ApiResponse = await response.json();
  const totalMs = performance.now() - startTime;

  // Konversi response API ke format InferenceResult yang dipakai frontend
  const detections: Detection[] = data.detections.map((d) => ({
    classId: d.classId,
    className: d.className,
    confidence: d.confidence,
    bbox: d.bbox,
  }));

  return {
    detections,
    inferenceTimeMs: data.inferenceTimeMs ?? totalMs,
    timestamp: new Date().toISOString(),
    imageUrl,
  };
}

/**
 * Cek apakah API backend tersedia.
 */
export async function checkAPIHealth(): Promise<boolean> {
  if (!API_URL) return false;
  try {
    const res = await fetch(`${API_URL}/`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
