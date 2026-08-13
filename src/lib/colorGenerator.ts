export type SchemeType = 'monochrome' | 'analogic' | 'complement' | 'triad' | 'earth' | 'wood' | 'metal';

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHsl(hex: string): { h: number, s: number, l: number } {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  
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

export function getSemanticSeeds(keyword: string): { seeds: string[], defaultScheme: SchemeType } {
  const kw = keyword.toLowerCase().trim();

  // 1. Metals, Iron, Steel, Chrome, Rust (Besi, Rantai, Baja, Metal, Logam, Pipa, Chrome, Aluminium)
  if (kw.includes('besi') || kw.includes('rantai') || kw.includes('baja') || kw.includes('metal') || kw.includes('logam') || kw.includes('pipa') || kw.includes('chrome') || kw.includes('alum') || kw.includes('seng')) {
    return {
      seeds: ['#18181B', '#27272A', '#3F3F46', '#52525B', '#71717A', '#A1A1AA', '#D4D4D8', '#B45309'], // Metallic Steel, Iron Slate, Rust Accent
      defaultScheme: 'metal'
    };
  }

  // 2. Wood & Furniture Materials (Lemari, Kayu, Meja, Kursi, Rotan, Bambu, Japandi, Mebel)
  if (kw.includes('kayu') || kw.includes('lemari') || kw.includes('rotan') || kw.includes('bambu') || kw.includes('meja') || kw.includes('kursi') || kw.includes('japandi') || kw.includes('furniture') || kw.includes('mebel')) {
    return {
      seeds: ['#3F2E21', '#5C4033', '#8B4513', '#A0522D', '#C19A6B', '#D2B48C', '#EEDC82'], // Dark Walnut, Teak, Mahogany, Oak, Rattan
      defaultScheme: 'wood'
    };
  }

  // 3. Leather & Upholstery (Kulit, Leather, Sofa, Jok, Busa)
  if (kw.includes('kulit') || kw.includes('leather') || kw.includes('sofa') || kw.includes('jok')) {
    return {
      seeds: ['#291D18', '#4A2311', '#78350F', '#B45309', '#D97706', '#1E293B'], // Saddle Brown, Cognac, Camel Leather, Onyx
      defaultScheme: 'earth'
    };
  }

  // 4. Gold, Brass, Bronze, Copper (Emas, Gold, Kuningan, Tembaga, Mewah, Bronze)
  if (kw.includes('emas') || kw.includes('gold') || kw.includes('kuningan') || kw.includes('tembaga') || kw.includes('mewah') || kw.includes('bronze')) {
    return {
      seeds: ['#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B', '#FDE68A'], // Rich Metallic Gold & Warm Brass
      defaultScheme: 'earth'
    };
  }

  // 5. Stone, Marble, Concrete, Cement (Marmer, Batu, Beton, Semen, Granit, Keramik, Dinding, Minimalis)
  if (kw.includes('marmer') || kw.includes('batu') || kw.includes('beton') || kw.includes('semen') || kw.includes('granit') || kw.includes('keramik') || kw.includes('minimalis') || kw.includes('kamar')) {
    return {
      seeds: ['#0F172A', '#1E293B', '#334155', '#475569', '#94A3B8', '#CBD5E1', '#F8FAFC'], // Slate, Granite, Cement, Marble White
      defaultScheme: 'monochrome'
    };
  }

  // 6. Plants, Nature, Garden (Taman, Daun, Hutan, Alam, Hijau, Tanaman, Rumput)
  if (kw.includes('taman') || kw.includes('daun') || kw.includes('hutan') || kw.includes('alam') || kw.includes('tanaman') || kw.includes('hijau') || kw.includes('rumput')) {
    return {
      seeds: ['#14532D', '#15803D', '#166534', '#4ADE80', '#D4A373', '#FEF3C7'], // Deep Forest, Sage, Olive, Soil Earth
      defaultScheme: 'analogic'
    };
  }

  // 7. Water, Beach, Ocean, Sky (Laut, Pantai, Sky, Biru, Air, Kolam)
  if (kw.includes('pantai') || kw.includes('laut') || kw.includes('biru') || kw.includes('sky') || kw.includes('air') || kw.includes('kolam')) {
    return {
      seeds: ['#0F172A', '#1E3A8A', '#1D4ED8', '#0284C7', '#38BDF8', '#F59E0B'], // Deep Ocean, Cyan, Azure, Sand Gold
      defaultScheme: 'complement'
    };
  }

  // Kategori Baru dari SearchBar
  const categorySeeds: Record<string, string[]> = {
    pastel: ['#FDFD96', '#FFB7B2', '#FFDAC1', '#E2F0CB'],
    vintage: ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE'],
    retro: ['#283618', '#606C38', '#DDA15E', '#BC6C25'],
    neon: ['#39FF14', '#FF00FF', '#00FFFF', '#FFFF00'],
    gold: ['#FFD700', '#DAA520', '#B8860B', '#F0E68C'],
    light: ['#FFFFFF', '#F0F8FF', '#F5F5F5', '#E6E6FA'],
    dark: ['#1A1A1D', '#4E4E50', '#6F2232', '#950740'],
    warm: ['#FF7E67', '#FF4C29', '#334756', '#082032'],
    cold: ['#A0E7E5', '#B4F8C8', '#FBE7C6', '#FFAEBC'],
    summer: ['#00B4D8', '#90E0EF', '#CAF0F8', '#FFB703'],
    fall: ['#AE2012', '#CA6702', '#EE9B00', '#E9D8A6'],
    winter: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF'],
    spring: ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7'],
    happy: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0'],
    nature: ['#2D6A4F', '#40916C', '#52B788', '#74C69D'],
    earth: ['#582F0E', '#7F4F24', '#936639', '#A68A64'],
    night: ['#121212', '#282828', '#3F3F3F', '#575757'],
    space: ['#0B3D91', '#1E2761', '#408EC6', '#7A2048'],
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00'],
    gradient: ['#833AB4', '#FD1D1D', '#FCB045', '#F83600'],
    sunset: ['#FF7B54', '#FFB26B', '#FFD56F', '#939B62'],
    sky: ['#87CEEB', '#00BFFF', '#1E90FF', '#4682B4'],
    sea: ['#006994', '#008B8B', '#20B2AA', '#48D1CC'],
    kids: ['#FF69B4', '#32CD32', '#FFD700', '#00CED1'],
    skin: ['#FFDCB2', '#E5B887', '#CE935F', '#B5713F'],
    food: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D'],
    cream: ['#FFFDD0', '#F5FFFA', '#F0FFF0', '#F5F5DC'],
    coffee: ['#4B3832', '#854442', '#FFF4E6', '#3C2F2F'],
    wedding: ['#FFFAFA', '#F0F8FF', '#F8F8FF', '#F5F5F5'],
    christmas: ['#B3000C', '#008000', '#FFD700', '#FFFFFF'],
    minimalist: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E'],
    cyberpunk: ['#FCEE09', '#00F0FF', '#FF003C', '#241468'],
    forest: ['#1A4314', '#2C5E1A', '#32CD32', '#8B4513'],
    desert: ['#EDC9AF', '#D2B48C', '#C2B280', '#E3CAA5'],
    ocean: ['#0077BE', '#00A8E8', '#00BFFF', '#E0FFFF'],
    galaxy: ['#090A0F', '#1B1236', '#4A1C40', '#8A2B70'],
    candy: ['#FFB6C1', '#FF69B4', '#FF1493', '#C71585'],
    halloween: ['#FF7518', '#000000', '#8A2BE2', '#32CD32'],
    valentine: ['#FFC0CB', '#FF69B4', '#DC143C', '#8B0000'],
    luxury: ['#D4AF37', '#000000', '#C0C0C0', '#4B0082'],
    rustic: ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3'],
    industrial: ['#708090', '#2F4F4F', '#A9A9A9', '#D3D3D3'],
    floral: ['#FFB6C1', '#FFC0CB', '#DB7093', '#C71585'],
    tropical: ['#FF69B4', '#00FA9A', '#00FFFF', '#FFD700'],
    anime: ['#FFB6C1', '#ADD8E6', '#98FB98', '#FFA07A'],
    vaporwave: ['#FF6AD5', '#C774E8', '#AD8CFF', '#8795E8'],
    cyber: ['#00FF00', '#000000', '#00FFFF', '#FF00FF'],
    tech: ['#0A192F', '#112240', '#233554', '#64FFDA'],
    ui: ['#F3F4F6', '#3B82F6', '#10B981', '#111827'],
    'ui/ux': ['#F3F4F6', '#3B82F6', '#10B981', '#111827']
  };

  if (categorySeeds[kw]) {
    return {
      seeds: categorySeeds[kw],
      defaultScheme: 'analogic'
    };
  }

  for (const [key, colors] of Object.entries(categorySeeds)) {
    if (kw.includes(key)) {
      return {
        seeds: colors,
        defaultScheme: 'analogic'
      };
    }
  }

  // 8. Elegant Neutral Architectural Fallback (Used when no material match is found)
  // NEVER DEFAULT TO NEON PURPLE/PINK AGAIN!
  return {
    seeds: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#F8FAFC', '#D97706'],
    defaultScheme: 'metal'
  };
}

export function generatePaletteFromSeed(seedHex: string, scheme: SchemeType, count: number = 5): string[] {
  const baseHsl = hexToHsl(seedHex);
  const palette: string[] = [];

  for (let i = 0; i < count; i++) {
    let newH = baseHsl.h;
    let newS = baseHsl.s;
    let newL = baseHsl.l;

    switch (scheme) {
      case 'metal':
        // Extremely low saturation for authentic metallic iron/steel/slate, varied lightness steps
        newH = (baseHsl.h + ((i - 2) * 2) + 360) % 360;
        newS = Math.max(2, Math.min(20, baseHsl.s + ((i - 2) * 2))); // Low saturation 2% to 20%
        newL = Math.max(10, Math.min(92, baseHsl.l + ((i - 2) * 16)));
        break;

      case 'wood':
        // Natural warm wood tones (Hue ~15-45, moderate saturation)
        newH = (baseHsl.h + ((i - 2) * 4) + 360) % 360;
        newS = Math.max(15, Math.min(50, baseHsl.s + ((i - 2) * 3)));
        newL = Math.max(12, Math.min(88, baseHsl.l + ((i - 2) * 16)));
        break;

      case 'earth':
        newH = (baseHsl.h + ((i - 2) * 10) + 360) % 360;
        newS = Math.max(15, Math.min(45, baseHsl.s));
        newL = Math.max(15, Math.min(85, baseHsl.l + ((i - 2) * 15)));
        break;

      case 'monochrome':
        newS = Math.max(5, Math.min(30, baseHsl.s));
        newL = Math.max(10, Math.min(95, baseHsl.l + ((i - Math.floor(count/2)) * 18)));
        break;

      case 'analogic':
        newH = (baseHsl.h + (i * 15)) % 360;
        newS = Math.min(65, baseHsl.s);
        break;

      case 'complement':
        newH = i % 2 === 0 ? baseHsl.h : (baseHsl.h + 180) % 360;
        newL = Math.max(15, Math.min(85, baseHsl.l + ((i - 1) * 10)));
        break;

      case 'triad':
        newH = (baseHsl.h + (i * 120)) % 360;
        break;
    }

    palette.push(hslToHex(newH, newS, newL));
  }

  return palette;
}
