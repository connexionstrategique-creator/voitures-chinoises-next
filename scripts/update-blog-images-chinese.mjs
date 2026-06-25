/**
 * Met à jour les images des articles avec de vraies photos de marques chinoises.
 * Sources : Pexels (libres de droits) — photos identifiées par ID.
 */
import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const client = createClient({ projectId: "t3ow1rmc", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: TOKEN });

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/jpeg,image/*" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return resolve(downloadBuffer(res.headers.location));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function upload(url, filename, alt) {
  console.log(`  ↑ ${filename}`);
  const buf = await downloadBuffer(url);
  const asset = await client.assets.upload("image", buf, { filename, contentType: "image/jpeg", label: alt });
  console.log(`  ✓ ${asset._id}`);
  return asset._id;
}

const PX = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

async function main() {
  console.log("🖼️  Upload des nouvelles images marques chinoises...\n");

  // Images sélectionnées sur Pexels — vraies voitures chinoises ou contexte pertinent
  const bydId        = await upload(PX(12195080),  "byd-car-japan.jpg",           "BYD — voiture électrique chinoise");
  const showroomId   = await upload(PX(7629179),   "car-showroom-modern.jpg",     "Showroom automobile moderne — marques chinoises");
  const dealershipId = await upload(PX(7387470),   "luxury-car-dealership.jpg",   "Concessionnaire véhicules premium");
  const newCarId     = await upload(PX(14999407),  "brand-new-car-display.jpg",   "Véhicule neuf — zéro kilomètre");
  const sportsId     = await upload(PX(29753296),  "luxury-sports-showroom.jpg",  "SUV sportif en showroom");
  const portId       = await upload(PX(1554646),   "container-port-africa.jpg",   "Port commercial — import export véhicules");
  const cityCarId    = await upload(PX(3802510),   "suv-city-modern.jpg",         "SUV en ville — conduite urbaine");
  const interiorId   = await upload(PX(1149831),   "car-interior-premium.jpg",    "Intérieur premium — finitions haut de gamme");

  console.log("\n🔄 Mise à jour des articles...\n");

  const updates = [
    // Guide importation → showroom neuf
    { id: "article-guide-importation-voitures-chinoises-afrique", assetId: newCarId,     alt: "Véhicule chinois neuf 0km — importation directe" },
    // Comparatif SUV → showroom moderne (plusieurs SUV)
    { id: "article-comparatif-suv-chinois-2026",                  assetId: showroomId,   alt: "Showroom SUV chinois 2026 — comparatif modèles" },
    // BYD Afrique → vrai BYD
    { id: "article-byd-afrique-ouest-prix-modeles-2026",          assetId: bydId,        alt: "BYD — voiture électrique chinoise en Afrique de l'Ouest" },
    // Fiabilité → concessionnaire premium
    { id: "article-voiture-chinoise-fiable-verites-2026",         assetId: dealershipId, alt: "Concessionnaire véhicules chinois — qualité garantie" },
    // Dédouanement → port
    { id: "article-dedouanement-voiture-afrique-ouest-2026",      assetId: portId,       alt: "Port de Cotonou — dédouanement import véhicules" },
    // Haval vs Changan → SUV sportif
    { id: "article-haval-changan-jetour-comparatif-famille-2026", assetId: sportsId,     alt: "SUV familial chinois — Haval, Changan, Jetour" },
    // Marché automobile → SUV en ville
    { id: "article-marche-automobile-afrique-ouest-tendances-2026", assetId: cityCarId,  alt: "SUV chinois en ville africaine — tendances 2026" },
  ];

  for (const { id, assetId, alt } of updates) {
    if (!assetId) { console.warn(`  ⚠️  Pas d'image pour ${id}`); continue; }
    await client.patch(id).set({
      mainImage: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt },
    }).commit();
    console.log(`  ✅ ${id.replace("article-", "")}`);
  }

  console.log("\n✅ Images mises à jour !");
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
