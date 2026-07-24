# MelanoScan — Sistem Deteksi Lesi Melanoma Berbasis Web

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-purple)](https://docs.ultralytics.com)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime-Web-orange)](https://onnxruntime.ai)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

> **Skripsi — Universitas Nusa Putra, Sukabumi, 2026**  
> D. Ihsan Maulana | NIM: 20220040069 | Program Studi Teknik Informatika

---

## 📋 Deskripsi Proyek

**MelanoScan** adalah sistem deteksi dini lesi kulit berbasis web yang menggunakan model **YOLOv11** untuk mendeteksi dan melokalisasi lesi **Melanoma** (ganas) dan **Melanocytic Nevus** (jinak) pada citra dermoskopi.

Sistem ini dikembangkan sebagai alat bantu skrining awal tumor kulit yang dapat diakses melalui web browser tanpa instalasi aplikasi tambahan. Inferensi model berjalan **sepenuhnya di browser pengguna** menggunakan `onnxruntime-web`, sehingga data citra tidak pernah dikirim ke server.

> ⚠️ **Disclaimer Medis:** Sistem ini adalah alat bantu skrining awal dan **BUKAN pengganti diagnosis medis** oleh dokter spesialis kulit (dermatolog). Selalu konsultasikan hasil kepada tenaga medis yang berkompeten.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER PENGGUNA                         │
│                                                             │
│   Next.js App (Vercel CDN)                                  │
│   ┌─────────────┐    ┌─────────────────────────────────┐   │
│   │  Upload /   │───▶│  onnxruntime-web                │   │
│   │  Camera UI  │    │  (Inferensi ONNX di browser)    │   │
│   └─────────────┘    └─────────────────────────────────┘   │
│                               │                             │
│                    ┌──────────▼──────────┐                  │
│                    │  /public/models/    │                  │
│                    │  best.onnx          │                  │
│                    │  (YOLOv11 ONNX)    │                  │
│                    └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Teknologi

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js (App Router) | 14.x |
| Bahasa | TypeScript | 5.x |
| Inferensi AI | ONNX Runtime Web | 1.20.x |
| Styling | CSS Modules (Vanilla CSS) | — |
| Upload | react-dropzone | 14.x |
| Notifikasi | react-hot-toast | 2.x |
| Icons | lucide-react | 0.44x |
| Hosting | Vercel | — |
| Model Training | Ultralytics YOLOv11 | 8.3.x |
| Dataset | HAM10000 (ISIC) | — |

---

## 📁 Struktur Project

```
melanoma-detector/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page beranda
│   ├── layout.tsx          # Root layout + metadata SEO
│   ├── globals.css         # Design system global
│   ├── upload/page.tsx     # Halaman upload citra
│   └── camera/page.tsx     # Halaman kamera real-time
│
├── components/             # Komponen React
│   ├── detection/          # Bounding box, confidence bar, result card
│   ├── input/              # Image dropzone, camera stream
│   ├── layout/             # Navbar, footer, disclaimer
│   └── ui/                 # Button, spinner
│
├── lib/inference/          # Engine inferensi YOLOv11 ONNX
│   ├── yolo-inference.ts   # Engine utama (load, run, dispose)
│   ├── preprocessing.ts    # Praproses citra (letterbox + normalize)
│   ├── postprocessing.ts   # NMS + decode bounding box
│   └── constants.ts        # Konfigurasi model & kelas
│
├── types/                  # TypeScript type definitions
├── models/                 # Bobot model (best.onnx, best.pt)
├── public/models/          # Model yang diakses browser
├── training/               # Notebook & dataset training
│   ├── melanoma_yolov11_training.ipynb  ← NOTEBOOK AKADEMIK
│   └── dataset.yaml
└── ...konfigurasi
```

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- File `best.onnx` di folder `public/models/` (dari hasil training)

### Langkah

```bash
# 1. Clone atau buka folder project
cd "Project"

# 2. Install dependensi
npm install

# 3. Buat file environment
copy .env.example .env.local

# 4. Pastikan model ONNX tersedia
# Salin best.onnx hasil training ke:
# public/models/best.onnx

# 5. Jalankan development server
npm run dev

# 6. Buka browser
# http://localhost:3000
```

---

## 🌐 Deployment ke Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Deploy
vercel

# Atau push ke GitHub dan connect repo ke Vercel Dashboard
```

> **Penting:** Pastikan file `public/models/best.onnx` sudah ada sebelum deploy.  
> Jika ukuran > 100 MB, gunakan Hugging Face Hub atau Git LFS.

---

## 📊 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Upload Citra** | Drag & drop JPG/PNG/WebP, pratinjau instan |
| **Deteksi Kamera** | Real-time via MediaDevices API |
| **Bounding Box** | Visualisasi lokasi lesi dengan label & confidence |
| **Client-Side Inference** | Model berjalan di browser, data privat |
| **WebGPU/WASM** | Akselerasi hardware otomatis |
| **Responsive** | Kompatibel mobile & desktop |
| **Disclaimer Medis** | Peringatan wajib di setiap halaman hasil |

---

## 🔬 Training Model

Lihat folder [`training/`](./training/) untuk panduan melatih model YOLOv11.

**Notebook:** `training/melanoma_yolov11_training.ipynb`

Pipeline training:
1. EDA & analisis distribusi kelas
2. Augmentasi Albumentations (anti class imbalance)
3. Fine-tuning YOLOv11 dengan transfer learning
4. Evaluasi: mAP, Precision, Recall, F1, Confusion Matrix
5. Ekspor ke ONNX (opset=12) untuk deployment web

---

## 📚 Referensi Akademik

1. Tschandl, P., et al. (2018). HAM10000 Dataset. *Scientific Data*, 5, 180161.
2. Jocher, G., et al. (2024). Ultralytics YOLO11. GitHub.
3. Codella, N., et al. (2018). ISIC 2018 Challenge. arXiv:1902.03368.
4. Litjens, G., et al. (2017). Deep Learning in Medical Imaging. *Medical Image Analysis*, 42.

---

*D. Ihsan Maulana — Teknik Informatika, Universitas Nusa Putra, Sukabumi © 2026*
