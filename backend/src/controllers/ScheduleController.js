const Schedule = require('../entities/Schedule');
const ScheduleOptimizer = require('../use-cases/ScheduleOptimizer');

class ScheduleController {
  /**
   * Endpoint: GET /api/schedules?userId=...
   * Mengambil semua jadwal milik user
   */
  static async getSchedules(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId wajib disertakan' });
      }
      const schedules = await Schedule.find({ userId })
        .populate('taskId', 'title')
        .sort({ startTime: 1 });
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      console.error('Error getSchedules:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: POST /api/schedules/auto
   * Secara otomatis mencari jam kosong hari ini untuk tugas tertentu (Anti-Stress Calendar)
   */
  static async autoSchedule(req, res) {
    try {
      const { userId, taskId, targetDate, durationHours } = req.body;

      if (!userId || !taskId || !targetDate || !durationHours) {
        return res.status(400).json({ success: false, message: 'Lengkapi userId, taskId, targetDate, dan durationHours' });
      }

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingSchedules = await Schedule.find({
        userId,
        startTime: { $gte: startOfDay },
        endTime: { $lte: endOfDay }
      });

      const emptySlot = ScheduleOptimizer.findEmptyTimeSlot(startOfDay, durationHours, existingSchedules);

      if (!emptySlot) {
        return res.status(400).json({
          success: false,
          message: 'Jadwal hari ini terlalu padat (menghindari burnout!). Silakan pilih hari lain.'
        });
      }

      const newSchedule = new Schedule({
        userId,
        taskId,
        startTime: emptySlot.startTime,
        endTime: emptySlot.endTime
      });

      await newSchedule.save();

      res.status(201).json({
        success: true,
        message: 'Yeay! Jadwal Anti-Stress berhasil dibuat',
        data: newSchedule
      });
    } catch (error) {
      console.error('Error autoSchedule:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }
}

module.exports = ScheduleController;
