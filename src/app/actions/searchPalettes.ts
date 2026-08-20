'use server';

import { supabase } from '@/lib/supabase';
import { generatePaletteFromSeed, getSemanticSeeds } from '@/lib/colorGenerator';

export async function searchPalettesAction(category: string, keyword: string, limitCount: number = 48) {
  try {
    let query = supabase.from('palettes').select('*', { count: 'exact' });
    
    const kwRaw = keyword.toLowerCase().trim();
    const cat = category === 'Semua' ? '' : category;

    // Tokenize multi-word input (e.g. "kamar tidur minimalis" -> ["kamar", "tidur", "minimalis"])
    const tokens = kwRaw.split(/\s+/).filter(t => t.length > 1);

    const isMetal = tokens.some(t => ['besi', 'rantai', 'baja', 'metal', 'logam', 'pipa', 'chrome', 'alum'].includes(t));
    const isWood = tokens.some(t => ['kayu', 'lemari', 'meja', 'rotan', 'bambu', 'furniture', 'mebel'].includes(t)) || cat === 'Kursi' || cat === 'Meja';
    const isLeather = tokens.some(t => ['kulit', 'leather', 'sofa', 'jok'].includes(t));
    const isRoom = tokens.some(t => ['kamar', 'tidur', 'ruang', 'tamu', 'dapur', 'toilet', 'balkon'].includes(t)) || cat === 'Kamar' || cat === 'RuangTamu' || cat === 'Dapur';
    const isPastel = tokens.some(t => ['pastel', 'lembut', 'soft'].includes(t));
    const isWarm = tokens.some(t => ['hangat', 'warm'].includes(t));
    const isCool = tokens.some(t => ['sejuk', 'tenang', 'cool'].includes(t));

    // Intelligent Semantic Routing
    if (isMetal) {
      // Iron & Steel: low saturation slate/grey/charcoal
      query = query.lte('avg_saturation', 25);
    } else if (isWood) {
      // Wood & Furniture: warm brown/teak/oak hue range (10 to 50)
      query = query.gte('dominant_hue', 10).lte('dominant_hue', 50).lte('avg_saturation', 65);
    } else if (isLeather) {
      query = query.gte('dominant_hue', 10).lte('dominant_hue', 45).lte('avg_saturation', 60);
    } else if (isPastel) {
      query = query.gte('avg_lightness', 70).lte('avg_saturation', 40);
    } else if (isWarm) {
      query = query.contains('style_tags', ['hangat']);
    } else if (isCool) {
      query = query.contains('style_tags', ['sejuk']);
    } else if (isRoom) {
      query = query.or('category.eq.Ruangan,style_tags.cs.{"pastel","tenang","minimalis"}');
    } else if (cat === 'Fashion') {
      query = query.eq('category', 'Fashion');
    } else if (cat === 'Branding') {
      query = query.or('category.eq.Branding,category.eq.Web Design');
    } else if (cat) {
      query = query.eq('category', cat);
    }

    // Overlap Search for Multi-Word Tokens in style_tags
    if (tokens.length > 0 && !isMetal && !isWood && !isLeather) {
      const validTags = tokens.filter(t => ['hangat', 'sejuk', 'tenang', 'pastel', 'minimalis', 'gelap', 'industrial', 'monokromatik', 'ruangan', 'furniture', 'branding', 'fashion'].includes(t));
      if (validTags.length > 0) {
        query = query.overlaps('style_tags', validTags);
      }
    }

    const { data: dbPalettes, count, error } = await query
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) {
      console.error("Database search error:", error);
    }

    const results = dbPalettes || [];

    // Semantic Generator Fallback if database results are fewer than 6
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generatedFallback: any[] = [];
    if (results.length === 0 || (kwRaw && results.length < 6)) {
      const { seeds, defaultScheme } = getSemanticSeeds(kwRaw || category);

      const generatedNeeded = 6 - results.length;
      for (let i = 0; i < generatedNeeded; i++) {
        const seedHex = seeds[i % seeds.length];
        const generatedHexes = generatePaletteFromSeed(seedHex, defaultScheme, 5);
        
        generatedFallback.push({
          id: `gen-semantic-${Date.now()}-${i}`,
          name: error ? `Error: ${error.message || JSON.stringify(error)}` : `Rekomendasi Warna "${keyword || category}" #${i + 1}`,
          category: 'Rekomendasi Spesifik',
          source: 'generated',
          style_tags: ['semantic', kwRaw],
          colors: generatedHexes.map((hex, idx) => ({ hex, name: `Warna ${idx + 1}` }))
        });
      }
    }

    // Convert raw DB results to UI-friendly structure with contextual names
    const formattedResults = results.map((item, index) => {
      const hexList: string[] = Array.isArray(item.colors) ? item.colors : [];
      
      let contextualName = item.name;
      if (!contextualName) {
        if (isMetal) contextualName = `Palet Warna Besi & Metal #${index + 1}`;
        else if (isWood) contextualName = `Palet Warna Lemari & Kayu #${index + 1}`;
        else if (kwRaw) contextualName = `Rekomendasi Warna "${keyword}" #${index + 1}`;
        else if (cat === 'Kursi') contextualName = `Rekomendasi Warna Kursi & Sofa #${index + 1}`;
        else if (cat === 'Meja') contextualName = `Palet Warna Meja & Material #${index + 1}`;
        else if (cat === 'Kamar') contextualName = `Palet Kamar Tidur Minimalis #${index + 1}`;
        else if (cat === 'Dapur') contextualName = `Kombinasi Warna Dapur #${index + 1}`;
        else contextualName = `${item.category || 'Curated'} Palette #${index + 1}`;
      }

      return {
        id: item.id || `palette-${index}`,
        name: contextualName,
        category: item.category || (cat !== 'Semua' ? cat : 'General'),
        source: item.source,
        style_tags: item.style_tags || [],
        colors: hexList.map((hex: string, i: number) => ({
          hex,
          name: `Color ${i + 1}`
        }))
      };
    });

    const finalPalettes = formattedResults.length >= 6 ? formattedResults : [...formattedResults, ...generatedFallback];

    return {
      palettes: finalPalettes,
      totalCount: count && count > 0 ? count : finalPalettes.length
    };
  } catch (err) {
    console.error('Action error:', err);
    return { palettes: [], totalCount: 0 };
  }
}
