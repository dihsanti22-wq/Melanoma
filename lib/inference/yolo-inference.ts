// ============================================================
// lib/inference/yolo-inference.ts
// Engine inferensi utama YOLOv11 menggunakan ONNX Runtime Web
// ============================================================

import type { InferenceResult } from "@/types/detection";
import { MODEL_CONFIG } from "./constants";
import { preprocessImage, loadImageFromUrl } from "./preprocessing";
import { decodeYOLOOutput, applyNMS } from "./postprocessing";

// Import InferenceSession secara dinamis (hanya berjalan di browser)
let ortModule: typeof import("onnxruntime-web") | null = null;
let session: import("onnxruntime-web").InferenceSession | null = null;

/**
 * Inisialisasi ONNX Runtime dan memuat model YOLOv11.
 *
 * Fungsi ini harus dipanggil sekali sebelum inferensi.
 * Model akan di-cache di memori browser setelah load pertama.
 *
 * Urutan fallback execution provider:
 * 1. WebGPU (hardware GPU — tercepat)
 * 2. WebGL (GPU via OpenGL — cadangan)
 * 3. WASM (CPU multithreaded — paling kompatibel)
 *
 * @param modelPath - Path ke file model .onnx (default dari konfigurasi)
 * @param onProgress - Callback untuk melaporkan progress loading (0-100)
 * @throws Error jika model gagal dimuat
 */
export async function initializeModel(
  modelPath: string = MODEL_CONFIG.modelPath,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (session !== null) {
    // Model sudah dimuat sebelumnya, tidak perlu load ulang
    return;
  }

  try {
    onProgress?.(10);

    // Import ONNX Runtime Web secara dinamis (menghindari SSR error)
    ortModule = await import("onnxruntime-web");
    onProgress?.(30);

    // Konfigurasi WASM: path dari CDN + multi-thread (pakai semua core CPU)
    ortModule.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/";
    // Gunakan semua core CPU yang tersedia (max 4 agar tidak overload)
    ortModule.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);

    onProgress?.(50);

    // Coba WebGL (GPU) terlebih dulu — jauh lebih cepat dari WASM CPU
    // WebGL TIDAK membutuhkan JSEP WASM, berbeda dengan WebGPU
    // Jika WebGL gagal, otomatis fallback ke WASM multi-thread
    let session_: Awaited<ReturnType<typeof ortModule.InferenceSession.create>> | null = null;

    // Coba WebGL dulu
    try {
      session_ = await ortModule.InferenceSession.create(modelPath, {
        executionProviders: ["webgl"],
        graphOptimizationLevel: "all",
      });
      console.info("[MelanomaDetector] Menggunakan WebGL (GPU) provider.");
    } catch {
      // Fallback ke WASM multi-thread jika WebGL tidak tersedia
      console.warn("[MelanomaDetector] WebGL gagal, fallback ke WASM multi-thread.");
      session_ = await ortModule.InferenceSession.create(modelPath, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
      console.info("[MelanomaDetector] Menggunakan WASM provider.");
    }
    session = session_;


    onProgress?.(80);

    // ─── Warm-up: dummy inference untuk pre-kompile WASM JIT ──────────────
    // Tanpa ini, inferensi PERTAMA selalu lambat karena JIT baru jalan.
    // Dengan warm-up, inferensi user langsung cepat dari awal.
    const inputSize = MODEL_CONFIG.inputSize;
    const dummyTensor = new ortModule.Tensor(
      "float32",
      new Float32Array(1 * 3 * inputSize * inputSize),
      [1, 3, inputSize, inputSize]
    );
    const inputName = session.inputNames[0];
    await session.run({ [inputName]: dummyTensor });
    // ──────────────────────────────────────────────────────────────────────

    onProgress?.(100);
    console.info(`[MelanomaDetector] Ready. Threads: ${ortModule.env.wasm.numThreads}, warm-up done.`);


  } catch (error) {
    session = null;
    ortModule = null;
    throw new Error(
      `Gagal memuat model ONNX dari '${modelPath}': ${String(error)}`
    );
  }
}

/**
 * Menjalankan inferensi YOLOv11 pada citra dari URL.
 *
 * @param imageUrl - URL citra (bisa Object URL dari file upload)
 * @returns Hasil inferensi lengkap beserta waktu eksekusi
 * @throws Error jika model belum diinisialisasi atau inferensi gagal
 */
