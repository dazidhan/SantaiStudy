const express = require('express');
const router = express.Router();
const MoodLog = require('../entities/MoodLog');

/**
 * @swagger
 * /api/moods:
 *   post:
 *     summary: Menyimpan log mood harian user
 *     tags: [Moods]
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
 *                 enum: [TIRED, ENERGIZED, STRESSED, NEUTRAL, FOCUSED]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mood berhasil disimpan
 */
router.post('/', async (req, res) => {
  try {
    const { userId, mood, notes } = req.body;
    if (!userId || !mood) {
      return res.status(400).json({ success: false, message: 'userId dan mood wajib diisi' });
    }

    // Map mood OKAY ke NEUTRAL jika ada (karena entity hanya punya 5 nilai)
    const validMoods = ['TIRED', 'ENERGIZED', 'STRESSED', 'NEUTRAL', 'FOCUSED'];
    const normalizedMood = validMoods.includes(mood) ? mood : 'NEUTRAL';

    const moodLog = new MoodLog({ userId, mood: normalizedMood, notes });
    await moodLog.save();

    res.status(201).json({ success: true, message: 'Mood berhasil disimpan', data: moodLog });
  } catch (error) {
    console.error('Error saveMood:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
  }
});

module.exports = router;
