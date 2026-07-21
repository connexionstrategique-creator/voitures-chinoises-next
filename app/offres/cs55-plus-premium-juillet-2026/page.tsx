import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CarViewTabs from "@/components/CarViewTabs";
import Link from "next/link";
import { getColorHex } from "@/data/types";
import { getCarBySlug } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Changan CS55 PLUS PREMIUM 2026 — Offre Groupage TTC Juillet 2026 | Voitures Chinoises",
  description:
    "Offre groupage juillet 2026 : Changan CS55 PLUS PREMIUM 4è génération à 12 500 000 FCFA TTC livré Bénin & Togo. Achat, export, maritime, dédouanement, immatriculation, mutation inclus. 03 véhicules disponibles.",
  robots: "noindex",
};

const SPEC_ICONS: Record<string, string> = {
  Moteur: "⚙️", Puissance: "⚡", Couple: "🔩", Boîte: "🔄",
  Autonomie: "📍", Réservoir: "🛢️", Longueur: "📐", Largeur: "📐",
  Hauteur: "📐", Empattement: "📐", Coffre: "📦", Poids: "⚖️",
  Places: "👤", Toit: "🌤️", Écrans: "📺", Audio: "🔊",
  Caméra: "📷", Airbags: "🛡️", Freins: "🔴", Année: "📅",
};

const WA_BENIN = "2290141765341";
const WA_MSG = encodeURIComponent(
  "Bonjour, je suis intéressé par l'offre groupage Changan CS55 PLUS PREMIUM 2026 à 12 500 000 FCFA TTC. Pouvez-vous me donner plus d'informations ?"
);

