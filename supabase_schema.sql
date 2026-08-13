CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE palettes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colors TEXT[] NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('nice-color-palettes', 'dictionary-of-colors', 'color-palettes-json', 'generated')),
    category TEXT,
    style_tags TEXT[],
    dominant_hue NUMERIC CHECK (dominant_hue >= 0 AND dominant_hue <= 360),
    avg_saturation NUMERIC CHECK (avg_saturation >= 0 AND avg_saturation <= 100),
    avg_lightness NUMERIC CHECK (avg_lightness >= 0 AND avg_lightness <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_colors UNIQUE (colors)
);

CREATE INDEX idx_palettes_style_tags ON palettes USING GIN(style_tags);
CREATE INDEX idx_palettes_hue ON palettes(dominant_hue);

ALTER TABLE palettes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view palettes" ON palettes FOR SELECT USING (true);
