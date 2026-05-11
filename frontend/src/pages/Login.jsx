import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="bg-auth-bg min-h-screen w-full flex items-center justify-center p-4 md:p-0 font-sans text-auth-on-surface">
      <main className="w-full max-w-[1440px] min-h-[90vh] md:min-h-screen grid grid-cols-1 md:grid-cols-[40%_60%] bg-auth-surface rounded-3xl md:rounded-none overflow-hidden shadow-2xl md:shadow-none">
        {/* Left Column (40%): Brand & Illustration */}
        <section className="bg-auth-lavender p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <span className="material-symbols-outlined text-auth-primary text-4xl" data-icon="school" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
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
          
          {/* Illustration */}
          <div className="relative z-10 flex justify-center mt-8 md:mt-0">
            <div className="w-full max-w-[420px] aspect-square relative">
              <img alt="Student studying with laptop" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4UYsXMtjfDAqe8HYxLz6nBmw-F5jVn2AvHNReKcVik5mY38aNiQSNtME0typYcZCT4XnQxFhSWURq1GfbyTr2fM0o0oV724Xe3rWlOmUUi9Tee5Q3Kgq3hKTwOw8HxfTs3Rd38lNWM0hAPNZG05IIyZp1U-KvWaHKGNNLqmXqHc1ykaaoG5smlu_932h34lSFLNNn4AZHZvU9r-QBVPcs_ooyi7_j6okeNDm3mtedvCpHDKJpOwE5UrMyIMiMU-jM1ECdmnbosl4" />
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-auth-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-12 w-48 h-48 bg-auth-primary/5 rounded-full blur-2xl"></div>
        </section>
        
        {/* Right Column (60%): Login Form */}
        <section className="bg-white flex flex-col items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-[440px]">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-auth-on-surface mb-2">Selamat Datang!</h2>
              <p className="text-base text-auth-on-surface-var">Masuk untuk melanjutkan ke akunmu</p>
            </div>
            
            {/* Social Login */}
            <div className="space-y-4 mb-10">
              <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-auth-outline-var rounded-xl text-sm font-semibold text-auth-on-surface hover:bg-auth-bg transition-colors duration-200">
                <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyCwnkvosas9EFvKpI_ThK7ocFWqceWFnzzU2fiq2ImkL9rtdmCxTt9994qDOFeYx1Mt2RYN6p5qr8YJ-IcNht11bME4Tg97N4QjbdwBhyQG3MPQ_rMD4jIMBg7I0x8unmgo4SnoyAkZfAEXHov6lCUhfvzzcp_rBqGiqOeGwrTQZdSEzrzEZEUZG1ivy6cIzGxhHwQmOIZWgsd8u4bS8KjXWIVLjnh2DrmXG_jkBl7mhtGHJ0xZsTox9tGVToAuBGVScFsW_Q78o" />
                Masuk dengan Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-auth-outline-var rounded-xl text-sm font-semibold text-auth-on-surface hover:bg-auth-bg transition-colors duration-200">
                <span className="material-symbols-outlined text-auth-on-surface-var" data-icon="mail">mail</span>
                Masuk dengan Email
              </button>
            </div>
            
            {/* Divider */}
            <div className="relative flex items-center mb-10">
              <div className="flex-grow border-t border-auth-outline-var"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-auth-outline uppercase tracking-widest text-[10px]">ATAU</span>
              <div className="flex-grow border-t border-auth-outline-var"></div>
            </div>
            
            {/* Form Fields */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-auth-on-surface block ml-1" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-auth-outline" data-icon="alternate_email">alternate_email</span>
                  <input className="w-full pl-12 pr-4 py-3.5 bg-auth-bg border border-auth-outline-var rounded-xl focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all placeholder:text-auth-outline/50 text-auth-on-surface" id="email" placeholder="nama@email.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-auth-on-surface" htmlFor="password">Kata Sandi</label>
                  <a className="text-xs font-medium text-auth-primary hover:underline" href="#">Lupa kata sandi?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-auth-outline" data-icon="lock">lock</span>
                  <input className="w-full pl-12 pr-12 py-3.5 bg-auth-bg border border-auth-outline-var rounded-xl focus:ring-2 focus:ring-auth-primary/20 focus:border-auth-primary transition-all placeholder:text-auth-outline/50 text-auth-on-surface" id="password" placeholder="Masukkan kata sandi" type="password" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-auth-outline hover:text-auth-on-surface transition-colors" type="button">
                    <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-1">
                <input className="w-4 h-4 text-auth-primary border-auth-outline-var rounded focus:ring-auth-primary/20" id="remember" type="checkbox" />
                <label className="text-sm text-auth-on-surface-var select-none" htmlFor="remember">Ingat saya untuk 30 hari</label>
              </div>
              
              <Link to="/dashboard" className="w-full py-4 bg-auth-primary text-auth-on-primary rounded-xl text-lg font-semibold shadow-lg shadow-auth-primary/20 hover:opacity-90 active:scale-[0.99] transition-all duration-200 mt-2 flex justify-center items-center">
                Masuk
              </Link>
            </form>
            
            <p className="mt-10 text-center text-base text-auth-on-surface-var">
              Belum punya akun? <Link className="text-sm font-semibold text-auth-primary hover:underline" to="/register">Daftar di sini</Link>
            </p>
            
            {/* Footer */}
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
