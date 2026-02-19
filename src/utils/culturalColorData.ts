import { getRawHsl } from './colorUtils';

export interface CulturalNote {
  region: string;
  meaning: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'warning';
  context?: string;
}

export interface CulturalAnalysis {
  notes: CulturalNote[];
  warnings: string[];
  designTip: string;
}

interface HueCulturalEntry {
  hueRange: [number, number];
  colorFamily: string;
  notes: CulturalNote[];
  warnings: string[];
  designTip: string;
}

const culturalMap: HueCulturalEntry[] = [
  {
    hueRange: [345, 20],
    colorFamily: "Red",
    notes: [
      { region: "Western", meaning: "Passion, love, danger, urgency. Signals 'stop' and financial loss in stock markets.", sentiment: "neutral" },
      { region: "China", meaning: "Good luck, prosperity, celebration. Worn at weddings. Signals financial gain in stock markets.", sentiment: "positive" },
      { region: "Japan", meaning: "The sun, authority, sacrifice, and joy. Central to the national flag (Hinomaru).", sentiment: "positive" },
      { region: "Middle East", meaning: "Can represent danger and evil forces, but also vitality and courage in Persian art.", sentiment: "neutral" },
      { region: "Latin America", meaning: "Blood and the sun in Aztec belief. Paired with white, it represents Catholicism.", sentiment: "neutral" }
    ],
    warnings: ["Red/Green stock market colors are inverted between Western and East Asian markets."],
    designTip: "For Chinese audiences, red CTA buttons boost trust and conversions. In Western UX, reserve red for errors and destructive actions."
  },
  {
    hueRange: [20, 40],
    colorFamily: "Orange",
    notes: [
      { region: "Western", meaning: "Autumn, harvest, Halloween, warmth. Associated with gluttony in Christianity.", sentiment: "positive" },
      { region: "East Asia", meaning: "Happiness, good health, and spiritual transformation in Buddhism.", sentiment: "positive" },
      { region: "Middle East", meaning: "Associated with mourning and loss. Use with caution.", sentiment: "warning" },
      { region: "Latin America", meaning: "In Colombia, directly linked to sexuality and fertility.", sentiment: "neutral" }
    ],
    warnings: ["Avoid orange as a primary color in Middle Eastern markets — it can evoke grief."],
    designTip: "Safe warm alternative to red for Latin American markets. Use golden-orange instead of pure yellow to avoid 'death' associations."
  },
  {
    hueRange: [40, 52],
    colorFamily: "Gold / Amber",
    notes: [
      { region: "Western", meaning: "Wealth, achievement, prestige. Used for trophies, medals, and premium branding.", sentiment: "positive" },
      { region: "China", meaning: "Imperial power and heavenly authority. Gold and yellow were reserved for emperors for millennia.", sentiment: "positive" },
      { region: "Japan", meaning: "Prosperity and the beauty of impermanence (Kintsugi — repairing with gold).", sentiment: "positive" },
      { region: "Middle East", meaning: "Divine light, eternal radiance, and undeniable wealth. Gold adorns mosque domes and Quran manuscripts.", sentiment: "positive" },
      { region: "Latin America", meaning: "Safe warm alternative to yellow. Evokes the sun without Aztec death associations.", sentiment: "positive" }
    ],
    warnings: [],
    designTip: "Gold/Amber is one of the safest luxury colors globally. Pair with black for Middle Eastern premium markets."
  },
  {
    hueRange: [52, 70],
    colorFamily: "Yellow",
    notes: [
      { region: "Western", meaning: "Sunshine, optimism, taxis, school buses. In Germany, it symbolizes envy.", sentiment: "positive" },
      { region: "China", meaning: "Imperial power. For centuries, only emperors could wear yellow. Represents earth and the center.", sentiment: "positive" },
      { region: "Japan", meaning: "Courage and refinement, linked to the chrysanthemum — the imperial seal since 1357.", sentiment: "positive" },
      { region: "Middle East", meaning: "Happiness, warmth, and divine wisdom.", sentiment: "positive" },
      { region: "Latin America", meaning: "Mourning, death, and sorrow. Linked to the Aztec maize/death cycle.", sentiment: "warning" }
    ],
    warnings: ["Yellow means death and mourning in many Latin American cultures. Use golden or amber tones instead."],
    designTip: "For Latin American audiences, warm yellow up to amber/gold. Pure yellow can evoke sorrow connected to Aztec death mythology."
  },
  {
    hueRange: [70, 165],
    colorFamily: "Green",
    notes: [
      { region: "Western", meaning: "Nature, growth, eco-friendliness, luck (Ireland). Also 'envy' (Shakespeare).", sentiment: "positive" },
      { region: "China", meaning: "Growth and harmony in Wu Xing. But a 'green hat' means spousal infidelity — a severe taboo.", sentiment: "warning" },
      { region: "Japan", meaning: "Vitality, youth, and the eternal cycle of nature. Deeply tied to Shinto.", sentiment: "positive" },
      { region: "Middle East", meaning: "The holiest color in Islam. Symbolizes paradise, the Prophet, and spiritual peace.", sentiment: "positive" },
      { region: "Latin America", meaning: "Independence in Mexico. But in Amazonian regions, it symbolizes disease and death.", sentiment: "neutral" }
    ],
    warnings: [
      "Never use green on men's headwear for the Chinese market — it implies the wearer's spouse is unfaithful.",
      "In Middle Eastern design, never place green or Arabic calligraphy on floors, doormats, or footwear — it's considered deeply disrespectful."
    ],
    designTip: "Green is the ultimate 'trust' color for Middle Eastern audiences. For Chinese male-targeted products, avoid green near the head/hat area."
  },
  {
    hueRange: [165, 210],
    colorFamily: "Cyan / Teal",
    notes: [
      { region: "Western", meaning: "Refreshment, innovation, and modern technology.", sentiment: "positive" },
      { region: "East Asia", meaning: "Historically part of 'Ao' (blue-green) in Japan — signifying calm and the natural world.", sentiment: "positive" },
      { region: "Middle East", meaning: "Combines the spiritual depth of blue with the life-giving force of green.", sentiment: "positive" },
      { region: "Latin America", meaning: "Coastal freshness and tropical vibrancy.", sentiment: "positive" }
    ],
    warnings: [],
    designTip: "Cyan/Teal is one of the safest globally — minimal negative associations across major cultures."
  },
  {
    hueRange: [210, 260],
    colorFamily: "Blue",
    notes: [
      { region: "Western", meaning: "Trust, security, corporate authority, masculinity. The default 'safe' corporate color.", sentiment: "positive" },
      { region: "China", meaning: "Calm and immortality. Notably, blue represents femininity — opposite of Western masculinity.", sentiment: "neutral" },
      { region: "Japan", meaning: "The sea, sky, tranquility, and historically the color of common people (Indigo/Ai).", sentiment: "positive" },
      { region: "Middle East", meaning: "Heaven, infinity, divine protection. Used in Nazar (evil eye) amulets against bad spirits.", sentiment: "positive" },
      { region: "Latin America", meaning: "The Virgin Mary's veil — hope, faith, and Catholic devotion.", sentiment: "positive" }
    ],
    warnings: ["Blue's gender association is inverted: masculine in the West, feminine in China."],
    designTip: "Blue is the world's most universally trusted color. Latin American finance brands can leverage its 'Virgin Mary' association for deep consumer trust."
  },
  {
    hueRange: [260, 300],
    colorFamily: "Purple",
    notes: [
      { region: "Western", meaning: "Luxury, mystery, creativity. Historically reserved for royalty due to expensive dye.", sentiment: "positive" },
      { region: "Japan", meaning: "Imperial exclusivity. Banned for commoners under sumptuary laws (604 AD & Edo period).", sentiment: "positive" },
      { region: "Middle East", meaning: "Spirituality and mysticism, especially when paired with blue tones.", sentiment: "positive" },
      { region: "Latin America", meaning: "Death, funerals, and mourning. Wearing purple outside a funeral is considered bad luck in Brazil.", sentiment: "warning" },
      { region: "Thailand", meaning: "The designated mourning color. Worn when grieving.", sentiment: "warning" }
    ],
    warnings: [
      "Avoid purple in Brazilian and Thai consumer products — it's the color of death and funerals.",
      "Euro Disney's costly mistake: heavy purple marketing alienated Catholic European audiences who associated it with death."
    ],
    designTip: "Safe for luxury in Western and East Asian markets. Completely avoid as a primary brand color for Brazil and Southeast Asia."
  },
  {
    hueRange: [300, 345],
    colorFamily: "Pink",
    notes: [
      { region: "Western", meaning: "Femininity, nurturing, romance. Pre-1920s it was considered a masculine color.", sentiment: "positive" },
      { region: "Japan", meaning: "Cherry blossoms (Sakura) — spring, renewal, the beauty of transience (mono no aware).", sentiment: "positive" },
      { region: "East Asia", meaning: "Generally associated with romance and marriage.", sentiment: "positive" },
      { region: "Middle East", meaning: "Largely neutral. Can represent softness and tenderness.", sentiment: "neutral" }
    ],
    warnings: [],
    designTip: "Relatively safe globally. In Japan, deeper pink (Sakura) tones evoke national pride and seasonal beauty."
  }
];

