import React, { useState, useEffect, useCallback } from 'react';
import { format, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { apiClient, getUserId } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [taskDuration, setTaskDuration] = useState(2);
  const [targetDate, setTargetDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userId = getUserId();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const fetchData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const [schedulesRes, tasksRes] = await Promise.all([
        apiClient.get(`/schedules?userId=${userId}`),
        apiClient.get(`/tasks?userId=${userId}`)
      ]);
      setSchedules(schedulesRes.data.data || []);
      const pendingTasks = (tasksRes.data.data || []).filter(t => t.status !== 'COMPLETED');
      setTasks(pendingTasks);
      if (pendingTasks.length > 0) {
        setSelectedTaskId(pendingTasks[0]._id);
      }
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      toast.error('Gagal memuat jadwal atau tugas dari server.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAutoSchedule = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      toast.error("Silakan pilih tugas untuk dijadwalkan.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiClient.post('/schedules/auto', {
        userId,
        taskId: selectedTaskId,
        targetDate: new Date(targetDate).toISOString(),
        durationHours: Number(taskDuration)
      });
      toast.success("AI berhasil menyelipkan jadwal tanpa membakar otakmu! 🎉");
      setShowAddForm(false);
      fetchData(); // Reload data
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menjadwalkan tugas. Cek batas kapasitas harian.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate calendar grid (42 cells to ensure any configuration fits)
  const generateGrid = () => {
    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // Mon = 0, Tue = 1, ..., Sun = 6
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    
    // Prev Month Padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayVal = totalDaysInPrevMonth - i;
      cells.push({
        date: new Date(year, month - 1, dayVal),
        isCurrentMonth: false,
        dayNum: dayVal
      });
    }

    // Current Month Days
    for (let dayVal = 1; dayVal <= totalDaysInMonth; dayVal++) {
      cells.push({
        date: new Date(year, month, dayVal),
        isCurrentMonth: true,
        dayNum: dayVal
      });
    }

    // Next Month Padding
    const remaining = 42 - cells.length;
    for (let dayVal = 1; dayVal <= remaining; dayVal++) {
      cells.push({
        date: new Date(year, month + 1, dayVal),
        isCurrentMonth: false,
        dayNum: dayVal
      });
    }

    return cells;
  };

  const getSchedulesForDate = (date) => {
    return schedules.filter(s => {
      const sDate = new Date(s.startTime);
      return sDate.getDate() === date.getDate() &&
             sDate.getMonth() === date.getMonth() &&
             sDate.getFullYear() === date.getFullYear();
    });
  };

  const getAgendaDateHeader = (dateStr) => {
    const d = new Date(dateStr);
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);

    if (d.toDateString() === todayDate.toDateString()) return 'HARI INI';
    if (d.toDateString() === tomorrowDate.toDateString()) return 'BESOK';
    return format(d, 'd MMM', { locale: id }).toUpperCase();
  };

  const gridCells = generateGrid();
  const upcomingSchedules = schedules
    .filter(s => new Date(s.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  const completedSchedulesCount = schedules.filter(s => new Date(s.endTime) < new Date()).length;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Kamu belum login.</p>
          <a href="/login" className="text-primary underline font-bold">Login sekarang</a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center px-margin-page bg-surface/80 backdrop-blur-md fixed top-0 right-0 w-[calc(100%-260px)] z-10 border-b border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-on-surface">{monthNames[month]} {year}</h2>
        <div className="flex items-center gap-gutter">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none ml-2 text-on-surface" placeholder="Cari tugas atau sesi..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:bg-surface-container-low rounded-full p-2 transition-colors relative text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:bg-surface-container-low rounded-full p-2 transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <button 
              onClick={() => {
                setTargetDate(format(new Date(), 'yyyy-MM-dd'));
                setShowAddForm(!showAddForm);
              }}
              className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md flex items-center gap-2 hover:opacity-90 shadow-md transition-all active:scale-95"
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
              <button className="px-4 py-1.5 text-label-sm rounded-md transition-all hover:bg-white/50 text-on-surface-variant">Minggu</button>
              <button className="px-4 py-1.5 text-label-sm rounded-md bg-white shadow-sm text-primary font-bold">Bulan</button>
              <button className="px-4 py-1.5 text-label-sm rounded-md transition-all hover:bg-white/50 text-on-surface-variant">Agenda</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="font-label-md text-on-surface font-semibold min-w-[120px] text-center">{monthNames[month]} {year}</span>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          
          {/* Days of Week */}
          <div className="grid grid-cols-7 bg-surface-container-low/50">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
              <div key={day} className={`py-3 text-center text-label-sm font-bold text-outline uppercase tracking-wider ${i === 6 ? 'text-error' : 'text-on-surface/80'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 border-t border-outline-variant">
             {loading ? (
               <div className="col-span-7 flex items-center justify-center min-h-[300px]">
                 <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
                 <p className="ml-3 text-on-surface-variant">Memuat kalender...</p>
               </div>
             ) : (
               gridCells.map((cell, i) => {
                 const isCellToday = isToday(cell.date);
                 const schedulesForDay = getSchedulesForDate(cell.date);
                 
                 return (
                   <div 
                     key={i} 
                     className={`min-h-[120px] p-2 border-b border-r border-outline-variant transition-all ${
                       !cell.isCurrentMonth ? 'bg-surface-container-low/20 text-on-surface-variant/40' : 'bg-surface-container-lowest'
                     } ${i % 7 === 6 ? 'border-r-0' : ''} ${
                       isCellToday ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''
                     }`}
                   >
                     <span className={`text-label-sm font-bold mb-1.5 block ${
                       isCellToday ? 'text-primary font-extrabold' : (i % 7 === 6 ? 'text-error' : 'text-on-surface')
                     }`}>
                       {cell.isCurrentMonth && cell.dayNum === 1 ? `1 ${monthNames[month].substring(0, 3)}` : cell.dayNum}
                     </span>
                     
                     <div className="space-y-1 overflow-y-auto max-h-[90px]">
                       {schedulesForDay.map((s, idx) => (
                         <div 
                           key={idx} 
                           className="bg-primary/10 text-primary text-[10px] font-bold p-1 rounded-md border-l-2 border-primary truncate"
                           title={s.taskId?.title || 'Tugas Tanpa Judul'}
                         >
                           {format(new Date(s.startTime), 'HH:mm')} {s.taskId?.title || 'Tugas'}
                         </div>
                       ))}
                     </div>
                   </div>
                 )
               })
             )}
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
                <p className="text-label-sm font-bold">Sesi Terjadwal</p>
                <p className="text-label-sm opacity-80">{schedules.length} Sesi Terdaftar</p>
              </div>
            </div>
          </div>

          {/* ADD SCHEDULE FORM */}
          {showAddForm && (
            <div className="bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant animate-fade-in shadow-lg">
              <form onSubmit={handleAutoSchedule} className="space-y-4">
                <div>
                  <h3 className="font-label-md text-on-surface font-bold">AI Auto Schedule</h3>
                  <p className="text-xs text-on-surface-variant">AI akan mencari slot waktu luang terbaik untuk belajarmu hari ini.</p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Pilih Tugas</label>
                  {tasks.length > 0 ? (
                    <select
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                      {tasks.map(t => (
                        <option key={t._id} value={t._id}>{t.title}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-error font-medium">Tidak ada tugas aktif. Buat tugas terlebih dahulu!</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Tanggal Target</label>
                  <input 
                    type="date"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Durasi Tugas (Jam)</label>
                  <input 
                    type="number" 
                    min="1" max="8"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(e.target.value)}
                  />
                </div>

                <button 
                  disabled={submitting || tasks.length === 0} 
                  type="submit" 
                  className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  {submitting ? 'Menjadwalkan...' : <><span className="material-symbols-outlined text-[18px]">auto_fix_high</span> Selipkan Otomatis</>}
                </button>
              </form>
            </div>
          )}

          {/* Upcoming Agenda */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-stack-md flex-1 border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-label-md text-on-surface font-bold">Agenda Mendatang</h3>
              <a href="/tasks" className="text-primary text-label-sm font-bold hover:underline">Lihat Semua</a>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map((s, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer animate-slide-up">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
                        {getAgendaDateHeader(s.startTime)}
                      </span>
                      <div className="w-1 h-full bg-primary/20 rounded-full mt-2 group-hover:bg-primary transition-colors"></div>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl flex-grow border border-transparent group-hover:border-primary transition-all">
                      <h4 className="text-label-md text-on-surface mb-1 font-semibold">
                        {s.taskId?.title || 'Sesi Belajar'}
                      </h4>
                      <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                        <span>
                          {format(new Date(s.startTime), 'HH:mm')} - {format(new Date(s.endTime), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-outline text-4xl">calendar_today</span>
                  <p className="text-sm text-on-surface-variant mt-2">Tidak ada agenda mendatang.</p>
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="mt-8 p-4 bg-tertiary-container/10 border border-tertiary-container/30 rounded-2xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-2 text-tertiary-container/40">
                <span className="material-symbols-outlined text-[40px]">lightbulb</span>
              </div>
              <h4 className="text-label-md text-tertiary font-bold mb-2">AI Insights</h4>
              <p className="text-label-sm text-on-tertiary-fixed-variant leading-relaxed">
                {schedules.length > 0 
                  ? `Kamu memiliki ${schedules.length} sesi belajar yang direncanakan. AI menyarankan untuk menjaga alur belajar yang konsisten agar terhindar dari stres menjelang deadline!`
                  : "Jadwal belajarmu kosong minggu ini. AI menyarankan untuk memecah tugas kuliahmu menggunakan 'AI Task Breaker' dan menjadwalkannya di sini!"}
              </p>
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
