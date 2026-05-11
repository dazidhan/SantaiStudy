import React from 'react';
import TaskBreaker from '../components/TaskBreaker';
import toast from 'react-hot-toast';

export default function Tasks() {
  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center px-margin-page bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">Tugas Saya</h2>
          <div className="h-6 w-[1px] bg-outline-variant mx-2 hidden md:block"></div>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant focus-within:ring-2 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-64 placeholder:text-outline-variant outline-none ml-2" placeholder="Cari tugas..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast('Fitur notifikasi belum tersedia', { icon: '🔔' })} className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button onClick={() => toast.success('Formulir tambah tugas dibuka (Mock)')} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
            <span className="material-symbols-outlined">add</span> Tambah Tugas
          </button>
        </div>
      </header>
      
      <div className="p-margin-page max-w-7xl mx-auto space-y-6 pb-stack-lg">
        {/* Filters & CTA Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-surface-container px-1 py-1 rounded-xl w-fit">
            <button className="px-6 py-2 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md transition-all">Semua</button>
            <button className="px-6 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md transition-all">Belum Selesai</button>
            <button className="px-6 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md transition-all">Selesai</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 text-body-sm pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none">
                <option>Semua Kategori</option>
                <option>Akademik</option>
                <option>Project</option>
                <option>Personal</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
            </div>
          </div>
        </div>

        {/* TaskBreaker Integration */}
        <div className="mb-8">
           <TaskBreaker />
        </div>

        {/* Task Board / Table Container (Dummy Data from HTML) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant w-12 text-center">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                  </th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant">Tugas</th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant">Kategori</th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant">Deadline</th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant">Prioritas</th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 text-center">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-label-md text-on-surface">Desain Database Aplikasi PPL</p>
                      <p className="text-body-sm text-outline">Kelompok 4 - Skema Relasional</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/10 text-secondary font-label-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Akademik
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">event</span> 25 Mei 2024
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-error-container/30 text-error font-label-sm">Penting</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit_square</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 text-center">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" defaultChecked />
                  </td>
                  <td className="px-6 py-5">
                    <div className="opacity-60 line-through">
                      <p className="font-label-md text-on-surface">Membaca Jurnal Deep Learning</p>
                      <p className="text-body-sm text-outline">Paper: Attention is All You Need</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/10 text-secondary font-label-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Akademik
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-body-sm text-outline">
                      <span className="material-symbols-outlined text-lg">check_circle</span> Selesai
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm">Rendah</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit_square</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
            <p className="text-body-sm text-on-surface-variant">Menampilkan 2 dari 12 tugas</p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-body-sm font-label-md">1</button>
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Productivity Insight Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              <span className="text-label-sm text-outline">+12% dari minggu lalu</span>
            </div>
            <div>
              <h4 className="text-headline-sm font-bold text-on-surface">85% Selesai</h4>
              <p className="text-body-sm text-outline mt-1">Kamu sangat produktif hari ini! Teruskan momentumnya.</p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%] rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-secondary-container/20 to-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-secondary font-label-md">
              <span className="material-symbols-outlined text-lg">smart_toy</span> Saran AI
            </div>
            <p className="text-body-md text-on-surface-variant italic">"Gunakan fitur <b>Pecah Tugas AI</b> di atas untuk memecah tugas besar menjadi bagian-bagian yang lebih kecil."</p>
            <button className="mt-auto pt-4 text-secondary font-label-md flex items-center gap-1 hover:underline w-fit">
              Gunakan Sekarang <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </button>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div>
              <h4 className="font-label-md text-on-surface">Mood Hari Ini</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-primary text-3xl">mood</span>
                <span className="text-headline-sm font-bold text-primary">Semangat!</span>
              </div>
            </div>
            <p className="text-body-sm text-outline mt-2">Mood yang baik meningkatkan fokus belajarmu hingga 30%.</p>
            <div className="absolute -bottom-4 -right-4 opacity-5">
              <span className="material-symbols-outlined text-[100px]">auto_awesome</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contextual FAB */}
      <button onClick={() => toast.success('Formulir tugas baru (Mock)')} className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 group">
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">add</span>
        <div className="absolute right-16 px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-lg text-label-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Buat Tugas Baru
        </div>
      </button>
    </>
  );
}
