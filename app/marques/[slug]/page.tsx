import { Suspense } from "react";
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

export const revalidate = 10;

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
  const canonical = `https://www.voitureschinoises.com/marques/${slug}`;
  return {
    title: `${brand.name} — Voitures Chinoises | Connexion Stratégique`,
    description: `Tous les modèles ${brand.name} disponibles à la commande. ${brand.desc}. Prix CIF livraison Afrique francophone.`,
    alternates: { canonical },
    openGraph: {
      title: `${brand.name} — Voitures Chinoises`,
      description: `Tous les modèles ${brand.name} neufs 0km, prix CIF livré en Afrique francophone.`,
      url: canonical,
      type: "website",
    },
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
      <section style={{ padding: "48px 0 40px", background: "var(--yellow, #f5f0e8)" }}>
        <div className="section-inner">
          <div className="tag" style={{ marginBottom: 20 }}>{brand!.desc}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flexShrink: 0, background: "#fff", borderRadius: 10, padding: "8px 14px", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <Image
                src={brand!.logo}
                alt={brand!.name}
                width={120}
                height={40}
                style={{ height: 40, width: "auto", maxWidth: 120, objectFit: "contain", display: "block" }}
                unoptimized
              />
            </div>
            <h1 className="h2" style={{ marginBottom: 0 }}>{brand!.name}</h1>
          </div>
          <p style={{ color: "var(--mid, #666)", fontSize: 15 }}>
            {cars.length} modèle{cars.length > 1 ? "s" : ""} disponible{cars.length > 1 ? "s" : ""} à la commande
          </p>
        </div>
      </section>
      {cars.length > 0 ? (
        <Suspense>
          <Catalogue cars={cars} />
        </Suspense>
      ) : (
        <section className="section">
          <div className="section-inner" style={{ textAlign: "center", padding: "80px 0", maxWidth: 560, margin: "0 auto" }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>💬</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--black)", marginBottom: 12 }}>
              Intéressé(e) par un modèle {brand!.name} ?
            </h2>
            <p style={{ fontSize: 16, color: "var(--mid)", marginBottom: 32, lineHeight: 1.6 }}>
              Écrivez-nous sur WhatsApp en précisant le modèle qui vous intéresse.<br />
              Nous vous répondons rapidement avec prix et disponibilité.
            </p>
            <a
              href={`https://wa.me/22941765341?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par un modèle ${brand!.name}. Pouvez-vous me donner plus d'informations sur les modèles disponibles et les prix ?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#25D366",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.526 5.854L0 24l6.335-1.509A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.88 9.88 0 01-5.031-1.373l-.36-.214-3.762.896.957-3.665-.235-.376A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.467 0 9.882 4.415 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z" />
              </svg>
              Écrire sur WhatsApp
            </a>
          </div>
        </section>
      )}
      <Footer minimal />
    </>
  );
}
