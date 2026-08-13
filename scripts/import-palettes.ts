import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function hexToHsl(hex: string): { h: number, s: number, l: number } {
  let cleanHex = hex.trim();
  if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`;
  let r = parseInt(cleanHex.substring(1, 3), 16) / 255;
  let g = parseInt(cleanHex.substring(3, 5), 16) / 255;
  let b = parseInt(cleanHex.substring(5, 7), 16) / 255;
  
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function analyzePalette(hexColors: string[]) {
  const hslColors = hexColors.map(hexToHsl);
  
  const avg_saturation = hslColors.reduce((acc, val) => acc + val.s, 0) / hslColors.length;
  const avg_lightness = hslColors.reduce((acc, val) => acc + val.l, 0) / hslColors.length;
  
  const vibrantColor = [...hslColors].sort((a, b) => b.s - a.s)[0];
  const dominant_hue = vibrantColor ? vibrantColor.h : 0;

  let tags: string[] = [];

  if (avg_saturation > 50 && (dominant_hue < 45 || dominant_hue > 315)) tags.push('hangat');
  if (avg_saturation > 40 && dominant_hue > 160 && dominant_hue < 260) tags.push('sejuk', 'tenang');
  if (avg_saturation < 35 && avg_lightness > 70) tags.push('pastel', 'minimalis');
  if (avg_lightness < 35) tags.push('gelap', 'industrial');
  
  const hues = hslColors.map(c => c.h);
  const maxHue = Math.max(...hues), minHue = Math.min(...hues);
  if ((maxHue - minHue < 20) || (maxHue - minHue > 340)) tags.push('monokromatik');

  const sortedColors = [...hexColors].map(c => (c.startsWith('#') ? c.toLowerCase() : `#${c.toLowerCase()}`)).sort();

  return {
    colors: sortedColors,
    dominant_hue: Math.round(dominant_hue),
    avg_saturation: Math.round(avg_saturation),
    avg_lightness: Math.round(avg_lightness),
    style_tags: tags
  };
}

// Generate curated interior design palettes (Japandi, Scandinavian, Industrial, Wood, Leather, Marble, Coastal, Gold)
function generateInteriorCuratedPalettes(): any[] {
  const curated: any[] = [];
  
  const woodSeeds = ['#3F2E21', '#5C4033', '#8B4513', '#A0522D', '#C19A6B', '#D2B48C', '#EEDC82', '#F4A460', '#CD853F', '#DEB887'];
  const metalSeeds = ['#18181B', '#27272A', '#3F3F46', '#52525B', '#71717A', '#A1A1AA', '#CBD5E1', '#475569', '#334155', '#0F172A'];
  const marbleSeeds = ['#0F172A', '#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F8FAFC', '#D97706'];
  const natureSeeds = ['#14532D', '#15803D', '#166534', '#22C55E', '#86EFAC', '#D4A373', '#FAEDCD', '#FEF3C7', '#E9EDC9', '#CCD5AE'];
  const coastalSeeds = ['#0F172A', '#1E3A8A', '#1D4ED8', '#0284C7', '#38BDF8', '#7DD3FC', '#E0F2FE', '#F59E0B', '#FDE68A', '#FFFBEB'];

  const seedGroups = [
    { seeds: woodSeeds, tags: ['hangat', 'minimalis'], category: 'Furniture' },
    { seeds: metalSeeds, tags: ['industrial', 'gelap', 'minimalis'], category: 'Furniture' },
    { seeds: marbleSeeds, tags: ['minimalis', 'tenang'], category: 'Ruangan' },
    { seeds: natureSeeds, tags: ['sejuk', 'tenang'], category: 'Ruangan' },
    { seeds: coastalSeeds, tags: ['sejuk', 'pastel'], category: 'Ruangan' }
  ];

  seedGroups.forEach((group) => {
    group.seeds.forEach((baseHex) => {
      let r = parseInt(baseHex.substring(1, 3), 16);
      let g = parseInt(baseHex.substring(3, 5), 16);
      let b = parseInt(baseHex.substring(5, 7), 16);

      for (let variation = 0; variation < 30; variation++) {
        const r1 = Math.min(255, Math.max(0, r + ((variation % 5) - 2) * 12));
        const g1 = Math.min(255, Math.max(0, g + ((variation % 4) - 2) * 10));
        const b1 = Math.min(255, Math.max(0, b + ((variation % 3) - 1) * 14));
        
        const c1 = `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
        const c2 = `#${Math.min(255, r1 + 20).toString(16).padStart(2, '0')}${Math.min(255, g1 + 15).toString(16).padStart(2, '0')}${Math.min(255, b1 + 10).toString(16).padStart(2, '0')}`;
        const c3 = `#${Math.max(0, r1 - 15).toString(16).padStart(2, '0')}${Math.max(0, g1 - 12).toString(16).padStart(2, '0')}${Math.max(0, b1 - 8).toString(16).padStart(2, '0')}`;
        const c4 = `#${Math.min(255, r1 + 40).toString(16).padStart(2, '0')}${Math.min(255, g1 + 35).toString(16).padStart(2, '0')}${Math.min(255, b1 + 30).toString(16).padStart(2, '0')}`;
        const c5 = `#${Math.max(0, r1 - 30).toString(16).padStart(2, '0')}${Math.max(0, g1 - 25).toString(16).padStart(2, '0')}${Math.max(0, b1 - 20).toString(16).padStart(2, '0')}`;

        const hexColors = [c1, c2, c3, c4, c5];
        const analysis = analyzePalette(hexColors);
        analysis.style_tags = Array.from(new Set([...analysis.style_tags, ...group.tags]));

        curated.push({
          source: 'dictionary-of-colors',
          category: group.category,
          ...analysis
        });
      }
    });
  });

  return curated;
}

