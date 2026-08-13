'use client';

import React, { useState } from 'react';
import { Bookmark, Copy, Check, MoreHorizontal } from 'lucide-react';

interface ColorMatchCardProps {
  name: string;
  category: string;
  colors: { hex: string; name: string }[];
  previewImage?: string;
}

export default function ColorMatchCard({ name, category, colors, previewImage }: ColorMatchCardProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1">
      
      {/* Visual Preview Header (Optional) */}
      {previewImage ? (
        <div className="w-full h-40 overflow-hidden relative border-b border-slate-100">
          <img src={previewImage} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <span className="absolute bottom-3 left-4 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            {category}
          </span>
        </div>
      ) : (
        <div className="pt-6 px-6 pb-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {category}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{name}</h3>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Color Swatches Grid */}
        <div className="flex items-stretch h-20 rounded-xl overflow-hidden shadow-inner mb-4 border border-slate-100">
          {colors.map((color, idx) => (
            <div 
              key={idx} 
              className="flex-1 group/swatch relative hover:flex-[1.5] transition-all duration-300 ease-out flex items-end justify-center pb-2"
              style={{ backgroundColor: color.hex }}
              onClick={(e) => { e.stopPropagation(); handleCopy(color.hex); }}
            >
              {/* Copy Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/swatch:bg-black/10 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-all">
                {copiedHex === color.hex ? (
                  <Check className="w-5 h-5 text-white drop-shadow-md" />
                ) : (
                  <Copy className="w-5 h-5 text-white drop-shadow-md" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* HEX Codes List */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors group/hex" onClick={(e) => { e.stopPropagation(); handleCopy(color.hex); }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: color.hex }} />
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[60px]">{color.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">{color.hex}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
