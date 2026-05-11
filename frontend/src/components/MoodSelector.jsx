import React, { useState } from 'react';
import { apiClient, DUMMY_USER_ID } from '../api/axiosClient';
import { Battery, BatteryLow, BatteryWarning, Brain, Zap } from 'lucide-react';

const MOODS = [
  { id: 'TIRED', label: 'Lelah / Burnout', icon: BatteryLow, color: 'text-rose-400', bg: 'hover:bg-rose-500/10 border-rose-500/20' },
  { id: 'STRESSED', label: 'Stres / Panik', icon: BatteryWarning, color: 'text-orange-400', bg: 'hover:bg-orange-500/10 border-orange-500/20' },
  { id: 'NEUTRAL', label: 'Biasa Saja', icon: Battery, color: 'text-slate-400', bg: 'hover:bg-slate-500/10 border-slate-500/20' },
  { id: 'FOCUSED', label: 'Sangat Fokus', icon: Brain, color: 'text-blue-400', bg: 'hover:bg-blue-500/10 border-blue-500/20' },
  { id: 'ENERGIZED', label: 'Penuh Energi', icon: Zap, color: 'text-yellow-400', bg: 'hover:bg-yellow-500/10 border-yellow-500/20' },
];

export default function MoodSelector() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleMoodSelect = async (moodId) => {
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await apiClient.post('/tasks/suggest', {
        userId: DUMMY_USER_ID,
        mood: moodId
      });
      setSuggestion(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat rekomendasi AI. Pastikan Backend & MongoDB sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Hiasan Dekoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Bagaimana Perasaanmu Hari Ini?</h2>
        <p className="text-slate-400 mb-8">Pilih kondisimu, dan Asisten AI akan meracik strategi tugas yang paling ramah untuk beban kerjamu.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {MOODS.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border bg-dark-900/40 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg ${m.bg}`}
              >
                <Icon className={`w-10 h-10 mb-4 ${m.color}`} />
                <span className="text-sm font-semibold text-slate-200">{m.label}</span>
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="text-center py-10">
            <Brain className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-pulse-slow" />
            <p className="text-primary-400 font-medium">Psikolog AI sedang menganalisis ritme kerjamu...</p>
          </div>
        )}

        {suggestion && suggestion.recommendedTaskIds && (
          <div className="bg-gradient-to-br from-primary-900/40 to-dark-900/60 border border-primary-500/30 rounded-2xl p-6 md:p-8 mt-8 animate-slide-up shadow-xl shadow-primary-900/20">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg shadow-primary-500/40 shrink-0">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Saran Strategi AI</h3>
                <p className="text-slate-200 leading-relaxed text-lg italic bg-dark-900/50 p-4 rounded-xl border border-white/5">
                  "{suggestion.reason}"
                </p>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3 block">Target Eksekusi:</span>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestion.recommendedTaskIds.map(id => (
                      <div key={id} className="bg-dark-800/80 px-5 py-4 rounded-xl font-mono text-sm text-slate-300 border border-white/5 flex items-center justify-between group hover:border-primary-500/50 transition-colors">
                        <span>[Tugas ID: {id}]</span>
                        <button className="text-primary-400 text-xs uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Kerjakan</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
