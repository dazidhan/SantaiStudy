const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Mengambil statistik tugas dan sesi belajar milik user
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get('/', StatsController.getStats);

module.exports = router;
