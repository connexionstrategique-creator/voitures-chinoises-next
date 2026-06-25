import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/marques");
  revalidatePath("/voitures/[slug]", "page");
  revalidatePath("/marques/[slug]", "page");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
