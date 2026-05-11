import React from 'react';
import DocumentUpload from '../components/DocumentUpload';

export default function DocumentAI() {
  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] bg-surface/80 backdrop-blur-md z-10 flex justify-between items-center px-margin-page border-b border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-on-surface">Dokumen AI</h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-sm w-64 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="Cari tugas, materi, dll..." type="text"/>
          </div>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-outline">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:bg-surface-container-low rounded-full p-2 text-outline">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="pt-24 px-margin-page pb-stack-lg">
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left: Upload Section (Bento Column 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-gutter">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-outline-variant">
              <button className="pb-3 border-b-2 border-primary text-primary font-label-md">Upload &amp; Ekstraksi</button>
              <button className="pb-3 text-on-surface-variant font-body-md hover:text-primary transition-colors">Dokumen Saya</button>
            </div>
            
            {/* Integrated Existing Upload Component */}
            <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
              <h3 className="font-headline-sm text-headline-sm mb-2 text-center">Tukang Baca Otomatis</h3>
              <p className="text-body-md text-on-surface-variant mb-6 text-center max-w-md mx-auto">
                AI akan membantu mengekstrak informasi penting, jadwal, dan tugas dari dokumen Anda.
              </p>
              
              <DocumentUpload />
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-stack-md">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <h4 className="font-label-md text-on-surface mb-1">1. Upload Dokumen</h4>
                <p className="text-body-sm text-on-surface-variant">Unggah file gambar silabus atau materi kuliah Anda.</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <h4 className="font-label-md text-on-surface mb-1">2. AI Ekstraksi</h4>
                <p className="text-body-sm text-on-surface-variant">AI membaca dan meringkas poin utama jadi Markdown.</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                </div>
                <h4 className="font-label-md text-on-surface mb-1">3. Mudah Disalin</h4>
                <p className="text-body-sm text-on-surface-variant">Poin-poin bisa langsung disalin untuk tugas.</p>
              </div>
            </div>
          </div>

          {/* Right: Last Extraction Result Placeholder (Bento Column 4) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-outline-variant shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-headline-sm text-headline-sm">Hasil Dummy Terakhir</h3>
                <button className="text-primary hover:bg-primary-container/10 p-1 rounded-lg">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-6 opacity-60 pointer-events-none grayscale">
                <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-on-surface">Silabus_Pemrograman.pdf</h4>
                    <p className="text-body-sm text-outline">Diunggah: 20 Mei 2024</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-label-sm font-bold text-outline uppercase tracking-wider mb-4">Deadline Terdeteksi</h5>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <div className="flex-1">
                        <p className="text-body-sm font-medium">Tugas 1: 25 Mei 2024</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 bg-surface-container-low border-t border-outline-variant">
                <p className="text-center text-xs text-outline mb-2">Lihat hasil ringkasan di panel utama.</p>
                <button disabled className="w-full py-2.5 bg-white border border-outline text-primary font-label-md rounded-xl opacity-50">
                  Lihat Detail Ekstraksi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAB for mobile */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center lg:hidden z-30 active:scale-90 transition-transform">
        <span className="material-symbols-outlined">add</span>
      </button>
    </>
  );
}
