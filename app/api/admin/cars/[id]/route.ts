import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "t3ow1rmc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("vc_admin")?.value;
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "").toString("base64");
  return !!token && token === expected;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const { patch } = await req.json();
  if (!patch) return NextResponse.json({ error: "patch requis" }, { status: 400 });
  const result = await writeClient.patch(id).set(patch).commit();
  return NextResponse.json({ success: true, id: result._id });
}
