# Task List — MelanoScan Project

## ✅ Fase 1: Konfigurasi Project
- [x] package.json (Next.js 15.3.9, React 19, onnxruntime-web)
- [x] tsconfig.json (ES2017, bundler moduleResolution)
- [x] next.config.ts (COOP/COEP headers, WASM experiments)
- [x] eslint.config.mjs (flat config ESLint 9)
- [x] vercel.json (headers deployment)
- [x] .env.example + .env.local
- [x] .gitignore
- [x] README.md (project root)

## ✅ Fase 2: TypeScript Types
- [x] types/detection.ts (Detection, InferenceResult, BBox)
- [x] types/model.ts (ModelConfig, ModelState)

## ✅ Fase 3: Inference Engine (lib/inference/)
- [x] constants.ts (kelas, warna, threshold, deskripsi klinis)
- [x] preprocessing.ts (letterbox + normalize NCHW)
- [x] postprocessing.ts (NMS + decode bounding box)
- [x] yolo-inference.ts (load ONNX, runInference, runInferenceOnElement)
- [x] lib/utils.ts (formatConfidence, formatFileSize, formatInferenceTime, dll)

## ✅ Fase 4: Komponen UI
- [x] components/ui/Button.tsx + CSS
- [x] components/ui/LoadingSpinner.tsx + CSS
- [x] components/layout/Navbar.tsx + CSS
- [x] components/layout/Footer.tsx + CSS (dengan disclaimer medis)
- [x] components/detection/BoundingBoxCanvas.tsx + CSS
- [x] components/detection/ClassBadge.tsx + CSS
- [x] components/detection/ConfidenceBar.tsx + CSS
- [x] components/detection/DetectionResultCard.tsx + CSS
- [x] components/input/ImageDropzone.tsx + CSS
- [x] components/input/CameraStream.tsx + CSS

## ✅ Fase 5: Halaman App
- [x] app/globals.css (design system lengkap)
- [x] app/layout.tsx (root layout, viewport export, SEO metadata)
- [x] app/page.tsx + CSS (landing page premium)
- [x] app/upload/page.tsx + CSS (upload & deteksi)
- [x] app/camera/page.tsx + CSS (kamera real-time)

## ✅ Fase 6: Model & Dataset
- [x] models/README.md (instruksi model)
- [x] public/models/LETAKKAN_MODEL_DISINI.txt (placeholder)
- [x] training/dataset.yaml (YOLO dataset config)
- [x] training/README.md (panduan training)

## ✅ Fase 7: Notebook Training Akademik
- [x] training/melanoma_yolov11_training.ipynb
  - [x] Bab 0: Instalasi & verifikasi lingkungan
  - [x] Bab 1: EDA distribusi kelas + visualisasi sampel
  - [x] Bab 2: Pipeline augmentasi Albumentations
  - [x] Bab 3: Training YOLOv11 (konfigurasi lengkap)
  - [x] Bab 4: Evaluasi (mAP, Precision, Recall, F1, Confusion Matrix)
  - [x] Bab 5: Visualisasi prediksi bounding box
  - [x] Bab 6: Ekspor ONNX + verifikasi + salin ke project web

## ✅ Fase 8: Verifikasi Build
- [x] npm install (Next.js 15.3.9 + semua deps)
- [x] TypeScript check: 0 errors (npx tsc --noEmit)
- [x] Fix: FileRejection type error (ImageDropzone)
- [x] Fix: Unused imports (upload/page.tsx)
- [x] Fix: Unused variables dengan prefix _ (postprocessing.ts)
- [x] Fix: ESLint disable comment (CameraStream useEffect)
- [x] Dev server berjalan: http://localhost:3000 ✅
