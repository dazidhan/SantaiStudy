const Schedule = require('../entities/Schedule');
const ScheduleOptimizer = require('../use-cases/ScheduleOptimizer');

class ScheduleController {
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

      // 1. Tentukan rentang waktu 1 hari penuh pada targetDate
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      // 2. Ambil semua jadwal yang sudah ada di database untuk hari tersebut
      const existingSchedules = await Schedule.find({
        userId,
        startTime: { $gte: startOfDay },
        endTime: { $lte: endOfDay }
      });

      // 3. Gunakan Helper Algoritma Kalender Anti-Stress
      const emptySlot = ScheduleOptimizer.findEmptyTimeSlot(startOfDay, durationHours, existingSchedules);

      // Jika algoritma mereturn null (hari penuh / tidak ada celah wajar)
      if (!emptySlot) {
        return res.status(400).json({
          success: false,
          message: 'Jadwal hari ini terlalu padat (menghindari burnout!). Silakan pilih hari lain.'
        });
      }

      // 4. Jika ada celah, simpan jadwal baru ke database
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
