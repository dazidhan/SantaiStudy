import React from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  return (
    <>
      {/* Header / Top Bar Shell */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-10 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-page border-b border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pengaturan</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-body-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Cari tugas, materi..." type="text" />
          </div>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <div className="pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-margin-page pb-12">
          <div className="grid grid-cols-12 gap-gutter">
            {/* Settings Sub-Navigation (Left Column) */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                <div className="p-2 space-y-1">
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md flex items-center gap-3">
                    <span className="material-symbols-outlined">person</span>
                    <span>Profil</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined">notifications_active</span>
                    <span>Notifikasi</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined">tune</span>
                    <span>Preferensi</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined">security</span>
                    <span>Keamanan</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined">info</span>
                    <span>Tentang Aplikasi</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Profile Form (Right Column) */}
            <div className="col-span-12 lg:col-span-9">
              <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  {/* Avatar Column */}
                  <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                    <div className="relative group">
                      <img alt="Profile avatar of Andi Pratama" className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-high" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZymw3-Pggflj6P_PaygcVLN_t_LWrN8JHa8f-AJEgube5W7RMyzEDcxUmFvv644V6zWvbNlB5jcMuCs4BF0WJx5O07hI1v_k7TuZfCxihTUm7P2j0mBBOn6gasNLLYSGGp7g-bsEEXw8tXPS8SpPguUSzs8Y39-iXy9YEipVAKc8T79v8fNONOllgfOuk7N6_T5rkbiVNfdVt_2FL6CuvjwYEqMDNz2Yb1O9U-pUBBush6m8U9eQEz1IdcVGVX9MDXxxfh4XLAIM" />
                      <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </button>
                    </div>
                    <button className="text-primary font-label-md hover:underline">Ubah Foto</button>
                  </div>

                  {/* Form Column */}
                  <div className="flex-1 w-full space-y-6">
                    <header className="mb-8">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Informasi Profil</h3>
                      <p className="text-body-sm text-on-surface-variant">Perbarui detail profil Anda agar AI dapat memberikan rekomendasi yang lebih personal.</p>
                    </header>

                    <form className="grid grid-cols-1 gap-6" onSubmit={(e) => {
                      e.preventDefault();
                      const savePromise = new Promise((resolve) => setTimeout(resolve, 1500));
                      toast.promise(savePromise, {
                        loading: 'Menyimpan perubahan profil...',
                        success: 'Profil berhasil diperbarui!',
                        error: 'Gagal menyimpan profil',
                      });
                    }}>
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface-variant">Nama Lengkap</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface outline-none transition-all text-on-surface" type="text" defaultValue="Andi Pratama" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface-variant">Email</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface outline-none transition-all text-on-surface" type="email" defaultValue="andi@email.com" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-label-md text-on-surface-variant">Status</label>
                          <select className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface outline-none appearance-none text-on-surface" defaultValue="Mahasiswa">
                            <option value="Mahasiswa">Mahasiswa</option>
                            <option value="Dosen">Dosen</option>
                            <option value="Pelajar SMA">Pelajar SMA</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-md text-on-surface-variant">Jurusan</label>
                          <input className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface outline-none transition-all text-on-surface" type="text" defaultValue="Sistem Informasi" />
                        </div>
                      </div>
                      <div className="pt-8 flex justify-end gap-4 border-t border-outline-variant mt-4">
                        <button className="px-6 py-2.5 rounded-xl text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors" type="button">Batal</button>
                        <button className="px-8 py-2.5 rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary/90 shadow-md transition-all active:scale-95" type="submit">Simpan Perubahan</button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
