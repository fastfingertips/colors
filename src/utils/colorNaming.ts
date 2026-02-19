import { getRawHsl } from './colorUtils';

interface NamedColor {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  lab?: [number, number, number]; // Cached L*a*b* values
}

// sRGB → Linear RGB
function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Linear RGB → XYZ (D65 illuminant)
function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return [
    (0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb) * 100,
    (0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb) * 100,
    (0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb) * 100
  ];
}

// XYZ → CIELAB
function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 reference white
  const xn = 95.047, yn = 100.000, zn = 108.883;
  const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);

  const fx = f(x / xn);
  const fy = f(y / yn);
  const fz = f(z / zn);

  return [
    116 * fy - 16,       // L*
    500 * (fx - fy),     // a*
    200 * (fy - fz)      // b*
  ];
}

// RGB → CIELAB
function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

// Delta-E (CIE76) — simplified but effective for naming purposes
// ΔE < 2: imperceptible, ΔE < 5: close match, ΔE < 10: same family
function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );
}

// ── Named Color Database ───────────────────────────────────────────────────
// Curated from CSS named colors + design-relevant additions
const namedColorsRaw: [string, string][] = [
  // Reds
  ["Crimson", "#DC143C"],
  ["Firebrick", "#B22222"],
  ["Indian Red", "#CD5C5C"],
  ["Salmon", "#FA8072"],
  ["Light Coral", "#F08080"],
  ["Dark Red", "#8B0000"],
  ["Maroon", "#800000"],
  ["Scarlet", "#FF2400"],
  ["Ruby", "#E0115F"],
  ["Burgundy", "#800020"],
  ["Wine", "#722F37"],
  // Reds-Oranges
  ["Tomato", "#FF6347"],
  ["Coral", "#FF7F50"],
  ["Vermilion", "#E34234"],
  ["Terracotta", "#E2725B"],
  // Oranges
  ["Orange Red", "#FF4500"],
  ["Dark Orange", "#FF8C00"],
  ["Orange", "#FFA500"],
  ["Tangerine", "#FF9966"],
  ["Peach", "#FFCBA4"],
  ["Apricot", "#FBCEB1"],
  ["Burnt Orange", "#CC5500"],
  ["Rust", "#B7410E"],
  // Gold / Amber
  ["Gold", "#FFD700"],
  ["Amber", "#FFBF00"],
  ["Goldenrod", "#DAA520"],
  ["Dark Goldenrod", "#B8860B"],
  ["Honey", "#EB9605"],
  ["Champagne", "#F7E7CE"],
  // Yellows
  ["Yellow", "#FFFF00"],
  ["Lemon", "#FFF44F"],
  ["Canary", "#FFEF00"],
  ["Mustard", "#FFDB58"],
  ["Saffron", "#F4C430"],
  ["Cream", "#FFFDD0"],
  ["Ivory", "#FFFFF0"],
  ["Flax", "#EEDC82"],
  ["Khaki", "#F0E68C"],
  ["Dark Khaki", "#BDB76B"],
  // Yellow-Greens
  ["Chartreuse", "#7FFF00"],
  ["Lime", "#00FF00"],
  ["Lime Green", "#32CD32"],
  ["Yellow Green", "#9ACD32"],
  ["Lawn Green", "#7CFC00"],
  ["Olive", "#808000"],
  ["Dark Olive", "#556B2F"],
  ["Olive Drab", "#6B8E23"],
  // Greens
  ["Green", "#008000"],
  ["Forest Green", "#228B22"],
  ["Sea Green", "#2E8B57"],
  ["Spring Green", "#00FF7F"],
  ["Emerald", "#50C878"],
  ["Jade", "#00A86B"],
  ["Sage", "#BCB88A"],
  ["Mint", "#98FF98"],
  ["Celadon", "#ACE1AF"],
  ["Hunter Green", "#355E3B"],
  ["Fern", "#4F7942"],
  ["Moss", "#8A9A5B"],
  ["Pistachio", "#93C572"],
  // Teals / Cyans
  ["Teal", "#008080"],
  ["Cyan", "#00FFFF"],
  ["Dark Cyan", "#008B8B"],
  ["Aqua", "#00FFFF"],
  ["Aquamarine", "#7FFFD4"],
  ["Turquoise", "#40E0D0"],
  ["Dark Turquoise", "#00CED1"],
  ["Medium Turquoise", "#48D1CC"],
  ["Light Sea Green", "#20B2AA"],
  ["Cadet Blue", "#5F9EA0"],
  // Blues
  ["Blue", "#0000FF"],
  ["Royal Blue", "#4169E1"],
  ["Cornflower", "#6495ED"],
  ["Steel Blue", "#4682B4"],
  ["Dodger Blue", "#1E90FF"],
  ["Deep Sky Blue", "#00BFFF"],
  ["Sky Blue", "#87CEEB"],
  ["Light Blue", "#ADD8E6"],
  ["Powder Blue", "#B0E0E6"],
  ["Alice Blue", "#F0F8FF"],
  ["Navy", "#000080"],
  ["Midnight Blue", "#191970"],
  ["Dark Blue", "#00008B"],
  ["Medium Blue", "#0000CD"],
  ["Cobalt", "#0047AB"],
  ["Sapphire", "#0F52BA"],
  ["Azure", "#007FFF"],
  ["Cerulean", "#007BA7"],
  ["Denim", "#1560BD"],
  ["Baby Blue", "#89CFF0"],
  ["Periwinkle", "#CCCCFF"],
  // Indigos / Blue-Violets
  ["Indigo", "#4B0082"],
  ["Slate Blue", "#6A5ACD"],
  ["Dark Slate Blue", "#483D8B"],
  ["Medium Slate Blue", "#7B68EE"],
  ["Blue Violet", "#8A2BE2"],
  // Purples / Violets
  ["Purple", "#800080"],
  ["Dark Violet", "#9400D3"],
  ["Dark Orchid", "#9932CC"],
  ["Medium Orchid", "#BA55D3"],
  ["Orchid", "#DA70D6"],
  ["Plum", "#DDA0DD"],
  ["Lavender", "#E6E6FA"],
  ["Thistle", "#D8BFD8"],
  ["Violet", "#EE82EE"],
  ["Eggplant", "#614051"],
  ["Mauve", "#E0B0FF"],
  ["Amethyst", "#9966CC"],
  ["Heather", "#B7C3D0"],
  // Magentas / Pinks
  ["Magenta", "#FF00FF"],
  ["Fuchsia", "#FF00FF"],
  ["Hot Pink", "#FF69B4"],
  ["Deep Pink", "#FF1493"],
  ["Medium Violet Red", "#C71585"],
  ["Pale Violet Red", "#DB7093"],
  ["Pink", "#FFC0CB"],
  ["Light Pink", "#FFB6C1"],
  ["Misty Rose", "#FFE4E1"],
  ["Rose", "#FF007F"],
  ["Blush", "#DE5D83"],
  ["Carnation", "#FFA6C9"],
  ["Raspberry", "#E30B5C"],
  ["Cerise", "#DE3163"],
  // Browns
  ["Brown", "#A52A2A"],
  ["Saddle Brown", "#8B4513"],
  ["Sienna", "#A0522D"],
  ["Chocolate", "#D2691E"],
  ["Peru", "#CD853F"],
  ["Sandy Brown", "#F4A460"],
  ["Tan", "#D2B48C"],
  ["Burlywood", "#DEB887"],
  ["Wheat", "#F5DEB3"],
  ["Bisque", "#FFE4C4"],
  ["Coffee", "#6F4E37"],
  ["Walnut", "#5C5248"],
  ["Mahogany", "#C04000"],
  ["Cinnamon", "#D2691E"],
  ["Chestnut", "#954535"],
  ["Umber", "#635147"],
  // Neutrals
  ["White", "#FFFFFF"],
  ["Snow", "#FFFAFA"],
  ["Ghost White", "#F8F8FF"],
  ["White Smoke", "#F5F5F5"],
  ["Gainsboro", "#DCDCDC"],
  ["Light Gray", "#D3D3D3"],
  ["Silver", "#C0C0C0"],
  ["Dark Gray", "#A9A9A9"],
  ["Gray", "#808080"],
  ["Dim Gray", "#696969"],
  ["Charcoal", "#36454F"],
  ["Onyx", "#353839"],
  ["Jet", "#343434"],
  ["Black", "#000000"],
  // Specialty
  ["Beige", "#F5F5DC"],
  ["Linen", "#FAF0E6"],
  ["Antique White", "#FAEBD7"],
  ["Papaya Whip", "#FFEFD5"],
  ["Blanched Almond", "#FFEBCD"],
  ["Cornsilk", "#FFF8DC"],
  ["Seashell", "#FFF5EE"],
  ["Old Lace", "#FDF5E6"],
  ["Honeydew", "#F0FFF0"],
  ["Lavender Blush", "#FFF0F5"],
];

