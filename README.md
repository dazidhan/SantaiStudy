# 🚀 SantaiStudy (AI-Powered Study Assistant)

> **Tagline:** "Belajar maksimal, tanpa perlu begadang brutal."

SantaiStudy adalah platform asisten belajar berbasis *Artificial Intelligence* (AI) yang dirancang khusus untuk merevolusi cara mahasiswa mengelola beban akademik. Dikembangkan dengan memadukan kehebatan **Google Gemini AI** dan **Tesseract OCR** dalam balutan antarmuka web modern, aplikasi ini bukan sekadar kalender pengingat biasa, melainkan "Manajer Proyek" pribadi yang mampu memproses dokumen akademik mentah menjadi strategi belajar yang terstruktur, aplikatif, dan manusiawi.

Platform ini hadir untuk mengatasi masalah *analysis paralysis* (kebingungan menentukan prioritas tugas yang menumpuk) dan prokrastinasi yang sering memicu stres di kalangan mahasiswa dengan cara meracik jadwal Anti-Stress dan memecah tugas besar menjadi langkah mikroskopis.

---

## ✨ Fitur Unggulan Sistem (Core Features)

Sistem SantaiStudy dirancang untuk beroperasi secara simpel dengan alur kerja yang cerdas. Berikut adalah rincian fitur utama:

### 1. Tukang Baca Otomatis (Document AI)
Fitur ini membebaskan pengguna dari input data manual yang merepotkan.
*   **Cara Kerja**: Mahasiswa cukup mengunggah foto papan tulis, silabus PDF, atau tangkapan layar tugas dari WhatsApp.
*   **Teknologi AI**: Gambar akan diproses oleh mesin **OCR (Optical Character Recognition)** khusus menggunakan Python (Tesseract & spaCy) untuk mengekstrak teks. Teks mentah yang sering berantakan tersebut lalu dikirim ke **Google Gemini AI** yang bertugas menyaring intisari, memformatnya menjadi rincian instruksi yang mudah dibaca, serta mengidentifikasi tanggal tenggat waktu secara otomatis.

### 2. AI Task Breaker (Pecah Tugas)
Menghilangkan rasa kewalahan saat menghadapi tugas besar (seperti "Bikin Laporan Akhir Praktikum").
*   **Cara Kerja**: Pengguna memasukkan judul tugas besar dan tenggat waktunya.
*   **Teknologi AI**: Gemini AI, yang telah diprogram dengan "System Prompt" psikologi kognitif, akan memecah tugas raksasa tersebut menjadi 3-5 *micro-steps* (langkah-langkah kecil). Setiap langkah diberikan durasi spesifik (maksimal 2.5 jam) agar otak tidak merasa terintimidasi untuk mulai bekerja.

### 3. Anti-Stress Calendar
Mesin pembuat jadwal yang tidak asal menaruh tugas di waktu kosong.
*   **Cara Kerja**: Algoritma cerdas yang memantau batas kapasitas harian mahasiswa.
*   **Logika Sistem**: Berbeda dengan kalender biasa, kalender ini menolak menyusun jadwal secara *back-to-back* (beruntun tanpa henti). Sistem secara otomatis menyebarkan sub-tugas (*micro-steps*) hingga hari-H tenggat waktu, serta memastikan pengguna tidak belajar lebih dari batas waktu sehat per harinya (misal: maksimal 6 jam/hari).

### 4. Mood-Based Scheduling (Penjadwalan Berbasis Emosi)
Kalender yang berempati dengan kondisi energi mental penggunanya.
*   **Cara Kerja**: Setiap membuka aplikasi, pengguna akan ditanya kondisi *mood* mereka (Tired, Neutral, Energized, dll) dan juga disuguhi wadah untuk "curhat" atau mengeluarkan keluh kesah harian mereka.
*   **Teknologi AI**: Dengan menggabungkan *mood* yang dipilih serta konteks curhatan, Gemini AI akan merekomendasikan 1-2 tugas yang paling sesuai. Jika pengguna sedang lelah berat (Tired), AI hanya akan menyarankan tugas ringan (seperti merapikan catatan). Jika bersemangat (Energized), AI akan menyarankan eksekusi tugas terberat (konsep "Eat The Frog").

