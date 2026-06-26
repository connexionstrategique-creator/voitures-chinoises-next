import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CarPhotoCarousel from "@/components/CarPhotoCarousel";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARS } from "@/data/cars";
import { getColorHex } from "@/data/types";
import { carSlug } from "@/lib/slug";
import { getCarBySlug, getCars, getSiteSettings, getPosts } from "@/sanity/queries";
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

function buildEmotionalReasons(
  brand: string,
  model: string,
  specs: Record<string, string>
): { title: string; body: string }[] {
  const s = specs || {};
  const places = s["Places"] || s["Sièges"] || "";
  const power = s["Puissance"] || "";
  const conso = s["Consommation"] || "";
  const boite = s["Boîte"] || "";
  const coffre = s["Coffre"] || "";
  const toit = s["Toit ouvrant"] || s["Toit"] || "";
  const airbags = s["Airbags"] || "";
  const isAutomatic = !!boite && (
    boite.toLowerCase().includes("dct") ||
    boite.toLowerCase().includes("automatique") ||
    boite.toLowerCase().includes("cvt") ||
    /\bat\b/i.test(boite)
  );

  const out: { title: string; body: string }[] = [];

  if (places.includes("7") || places.includes("8")) {
    out.push({
      title: "Toute la famille embarque",
      body: `7 places — personne ne reste à la maison. La ${brand} ${model} est faite pour les familles qui n'abandonnent jamais les leurs : le marché du dimanche, le voyage au village, la rentrée des enfants.`,
    });
  } else {
    out.push({
      title: "Un espace pensé pour les vôtres",
      body: `Chaque matin, chaque soir, la ${brand} ${model} vous ramène à ceux que vous aimez. Un habitacle conçu pour le confort de toute la famille — parce que chaque trajet compte.`,
    });
  }

  if (power) {
    out.push({
      title: "Une puissance qui impose le respect",
      body: `${power} sous le capot. Dans les rues de Cotonou comme sur les routes de l'intérieur, vous conduisez avec assurance. Les dépassements se font naturellement, sans à-coups, sans stress.`,
    });
  }

  out.push({
    title: "Neuf. 0 km. Jamais immatriculé.",
    body: "Vous êtes le premier à poser les mains sur ce volant. Aucun kilomètre inconnu, aucune réparation cachée. Une virginité mécanique totale, documentée et garantie d'usine.",
  });

  if (isAutomatic) {
    out.push({
      title: "Fini le stress des embouteillages",
      body: `Boîte ${boite} — vos jambes se reposent, votre concentration reste sur la route. Dans les bouchons de Cotonou ou d'Abidjan, vous avancez sereinement pendant que les autres s'épuisent sur leur embrayage.`,
    });
  }

  if (conso) {
    out.push({
      title: "Votre budget carburant s'allège",
      body: `${conso} de consommation moyenne. Sur 3 ans, la différence se chiffre en centaines de milliers de FCFA — de l'argent qui reste dans votre poche, pas à la pompe.`,
    });
  }

  out.push({
    title: "Livré jusqu'à votre port, sans surprise",
    body: "CIF inclus — Coût, Assurance, Fret pris en charge. Cotonou, Lomé, Abidjan ou Dakar : même prix, même service. Vous payez une fois, vous recevez votre véhicule prêt à rouler.",
  });

  out.push({
    title: `${brand} : technologie mondiale, prix africain`,
    body: `${brand} investit des milliards en R&D chaque année. Ce que vous achetez n'est pas une "voiture chinoise bon marché" — c'est une technologie mondiale vendue à un prix que l'Afrique peut se permettre. La différence, c'est nous.`,
  });

  if (airbags) {
    out.push({
      title: "Votre famille protégée à chaque trajet",
      body: `${airbags} airbags, freinage ABS, aide au freinage d'urgence. Parce que la voiture que vous choisissez, c'est aussi celle dans laquelle vous mettez vos enfants. La sécurité n'est pas un luxe.`,
    });
  }

  if (coffre) {
    out.push({
      title: "Assez de place pour tout",
      body: `${coffre} de volume de coffre. Les bagages du mois, les achats du marché, l'équipement du week-end — tout rentre. Vous ne faites plus de compromis entre confort et capacité.`,
    });
  }

  if (toit) {
    out.push({
      title: "Le luxe, enfin accessible",
      body: `Toit ${toit.toLowerCase()} — des équipements réservés aux véhicules premium, désormais à portée de main. La ${brand} ${model} vous offre le prestige sans le prix du prestige.`,
    });
  }

  return out.slice(0, 6);
}

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

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try { posts = (await getPosts()).slice(0, 3); } catch {}

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
        <div className="car-detail-layout">

          {/* LEFT — carousel sticky */}
          <div className="car-detail-left">
            <div style={{ padding: "20px 24px 12px" }}>
              <Link href="/catalogue" style={{ textDecoration: "none", fontSize: 11, color: "rgba(255,255,255,0.35)", display: "inline-block", letterSpacing: "0.06em" }}>
                ← retour
              </Link>
            </div>
            <div className="car-detail-carousel-wrap">
              <CarPhotoCarousel
                photos={photos}
                color={car!.color}
                alt={`${car!.brand} ${car!.model}`}
                colorGroups={car!.colorGroups}
              />
            </div>
          </div>

          {/* RIGHT — scrollable */}
          <div className="car-detail-right">

            {/* Title + Price + CTA (dark) */}
            <div className="car-detail-header">
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(22px,3vw,40px)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 20, color: "#fff" }}>
                {car!.brand} {car!.model}
              </div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums lining-nums" }}>
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

            {/* Details (white) */}
            <div className="car-detail-content">
          <div style={{ padding: "32px 48px 0" }}>

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
              <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
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

          {(() => {
            const reasons = (car!.reasons && car!.reasons.length > 0)
              ? car!.reasons
              : buildEmotionalReasons(car!.brand, car!.model, car!.specs);
            return (
              <div style={{ marginTop: 64, padding: "0 48px" }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--red,#A01414)", fontWeight: 700, marginBottom: 10 }}>POURQUOI CHOISIR CETTE VOITURE</div>
                  <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, lineHeight: 1.2 }}>
                    {reasons.length} raisons d&apos;acheter la {car!.brand}{" "}
                    <em style={{ color: "var(--red,#A01414)", fontStyle: "normal" }}>{car!.model}</em>
                  </h2>
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  {reasons.map((reason, i) => (
                    <div key={i} style={{
                      background: "var(--yellow,#F5F5F5)",
                      borderRadius: 16,
                      padding: "28px 32px",
                      display: "flex",
                      gap: 24,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "var(--red,#A01414)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Syne, sans-serif",
                        fontSize: 18,
                        fontWeight: 800,
                        lineHeight: 1,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: "#111" }}>
                          {reason.title}
                        </div>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#555" }}>
                          {reason.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {car!.youtubeId && (
            <div style={{ marginTop: 64, padding: "0 48px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 20 }}>VIDÉO</div>
              <YouTubeEmbed youtubeId={car!.youtubeId} title={`${car!.brand} ${car!.model}`} />
            </div>
          )}

          <div style={{ padding: "0 48px 48px" }}>
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

          {/* Articles de blog */}
          {posts.length > 0 && (
            <div style={{ padding: "48px 48px 64px", borderTop: "1px solid var(--border,#E0E0E0)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 12 }}>POUR ALLER PLUS LOIN</div>
              <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 900, marginBottom: 28, lineHeight: 1.2 }}>
                Les marques chinoises sous la loupe
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
                {posts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`} className="blog-article-card">
                    {post.imageUrl && (
                      <div style={{ height: 130, background: "#111", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.imageUrl} alt={post.imageAlt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                      </div>
                    )}
                    <div style={{ padding: "14px 16px 18px" }}>
                      {(post as any).categoryLabel && (
                        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#A01414", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>{(post as any).categoryLabel}</div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, color: "#111" }}>{post.title}</div>
                      {post.excerpt && (
                        <div style={{ fontSize: 12, color: "var(--mid,#666)", lineHeight: 1.5, marginTop: 5 }}>{post.excerpt.slice(0, 80)}…</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
            </div>{/* /car-detail-content */}
          </div>{/* /car-detail-right */}
        </div>{/* /car-detail-layout */}
      </main>
      <Footer waNumber={waNumber} phoneDisplay={phoneDisplay} phoneCN={phoneCN} minimal />
    </>
  );
}
