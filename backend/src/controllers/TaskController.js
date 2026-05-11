const Task = require('../entities/Task');
const GeminiService = require('../use-cases/GeminiService');

class TaskController {
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
        
        // 2. Format sub-tugas agar sesuai dengan skema MongoDB
        formattedSubTasks = subTasksAI.map(st => ({
          title: st.title,
          isCompleted: false
        }));
      } catch (aiError) {
        console.warn('AI gagal memecah tugas, melanjutkan tanpa sub-task:', aiError.message);
        // Fallback jika AI error (tetap simpan tugas utama)
      }

      // 3. Simpan ke Database
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
   * Endpoint: POST /api/tasks/suggest
   * Merekomendasikan tugas berdasarkan mood hari ini
   */
  static async suggestTask(req, res) {
     try {
       const { userId, mood } = req.body;

       if (!userId || !mood) {
           return res.status(400).json({ success: false, message: 'userId dan mood wajib diisi' });
       }

       // 1. Ambil daftar tugas yang belum selesai milik user tersebut
       const availableTasks = await Task.find({ 
           userId, 
           status: { $ne: 'COMPLETED' } 
       }).select('_id title description priority dueDate'); // Ambil field penting saja agar efisien

       if (availableTasks.length === 0) {
           return res.json({ success: true, message: "Wah, semua tugas sudah selesai! Kamu bisa istirahat.", suggestion: null });
       }

       // 2. Panggil Gemini AI untuk memilihkan tugas (Mood-Based Suggestion)
       const suggestion = await GeminiService.suggestTaskByMood(mood, availableTasks);

       res.status(200).json({
           success: true,
           message: "Rekomendasi berhasil dibuat",
           data: suggestion
       });

     } catch(error) {
       console.error('Error suggestTask:', error);
       res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memanggil AI' });
     }
  }
}

module.exports = TaskController;
