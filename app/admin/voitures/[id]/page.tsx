import { createClient } from "@sanity/client";
import { notFound } from "next/navigation";
import CarEditor from "./CarEditor";

export const revalidate = 0;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "t3ow1rmc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function CarEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let car: any = null;
  try {
    car = await client.fetch(
      `*[_type=="car" && _id==$id][0]`,
      { id }
    );
  } catch {}
  if (!car) notFound();

  return <CarEditor car={car} />;
}
