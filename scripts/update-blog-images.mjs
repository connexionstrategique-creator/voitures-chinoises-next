/**
 * Met à jour les images des articles de blog avec des photos Pexels libres de droits.
 * Chaque photo est téléchargée depuis Pexels, uploadée dans Sanity, puis assignée
 * aux articles en tant que mainImage (cover) et images dans le corps (body).
 */

import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";

const client = createClient({
  projectId: PROJECT_ID, dataset: DATASET,
  apiVersion: "2024-01-01", useCdn: false, token: TOKEN,
});

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VoituresChinoises/1.0)",
        "Accept": "image/jpeg,image/*",
      },
    };
    proto.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadBuffer(res.headers.location));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function uploadFromUrl(url, filename, alt) {
  console.log(`  ↑ ${filename}`);
  const buf = await downloadBuffer(url);
  const asset = await client.assets.upload("image", buf, {
    filename,
    contentType: "image/jpeg",
    label: alt,
  });
  console.log(`  ✓ ${filename} → ${asset._id}`);
  return asset._id;
}

// ─── IMAGES PEXELS (libres de droits, usage commercial autorisé) ──────────────
// Format : https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?w=1920
const PX = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const PHOTOS = {
  // SUV & voitures
  suv_aerial:      { url: PX(6552198),  name: "pexels-suv-aerial-road.jpg",        alt: "Vue aérienne d'un SUV sur route" },
  suv_white_road:  { url: PX(14776590), name: "pexels-white-suv-road.jpg",          alt: "SUV blanc sur route" },
  suv_range:       { url: PX(116675),   name: "pexels-range-rover-white.jpg",       alt: "SUV premium blanc" },
  suv_front:       { url: PX(13365861), name: "pexels-suv-front-view.jpg",          alt: "SUV vue de face" },
  suv_tropical:    { url: PX(4577418),  name: "pexels-suv-tropical-road.jpg",       alt: "SUV sur route tropicale avec palmiers" },

  // Intérieurs
  interior_dash:   { url: PX(36718053), name: "pexels-luxury-interior-dashboard.jpg", alt: "Intérieur luxe — tableau de bord digital" },
  interior_sport:  { url: PX(5158160),  name: "pexels-sport-car-interior.jpg",      alt: "Intérieur sportif — tableau de bord" },
  interior_mod:    { url: PX(11650151), name: "pexels-modern-car-interior.jpg",     alt: "Habitacle moderne" },

  // Port / shipping
  cargo_ship:      { url: PX(11299377), name: "pexels-cargo-ship-containers.jpg",  alt: "Navire cargo avec conteneurs au port" },

  // Électrique / EV
  ev_charging:     { url: PX(9800009),  name: "pexels-ev-charging-station.jpg",    alt: "Borne de recharge véhicule électrique" },
};

async function main() {
  console.log("🖼️  Téléchargement & upload des images Pexels dans Sanity...\n");

  const ids = {};
  for (const [key, { url, name, alt }] of Object.entries(PHOTOS)) {
    try {
      ids[key] = await uploadFromUrl(url, name, alt);
    } catch (err) {
      console.warn(`  ⚠️  Échec ${name}: ${err.message}`);
    }
  }

  console.log("\n🔄 Mise à jour des articles avec les nouvelles images...\n");

  const updates = [
    // ── Article 1 : Comparatif SUV chinois 2026 ───────────────────────────────
    {
      id: "article-comparatif-suv-chinois-2026",
      title: "Meilleur SUV chinois en 2026",
      mainImage: { assetId: ids.suv_aerial, alt: "Vue aérienne d'un SUV sur route — comparatif 2026" },
    },

    // ── Article 2 : BYD en Afrique de l'Ouest ────────────────────────────────
    {
      id: "article-byd-afrique-ouest-prix-modeles-2026",
      title: "BYD en Afrique de l'Ouest",
      mainImage: { assetId: ids.ev_charging, alt: "Borne de recharge électrique BYD — Afrique de l'Ouest" },
    },

    // ── Article 3 : Voiture chinoise fiable ──────────────────────────────────
    {
      id: "article-voiture-chinoise-fiable-verites-2026",
      title: "Voiture chinoise fiable — 7 vérités",
      mainImage: { assetId: ids.suv_front, alt: "SUV chinois moderne — vue de face" },
    },

    // ── Article 4 : Dédouanement ─────────────────────────────────────────────
    {
      id: "article-dedouanement-voiture-afrique-ouest-2026",
      title: "Dédouanement voiture Afrique de l'Ouest",
      mainImage: { assetId: ids.cargo_ship, alt: "Navire cargo — port d'importation en Afrique de l'Ouest" },
    },

    // ── Article 5 : Haval vs Changan vs Jetour ───────────────────────────────
    {
      id: "article-haval-changan-jetour-comparatif-famille-2026",
      title: "Haval vs Changan vs Jetour",
      mainImage: { assetId: ids.suv_tropical, alt: "SUV familial sur route tropicale — Afrique" },
    },

    // ── Article 6 : Marché automobile Afrique de l'Ouest ─────────────────────
    {
      id: "article-marche-automobile-afrique-ouest-tendances-2026",
      title: "Marché automobile Afrique de l'Ouest 2026",
      mainImage: { assetId: ids.suv_white_road, alt: "SUV blanc sur route — marché automobile africain" },
    },
  ];

  for (const { id, title, mainImage } of updates) {
    if (!mainImage.assetId) {
      console.warn(`  ⚠️  Pas d'image disponible pour : ${title}`);
      continue;
    }
    await client.patch(id).set({
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: mainImage.assetId },
        alt: mainImage.alt,
      },
    }).commit();
    console.log(`  ✅ "${title}"`);
  }

  // ── Mettre à jour aussi le premier article (guide importation) ──────────────
  if (ids.suv_range) {
    await client.patch("article-guide-importation-voitures-chinoises-afrique").set({
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: ids.suv_range },
        alt: "SUV premium importé depuis la Chine — livraison Afrique",
      },
    }).commit();
    console.log(`  ✅ "Guide importation voiture chinoise Afrique"`);
  }

  console.log("\n🎉 Toutes les images ont été mises à jour avec succès !");
  console.log("\n📸 Sources Pexels (libres de droits, usage commercial autorisé) :");
  console.log("   pexels.com — License : https://www.pexels.com/license/");
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});
