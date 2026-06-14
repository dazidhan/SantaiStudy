import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, saveUser } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Semua field wajib diisi');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      saveUser(res.data.data);
      toast.success(`Akun berhasil dibuat! Selamat datang, ${res.data.data.name}! 🎉`);
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-auth-on-surface">
      <main className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Illustration and Branding (40% width) */}
        <section className="w-full md:w-[40%] bg-auth-surface-low p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-auth-primary text-[32px]">school</span>
              <h1 className="text-2xl text-auth-primary font-bold">SantaiStudy</h1>
            </div>
            <div className="max-w-[400px]">
              <h2 className="text-3xl font-bold text-auth-on-surface mb-2 leading-tight">Belajar Teratur,<br />Hidup Lebih Santai</h2>
              <p className="text-base text-auth-on-surface-var">AI Assistant pribadi untuk membantu kamu mengelola tugas, jadwal, dan belajar lebih efektif tanpa stres.</p>
            </div>
          </div>
          <div className="mt-8 relative flex justify-center items-center z-10 h-full">
            <img alt="SantaiStudy Illustration" className="w-full h-auto object-contain max-h-[500px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0eedGpzBpx2MpeXiPY2s_BWgVWEmrIO7UKOWEIXgr4R1YjBq60I6E9h4XVmyWjrgdHxP8qKMkiC7LJuT9mCCbw4Kk9ZAHMlrTRSUVar3l7sTvBGGWOG_4_uEl3MVfZHLXwUFfpGHYosQ22C9oTgQCpyDl_4HUxNUxdWy_VGihVYyC8eUJriS8p3PZwhAy6YgB1rd5ublbeFNKANdFqurPl8lAWSmNg8RI4zrJag3F_wCwYYMYk8BOTuPgGJhIRO3kg8EpxEG2Anw" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-auth-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-0 w-48 h-48 bg-auth-primary/10 rounded-full blur-2xl"></div>
        </section>

        {/* Right Column: Registration Form (60% width) */}
        <section className="w-full md:w-[60%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-[480px] mx-auto w-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-auth-on-surface mb-1">Buat Akun Baru</h3>
              <p className="text-sm text-auth-on-surface-var">Daftar untuk mulai perjalanan belajarmu.</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-auth-on-surface" htmlFor="full_name">Nama Lengkap</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-auth-outline group-focus-within:text-auth-primary transition-colors">person</span>
                  <input
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-auth-outline-var bg-white text-base focus:outline-none focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all text-auth-on-surface"
                    id="full_name"
                    placeholder="Masukkan nama lengkap"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-auth-on-surface" htmlFor="email">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-auth-outline group-focus-within:text-auth-primary transition-colors">mail</span>
                  <input
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-auth-outline-var bg-white text-base focus:outline-none focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all text-auth-on-surface"
                    id="email"
                    placeholder="nama@email.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-auth-on-surface" htmlFor="password">Kata Sandi</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-auth-outline group-focus-within:text-auth-primary transition-colors">lock</span>
                  <input
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-auth-outline-var bg-white text-base focus:outline-none focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all text-auth-on-surface"
                    id="password"
                    placeholder="Buat kata sandi (min. 6 karakter)"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-auth-on-surface" htmlFor="confirm_password">Konfirmasi Kata Sandi</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-auth-outline group-focus-within:text-auth-primary transition-colors">lock_reset</span>
                  <input
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-auth-outline-var bg-white text-base focus:outline-none focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all text-auth-on-surface"
                    id="confirm_password"
                    placeholder="Ulangi kata sandi"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-auth-primary hover:opacity-90 text-auth-on-primary font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
                type="submit"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin text-xl">refresh</span> Mendaftar...</>
                ) : 'Daftar'}
              </button>
            </form>

            <p className="mt-10 text-center text-base text-auth-on-surface-var">
              Sudah punya akun? <Link className="text-auth-primary font-bold hover:underline" to="/login">Masuk di sini</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
