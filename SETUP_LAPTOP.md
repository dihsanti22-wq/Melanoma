# 🖥️ Panduan Setup Laptop Baru — MelanoScan

> **D. Ihsan Maulana | Universitas Nusa Putra, 2026**

---

## ⚡ TL;DR (Cara Cepat)

```bash
# 1. Clone / copy project ke laptop
# 2. Install web app
npm install

# 3. Jalankan
npm run dev
```

---

## 📋 Prerequisites (Install Sekali Saja)

### 1. Node.js (untuk web app)
- Download: https://nodejs.org → pilih versi **LTS (18+)**
- Cek setelah install:
  ```bash
  node --version   # harusnya v18.x atau lebih baru
  npm --version    # harusnya v9.x atau lebih baru
  ```

### 2. Python (untuk training — opsional)
- Download: https://python.org → pilih **Python 3.10 atau 3.11**
- Centang ✅ "Add Python to PATH" saat install
- Cek setelah install:
  ```bash
  python --version   # harusnya 3.10.x atau 3.11.x
  pip --version
  ```

### 3. Git (untuk clone repo)
- Download: https://git-scm.com

---

## 🌐 Bagian 1: Web App (Next.js)

> ⚠️ Web app ini pakai **JavaScript/Node.js**, BUKAN Python.
> Jadi yang dipakai `npm install`, bukan `pip install`.

```bash
# Masuk ke folder project
cd "Project"

# Install semua dependency (baca dari package.json)
npm install

# Jalankan development server
npm run dev
```

Buka browser: **http://localhost:3000**

### File penting web app:
```
Project/
├── package.json          ← daftar dependency Node.js (seperti requirements.txt tapi untuk JS)
├── public/
│   └── models/
│       └── best.onnx     ← model YOLOv11 (WAJIB ada!)
├── app/                  ← halaman Next.js
├── components/           ← komponen React
└── lib/inference/        ← kode inferensi ONNX
```

---

## 🧠 Bagian 2: Training Python (Opsional)

> Hanya diperlukan kalau mau melatih ulang model.
> Kalau hanya ingin menjalankan web app, bagian ini bisa dilewati.

```bash
# Masuk ke folder training
cd training

# Buat virtual environment (disarankan)
python -m venv .venv

# Aktifkan virtual environment
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/Mac

# Install semua package Python
pip install -r requirements.txt
```

### Kalau punya GPU NVIDIA (lebih cepat training):
```bash
# Install PyTorch GPU DULU sebelum requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Baru install requirements
pip install -r requirements.txt
```

---

## 📁 File yang Harus Dipindahkan

Kalau pindah tanpa Git (copy manual), pastikan folder ini ada:

| Folder/File | Penting? | Catatan |
|---|---|---|
| `app/` | ✅ Wajib | Halaman web |
| `components/` | ✅ Wajib | Komponen React |
| `lib/` | ✅ Wajib | Kode inferensi |
| `public/models/best.onnx` | ✅ Wajib | Model YOLOv11 (~19MB) |
| `types/` | ✅ Wajib | TypeScript types |
| `training/` | ✅ Wajib | Notebook + requirements |
| `package.json` | ✅ Wajib | Dependency web app |
| `next.config.ts` | ✅ Wajib | Konfigurasi Next.js |
| `vercel.json` | ✅ Wajib | Konfigurasi deploy |
| `.env.local` | ✅ Wajib | Variabel environment |
| `node_modules/` | ❌ Skip | Otomatis dibuat oleh `npm install` |
| `.next/` | ❌ Skip | Otomatis dibuat oleh `npm run dev` |
| `.venv/` | ❌ Skip | Otomatis dibuat oleh `python -m venv` |
| `skin_lesions.zip` | ❌ Skip | Dataset besar (261MB), ada di Roboflow |

---

## 🔑 Environment Variables (.env.local)

Buat file `.env.local` di root project:

```env
# Salin dari .env.example dan isi nilainya
NEXT_PUBLIC_MODEL_PATH=/models/best.onnx
```

---

## 🚀 Perintah Lengkap (Ringkasan)

```bash
# ── Web App ──────────────────────────────────────────
npm install          # install dependency (pertama kali / setelah clone)
npm run dev          # jalankan development server → localhost:3000
npm run build        # build untuk production
npm start            # jalankan production build

# ── Python Training ──────────────────────────────────
cd training
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# Buka melanoma_yolov11_training.ipynb di Jupyter atau VS Code
```

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---|---|
| `node: command not found` | Install Node.js dari nodejs.org |
| `npm install` error | Hapus `node_modules/` lalu `npm install` lagi |
| Model tidak load di browser | Pastikan `public/models/best.onnx` ada |
| `python: command not found` | Install Python dan centang "Add to PATH" |
| GPU tidak terdeteksi | Install driver NVIDIA + CUDA 11.8+ |
