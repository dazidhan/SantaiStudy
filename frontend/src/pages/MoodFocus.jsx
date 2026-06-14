import React, { useState, useEffect } from 'react';
import { apiClient, getUserId } from '../api/axiosClient';
import toast from 'react-hot-toast';

const MOODS = [
  { id: 'TIRED', emoji: '😫', label: 'Capek', bgClass: 'hover:border-primary/50' },
  { id: 'NEUTRAL', emoji: '😐', label: 'Biasa aja', bgClass: 'hover:border-primary/50' },
  { id: 'OKAY', emoji: '🙂', label: 'Lumayan', bgClass: 'hover:border-primary/50' },
  { id: 'ENERGIZED', emoji: '🔥', label: 'Semangat', bgClass: 'hover:border-primary/50' },
  { id: 'FOCUSED', emoji: '🚀', label: 'Super Fokus', bgClass: 'hover:border-primary/50' },
];

export default function MoodFocus() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [curhatan, setCurhatan] = useState('');

  // Timer State
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast.success("Sesi fokus selesai! Waktunya istirahat sebentar.", { icon: "🎉" });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleSetTimer = (mins) => {
    setFocusMinutes(mins);
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const submitToAI = async () => {
    if (!selectedMood) {
      toast.error("Pilih mood kamu dulu ya!");
      return;
    }
    const userId = getUserId();
    if (!userId) { toast.error('Kamu belum login.'); return; }
    setLoading(true);
    setSuggestion(null);
    try {
      // Simpan mood log ke backend
      await apiClient.post('/moods', { userId, mood: selectedMood.id, notes: curhatan }).catch(() => {});

      const moodPayload = curhatan.trim() ? `${selectedMood.id} - Curhatan: ${curhatan}` : selectedMood.id;
      const [suggestRes, tasksRes] = await Promise.all([
        apiClient.post('/tasks/suggest', { userId, mood: moodPayload }),
        apiClient.get(`/tasks?userId=${userId}`)
      ]);
      const suggestionData = suggestRes.data.data;
      // Enrich task IDs with actual task objects
      const allTasks = tasksRes.data.data || [];
      const enrichedTaskIds = (suggestionData.recommendedTaskIds || []).map(taskId => {
        const task = allTasks.find(t => t._id === taskId);
        return task || { _id: taskId, title: `Tugas ${taskId.substring(0,8)}...` };
      });
      setSuggestion({ ...suggestionData, recommendedTasks: enrichedTaskIds });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat rekomendasi AI. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center mb-8 px-margin-page mt-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">Mood &amp; Fokus</h1>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 w-64 text-body-sm focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="Cari fitur atau tugas..." type="text" />
          </div>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <div className="px-margin-page pb-12">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-gutter">
          
          {/* Mood Selector Card */}
          <section className="col-span-12 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <h2 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Bagaimana perasaanmu hari ini?</h2>
            <p className="text-on-surface-variant mb-8">Mood kamu akan membantu AI merekomendasikan sesi belajar yang paling pas.</p>
            
            <div className="flex flex-wrap justify-between gap-4">
              {MOODS.map((m) => {
                const isSelected = selectedMood?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m)}
                    className={`flex-1 min-w-[120px] p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 group ${
                      isSelected 
                        ? 'bg-primary-container/10 border-primary shadow-md shadow-primary/5' 
                        : 'bg-surface-container-low border-transparent hover:border-primary/50'
                    }`}
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                    <span className={`font-label-md ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{m.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Area Curhat */}
            <div className="mt-8">
              <label className="font-label-md text-on-surface block mb-2">Ada hal spesifik yang membebani atau ingin diceritakan? (Opsional)</label>
              <textarea 
                className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-body-sm outline-none resize-none transition-all"
                rows="3"
                placeholder="Misal: Saya capek banget habis ngerjain PPL dari semalem, butuh tugas yang gampang aja..."
                value={curhatan}
                onChange={(e) => setCurhatan(e.target.value)}
              ></textarea>
            </div>

            <button 
              onClick={submitToAI}
              disabled={loading}
              className="mt-6 w-full py-3 bg-primary text-on-primary rounded-xl font-label-md shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">psychology</span>
              Dapatkan Saran Strategi AI
            </button>
          </section>

          {/* AI Recommendations (Left Column) */}
          <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-tertiary-container/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-tertiary">auto_fix_high</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Rekomendasi AI</h2>
              </div>
            </div>

            {loading ? (
               <div className="text-center py-10 flex flex-col items-center">
                 <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">refresh</span>
                 <p className="text-primary font-medium">AI sedang meracik strategi untukmu...</p>
               </div>
            ) : suggestion ? (
              <>
                <div className="bg-surface-container-low p-6 rounded-2xl mb-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-label-md text-primary mb-1">Mood Kamu: {selectedMood?.label} {selectedMood?.emoji}</h3>
                    <p className="text-on-surface-variant text-body-sm max-w-[80%] italic">"{suggestion.reason}"</p>
                  </div>
                  <div className="absolute -right-4 -bottom-6 w-32 h-32 opacity-20">
                    <span className="material-symbols-outlined text-9xl text-primary">psychology</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <p className="font-bold text-primary text-xs uppercase tracking-widest">Tugas yang Disarankan</p>
                  {suggestion.recommendedTasks?.length > 0 ? suggestion.recommendedTasks.map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">task</span>
                        </div>
                        <div>
                          <h4 className="font-label-md text-on-surface group-hover:text-primary transition-colors">{task.title}</h4>
                          <p className="text-xs text-on-surface/80">Prioritas: {task.priority || 'MEDIUM'}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  )) : (
                    <p className="text-sm text-on-surface/80">Tidak ada tugas spesifik yang disarankan saat ini.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-on-surface/80">Pilih mood di atas untuk mendapatkan rekomendasi dari AI.</p>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-primary-container/5 border border-primary/20">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-outline-variant overflow-hidden shrink-0">
                <img alt="Brain Mascot" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-838ovWXSqfQYTF-Bs3_5pU6lhBpx0_mq_u7p-eGF5NkoFzfbj817e-l6V_1c5uOB_ywGG4qs9XKKeIV62ao5Jtap-tYntWY3OponQNVnpSSu6NHrpWTf-ugpyeb9wPgSW8Rm9GrnX4mRrfI5iJVocdbduxf6AjhrgC87MRpehT4cBHNQ-kYYfCaYGtDobNSYKrm__34v3nrh4sJRgCF7FTMl_ga8DXOG-gHnBIMRvhhi0TLafbHq91JYB6C5AFf2WBqXdFQAxN4" />
              </div>
              <div>
                <p className="text-sm font-label-md text-primary font-bold">"Ayo Andi! Fokus sebentar, istirahat kemudian!"</p>
                <p className="text-xs text-on-surface/60 font-medium">- Si Otak, AI Companion Kamu</p>
              </div>
            </div>
          </section>

          {/* Fokus Tracker Card (Right Column) */}
          <section className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">timer</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Fokus Tracker</h2>
            </div>
            
            <div className="text-center py-10 flex flex-col items-center relative">
              <div className="flex gap-2 mb-6">
                {[15, 25, 50].map((mins) => (
                  <button 
                    key={mins}
                    onClick={() => handleSetTimer(mins)}
                    className={`px-4 py-1.5 rounded-full text-label-sm font-bold border transition-colors ${
                      focusMinutes === mins ? 'bg-primary text-white border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    {mins} Menit
                  </button>
                ))}
              </div>

              <p className="text-on-surface font-semibold text-body-sm mb-2">Waktu Sisa Fokus</p>
              <div className="text-[64px] font-bold text-on-surface mb-6 tracking-tight font-mono">{formatTime(timeLeft)}</div>
              
              <div className="w-full bg-surface-container-high rounded-full h-4 mb-3 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000 relative"
                  style={{ width: `${(timeLeft / (focusMinutes * 60)) * 100}%` }}
                >
                  {isTimerRunning && <div className="absolute top-0 right-0 w-4 h-full bg-white/20 animate-pulse"></div>}
                </div>
              </div>
              <div className="flex justify-between w-full text-xs text-on-surface font-semibold mb-12">
                <span>Target Sesi: {focusMinutes}m</span>
              </div>
              
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-full py-5 text-on-primary rounded-2xl font-headline-sm shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                  isTimerRunning ? 'bg-error shadow-error/30' : 'bg-primary shadow-primary/30'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isTimerRunning ? 'pause' : 'play_arrow'}
                </span>
                {isTimerRunning ? 'Jeda Fokus' : 'Mulai Fokus Session'}
              </button>
            </div>
            
            <div className="mt-auto border-t border-outline-variant pt-8">
              <p className="font-bold text-primary text-xs uppercase tracking-widest mb-4">Statistik Fokus Terakhir</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-xs text-on-surface font-medium">Sesi Terpanjang</span>
                  <div className="font-headline-sm text-primary">1j 45m</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-xs text-on-surface font-medium">Skor Produktivitas</span>
                  <div className="font-headline-sm text-secondary">85%</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Productivity Tips */}
        <div className="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/50 backdrop-blur-sm flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">tips_and_updates</span>
            <div>
              <h4 className="font-label-md text-on-surface">Teknik Pomodoro</h4>
              <p className="text-xs text-on-surface-variant">Coba belajar 25 menit dan istirahat 5 menit untuk menjaga kesegaran otak.</p>
            </div>
          </div>
          <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/50 backdrop-blur-sm flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">water_drop</span>
            <div>
              <h4 className="font-label-md text-on-surface">Minum Air Putih</h4>
              <p className="text-xs text-on-surface-variant">Dehidrasi ringan dapat menurunkan fokus kamu hingga 20%. Tetap terhidrasi!</p>
            </div>
          </div>
          <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/50 backdrop-blur-sm flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">dark_mode</span>
            <div>
              <h4 className="font-label-md text-on-surface">Istirahat Cukup</h4>
              <p className="text-xs text-on-surface-variant">Tidur yang berkualitas adalah kunci utama produktivitas yang santai.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
