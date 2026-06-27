import { NextResponse } from "next/server";
import { getCars, getPosts } from "@/sanity/queries";
import { carSlug } from "@/lib/slug";

export const revalidate = 60;

export async function GET() {
  try {
    const [cars, posts] = await Promise.all([getCars(), getPosts()]);

    const carResults = cars.map((c) => ({
      type: "car" as const,
      brand: c.brand,
      model: c.model,
      slug: carSlug(c.brand, c.model),
      price: c.price,
      cat: c.cat,
      thumb:
        c.colorGroups?.[0]?.photos?.[0]?.src ||
        c.photos?.[0]?.src ||
        null,
    }));

    const postResults = posts.map((p) => ({
      type: "post" as const,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      category: p.category,
      thumb: p.imageUrl ? p.imageUrl.split("?")[0] : null,
    }));

    return NextResponse.json({ cars: carResults, posts: postResults });
  } catch {
    return NextResponse.json({ cars: [], posts: [] });
  }
}
