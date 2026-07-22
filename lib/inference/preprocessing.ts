// ============================================================
// lib/inference/preprocessing.ts
// Praproses citra sebelum inferensi YOLOv11
// ============================================================

import { MODEL_CONFIG } from "./constants";

/**
 * Melakukan praproses citra dari HTMLImageElement / HTMLVideoElement
 * menjadi Float32Array tensor dengan format [1, 3, H, W] (NCHW).
 *
 * Pipeline praproses:
 * 1. Resize ke ukuran input model (640×640) dengan letterboxing
 * 2. Konversi RGB normalisasi ke [0, 1]
 * 3. Transpose dari HWC ke CHW format
 * 4. Flatten menjadi Float32Array
 *
 * @param imageSource - Elemen gambar atau video dari DOM
 * @param inputSize - Ukuran input model (default dari konfigurasi: 640)
 * @returns Objek berisi tensor data, scale, dan padding untuk postprocessing
 */
export function preprocessImage(
  imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  inputSize: number = MODEL_CONFIG.inputSize
): {
  tensorData: Float32Array;
  scale: number;
  padX: number;
  padY: number;
  originalWidth: number;
  originalHeight: number;
} {
  // ─── 1. Baca dimensi asli ─────────────────────────────────────────────
  const originalWidth =
    imageSource instanceof HTMLVideoElement
      ? imageSource.videoWidth
      : imageSource.width;
  const originalHeight =
    imageSource instanceof HTMLVideoElement
      ? imageSource.videoHeight
      : imageSource.height;

  // ─── 2. Hitung skala letterbox (maintain aspect ratio) ────────────────
  const scale = Math.min(
    inputSize / originalWidth,
    inputSize / originalHeight
  );
  const scaledWidth = Math.round(originalWidth * scale);
  const scaledHeight = Math.round(originalHeight * scale);

  // ─── 3. Hitung padding ────────────────────────────────────────────────
  const padX = Math.floor((inputSize - scaledWidth) / 2);
  const padY = Math.floor((inputSize - scaledHeight) / 2);

  // ─── 4. Render ke canvas offline ──────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.width = inputSize;
  canvas.height = inputSize;
  const ctx = canvas.getContext("2d")!;

  // Isi background dengan abu-abu (114, 114, 114) — standar YOLOv11
  ctx.fillStyle = "rgb(114, 114, 114)";
  ctx.fillRect(0, 0, inputSize, inputSize);

  // Gambar citra yang sudah di-scale ke posisi dengan padding
  ctx.drawImage(imageSource, padX, padY, scaledWidth, scaledHeight);

  // ─── 5. Ambil pixel data ──────────────────────────────────────────────
  const imageData = ctx.getImageData(0, 0, inputSize, inputSize);
  const { data } = imageData; // Format: [R, G, B, A, R, G, B, A, ...]

  // ─── 6. Konversi ke tensor Float32Array format [1, 3, H, W] ──────────
  // Normalisasi ke [0, 1] dan transpose dari HWC ke CHW
  const tensorData = new Float32Array(1 * 3 * inputSize * inputSize);
  const channelSize = inputSize * inputSize;

  for (let y = 0; y < inputSize; y++) {
    for (let x = 0; x < inputSize; x++) {
      const pixelIdx = (y * inputSize + x) * 4; // RGBA index
      const tensorIdx = y * inputSize + x;

      // Channel R (index 0 dalam CHW)
      tensorData[0 * channelSize + tensorIdx] = data[pixelIdx] / 255.0;
      // Channel G (index 1 dalam CHW)
      tensorData[1 * channelSize + tensorIdx] = data[pixelIdx + 1] / 255.0;
      // Channel B (index 2 dalam CHW)
      tensorData[2 * channelSize + tensorIdx] = data[pixelIdx + 2] / 255.0;
    }
  }

  return { tensorData, scale, padX, padY, originalWidth, originalHeight };
}

/**
 * Membuat ImageData dari URL gambar untuk diproses.
 * Berguna untuk memuat file yang di-upload user.
 *
 * @param imageUrl - Object URL dari File yang di-upload
 * @returns Promise yang resolve dengan HTMLImageElement
 */
export function loadImageFromUrl(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) =>
      reject(new Error(`Gagal memuat gambar: ${String(err)}`));
    img.src = imageUrl;
  });
}
