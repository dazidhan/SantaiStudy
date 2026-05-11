const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/ScheduleController');

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
 *                 example: "60d0fe4f5311236168a109ca"
 *               taskId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109cb"
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *                 description: Waktu spesifik untuk penjadwalan
 *                 example: "2023-10-15T00:00:00Z"
 *               durationHours:
 *                 type: number
 *                 description: Durasi tugas dalam hitungan jam
 *                 example: 2
 *     responses:
 *       201:
 *         description: Jadwal berhasil dibuat dan menemukan slot kosong yang wajar
 *       400:
 *         description: Jadwal hari ini penuh atau tidak ada celah istirahat (Mencegah burnout)
 */
router.post('/auto', ScheduleController.autoSchedule);

module.exports = router;