### 5. XP & Gamifikasi
Belajar terasa seperti bermain *game* RPG. Setiap kali menyelesaikan sub-tugas atau melakukan rutinitas belajar harian, pengguna akan mendapatkan poin XP yang dapat meningkatkan *level* mereka untuk mempertahankan motivasi.

---

## 🛠️ Tech Stack (Arsitektur Sistem)

Sistem ini dibangun dengan pendekatan *Microservices Architecture* untuk skalabilitas tinggi:

1. **Frontend (UI)**: 
   * `React.js` dengan arsitektur Single Page Application (SPA).
   * `Vite` sebagai *build tool* super cepat.
   * `Tailwind CSS` dengan desain adaptasi Material Design 3 (M3).
2. **Backend (API Utama)**: 
   * `Node.js` + `Express` sebagai server utama.
   * `MongoDB` sebagai database NoSQL.
   * SDK `Google Generative AI` terintegrasi langsung untuk logika kognitif.
3. **Document AI (OCR Engine)**: 
   * `Python` + `FastAPI` sebagai *microservice* pembaca gambar.
   * `Tesseract OCR` untuk ekstraksi karakter optik.
   * `spaCy NLP` untuk pemrosesan teks tingkat lanjut.

---

## 📖 Guide Book: Cara Menjalankan Aplikasi

Aplikasi ini sangat mudah dijalankan karena sistem Backend, Database, dan Python AI telah dibungkus ke dalam **Docker**. Anda tidak perlu menginstall database atau bahasa Python secara manual di laptop Anda.

Ikuti 3 tahapan utama di bawah ini:

### TAHAP 1: Persiapan API Key (Google Gemini)
Karena fitur utama SantaiStudy sangat bergantung pada kecerdasan buatan, Anda memerlukan kunci API.
1. Kunjungi [Google AI Studio](https://aistudio.google.com/).
2. Login menggunakan akun Google Anda dan klik **"Get API Key"**.
3. Buka folder `backend/` di proyek ini, cari file bernama `.env` (atau buat file tersebut berdasarkan `backend/.env.example`).
4. Ganti tulisan pada `GEMINI_API_KEY` dengan kunci API yang baru saja Anda dapatkan.

*(Format `.env` Anda akan terlihat seperti ini: `GEMINI_API_KEY=AIzaSy...`)*

### TAHAP 2: Menyalakan Mesin Backend & AI (Via Docker)
Pastikan aplikasi **Docker Desktop** sudah menyala di laptop Anda.
1. Buka Terminal / Command Prompt.
2. Arahkan direktori terminal ke folder utama proyek SantaiStudy Anda.
3. Jalankan perintah ajaib ini:
   ```bash
   docker-compose up -d --build
   ```
4. Tunggu beberapa menit hingga Docker selesai mengunduh *image* yang diperlukan (Linux, Python, MongoDB, dan Node).
5. **Cek Keberhasilan:**
   - Kunjungi `http://localhost:5000/api-docs` di browser. Jika muncul halaman **Swagger UI**, artinya Backend Node.js dan MongoDB Anda sukses beroperasi 100%!
   - Kunjungi `http://localhost:8000/docs` di browser. Jika muncul halaman **FastAPI Swagger UI**, artinya Document AI (OCR Engine) Python Anda sukses menyala!

### TAHAP 3: Menyalakan Antarmuka Frontend (React)
Agar Anda bisa mengotak-atik tampilan antarmuka secara langsung (*Live Reload*), Frontend tidak dimasukkan ke dalam Docker.
1. Buka **Tab Terminal Baru** (jangan tutup terminal Docker tadi).
2. Pindah ke folder Frontend:
   ```bash
   cd frontend
   ```
3. Install dependensi (hanya dilakukan sekali):
   ```bash
   npm install
   ```
4. Jalankan server React:
   ```bash
   npm run dev
   ```
5. Akan muncul alamat lokal di terminal Anda (biasanya `http://localhost:5173`). Buka *link* tersebut di *browser*.
6. **Selesai!** Selamat datang di masa depan produktivitas akademis.

---
*Dibuat dengan ❤️ untuk mahasiswa yang butuh tidur.*
