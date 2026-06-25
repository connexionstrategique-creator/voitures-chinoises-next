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
  const { id, patch, unset } = body;

  if (!id || (!patch && !unset)) {
    return NextResponse.json({ error: "id et patch ou unset requis" }, { status: 400 });
  }

  let p = writeClient.patch(id);
  if (patch) p = p.set(patch);
  if (unset) p = p.unset(unset);
  const result = await p.commit();
  return NextResponse.json({ success: true, id: result._id });
}
