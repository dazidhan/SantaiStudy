const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Membuat tugas baru dan otomatis memecahnya menggunakan AI (Task Breaker)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               title:
 *                 type: string
 *                 example: "Makalah Sejarah Kemerdekaan RI"
 *               description:
 *                 type: string
 *                 example: "Buat makalah minimal 10 halaman beserta daftar pustaka"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "HIGH"
 *     responses:
 *       201:
 *         description: Tugas berhasil dibuat beserta array sub-task dari AI
 *       400:
 *         description: Validasi input gagal (userId atau title kosong)
 *       500:
 *         description: Kesalahan internal server
 */
router.post('/', TaskController.createTask);

/**
 * @swagger
 * /api/tasks/suggest:
 *   post:
 *     summary: Mendapatkan rekomendasi tugas berdasarkan kondisi emosi (Mood)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - mood
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               mood:
 *                 type: string
 *                 enum: [TIRED, ENERGIZED, STRESSED, NEUTRAL, FOCUSED]
 *                 example: "TIRED"
 *     responses:
 *       200:
 *         description: Mengembalikan rekomendasi tugas spesifik beserta alasan motivasional
 *       400:
 *         description: Validasi input gagal
 */
router.post('/suggest', TaskController.suggestTask);

module.exports = router;
