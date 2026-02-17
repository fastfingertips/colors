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
