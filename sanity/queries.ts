import { sanityClient } from "./client";
import type { Car, Brand, CarColorGroup } from "@/data/types";
import { carSlug as makeCarSlug, brandSlug as makeBrandSlug } from "@/lib/slug";

const SNAKE_SPEC_KEYS: Record<string, string> = {
  carburant:         "Motorisation",
  moteur:            "Moteur",
  moteur_avant:      "Moteur avant",
  moteur_arriere:    "Moteur arrière",
  puissance_systeme: "Puissance système",
  places:            "Places",
  dimensions:        "Dimensions",
  empattement:       "Empattement",
  garde_au_sol:      "Garde au sol",
  pneus:             "Pneus",
  reservoir:         "Réservoir",
  batterie:          "Batterie",
  autonomie_elec:    "Autonomie élec.",
  autonomie_totale:  "Autonomie totale",
  zero_cent:         "0-100 km/h",
  ecrans:            "Écrans",
  suspension:        "Suspension",
  remorquage:        "Remorquage",
  offroad:           "Off-road",
  audio:             "Audio",
};

function transformCar(raw: any): Car {
  const specsRecord: Record<string, string> = {};
  if (Array.isArray(raw.specs)) {
    raw.specs.forEach((s: any) => {
      if (s.key && s.value) specsRecord[s.key] = s.value;
    });
  } else if (raw.specs && typeof raw.specs === "object") {
    Object.entries(raw.specs).forEach(([k, v]) => {
      if (typeof v === "string") specsRecord[SNAKE_SPEC_KEYS[k] ?? k] = v;
    });
  }
  return {
    id: raw._id,
    brand: raw.brand || "",
    model: raw.model || "",
    year: raw.year || "2026",
    cat: raw.cat || "suv",
    badge: raw.badge || "new",
    badgeText: raw.badgeText || "",
    featured: raw.featured || false,
    price: raw.price || "",
    color: raw.color || "#A01414",
    colors: raw.colors || [],
    photos: Array.isArray(raw.photos)
      ? raw.photos.map((p: any) => ({
          label: "",
          src: p.asset?.url || p.image?.asset?.url || p.src || "",
        })).filter((p: any) => p.src)
      : [],
    colorGroups: Array.isArray(raw.colorGroups)
      ? (raw.colorGroups as any[]).map((g): CarColorGroup => ({
          colorName: g.colorName || "",
          photos: Array.isArray(g.photos)
            ? g.photos.map((p: any) => ({ label: "", src: p.asset?.url || "" })).filter((p: any) => p.src)
            : [],
        })).filter((g) => g.photos.length > 0)
      : [],
    youtubeId: raw.youtubeId || "",
    sketchfabId: raw.sketchfabId || undefined,
    autohomeId: raw.autohomeId || undefined,
    autohomeInteriorId: raw.autohomeInteriorId || undefined,
    specs: specsRecord,
    mini: {
      v1: raw.mini_v1 || "",
      k1: raw.mini_k1 || "",
      v2: raw.mini_v2 || "",
      k2: raw.mini_k2 || "",
      v3: raw.mini_v3 || "",
      k3: raw.mini_k3 || "",
    },
    desc: raw.desc || "",
    reasons: raw.reasons || [],
  };
}

function transformBrand(raw: any): Brand {
  return {
    name: raw.name || "",
    desc: raw.desc || "",
    logo: raw.logo || "",
  };
}

export async function getCars(): Promise<Car[]> {
  const raw = await sanityClient.fetch(
    `*[_type == "car"] | order(orderRank asc) {
      _id, brand, model, year, cat, badge, badgeText, featured,
      price, color, colors,
      "photos": photos[]{ "asset": asset->{ "url": url + "?auto=format&w=1200&q=78" } },
      "colorGroups": colorGroups[]{ colorName, "photos": photos[]{ "asset": asset->{ "url": url + "?auto=format&w=1200&q=78" } } },
      youtubeId, sketchfabId, autohomeId, autohomeInteriorId,
      specs,
      mini_v1, mini_k1, mini_v2, mini_k2, mini_v3, mini_k3, desc,
      "reasons": reasons[]{ title, body }
    }`,
    {},
    { next: { revalidate: 10 } }
  );
  return (raw || []).map(transformCar);
}

