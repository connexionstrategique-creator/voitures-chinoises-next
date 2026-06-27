import { NextResponse } from "next/server";
import { getCars } from "@/sanity/queries";
import { carSlug } from "@/lib/slug";

export const revalidate = 60;

export async function GET() {
  try {
    const cars = await getCars();
    const results = cars.map((c) => ({
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
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
