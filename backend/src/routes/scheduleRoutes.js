const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/ScheduleController');

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Mengambil semua jadwal milik seorang user
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar jadwal berhasil diambil
 */
router.get('/', ScheduleController.getSchedules);

/**
 * @swagger
 * /api/schedules/auto:
 *   post:
 *     summary: Secara otomatis mencari jam kosong hari ini (Anti-Stress Calendar)
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - taskId
 *               - targetDate
 *               - durationHours
 *             properties:
 *               userId:
 *                 type: string
 *               taskId:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *               durationHours:
 *                 type: number
 *     responses:
 *       201:
 *         description: Jadwal berhasil dibuat
 *       400:
 *         description: Jadwal hari ini penuh
 */
router.post('/auto', ScheduleController.autoSchedule);

module.exports = router;
