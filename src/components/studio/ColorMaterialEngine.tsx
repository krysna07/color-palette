'use client';

import React from 'react';
import { useStudioStore, COLOR_PALETTES, ColorPalette } from '@/store/useStudioStore';
import { Palette, Sparkles, Sun, Moon, Sunset, Zap, Check, Eye } from 'lucide-react';

const LIGHTING_MOODS = [
  { id: 'daylight', label: 'Daylight (Cahaya Alami)', icon: Sun, desc: 'Pencahayaan terang alami jam 10 pagi' },
  { id: 'sunset', label: 'Golden Hour (Sunset)', icon: Sunset, desc: 'Pencahayaan hangat sudut rendah' },
  { id: 'warm', label: 'Warm Ambient 2700K', icon: Moon, desc: 'Lampu gantung hangat malam hari' },
  { id: 'cyberpunk', label: 'Cyberpunk LED', icon: Zap, desc: 'Pencahayaan LED neon kontras tinggi' },
];

export default function ColorMaterialEngine() {
  const {
    selectedPalette, setSelectedPalette,
    wallColor, setWallColor,
    furnitureColor, setFurnitureColor,
    lightingMood, setLightingMood,
    customPrompt, setCustomPrompt
  } = useStudioStore();

  const handlePaletteSelect = (palette: ColorPalette) => {
    setSelectedPalette(palette);
  };

  return (
    <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col">
      
      {/* Header Panel */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Color & Material Engine</h2>
            <p className="text-xs text-slate-500">Sinkronisasi warna HEX, PBR material & mood lighting</p>
          </div>
        </div>
        
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          HEX Sync Active
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
        
        {/* Curated Theme Palettes */}
        <section>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
            1. Tema Palet & Tekstur PBR Matched
          </label>

          <div className="grid grid-cols-1 gap-3">
            {COLOR_PALETTES.map((palette) => {
              const isSelected = selectedPalette.id === palette.id;
              return (
                <button
                  key={palette.id}
                  onClick={() => handlePaletteSelect(palette)}
                  className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                      {palette.name}
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {palette.material}
                    </span>
                  </div>

                  {/* Swatches Bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: palette.wallHex }} title="Warna Dinding" />
                      <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: palette.furnitureHex }} title="Warna Furnitur" />
                      <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: palette.accentHex }} title="Warna Aksen" />
                    </div>
                    <span className="text-[11px] text-slate-500 truncate flex-1 font-medium">
                      HEX: {palette.wallHex} • {palette.furnitureHex}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Custom HEX Color Adjuster */}
        <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            2. Custom HEX Color Adjuster (Real-time Viewport Sync)
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Warna Dinding (Wall)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={wallColor}
                  onChange={(e) => setWallColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={wallColor}
                  onChange={(e) => setWallColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Warna Furnitur (Material)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={furnitureColor}
                  onChange={(e) => setFurnitureColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={furnitureColor}
                  onChange={(e) => setFurnitureColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lighting Mood Engine */}
        <section>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
            3. Mood Lighting & Suasana Ruangan
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {LIGHTING_MOODS.map((m) => {
              const Icon = m.icon;
              const isSelected = lightingMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setLightingMood(m.id as 'daylight' | 'sunset' | 'cyberpunk' | 'warm')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Prompt Preview */}
        <section className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-bold text-blue-600">
              <Eye className="w-3.5 h-3.5" /> Prompt Auto-Sync AI
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live Generated</span>
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-xs font-mono text-slate-600 focus:outline-none resize-none"
          />
        </section>

      </div>

    </div>
  );
}
