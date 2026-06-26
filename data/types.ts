export interface Brand {
  name: string;
  desc: string;
  logo: string;
}

export interface CarPhoto {
  label: string;
  src: string;
}

export interface CarColorGroup {
  colorName: string;
  photos: CarPhoto[];
}

export interface CarMini {
  v1: string;
  k1: string;
  v2: string;
  k2: string;
  v3: string;
  k3: string;
}

export interface Car {
  id: number | string;
  brand: string;
  model: string;
  year: string;
  cat: "suv" | "hybride";
  badge: "new" | "pop" | "elec" | "promo";
  badgeText: string;
  featured?: boolean;
  price: string;
  color: string;
  colors?: string[];
  photos?: CarPhoto[];
  colorGroups?: CarColorGroup[];
  youtubeId?: string;
  sketchfabId?: string;
  specs: Record<string, string>;
  mini: CarMini;
  desc: string;
  reasons?: { title: string; body: string }[];
}

export const COLOR_HEX: Record<string, string> = {
  "Noir": "#111111",
  "Noir Highway": "#1a1a1a",
  "Noir Obsidien": "#1C1C1C",
  "Blanc": "#F5F5F5",
  "Blanc Ivoire": "#FFFFF0",
  "Gris": "#808080",
  "Gris Highway": "#6B6B6B",
  "Gris Graphène": "#4A4A4A",
  "Gris Fluorite": "#9E9E9E",
  "Argent": "#C0C0C0",
  "Argent Étoilé": "#B8C4D4",
  "Argent Superstar": "#C8C8C8",
  "Bleu": "#1565C0",
  "Bleu Nuit": "#0D2B5E",
  "Bleu Lac de Sel": "#4A90C4",
  "Bleu Gris": "#607D8B",
  "Bleu Matin": "#4A7FA5",
  "Vert": "#2E7D32",
  "Vert Paysage": "#3A6B4A",
  "Rouge": "#B71C1C",
  "Or Aurore": "#C8A84B",
  "Marron": "#6D4C41",
  "Sable": "#C2B280",
  "Cyan Brumeux": "#4DB6AC",
  "Vert lac": "#2D7A6B",
  "Noir nuit": "#0D0D1A",
  "Argent étoilé": "#B8C4D4",
  "Blanc Brillant": "#FFFFFF",
  "Blanc nacré": "#F0EDE8",
  "Gris Andes": "#7A8A8C",
  "Gris Atomique": "#5A6472",
  "Gris Nebuleuse": "#8E9BAA",
  "Gris anthracite": "#3D3D3D",
  "Bleu Azure": "#2979C4",
  "Noir Noble": "#141820",
  "Argent Neige": "#D8DCE8",
  "Gris Titanium": "#6B6E7A",
  "Noir Cristal": "#1A1A2E",
  "Kaki": "#8B7D5B",
  "Bleu Capri": "#006B9F",
  "Noir Jais": "#0A0A0A",
  "Noir Nuit": "#0D0D1A",
  "Gris Acier": "#6E7A8A",
  "Orange": "#E8672A",
  "Jaune": "#EAC317",
};

export function getColorHex(name: string): string {
  return COLOR_HEX[name] || "#888";
}
