const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inisialisasi Gemini API
// Pastikan GEMINI_API_KEY sudah terpasang di file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  /**
   * Task Breaker: Memecah tugas besar menjadi 3-5 sub-task harian
   */
  static async breakTaskIntoSubtasks(taskTitle, taskDescription, dueDate) {
    const systemPrompt = `Anda adalah seorang "Ahli Produktivitas Akademis" dan "Psikolog Kognitif" khusus untuk mahasiswa.

TUGAS UTAMA ANDA:
Analisis tugas kuliah besar ini, pertimbangkan tenggat waktunya, dan pecah menjadi 3-5 sub-tugas "mikrolangkah" (micro-steps) yang spesifik, terukur, dan tidak mengintimidasi mahasiswa.

ATURAN PEMBUATAN SUB-TUGAS:
1. "Actionable": Awali judul dengan kata kerja aktif spesifik (misal: "Membaca jurnal XYZ...", "Menyusun kerangka bab 1...", "Merevisi format sitasi..."). JANGAN gunakan kata ambigu seperti "Belajar" atau "Mengerjakan".
2. "Bite-Sized (Time-boxed)": Durasi pengerjaan (estimatedHours) maksimal 2.5 jam per sub-tugas untuk mencegah kelelahan otak (burnout). Jika butuh lebih lama, pecah lagi.
3. "Logical Flow": Urutan sub-tugas harus kronologis, mulai dari persiapan/riset, penyusunan draf, penyelesaian, hingga finalisasi akhir.

Anda HARUS merespon HANYA dengan format JSON valid sesuai skema berikut. DILARANG KERAS memberikan teks pengantar atau penutup di luar JSON.
{
  "subTasks": [
    {
      "title": "[Kata Kerja Aktif] + [Target Spesifik]",
      "estimatedHours": 1.5
    }
  ]
}`;

    const userPrompt = `Tugas: ${taskTitle}\nDeskripsi: ${taskDescription}\nTenggat Waktu: ${dueDate}`;

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7, // 0.7 cukup untuk objektivitas namun tetap luwes merangkai kata
        }
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();
      
      const parsedContent = JSON.parse(responseText);
      return parsedContent.subTasks;
    } catch (error) {
      console.error("❌ Error calling Gemini Task Breaker:", error);
      throw new Error("Gagal memecah tugas menggunakan AI.");
    }
  }

  /**
   * Mood-Based Suggestions: Merekomendasikan tugas berdasarkan kondisi emosi
   */
  static async suggestTaskByMood(mood, availableTasks) {
    const systemPrompt = `Anda adalah "Asisten AI Psikolog Pendidikan" untuk mahasiswa.
Berdasarkan "Mood" yang dirasakan mahasiswa hari ini dan daftar "Tugas Tersedia", pilih maksimal 2 tugas yang paling strategis untuk dikerjakan hari ini.

ATURAN PEMILIHAN PSIKOLOGIS:
1. Jika "TIRED" (Lelah fisik/mental) atau "STRESSED" (Stres/Kewalahan): 
   - PILIH: Tugas dengan prioritas paling rendah, tugas rutin mekanis (merapikan catatan, mencari referensi gampang), atau tugas dengan estimasi waktu paling pendek.
   - TUJUAN: Menghindari kelumpuhan kognitif (cognitive paralysis). Berikan mereka "Quick Win" agar mendapat suntikan dopamin dan merasa produktif tanpa beban berat.
2. Jika "ENERGIZED" (Bersemangat) atau "FOCUSED" (Fokus Tinggi): 
   - PILIH: Strategi "Eat the Frog"! Pilih tugas paling berat, menuntut pemikiran analitis tajam (coding, menulis esai, riset mendalam), atau tugas dengan tenggat waktu paling mematikan.
3. Jika "NEUTRAL" (Biasa Saja): 
   - PILIH: Prioritaskan murni berdasarkan tenggat waktu terdekat.

ATURAN OUTPUT (WAJIB JSON):
Anda HARUS merespon HANYA dengan format JSON valid berikut. 
Isi bagian "reason" dengan gaya bahasa yang suportif, memotivasi, santai, namun logis secara psikologis layaknya mentor/teman kuliah yang peduli. JANGAN kaku.
{
  "recommendedTaskIds": ["id_tugas_1", "id_tugas_2"],
  "reason": "[Kalimat motivasional dan alasan logis mengapa tugas ini cocok dengan mood mereka saat ini]"
}`;

    const userPrompt = `Mood Saat Ini: ${mood}\nDaftar Tugas Tersedia: ${JSON.stringify(availableTasks)}`;

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.8, // Dinaikkan sedikit agar bagian 'reason' lebih berempati dan bervariasi
        }
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      return JSON.parse(responseText);
    } catch (error) {
      console.error("❌ Error calling Gemini Mood Suggestion:", error);
      throw new Error("Gagal mendapatkan rekomendasi tugas menggunakan AI.");
    }
  }
  /**
   * Document AI: Merangkum teks mentah OCR menjadi ringkasan yang rapi
   */
  static async summarizeDocument(rawText) {
    const systemPrompt = `Anda adalah "Asisten Akademik AI".
Tugas Anda adalah membaca teks mentah hasil OCR (Optical Character Recognition) dari silabus atau instruksi tugas kuliah, yang mungkin berantakan dan banyak typo.

TUGAS UTAMA:
1. Pahami maksud dari teks mentah tersebut.
2. Buatkan rangkuman yang sangat rapi dan mudah dibaca oleh mahasiswa.
3. Ekstrak poin-poin penting (Tujuan tugas, Aturan, Format pengumpulan).
4. Soroti dengan sangat jelas jika ada TENGGAT WAKTU (Deadline) atau tanggal-tanggal penting.

FORMAT OUTPUT (MARKDOWN):
Gunakan format Markdown ringan. Gunakan bullet points, paragraf pendek, dan bold untuk penekanan. 
JANGAN membuat output dalam bentuk JSON. Hasilkan teks Markdown biasa yang langsung siap dibaca.`;

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.3, // Lebih rendah agar tidak berhalusinasi dari dokumen asli
        }
      });

      const result = await model.generateContent(rawText);
      return result.response.text();
    } catch (error) {
      console.error("❌ Error calling Gemini Document Summarizer:", error);
      throw new Error("Gagal merangkum dokumen menggunakan AI.");
    }
  }
}

module.exports = GeminiService;
