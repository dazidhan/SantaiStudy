import React, { useState, useEffect, useCallback } from 'react';
import TaskBreaker from '../components/TaskBreaker';
import { apiClient, getUserId } from '../api/axiosClient';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PRIORITY_LABEL = { HIGH: 'Penting', MEDIUM: 'Sedang', LOW: 'Rendah' };
const PRIORITY_STYLE = {
  HIGH: 'bg-error-container/30 text-error',
  MEDIUM: 'bg-secondary-container/20 text-on-secondary-container',
  LOW: 'bg-surface-container-high text-on-surface-variant'
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showTaskBreaker, setShowTaskBreaker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = getUserId();

  const fetchTasks = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await apiClient.get(`/tasks?userId=${userId}`);
      setTasks(res.data.data || []);
    } catch (error) {
      console.error('Gagal memuat tugas:', error);
      toast.error('Gagal memuat daftar tugas. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    try {
      await apiClient.patch(`/tasks/${task._id}/status`, { status: newStatus });
      if (newStatus === 'COMPLETED') {
        toast.success('Tugas selesai! +10 XP 🎉', { icon: '✅' });
      }
    } catch (error) {
      // Revert on error
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: task.status } : t));
      toast.error('Gagal mengupdate status tugas');
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!confirm(`Hapus tugas "${taskTitle}"?`)) return;
    setTasks(prev => prev.filter(t => t._id !== taskId));
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      toast.success('Tugas berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus tugas. Coba lagi.');
      fetchTasks(); // Reload on error
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && task.status !== 'COMPLETED') ||
      (filterStatus === 'COMPLETED' && task.status === 'COMPLETED');
    const matchesSearch = !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status !== 'COMPLETED').length;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Kamu belum login.</p>
          <a href="/login" className="text-primary underline">Login sekarang</a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center px-margin-page bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">Tugas Saya</h2>
          <div className="h-6 w-[1px] bg-outline-variant mx-2 hidden md:block"></div>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant focus-within:ring-2 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-64 placeholder:text-outline-variant outline-none ml-2"
              placeholder="Cari tugas..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTaskBreaker(!showTaskBreaker)}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <span className="material-symbols-outlined">add</span>
            {showTaskBreaker ? 'Tutup Form' : 'Tambah Tugas'}
          </button>
        </div>
      </header>

      <div className="p-margin-page max-w-7xl mx-auto space-y-6 pb-stack-lg">
        {/* TaskBreaker — tampil saat tombol diklik */}
        {showTaskBreaker && (
          <div className="animate-slide-up">
            <TaskBreaker onTaskBroken={() => { fetchTasks(); setShowTaskBreaker(false); }} />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-surface-container px-1 py-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-6 py-2 rounded-lg font-label-md transition-all ${filterStatus === 'ALL' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Semua ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-6 py-2 rounded-lg font-label-md transition-all ${filterStatus === 'PENDING' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Belum Selesai ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-6 py-2 rounded-lg font-label-md transition-all ${filterStatus === 'COMPLETED' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Selesai ({completedCount})
            </button>
          </div>
        </div>

        {/* Task Board / Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
              <p className="ml-3 text-on-surface-variant">Memuat tugas...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-outline">task_alt</span>
              <p className="text-on-surface-variant mt-4 font-label-md">
                {searchQuery ? 'Tidak ada tugas yang cocok dengan pencarian.' : filterStatus === 'COMPLETED' ? 'Belum ada tugas yang selesai.' : 'Belum ada tugas. Klik "Tambah Tugas" untuk mulai!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant w-12 text-center">
                      <span className="material-symbols-outlined text-lg">check_box_outline_blank</span>
                    </th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant">Tugas</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant hidden md:table-cell">Sub-Tugas</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant hidden lg:table-cell">Deadline</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant">Prioritas</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-5 text-center">
                        <input
                          className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          type="checkbox"
                          checked={task.status === 'COMPLETED'}
                          onChange={() => handleToggleStatus(task)}
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className={task.status === 'COMPLETED' ? 'opacity-50' : ''}>
                          <p className={`font-label-md text-on-surface ${task.status === 'COMPLETED' ? 'line-through' : ''}`}>{task.title}</p>
                          {task.description && (
                            <p className="text-body-sm text-outline mt-0.5 truncate max-w-xs">{task.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        {task.subTasks && task.subTasks.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-sm">splitscreen</span>
                            {task.subTasks.filter(s => s.isCompleted).length}/{task.subTasks.length} langkah
                          </span>
                        ) : (
                          <span className="text-xs text-outline">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        {task.dueDate ? (
                          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg">event</span>
                            {format(new Date(task.dueDate), 'd MMM yyyy', { locale: id })}
                          </div>
                        ) : (
                          <span className="text-xs text-outline">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg font-label-sm ${PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.MEDIUM}`}>
                          {PRIORITY_LABEL[task.priority] || task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDeleteTask(task._id, task.title)}
                          className="text-outline hover:text-error transition-colors p-1"
                          title="Hapus tugas"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filteredTasks.length > 0 && (
            <div className="px-6 py-4 border-t border-outline-variant">
              <p className="text-body-sm text-on-surface-variant">Menampilkan {filteredTasks.length} dari {tasks.length} tugas</p>
            </div>
          )}
        </div>

        {/* Productivity Insight Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
            </div>
            <div>
              <h4 className="text-headline-sm font-bold text-on-surface">
                {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}% Selesai
              </h4>
              <p className="text-body-sm text-outline mt-1">
                {completedCount} dari {tasks.length} tugas telah diselesaikan.
              </p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-container/20 to-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-secondary font-label-md">
              <span className="material-symbols-outlined text-lg">smart_toy</span> Saran AI
            </div>
            <p className="text-body-md text-on-surface-variant italic">
              "Gunakan fitur <b>Pecah Tugas AI</b> di atas untuk memecah tugas besar menjadi bagian-bagian yang lebih kecil."
            </p>
            <button
              onClick={() => setShowTaskBreaker(true)}
              className="mt-auto pt-4 text-secondary font-label-md flex items-center gap-1 hover:underline w-fit"
            >
              Gunakan Sekarang <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div>
              <h4 className="font-label-md text-on-surface">Tugas Mendesak</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-error text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
                <span className="text-headline-sm font-bold text-error">
                  {tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length}
                </span>
              </div>
            </div>
            <p className="text-body-sm text-outline mt-2">Tugas prioritas tinggi yang belum selesai.</p>
          </div>
        </div>
      </div>

      {/* Contextual FAB */}
      <button
        onClick={() => setShowTaskBreaker(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">add</span>
        <div className="absolute right-16 px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-lg text-label-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Buat Tugas Baru
        </div>
      </button>
    </>
  );
}
