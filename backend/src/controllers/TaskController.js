const Task = require('../entities/Task');
const GeminiService = require('../use-cases/GeminiService');

class TaskController {
  /**
   * Endpoint: GET /api/tasks?userId=...
   * Mengambil semua tugas milik user
   */
  static async getTasks(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId wajib disertakan' });
      }
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getTasks:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: POST /api/tasks
   * Membuat tugas baru dan otomatis memecahnya dengan Gemini AI
   */
  static async createTask(req, res) {
    try {
      const { userId, title, description, dueDate, priority } = req.body;

      if (!userId || !title) {
        return res.status(400).json({ success: false, message: 'userId dan title wajib diisi' });
      }

      // 1. Panggil Gemini AI untuk memecah tugas (Task Breaker)
      let formattedSubTasks = [];
      try {
        const subTasksAI = await GeminiService.breakTaskIntoSubtasks(title, description, dueDate);
        formattedSubTasks = subTasksAI.map(st => ({
          title: st.title,
          estimatedHours: st.estimatedHours,
          isCompleted: false
        }));
      } catch (aiError) {
        console.warn('AI gagal memecah tugas, melanjutkan tanpa sub-task:', aiError.message);
      }

      // 2. Simpan ke Database
      const newTask = new Task({
        userId,
        title,
        description,
        dueDate,
        priority,
        subTasks: formattedSubTasks
      });

      await newTask.save();

      res.status(201).json({
        success: true,
        message: formattedSubTasks.length > 0
          ? 'Tugas berhasil dibuat dan dipecah otomatis oleh AI!'
          : 'Tugas berhasil dibuat (tanpa sub-task).',
        data: newTask
      });
    } catch (error) {
      console.error('Error createTask:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: PATCH /api/tasks/:id/status
   * Update status tugas (toggle PENDING / COMPLETED)
   */
  static async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Status tidak valid. Gunakan: PENDING, IN_PROGRESS, atau COMPLETED' });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
      }

      res.status(200).json({ success: true, message: 'Status tugas berhasil diperbarui', data: updatedTask });
    } catch (error) {
      console.error('Error updateTaskStatus:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: DELETE /api/tasks/:id
   * Menghapus tugas berdasarkan ID
   */
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
      }

      res.status(200).json({ success: true, message: 'Tugas berhasil dihapus' });
    } catch (error) {
      console.error('Error deleteTask:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: POST /api/tasks/suggest
   * Merekomendasikan tugas berdasarkan mood hari ini
   */
  static async suggestTask(req, res) {
    try {
      const { userId, mood } = req.body;

      if (!userId || !mood) {
        return res.status(400).json({ success: false, message: 'userId dan mood wajib diisi' });
      }

      const availableTasks = await Task.find({
        userId,
        status: { $ne: 'COMPLETED' }
      }).select('_id title description priority dueDate');

      if (availableTasks.length === 0) {
        return res.json({
          success: true,
          message: 'Wah, semua tugas sudah selesai! Kamu bisa istirahat.',
          data: { recommendedTaskIds: [], reason: 'Semua tugas sudah selesai! Kamu boleh beristirahat sejenak.' }
        });
      }

      const suggestion = await GeminiService.suggestTaskByMood(mood, availableTasks);

      res.status(200).json({
        success: true,
        message: 'Rekomendasi berhasil dibuat',
        data: suggestion
      });
    } catch (error) {
      console.error('Error suggestTask:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memanggil AI' });
    }
  }
}

module.exports = TaskController;
