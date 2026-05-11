from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
import spacy
import io

# Catatan: Pastikan Anda telah mendownload model bahasa spacy.
# Contoh untuk bahasa inggris: python -m spacy download en_core_web_sm
# Jika menggunakan bahasa indonesia (multilingual): python -m spacy download xx_ent_wiki_sm
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ Warning: Model spaCy 'en_core_web_sm' belum diinstall. Entitas NLP tidak akan terdeteksi dengan baik.")
    nlp = None

app = FastAPI(title="SantaiStudy Document AI", version="1.0", description="Microservice OCR & NLP untuk SantaiStudy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Document AI Microservice is running smoothly! 🚀"}

def extract_text_from_image(image: Image.Image) -> str:
    """Menggunakan Tesseract OCR untuk mengekstrak teks dari gambar."""
    # Pastikan Tesseract sudah terinstall di sistem OS (Windows: download installer, Linux: apt install tesseract-ocr)
    return pytesseract.image_to_string(image)

def extract_entities(text: str):
    """Menggunakan spaCy untuk mengekstrak informasi penting seperti Tanggal/Deadline (DATE) dari teks."""
    if not nlp:
        return []
    
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        # Mengambil entitas yang berhubungan dengan waktu, organisasi, atau orang.
        # DATE seringkali bisa berupa deadline tugas (misal: '12 October 2023')
        if ent.label_ in ["DATE", "TIME", "ORG"]:
            entities.append({"text": ent.text, "label": ent.label_})
            
    # Mengembalikan entitas unik untuk mencegah duplikasi
    return [dict(t) for t in {tuple(d.items()) for d in entities}]

@app.post("/api/extract")
async def extract_document_info(file: UploadFile = File(...)):
    """
    Endpoint utama untuk menerima file (Gambar/PDF), 
    membacanya dengan OCR, dan mengekstrak entitas NLP.
    """
    if not file.content_type.startswith("image/") and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Hanya mendukung format file Gambar dan PDF.")
    
    extracted_text = ""
    
    try:
        contents = await file.read()
        
        if file.content_type == "application/pdf":
            # Konversi PDF menjadi list gambar per halaman (butuh Poppler di OS)
            images = convert_from_bytes(contents)
            for img in images:
                extracted_text += extract_text_from_image(img) + "\n"
        else:
            # Jika langsung gambar
            image = Image.open(io.BytesIO(contents))
            extracted_text = extract_text_from_image(image)
            
        # Analisis Teks dengan NLP
        entities = extract_entities(extracted_text)
        
        return {
            "filename": file.filename,
            "success": True,
            "raw_text_preview": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            "full_text": extracted_text,
            "extracted_entities": entities,
            "message": "Ekstraksi dokumen berhasil dilakukan."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Jalankan server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
