import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://eckphabqkleahrujkcfu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3BoYWJxa2xlYWhydWprY2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODgwMTUsImV4cCI6MjA5MTc2NDAxNX0.kj19EuQe29b9F0z4x84yoEfKp5xJBU7ng2917wQAx0g";

const baseHeaders = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/post_views?slug=eq.${encodeURIComponent(slug)}&select=count`,
    { headers: baseHeaders, next: { revalidate: 0 } }
  );
  const data = await res.json();
  return NextResponse.json({ count: data?.[0]?.count ?? 0 });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view_count`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ p_slug: slug }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
  const count = await res.json();
  return NextResponse.json({ count });
}
