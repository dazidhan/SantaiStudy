import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [xp, setXp] = useState(150);
  const [level, setLevel] = useState(1);

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
          <div className="hover:bg-surface-container-low rounded-full p-2 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </div>
          <div className="hover:bg-surface-container-low rounded-full p-2 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">help_outline</span>
          </div>
        </div>
      </header>

      {/* Page Content Scrollable Area */}
      <div className="pt-24 pb-12 px-margin-page">
        {/* Hero Welcome Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-1">Halo, Andi! 👋</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Semangat belajar hari ini! Kamu hebat.</p>
          </div>
          <div className="text-right">
             <div className="inline-flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="font-label-md text-secondary">Level {level}</span>
                <span className="text-secondary/50 mx-1">•</span>
                <span className="font-label-md text-secondary">{xp} XP</span>
             </div>
          </div>
        </div>

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Stats Summary Row */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Tugas Hari Ini</p>
                  <p className="text-headline-md font-bold text-on-surface">5</p>
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
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">alarm</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Deadline Dekat</p>
                  <p className="text-headline-md font-bold text-on-surface">3</p>
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
                  <p className="text-headline-md font-bold text-on-surface">12</p>
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
                <p className="text-label-sm opacity-80 mb-1">Fokus Hari Ini</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-[40px] font-bold">85%</p>
                  <p className="text-label-md font-normal opacity-90">Fokus bagus! 🔥</p>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full mb-4">
                  <div className="bg-white h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <Link to="/mood" className="inline-block text-label-md bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  Detail Fokus
                </Link>
              </div>
              {/* Background Pattern */}
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">psychology</span>
              </div>
            </div>
          </div>

          {/* Main Section: Next Tasks & Schedule */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
            {/* Task List Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex-1">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Tugas Berikutnya</h4>
                <Link to="/tasks" className="text-label-md text-primary hover:underline">Lihat semua</Link>
              </div>
              <div className="divide-y divide-outline-variant">
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-primary-container flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-on-surface">Desain Database Aplikasi PPL</h5>
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> Esok • 09:00 - 11:30
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase">Penting</span>
                </div>
                
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center text-outline group-hover:border-primary-container group-hover:text-primary-container transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">radio_button_unchecked</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-on-surface">Membuat REST API</h5>
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 23 Mei • 13:00 - 15:45
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold rounded-full uppercase">Sedang</span>
                </div>
                
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center text-outline group-hover:border-primary-container group-hover:text-primary-container transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">radio_button_unchecked</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-on-surface">Membuat UI Login &amp; Dashboard</h5>
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 25 Mei • 10:00 - 12:00
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-full uppercase">Rendah</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Schedule & AI */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
            {/* Schedule Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Jadwal Hari Ini</h4>
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
              </div>
              <div className="p-6 space-y-6 relative">
                {/* Timeline line */}
                <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-outline-variant"></div>
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="text-label-sm text-on-surface-variant w-8 pt-1 text-right">08:00</div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-surface-container-lowest mt-2 shrink-0"></div>
                  <div className="flex-1 bg-primary/5 p-3 rounded-xl border-l-4 border-primary">
                    <h6 className="font-label-md text-on-surface">Belajar Materi AI</h6>
                    <p className="text-label-sm text-on-surface-variant">08.00 - 09.30</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="text-label-sm text-on-surface-variant w-8 pt-1 text-right">10:00</div>
                  <div className="w-4 h-4 rounded-full bg-secondary border-4 border-surface-container-lowest mt-2 shrink-0"></div>
                  <div className="flex-1 bg-secondary/5 p-3 rounded-xl border-l-4 border-secondary">
                    <h6 className="font-label-md text-on-surface">Desain Database PPL</h6>
                    <p className="text-label-sm text-on-surface-variant">10.00 - 12.00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 relative z-10 opacity-60">
                  <div className="text-label-sm text-on-surface-variant w-8 pt-1 text-right">12:00</div>
                  <div className="w-4 h-4 rounded-full bg-outline border-4 border-surface-container-lowest mt-2 shrink-0"></div>
                  <div className="flex-1 bg-surface-container-low p-3 rounded-xl border-l-4 border-outline">
                    <h6 className="font-label-md text-on-surface">Istirahat</h6>
                    <p className="text-label-sm text-on-surface-variant">12.00 - 13.00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="text-label-sm text-on-surface-variant w-8 pt-1 text-right">13:00</div>
                  <div className="w-4 h-4 rounded-full bg-tertiary border-4 border-surface-container-lowest mt-2 shrink-0"></div>
                  <div className="flex-1 bg-tertiary/5 p-3 rounded-xl border-l-4 border-tertiary">
                    <h6 className="font-label-md text-on-surface">Membaca Jurnal</h6>
                    <p className="text-label-sm text-on-surface-variant">13.00 - 14.30</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Link to="/calendar" className="block text-center w-full py-2 text-label-md text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                    Lihat kalender
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
                <h4 className="font-label-md">Rekomendasi AI Untukmu</h4>
              </div>
              <div className="mb-4">
                <p className="text-label-sm font-bold text-on-surface mb-1">Fokus Tinggi Terdeteksi!</p>
                <p className="text-body-sm text-on-surface-variant">Kamu dalam kondisi terbaik hari ini. Waktunya mengerjakan tugas yang butuh fokus tinggi seperti:</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-body-sm text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  Menyelesaikan Desain Database
                </li>
                <li className="flex items-start gap-2 text-body-sm text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  Membuat Dokumentasi API
                </li>
                <li className="flex items-start gap-2 text-body-sm text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  Membaca Materi Deep Learning
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-primary border border-primary/20 rounded-xl font-label-md shadow-sm hover:shadow transition-shadow">
                Lihat semua rekomendasi
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contextual FAB */}
      <button onClick={() => toast('Menu Tambah Cepat dibuka', { icon: '✨' })} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </>
  );
}
