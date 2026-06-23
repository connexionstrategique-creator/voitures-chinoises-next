import { MetadataRoute } from "next";
import { CARS } from "@/data/cars";
import { BRANDS } from "@/data/brands";
import { carSlug, brandSlug } from "@/lib/slug";

const BASE = "https://www.voitureschinoises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const carPages = CARS.map((c) => ({
    url: `${BASE}/voitures/${carSlug(c.brand, c.model)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const brandPages = BRANDS.map((b) => ({
    url: `${BASE}/marques/${brandSlug(b.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/catalogue`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/marques`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/apporteurs`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    ...carPages,
    ...brandPages,
  ];
}
