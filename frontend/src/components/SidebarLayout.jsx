import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SidebarLayout() {
  const navItems = [
    { name: 'Beranda', path: '/dashboard', icon: 'dashboard' },
    { name: 'Tugas Saya', path: '/tasks', icon: 'task' },
    { name: 'Kalender', path: '/calendar', icon: 'calendar_month' },
    { name: 'Dokumen AI', path: '/document-ai', icon: 'description' },
    { name: 'Mood & Fokus', path: '/mood', icon: 'psychology' },
    { name: 'Statistik', path: '/stats', icon: 'bar_chart' },
    { name: 'Pengaturan', path: '/settings', icon: 'settings' },
  ];

  return (
    <div className="bg-background min-h-screen text-on-background flex">
      {/* Sidebar Navigation */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant shadow-sm z-20 flex flex-col py-stack-lg">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">SantaiStudy</h1>
            <p className="text-[10px] text-on-surface-variant leading-none uppercase tracking-widest mt-1">Relaxed Productivity</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-secondary-container/20 text-primary font-label-md border-l-4 border-primary px-4 py-3 flex items-center gap-3 transition-colors duration-200"
                  : "text-on-surface-variant font-body-md px-4 py-3 flex items-center gap-3 hover:bg-surface-container-low transition-colors duration-200"
              }
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="px-6 mt-auto">
          <button 
            onClick={() => {
              const focusPromise = new Promise((resolve) => setTimeout(resolve, 1500));
              toast.promise(focusPromise, {
                loading: 'Menyiapkan ruang fokus...',
                success: 'Fokus Session Dimulai! 🔥 Jangan lupa bernapas.',
                error: 'Gagal memulai sesi',
              });
            }}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-8 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">timer</span>
            Mulai Fokus Session
          </button>
          
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border-t border-outline-variant pt-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container shrink-0">
              <img alt="Andi Pratama" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgTqGUQkdOWBypTSN4LoWrirTCDxR4-FU2hcisiYG_0bo5b3swLNMyzKHMQJlGQcMwLLPC1ZPAtyhDPsbOnytxS-kpCYiTiIYCCMfmW_pcXZzGBFtAXtLXcwcvj7B6fKwJWQ3MSdAEguKA3g5F6ux3hRqDyx3WQ2FGZlWjpULwn4yNOkDfAtgsP_HIncl0YjVCESgS8aiIncJC7HIf2T4uGDeC3EAkHgM011ugTW3qtgL-AhG1o_RqAR6JkLkyykCkAI0k5HV30do" />
            </div>
            <div className="overflow-hidden">
              <p className="font-label-md text-on-surface truncate">Andi Pratama</p>
              <p className="text-[10px] text-on-surface-variant">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Outlet renders the child route components) */}
      <div className="flex-1 ml-[260px] w-[calc(100%-260px)] relative min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
