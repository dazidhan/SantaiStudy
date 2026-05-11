import React, { useState } from 'react';
import { apiClient, DUMMY_USER_ID } from '../api/axiosClient';
import { Sparkles, Calendar, Target, Plus, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TaskBreaker({ onTaskBroken }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await apiClient.post('/tasks', {
        userId: DUMMY_USER_ID,
        ...form
      });
      setResult(res.data.data); // Returns the saved Task with subTasks
      
      if (onTaskBroken) {
        onTaskBroken();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memecah tugas menggunakan AI. Cek console log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <div className="bg-primary-500/20 p-2 rounded-xl">
          <Sparkles className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Task Breaker</h2>
          <p className="text-sm text-slate-400">Pecah tugas besar jadi langkah super kecil</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Judul Tugas Besar</label>
          <input 
            required
            type="text" 
            placeholder="misal: Makalah Sejarah Perang Dunia 2"
            className="glass-input"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instruksi Spesifik (Opsional)</label>
          <textarea 
            rows="3"
            placeholder="misal: Harus 10 halaman, ada bab pendahuluan, metodologi..."
            className="glass-input resize-none"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-slate-400"/>Deadline
            </label>
            <input 
              type="date" 
              className="glass-input"
              value={form.dueDate}
              onChange={(e) => setForm({...form, dueDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <Target className="w-4 h-4 inline mr-2 text-slate-400"/>Prioritas
            </label>
            <select 
              className="glass-input"
              value={form.priority}
              onChange={(e) => setForm({...form, priority: e.target.value})}
            >
              <option value="LOW">Rendah (Santai)</option>
              <option value="MEDIUM">Sedang (Standar)</option>
              <option value="HIGH">Tinggi (Mendesak!)</option>
            </select>
          </div>
        </div>

        <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-3 mt-4 text-lg">
          {loading ? (
             <span className="animate-pulse flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin"/> AI Sedang Meracik Strategi...</span>
          ) : (
            <><Plus className="w-6 h-6"/> Eksekusi dengan AI</>
          )}
        </button>
      </form>

      {/* Hasil AI */}
      {result && result.subTasks && result.subTasks.length > 0 && (
        <div className="mt-10 animate-fade-in bg-dark-900/40 p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent-500" />
            Rencana Mikro (Micro-steps) Berhasil Dibuat
          </h3>
          <div className="space-y-4">
            {result.subTasks.map((task, idx) => (
              <div key={idx} className="bg-dark-800/80 p-5 rounded-xl border border-white/5 flex items-start justify-between gap-4 group hover:border-primary-500/50 hover:bg-dark-800 transition-all shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0 border border-white/10 group-hover:border-primary-500 group-hover:text-primary-400 transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-slate-100 font-medium text-lg mb-1">{task.title}</p>
                    {task.estimatedHours && (
                      <span className="inline-block bg-primary-500/20 text-primary-300 text-xs px-3 py-1 rounded-full font-medium">
                        Estimasi: {task.estimatedHours} Jam
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
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
