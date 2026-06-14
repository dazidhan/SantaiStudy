import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';

export default function DocumentAI() {
  const [lastUpload, setLastUpload] = useState(null);

  return (
    <>
      {/* Top App Bar */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] bg-surface/80 backdrop-blur-md z-10 flex justify-between items-center px-margin-page border-b border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-on-surface">Dokumen AI</h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-sm w-64 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="Cari tugas, materi, dll..." type="text"/>
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
              <h3 className="font-headline-sm text-headline-sm mb-2 text-center text-on-surface font-bold">Tukang Baca Otomatis</h3>
              <p className="text-body-md text-on-surface-variant mb-6 text-center max-w-md mx-auto">
                AI akan membantu mengekstrak informasi penting, jadwal, dan tugas dari dokumen Anda secara instan.
              </p>
              
              <DocumentUpload onUploadSuccess={(data) => setLastUpload(data)} />
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-stack-md">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <h4 className="font-label-md text-on-surface font-bold mb-1">1. Upload Dokumen</h4>
                <p className="text-body-sm text-on-surface-variant">Unggah file gambar silabus atau materi kuliah Anda.</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <h4 className="font-label-md text-on-surface font-bold mb-1">2. AI Ekstraksi</h4>
                <p className="text-body-sm text-on-surface-variant">AI membaca dan meringkas poin utama jadi Markdown.</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                </div>
                <h4 className="font-label-md text-on-surface font-bold mb-1">3. Mudah Disalin</h4>
                <p className="text-body-sm text-on-surface-variant">Poin-poin bisa langsung disalin untuk tugas.</p>
              </div>
            </div>
          </div>

          {/* Right: Last Extraction Result (Bento Column 4) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-outline-variant shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Hasil Ekstraksi Terakhir</h3>
              </div>
              
              {lastUpload ? (
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-label-md text-on-surface font-semibold truncate" title={lastUpload.filename}>
                        {lastUpload.filename}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Selesai diekstrak</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Teks Ditemukan</h5>
                    <p className="text-body-sm text-on-surface-variant line-clamp-4 italic">
                      "{lastUpload.raw_text_preview}"
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Entitas Penting (NLP)</h5>
                    {lastUpload.extracted_entities && lastUpload.extracted_entities.length > 0 ? (
                      <ul className="space-y-2">
                        {lastUpload.extracted_entities.map((ent, i) => (
                          <li key={i} className="flex items-center gap-2 text-body-sm text-on-surface font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                            <span className="truncate">{ent.text}</span>
                            <span className="text-xs text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant">
                              {ent.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-on-surface-variant">Tidak ada entitas khusus yang dideteksi.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-outline text-5xl mb-4">cloud_upload</span>
                  <p className="text-sm text-on-surface-variant font-medium max-w-[200px]">
                    Belum ada dokumen yang diunggah. Unggah berkas di sebelah kiri untuk menganalisis silabus.
                  </p>
                </div>
              )}

              <div className="p-6 bg-surface-container-low border-t border-outline-variant">
                <p className="text-center text-xs text-outline mb-2">Unggah file gambar atau PDF untuk memproses.</p>
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
