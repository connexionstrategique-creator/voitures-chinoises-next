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

  const formData = await req.formData();
  const carId = formData.get("carId") as string;
  const files = formData.getAll("photos") as File[];

  if (!carId || !files.length) {
    return NextResponse.json({ error: "carId et photos requis" }, { status: 400 });
  }

  // Upload each image to Sanity and collect asset references
  const photoRefs = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });
    photoRefs.push({
      _type: "image",
      _key: Math.random().toString(36).slice(2),
      asset: { _type: "reference", _ref: asset._id },
    });
  }

  // Patch the car document to append photos
  await writeClient
    .patch(carId)
    .setIfMissing({ photos: [] })
    .append("photos", photoRefs)
    .commit();

  return NextResponse.json({ success: true, count: photoRefs.length });
}
