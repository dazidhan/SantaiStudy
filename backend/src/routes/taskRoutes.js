const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Mengambil semua tugas milik seorang user
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Daftar tugas berhasil diambil
 */
router.get('/', TaskController.getTasks);

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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       201:
 *         description: Tugas berhasil dibuat beserta array sub-task dari AI
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
 *               mood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rekomendasi tugas berhasil dibuat
 */
router.post('/suggest', TaskController.suggestTask);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update status tugas (PENDING, IN_PROGRESS, COMPLETED)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Status tugas berhasil diupdate
 */
router.patch('/:id/status', TaskController.updateTaskStatus);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Menghapus tugas berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tugas berhasil dihapus
 */
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
