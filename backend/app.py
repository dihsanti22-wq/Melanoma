"""
app.py — MelanoScan Flask Backend
Inferensi YOLOv11 ONNX di server (jauh lebih cepat dari browser WASM)
D. Ihsan Maulana | Universitas Nusa Putra, 2026
"""

import io
import time
import numpy as np
import onnxruntime as ort
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin dari Vercel frontend

# ─── Load Model saat startup (hanya sekali) ─────────────────────────────────
MODEL_PATH = "best.onnx"
INPUT_SIZE = 640
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
CLASS_NAMES = ["MEL", "NV"]

# Load model ONNX
session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)
input_name = session.get_inputs()[0].name
print(f"[MelanoScan] Model loaded. Input: {input_name}")


# ─── Preprocessing ──────────────────────────────────────────────────────────
def preprocess_image(image: Image.Image, input_size: int = INPUT_SIZE):
    """Letterbox resize + normalize ke tensor [1, 3, H, W]."""
    orig_w, orig_h = image.size
    scale = min(input_size / orig_w, input_size / orig_h)
    scaled_w = int(orig_w * scale)
    scaled_h = int(orig_h * scale)

    # Resize gambar
    resized = image.resize((scaled_w, scaled_h), Image.BILINEAR)

    # Buat canvas dengan padding abu-abu (114, 114, 114)
    canvas = Image.new("RGB", (input_size, input_size), (114, 114, 114))
    pad_x = (input_size - scaled_w) // 2
    pad_y = (input_size - scaled_h) // 2
    canvas.paste(resized, (pad_x, pad_y))

    # Konversi ke array float32 [0, 1], format CHW
    arr = np.array(canvas, dtype=np.float32) / 255.0
    tensor = arr.transpose(2, 0, 1)[np.newaxis, :]  # [1, 3, H, W]

    return tensor, scale, pad_x, pad_y, orig_w, orig_h


# ─── Postprocessing ─────────────────────────────────────────────────────────
def iou(box1, box2):
    """Hitung IoU antara dua box [x1, y1, x2, y2]."""
    xi1 = max(box1[0], box2[0])
    yi1 = max(box1[1], box2[1])
    xi2 = min(box1[2], box2[2])
    yi2 = min(box1[3], box2[3])
    inter = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - inter
    return inter / (union + 1e-6)


def nms(detections, iou_threshold=IOU_THRESHOLD):
    """Non-Maximum Suppression."""
    if not detections:
        return []
    detections = sorted(detections, key=lambda x: x["confidence"], reverse=True)
    kept = []
    for det in detections:
        suppress = False
        for k in kept:
            if iou(det["box_xyxy"], k["box_xyxy"]) > iou_threshold:
                suppress = True
                break
        if not suppress:
            kept.append(det)
    return kept


def postprocess(raw_output, scale, pad_x, pad_y, orig_w, orig_h,
                conf_threshold=CONF_THRESHOLD):
    """Parse output ONNX YOLOv11 → list detections."""
    # raw_output shape: [1, 4+num_classes, num_anchors]
    output = raw_output[0]  # [4+num_classes, num_anchors]
    num_anchors = output.shape[1]
    num_classes = output.shape[0] - 4

    detections = []
    for i in range(num_anchors):
        cx, cy, w, h = output[0, i], output[1, i], output[2, i], output[3, i]
        class_scores = output[4:4 + num_classes, i]
        class_id = int(np.argmax(class_scores))
        confidence = float(class_scores[class_id])

        if confidence < conf_threshold:
            continue

        # Konversi dari model space ke gambar asli
        x1 = (cx - w / 2 - pad_x) / scale
        y1 = (cy - h / 2 - pad_y) / scale
        x2 = (cx + w / 2 - pad_x) / scale
        y2 = (cy + h / 2 - pad_y) / scale

        # Clamp ke ukuran gambar asli
        x1 = max(0, min(x1, orig_w))
        y1 = max(0, min(y1, orig_h))
        x2 = max(0, min(x2, orig_w))
        y2 = max(0, min(y2, orig_h))

        # Konversi ke format relatif [0, 1] untuk frontend
        detections.append({
            "classId": class_id,
            "className": CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else str(class_id),
            "confidence": confidence,
            "box_xyxy": [x1, y1, x2, y2],  # untuk NMS
            "bbox": {
                "x": float(x1 / orig_w),
                "y": float(y1 / orig_h),
                "width": float((x2 - x1) / orig_w),
                "height": float((y2 - y1) / orig_h),
            }
        })

    return nms(detections)


# ─── Endpoint ────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_PATH, "inputSize": INPUT_SIZE})


@app.route("/predict", methods=["POST"])
def predict():
    """Endpoint inferensi utama."""
    if "image" not in request.files:
        return jsonify({"error": "Tidak ada file 'image' dalam request"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Nama file kosong"}), 400

    try:
        # Baca gambar dari upload
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Preprocessing
        tensor, scale, pad_x, pad_y, orig_w, orig_h = preprocess_image(image)

        # Inferensi
        start = time.perf_counter()
        raw_output = session.run(None, {input_name: tensor})
        inference_ms = (time.perf_counter() - start) * 1000

        # Postprocessing
        detections = postprocess(raw_output[0], scale, pad_x, pad_y, orig_w, orig_h)

        # Bersihkan box_xyxy (hanya untuk NMS internal)
        for d in detections:
            d.pop("box_xyxy", None)

        return jsonify({
            "detections": detections,
            "inferenceTimeMs": round(inference_ms, 2),
            "imageSize": {"width": orig_w, "height": orig_h},
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)
