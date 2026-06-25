import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CarPhotoCarousel from "@/components/CarPhotoCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARS } from "@/data/cars";
import { getColorHex } from "@/data/types";
import { carSlug } from "@/lib/slug";
import { getCarBySlug, getCars, getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 10;

const SPEC_ICONS: Record<string, string> = {
  // Motorisation
  Moteur: "⚙️",
  Type: "🔋",
  Puissance: "⚡",
  Couple: "🔩",
  Cylindrée: "🔧",
  Transmission: "🔄",
  Traction: "🚗",
  Boîte: "🔄",
  Vitesses: "🔄",
  Consommation: "⛽",
  Autonomie: "📍",
  Réservoir: "🛢️",
  // Dimensions & poids
  Dimensions: "📐",
  Longueur: "📐",
  Largeur: "📐",
  Hauteur: "📐",
  Empattement: "📐",
  Coffre: "📦",
  Poids: "⚖️",
  // Confort & équipements
  Places: "👤",
  Sièges: "💺",
  Finition: "✨",
  Climatisation: "❄️",
  "Toit ouvrant": "🌤️",
  Toit: "🌤️",
  // Technologie
  Écran: "📺",
  "Écran central": "📺",
  "Écran conducteur": "📺",
  Audio: "🔊",
  Son: "🔊",
  Navigation: "🗺️",
  GPS: "🗺️",
  Connectivité: "📡",
  // Éclairage & roues
  Phares: "💡",
  Feux: "💡",
  Jantes: "⭕",
  Roues: "⭕",
  Pneus: "⭕",
  // Sécurité
  Airbags: "🛡️",
  Sécurité: "🛡️",
  Freins: "🔴",
  Caméra: "📷",
  "Aide à la conduite": "🚘",
  // Général
  Garantie: "🛡️",
  Kilométrage: "🏁",
  Année: "📅",
  Couleur: "🎨",
  Portes: "🚪",
};

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
  const slug2 = `${car.brand.toLowerCase().replace(/\s+/g, "-")}-${car.model.toLowerCase().replace(/\s+/g, "-")}`;
  return {
    title: `${car.brand} ${car.model} ${car.year} — Prix CIF Afrique | Voitures Chinoises`,
    description: `${car.brand} ${car.model} ${car.year} neuf 0km. Prix CIF ${car.price} FCFA livré Cotonou, Lomé, Abidjan, Dakar. ${car.desc?.slice(0, 100) || "Importation directe Chine."}`,
    alternates: { canonical: `https://www.voitureschinoises.com/voitures/${slug}` },
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year} — ${car.price} FCFA CIF`,
      description: `Véhicule neuf 0km livré CIF en Afrique francophone. Devis sous 48h.`,
      images: car.photos?.[0]?.src ? [{ url: car.photos[0].src, width: 1200, height: 630 }] : [],
      type: "website",
    },
  };
}

export default async function VoiturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let car = CARS.find((c) => carSlug(c.brand, c.model) === slug);
  let waNumber = "8619587439774";
  let phoneDisplay = "+229 01 41 76 53 41";
  let phoneCN = "+86 195 8743 9774";
  try {
    const [c, settings] = await Promise.all([getCarBySlug(slug), getSiteSettings()]);
    if (c) car = c;
    if (settings?.whatsappNumber) waNumber = settings.whatsappNumber;
    if (settings?.phoneDisplay) phoneDisplay = settings.phoneDisplay;
    if (settings?.phoneCN) phoneCN = settings.phoneCN;
  } catch {}

  if (!car) notFound();

  const photos = car!.photos || [];
  const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par la ${car!.brand} ${car!.model}. Pouvez-vous me donner plus d'informations ?`);

  return (
    <>
      <Nav dark />

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

      <main>
        {/* Hero */}
        <section style={{ background: "#111", color: "#fff" }}>
          <div className="section-inner" style={{ padding: "20px 24px 0" }}>
            <Link href="/catalogue" style={{ textDecoration: "none", fontSize: 11, color: "rgba(255,255,255,0.35)", display: "inline-block", letterSpacing: "0.06em" }}>
              ← retour
            </Link>
          </div>
          <div className="section-inner car-hero-inner" style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap", padding: "16px 24px 48px" }}>
            <div style={{ flex: "1 1 380px" }}>
              <CarPhotoCarousel photos={photos} color={car!.color} alt={`${car!.brand} ${car!.model}`} />
            </div>

            <div className="car-info-block" style={{ flex: "1 1 280px" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,6vw,52px)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 20, color: "#fff", fontStyle: "italic", whiteSpace: "nowrap" }}>
                {car!.brand} {car!.model}
              </div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums lining-nums" }}>
                {car!.price} <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.4 }}>FCFA</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginBottom: 24 }}>CIF · Coût + Assurance + Fret inclus</div>

              <div className="car-cta-group">
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-cta-primary car-cta-wa"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
                >
                  Commander sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Détails */}
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="section-inner">

            {/* Couleurs — compact row */}
            {car!.colors && car!.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 16 }}>COULEURS DISPONIBLES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {car!.colors.map((col) => (
                    <div key={col} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 100, padding: "6px 14px 6px 8px" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: getColorHex(col), border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fiche technique — full width, 2 columns */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 20 }}>FICHE TECHNIQUE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "0 48px" }}>
                {Object.entries(car!.specs).map(([k, v]) => (
                  <div className="spec-row" key={k}>
                    <span className="spec-key">
                      <span className="spec-icon">{SPEC_ICONS[k] ?? "·"}</span>
                      {k}
                    </span>
                    <span className="spec-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {car!.desc && (() => {
            const reasons = car!.desc
              .split(/(?<=[.!?])\s+/)
              .map(s => s.trim())
              .filter(s => s.length > 10);
            return (
              <div className="section-inner" style={{ marginTop: 64 }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--red,#A01414)", fontWeight: 700, marginBottom: 10 }}>POURQUOI CHOISIR CETTE VOITURE</div>
                  <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, lineHeight: 1.2 }}>
                    {reasons.length} raisons d&apos;acheter la {car!.brand} <em style={{ color: "var(--red,#A01414)", fontStyle: "italic" }}>{car!.model}</em>
                  </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {reasons.map((reason, i) => (
                    <div key={i} style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "24px 28px",
                      display: "flex",
                      gap: 20,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--red,#A01414)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Syne, sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#333" }}>
                        {reason.replace(/\.$/, "").replace(/^Découvrez la [^.]+\.\s*/, "")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="section-inner" style={{ marginTop: 64 }}>
            <div style={{ background: "var(--yellow, #f5f0e8)", borderRadius: 24, padding: "48px", textAlign: "center" }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                Intéressé par la {car!.brand} {car!.model} ?
              </h2>
              <p style={{ color: "var(--mid)", marginBottom: 32 }}>
                Contactez-nous sur WhatsApp pour démarrer votre commande.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#A01414",
                  color: "#fff",
                  padding: "16px 40px",
                  borderRadius: 2,
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                📱 Démarrer ma commande →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer waNumber={waNumber} phoneDisplay={phoneDisplay} phoneCN={phoneCN} minimal />
    </>
  );
}
