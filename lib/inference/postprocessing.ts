// ============================================================
// lib/inference/postprocessing.ts
// Pasca-proses output YOLOv11 (NMS + decode bounding box)
// ============================================================

import type { Detection, BoundingBox } from "@/types/detection";
import { CLASS_LABELS_ID } from "./constants";

/**
 * Melakukan Non-Maximum Suppression (NMS) pada daftar deteksi.
 *
 * NMS menghilangkan bounding box yang redundan/tumpang tindih
 * dengan hanya mempertahankan deteksi dengan confidence tertinggi.
 *
 * @param detections - Daftar deteksi sebelum NMS
 * @param iouThreshold - Batas IoU untuk menganggap dua bbox sama (default: 0.45)
 * @returns Daftar deteksi setelah NMS
 */
export function applyNMS(
  detections: Detection[],
  iouThreshold: number = 0.45
): Detection[] {
  if (detections.length === 0) return [];

  // Urutkan berdasarkan confidence (tertinggi ke terendah)
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: Detection[] = [];

  while (sorted.length > 0) {
    // Ambil deteksi dengan confidence tertinggi
    const best = sorted.shift()!;
    kept.push(best);

    // Filter deteksi yang overlap terlalu besar dengan 'best'
    const remaining = sorted.filter((det) => {
      // Hanya bandingkan bbox dari kelas yang sama
      if (det.classId !== best.classId) return true;
      return computeIoU(best.bbox, det.bbox) < iouThreshold;
    });

    sorted.length = 0;
    sorted.push(...remaining);
  }

  return kept;
}

/**
 * Menghitung Intersection over Union (IoU) antara dua bounding box.
 *
 * IoU = Area Irisan / Area Gabungan
 *
 * @param boxA - Bounding box pertama
 * @param boxB - Bounding box kedua
 * @returns Nilai IoU antara 0.0 dan 1.0
 */
export function computeIoU(boxA: BoundingBox, boxB: BoundingBox): number {
  // Hitung koordinat area irisan
  const interX1 = Math.max(boxA.x1, boxB.x1);
  const interY1 = Math.max(boxA.y1, boxB.y1);
  const interX2 = Math.min(boxA.x2, boxB.x2);
  const interY2 = Math.min(boxA.y2, boxB.y2);

  // Luas area irisan
  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const interArea = interW * interH;

  if (interArea === 0) return 0;

  // Luas masing-masing bounding box
  const areaA = (boxA.x2 - boxA.x1) * (boxA.y2 - boxA.y1);
  const areaB = (boxB.x2 - boxB.x1) * (boxB.y2 - boxB.y1);

  // Luas area gabungan
  const unionArea = areaA + areaB - interArea;

  return interArea / unionArea;
}

/**
 * Mengurai output tensor mentah dari YOLOv11 menjadi daftar Detection.
 *
 * Format output YOLOv11 (anchor-free):
 * Tensor shape: [1, (4 + numClasses), numAnchors]
 * - 4 nilai pertama: cx, cy, w, h (format pusat kotak)
 * - Nilai berikutnya: skor setiap kelas
 *
 * @param rawOutput - Float32Array output dari ONNX Runtime
 * @param outputShape - Shape tensor output [batch, features, anchors]
 * @param confidenceThreshold - Batas minimum confidence
 * @param numClasses - Jumlah kelas
 * @param scale - Skala resize dari preprocessing
 * @param padX - Padding horizontal dari letterboxing
 * @param padY - Padding vertikal dari letterboxing
 * @param originalWidth - Lebar gambar asli
 * @param originalHeight - Tinggi gambar asli
 * @param inputSize - Ukuran input model (640)
 * @returns Daftar deteksi mentah (sebelum NMS)
 */
export function decodeYOLOOutput(
  rawOutput: Float32Array,
  outputShape: number[],
  confidenceThreshold: number,
  numClasses: number,
  scale: number,
  padX: number,
  padY: number,
  originalWidth: number,
  originalHeight: number,
  _inputSize: number = 640
): Detection[] {
  const detections: Detection[] = [];

  // outputShape: [1, 4 + numClasses, numAnchors]
  const numAnchors = outputShape[2];
  const _numFeatures = outputShape[1]; // 4 + numClasses (unused, kept for documentation)

  for (let i = 0; i < numAnchors; i++) {
    // Baca 4 koordinat kotak (cx, cy, w, h dalam skala model)
    const cx = rawOutput[0 * numAnchors + i];
    const cy = rawOutput[1 * numAnchors + i];
    const w = rawOutput[2 * numAnchors + i];
    const h = rawOutput[3 * numAnchors + i];

    // Temukan kelas dengan skor tertinggi
    let maxScore = -Infinity;
    let bestClassId = 0;

    for (let c = 0; c < numClasses; c++) {
      const score = rawOutput[(4 + c) * numAnchors + i];
      if (score > maxScore) {
        maxScore = score;
        bestClassId = c;
      }
    }

    // Filter berdasarkan confidence threshold
    if (maxScore < confidenceThreshold) continue;

    // Konversi dari koordinat model (setelah letterbox) ke koordinat gambar asli
    const x1Model = cx - w / 2;
    const y1Model = cy - h / 2;
    const x2Model = cx + w / 2;
    const y2Model = cy + h / 2;

    // Hilangkan padding dan kembalikan ke skala asli
    const x1 = Math.max(0, (x1Model - padX) / scale);
    const y1 = Math.max(0, (y1Model - padY) / scale);
    const x2 = Math.min(originalWidth, (x2Model - padX) / scale);
    const y2 = Math.min(originalHeight, (y2Model - padY) / scale);

    // Abaikan bounding box yang tidak valid
    if (x2 <= x1 || y2 <= y1) continue;

    const className = (CLASS_LABELS_ID[bestClassId] as "MEL" | "NV") ?? "MEL";

    detections.push({
      classId: bestClassId,
      className,
      confidence: maxScore,
      bbox: { x1, y1, x2, y2 },
    });
  }

  return detections;
}
