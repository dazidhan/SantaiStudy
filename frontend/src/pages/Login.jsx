import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, saveUser } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/users/login', {
        email: form.email,
        password: form.password
      });
      saveUser(res.data.data);
      toast.success(`Selamat datang, ${res.data.data.name}! 🎉`);
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth-bg min-h-screen w-full flex items-center justify-center p-4 md:p-0 font-sans text-auth-on-surface">
      <main className="w-full max-w-[1440px] min-h-[90vh] md:min-h-screen grid grid-cols-1 md:grid-cols-[40%_60%] bg-auth-surface rounded-3xl md:rounded-none overflow-hidden shadow-2xl md:shadow-none">
        {/* Left Column: Brand & Illustration */}
        <section className="bg-auth-lavender p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <span className="material-symbols-outlined text-auth-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <span className="text-2xl text-auth-primary font-bold">SantaiStudy</span>
            </div>
            <div className="max-w-md">
              <h1 className="text-4xl md:text-5xl text-auth-on-surface mb-6 leading-tight font-bold">
                Belajar Teratur,<br />Hidup Lebih Santai
              </h1>
              <p className="text-lg text-auth-on-surface-var leading-relaxed">
                AI Assistant pribadi untuk membantu kamu mengelola tugas, jadwal, dan belajar lebih efektif tanpa stres.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex justify-center mt-8 md:mt-0">
            <div className="w-full max-w-[420px] aspect-square relative">
              <img alt="Student studying with laptop" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4UYsXMtjfDAqe8HYxLz6nBmw-F5jVn2AvHNReKcVik5mY38aNiQSNtME0typYcZCT4XnQxFhSWURq1GfbyTr2fM0o0oV724Xe3rWlOmUUi9Tee5Q3Kgq3hKTwOw8HxfTs3Rd38lNWM0hAPNZG05IIyZp1U-KvWaHKGNNLqmXqHc1ykaaoG5smlu_932h34lSFLNNn4AZHZvU9r-QBVPcs_ooyi7_j6okeNDm3mtedvCpHDKJpOwE5UrMyIMiMU-jM1ECdmnbosl4" />
            </div>
          </div>

          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-auth-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-12 w-48 h-48 bg-auth-primary/5 rounded-full blur-2xl"></div>
        </section>

        {/* Right Column: Login Form */}
        <section className="bg-white flex flex-col items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-[440px]">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-auth-on-surface mb-2">Selamat Datang!</h2>
              <p className="text-base text-auth-on-surface-var">Masuk untuk melanjutkan ke akunmu</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-auth-on-surface block ml-1" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-auth-outline">alternate_email</span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-auth-bg border border-auth-outline-var rounded-xl focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all placeholder:text-auth-outline/50 text-auth-on-surface outline-none"
                    id="email"
                    placeholder="nama@email.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-auth-on-surface block ml-1" htmlFor="password">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-auth-outline">lock</span>
                  <input
                    className="w-full pl-12 pr-12 py-3.5 bg-auth-bg border border-auth-outline-var rounded-xl focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all placeholder:text-auth-outline/50 text-auth-on-surface outline-none"
                    id="password"
                    placeholder="Masukkan kata sandi"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-auth-outline hover:text-auth-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-auth-primary text-auth-on-primary rounded-xl text-lg font-semibold shadow-lg shadow-auth-primary/20 hover:opacity-90 active:scale-[0.99] transition-all duration-200 mt-2 flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin text-xl">refresh</span> Masuk...</>
                ) : 'Masuk'}
              </button>
            </form>

            <p className="mt-10 text-center text-base text-auth-on-surface-var">
              Belum punya akun? <Link className="text-sm font-semibold text-auth-primary hover:underline" to="/register">Daftar di sini</Link>
            </p>

            <footer className="mt-16 text-center">
              <p className="text-[11px] font-medium text-auth-outline">
                © 2024 SantaiStudy. Dirancang untuk produktivitas yang tenang.
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
