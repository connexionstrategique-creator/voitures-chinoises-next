import { MetadataRoute } from "next";
import { CARS } from "@/data/cars";
import { BRANDS } from "@/data/brands";
import { carSlug, brandSlug } from "@/lib/slug";
import { getPosts } from "@/sanity/queries";

const BASE = "https://www.voitureschinoises.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts] = await Promise.all([
    getPosts().catch(() => []),
  ]);

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

  const blogPages = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE}/catalogue`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/marques`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/a-propos`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${BASE}/process`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.65 },
    { url: `${BASE}/apporteurs`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
    ...blogPages,
    ...carPages,
    ...brandPages,
  ];
}
