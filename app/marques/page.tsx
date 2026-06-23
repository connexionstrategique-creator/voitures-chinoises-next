import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/data/brands";
import { getBrands } from "@/sanity/queries";
import { brandSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const revalidate = 60;

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
                  <div className="brand-logo-wrap">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={150}
                      height={72}
                      className="brand-logo-img"
                      unoptimized
                    />
                  </div>
                  <span className="brand-desc">{brand.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
