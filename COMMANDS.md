# 📋 COMMANDS.md — Panduan Perintah MelanoScan

## ⚠️ Ada Dua Bagian Terpisah

| Bagian | Teknologi | Folder |
|--------|-----------|--------|
| **Web App** | Node.js / npm | `/` (root project) |
| **Training Model** | Python / pip | `training/` |

---

## 🌐 BAGIAN A — Web Application (Next.js)

> Jalankan dari folder **root project**

### Setup Awal (Sekali Saja di Device Baru)

```bash
# 1. Pastikan Node.js >= 18 terinstal
node --version       # harus >= 18.17.0
npm --version        # harus >= 9.0.0

# 2. Install semua dependensi Node.js
npm install

# 3. Buat file environment lokal
copy .env.example .env.local     # Windows
# cp .env.example .env.local     # Linux/Mac
```

### Menjalankan Lokal (Development)

```bash
npm run dev
# Buka browser: http://localhost:3000
```

### Cek TypeScript (Tidak Ada Error?)

```bash
npx tsc --noEmit
# Output kosong = tidak ada error ✅
```

### Cek ESLint

```bash
npm run lint
```

### Build Production (Sebelum Deploy)

```bash
npm run build
```

### Jalankan Production Server (Setelah Build)

```bash
npm run start
# Buka browser: http://localhost:3000
```

### Deploy ke Vercel

```bash
# Install Vercel CLI (sekali saja)
npm install -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke Vercel (otomatis detect Next.js)
vercel

# Deploy ke production
vercel --prod
```

---

## 🧠 BAGIAN B — Training Model (Python)

> Jalankan dari folder **`training/`**

### Setup Awal (Sekali Saja di Device Baru)

```bash
# 1. Pastikan Python >= 3.10 terinstal
python --version       # harus >= 3.10

# 2. Masuk ke folder training
cd training

# 3. Buat virtual environment (SANGAT DIREKOMENDASIKAN)
python -m venv .venv

# 4. Aktifkan virtual environment
.venv\Scripts\activate          # Windows CMD/PowerShell
# source .venv/bin/activate     # Linux/Mac/Git Bash

# 5. (JIKA GPU NVIDIA) Install PyTorch CUDA terlebih dahulu
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# 6. Install semua dependensi Python dari requirements.txt
pip install -r requirements.txt
```

### Menjalankan Notebook Training

```bash
# Opsi A — Jupyter Notebook (Lokal)
jupyter notebook melanoma_yolov11_training.ipynb

# Opsi B — Jupyter Lab (lebih modern)
jupyter lab melanoma_yolov11_training.ipynb

# Opsi C — Google Colab (Direkomendasikan, GPU gratis)
# Upload file .ipynb ke colab.research.google.com
```

### Cek Environment Python

```bash
python -c "import torch; print('PyTorch:', torch.__version__); print('CUDA:', torch.cuda.is_available())"
python -c "import ultralytics; print('Ultralytics:', ultralytics.__version__)"
```

### Salin Model ke Folder Web (Setelah Training Selesai)

```bash
# Windows
copy runs\train\yolov11_melanoma_seed42\weights\best.onnx ..\public\models\best.onnx
copy runs\train\yolov11_melanoma_seed42\weights\best.onnx ..\models\best.onnx

# Linux/Mac
cp runs/train/yolov11_melanoma_seed42/weights/best.onnx ../public/models/best.onnx
cp runs/train/yolov11_melanoma_seed42/weights/best.onnx ../models/best.onnx
```

---

## 🔁 Alur Kerja Lengkap (End-to-End)

```
DEVICE BARU
│
├─ A. SETUP WEB APP
│   ├─ cd Project/
│   ├─ npm install
│   ├─ copy .env.example .env.local
│   └─ npm run dev → http://localhost:3000
│
└─ B. SETUP TRAINING
    ├─ cd Project/training/
    ├─ python -m venv .venv
    ├─ .venv\Scripts\activate
    ├─ pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
    ├─ pip install -r requirements.txt
    ├─ [Download dataset HAM10000 dari Kaggle]
    ├─ jupyter notebook melanoma_yolov11_training.ipynb
    ├─ [Jalankan semua sel Bab 0 sampai Bab 6]
    └─ [best.onnx otomatis disalin ke public/models/]


SETELAH MODEL SIAP
│
└─ cd Project/
    ├─ npm run dev           → test lokal
    └─ vercel --prod         → deploy ke internet
```

---

## 🔑 Cheat Sheet Cepat

| Tujuan | Perintah |
|--------|----------|
| Jalankan web dev | `npm run dev` |
| Cek TypeScript | `npx tsc --noEmit` |
| Cek ESLint | `npm run lint` |
| Build production | `npm run build` |
| Jalankan production | `npm run start` |
| Deploy Vercel | `vercel --prod` |
| Aktifkan venv Python | `.venv\Scripts\activate` |
| Install Python deps | `pip install -r requirements.txt` |
| Jalankan notebook | `jupyter notebook` |
| Cek GPU Python | `python -c "import torch; print(torch.cuda.is_available())"` |

---

*MelanoScan — D. Ihsan Maulana, Teknik Informatika, Universitas Nusa Putra, 2026*
