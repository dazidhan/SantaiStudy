const Task = require('../entities/Task');
const Schedule = require('../entities/Schedule');
const MoodLog = require('../entities/MoodLog');

class StatsController {
  /**
   * Endpoint: GET /api/stats?userId=...
   * Menghitung dan mengembalikan statistik tugas user
   */
  static async getStats(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId wajib disertakan' });
      }

      // Ambil semua tugas user
      const allTasks = await Task.find({ userId });
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;
      const pendingTasks = allTasks.filter(t => t.status === 'PENDING').length;
      const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS').length;

      // Tugas berdasarkan prioritas
      const highPriorityTasks = allTasks.filter(t => t.priority === 'HIGH').length;
      const mediumPriorityTasks = allTasks.filter(t => t.priority === 'MEDIUM').length;
      const lowPriorityTasks = allTasks.filter(t => t.priority === 'LOW').length;

      // Deadline dekat (7 hari ke depan)
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingDeadlines = allTasks.filter(t =>
        t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= sevenDaysLater && t.status !== 'COMPLETED'
      ).length;

      // Ambil jadwal user (sesi belajar total)
      const schedules = await Schedule.find({ userId });
      const totalStudySessions = schedules.length;

      // Hitung total jam belajar dari jadwal
      let totalStudyHours = 0;
      schedules.forEach(s => {
        const durationMs = new Date(s.endTime) - new Date(s.startTime);
        totalStudyHours += durationMs / (1000 * 60 * 60);
      });

      // Tugas selesai minggu ini
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const completedThisWeek = allTasks.filter(t =>
        t.status === 'COMPLETED' && new Date(t.updatedAt || t.createdAt) >= startOfWeek
      ).length;

      // Produktivitas (persentase tugas selesai)
      const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Distribusi tugas per hari (7 hari terakhir)
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);

        const daySchedules = schedules.filter(s => {
          const start = new Date(s.startTime);
          return start >= day && start < nextDay;
        });

        let dayHours = 0;
        daySchedules.forEach(s => {
          const durationMs = new Date(s.endTime) - new Date(s.startTime);
          dayHours += durationMs / (1000 * 60 * 60);
        });

        weeklyData.push({
          day: day.toLocaleDateString('id-ID', { weekday: 'short' }),
          hours: Math.round(dayHours * 10) / 10
        });
      }

      res.status(200).json({
        success: true,
        data: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          completedThisWeek,
          upcomingDeadlines,
          highPriorityTasks,
          mediumPriorityTasks,
          lowPriorityTasks,
          totalStudySessions,
          totalStudyHours: Math.round(totalStudyHours * 10) / 10,
          productivityScore,
          weeklyData
        }
      });
    } catch (error) {
      console.error('Error getStats:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }
}

module.exports = StatsController;
