import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "t3ow1rmc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json({ error: "SANITY_WRITE_TOKEN non configuré" }, { status: 500 });
  }

  const body = await req.json();
  const { brand, model, year, cat, price, desc, colors, specs, mini, order } = body;

  const doc = {
    _type: "car",
    brand,
    model,
    year: year || "2026",
    cat: cat || "suv",
    price: price || "",
    desc: desc || "",
    colors: colors || [],
    color: "#A01414",
    featured: false,
    order: order || 99,
    specs: (specs || []).map((s: { key: string; value: string }) => ({
      _key: Math.random().toString(36).slice(2),
      key: s.key,
      value: s.value,
    })),
    mini_v1: mini?.[0]?.v || "",
    mini_k1: mini?.[0]?.k || "",
    mini_v2: mini?.[1]?.v || "",
    mini_k2: mini?.[1]?.k || "",
    mini_v3: mini?.[2]?.v || "",
    mini_k3: mini?.[2]?.k || "",
  };

  const result = await writeClient.create(doc);
  return NextResponse.json({ success: true, id: result._id });
}
