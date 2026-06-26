import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { BRANDS } from "@/data/brands";
import { getBrands } from "@/sanity/queries";
import { brandSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Marques Chinoises — Voitures Chinoises | Connexion Stratégique",
  description: "BYD, Changan, Jetour, GAC Motor, Chery, MG et plus. Découvrez toutes les grandes marques automobiles chinoises disponibles à la commande.",
};

export default async function MarquesPage() {
  let brands = BRANDS;
  try {
    const b = await getBrands();
    if (b && b.length > 0) brands = b;
  } catch {}

  return (
    <>
      <Nav />
      <section className="section brands-section" id="marques" style={{ paddingTop: "120px" }}>
        <div className="section-inner">
          <div className="tag">20 marques disponibles</div>
          <h1 className="h2">
            Les grandes marques chinoises.<br />
            <em>Sélection disponible à la commande.</em>
          </h1>
          <div className="brands-grid">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/marques/${brandSlug(brand.name)}`}
                style={{ textDecoration: "none" }}
              >
                <div className="brand-item" style={{ cursor: "pointer", transition: "transform .2s", display: "block" }}>
                  {brand.logo && (
                    <div className="brand-logo-wrap">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={120}
                        height={44}
                        style={{ objectFit: "contain", objectPosition: "left center", width: "auto", height: "36px", maxWidth: "110px" }}
                        unoptimized
                      />
                    </div>
                  )}
                  <span className="brand-name-text">{brand.name}</span>
                  <span className="brand-desc">{brand.desc}</span>
                  <span className="brand-discover">Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer minimal />
    </>
  );
}