const neutralCultures: Record<string, { notes: CulturalNote[]; warnings: string[]; designTip: string }> = {
  white: {
    notes: [
      { region: "Western", meaning: "Purity, weddings, innocence. Set by Queen Victoria's 1840 white wedding dress tradition.", sentiment: "positive" },
      { region: "China", meaning: "Death, funerals, mourning. The traditional mourning color — never use for weddings or celebrations.", sentiment: "warning" },
      { region: "Japan", meaning: "Shinto divine purity, truth, and humility. White sand in temples symbolizes sacred ground.", sentiment: "positive" },
      { region: "Middle East", meaning: "Purity and rebirth. Worn during Hajj pilgrimage (ihram) to symbolize spiritual cleansing.", sentiment: "positive" },
      { region: "Latin America", meaning: "Angels, good health, and purity. Paired with blue, it represents the Virgin Mary.", sentiment: "positive" }
    ],
    warnings: ["White packaging for gifts, weddings, or food in East Asia can evoke death and funerals. Use red or gold instead."],
    designTip: "For East Asian markets, never use pure white packaging for celebration products. Add warm accents (gold, red) to shift the association."
  },
  black: {
    notes: [
      { region: "Western", meaning: "Sophistication, luxury, elegance, power. Also mourning (funerals).", sentiment: "neutral" },
      { region: "China", meaning: "Water element — depth, wisdom, authority, and adaptive power.", sentiment: "positive" },
      { region: "Japan", meaning: "Formality, masculinity, and elegance. Standard for ceremonial and business attire.", sentiment: "positive" },
      { region: "Middle East", meaning: "Authority, dignity, modesty. The Abaya communicates 'I am present but not displayed.'", sentiment: "positive" },
      { region: "Latin America", meaning: "Formality and mourning, similar to Western associations.", sentiment: "neutral" }
    ],
    warnings: [],
    designTip: "Black is universally safe for luxury positioning. Pair with gold for Middle Eastern and East Asian premium markets."
  },
  grey: {
    notes: [
      { region: "Western", meaning: "Professionalism, neutrality, and modern minimalism.", sentiment: "neutral" },
      { region: "East Asia", meaning: "Humble and practical. Japan has poetic grey variants like 'cherry blossom mouse' (sakuranezumi).", sentiment: "neutral" },
      { region: "Middle East", meaning: "Neutral and modern. Safe for corporate and tech interfaces.", sentiment: "neutral" },
      { region: "Latin America", meaning: "Generally neutral — professionalism and industry.", sentiment: "neutral" }
    ],
    warnings: [],
    designTip: "Grey is globally neutral and safe. Excellent as a foundation that lets culturally resonant accent colors shine."
  }
};

export function getCulturalAnalysis(hex: string): CulturalAnalysis {
  const { h, s, l } = getRawHsl(hex);

  if (s < 12) {
    if (l > 90) return neutralCultures.white;
    if (l < 15) return neutralCultures.black;
    return neutralCultures.grey;
  }

  const match = culturalMap.find(entry => {
    const [start, end] = entry.hueRange;
    if (start > end) {
      return h >= start || h < end;
    }
    return h >= start && h < end;
  });

  if (!match) {
    return {
      notes: [{ region: "Global", meaning: "A unique hue with few strong cultural associations.", sentiment: "neutral" }],
      warnings: [],
      designTip: "This shade has no major documented cultural taboos. Verify with local focus groups for niche markets."
    };
  }

  return {
    notes: match.notes,
    warnings: match.warnings,
    designTip: match.designTip
  };
}
