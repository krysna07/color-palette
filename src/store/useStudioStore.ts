import { create } from 'zustand';

export type LayoutMode = 'split' | 'canvas-only' | 'render-only';
export type LeftPanelMode = 'sketch' | 'canvas' | 'ergonomics' | 'materials';
export type SketchCategory = 'meja-kerja' | 'meja-belajar' | 'meja-rapat' | 'lemari' | 'sofa' | 'rak-buku' | 'kursi' | 'lounge-room' | 'studio-apartment' | null;

export type RoomType = 'lounge' | 'workspace' | 'studio';
export type ControlNetMode = 'lineart' | 'depth' | 'mlsd';

export interface ColorPalette {
  id: string;
  name: string;
  wallHex: string;
  furnitureHex: string;
  accentHex: string;
  material: string;
  prompt: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'tactical-mono',
    name: 'Tactical Monochrome',
    wallHex: '#1e293b',
    furnitureHex: '#0f172a',
    accentHex: '#38bdf8',
    material: 'Matte Metal & Dark Oak',
    prompt: 'Tactical monochrome interior design, dark slate walls, matte black furniture, blue subtle LED ambient, architectural photography, photorealistic, 8k resolution',
  },
  {
    id: 'warm-japandi',
    name: 'Warm Japandi',
    wallHex: '#f5f5f4',
    furnitureHex: '#d97706',
    accentHex: '#10b981',
    material: 'Natural Ash Wood & Cream Linen',
    prompt: 'Warm japandi interior, light ash wood furniture, beige linen upholstery, potted monstera plant, soft morning sunbeams, architectural photography, photorealistic, 8k',
  },
  {
    id: 'industrial-concrete',
    name: 'Industrial Concrete',
    wallHex: '#475569',
    furnitureHex: '#18181b',
    accentHex: '#f97316',
    material: 'Raw Concrete & Cast Iron',
    prompt: 'Loft industrial concrete living room, exposed brick accent wall, distressed leather sofa, black steel frame, warm Edison bulbs, photorealistic, 8k',
  },
  {
    id: 'nordic-minimalist',
    name: 'Nordic Minimalist',
    wallHex: '#e2e8f0',
    furnitureHex: '#64748b',
    accentHex: '#a855f7',
    material: 'Smooth Matte Ceramic & Birch',
    prompt: 'Scandinavian minimalist workspace, matte off-white walls, birch wood desk, clean daylighting, high detailed fabric weaves, photorealistic, 8k',
  },
  {
    id: 'luxury-marble',
    name: 'Luxury Marble & Brass',
    wallHex: '#0f172a',
    furnitureHex: '#1e1b4b',
    accentHex: '#eab308',
    material: 'Polished Calacatta Marble & Brushed Brass',
    prompt: 'Ultra luxury modern living room, polished white marble flooring, brass accents, deep navy velvet sofa, soft ambient lighting, natural reflections, 8k resolution',
  },
];

export interface ErgonomicRecommendation {
  title: string;
  description: string;
  clearance: string;
  status: 'optimal' | 'warning' | 'info';
}

