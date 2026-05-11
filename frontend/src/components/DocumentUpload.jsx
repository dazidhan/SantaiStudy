import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function DocumentUpload() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.loading("Membaca dokumen menggunakan AI Vision...", { id: "ocr_toast" });
      const res = await apiClient.post('/documents/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
      toast.success("Dokumen berhasil dibaca!", { id: "ocr_toast" });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengekstrak dokumen. Pastikan Python OCR menyala.", { id: "ocr_toast" });
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="bg-blue-500/20 p-2 rounded-xl">
          <FileText className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Tukang Baca Otomatis (OCR)</h2>
          <p className="text-sm text-slate-400">Serahkan silabus/jadwalmu, biar AI yang merangkumnya</p>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-400 animate-bounce' : 'text-slate-500'}`} />
        {
          isDragActive ?
            <p className="text-blue-300 font-medium">Lepaskan file di sini...</p> :
            <p className="text-slate-400 font-medium">Tarik & lepas file (PDF/IMG) ke sini, atau <span className="text-blue-400 underline">klik untuk memilih file</span></p>
        }
      </div>

      {result && (
        <div className="mt-6 bg-dark-900/60 p-5 rounded-2xl border border-white/5 animate-fade-in">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400"/> Teks Diekstrak</h3>
          <div className="bg-dark-800 p-4 rounded-xl text-sm text-slate-300 mb-4 max-h-40 overflow-y-auto font-mono whitespace-pre-wrap border border-white/5">
            {result.raw_text_preview}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
             <h4 className="font-semibold text-slate-200 mb-3 text-sm">Target/Tanggal Terdeteksi (NLP):</h4>
             {result.extracted_entities && result.extracted_entities.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {result.extracted_entities.map((ent, i) => (
                   <span key={i} className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
                     {ent.text} <span className="opacity-50 font-normal">({ent.label})</span>
                   </span>
                 ))}
               </div>
             ) : (
               <p className="text-slate-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Belum ada tanggal mematikan (deadline) yang terdeteksi.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