export default async function OffreCS55PlusPremium() {
  const car = await getCarBySlug("changan-cs55-plus-premium");
  if (!car) return null;

  const photos = car.photos || [];

  return (
    <>
      <Nav dark />
      <main>
        <div className="car-detail-layout">

          {/* ── LEFT : carousel + 3D (identique à toutes les fiches) ── */}
          <div className="car-detail-left">
            <div style={{ padding: "20px 24px 8px" }}>
              <Link href="/catalogue" style={{ textDecoration: "none", fontSize: 15, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>
                ← retour
              </Link>
            </div>

            {/* Ticker offre — même animation que le marquee logos de la home */}
            <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
              <div style={{ padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ display: "inline-flex", alignItems: "center", animation: "marquee-scroll 22s linear infinite" }}>
                  {[0, 1].map((rep) => (
                    <span key={rep} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
                      {[
                        "Offre valable jusqu'au 07 Août 2026",
                        "03 véhicules disponibles",
                        "Paiement avant le 07 Août",
                        "Chargement conteneur le 16 Août",
                        "Groupage Juillet 2026",
                        "Bénin & Togo uniquement",
                      ].map((msg, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", paddingLeft: 28 }}>
                            {msg}
                          </span>
                          <span style={{ color: "#A01414", fontSize: 8, marginLeft: 28 }}>◆</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="car-detail-carousel-wrap" style={{ position: "relative" }}>
              {/* Badge sur la photo, positionné sous la barre d'onglets (~45px) */}
              <div style={{
                position: "absolute",
                top: 45,
                left: 0,
                zIndex: 20,
                background: "#A01414",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "6px 14px",
                pointerEvents: "none",
              }}>
                Offre Promo Juillet 2026
              </div>

              <CarViewTabs
                photos={photos}
                color={car.color}
                alt={`${car.brand} ${car.model}`}
                colorGroups={car.colorGroups}
                autohomeId={car.autohomeId}
                autohomeInteriorId={car.autohomeInteriorId}
                defaultTab="photos"
              />
            </div>
          </div>

          {/* ── RIGHT : infos ── */}
          <div className="car-detail-right">

            {/* Header sombre — même structure que les fiches voitures */}
            <div className="car-detail-header">
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(22px,3.5vw,42px)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 20, color: "#fff" }}>
                {car.brand} {car.model}
              </div>

              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(30px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums lining-nums" }}>
                12 500 000 <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.4 }}>FCFA</span>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  Tout inclus dans le prix
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", marginBottom: 14 }}>
                  {["Achat véhicule", "Licence export", "Transport maritime", "Dédouanement", "Immatriculation", "Mutation"].map((item) => (
                    <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 10px" }}>
                      <span style={{ color: "#4CAF50", fontSize: 11, lineHeight: 1 }}>✓</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500, letterSpacing: "0.02em" }}>{item}</span>
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", marginBottom: 10 }}>
                  Groupage · 03 véhicules · Paiement avant le 07 Août · Chargement 16 Août
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", marginBottom: 4 }}>LIVRAISON VERS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", lineHeight: 1.5 }}>
                  {[{ code: "bj", name: "Bénin" }, { code: "tg", name: "Togo" }].map(({ code, name }) => (
                    <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://flagcdn.com/16x12/${code}.png`} width={16} height={12} alt={name} style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2 }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="car-cta-group">
                <a
                  href={`https://wa.me/${WA_BENIN}?text=${WA_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-cta-primary car-cta-wa"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
                >
                  Commander sur WhatsApp
                </a>
              </div>
            </div>

            {/* Contenu blanc — même structure */}
            <div className="car-detail-content">
              <div style={{ padding: "32px clamp(20px,5vw,48px) 0" }}>

                {/* Couleurs */}
                {car.colors && car.colors.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 16 }}>COULEURS DISPONIBLES</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {car.colors.filter((col) => col !== "Bleu Azure").map((col) => (
                        <div key={col} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 100, padding: "6px 14px 6px 8px" }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: getColorHex(col), border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{col}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Détails offre groupage */}
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 20 }}>DÉTAILS DE L&apos;OFFRE GROUPAGE</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {[
                        ["Date limite de paiement", "07 Août 2026"],
                        ["Date de chargement conteneur", "16 Août 2026"],
                        ["Véhicules disponibles", "03 unités"],
                        ["Bonus (paiement avant 07 Août)", "Pneu secours · Bâche de protection · Tapis de sol premium · Kit nettoyage"],
                        ["Bonus supplémentaire (avant 31 Juillet)", "Coussin lombaire chauffant · Gourde spécial de grâce"],
                        ["Garantie", "Vérification avant expédition · Accompagnement immatriculation"],
                        ["Bureau Bénin", "Cotonou, Etoile Rouge, Bâtiment C955, rue avant la BOA"],
                      ].map(([k, v], i) => (
                        <tr key={k} style={{ background: i % 2 === 0 ? "#F5F5F5" : "#fff" }}>
                          <td style={{ padding: "11px 14px", width: 36, textAlign: "center", fontSize: 17, lineHeight: 1, verticalAlign: "top" }}>·</td>
                          <td style={{ padding: "11px 8px 11px 0", fontSize: 13, fontWeight: 600, color: "#666", verticalAlign: "top", width: "38%" }}>{k}</td>
                          <td style={{ padding: "11px 16px 11px 12px", fontSize: 14, fontWeight: 500, color: "#111", verticalAlign: "top", wordBreak: "break-word" }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Fiche technique */}
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#A01414", fontWeight: 700, marginBottom: 20 }}>FICHE TECHNIQUE</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {Object.entries(car.specs).map(([k, v], i) => (
                        <tr key={k} style={{ background: i % 2 === 0 ? "#F5F5F5" : "#fff" }}>
                          <td style={{ padding: "11px 14px", width: 36, textAlign: "center", fontSize: 17, lineHeight: 1, verticalAlign: "top" }}>
                            {SPEC_ICONS[k] ?? "·"}
                          </td>
                          <td style={{ padding: "11px 8px 11px 0", fontSize: 13, fontWeight: 600, color: "#666", verticalAlign: "top", width: "38%" }}>
                            {k}
                          </td>
                          <td style={{ padding: "11px 16px 11px 12px", fontSize: 14, fontWeight: 500, color: "#111", verticalAlign: "top", wordBreak: "break-word" }}>
                            {v}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* CTA final */}
              <div style={{ padding: "0 clamp(20px,5vw,48px) 64px" }}>
                <div style={{ background: "#F5F5F5", borderRadius: 24, padding: "clamp(28px,5vw,48px)", textAlign: "center" }}>
                  <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                    Intéressé par cette offre ?
                  </h2>
                  <p style={{ color: "#555", marginBottom: 32 }}>
                    Contactez-nous sur WhatsApp pour réserver votre véhicule.
                  </p>
                  <a
                    href={`https://wa.me/${WA_BENIN}?text=${WA_MSG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#A01414", color: "#fff", padding: "16px 40px", borderRadius: 2, fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textDecoration: "none", textTransform: "uppercase" }}
                  >
                    Réserver sur WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer minimal />
    </>
  );
}
