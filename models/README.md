# Folder Model — Bobot YOLOv11

Folder ini menyimpan file bobot model YOLOv11 hasil training.

## Isi Folder

| File | Format | Kegunaan |
|------|--------|----------|
| `best.onnx` | ONNX (opset=12) | **Digunakan sistem web** — dijalankan di browser via `onnxruntime-web` |
| `best.pt` | PyTorch | Backup bobot asli (tidak di-commit ke Git, lihat `.gitignore`) |

## Cara Mendapatkan File Model

1. **Jalankan notebook training** di `training/melanoma_yolov11_training.ipynb`
2. Setelah training selesai, file `best.pt` tersimpan di `training/runs/train/exp/weights/`
3. Notebook akan otomatis mengekspor ke `best.onnx`
4. **Salin** `best.onnx` ke dua lokasi:
   - `models/best.onnx` (backup)
   - `public/models/best.onnx` ← **yang digunakan sistem web**

## Spesifikasi Model

> Isi bagian ini setelah training selesai.

```
Nama Model   : YOLOv11n (nano) / YOLOv11s (small)
Arsitektur   : YOLOv11 Anchor-Free Detection
Dataset      : HAM10000 (MakhResearch YOLO Format)
Kelas        : 0=MEL (Melanoma), 1=NV (Melanocytic Nevus)
Ukuran Input : 640 × 640 piksel
Epochs       : [isi setelah training]
Batch Size   : [isi setelah training]

Metrik Evaluasi (Test Set):
  mAP@0.5       : [isi setelah training]
  mAP@0.5:0.95  : [isi setelah training]
  Precision     : [isi setelah training]
  Recall        : [isi setelah training]
  F1-Score      : [isi setelah training]
```

## Catatan Penting

- File `.pt` **tidak boleh di-upload** ke repository Git (ukuran terlalu besar)
- File `.onnx` boleh di-upload jika ukurannya < 100 MB
- Jika > 100 MB, gunakan Git LFS atau host file ONNX di platform eksternal (Hugging Face Hub, Google Drive)
- Untuk keperluan deployment Vercel, file `public/models/best.onnx` **harus ada**
