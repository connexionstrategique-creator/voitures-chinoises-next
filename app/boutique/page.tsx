import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BoutiqueClient from "./BoutiqueClient";
import { getSpareParts, getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique Pièces de Rechange | Voitures Chinoises",
  description:
    "Pièces de rechange d'origine pour vos voitures chinoises : filtres, freins, moteur, suspension, électricité. Prix de référence · Commande sur WhatsApp.",
  alternates: { canonical: "https://www.voitureschinoises.com/boutique" },
};

const CATEGORY_LABELS: Record<string, string> = {
  filtration:  "Filtration",
  freinage:    "Freinage",
  moteur:      "Moteur",
  suspension:  "Suspension",
  electricite: "Électricité",
  carrosserie: "Carrosserie",
  entretien:   "Entretien courant",
  autre:       "Autres pièces",
};

export default async function BoutiquePage() {
  const [parts, settings] = await Promise.all([getSpareParts(), getSiteSettings()]);
  const waNumber = settings?.whatsappNumber ?? "8619587439774";
  const phoneDisplay = settings?.phoneDisplay ?? "+229 01 41 76 53 41";
  const phoneCN = settings?.phoneCN ?? "+86 195 8743 9774";

  // Category breakdown for the header
  const categoryCounts = parts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ── */}
        <section style={{
          background: "#0D0D0D",
          color: "#fff",
          padding: "80px clamp(16px,4vw,48px) 64px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#A01414", fontWeight: 700, marginBottom: 16 }}>
              BOUTIQUE
            </div>
            <h1 className="blog-page-hero-title" style={{ marginBottom: 20 }}>
              Pièces de{" "}
              <em className="blog-page-hero-em">rechange</em>
            </h1>
            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.6)", maxWidth: 540, lineHeight: 1.6, marginBottom: 40 }}>
              Pièces d&apos;origine et compatibles pour les véhicules de notre catalogue.
              Prix de référence — commande directe via WhatsApp.
            </p>

            {/* Stats catégories */}
            {Object.keys(categoryCounts).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 100,
                    padding: "8px 16px",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    {CATEGORY_LABELS[cat] ?? cat}{" "}
                    <span style={{ color: "#A01414", fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Catalogue ── */}
        <section style={{ background: "#fff", padding: "48px 0 80px" }}>
          {parts.length === 0 ? (
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🔩</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Catalogue en cours de préparation</h2>
              <p style={{ color: "#666", fontSize: 15, marginBottom: 32 }}>
                Les pièces de rechange seront disponibles très prochainement.<br />
                Contactez-nous sur WhatsApp pour toute demande urgente.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Bonjour, je cherche une pièce de rechange pour mon véhicule. Pouvez-vous m'aider ?")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#A01414", color: "#fff",
                  padding: "16px 36px", borderRadius: 8,
                  fontWeight: 700, fontSize: 14,
                  letterSpacing: "0.05em", textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                📱 Nous contacter
              </a>
            </div>
          ) : (
            <BoutiqueClient parts={parts} waNumber={waNumber} />
          )}
        </section>

        {/* ── Bannière rassurance ── */}
        <section style={{ background: "#F5F5F5", padding: "48px clamp(16px,4vw,48px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { icon: "🏭", title: "Pièces d'origine",   body: "Directement sourcées auprès des fournisseurs agréés en Chine." },
              { icon: "📦", title: "Livraison groupée",   body: "Combinez vos pièces avec votre commande de véhicule pour optimiser les frais de port." },
              { icon: "💬", title: "Devis sous 48h",      body: "Envoyez-nous votre demande sur WhatsApp, nous vous répondons rapidement." },
              { icon: "🛡️",  title: "Pièces garanties",   body: "Chaque pièce est vérifiée avant expédition. Garantie qualité constructeur." },
            ].map((item) => (
              <div key={item.title}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#0D0D0D" }}>{item.title}</div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer waNumber={waNumber} phoneDisplay={phoneDisplay} phoneCN={phoneCN} minimal />
    </>
  );
}