export async function runInference(imageUrl: string): Promise<InferenceResult> {
  if (!session || !ortModule) {
    throw new Error(
      "Model belum diinisialisasi. Panggil initializeModel() terlebih dahulu."
    );
  }

  const startTime = performance.now();

  // ─── 1. Muat citra ────────────────────────────────────────────────────
  const imageElement = await loadImageFromUrl(imageUrl);

  // ─── 2. Praproses citra ───────────────────────────────────────────────
  const { tensorData, scale, padX, padY, originalWidth, originalHeight } =
    preprocessImage(imageElement, MODEL_CONFIG.inputSize);

  // ─── 3. Buat tensor ONNX ──────────────────────────────────────────────
  const inputTensor = new ortModule.Tensor("float32", tensorData, [
    1,
    3,
    MODEL_CONFIG.inputSize,
    MODEL_CONFIG.inputSize,
  ]);

  // ─── 4. Jalankan Inferensi ────────────────────────────────────────────
  const inputName = session.inputNames[0];
  const feeds = { [inputName]: inputTensor };
  const outputMap = await session.run(feeds);

  // ─── 5. Ambil output tensor ───────────────────────────────────────────
  const outputName = session.outputNames[0];
  const outputTensor = outputMap[outputName];
  const rawOutput = outputTensor.data as Float32Array;
  const outputShape = outputTensor.dims as number[];

  // ─── 6. Decode output ─────────────────────────────────────────────────
  const rawDetections = decodeYOLOOutput(
    rawOutput,
    outputShape,
    MODEL_CONFIG.confidenceThreshold,
    MODEL_CONFIG.numClasses,
    scale,
    padX,
    padY,
    originalWidth,
    originalHeight,
    MODEL_CONFIG.inputSize
  );

  // ─── 7. Non-Maximum Suppression ───────────────────────────────────────
  const finalDetections = applyNMS(rawDetections, MODEL_CONFIG.iouThreshold);

  const inferenceTimeMs = performance.now() - startTime;

  return {
    detections: finalDetections,
    inferenceTimeMs: Math.round(inferenceTimeMs),
    processedImageSize: {
      width: MODEL_CONFIG.inputSize,
      height: MODEL_CONFIG.inputSize,
    },
    timestamp: new Date(),
  };
}

/**
 * Menjalankan inferensi langsung pada elemen HTMLCanvasElement atau Video.
 * Digunakan untuk deteksi kamera real-time.
 *
 * @param source - Canvas atau Video element
 * @returns Hasil inferensi
 */
export async function runInferenceOnElement(
  source: HTMLCanvasElement | HTMLVideoElement
): Promise<InferenceResult> {
  if (!session || !ortModule) {
    throw new Error("Model belum diinisialisasi.");
  }

  const startTime = performance.now();

  // Praproses langsung dari elemen (tanpa load URL)
  const { tensorData, scale, padX, padY, originalWidth, originalHeight } =
    preprocessImage(source, MODEL_CONFIG.inputSize);

  const inputTensor = new ortModule.Tensor("float32", tensorData, [
    1,
    3,
    MODEL_CONFIG.inputSize,
    MODEL_CONFIG.inputSize,
  ]);

  const inputName = session.inputNames[0];
  const feeds = { [inputName]: inputTensor };
  const outputMap = await session.run(feeds);

  const outputName = session.outputNames[0];
  const outputTensor = outputMap[outputName];
  const rawOutput = outputTensor.data as Float32Array;
  const outputShape = outputTensor.dims as number[];

  const rawDetections = decodeYOLOOutput(
    rawOutput,
    outputShape,
    MODEL_CONFIG.confidenceThreshold,
    MODEL_CONFIG.numClasses,
    scale,
    padX,
    padY,
    originalWidth,
    originalHeight,
    MODEL_CONFIG.inputSize
  );

  const finalDetections = applyNMS(rawDetections, MODEL_CONFIG.iouThreshold);
  const inferenceTimeMs = performance.now() - startTime;

  return {
    detections: finalDetections,
    inferenceTimeMs: Math.round(inferenceTimeMs),
    processedImageSize: {
      width: MODEL_CONFIG.inputSize,
      height: MODEL_CONFIG.inputSize,
    },
    timestamp: new Date(),
  };
}

/**
 * Memeriksa apakah model sudah berhasil dimuat.
 */
export function isModelReady(): boolean {
  return session !== null;
}

/**
 * Menghapus sesi model dari memori (untuk cleanup).
 */
export async function disposeModel(): Promise<void> {
  if (session) {
    await session.release();
    session = null;
  }
}
