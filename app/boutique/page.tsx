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

// Prices sourced from Taobao/JD.com — 1 RMB = 100 FCFA — transport excluded
const DEMO_PARTS: import("@/data/types").SparePart[] = [
  {
    id: "demo-1", name: "Filtre à huile moteur — Jetour X70 / T2 (1.5T)", slug: "filtre-huile-moteur-jetour",
    reference: "JT-1.5T-OFH", category: "filtration",
    description: "Filtre à huile compatible moteur 1.5T turbo. Remplacement recommandé tous les 5 000 km ou à chaque vidange. Pièce de rechange standard.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 2000, inStock: true, featured: false,
  },
  {
    id: "demo-2", name: "Filtre à huile moteur — Changan UNI-K (2.0T)", slug: "filtre-huile-moteur-changan-unik",
    reference: "CA-2.0T-OFH", category: "filtration",
    description: "Filtre à huile pour moteur Changan 2.0T Blue Whale. Remplacement recommandé tous les 5 000 km. Compatible UNI-K et CS75 Plus.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 3500, inStock: true, featured: false,
  },
  {
    id: "demo-3", name: "Filtre à air moteur", slug: "filtre-air-moteur",
    reference: "CHN-AFH-STD", category: "filtration",
    description: "Filtre à air moteur haute filtration. Remplacement tous les 15 000–20 000 km. Compatible plusieurs modèles.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-7",  brand: "Changan", model: "CS55" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 3000, inStock: true, featured: false,
  },
  {
    id: "demo-4", name: "Plaquettes de frein avant (paire) — Jetour", slug: "plaquettes-frein-avant-jetour",
    reference: "JT-BPF-C01", category: "freinage",
    description: "Plaquettes de frein avant semi-métalliques, marque TianHe (天合). Bonne résistance thermique pour usage intensif en ville et piste africaine. Vendues par paire.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 20000, inStock: true, featured: true,
  },
  {
    id: "demo-5", name: "Kit vidange complet — Jetour (huile 5W-30 + filtre)", slug: "kit-vidange-jetour",
    reference: "JT-VID-KIT1", category: "entretien",
    description: "Kit vidange complet : 4L d'huile moteur synthétique 5W-30 + filtre à huile. Idéal pour l'entretien régulier. Économique par rapport au passage en atelier.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
    ],
    photos: [], price: 17000, inStock: true, featured: true,
  },
  {
    id: "demo-6", name: "Disques de frein avant (paire) — Changan", slug: "disques-frein-avant-changan",
    reference: "CA-DFV-001", category: "freinage",
    description: "Disques de frein avant ventilés d'origine. Résistance thermique optimale. À remplacer avec les plaquettes pour une sécurité maximale. Vendus par paire.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
    ],
    photos: [], price: 45000, inStock: true, featured: false,
  },
  {
    id: "demo-7", name: "Amortisseurs avant (paire) — Jetour", slug: "amortisseurs-avant-jetour",
    reference: "JT-AMO-AVT", category: "suspension",
    description: "Amortisseurs avant d'origine. Adaptés aux routes africaines. Vendus par paire. Remplacement recommandé tous les 80 000 km ou en cas de fuites.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 185000, inStock: false, featured: false,
  },
  {
    id: "demo-8", name: "Batterie 12V 70Ah AGM", slug: "batterie-12v-70ah",
    reference: "CHN-BAT-70A", category: "electricite",
    description: "Batterie de démarrage 12V 70Ah AGM. Haute performance en climat chaud. Résistante aux vibrations. Durée de vie estimée 4–5 ans.",
    compatibleCars: [
      { id: "car-7",  brand: "Changan", model: "CS55" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-14", brand: "GAC Motor", model: "GS3" },
    ],
    photos: [], price: 75000, inStock: true, featured: false,
  },
  {
    id: "demo-9", name: "Tapis de sol TPE sur-mesure — Jetour T2 (jeu de 4)", slug: "tapis-sol-jetour-t2",
    reference: "ACC-TPS-JT2-TPE", category: "accessoires",
    description: "Tapis de sol en TPE (caoutchouc thermoplastique) moulés sur-mesure pour Jetour Traveler T2. Bords relevés anti-déversement, faciles à nettoyer à grande eau. Protège la moquette d'origine.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
    ],
    photos: [], price: 13000, inStock: true, featured: false,
  },
  {
    id: "demo-10", name: "Tapis de sol TPE sur-mesure — Changan UNI-K (jeu de 4)", slug: "tapis-sol-changan-unik",
    reference: "ACC-TPS-CA-UNIK", category: "accessoires",
    description: "Tapis de sol en TPE moulés sur-mesure pour Changan UNI-K. Bords surélevés, antidérapant, lavable. Protection complète du plancher.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
    ],
    photos: [], price: 12000, inStock: true, featured: false,
  },
  {
    id: "demo-11", name: "Couvre-volant cuir premium (universel)", slug: "couvre-volant-cuir",
    reference: "ACC-VLT-CU38", category: "accessoires",
    description: "Couvre-volant en cuir véritable, coutures contrastées. Diamètre 38 cm (universel). Améliore la prise en main et protège le volant d'origine contre l'usure.",
    compatibleCars: [],
    photos: [], price: 10000, inStock: true, featured: false,
  },
  {
    id: "demo-12", name: "Porte-clé métal — Jetour", slug: "porte-cle-jetour",
    reference: "ACC-PCL-JT-M", category: "accessoires",
    description: "Porte-clé en métal gravé au laser logo Jetour (捷途). Finition chromée brossée. Livré en boîte cadeau. Idéal comme cadeau ou souvenir.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 4000, inStock: true, featured: false,
  },
  {
    id: "demo-13", name: "Porte-clé métal — Changan", slug: "porte-cle-changan",
    reference: "ACC-PCL-CA-M", category: "accessoires",
    description: "Porte-clé en métal gravé logo Changan (长安). Finition chromée. Livré en boîte cadeau. Compatible avec toute la gamme Changan.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-7",  brand: "Changan", model: "CS55" },
    ],
    photos: [], price: 3500, inStock: true, featured: false,
  },
  {
    id: "demo-14", name: "Protège-clé cuir — Jetour Traveler T2", slug: "protege-cle-jetour-t2",
    reference: "ACC-PKC-JT2-L", category: "accessoires",
    description: "Housse de protection en cuir pour télécommande Jetour Traveler T2. Protège contre les rayures et l'usure. Coupe précise pour clé 4 boutons.",
    compatibleCars: [
      { id: "car-9",  brand: "Jetour", model: "TRAVELER T2 — 5 Places" },
      { id: "car-10", brand: "Jetour", model: "TRAVELER T2 — 7 Places" },
      { id: "car-11", brand: "Jetour", model: "TRAVELER T2 — 7 Places Premium" },
    ],
    photos: [], price: 4500, inStock: true, featured: false,
  },
  {
    id: "demo-15", name: "Protège-clé cuir — Changan (UNI-K / CS75)", slug: "protege-cle-changan",
    reference: "ACC-PKC-CA-L", category: "accessoires",
    description: "Housse de protection en cuir pour télécommande Changan. Compatible clés 3 boutons. Protège contre les rayures et l'usure quotidienne.",
    compatibleCars: [
      { id: "car-3",  brand: "Changan", model: "UNI-K" },
      { id: "car-4",  brand: "Changan", model: "CS75 PLUS ULTRA" },
      { id: "car-7",  brand: "Changan", model: "CS55" },
    ],
    photos: [], price: 4500, inStock: true, featured: false,
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
              Pièces de rechange et accessoires pour les véhicules de notre catalogue.
              Tout est disponible sur commande. Prix hors transport — précisez le mode souhaité (avion ou bateau) lors de votre commande.
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
              { icon: "✈️", title: "Avion ou bateau",    body: "Précisez votre mode de transport à la commande. Transport calculé séparément selon le mode choisi." },
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