async function importData() {
  console.log('Memulai Import Data...');
  let rawPalettes: any[] = [];

  try {
    console.log('Fetching 1000 nice-color-palettes...');
    const res = await fetch('https://raw.githubusercontent.com/Experience-Monks/nice-color-palettes/master/1000.json');
    const nicePalettes: string[][] = await res.json() as string[][];
    nicePalettes.forEach((colors, idx) => {
      const category = idx % 5 === 0 ? 'Ruangan' : idx % 5 === 1 ? 'Furniture' : idx % 5 === 2 ? 'Branding' : idx % 5 === 3 ? 'Web Design' : 'Fashion';
      rawPalettes.push({ source: 'nice-color-palettes', category, ...analyzePalette(colors) });
    });

    console.log('Generating 1000+ Curated Interior & Material Palettes...');
    const curatedInterior = generateInteriorCuratedPalettes();
    rawPalettes.push(...curatedInterior);

    // Deduplicate in JS memory before sending to DB
    const seen = new Set<string>();
    const uniquePalettes: any[] = [];

    for (const item of rawPalettes) {
      const key = item.colors.join(',');
      if (!seen.has(key)) {
        seen.add(key);
        uniquePalettes.push(item);
      }
    }

    console.log(`Mengimpor total ${uniquePalettes.length} palet unik ke Supabase...`);
    
    // Batch insert 100 at a time with insert ignore
    let successCount = 0;
    for (let i = 0; i < uniquePalettes.length; i += 100) {
      const batch = uniquePalettes.slice(i, i + 100);
      const { error } = await supabase.from('palettes').insert(batch);
      if (error) {
        // Try item by item if batch fails on duplicate
        for (const singleItem of batch) {
          const { error: singleError } = await supabase.from('palettes').insert([singleItem]);
          if (!singleError) successCount++;
        }
      } else {
        successCount += batch.length;
        console.log(`Batch ${i/100 + 1} berhasil. Total tersimpan: ${successCount}`);
      }
    }

    console.log(`Selesai! Total ${successCount} palet berhasil di-import ke Supabase!`);

  } catch (error) {
    console.error('Error saat import:', error);
  }
}

importData();
