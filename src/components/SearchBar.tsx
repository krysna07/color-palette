'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: 'Semua', label: 'Semua' },
  { id: 'Pastel', label: 'Pastel' },
  { id: 'Vintage', label: 'Vintage' },
  { id: 'Retro', label: 'Retro' },
  { id: 'Neon', label: 'Neon' },
  { id: 'Gold', label: 'Gold' },
  { id: 'Light', label: 'Light' },
  { id: 'Dark', label: 'Dark' },
  { id: 'Warm', label: 'Warm' },
  { id: 'Cold', label: 'Cold' },
  { id: 'Summer', label: 'Summer' },
  { id: 'Fall', label: 'Fall' },
  { id: 'Winter', label: 'Winter' },
  { id: 'Spring', label: 'Spring' },
  { id: 'Happy', label: 'Happy' },
  { id: 'Nature', label: 'Nature' },
  { id: 'Earth', label: 'Earth' },
  { id: 'Night', label: 'Night' },
  { id: 'Space', label: 'Space' },
  { id: 'Rainbow', label: 'Rainbow' },
  { id: 'Gradient', label: 'Gradient' },
  { id: 'Sunset', label: 'Sunset' },
  { id: 'Sky', label: 'Sky' },
  { id: 'Sea', label: 'Sea' },
  { id: 'Kids', label: 'Kids' },
  { id: 'Skin', label: 'Skin' },
  { id: 'Food', label: 'Food' },
  { id: 'Cream', label: 'Cream' },
  { id: 'Coffee', label: 'Coffee' },
  { id: 'Wedding', label: 'Wedding' },
  { id: 'Christmas', label: 'Christmas' },
  // Tambahan kategori baru agar lebih banyak
  { id: 'Minimalist', label: 'Minimalist' },
  { id: 'Cyberpunk', label: 'Cyberpunk' },
  { id: 'Forest', label: 'Forest' },
  { id: 'Desert', label: 'Desert' },
  { id: 'Ocean', label: 'Ocean' },
  { id: 'Galaxy', label: 'Galaxy' },
  { id: 'Candy', label: 'Candy' },
  { id: 'Halloween', label: 'Halloween' },
  { id: 'Valentine', label: 'Valentine' },
  { id: 'Luxury', label: 'Luxury' },
  { id: 'Rustic', label: 'Rustic' },
  { id: 'Industrial', label: 'Industrial' },
  { id: 'Floral', label: 'Floral' },
  { id: 'Tropical', label: 'Tropical' },
  { id: 'Anime', label: 'Anime' },
  { id: 'Vaporwave', label: 'Vaporwave' },
  { id: 'Cyber', label: 'Cyber' },
  { id: 'Tech', label: 'Tech' },
  { id: 'UI', label: 'UI/UX' },
  // Kategori Lama yang dipertahankan
  { id: 'Kursi', label: '🪑 Kursi & Sofa' },
  { id: 'Meja', label: '🪵 Meja & Kayu' },
  { id: 'Kamar', label: '🛏️ Kamar Tidur' },
  { id: 'RuangTamu', label: '🛋️ Ruang Tamu' },
  { id: 'Dapur', label: '🍳 Dapur' },
  { id: 'Fashion', label: '👗 Fashion' },
  { id: 'Branding', label: '🎨 Branding & UI' },
];

export default function SearchBar({ onSearch }: { onSearch: (query: string, category: string) => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Real-time debounced live search as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      onSearch(val, activeCategory);
    }, 350);
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    onSearch(query, catId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onSearch(query, activeCategory);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center group">
        <div className="absolute left-6 text-slate-400 group-focus-within:text-slate-900 transition-colors">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Ketik kata kunci (misal: 'kamar tidur minimalis', 'kursi kayu', 'dapur modern')"
          className="w-full pl-16 pr-36 py-5 rounded-2xl bg-white border border-slate-200 text-lg text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all"
        />
        <div className="absolute right-3 flex items-center gap-2">
          <button type="button" className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-md">
            Cari Palet
          </button>
        </div>
      </form>

      {/* Preset Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 px-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategorySelect(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all snap-start ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
