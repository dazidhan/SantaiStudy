import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ShieldCheck, Zap } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { apiClient, DUMMY_USER_ID } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function AntiStressCalendar({ onScheduleAdded }) {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  
  const [taskDuration, setTaskDuration] = useState(2);
  const today = new Date();

  const handleAutoSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/schedules/auto', {
        userId: DUMMY_USER_ID,
        taskId: "6639c0f91a2b3c4d5e6f7a8c", // Menggunakan valid 24-character ObjectId
        targetDate: today.toISOString(),
        durationHours: Number(taskDuration)
      });
      
      const newSchedule = res.data.data;
      setSchedules([...schedules, newSchedule]);
      
      toast.success("AI berhasil menyelipkan jadwal tanpa membakar otakmu!", { icon: '🧠' });
      
      if (onScheduleAdded) {
        onScheduleAdded();
      }
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Hari ini jadwalmu sudah kepenuhan. Istirahatlah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
        <div className="bg-emerald-500/10 p-2 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Kalender Anti-Stress</h2>
          <p className="text-sm text-on-surface-variant">Jadwal yang sangat adaptif terhadap kehidupan mahasiswa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleAutoSchedule} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant space-y-4">
            <h3 className="font-semibold text-on-surface mb-2">Simulasi Penjadwalan Dinamis</h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Masukkan estimasi jam. AI akan mencari celah waktu kosong di kalendermu dengan <span className="text-emerald-600 font-semibold">jeda istirahat 15 menit otomatis</span> untuk mencegah burnout.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-on-surface-variant"/> Durasi Tugas (Jam)
              </label>
              <input 
                type="number" 
                min="1" max="8"
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-body-sm text-on-surface outline-none transition-all"
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value)}
              />
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-1">
              {loading ? <span className="animate-pulse">Menghitung matriks waktu...</span> : <><CalendarIcon className="w-5 h-5"/> Selipkan Otomatis</>}
            </button>
          </form>
        </div>

        <div>
          <h3 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600"/> Celah Ditemukan Hari Ini
          </h3>
          
          {schedules.length === 0 ? (
            <div className="border-2 border-dashed border-outline-variant p-8 rounded-2xl text-center text-on-surface-variant font-medium">
              Belum ada tugas yang dijadwalkan.
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {schedules.map((s, idx) => (
                <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-emerald-500/30 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-center ml-2">
                    <div>
                      <p className="text-emerald-600 text-xs font-bold mb-1 tracking-wider uppercase">Tugas Teralokasi</p>
                      <p className="text-on-surface-variant font-medium text-sm">Durasi: {taskDuration} Jam</p>
                    </div>
                    <div className="text-right">
                      <p className="text-on-surface font-mono font-bold">{format(new Date(s.startTime), 'HH:mm')} - {format(new Date(s.endTime), 'HH:mm')}</p>
                      <p className="text-xs text-on-surface-variant mt-1">*(Termasuk padding istirahat)*</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
