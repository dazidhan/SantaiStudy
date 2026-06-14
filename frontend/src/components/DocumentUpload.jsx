import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function DocumentUpload({ onUploadSuccess }) {
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
      if (onUploadSuccess) {
        onUploadSuccess({
          ...res.data.data,
          filename: file.name,
          uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        });
      }
      toast.success("Dokumen berhasil dibaca!", { id: "ocr_toast" });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengekstrak dokumen. Pastikan Python OCR menyala.", { id: "ocr_toast" });
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary hover:bg-surface-container-low/50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary animate-bounce' : 'text-on-surface-variant'}`} />
        {
          isDragActive ?
            <p className="text-primary font-medium">Lepaskan file di sini...</p> :
            <p className="text-on-surface-variant font-medium">Tarik & lepas file (PDF/IMG) ke sini, atau <span className="text-primary underline">klik untuk memilih file</span></p>
        }
      </div>

      {result && (
        <div className="mt-6 bg-surface-container-low p-5 rounded-2xl border border-outline-variant animate-fade-in">
          <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary"/> Teks Diekstrak</h3>
          <div className="bg-surface-container-lowest p-4 rounded-xl text-sm text-on-surface-variant mb-4 max-h-40 overflow-y-auto font-mono whitespace-pre-wrap border border-outline-variant">
            {result.raw_text_preview}
          </div>
          
          <div className="mt-4 pt-4 border-t border-outline-variant">
             <h4 className="font-semibold text-on-surface mb-3 text-sm">Target/Tanggal Terdeteksi (NLP):</h4>
             {result.extracted_entities && result.extracted_entities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.extracted_entities.map((ent, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-container/30 text-primary rounded-full text-xs font-bold border border-primary/20">
                      {ent.text} <span className="opacity-70 font-normal">({ent.label})</span>
                    </span>
                  ))}
                </div>
             ) : (
                <p className="text-on-surface-variant text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Belum ada tanggal mematikan (deadline) yang terdeteksi.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
