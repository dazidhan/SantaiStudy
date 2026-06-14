import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient, getUserId, getCurrentUser, saveUser } from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const userId = getUserId();
  const currentUser = getCurrentUser();
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) { navigate('/login'); }
  }, [userId, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nama tidak boleh kosong'); return; }
    setSaving(true);
    try {
      const res = await apiClient.patch(`/users/${userId}`, { name: form.name });
      const updatedUser = res.data.data;
      // Update localStorage
      saveUser({ ...currentUser, ...updatedUser });
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header / Top Bar Shell */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-10 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-page border-b border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pengaturan</h2>
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
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors" onClick={() => toast('Fitur notifikasi segera hadir', { icon: '🔔' })}>
                    <span className="material-symbols-outlined">notifications_active</span>
                    <span>Notifikasi</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors" onClick={() => toast('Fitur preferensi segera hadir', { icon: '⚙️' })}>
                    <span className="material-symbols-outlined">tune</span>
                    <span>Preferensi</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-body-md flex items-center gap-3 transition-colors" onClick={() => toast('Fitur keamanan segera hadir', { icon: '🔒' })}>
                    <span className="material-symbols-outlined">security</span>
                    <span>Keamanan</span>
                  </button>
                </div>
              </div>

              {/* User Info Summary Card */}
              <div className="mt-4 bg-primary-container/20 border border-primary/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface truncate">{currentUser?.name || 'Pengguna'}</p>
                    <p className="text-xs text-on-surface-variant truncate">{currentUser?.email}</p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Bergabung sejak: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>
            </aside>

            {/* Profile Form (Right Column) */}
            <div className="col-span-12 lg:col-span-9">
              <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  {/* Avatar Column */}
                  <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-high text-primary font-bold text-5xl">
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm">{currentUser?.email}</p>
                  </div>

                  {/* Form Column */}
                  <div className="flex-1 w-full space-y-6">
                    <header className="mb-8">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Informasi Profil</h3>
                      <p className="text-body-sm text-on-surface-variant">Perbarui detail profil Anda agar AI dapat memberikan rekomendasi yang lebih personal.</p>
                    </header>

                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSave}>
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface-variant">Nama Lengkap</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface outline-none transition-all text-on-surface"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Nama lengkap Anda"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface-variant">Email</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low outline-none transition-all text-on-surface-variant cursor-not-allowed"
                          type="email"
                          value={form.email}
                          disabled
                          title="Email tidak dapat diubah"
                        />
                        <p className="text-xs text-on-surface-variant">Email tidak dapat diubah.</p>
                      </div>

                      <div className="pt-8 flex justify-end gap-4 border-t border-outline-variant mt-4">
                        <button
                          className="px-6 py-2.5 rounded-xl text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors"
                          type="button"
                          onClick={() => setForm({ name: currentUser?.name || '', email: currentUser?.email || '' })}
                        >
                          Batal
                        </button>
                        <button
                          className="px-8 py-2.5 rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary/90 shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
                          type="submit"
                          disabled={saving}
                        >
                          {saving ? <><span className="material-symbols-outlined animate-spin text-lg">refresh</span> Menyimpan...</> : 'Simpan Perubahan'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="mt-6 bg-error-container/10 border border-error/20 rounded-2xl p-6">
                <h3 className="font-headline-sm text-error mb-2">Zona Berbahaya</h3>
                <p className="text-body-sm text-on-surface-variant mb-4">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
                <button
                  onClick={() => toast.error('Hapus akun belum tersedia di prototipe ini.', { duration: 4000 })}
                  className="px-6 py-2.5 bg-error text-on-error rounded-xl font-label-md hover:opacity-90 transition-opacity"
                >
                  Hapus Akun
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