export const ROOM_LAYOUT_SUGGESTIONS: Record<RoomType, {
  name: string;
  recommendedSize: string;
  items: string[];
  recommendations: ErgonomicRecommendation[];
}> = {
  lounge: {
    name: 'Lounge Room (Ruang Keluarga)',
    recommendedSize: '5.0m x 4.0m',
    items: ['Sofa Utama (L-Shape)', 'Meja Kopi (Coffee Table)', 'Credenza / TV Console', 'Lampu Lantai Ambient'],
    recommendations: [
      { title: 'Sirkulasi Jalan Utama', description: 'Jarak minimum antara sofa dan meja kopi adalah 45cm untuk akses kaki nyaman.', clearance: '45cm - 50cm', status: 'optimal' },
      { title: 'Posisi TV Console (Credenza)', description: 'Tinggi pusat layar TV ideal setinggi mata saat duduk (100 - 110cm dari lantai).', clearance: '2.5m - 3.2m dari sofa', status: 'optimal' },
      { title: 'Pencahayaan Layered', description: 'Gunakan kombinasi recessed warm LED + floor lamp untuk ruang santai malam.', clearance: '2700K Warm White', status: 'info' },
    ]
  },
  workspace: {
    name: 'Workspace (Ruang Kerja Ergonomis)',
    recommendedSize: '3.5m x 3.0m',
    items: ['Meja Kerja Utama', 'Kursi Kerja Ergonomis', 'Rak Buku Vertical', 'Credenza Storage'],
    recommendations: [
      { title: 'Posisi Monitor & Cahaya Alami', description: 'Posisikan layar tegak lurus dengan jendela untuk mencegah silau (glare).', clearance: '60cm - 75cm jarak mata', status: 'optimal' },
      { title: 'Area Ayun Kursi Kerja', description: 'Berikan area kosong di belakang meja minimal 90cm agar kursi dapat berputar fleksibel.', clearance: '90cm - 120cm', status: 'optimal' },
      { title: 'Sirkulasi Pintu & Rak', description: 'Jarak antara ujung meja dan rak buku minimal 80cm untuk akses buka pintu.', clearance: 'min. 80cm', status: 'info' },
    ]
  },
  studio: {
    name: 'Studio Apartment (Ruang Multi-Fungsi)',
    recommendedSize: '6.0m x 3.5m',
    items: ['Tempat Tidur Murphy / Queen', 'Partition Divider', 'Compact Desk', 'Compact Sofa'],
    recommendations: [
      { title: 'Zoning Pembagi Ruang', description: 'Gunakan credenza open-shelf sebagai pembagi alami antara area tidur & ruang tamu.', clearance: 'Zoning Visual', status: 'optimal' },
      { title: 'Lini Sirkulasi Lurus', description: 'Pertahankan koridor jalan selebar 90cm dari pintu masuk ke jendela balok utama.', clearance: '90cm lurus', status: 'optimal' },
      { title: 'Furnitur Multi-Fungsi', description: 'Pilih tempat tidur dengan storage bawah atau meja lipat dinding.', clearance: 'Dual-purpose', status: 'info' },
    ]
  }
};

interface StudioState {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;

  leftPanelMode: LeftPanelMode;
  setLeftPanelMode: (mode: LeftPanelMode) => void;

  activePreset: string;
  setActivePreset: (preset: string) => void;

  // Warna & Material Engine
  selectedPalette: ColorPalette;
  setSelectedPalette: (palette: ColorPalette) => void;
  wallColor: string;
  setWallColor: (hex: string) => void;
  furnitureColor: string;
  setFurnitureColor: (hex: string) => void;
  lightingMood: 'daylight' | 'sunset' | 'cyberpunk' | 'warm';
  setLightingMood: (mood: 'daylight' | 'sunset' | 'cyberpunk' | 'warm') => void;

  // AI Layouting & Ergonomi
  selectedRoomType: RoomType;
  setSelectedRoomType: (type: RoomType) => void;
  roomLength: number;
  setRoomLength: (val: number) => void;
  roomWidth: number;
  setRoomWidth: (val: number) => void;

  // ControlNet & Photorealistic Pipeline
  controlNetMode: ControlNetMode;
  setControlNetMode: (mode: ControlNetMode) => void;
  controlNetStrength: number;
  setControlNetStrength: (val: number) => void;

  // Parametric & Sketch
  sketchImage: string | null;
  setSketchImage: (url: string | null) => void;
  sketchCategory: SketchCategory;
  setSketchCategory: (cat: SketchCategory) => void;
  isConverted: boolean;
  setIsConverted: (val: boolean) => void;

  deskWidth: number;
  setDeskWidth: (w: number) => void;
  deskDepth: number;
  setDeskDepth: (d: number) => void;
  deskHeight: number;
  setDeskHeight: (h: number) => void;
  hasDrawers: boolean;
  setHasDrawers: (val: boolean) => void;
  hasShelves: boolean;
  setHasShelves: (val: boolean) => void;

