import React from 'react';

export default function Stats() {
  return (
    <>
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-page">
        <h2 className="font-headline-md text-headline-md text-on-surface">Statistik</h2>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center focus-within:ring-2 focus-within:ring-primary rounded-full bg-surface-container-low px-4 py-2 w-64 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none" placeholder="Cari data..." type="text"/>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="pt-24 px-margin-page pb-stack-lg">
        {/* Key Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-on-surface-variant font-label-sm">Total Belajar</p>
              <span className="material-symbols-outlined text-primary bg-primary-container/10 p-2 rounded-lg">schedule</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">12.5 <span className="text-body-md font-normal text-on-surface-variant">jam</span></p>
            <p className="text-body-sm text-secondary mt-2 flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +15% dari minggu lalu
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-on-surface-variant font-label-sm">Tugas Selesai</p>
              <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed p-2 rounded-lg">check_circle</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">18 <span className="text-body-md font-normal text-on-surface-variant">tugas</span></p>
            <p className="text-body-sm text-secondary mt-2 flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              80% target tercapai
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-on-surface-variant font-label-sm">Produktivitas</p>
              <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-2 rounded-lg">bolt</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">85%</p>
            <div className="w-full bg-surface-container-high h-2 rounded-full mt-4">
              <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-on-surface-variant font-label-sm">Streak</p>
              <span className="material-symbols-outlined text-error bg-error-container p-2 rounded-lg">local_fire_department</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">7 <span className="text-body-md font-normal text-on-surface-variant">hari</span></p>
            <p className="text-body-sm text-on-surface-variant mt-2">Bagus! Pertahankan ritme ini.</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-12 gap-6">
          {/* Main Line Chart */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Grafik Fokus</h3>
                <p className="text-body-sm text-on-surface-variant">Intensitas belajar harian selama seminggu terakhir</p>
              </div>
              <select className="bg-surface-container-low border-none rounded-lg text-body-sm focus:ring-primary outline-none">
                <option>Mingguan</option>
                <option>Bulanan</option>
              </select>
            </div>
            <div className="h-64 w-full relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-4 pb-8">
                <div className="absolute inset-0 border-b border-outline-variant grid grid-rows-4 w-full h-full">
                  <div className="border-t border-dashed border-outline-variant/30"></div>
                  <div className="border-t border-dashed border-outline-variant/30"></div>
                  <div className="border-t border-dashed border-outline-variant/30"></div>
                  <div className="border-t border-dashed border-outline-variant/30"></div>
                </div>
                <svg className="absolute inset-0 w-full h-full overflow-hidden" preserveAspectRatio="none">
                  <path d="M0,180 Q100,140 200,160 T400,100 T600,60 T800,120 T1000,40" fill="none" stroke="url(#gradient-line)" strokeLinecap="round" strokeWidth="4"></path>
                  <defs>
                    <linearGradient id="gradient-line" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.2 }}></stop>
                      <stop offset="50%" style={{ stopColor: '#6366f1', stopOpacity: 1 }}></stop>
                      <stop offset="100%" style={{ stopColor: '#4648d4', stopOpacity: 0.8 }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="z-10 text-label-sm text-on-surface-variant">Sen</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Sel</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Rab</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Kam</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Jum</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Sab</div>
                <div className="z-10 text-label-sm text-on-surface-variant">Min</div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Distribusi Tugas</h3>
            <p className="text-body-sm text-on-surface-variant mb-8">Berdasarkan tingkat prioritas</p>
            <div className="flex-grow flex items-center justify-center relative mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" fill="none" r="70" stroke="#f1f5f9" strokeWidth="20"></circle>
                  <circle cx="50%" cy="50%" fill="none" r="70" stroke="#4648d4" strokeDasharray="440" strokeDashoffset="176" strokeLinecap="round" strokeWidth="20"></circle>
                  <circle cx="50%" cy="50%" fill="none" r="70" stroke="#8792fe" strokeDasharray="440" strokeDashoffset="352" strokeLinecap="round" strokeWidth="20"></circle>
                  <circle cx="50%" cy="50%" fill="none" r="70" stroke="#ffdcc5" strokeDasharray="440" strokeDashoffset="418" strokeLinecap="round" strokeWidth="20"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-headline-md font-bold text-on-surface">20</p>
                  <p className="text-label-sm text-on-surface-variant">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-body-sm text-on-surface">Penting</span>
                </div>
                <span className="text-label-md">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                  <span className="text-body-sm text-on-surface">Sedang</span>
                </div>
                <span className="text-label-md">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed"></div>
                  <span className="text-body-sm text-on-surface">Rendah</span>
                </div>
                <span className="text-label-md">15%</span>
              </div>
            </div>
          </div>

          {/* Bottom Insight Cards */}
          <div className="col-span-12 md:col-span-6 bg-primary-container text-on-primary-container p-6 rounded-2xl flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h4 className="font-label-md text-lg mb-1">Analisis Belajar Kamu</h4>
              <p className="text-body-sm opacity-90">Kamu paling produktif di hari Selasa pukul 10:00 - 14:00. Pertahankan konsistensi ini!</p>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-6 bg-surface-container-high p-6 rounded-2xl border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img className="w-12 h-12 rounded-full object-cover border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqGMHnYM2vBemYi2sEMn-XVZxC_uEvPOfcBNzmGOrHzotMFkn473hoJBtGT7y3KvZA_dDbVavZMer_y734Re14lj2eaC0fOSKfspiWEH6MClsJRr3-XcFqpeP_GhwVEHn-V23UEb8ppmEBgOyCmdcmGZqQXbXcNxK8hVb_BxFwrqikkvGebVz_AXHE7DQXVluSx993bavlC2Rq-3w-ZZg3OjcwV4B7YpuO-S5o9CTaJeU2-9LuCEIDbswoUeQk-ZyPHXGaybfAf5c" alt="Workspace" />
              <div>
                <p className="font-label-md text-on-surface">Tantangan Minggu Ini</p>
                <p className="text-body-sm text-on-surface-variant">Selesaikan 5 modul Dokumen AI</p>
              </div>
            </div>
            <button className="bg-white text-primary px-4 py-2 rounded-lg font-label-sm border border-outline-variant hover:bg-primary hover:text-white transition-all">
              Ikuti
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
