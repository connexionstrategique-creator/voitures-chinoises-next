import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BoutiqueClient from "./BoutiqueClient";
import { getSpareParts, getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique Pièces & Accessoires | Voitures Chinoises",
  description:
    "Pièces de rechange et accessoires pour vos voitures chinoises : filtres, freins, tapis de sol, couvre-volant, porte-clé et plus. Prix de référence · Commande sur WhatsApp.",
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
  accessoires: "Accessoires",
  autre:       "Autres pièces",
};

const DEMO_PARTS: import("@/data/types").SparePart[] = [
  {
    id: "demo-1", name: "Filtre à huile moteur", slug: "filtre-huile-moteur",
    reference: "CHN-FLT-001", category: "filtration",
    description: "Filtre à huile d'origine haute filtration. Remplacement recommandé tous les 5 000 km ou lors de chaque vidange.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 12000, inStock: true, featured: true,
  },
  {
    id: "demo-2", name: "Plaquettes de frein avant", slug: "plaquettes-frein-avant",
    reference: "CHN-FRN-012", category: "freinage",
    description: "Plaquettes de frein avant céramique haute performance. Longue durée de vie, faible bruit.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
    ],
    photos: [], price: 35000, inStock: true, featured: false,
  },
  {
    id: "demo-3", name: "Filtre à air habitacle", slug: "filtre-air-habitacle",
    reference: "CHN-FLT-008", category: "filtration",
    description: "Filtre à air de l'habitacle avec couche anti-bactérienne et anti-pollen. Change tous les 15 000 km.",
    compatibleCars: [
      { id: "car-7",  brand: "Changan", model: "CS55" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
    ],
    photos: [], price: 8500, inStock: true, featured: false,
  },
  {
    id: "demo-4", name: "Kit courroie de distribution", slug: "kit-courroie-distribution",
    reference: "CHN-MOT-034", category: "moteur",
    description: "Kit complet courroie de distribution avec tendeur et galet. Pièce critique — remplacement obligatoire tous les 60 000 km.",
    compatibleCars: [
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
    ],
    photos: [], price: 95000, inStock: false, featured: false,
  },
  {
    id: "demo-5", name: "Amortisseurs avant (paire)", slug: "amortisseurs-avant",
    reference: "CHN-SUS-021", category: "suspension",
    description: "Amortisseurs avant d'origine, renforcés pour les routes africaines. Vendus par paire.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 185000, inStock: true, featured: false,
  },
  {
    id: "demo-6", name: "Batterie 12V 70Ah", slug: "batterie-12v-70ah",
    reference: "CHN-ELC-005", category: "electricite",
    description: "Batterie de démarrage 12V 70Ah AGM. Haute performance en climat chaud. Garantie 2 ans.",
    compatibleCars: [
      { id: "car-7",  brand: "Changan", model: "CS55" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-14", brand: "GAC Motor", model: "GS3" },
    ],
    photos: [], price: 75000, inStock: true, featured: false,
  },
  {
    id: "demo-7", name: "Disques de frein avant (paire)", slug: "disques-frein-avant",
    reference: "CHN-FRN-019", category: "freinage",
    description: "Disques de frein avant ventilés d'origine. Résistance thermique optimale. À changer avec les plaquettes.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 58000, inStock: true, featured: false,
  },
  {
    id: "demo-8", name: "Kit entretien 10 000 km", slug: "kit-entretien-10000km",
    reference: "CHN-ENT-KIT1", category: "entretien",
    description: "Kit complet : filtre à huile + filtre à air moteur + filtre habitacle + 5L d'huile moteur 5W-30. Économique.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-7",  brand: "Changan", model: "CS55" },
    ],
    photos: [], price: 48000, inStock: true, featured: true,
  },
  {
    id: "demo-9", name: "Tapis de sol sur-mesure (jeu de 4)", slug: "tapis-sol-sur-mesure",
    reference: "ACC-TPS-001", category: "accessoires",
    description: "Tapis de sol en caoutchouc 3D sur-mesure, bords relevés anti-déversement. Faciles à nettoyer, protège la moquette d'origine.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 22000, inStock: true, featured: false,
  },
  {
    id: "demo-10", name: "Couvre-volant cuir premium", slug: "couvre-volant-cuir",
    reference: "ACC-VLT-003", category: "accessoires",
    description: "Couvre-volant en cuir véritable, coutures contrastées. Améliore la prise en main et protège le volant d'origine.",
    compatibleCars: [],
    photos: [], price: 15000, inStock: true, featured: false,
  },
  {
    id: "demo-11", name: "Porte-clé Jetour métal", slug: "porte-cle-jetour",
    reference: "ACC-PCL-JT1", category: "accessoires",
    description: "Porte-clé en métal gravé logo Jetour. Finition chromée. Livré en boîte cadeau.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 5000, inStock: true, featured: false,
  },
  {
    id: "demo-12", name: "Protège-clé cuir (housse télécommande)", slug: "protege-cle-cuir",
    reference: "ACC-PCL-CV1", category: "accessoires",
    description: "Housse de protection en cuir pour télécommande de véhicule. Protège contre les rayures et l'usure. Compatible clés 3 boutons.",
    compatibleCars: [
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-7",  brand: "Changan", model: "CS55" },
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
    ],
    photos: [], price: 7500, inStock: true, featured: false,
  },
];

export default async function BoutiquePage() {
  const [sanityParts, settings] = await Promise.all([getSpareParts(), getSiteSettings()]);
  const waNumber = settings?.whatsappNumber ?? "8619587439774";
  const phoneDisplay = settings?.phoneDisplay ?? "+229 01 41 76 53 41";
  const phoneCN = settings?.phoneCN ?? "+86 195 8743 9774";

  // Use demo data when Sanity is empty (preview mode)
  const parts = sanityParts.length > 0 ? sanityParts : DEMO_PARTS;

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
              Pièces &amp; <em className="blog-page-hero-em">accessoires</em>
            </h1>
            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.6)", maxWidth: 580, lineHeight: 1.6, marginBottom: 40 }}>
              Pièces de rechange d&apos;origine et accessoires pour les véhicules de notre catalogue.
              Tout est disponible sur commande — prix de référence, livraison directe via WhatsApp.
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
