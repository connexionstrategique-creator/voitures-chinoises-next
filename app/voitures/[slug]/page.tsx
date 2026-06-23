import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CarPhotoCarousel from "@/components/CarPhotoCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARS } from "@/data/cars";
import { getColorHex } from "@/data/types";
import { carSlug } from "@/lib/slug";
import { getCarBySlug, getCars } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  return CARS.map((c) => ({ slug: carSlug(c.brand, c.model) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let car = CARS.find((c) => carSlug(c.brand, c.model) === slug);
  try {
    const c = await getCarBySlug(slug);
    if (c) car = c;
  } catch {}
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model} ${car.year} — Prix CIF | Voitures Chinoises`,
    description: `${car.brand} ${car.model} neuf 0km. Prix CIF ${car.price} FCFA, livraison Cotonou, Lomé, Abidjan, Dakar. ${car.desc?.slice(0, 120) || ""}`,
    openGraph: {
      title: `${car.brand} ${car.model} — ${car.price} FCFA CIF`,
      description: `Véhicule neuf 0km livré CIF en Afrique francophone.`,
      images: car.photos?.[0]?.src ? [{ url: car.photos[0].src }] : [],
    },
  };
}

const WA_NUMBER = "22941765341";

export default async function VoiturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let car = CARS.find((c) => carSlug(c.brand, c.model) === slug);
  try {
    const c = await getCarBySlug(slug);
    if (c) car = c;
  } catch {}

  if (!car) notFound();

  const photos = car!.photos || [];
  const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par la ${car!.brand} ${car!.model}. Pouvez-vous me donner plus d'informations ?`);

  return (
    <>
      <Nav />

      {/* JSON-LD voiture */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            "name": `${car!.brand} ${car!.model}`,
            "brand": { "@type": "Brand", "name": car!.brand },
            "modelDate": car!.year,
            "offers": {
              "@type": "Offer",
              "price": car!.price.replace(/\s/g, ""),
              "priceCurrency": "XOF",
              "availability": "https://schema.org/InStock",
              "seller": { "@type": "Organization", "name": "Connexion Stratégique" },
            },
            "image": photos[0]?.src || "",
            "description": car!.desc,
            "url": `https://www.voitureschinoises.com/voitures/${slug}`,
          }),
        }}
      />

      <main style={{ paddingTop: "80px" }}>
        {/* Hero */}
        <section style={{ background: "#111", color: "#fff" }}>
          <div className="section-inner" style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap", padding: "48px 24px" }}>
            <div style={{ flex: "1 1 380px" }}>
              <CarPhotoCarousel photos={photos} color={car!.color} alt={`${car!.brand} ${car!.model}`} />
            </div>

            <div style={{ flex: "1 1 280px" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                {car!.brand} · {car!.year} · NEUF 0KM
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
                {car!.model.split(" ").map((w, i) =>
                  i === 0
                    ? <span key={i}>{w} </span>
                    : <em key={i} style={{ color: "var(--red, #A01414)" }}>{w} </em>
                )}
              </h1>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                Millésime {car!.year} · Neuf 0km · CIF tous ports
              </div>

              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Prix CIF</div>
                <div style={{ fontSize: 32, fontWeight: 900 }}>
                  {car!.price} <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.5 }}>FCFA</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                  📦 Coût + Assurance + Fret inclus · 🇧🇯 🇹🇬 🇨🇮 🇸🇳 Même prix
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-cta-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
                >
                  📱 Commander sur WhatsApp
                </a>
                <Link href="/catalogue" className="modal-cta-secondary" style={{ textDecoration: "none" }}>
                  ← Catalogue
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Détails */}
        <section className="section">
          <div className="section-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
            {car!.colors && car!.colors.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Couleurs disponibles</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {car!.colors.map((col) => (
                    <div key={col} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: getColorHex(col), border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      <span style={{ fontSize: 15 }}>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ flex: 2 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Fiche technique</h2>
              <div className="specs-full">
                {Object.entries(car!.specs).map(([k, v]) => (
                  <div className="spec-row" key={k}>
                    <span className="spec-key">{k}</span>
                    <span className="spec-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {car!.desc && (
            <div className="section-inner" style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>À propos</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--mid, #555)", maxWidth: 720 }}>{car!.desc}</p>
            </div>
          )}

          <div className="section-inner" style={{ marginTop: 64 }}>
            <div style={{ background: "var(--yellow, #f5f0e8)", borderRadius: 24, padding: "48px", textAlign: "center" }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                Intéressé par la {car!.brand} {car!.model} ?
              </h2>
              <p style={{ color: "var(--mid)", marginBottom: 32 }}>
                Contactez-nous sur WhatsApp pour démarrer votre commande.
              </p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sourcing-btn-primary"
                style={{ display: "inline-block" }}
              >
                📱 Démarrer ma commande →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
