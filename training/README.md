# Panduan Training Model YOLOv11 — MelanoScan

Folder ini berisi semua materi untuk melatih model YOLOv11 mendeteksi lesi Melanoma dan Melanocytic Nevus pada citra dermoskopi HAM10000.

---

## 📁 Isi Folder

```
training/
├── melanoma_yolov11_training.ipynb   ← Notebook training utama (AKADEMIK)
├── dataset.yaml                      ← Konfigurasi dataset YOLO
├── datasets/                         ← Dataset (TIDAK di-commit ke Git)
│   └── ham10000_yolo/
│       ├── images/train/ val/ test/
│       └── labels/train/ val/ test/
├── runs/                             ← Output training (TIDAK di-commit)
│   └── train/
│       └── yolov11_melanoma_seed42/
│           ├── weights/
│           │   ├── best.pt           ← Model terbaik
│           │   └── last.pt           ← Checkpoint terakhir
│           ├── results.csv           ← Log metrik per epoch
│           └── plots/                ← Grafik metrik
└── plots/                            ← Plot EDA & evaluasi dari notebook
```

---

## 🚀 Cara Menjalankan Training

### Opsi A — Google Colab (Direkomendasikan)
1. Buka [Google Colab](https://colab.research.google.com/)
2. Upload file `melanoma_yolov11_training.ipynb`
3. Aktifkan GPU: **Runtime → Change runtime type → T4 GPU**
4. Jalankan setiap sel secara berurutan dari atas

### Opsi B — Lokal dengan GPU NVIDIA
```bash
# 1. Buat virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# 2. Install PyTorch dengan CUDA
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# 3. Install dependensi training
pip install ultralytics==8.3.162 albumentations==1.4.18 onnx==1.16.2 onnxruntime==1.19.2

# 4. Jalankan Jupyter Notebook
jupyter notebook melanoma_yolov11_training.ipynb
```

---

## 📦 Persiapan Dataset

Dataset HAM10000 dalam format YOLO dapat diperoleh dari:

| Sumber | URL | Keterangan |
|--------|-----|------------|
| Kaggle (MakhResearch) | [Link Dataset](https://www.kaggle.com/datasets/makhmudjumaniyazov/skin-lesion-segmentation-and-classification) | Format YOLO siap pakai |
| ISIC Archive (Asli) | [Link ISIC](https://www.isic-archive.com/api/v2/dataset) | Memerlukan konversi ke format YOLO |

Setelah download, ekstrak ke folder:
```
training/datasets/ham10000_yolo/
```

---

## ⚙️ Konfigurasi Hyperparameter

| Parameter | Nilai Default | Keterangan |
|-----------|---------------|------------|
| `MODEL_ARCH` | `yolo11n.pt` | Arsitektur model (n/s/m/l/x) |
| `EPOCHS` | 100 | Jumlah epoch training |
| `BATCH_SIZE` | 16 | Ukuran batch (sesuaikan VRAM) |
| `IMG_SIZE` | 640 | Ukuran input model (px) |
| `LEARNING_RATE` | 0.01 | Learning rate awal (SGD) |
| `PATIENCE` | 20 | Early stopping patience |
| `RANDOM_SEED` | 42 | Seed reproduksibilitas |
| `CONF_THRESHOLD` | 0.25 | Threshold confidence deteksi |
| `IOU_THRESHOLD` | 0.45 | Threshold IoU untuk NMS |

---

## 📊 Target Metrik Performa Minimal

Berdasarkan kajian literatur terkini, target performa model untuk dapat diintegrasikan ke sistem web:

| Metrik | Target Minimum | Ideal |
|--------|----------------|-------|
| mAP@0.5 | ≥ 0.65 | ≥ 0.80 |
| mAP@0.5:0.95 | ≥ 0.40 | ≥ 0.55 |
| Precision | ≥ 0.70 | ≥ 0.85 |
| Recall (Sensitivity) | ≥ 0.65 | ≥ 0.80 |
| F1-Score | ≥ 0.67 | ≥ 0.82 |

> ⚠️ **Catatan Klinis:** Untuk aplikasi skrining medis, **Recall (Sensitivity)** lebih kritis daripada Precision. Lebih baik model over-detect (false positive) daripada miss-detect (false negative) lesi Melanoma yang berbahaya.

---

## 📤 Setelah Training Selesai

Jalankan **Bab 6** di notebook untuk:
1. Mengekspor `best.pt` → `best.onnx` (opset=12)
2. Menyalin otomatis ke `../models/best.onnx`
3. Menyalin otomatis ke `../public/models/best.onnx`

Kemudian jalankan sistem web:
```bash
cd ..           # Kembali ke root project
npm install
npm run dev     # Buka http://localhost:3000
```

---

## 🔄 Reproduksibilitas

Seluruh training dapat direproduksi menggunakan parameter berikut:
- `RANDOM_SEED = 42` (dikonfigurasi di Sel 0.3 notebook)
- Versi pustaka yang di-pin di Sel 0.1 notebook
- Sama persis dengan `dataset.yaml` di folder ini
