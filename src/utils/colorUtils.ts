export function hexToRgb(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToHsl(hex: string): string {
  const { h, s, l } = getRawHsl(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getRawRgb(hex: string) {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

export function getRawHsl(hex: string) {
  let r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  let g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  let b = Number.parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function isDarkColor(hex: string): boolean {
  const rgb = Number.parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}

export function generateShades(hex: string): string[] {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  
  const shades = [];
  for (let i = 1; i <= 9; i++) {
    const factor = 1 - (i * 0.1);
    const rs = Math.round(r * factor);
    const gs = Math.round(g * factor);
    const bs = Math.round(b * factor);
    shades.push(`#${((1 << 24) + (rs << 16) + (gs << 8) + bs).toString(16).slice(1).padStart(6, '0')}`);
  }
  return shades;
}

export function generateTints(hex: string): string[] {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  
  const tints = [];
  for (let i = 1; i <= 9; i++) {
    const factor = i * 0.1;
    const rt = Math.round(r + (255 - r) * factor);
    const gt = Math.round(g + (255 - g) * factor);
    const bt = Math.round(b + (255 - b) * factor);
    tints.push(`#${((1 << 24) + (rt << 16) + (gt << 8) + bt).toString(16).slice(1).padStart(6, '0')}`);
  }
  return tints;
}

export function getRelativeLuminance(hex: string): number {
  const r8 = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g8 = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b8 = Number.parseInt(hex.slice(5, 7), 16) / 255;

  const r = r8 <= 0.03928 ? r8 / 12.92 : Math.pow((r8 + 0.055) / 1.055, 2.4);
  const g = g8 <= 0.03928 ? g8 / 12.92 : Math.pow((g8 + 0.055) / 1.055, 2.4);
  const b = b8 <= 0.03928 ? b8 / 12.92 : Math.pow((b8 + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function getWCAGRating(ratio: number) {
  return {
    AA: ratio >= 4.5,
    AALarge: ratio >= 3,
    AAA: ratio >= 7,
    AAALarge: ratio >= 4.5
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function getRandomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

export function getColorHarmonies(hex: string) {
  const { h, s, l } = getRawHsl(hex);

  const getHex = (hue: number) => hslToHex((hue + 360) % 360, s, l);

  return {
    complementary: [getHex(h + 180)],
    splitComplementary: [getHex(h + 150), getHex(h + 210)],
    analogous: [getHex(h - 30), getHex(h + 30)],
    triadic: [getHex(h + 120), getHex(h + 240)],
    tetradic: [getHex(h + 60), getHex(h + 180), getHex(h + 240)],
    square: [getHex(h + 90), getHex(h + 180), getHex(h + 270)]
  };
}

export function isVibratingCombo(color1: string, color2: string): boolean {
  const hsl1 = getRawHsl(color1);
  const hsl2 = getRawHsl(color2);

  // Both must be robustly saturated (> 50%)
  if (hsl1.s <= 50 || hsl2.s <= 50) return false;

  // Mid-tone lightness, vibrations are weaker in very light or dark tones
  if (hsl1.l < 30 || hsl1.l > 70 || hsl2.l < 30 || hsl2.l > 70) return false;

  // Luma difference should be small to create the "vibrating" bleeding edge effect
  const lDiff = Math.abs(hsl1.l - hsl2.l);
  if (lDiff > 20) return false;

  // Opposite hues
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  
  if (hueDiff < 100) return false;

  return true;
}

export function getRawCmyk(hex: string) {
  let { r, g, b } = getRawRgb(hex);
  r /= 255; g /= 255; b /= 255;
  let k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  let c = Math.round(((1 - r - k) / (1 - k)) * 100);
  let m = Math.round(((1 - g - k) / (1 - k)) * 100);
  let y = Math.round(((1 - b - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

export function cmykToHex(c: number, m: number, y: number, k: number): string {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return rgbToHex(r, g, b);
}

export function getRawOklch(hex: string) {
  let { r, g, b } = getRawRgb(hex);
  const f = (c: number) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  const lr = f(r / 255), lg = f(g / 255), lb = f(b / 255);
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_c = Math.cbrt(l_), m_c = Math.cbrt(m_), s_c = Math.cbrt(s_);
  const L = 0.2104542553 * l_c + 0.7936177850 * m_c - 0.0040720468 * s_c;
  const a = 1.9779984951 * l_c - 2.4285922050 * m_c + 0.4505937099 * s_c;
  const b_ = 0.0259040371 * l_c + 0.7827717662 * m_c - 0.8086757660 * s_c;
  const C = Math.sqrt(a * a + b_ * b_);
  const H = (Math.atan2(b_, a) * (180 / Math.PI) + 360) % 360;
  return { l: Math.round(L * 100), c: Math.round(C * 1000) / 1000, h: Math.round(H) };
}

export function oklchToHex(l: number, c: number, h: number): string {
  l /= 100;
  const h_rad = h * (Math.PI / 180);
  const a = c * Math.cos(h_rad);
  const b_ = c * Math.sin(h_rad);

  const l_c = l + 0.3963377774 * a + 0.2158037573 * b_;
  const m_c = l - 0.1055613458 * a - 0.0638541728 * b_;
  const s_c = l - 0.0894841775 * a - 1.2914855480 * b_;

  const l_ = l_c * l_c * l_c;
  const m_ = m_c * m_c * m_c;
  const s_ = s_c * s_c * s_c;

  const lr = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186143 * m_ + 1.7076147010 * s_;

  const f = (c: number) => c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
  const r = Math.round(Math.max(0, Math.min(1, f(lr))) * 255);
  const g = Math.round(Math.max(0, Math.min(1, f(lg))) * 255);
  const b = Math.round(Math.max(0, Math.min(1, f(lb))) * 255);

  return rgbToHex(r, g, b);
}

type ToneVariant = 'pastel' | 'vivid' | 'dark' | 'muted' | 'balanced';

interface PsychologyProfile {
  emotions: string[];
  desc: string;
}

interface HueEntry {
  range: [number, number];
  name: string;
  variants: Record<ToneVariant, PsychologyProfile>;
}

function getToneVariant(s: number, l: number): { variant: ToneVariant; label: string } {
  if (l > 72 && s < 65) return { variant: 'pastel', label: 'Soft & Gentle' };
  // Dark/Shade: low lightness (shades)
  if (l < 30) return { variant: 'dark', label: 'Deep & Commanding' };
  // Muted/Tone: low saturation, mid lightness (desaturated/tones)
  if (s < 35) return { variant: 'muted', label: 'Muted & Sophisticated' };
  // Vivid: high saturation (pure/vivid)
  if (s > 65) return { variant: 'vivid', label: 'Vibrant & Bold' };
  // Balanced
  return { variant: 'balanced', label: 'Natural & Versatile' };
}

export function getColorPsychology(hex: string) {
  const { h, s, l } = getRawHsl(hex);

  if (s < 12) {
    if (l > 90) return {
      name: "White",
      tone: "Pure & Minimalist",
      emotions: ["Purity", "Clarity", "New Beginnings"],
      description: "A blank canvas that symbolizes infinite possibility. It reduces visual clutter and provides the ultimate breathing space for surrounding elements."
    };
    if (l < 15) return {
      name: "Black",
      tone: "Absolute & Powerful",
      emotions: ["Authority", "Prestige", "Mystery"],
      description: "The most commanding visual presence. It absorbs light and projects power, luxury, and an impenetrable sense of sophisticated mystery."
    };
    if (l > 60) return {
      name: "Light Grey",
      tone: "Neutral & Airy",
      emotions: ["Objectivity", "Clarity", "Subtlety"],
      description: "A refined neutral that provides a calm, professional foundation. It eliminates distraction and lets content take center stage."
    };
    return {
      name: "Grey",
      tone: "Neutral & Anchoring",
      emotions: ["Balance", "Maturity", "Composure"],
      description: "A color of stability and timelessness. It grounds dynamic compositions and signals reliability without competing for attention."
    };
  }

  // 12-Hue PAD Psychology Matrix
  const hueMatrix: HueEntry[] = [
    {
      range: [350, 15], name: "Red",
      variants: {
        pastel: { emotions: ["Tenderness", "Innocence", "Calm Affection"], desc: "Red's aggressive arousal is completely neutralized. This soft blush evokes universal love, gentleness, and physical relaxation — lowering anxiety while maintaining warmth." },
        vivid: { emotions: ["Passion", "Urgency", "Impulse"], desc: "Maximum arousal state. Raises heart rate, blood pressure, and breathing — triggering fight-or-flight. Represents danger, desire, and immediate action." },
        dark: { emotions: ["Authority", "Controlled Power", "Elegance"], desc: "Transforms red's impulsive fire into intellectual weight. Burgundy and crimson convey nobility, fine wine, and deep seriousness — demanding respect, not reaction." },
        muted: { emotions: ["Nostalgia", "Earthiness", "Rustic Comfort"], desc: "Stripped of alarm, this terracotta tone feels organic and grounded. It creates inviting, homey spaces reminiscent of sun-baked clay and autumn harvests." },
        balanced: { emotions: ["Energy", "Confidence", "Warmth"], desc: "A well-tempered red that balances stimulation with approachability. It energizes without overwhelming." }
      }
    },
    {
      range: [15, 30], name: "Red-Orange",
      variants: {
        pastel: { emotions: ["Warmth", "Intimacy", "Gentle Energy"], desc: "A soft coral that mirrors human skin tones, evoking intimacy, beauty care, and tender connection. Feels inviting without being demanding." },
        vivid: { emotions: ["Excitement", "Appetite", "Dynamic Action"], desc: "Maximizes appetite stimulation and physical hype. Vermilion-level energy that drives impulse decisions and embodies athletic dynamism." },
        dark: { emotions: ["Stability", "Harvest", "Endurance"], desc: "Brick and terracotta tones channel autumn resilience. They project grounded dependability and traditional craftsmanship." },
        muted: { emotions: ["Domesticity", "Natural Warmth", "Ease"], desc: "A calming earthy tone that feels homely and ecological. Removed from red-orange's high-energy core, it creates safe, nurturing environments." },
        balanced: { emotions: ["Sociability", "Vitality", "Enthusiasm"], desc: "Blends red's intensity with orange's friendliness into an approachable, outgoing energy." }
      }
    },
    {
      range: [30, 48], name: "Orange",
      variants: {
        pastel: { emotions: ["Kindness", "Support", "Approachability"], desc: "Peach tones evoke gentle encouragement and soft dialogue. Psychologically soothing yet subtly warm, they work perfectly in wellness and care contexts." },
        vivid: { emotions: ["Adventure", "Alertness", "Playfulness"], desc: "Commands instant visibility — the reason for traffic cones and life vests. Radiates youthful optimism, fearless exploration, and uninhibited social energy." },
        dark: { emotions: ["Ambition", "Assertion", "Tension"], desc: "Burnt orange channels intense drive and self-proving energy. At its darkest, it risks projecting excessive ambition, opportunism, or aggressive competitiveness." },
        muted: { emotions: ["Comfort", "Earth Tones", "Belonging"], desc: "Autumn leaves and warm wood. This desaturated orange provides worldly comfort and ecological grounding without visual fatigue." },
        balanced: { emotions: ["Creativity", "Optimism", "Social Warmth"], desc: "The sweet spot of orange — creative, warm, and inviting without the extremes of neon or rust." }
      }
    },
    {
      range: [48, 60], name: "Amber",
      variants: {
        pastel: { emotions: ["Dawn", "Gentle Hope", "Inner Light"], desc: "Like the first rays of sunrise, this delicate warm glow provides comforting optimism and a quiet invitation to begin anew." },
        vivid: { emotions: ["Confidence", "Boldness", "Radiance"], desc: "Projects strong self-assurance and outgoing charisma. Highly energizing but can tip into perceived arrogance when overused." },
        dark: { emotions: ["Wealth", "Heritage", "Prestige"], desc: "Approaches gold — channeling centuries of royal association. Communicates traditional richness, permanence, and authoritative warmth." },
        muted: { emotions: ["Timelessness", "Comfort", "Yearning"], desc: "A nostalgic amber that combines autumnal wistfulness with the security of home. It evokes fond memories and quiet contentment." },
        balanced: { emotions: ["Warmth", "Positivity", "Invitation"], desc: "Balanced amber radiates welcoming energy — cheerful without being childish, warm without being aggressive." }
      }
    },
    {
      range: [60, 80], name: "Yellow",
      variants: {
        pastel: { emotions: ["New Beginnings", "Softened Joy", "Childhood"], desc: "Yellow's stimulating glare is gently diffused. This lemon chiffon evokes innocent optimism, caring environments, and fresh starts without visual strain." },
        vivid: { emotions: ["Alertness", "Serotonin Boost", "Maximum Visibility"], desc: "The most luminous color in the spectrum. Instantly captures attention, triggers serotonin release, and creates the highest contrast with black — hence its use in warnings and taxis." },
        dark: { emotions: ["Intellect", "Gravitas", "Grounded Warmth"], desc: "Mustard transforms yellow's fleeting cheer into lasting sophistication. It conveys bookish wisdom, autumnal depth, and corporate warmth." },
        muted: { emotions: ["Natural Support", "Linen", "Quiet Background"], desc: "Ecru and flax tones lose all solar associations. They become invisible supporters — natural, organic backdrops that never compete with content." },
        balanced: { emotions: ["Happiness", "Clarity", "Mental Stimulation"], desc: "Pure, balanced yellow activates the analytical mind, promoting clear thinking and an uplifting sense of possibility." }
      }
    },
    {
      range: [80, 140], name: "Green",
      variants: {
        pastel: { emotions: ["Healing", "Tranquility", "Stress Relief"], desc: "Mint tones have scientifically documented calming effects. They lower anxiety levels, promote recovery, and create therapeutic spaces ideal for healthcare settings." },
        vivid: { emotions: ["Vitality", "Nature", "Prosperity"], desc: "Grass green embodies life force, organic health, and financial growth. The color of ecological movements and growth-oriented brands." },
        dark: { emotions: ["Stability", "Ambition", "Deep Roots"], desc: "Forest green projects institutional permanence and economic power. It signals reliability and wealth but at its extreme can evoke greed and impenetrability." },
        muted: { emotions: ["Harmony", "Rest", "Organic Calm"], desc: "Sage green is the antidote to screen fatigue. It minimizes visual strain, creates gender-neutral warmth, and maximizes feelings of natural balance." },
        balanced: { emotions: ["Growth", "Safety", "Renewal"], desc: "The most restful color for the human eye. It signals safety, natural abundance, and continuous renewal." }
      }
    },
    {
      range: [140, 185], name: "Teal",
      variants: {
        pastel: { emotions: ["Emotional Healing", "Purification", "Protection"], desc: "Aqua tones evoke water's cleansing power. They provide psychological shielding, spiritual calm, and a sense of emotional recovery." },
        vivid: { emotions: ["Tropical Energy", "Inspiration", "Communication"], desc: "Turquoise carries the vibrancy of tropical seas. It opens creative channels, sparks joyful dialogue, and creates an atmosphere of inspired freshness." },
        dark: { emotions: ["Sophistication", "Exclusivity", "Enigma"], desc: "Deep teal projects dramatic luxury, intellectual complexity, and elite taste. A premium color that adds mystery and richness to any context." },
        muted: { emotions: ["Reflection", "Modern Calm", "Thoughtfulness"], desc: "A contemplative, non-fatiguing tone perfect for interfaces. It balances technological modernity with human-centered warmth." },
        balanced: { emotions: ["Refreshment", "Clarity", "Equilibrium"], desc: "Balanced teal merges green's harmony with blue's trust — creating a versatile, refreshing, and universally pleasant presence." }
      }
    },
    {
      range: [185, 255], name: "Blue",
      variants: {
        pastel: { emotions: ["Freedom", "Peace", "Serenity"], desc: "Baby blue mirrors clear skies — reducing cortisol, lowering blood pressure, and creating vast psychological openness. It protects without dominating." },
        vivid: { emotions: ["Trust", "Efficiency", "Dynamic Clarity"], desc: "Azure commands professional admiration and technological confidence. The go-to for platforms needing speed, reliability, and open communication." },
        dark: { emotions: ["Authority", "Law", "Unwavering Loyalty"], desc: "Navy blue is the universal symbol of institutional power. It governs corporate boardrooms, legal systems, and military uniforms — projecting unyielding discipline." },
        muted: { emotions: ["Durability", "Quiet Loyalty", "Melancholy"], desc: "Steel blue and denim tones evoke timeless reliability and industrial strength. However, excessive use can project emotional distance and depression." },
        balanced: { emotions: ["Logic", "Productivity", "Calm Focus"], desc: "The world's most preferred color. Blue reduces heart rate, promotes logical thinking, and builds deep trust through consistent calm." }
      }
    },
    {
      range: [255, 285], name: "Indigo",
      variants: {
        pastel: { emotions: ["Dreaminess", "Gentle Calm", "Ethereal"], desc: "A weightless lavender-indigo that dissolves mental tension. It eases the transition to rest and creates a boundary-softened, meditative atmosphere." },
        vivid: { emotions: ["Artistic Vision", "Innovation", "Boundary-Breaking"], desc: "Electrifying indigo pushes creative limits. It stimulates visionary thinking, breaks conventional patterns, and projects futuristic ambition." },
        dark: { emotions: ["Deep Introspection", "Cosmic Mystery", "Wisdom"], desc: "The color of midnight oceans and distant nebulae. Deep indigo draws the mind inward toward meditation, spiritual exploration, and profound contemplation." },
        muted: { emotions: ["Modern Edge", "Industrial Cool", "Reserved Power"], desc: "A sophisticated gray-purple that projects technological capability without emotional excess. Feels corporate yet creative." },
        balanced: { emotions: ["Intuition", "Contemplation", "Depth"], desc: "Indigo bridges analytical blue and mystical violet — encouraging deep thought, heightened perception, and structured imagination." }
      }
    },
    {
      range: [285, 320], name: "Purple",
      variants: {
        pastel: { emotions: ["Romance", "Nostalgia", "Gentle Healing"], desc: "Lavender is deeply therapeutic. It calms trauma responses, evokes romantic nostalgia, and creates safe emotional spaces with its soft, feminine character." },
        vivid: { emotions: ["Magic", "Fantasy", "Creative Power"], desc: "Bright purple ignites imagination and wonder. It channels childhood fantasy, mystical energy, and showmanship — the color of magicians and visionaries." },
        dark: { emotions: ["Royal Authority", "Opulence", "Gravitas"], desc: "Eggplant and plum tones carry centuries of regal weight. They project unquestioned luxury and elite status, but may feel oppressive in large doses." },
        muted: { emotions: ["Elegant Melancholy", "Old World Charm", "Quiet Dignity"], desc: "Dusty purple whispers of aged manuscripts and faded royalty. It provides understated sophistication with a sense of historical depth." },
        balanced: { emotions: ["Imagination", "Luxury", "Spiritual Balance"], desc: "Purple holds the tension between red's passion and blue's reason — sparking creativity at the intersection of body and mind." }
      }
    },
    {
      range: [320, 340], name: "Magenta",
      variants: {
        pastel: { emotions: ["Compassion", "Empathy", "Universal Love"], desc: "Pink-lavender tones dissolve conflict. They project unconditional acceptance, selfless kindness, and emotional availability." },
        vivid: { emotions: ["Rebellion", "Innovation", "Drama"], desc: "Fuchsia shatters conventions. It's the color of avant-garde movements, radical self-expression, and unapologetic creative disruption." },
        dark: { emotions: ["Haute Couture", "Exotic Mystery", "Deep Allure"], desc: "Orchid-dark magenta channels fashion's highest echelon — projecting enigmatic beauty, exotic sophistication, and rare exclusivity." },
        muted: { emotions: ["Mature Compassion", "Boundaries", "Refined Grace"], desc: "A balanced warmth that knows its limits. It expresses care with dignity, offering emotional support without losing composure." },
        balanced: { emotions: ["Harmony", "Transformation", "Creative Bridge"], desc: "Extra-spectral magenta exists only in the mind — bridging the spectrum's two edges. It represents universal connection and transformative change." }
      }
    },
    {
      range: [340, 350], name: "Rose",
      variants: {
        pastel: { emotions: ["Tenderness", "Sweetness", "Blush"], desc: "The softest expression of warmth. Rose pastels feel like a gentle blush — nurturing, non-threatening, and deeply comforting." },
        vivid: { emotions: ["Passion", "Romance", "Vibrant Femininity"], desc: "Hot rose commands attention with romantic intensity. It's bold, flirtatious, and unapologetically expressive." },
        dark: { emotions: ["Depth", "Wine", "Sensual Elegance"], desc: "Deep rose carries the weight of aged wine — rich, contemplative, and imbued with sensual sophistication." },
        muted: { emotions: ["Vintage", "Dusty Romance", "Subtle Warmth"], desc: "Faded rose evokes pressed flowers and vintage love letters — carrying emotional weight in the most understated way." },
        balanced: { emotions: ["Affection", "Beauty", "Gentle Strength"], desc: "Balanced rose combines warmth with poise — expressing love and beauty without excess." }
      }
    }
  ];

  // Find hue match
  const hueMatch = hueMatrix.find(entry => {
    if (entry.range[0] > entry.range[1]) {
      return h >= entry.range[0] || h < entry.range[1];
    }
    return h >= entry.range[0] && h < entry.range[1];
  });

  const fallback: HueEntry = {
    range: [0, 360], name: "Unique Hue",
    variants: {
      pastel: { emotions: ["Softness", "Subtlety"], desc: "A delicate and unique tone." },
      vivid: { emotions: ["Energy", "Distinction"], desc: "A striking and original shade." },
      dark: { emotions: ["Depth", "Intrigue"], desc: "A deep and compelling color." },
      muted: { emotions: ["Restraint", "Character"], desc: "An understated hue with personality." },
      balanced: { emotions: ["Diversity", "Modernity"], desc: "A complex shade with its own emotional fingerprint." }
    }
  };

  const entry = hueMatch || fallback;
  const { variant, label } = getToneVariant(s, l);
  const profile = entry.variants[variant];

  return {
    name: entry.name,
    tone: label,
    emotions: profile.emotions,
    description: profile.desc
  };
}

