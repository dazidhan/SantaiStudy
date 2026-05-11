# Menggunakan Python 3.11 versi slim agar lebih ringan
FROM python:3.11-slim

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Update package Linux dan install dependencies level OS (Sangat Penting!)
# Ini menginstall Tesseract OCR (termasuk bahasa inggris & indo) dan Poppler (untuk baca PDF)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ind \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy file requirements
COPY requirements.txt ./

# Install dependensi Python
RUN pip install --no-cache-dir -r requirements.txt

# Download model NLP spaCy (Bahasa Inggris standard)
RUN python -m spacy download en_core_web_sm

# Copy semua file Python ke dalam container
COPY . .

# Buka port 8000
EXPOSE 8000

# Jalankan server FastAPI dengan Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
