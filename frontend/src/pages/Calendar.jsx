import React, { useState } from 'react';
import { format } from 'date-fns';
import { apiClient, DUMMY_USER_ID } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function Calendar() {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [taskDuration, setTaskDuration] = useState(2);
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date();

  const handleAutoSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/schedules/auto', {
        userId: DUMMY_USER_ID,
        taskId: "6639c0f91a2b3c4d5e6f7a8c",
        targetDate: today.toISOString(),
        durationHours: Number(taskDuration)
      });
      
      const newSchedule = res.data.data;
      setSchedules([...schedules, newSchedule]);
      
      toast.success("AI berhasil menyelipkan jadwal tanpa membakar otakmu!");
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menjadwalkan tugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center px-margin-page bg-surface/80 backdrop-blur-md fixed top-0 right-0 w-[calc(100%-260px)] z-10">
        <h2 className="font-headline-md text-headline-md text-on-surface">Mei 2024</h2>
        <div className="flex items-center gap-gutter">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none ml-2" placeholder="Cari tugas atau sesi..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:bg-surface-container-low rounded-full p-2 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="hover:bg-surface-container-low rounded-full p-2 transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md flex items-center gap-2 hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Tambah Jadwal
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-24 px-margin-page pb-stack-lg flex gap-gutter min-h-screen">
        {/* Left: Calendar Main */}
        <div className="flex-grow bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          {/* Calendar Header Controls */}
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant">
              <button className="px-4 py-1.5 text-label-sm rounded-md transition-all hover:bg-white/50">Minggu</button>
              <button className="px-4 py-1.5 text-label-sm rounded-md bg-white shadow-sm text-primary font-bold">Bulan</button>
              <button className="px-4 py-1.5 text-label-sm rounded-md transition-all hover:bg-white/50">Agenda</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-surface-container-low rounded-full">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="font-label-md">Mei 2024</span>
              <button className="p-1.5 hover:bg-surface-container-low rounded-full">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          
          {/* Days of Week */}
          <div className="grid grid-cols-7 bg-surface-container-low/50">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
              <div key={day} className={`py-3 text-center text-label-sm font-bold text-outline uppercase tracking-wider ${i === 6 ? 'text-error' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid - simplified rendering for visual effect matching the HTML */}
          <div className="grid grid-cols-7 flex-1 border-t border-outline-variant">
             {[...Array(35)].map((_, i) => {
                const dayNum = i - 1; // start offset
                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                const isSunday = i % 7 === 6;
                const hasTask = dayNum === 9 || dayNum === 22 || dayNum === 24 || dayNum === 7 || dayNum === 1 || dayNum === 2;
                
                return (
                  <div key={i} className={`min-h-[120px] p-2 border-b border-r border-outline-variant ${!isCurrentMonth ? 'bg-surface-container-low/20' : ''} ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                    {isCurrentMonth && (
                      <>
                        <span className={`text-label-sm font-bold mb-1 block ${isSunday ? 'text-error' : ''}`}>
                          {dayNum === 1 ? '1 Mei' : dayNum}
                        </span>
                        {dayNum === 1 && <div className="bg-primary-container/20 text-on-primary-fixed-variant text-[11px] font-bold p-1 rounded-md mb-1 border-l-2 border-primary">Belajar AI</div>}
                        {dayNum === 2 && <div className="bg-tertiary-container/20 text-on-tertiary-fixed-variant text-[11px] font-bold p-1 rounded-md mb-1 border-l-2 border-tertiary">Desain UI</div>}
                        {dayNum === 7 && <div className="bg-primary-container/20 text-on-primary-fixed-variant text-[11px] font-bold p-1 rounded-md border-l-2 border-primary">Istirahat</div>}
                        {dayNum === 9 && <div className="bg-primary text-white text-[11px] font-bold p-1 rounded-md mb-1 shadow-sm">Deadline PPL</div>}
                        {dayNum === 16 && <div className="w-2 h-2 bg-secondary rounded-full mx-auto mt-4"></div>}
                        {dayNum === 22 && <div className="bg-error-container text-on-error-container text-[11px] font-bold p-1 rounded-md border-l-2 border-error">Presentasi Proyek</div>}
                        {dayNum === 24 && <div className="bg-tertiary-container/20 text-on-tertiary-fixed-variant text-[11px] font-bold p-1 rounded-md border-l-2 border-tertiary">UAS Pemrograman</div>}
                        
                        {/* Render newly added schedules on today (e.g. dayNum === today's date, let's just put it on day 18 for demo) */}
                        {schedules.map((s, idx) => {
                          if (dayNum === 18) {
                            return (
                              <div key={idx} className="bg-emerald-500/20 text-emerald-700 text-[11px] font-bold p-1 rounded-md mb-1 border-l-2 border-emerald-500">
                                {format(new Date(s.startTime), 'HH:mm')} Tugas
                              </div>
                            )
                          }
                          return null;
                        })}
                      </>
                    )}
                  </div>
                )
             })}
          </div>
        </div>

        {/* Right: Agenda & Summary */}
        <div className="w-[340px] flex flex-col gap-gutter">
          {/* Focus Status Card */}
          <div className="bg-primary text-on-primary p-stack-md rounded-2xl shadow-xl shadow-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-md">Status Fokus</h3>
              <span className="material-symbols-outlined text-inverse-primary">auto_awesome</span>
            </div>
            <p className="text-body-sm opacity-90 mb-6">Jangan lupa istirahat sejenak setiap 50 menit belajar, ya!</p>
            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <p className="text-label-sm font-bold">Target Mingguan</p>
                <p className="text-label-sm opacity-80">12 / 15 Sesi Selesai</p>
              </div>
            </div>
          </div>

          {/* ADD SCHEDULE FORM (Integrated from AntiStressCalendar) */}
          {showAddForm && (
            <div className="bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant animate-fade-in shadow-lg">
              <form onSubmit={handleAutoSchedule}>
                <h3 className="font-label-md text-on-surface mb-2">Simulasi Penjadwalan Dinamis</h3>
                <p className="text-xs text-on-surface-variant mb-4">AI akan mencari celah waktu kosong dengan padding istirahat.</p>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-on-surface block mb-1">Durasi Tugas (Jam)</label>
                  <input 
                    type="number" 
                    min="1" max="8"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(e.target.value)}
                  />
                </div>
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full bg-primary text-on-primary py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  {loading ? 'Menghitung...' : <><span className="material-symbols-outlined text-[18px]">auto_fix_high</span> Selipkan Otomatis</>}
                </button>
              </form>
            </div>
          )}

          {/* Upcoming Agenda */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-stack-md flex-1 border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-label-md text-on-surface">Agenda Mendatang</h3>
              <button className="text-primary text-label-sm font-bold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {/* Render generated schedules */}
              {schedules.map((s, idx) => (
                 <div key={idx} className="flex gap-4 group cursor-pointer animate-slide-up">
                  <div className="flex flex-col items-center">
                    <span className="text-label-sm font-bold text-emerald-600">BARU</span>
                    <div className="w-1 h-full bg-emerald-500/20 rounded-full mt-2 group-hover:bg-emerald-500 transition-colors"></div>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-xl flex-grow border border-emerald-200 group-hover:border-emerald-500 transition-all">
                    <h4 className="text-label-md text-emerald-900 mb-1">Tugas Teralokasi</h4>
                    <div className="flex items-center gap-2 text-label-sm text-emerald-700">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{format(new Date(s.startTime), 'HH:mm')} - {format(new Date(s.endTime), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Agenda Item 1 */}
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-label-sm font-bold text-on-surface">BESOK</span>
                  <div className="w-1 h-full bg-primary/20 rounded-full mt-2 group-hover:bg-primary transition-colors"></div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl flex-grow border border-transparent group-hover:border-primary transition-all">
                  <h4 className="text-label-md text-on-surface mb-1">Kuis Matematika Diskret</h4>
                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>08.00 - 09.30</span>
                  </div>
                </div>
              </div>
              
              {/* Agenda Item 2 */}
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-label-sm font-bold text-on-surface">10 MEI</span>
                  <div className="w-1 h-full bg-outline-variant rounded-full mt-2 group-hover:bg-primary transition-colors"></div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl flex-grow border border-transparent group-hover:border-primary transition-all">
                  <h4 className="text-label-md text-on-surface mb-1">Rapat Kelompok PPL</h4>
                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span>13.00 - 15.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mt-8 p-4 bg-tertiary-container/10 border border-tertiary-container/30 rounded-2xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-2 text-tertiary-container/40">
                <span className="material-symbols-outlined text-[40px]">lightbulb</span>
              </div>
              <h4 className="text-label-md text-tertiary font-bold mb-2">AI Insights</h4>
              <p className="text-label-sm text-on-tertiary-fixed-variant leading-relaxed">Kamu punya 3 deadline di minggu ke-2. Kami menyarankan untuk membagi sesi belajar jadi 2 jam per hari mulai sekarang agar tidak stres di akhir!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAB */}
      <button onClick={() => setShowAddForm(!showAddForm)} className="fixed bottom-margin-page right-margin-page w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[32px]">edit_calendar</span>
      </button>
    </>
  );
}
