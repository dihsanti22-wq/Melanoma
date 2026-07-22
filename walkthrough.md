# ✅ MelanoScan — Walkthrough & Panduan Selanjutnya

## Status Project: SIAP DIJALANKAN

```
▲ Next.js 15.3.9
✓ TypeScript: 0 errors
✓ Dev server: http://localhost:3000
```

---

## Yang Sudah Dibuat (Ringkasan)

### Struktur Project Final

```
Project/
├── app/
│   ├── globals.css              ← Design system (dark mode, tokens, utilities)
│   ├── layout.tsx               ← Root layout + SEO metadata
│   ├── page.tsx                 ← Landing page (hero, fitur, how-it-works, CTA)
│   ├── upload/page.tsx          ← Upload citra + deteksi + hasil
│   └── camera/page.tsx          ← Kamera real-time + deteksi
│
├── components/
│   ├── detection/
│   │   ├── BoundingBoxCanvas    ← Render bbox di atas citra
│   │   ├── ClassBadge           ← Badge MEL/NV berwarna
│   │   ├── ConfidenceBar        ← Bar visualisasi confidence score
│   │   └── DetectionResultCard  ← Kartu ringkasan per deteksi
│   ├── input/
│   │   ├── ImageDropzone        ← Drag & drop upload citra
│   │   └── CameraStream         ← Kamera MediaDevices API
│   ├── layout/
│   │   ├── Navbar               ← Navigasi atas responsif
│   │   └── Footer               ← Footer + disclaimer medis
│   └── ui/
│       ├── Button               ← Komponen tombol multi-variant
│       └── LoadingSpinner       ← Spinner animasi
│
├── lib/inference/
│   ├── constants.ts             ← Kelas, warna, threshold, deskripsi klinis
│   ├── preprocessing.ts         ← Letterbox + normalisasi NCHW tensor
│   ├── postprocessing.ts        ← NMS + decode bounding box
│   └── yolo-inference.ts        ← Engine utama ONNX (load + run + dispose)
│
├── training/
│   ├── melanoma_yolov11_training.ipynb  ← NOTEBOOK AKADEMIK (6 Bab)
│   ├── dataset.yaml             ← Konfigurasi dataset YOLO
│   └── README.md                ← Panduan training lengkap
│
├── models/                      ← Simpan best.onnx & best.pt di sini
├── public/models/               ← best.onnx yang diakses browser
├── next.config.ts               ← COOP/COEP headers, WASM support
├── vercel.json                  ← Konfigurasi Vercel deployment
└── package.json                 ← Next.js 15.3.9, React 19, onnxruntime-web
```

---

## 🚀 Langkah Selanjutnya

### Step 1 — Training Model (Google Colab)

```
1. Buka: training/melanoma_yolov11_training.ipynb
2. Upload ke Google Colab
3. Runtime → Change runtime type → T4 GPU
4. Jalankan semua sel dari atas ke bawah
5. Bab 6 otomatis menyalin best.onnx ke public/models/
```

**Download dataset dari:**
- Kaggle: `makhmudjumaniyazov/skin-lesion-segmentation-and-classification`
- Ekstrak ke `training/datasets/ham10000_yolo/`

### Step 2 — Test Lokal

```bash
# Terminal sudah berjalan di background
# Buka browser: http://localhost:3000

# Jika perlu restart:
npm run dev
```

### Step 3 — Deploy ke Vercel

```bash
# Install Vercel CLI (sekali saja)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Atau push ke GitHub → connect di vercel.com/dashboard
```

> ⚠️ **Penting:** Pastikan `public/models/best.onnx` sudah ada sebelum deploy.
> Jika ukuran > 100 MB, upload ke Hugging Face Hub dan akses via URL.

---

## 🔑 File Paling Penting untuk Skripsi

| File | Relevansi Skripsi |
|------|-------------------|
| `training/melanoma_yolov11_training.ipynb` | Metodologi training, EDA, evaluasi |
| `lib/inference/yolo-inference.ts` | Implementasi inferensi client-side |
| `lib/inference/preprocessing.ts` | Praproses citra (letterboxing) |
| `lib/inference/postprocessing.ts` | Post-process NMS |
| `app/upload/page.tsx` | UI sistem deteksi utama |

---

## ⚙️ Environment Variables (.env.local)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MODEL_PATH=/models/best.onnx
NEXT_PUBLIC_CONFIDENCE_THRESHOLD=0.25
NEXT_PUBLIC_IOU_THRESHOLD=0.45
NEXT_PUBLIC_MODEL_INPUT_SIZE=640
```

---

*MelanoScan — D. Ihsan Maulana, Teknik Informatika, Universitas Nusa Putra, 2026*
