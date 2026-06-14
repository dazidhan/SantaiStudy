import React, { useState } from 'react';
import { apiClient, getUserId } from '../api/axiosClient';
import { Sparkles, Calendar, Target, Plus, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskBreaker({ onTaskBroken }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) {
      toast.error('Kamu belum login. Silakan login terlebih dahulu.');
      return;
    }
    setLoading(true);
    setResult(null);
    const promise = apiClient.post('/tasks', { userId, ...form });
    toast.promise(promise, {
      loading: '🤖 AI sedang meracik rencana belajarmu...',
      success: (res) => {
        setResult(res.data.data);
        if (onTaskBroken) onTaskBroken();
        return `✅ Tugas berhasil dipecah menjadi ${res.data.data.subTasks?.length || 0} langkah!`;
      },
      error: (err) => {
        const msg = err.response?.data?.message || 'Gagal memecah tugas. Cek koneksi backend.';
        return msg;
      }
    });
    try {
      await promise;
      setForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
    } catch (e) {
      // error already handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-outline-variant">
        <div className="bg-primary/10 p-2 rounded-xl">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">AI Task Breaker</h2>
          <p className="text-sm text-on-surface-variant">Pecah tugas besar jadi langkah super kecil</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Judul Tugas Besar</label>
          <input 
            required
            type="text" 
            placeholder="misal: Makalah Sejarah Perang Dunia 2"
            className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Instruksi Spesifik (Opsional)</label>
          <textarea 
            rows="3"
            placeholder="misal: Harus 10 halaman, ada bab pendahuluan, metodologi..."
            className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-body-sm text-on-surface outline-none resize-none transition-all placeholder:text-outline"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary"/>Deadline
            </label>
            <input 
              type="date" 
              className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-body-sm text-on-surface outline-none transition-all"
              value={form.dueDate}
              onChange={(e) => setForm({...form, dueDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary"/>Prioritas
            </label>
            <select 
              className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-body-sm text-on-surface outline-none transition-all"
              value={form.priority}
              onChange={(e) => setForm({...form, priority: e.target.value})}
            >
              <option value="LOW">Rendah (Santai)</option>
              <option value="MEDIUM">Sedang (Standar)</option>
              <option value="HIGH">Tinggi (Mendesak!)</option>
            </select>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/95 text-on-primary font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0">
          {loading ? (
             <span className="animate-pulse flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin"/> AI Sedang Meracik Skenario...</span>
          ) : (
            <><Plus className="w-6 h-6"/> Eksekusi dengan AI</>
          )}
        </button>
      </form>

      {/* Hasil AI */}
      {result && result.subTasks && result.subTasks.length > 0 && (
        <div className="mt-10 animate-fade-in bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Rencana Mikro (Micro-steps) Berhasil Dibuat
          </h3>
          <div className="space-y-4">
            {result.subTasks.map((task, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex items-start justify-between gap-4 group hover:border-primary/50 hover:bg-surface transition-all shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20 group-hover:border-primary transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-lg mb-1">{task.title}</p>
                    {task.estimatedHours && (
                      <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold">
                        Estimasi: {task.estimatedHours} Jam
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
