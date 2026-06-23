import Nav from "@/components/Nav";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BRANDS } from "@/data/brands";
import { CARS } from "@/data/cars";
import { getBrandBySlug, getCarsByBrand } from "@/sanity/queries";
import { brandSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: brandSlug(b.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let brand = BRANDS.find((b) => brandSlug(b.name) === slug);
  try {
    const b = await getBrandBySlug(slug);
    if (b) brand = b;
  } catch {}
  if (!brand) return {};
  return {
    title: `${brand.name} — Voitures Chinoises | Connexion Stratégique`,
    description: `Tous les modèles ${brand.name} disponibles à la commande. ${brand.desc}. Prix CIF livraison Afrique francophone.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let brand = BRANDS.find((b) => brandSlug(b.name) === slug);
  let cars = CARS.filter((c) => brandSlug(c.brand) === slug);

  try {
    const [sanityBrand, sanityCars] = await Promise.all([
      getBrandBySlug(slug),
      getCarsByBrand(slug),
    ]);
    if (sanityBrand) brand = sanityBrand;
    if (sanityCars && sanityCars.length > 0) cars = sanityCars;
  } catch {}

  if (!brand) notFound();

  return (
    <>
      <Nav />
      <section style={{ paddingTop: "100px", paddingBottom: "60px", background: "var(--yellow, #f5f0e8)" }}>
        <div className="section-inner" style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <Image
              src={brand!.logo}
              alt={brand!.name}
              width={180}
              height={80}
              style={{ height: 80, width: "auto", objectFit: "contain" }}
              unoptimized
            />
          </div>
          <div>
            <div className="tag">{brand!.desc}</div>
            <h1 className="h2" style={{ marginBottom: 8 }}>{brand!.name}</h1>
            <p style={{ color: "var(--mid, #666)", fontSize: 16 }}>
              {cars.length} modèle{cars.length > 1 ? "s" : ""} disponible{cars.length > 1 ? "s" : ""} à la commande
            </p>
          </div>
        </div>
      </section>
      {cars.length > 0 ? (
        <Catalogue cars={cars} />
      ) : (
        <section className="section">
          <div className="section-inner" style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 18, color: "var(--mid)" }}>Aucun modèle disponible pour cette marque pour le moment.</p>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