// Parse and cache
let _cachedColors: NamedColor[] | null = null;

function getNamedColors(): NamedColor[] {
  if (_cachedColors) return _cachedColors;

  _cachedColors = namedColorsRaw.map(([name, hex]) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lab = rgbToLab(r, g, b);
    return { name, hex, r, g, b, lab };
  });

  return _cachedColors;
}

// Based on ISCC-NBS (National Bureau of Standards Circular 553)
function getISCCModifier(s: number, l: number): string {
  // Very dark (near black)
  if (l < 10) return "Blackish";
  if (l < 20 && s < 20) return "Very Dark Grayish";
  if (l < 20) return "Very Dark";
  // Dark range
  if (l < 35 && s > 70) return "Deep";
  if (l < 35 && s < 25) return "Dark Grayish";
  if (l < 35) return "Dark";
  // Mid-dark
  if (l < 50 && s > 80) return "Strong";
  if (l < 50 && s < 20) return "Grayish";
  if (l < 50 && s < 45) return "Moderate";
  if (l < 50) return "Moderate";
  // Mid-light
  if (l < 65 && s > 80) return "Vivid";
  if (l < 65 && s > 50) return "Brilliant";
  if (l < 65 && s < 20) return "Light Grayish";
  if (l < 65) return "Light";
  // Light range
  if (l < 80 && s > 60) return "Brilliant";
  if (l < 80 && s > 30) return "Light";
  if (l < 80) return "Pale";
  // Very light (near white)
  if (s > 40) return "Very Light";
  if (s > 15) return "Very Pale";
  return "Whitish";
}

