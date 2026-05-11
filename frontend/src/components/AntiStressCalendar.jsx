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
    <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="bg-emerald-500/20 p-2 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Kalender Anti-Stress</h2>
          <p className="text-sm text-slate-400">Jadwal yang sangat adaptif terhadap kehidupan mahasiswa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleAutoSchedule} className="bg-dark-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-semibold text-slate-200 mb-2">Simulasi Penjadwalan Dinamis</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Masukkan estimasi jam. AI akan mencari celah waktu kosong di kalendermu dengan <span className="text-emerald-400">jeda istirahat 15 menit otomatis</span> untuk mencegah burnout.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4"/> Durasi Tugas (Jam)
              </label>
              <input 
                type="number" 
                min="1" max="8"
                className="glass-input"
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
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400"/> Celah Ditemukan Hari Ini
          </h3>
          
          {schedules.length === 0 ? (
            <div className="border-2 border-dashed border-slate-700 p-8 rounded-2xl text-center text-slate-500 font-medium">
              Belum ada tugas yang dijadwalkan.
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {schedules.map((s, idx) => (
                <div key={idx} className="bg-gradient-to-r from-emerald-900/40 to-dark-800 p-4 rounded-xl border border-emerald-500/30 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-center ml-2">
                    <div>
                      <p className="text-emerald-400 text-xs font-bold mb-1 tracking-wider uppercase">Tugas Teralokasi</p>
                      <p className="text-slate-200 font-medium text-sm">Durasi: {taskDuration} Jam</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono font-bold">{format(new Date(s.startTime), 'HH:mm')} - {format(new Date(s.endTime), 'HH:mm')}</p>
                      <p className="text-xs text-slate-400 mt-1">*(Termasuk padding istirahat)*</p>
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
