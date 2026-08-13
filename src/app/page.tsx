'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ColorMatchCard from '@/components/ColorMatchCard';
import SketsaRenderer from '@/components/SketsaRenderer';
import { searchPalettesAction } from '@/app/actions/searchPalettes';
import { Sparkles, Palette, Save, Plus, Database, RefreshCw, X } from 'lucide-react';

export default function ColorMatchHome() {
  const [isSearching, setIsSearching] = useState(true);
  const [palettes, setPalettes] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(96);
  const [currentQuery, setCurrentQuery] = useState({ query: '', category: 'Semua' });
  const [isMixerExpanded, setIsMixerExpanded] = useState(false);

  // Map kategori ke palet warna default yang sesuai
  const categoryColorMap: Record<string, string[]> = {
    Pastel: ['#FDFD96', '#FFB7B2', '#FFDAC1', '#E2F0CB'],
    Vintage: ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE'],
    Retro: ['#283618', '#606C38', '#DDA15E', '#BC6C25'],
    Neon: ['#39FF14', '#FF00FF', '#00FFFF', '#FFFF00'],
    Gold: ['#FFD700', '#DAA520', '#B8860B', '#F0E68C'],
    Light: ['#FFFFFF', '#F0F8FF', '#F5F5F5', '#E6E6FA'],
    Dark: ['#1A1A1D', '#4E4E50', '#6F2232', '#950740'],
    Warm: ['#FF7E67', '#FF4C29', '#334756', '#082032'],
    Cold: ['#A0E7E5', '#B4F8C8', '#FBE7C6', '#FFAEBC'],
    Summer: ['#00B4D8', '#90E0EF', '#CAF0F8', '#FFB703'],
    Fall: ['#AE2012', '#CA6702', '#EE9B00', '#E9D8A6'],
    Winter: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF'],
    Spring: ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7'],
    Happy: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0'],
    Nature: ['#2D6A4F', '#40916C', '#52B788', '#74C69D'],
    Earth: ['#582F0E', '#7F4F24', '#936639', '#A68A64'],
    Night: ['#121212', '#282828', '#3F3F3F', '#575757'],
    Space: ['#0B3D91', '#1E2761', '#408EC6', '#7A2048'],
    Rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00'],
    Gradient: ['#833AB4', '#FD1D1D', '#FCB045', '#F83600'],
    Sunset: ['#FF7B54', '#FFB26B', '#FFD56F', '#939B62'],
    Sky: ['#87CEEB', '#00BFFF', '#1E90FF', '#4682B4'],
    Sea: ['#006994', '#008B8B', '#20B2AA', '#48D1CC'],
    Kids: ['#FF69B4', '#32CD32', '#FFD700', '#00CED1'],
    Skin: ['#FFDCB2', '#E5B887', '#CE935F', '#B5713F'],
    Food: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D'],
    Cream: ['#FFFDD0', '#F5FFFA', '#F0FFF0', '#F5F5DC'],
    Coffee: ['#4B3832', '#854442', '#FFF4E6', '#3C2F2F'],
    Wedding: ['#FFFAFA', '#F0F8FF', '#F8F8FF', '#F5F5F5'],
    Christmas: ['#B3000C', '#008000', '#FFD700', '#FFFFFF'],
    Minimalist: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E'],
    Cyberpunk: ['#FCEE09', '#00F0FF', '#FF003C', '#241468'],
    Forest: ['#1A4314', '#2C5E1A', '#32CD32', '#8B4513'],
    Desert: ['#EDC9AF', '#D2B48C', '#C2B280', '#E3CAA5'],
    Ocean: ['#0077BE', '#00A8E8', '#00BFFF', '#E0FFFF'],
    Galaxy: ['#090A0F', '#1B1236', '#4A1C40', '#8A2B70'],
    Candy: ['#FFB6C1', '#FF69B4', '#FF1493', '#C71585'],
    Halloween: ['#FF7518', '#000000', '#8A2BE2', '#32CD32'],
    Valentine: ['#FFC0CB', '#FF69B4', '#DC143C', '#8B0000'],
    Luxury: ['#D4AF37', '#000000', '#C0C0C0', '#4B0082'],
    Rustic: ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3'],
    Industrial: ['#708090', '#2F4F4F', '#A9A9A9', '#D3D3D3'],
    Floral: ['#FFB6C1', '#FFC0CB', '#DB7093', '#C71585'],
    Tropical: ['#FF69B4', '#00FA9A', '#00FFFF', '#FFD700'],
    Anime: ['#FFB6C1', '#ADD8E6', '#98FB98', '#FFA07A'],
    Vaporwave: ['#FF6AD5', '#C774E8', '#AD8CFF', '#8795E8'],
    Cyber: ['#00FF00', '#000000', '#00FFFF', '#FF00FF'],
    Tech: ['#0A192F', '#112240', '#233554', '#64FFDA'],
    UI: ['#F3F4F6', '#3B82F6', '#10B981', '#111827']
  };

  const [customColors, setCustomColors] = useState(['#ffffff', '#e2e8f0', '#94a3b8', '#0f172a']);
  const [customName, setCustomName] = useState('Palet Kustom Saya');
  const [savedPalettes, setSavedPalettes] = useState<{name: string, colors: string[]}[]>([]);

  // Initial load from Supabase and LocalStorage
  useEffect(() => {
    loadPalettes('Semua', '', displayCount);
    
    // Load local saved palettes
    const localSaved = localStorage.getItem('vibe_saved_palettes');
    if (localSaved) {
      try {
        setSavedPalettes(JSON.parse(localSaved));
      } catch (e) {
        console.error("Gagal memuat palet lokal", e);
      }
    }
  }, []);

  const loadPalettes = async (category: string, query: string, count: number) => {
    setIsSearching(true);
    const { palettes: data, totalCount: total } = await searchPalettesAction(category, query, count);
    setPalettes(data);
    setTotalCount(total);
    setIsSearching(false);
  };

  const handleSearch = async (query: string, category: string) => {
    setCurrentQuery({ query, category });
    setDisplayCount(96);
    
    // Update palet pembuat palet di bawah jika ada kecocokan
    if (categoryColorMap[category]) {
      setCustomColors(categoryColorMap[category]);
      setCustomName(`Palet ${category}`);
    } else if (category !== 'Semua') {
      setCustomName(`Palet ${category}`);
    }

    await loadPalettes(category, query, 96);
  };

  const handleLoadMore = async () => {
    const newCount = displayCount + 96;
    setDisplayCount(newCount);
    await loadPalettes(currentQuery.category, currentQuery.query, newCount);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Navbar */}
      <nav className="w-full h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl fixed top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Color<span className="text-slate-400">Match</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <Database className="w-3.5 h-3.5" />
            <span>{totalCount || 992} Palet di Supabase</span>
          </div>
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Log In</button>
          <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-12 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{totalCount || 992} Palet Warna Terhubung ke Supabase</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Temukan palet warna yang tepat untuk <span className="text-slate-400 border-b-4 border-slate-900">segalanya</span>.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Cari kata kunci gaya seperti <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">hangat</code>, <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">sejuk</code>, <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">pastel</code>, <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">gelap</code>, atau <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">monokromatik</code>.
          </p>
        </div>

        {/* Search Bar Component */}
        <div className="w-full mb-20 relative z-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results / Discovery Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isSearching ? 'Mengambil Data dari Supabase...' : 'Koleksi Palet Warna Database'}
            </h3>
            {!isSearching && (
              <span className="text-sm font-semibold text-slate-500">
                Menampilkan {palettes.length} dari {totalCount} total palet
              </span>
            )}
          </div>

          {isSearching ? (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Menghubungi Supabase API...</p>
            </div>
          ) : palettes.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-center bg-white border border-slate-200 rounded-3xl">
              <p className="text-xl font-bold text-slate-700">Tidak ada palet yang cocok.</p>
              <p className="text-sm text-slate-500">Coba kata kunci lain atau buat palet Anda sendiri di bawah!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {palettes.map((palette) => (
                  <ColorMatchCard
                    key={palette.id}
                    name={palette.name}
                    category={palette.category}
                    colors={palette.colors}
                    previewImage={palette.previewImage}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {palettes.length < totalCount && (
                <div className="w-full flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" /> Muat 96 Palet Lagi (Total: {totalCount})
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Custom Palette Builder Section */}
        <div className="w-full mt-24 pt-16 border-t border-slate-200">
          <div className="flex flex-col items-center mb-10 text-center">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-3">
              <Plus className="w-8 h-8 text-slate-400" /> Buat Palet Sendiri
            </h3>
            <p className="text-slate-500 max-w-lg">
              Punya ide warna spesifik? Tentukan warna HEX Anda sendiri dan bangun palet kustom tanpa batasan.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
            
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Color Mixer Preview */}
              <div 
                onClick={() => setIsMixerExpanded(true)}
                className="w-full h-28 rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center relative overflow-hidden transition-transform duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg group"
                style={{ background: `linear-gradient(135deg, ${customColors.map(c => c.startsWith('#') ? c : '#' + c).join(', ')})` }}
                title="Klik untuk memperbesar"
              >
                <div className="bg-white/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:bg-white/60 transition-colors">
                  <span className="text-sm font-bold text-slate-800 tracking-wide">Color Mixer Blend (Klik untuk Zoom)</span>
                </div>
              </div>

              {/* Color Pickers */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                {customColors.map((color, idx) => (
                  <div key={idx} className="flex flex-col gap-3 group">
                    <div 
                      className="w-full aspect-square rounded-2xl border-2 border-slate-100 shadow-inner relative overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      <input 
                        type="color" 
                        value={color}
                        onChange={(e) => {
                          const newColors = [...customColors];
                          newColors[idx] = e.target.value;
                          setCustomColors(newColors);
                        }}
                        className="absolute -inset-10 w-[200%] h-[200%] cursor-pointer opacity-0"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={color.toUpperCase()}
                      onChange={(e) => {
                        const newColors = [...customColors];
                        // Ensure it has # when typed
                        let val = e.target.value;
                        if (!val.startsWith('#') && val.length > 0) {
                          val = '#' + val;
                        }
                        newColors[idx] = val;
                        setCustomColors(newColors);
                      }}
                      maxLength={7}
                      className="w-full text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 uppercase focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Nama Palet</label>
                <input 
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Misal: 'My Vintage Theme'"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 shadow-sm"
                />
              </div>
              
              <button 
                onClick={() => {
                  const newSaved = [...savedPalettes, { name: customName || 'Palet Tanpa Nama', colors: customColors }];
                  setSavedPalettes(newSaved);
                  localStorage.setItem('vibe_saved_palettes', JSON.stringify(newSaved));
                  alert(`Palet "${customName}" berhasil disimpan secara lokal!`);
                }}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <Save className="w-4 h-4" /> Simpan Palet
              </button>
            </div>

          </div>

          {/* Palet Tersimpan (Lokal) */}
          {savedPalettes.length > 0 && (
            <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-400 mb-4 uppercase tracking-widest flex items-center justify-between">
                <span>Palet Tersimpan (Lokal Browser)</span>
                <button 
                  onClick={() => {
                    if(confirm('Hapus semua palet tersimpan?')) {
                      setSavedPalettes([]);
                      localStorage.removeItem('vibe_saved_palettes');
                    }
                  }} 
                  className="text-red-400 hover:text-red-600 font-bold"
                >
                  Hapus Semua
                </button>
              </h4>
              <div className="flex flex-wrap gap-4">
                {savedPalettes.map((p, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-slate-300 transition-all hover:-translate-y-1 shadow-sm hover:shadow"
                    onClick={() => {
                      setCustomColors(p.colors);
                      setCustomName(p.name);
                    }}
                    title="Klik untuk memuat ulang palet ini"
                  >
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{p.name}</span>
                    <div className="flex shadow-inner rounded-lg overflow-hidden border border-black/5">
                      {p.colors.map((c: string, idx: number) => (
                        <div key={idx} className="w-6 h-6" style={{backgroundColor: c}}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render AI Widget */}
          <SketsaRenderer colors={customColors} paletteName={customName} />

        </div>

      </main>

      {/* Fullscreen Mixer Overlay */}
      {isMixerExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/60 transition-all animate-in fade-in duration-200"
          onClick={() => setIsMixerExpanded(false)}
        >
          <div 
            className="w-full max-w-6xl h-[65vh] md:h-[75vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300 shrink-0"
            style={{ background: `linear-gradient(135deg, ${customColors.map(c => c.startsWith('#') ? c : '#' + c).join(', ')})` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsMixerExpanded(false)}
              className="absolute top-8 right-8 w-14 h-14 bg-black/10 hover:bg-black/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-lg border border-white/20"
              title="Tutup"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-extrabold text-white drop-shadow-md">
                  Pratinjau Hasil Pencampuran Warna (Gradient Blend)
                </span>
                <span className="text-sm font-medium text-white/80 drop-shadow-sm">
                  Menampilkan transisi antar warna secara mendetail untuk melihat harmoni warna.
                </span>
              </div>
              <div className="flex gap-3 bg-black/20 p-3 rounded-3xl backdrop-blur-md border border-white/10">
                {customColors.map(c => (
                  <div key={c} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-white/70 mt-6 font-medium tracking-wide drop-shadow-sm text-sm">
            Klik di luar area atau tekan tombol silang untuk menutup
          </p>
        </div>
      )}

    </div>
  );
}