export interface SiteSettings {
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroSubtitle: string;
  whatsappNumber: string;
  phoneDisplay: string;
  phoneCN: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await sanityClient.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0] {
      heroLine1, heroLine2, heroLine3, heroSubtitle,
      whatsappNumber, phoneDisplay, phoneCN
    }`,
    {},
    { next: { revalidate: 10 } }
  );
  return {
    heroLine1:       raw?.heroLine1       ?? "Voitures chinoises.",
    heroLine2:       raw?.heroLine2       ?? "Neuves.",
    heroLine3:       raw?.heroLine3       ?? "Direct Chine.",
    heroSubtitle:    raw?.heroSubtitle    ?? "Une commande. Un suivi. Un véhicule neuf livré CIF à votre port — jusqu'au dédouanement et à l'immatriculation. Pas de compromis, pas d'approximation — juste le travail bien fait.",
    whatsappNumber:  raw?.whatsappNumber  ?? "8619587439774",
    phoneDisplay:    raw?.phoneDisplay    ?? "+229 01 41 76 53 41",
    phoneCN:         raw?.phoneCN         ?? "+86 195 8743 9774",
  };
}

export async function getNewestCars(n = 5): Promise<Car[]> {
  const raw = await sanityClient.fetch(
    `*[_type == "car"] | order(_createdAt desc) [0...$n] {
      _id, brand, model, year, cat, badge, badgeText, featured,
      price, color, colors,
      "photos": photos[]{ "asset": asset->{ "url": url + "?auto=format&w=800&q=78" } },
      "colorGroups": colorGroups[]{ colorName, "photos": photos[]{ "asset": asset->{ "url": url + "?auto=format&w=800&q=78" } } },
      specs, mini_v1, mini_k1, mini_v2, mini_k2, mini_v3, mini_k3
    }`,
    { n },
    { next: { revalidate: 60 } }
  );
  return ((raw || []).map(transformCar) as Car[]).filter(c => (c.photos?.length ?? 0) > 0 || (c.colorGroups ?? []).some(g => g.photos?.length > 0));
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const cars = await getCars();
  return cars.find((c) => makeCarSlug(c.brand, c.model) === slug) ?? null;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getBrands();
  return brands.find((b) => makeBrandSlug(b.name) === slug) ?? null;
}

export async function getCarsByBrand(slug: string): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => makeBrandSlug(c.brand) === slug);
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  category: string;
  excerpt: string;
  body?: any[];
  seoTitle?: string;
  seoDescription?: string;
}

const CAT_LABELS: Record<string, string> = {
  actualites: "Actualités",
  guides: "Guides d'achat",
  modeles: "Nouveaux modèles",
  marche: "Marché automobile",
};

export async function getPosts(category?: string): Promise<BlogPost[]> {
  const filter = category && category !== "all"
    ? `_type == "post" && category == "${category}"`
    : `_type == "post"`;
  const raw = await sanityClient.fetch(
    `*[${filter}] | order(orderRank asc, publishedAt desc) {
      _id, title,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url + "?auto=format&q=80",
      "imageAlt": mainImage.alt,
      publishedAt, category, excerpt
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return (raw || []).map((r: any) => ({ ...r, categoryLabel: CAT_LABELS[r.category] || r.category }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const raw = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url + "?w=1200&auto=format&q=80",
      "imageAlt": mainImage.alt,
      publishedAt, category, excerpt, seoTitle, seoDescription,
      body[] {
        ...,
        _type == "image" => { ..., "url": asset->url, alt, caption },
        _type == "table" => { ..., rows[]{ ..., cells } }
      }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return raw ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  const raw = await sanityClient.fetch(
    `*[_type == "brand"] | order(order asc) { _id, name, desc, logo }`,
    {},
    { next: { revalidate: 10 } }
  );
  return (raw || []).map(transformBrand);
}
