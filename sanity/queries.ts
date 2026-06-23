import { sanityClient } from "./client";
import type { Car, Brand } from "@/data/types";
import { carSlug as makeCarSlug, brandSlug as makeBrandSlug } from "@/lib/slug";

function transformCar(raw: any): Car {
  const specsRecord: Record<string, string> = {};
  if (Array.isArray(raw.specs)) {
    raw.specs.forEach((s: any) => {
      if (s.key && s.value) specsRecord[s.key] = s.value;
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
          label: p.label || "",
          src: p.image?.asset?.url || p.src || "",
        })).filter((p: any) => p.src)
      : [],
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
    `*[_type == "car"] | order(order asc) {
      _id, brand, model, year, cat, badge, badgeText, featured,
      price, color, colors, "photos": photos[]{ label, "image": image{ asset->{ url } } }, specs,
      mini_v1, mini_k1, mini_v2, mini_k2, mini_v3, mini_k3, desc
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return (raw || []).map(transformCar);
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

export async function getBrands(): Promise<Brand[]> {
  const raw = await sanityClient.fetch(
    `*[_type == "brand"] | order(order asc) { _id, name, desc, logo }`,
    {},
    { next: { revalidate: 60 } }
  );
  return (raw || []).map(transformBrand);
}
