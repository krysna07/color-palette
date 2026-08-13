'use client';

import React, { useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Sparkles, Loader2, Download, Maximize2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AIRenderPreview() {
  const { isRendering, renderResult, selectedPalette, controlNetStrength } = useStudioStore();
  const [isZoomed, setIsZoomed] = useState(false);

  // Default photorealistic architectural image if no render result yet
  const displayImage = renderResult || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90';

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = displayImage;
    link.download = `VibeColor_Realistic_Render_${selectedPalette.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex flex-col items-center justify-center group">
      
      {/* Top Glass Badge */}
      <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-800 text-xs font-bold flex items-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span>Hasil Render Fotorealistis AI (8K)</span>
      </div>

      {/* ControlNet Precision Status Badge */}
      <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-blue-200 rounded-full text-blue-700 text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        <span>ControlNet: {(controlNetStrength * 100).toFixed(0)}% Line Precision</span>
      </div>

      {isRendering ? (
        <div className="flex flex-col items-center gap-4 text-slate-900 z-20 p-8 text-center bg-white/95 rounded-2xl border border-slate-200 backdrop-blur-lg shadow-xl">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold tracking-wide text-slate-900">Membangun Render Fotorealistis...</h3>
            <p className="text-xs text-slate-500">ControlNet Depth & Lineart SDXL Pipeline Active</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={displayImage} 
            alt="Hasil Render Fotorealistis VibeColor.ai" 
            className={`w-full h-full object-cover transition-all duration-700 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-800">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tema: {selectedPalette.name} ({selectedPalette.material})
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Engine: VibeColor ControlNet 1.0 • PBR Textures & Natural Reflections
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all font-semibold flex items-center gap-1.5 text-slate-700 border border-slate-200"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {isZoomed ? 'Reset Zoom' : 'Inspect Detail'}
              </button>

              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Render (8K)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