  // AI Render Pipeline
  isRendering: boolean;
  setIsRendering: (status: boolean) => void;
  renderResult: string | null;
  setRenderResult: (url: string | null) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
}

export const CATEGORY_PRESETS: Record<NonNullable<SketchCategory>, {
  width: number; depth: number; height: number; drawers: boolean; shelves: boolean;
}> = {
  'meja-kerja':   { width: 1.8, depth: 0.8,  height: 0.75, drawers: true,  shelves: false },
  'meja-belajar': { width: 1.2, depth: 0.6,  height: 0.75, drawers: false, shelves: true  },
  'meja-rapat':   { width: 3.0, depth: 1.2,  height: 0.75, drawers: false, shelves: false },
  'lemari':       { width: 1.5, depth: 0.6,  height: 2.1,  drawers: true,  shelves: true  },
  'sofa':         { width: 2.2, depth: 0.9,  height: 0.85, drawers: false, shelves: false },
  'rak-buku':     { width: 1.0, depth: 0.35, height: 1.8,  drawers: false, shelves: true  },
  'kursi':        { width: 0.6, depth: 0.6,  height: 0.85, drawers: false, shelves: false },
  'lounge-room':  { width: 3.5, depth: 2.5,  height: 2.8,  drawers: false, shelves: true  },
  'studio-apartment': { width: 4.0, depth: 3.0, height: 2.8, drawers: true, shelves: true },
};

export const useStudioStore = create<StudioState>((set) => ({
  layoutMode: 'split',
  setLayoutMode: (mode) => set({ layoutMode: mode }),

  leftPanelMode: 'canvas',
  setLeftPanelMode: (mode) => set({ leftPanelMode: mode }),

  activePreset: 'minimalist',
  setActivePreset: (preset) => set({ activePreset: preset }),

  selectedPalette: COLOR_PALETTES[0],
  setSelectedPalette: (palette) => set({
    selectedPalette: palette,
    wallColor: palette.wallHex,
    furnitureColor: palette.furnitureHex,
    customPrompt: palette.prompt,
  }),
  wallColor: COLOR_PALETTES[0].wallHex,
  setWallColor: (hex) => set({ wallColor: hex }),
  furnitureColor: COLOR_PALETTES[0].furnitureHex,
  setFurnitureColor: (hex) => set({ furnitureColor: hex }),
  lightingMood: 'daylight',
  setLightingMood: (mood) => set({ lightingMood: mood }),

  selectedRoomType: 'lounge',
  setSelectedRoomType: (type) => set({ selectedRoomType: type }),
  roomLength: 5.0,
  setRoomLength: (val) => set({ roomLength: val }),
  roomWidth: 4.0,
  setRoomWidth: (val) => set({ roomWidth: val }),

  controlNetMode: 'lineart',
  setControlNetMode: (mode) => set({ controlNetMode: mode }),
  controlNetStrength: 0.85,
  setControlNetStrength: (val) => set({ controlNetStrength: val }),

  sketchImage: null,
  setSketchImage: (url) => set({ sketchImage: url, isConverted: false, sketchCategory: null }),
  sketchCategory: null,
  setSketchCategory: (cat) => set({ sketchCategory: cat }),
  isConverted: false,
  setIsConverted: (val) => set({ isConverted: val }),

  deskWidth: 1.8,
  setDeskWidth: (w) => set({ deskWidth: w }),
  deskDepth: 0.8,
  setDeskDepth: (d) => set({ deskDepth: d }),
  deskHeight: 0.75,
  setDeskHeight: (h) => set({ deskHeight: h }),
  hasDrawers: true,
  setHasDrawers: (val) => set({ hasDrawers: val }),
  hasShelves: false,
  setHasShelves: (val) => set({ hasShelves: val }),

  isRendering: false,
  setIsRendering: (status) => set({ isRendering: status }),
  renderResult: null,
  setRenderResult: (url) => set({ renderResult: url }),
  customPrompt: COLOR_PALETTES[0].prompt,
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
}));
