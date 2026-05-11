const express = require('express');
const router = express.Router();
const multer = require('multer');
const DocumentController = require('../controllers/DocumentController');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * @swagger
 * /api/documents/extract:
 *   post:
 *     summary: Mengunggah silabus/tugas (PDF/Image) untuk diekstrak dengan OCR dan NLP
 *     description: Endpoint ini mengunggah file gambar atau PDF ke Node.js, yang kemudian di-forward ke Python Microservice untuk dibaca oleh Tesseract OCR dan diproses oleh model NLP spaCy.
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File silabus (.jpg, .png, .pdf)
 *     responses:
 *       200:
 *         description: Berhasil mengekstrak teks mentah dan entitas NLP (Tanggal/Deadline)
 *       400:
 *         description: Tipe file tidak didukung
 *       500:
 *         description: Gagal terhubung ke Python Microservice (container document-ai)
 */
router.post('/extract', upload.single('file'), DocumentController.extractDocument);

module.exports = router;
