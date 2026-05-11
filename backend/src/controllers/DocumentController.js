const axios = require('axios');
const FormData = require('form-data');
const GeminiService = require('../use-cases/GeminiService');

class DocumentController {
  /**
   * Endpoint: POST /api/documents/extract
   * Menerima file upload (PDF/Image) dari frontend, dan meneruskannya ke Python Microservice
   */
  static async extractDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'File tidak ditemukan. Harap unggah gambar atau PDF silabus/tugas.' });
      }

      // Karena kita menggunakan Docker Compose, URL mengarah ke nama container Python 'document-ai' di port 8000
      // Jika di-run secara lokal tanpa Docker, bisa pakai http://localhost:8000/api/extract
      const pythonApiUrl = process.env.PYTHON_API_URL || 'http://document-ai:8000/api/extract';

      // 1. Membungkus file dari buffer memori Node.js ke dalam FormData
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      // 2. Menembak API Python Microservice menggunakan Axios
      const response = await axios.post(pythonApiUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      // 3. Merangkum teks mentah OCR dengan Gemini AI
      let summarizedText = "Gagal merangkum teks.";
      try {
        summarizedText = await GeminiService.summarizeDocument(response.data.full_text || response.data.raw_text_preview);
      } catch (err) {
        console.warn("Gemini summarizer failed, falling back to raw text.", err);
        summarizedText = response.data.raw_text_preview;
      }

      // 4. Mengembalikan hasil ringkasan Gemini & entitas NLP ke Frontend
      res.status(200).json({
        success: true,
        message: 'Sukses menerjemahkan dan merangkum dokumen dengan AI OCR',
        data: {
          ...response.data,
          raw_text_preview: summarizedText // Mengganti raw_text_preview dengan hasil rangkuman Markdown
        }
      });

    } catch (error) {
      console.error('Error extractDocument:', error.message);
      
      // Jika error berasal dari Python Service (misal: format ditolak)
      if (error.response) {
          return res.status(error.response.status).json({
              success: false, 
              message: 'Layanan Python AI menolak permintaan ini', 
              error: error.response.data
          });
      }
      res.status(500).json({ success: false, message: 'Gagal menghubungi Microservice AI / Error Internal' });
    }
  }
}

module.exports = DocumentController;
