# Dockerfile untuk Hugging Face Spaces
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app dan model
COPY app.py .
COPY best.onnx .

# Port default HuggingFace Spaces
EXPOSE 7860

# Jalankan dengan gunicorn (production WSGI server)
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "--workers", "1", "app:app"]
