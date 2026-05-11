/**
 * Helper Logika untuk Kalender Anti-Stress
 * Bertujuan mencari slot waktu kosong ketika jadwal mahasiswa terlewat atau ingin dijadwalkan otomatis.
 */
class ScheduleOptimizer {
  /**
   * Mengecek apakah ada bentrok (overlap) antara jadwal baru dengan jadwal yang sudah ada.
   * @param {Date} newStart - Waktu mulai jadwal baru
   * @param {Date} newEnd - Waktu selesai jadwal baru
   * @param {Array} existingSchedules - Daftar jadwal yang sudah ada { startTime: Date, endTime: Date }
   * @returns {boolean} true jika ada bentrok, false jika aman
   */
  static hasConflict(newStart, newEnd, existingSchedules) {
    for (const schedule of existingSchedules) {
      const existingStart = new Date(schedule.startTime);
      const existingEnd = new Date(schedule.endTime);

      // Kondisi Bentrok:
      // (Start baru di dalam rentang yang ada) ATAU (End baru di dalam rentang yang ada)
      // ATAU (Rentang baru menelan/menyelimuti rentang yang ada)
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Mencari slot waktu kosong pada hari tertentu berdasarkan durasi tugas.
   * Algoritma ini akan menghindari waktu istirahat (misal: 23:00 - 08:00).
   * 
   * @param {Date} targetDate - Tanggal pencarian jadwal (hanya diambil tanggal/bulan/tahunnya)
   * @param {number} durationHours - Estimasi durasi pengerjaan dalam jam
   * @param {Array} existingSchedules - Jadwal mahasiswa di hari tersebut
   * @returns {Object|null} - Mengembalikan objek { startTime, endTime } atau null jika hari penuh
   */
  static findEmptyTimeSlot(targetDate, durationHours, existingSchedules) {
    // 1. Definisikan batas awal dan akhir hari yang valid untuk belajar
    // Misalnya mahasiswa hanya disarankan belajar antara 08:00 pagi sampai 22:00 malam (Anti-Stress rule)
    const dayStart = new Date(targetDate);
    dayStart.setHours(8, 0, 0, 0); // 08:00 AM

    const dayEnd = new Date(targetDate);
    dayEnd.setHours(22, 0, 0, 0); // 10:00 PM

    const durationMs = durationHours * 60 * 60 * 1000;

    // 2. Sortir jadwal yang ada berdasarkan waktu mulai (Ascending)
    const sortedSchedules = [...existingSchedules].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    // 3. Cek slot kosong di antara waktu mulai hari (dayStart) dan jadwal pertama
    if (sortedSchedules.length > 0) {
      const firstScheduleStart = new Date(sortedSchedules[0].startTime);
      if (firstScheduleStart - dayStart >= durationMs) {
        return {
          startTime: new Date(dayStart),
          endTime: new Date(dayStart.getTime() + durationMs),
        };
      }
    } else {
      // Jika tidak ada jadwal sama sekali hari ini, langsung taruh di pagi hari
      return {
        startTime: new Date(dayStart),
        endTime: new Date(dayStart.getTime() + durationMs),
      };
    }

    // 4. Cek slot kosong di antara jadwal-jadwal (Celah antara jadwal i dan jadwal i+1)
    for (let i = 0; i < sortedSchedules.length - 1; i++) {
      const currentScheduleEnd = new Date(sortedSchedules[i].endTime);
      const nextScheduleStart = new Date(sortedSchedules[i + 1].startTime);

      const gapMs = nextScheduleStart - currentScheduleEnd;

      if (gapMs >= durationMs) {
        // Celah cukup! Kita juga tambahkan margin 15 menit agar mahasiswa bisa napas/istirahat (Anti-Stress padding)
        const suggestedStart = new Date(currentScheduleEnd.getTime() + (15 * 60 * 1000));
        const suggestedEnd = new Date(suggestedStart.getTime() + durationMs);

        // Pastikan tidak nabrak batas malam (dayEnd)
        if (suggestedEnd <= dayEnd && suggestedEnd <= nextScheduleStart) {
           return { startTime: suggestedStart, endTime: suggestedEnd };
        }
      }
    }

    // 5. Cek slot kosong di akhir hari (Setelah jadwal terakhir sampai dayEnd)
    const lastScheduleEnd = new Date(sortedSchedules[sortedSchedules.length - 1].endTime);
    if (dayEnd - lastScheduleEnd >= durationMs) {
      // Kasih padding 15 menit juga
      const suggestedStart = new Date(lastScheduleEnd.getTime() + (15 * 60 * 1000));
      const suggestedEnd = new Date(suggestedStart.getTime() + durationMs);

      if (suggestedEnd <= dayEnd) {
        return { startTime: suggestedStart, endTime: suggestedEnd };
      }
    }

    // 6. Jika tidak ditemukan, return null (Artinya hari ini sangat padat, AI harus cari hari lain)
    return null;
  }
}

module.exports = ScheduleOptimizer;
