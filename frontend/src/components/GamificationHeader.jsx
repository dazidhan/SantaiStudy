import React from 'react';
import { Trophy, Star } from 'lucide-react';

export default function GamificationHeader({ xp, level }) {
  const maxXP = level * 1000;
  const progressPercentage = Math.min(100, (xp / maxXP) * 100);

  return (
    <div className="glass-card p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in border-accent-500/30 shadow-accent-900/20">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-accent-400 to-accent-600 p-3 rounded-full shadow-lg shadow-accent-500/40">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Level {level} 
            <span className="text-xs px-2 py-1 bg-accent-900/50 text-accent-400 rounded-md uppercase tracking-wider font-bold">
              {level < 3 ? "Procrastinator" : level < 6 ? "Time Manager" : "Master of Time"}
            </span>
          </h2>
          <p className="text-sm text-slate-400">Selesaikan sub-tugas untuk naik level dan buka pencapaian!</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md">
        <div className="flex justify-between text-sm font-semibold mb-2">
          <span className="text-accent-400 flex items-center gap-1"><Star className="w-4 h-4"/> {xp} XP</span>
          <span className="text-slate-500">{maxXP} XP</span>
        </div>
        <div className="h-3 w-full bg-dark-900/80 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
