'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Play, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface SketsaRendererProps {
  colors: string[];
  paletteName: string;
}

export default function SketsaRenderer({ colors, paletteName }: SketsaRendererProps) {
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderResult, setRenderResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketchImage(reader.result as string);
        setRenderResult(null); // reset hasil sebelumnya jika ganti sketsa
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRender = async () => {
    if (!sketchImage) return;
    setIsRendering(true);

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sketchImage,
          colors,
          paletteName,
        }),
      });

      const data = await res.json();
      if (data.success && data.renderUrl) {
        setRenderResult(data.renderUrl);
      }
    } catch (err) {
      console.error('Render error:', err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="w-full mt-12 pt-12 border-t border-slate-200">
      <div className="flex flex-col items-center mb-8 text-center">
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-500" /> Uji Palet dengan AI Render
        </h3>
        <p className="text-slate-500 max-w-lg">
          Unggah sketsa desain (kamar, bangunan, furnitur) lalu biarkan AI merendernya menggunakan palet warna <strong>{paletteName}</strong> yang Anda buat di atas.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Upload Sketsa */}
        <div className="flex-1 flex flex-col relative rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 min-h-[300px]">
          {sketchImage ? (
            <div className="relative w-full h-full flex items-center justify-center group p-4">
              <img src={sketchImage} alt="Sketsa" className="max-w-full max-h-64 object-contain rounded-lg shadow-sm" />
              <button 
                onClick={() => setSketchImage(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Unggah Sketsa / Referensi</p>
                <p className="text-sm text-slate-500 mt-1">Klik atau drag & drop file JPG/PNG</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        </div>

        {/* Tombol Aksi */}
        <div className="w-full md:w-48 shrink-0 flex flex-col justify-center gap-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 text-center">
              Akan dirender dengan warna:
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {colors.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>

          <button 
            onClick={handleRender}
            disabled={!sketchImage || isRendering}
            className={`w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-md ${
              !sketchImage ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
              isRendering ? 'bg-slate-800 text-white cursor-wait' :
              'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-lg active:scale-95'
            }`}
          >
            {isRendering ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">Merender AI...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                <span className="text-xs uppercase tracking-wide">Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Hasil Render */}
        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative min-h-[300px]">
          {renderResult ? (
            <img src={renderResult} alt="Hasil Render" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-slate-400 p-6 flex flex-col items-center gap-3">
              <ImageIcon className="w-12 h-12 opacity-50" />
              <p className="font-medium">Hasil render AI akan muncul di sini</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