function getHueFamilyName(h: number): string {
  // 29 hue sectors for fine-grained naming
  if (h < 8) return "Red";
  if (h < 20) return "Reddish Orange";
  if (h < 33) return "Orange";
  if (h < 42) return "Orange Yellow";
  if (h < 52) return "Yellow Orange";
  if (h < 62) return "Yellow";
  if (h < 73) return "Greenish Yellow";
  if (h < 85) return "Yellow Green";
  if (h < 105) return "Yellowish Green";
  if (h < 128) return "Green";
  if (h < 150) return "Bluish Green";
  if (h < 170) return "Green Blue";
  if (h < 185) return "Greenish Blue";
  if (h < 195) return "Cyan";
  if (h < 210) return "Blue Cyan";
  if (h < 230) return "Blue";
  if (h < 250) return "Blue";
  if (h < 265) return "Purplish Blue";
  if (h < 280) return "Violet";
  if (h < 295) return "Purple";
  if (h < 310) return "Reddish Purple";
  if (h < 330) return "Purplish Red";
  if (h < 345) return "Pink";
  return "Red"; // 345-360
}

export interface ColorName {
  /** The closest named color (e.g., "Cerulean", "Coral") */
  name: string;
  /** The ISCC-NBS formatted name (e.g., "Vivid Blue", "Deep Reddish Orange") */
  descriptor: string;
  /** Delta-E distance to the nearest named color (lower = closer match) */
  distance: number;
  /** The hex value of the nearest named color */
  nearestHex: string;
  /** Whether this is an exact or near-exact match (ΔE < 3) */
  exact: boolean;
}

export function getColorName(hex: string): ColorName {
  // Parse input
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(cleanHex.slice(1, 3), 16);
  const g = parseInt(cleanHex.slice(3, 5), 16);
  const b = parseInt(cleanHex.slice(5, 7), 16);
  const inputLab = rgbToLab(r, g, b);

  // Get HSL for ISCC-NBS modifiers
  const { h, s, l } = getRawHsl(cleanHex);

  // Stage 1: Find nearest named color using Delta-E
  const colors = getNamedColors();
  let bestMatch = colors[0];
  let bestDistance = Infinity;

  for (const color of colors) {
    const d = deltaE(inputLab, color.lab!);
    if (d < bestDistance) {
      bestDistance = d;
      bestMatch = color;
      if (d < 1) break; // Exact match, stop early
    }
  }

  // Stage 2: Build ISCC-NBS descriptor
  const modifier = getISCCModifier(s, l);
  const hueName = getHueFamilyName(h);

  // Handle neutrals (very low saturation)
  let descriptor: string;
  if (s < 5) {
    if (l > 95) descriptor = "White";
    else if (l > 80) descriptor = "Very Light Gray";
    else if (l > 60) descriptor = "Light Gray";
    else if (l > 40) descriptor = "Medium Gray";
    else if (l > 20) descriptor = "Dark Gray";
    else if (l > 5) descriptor = "Very Dark Gray";
    else descriptor = "Black";
  } else if (s < 12) {
    // Low saturation — grayish tint
    descriptor = `${modifier} ${hueName}`;
  } else {
    descriptor = `${modifier} ${hueName}`;
  }

  // Clean up redundant descriptors
  descriptor = descriptor.replace(/\s+/g, ' ').trim();

  return {
    name: bestMatch.name,
    descriptor,
    distance: Math.round(bestDistance * 10) / 10,
    nearestHex: bestMatch.hex,
    exact: bestDistance < 3
  };
}

/**
 * Get a simplified, display-friendly name.
 * If ΔE < 5 (close match), return the named color.
 * Otherwise return the ISCC-NBS descriptor.
 */
export function getDisplayName(hex: string): string {
  const result = getColorName(hex);
  return result.distance < 5 ? result.name : result.descriptor;
}
