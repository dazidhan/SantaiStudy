import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiClient, getUserId, getCurrentUser } from '../api/axiosClient';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PRIORITY_LABEL = { HIGH: 'Penting', MEDIUM: 'Sedang', LOW: 'Rendah' };
const PRIORITY_STYLE = {
  HIGH: 'bg-error-container text-on-error-container',
  MEDIUM: 'bg-secondary-container/20 text-on-secondary-container',
  LOW: 'bg-surface-container-high text-on-surface-variant'
};

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = getUserId();

  const [stats, setStats] = useState({ totalTasks: 0, completedThisWeek: 0, upcomingDeadlines: 0, productivityScore: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        const [tasksRes, statsRes] = await Promise.all([
          apiClient.get(`/tasks?userId=${userId}`),
          apiClient.get(`/stats?userId=${userId}`)
        ]);

        const taskData = tasksRes.data.data || [];
        setRecentTasks(taskData.slice(0, 5)); // Tampilkan 5 tugas terbaru
        setStats(statsRes.data.data || {});
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, navigate]);

  const handleToggleTaskStatus = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setRecentTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    try {
      await apiClient.patch(`/tasks/${task._id}/status`, { status: newStatus });
      if (newStatus === 'COMPLETED') toast.success('Tugas selesai! +10 XP 🎉');
    } catch (e) {
      setRecentTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: task.status } : t));
    }
  };

  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-page">
        <h2 className="font-headline-md text-headline-md text-on-surface">Beranda</h2>
        <div className="flex items-center gap-4">
          <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-xl flex items-center bg-surface-container-low px-4 py-2 w-64 transition-all">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm ml-2 w-full outline-none" placeholder="Cari tugas, materi..." type="text" />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-24 pb-12 px-margin-page">
        {/* Hero Welcome Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-1">
              {greeting()}, {currentUser?.name?.split(' ')[0] || 'Pengguna'}! 👋
            </h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Semangat belajar hari ini! Kamu pasti bisa.</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-label-md text-secondary">
                {stats.productivityScore || 0}% Produktivitas
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Stats Cards */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">task</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Total Tugas</p>
                  <p className="text-headline-md font-bold text-on-surface">
                    {loading ? <span className="animate-pulse">...</span> : stats.totalTasks || 0}
                  </p>
                </div>
              </div>
              <Link to="/tasks" className="text-label-md text-primary flex items-center gap-1 hover:underline">
                Kelola tugas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">alarm</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Deadline Dekat</p>
                  <p className="text-headline-md font-bold text-on-surface">
                    {loading ? <span className="animate-pulse">...</span> : stats.upcomingDeadlines || 0}
                  </p>
                </div>
              </div>
              <Link to="/tasks" className="text-label-md text-primary flex items-center gap-1 hover:underline">
                Lihat semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Selesai Minggu Ini</p>
                  <p className="text-headline-md font-bold text-on-surface">
                    {loading ? <span className="animate-pulse">...</span> : stats.completedThisWeek || 0}
                  </p>
                </div>
              </div>
              <Link to="/stats" className="text-label-md text-primary flex items-center gap-1 hover:underline">
                Lihat statistik <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-12 lg:col-span-3">
            <div className="bg-primary text-on-primary p-6 rounded-2xl border border-primary/20 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-label-sm opacity-80 mb-1">Skor Produktivitas</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-[40px] font-bold">{loading ? '...' : `${stats.productivityScore || 0}%`}</p>
                  <p className="text-label-md font-normal opacity-90">
                    {(stats.productivityScore || 0) >= 70 ? 'Keren! 🔥' : 'Ayo semangat! 💪'}
                  </p>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full mb-4">
                  <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${stats.productivityScore || 0}%` }}></div>
                </div>
                <Link to="/stats" className="inline-block text-label-md bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  Detail Statistik
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">analytics</span>
              </div>
            </div>
          </div>

          {/* Main Section: Task List */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex-1">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Tugas Berikutnya</h4>
                <Link to="/tasks" className="text-label-md text-primary hover:underline">Lihat semua</Link>
              </div>
              <div className="divide-y divide-outline-variant">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
                        <div className="h-3 bg-surface-container-high rounded w-1/3"></div>
                      </div>
                    </div>
                  ))
                ) : recentTasks.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline">task_alt</span>
                    <p className="text-on-surface-variant mt-3">Belum ada tugas. Buat tugas pertamamu!</p>
                    <Link to="/tasks" className="mt-4 inline-block text-primary font-label-md hover:underline">+ Tambah Tugas</Link>
                  </div>
                ) : (
                  recentTasks.filter(t => t.status !== 'COMPLETED').slice(0, 5).concat(recentTasks.filter(t => t.status === 'COMPLETED').slice(0, 2)).map((task) => (
                    <div key={task._id} className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'COMPLETED' ? 'bg-primary border-primary text-on-primary' : 'border-outline hover:border-primary hover:text-primary text-outline'}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {task.status === 'COMPLETED' ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </button>
                        <div className={task.status === 'COMPLETED' ? 'opacity-50' : ''}>
                          <h5 className={`font-label-md text-on-surface ${task.status === 'COMPLETED' ? 'line-through' : ''}`}>{task.title}</h5>
                          {task.dueDate && (
                            <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">event</span>
                              {format(new Date(task.dueDate), 'd MMMM', { locale: id })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.MEDIUM}`}>
                        {PRIORITY_LABEL[task.priority] || task.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Recommendation & Quick Actions */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span className="material-symbols-outlined">flash_on</span>
                <h4 className="font-label-md">Aksi Cepat</h4>
              </div>
              <div className="space-y-3">
                <Link to="/tasks" className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white transition-colors group">
                  <span className="material-symbols-outlined text-primary">add_task</span>
                  <div>
                    <p className="font-label-md text-on-surface">Buat Tugas Baru</p>
                    <p className="text-label-sm text-on-surface-variant">Dengan pemecahan AI</p>
                  </div>
                  <span className="material-symbols-outlined text-outline ml-auto group-hover:text-primary transition-colors">arrow_forward</span>
                </Link>
                <Link to="/mood" className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white transition-colors group">
                  <span className="material-symbols-outlined text-secondary">psychology</span>
                  <div>
                    <p className="font-label-md text-on-surface">Cek Mood Hari Ini</p>
                    <p className="text-label-sm text-on-surface-variant">Rekomendasi berbasis emosi</p>
                  </div>
                  <span className="material-symbols-outlined text-outline ml-auto group-hover:text-secondary transition-colors">arrow_forward</span>
                </Link>
                <Link to="/document-ai" className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white transition-colors group">
                  <span className="material-symbols-outlined text-tertiary">description</span>
                  <div>
                    <p className="font-label-md text-on-surface">Unggah Silabus</p>
                    <p className="text-label-sm text-on-surface-variant">AI ekstrak deadline otomatis</p>
                  </div>
                  <span className="material-symbols-outlined text-outline ml-auto group-hover:text-tertiary transition-colors">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-on-surface">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <h4 className="font-label-md">Tips Produktivitas</h4>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Gunakan teknik <b>Pomodoro</b>: Fokus 25 menit, istirahat 5 menit. Ini membantu otak bekerja lebih efisien dan mengurangi kelelahan mental.
              </p>
              <Link to="/mood" className="mt-4 inline-flex items-center gap-1 text-primary font-label-md hover:underline">
                Mulai sesi fokus <span className="material-symbols-outlined text-sm">timer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link to="/tasks" className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>
    </>
  );
}
