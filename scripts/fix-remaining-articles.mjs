/**
 * Fix the 3 remaining articles that were missed or have duplicate/wrong images.
 * - CATL 2026 (auto-id): dark sports car image → EV charging image
 * - Salon de Pékin (auto-id): duplicate Hyundai image → auto show image
 * - Omoda/Chery/Geely (auto-id): duplicate Hyundai image → modern Chinese SUV
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
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} — ${url}`));
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
  console.log("🖼️  Correction des 3 articles restants...\n");

  // CATL 2026 — véhicule électrique en charge, technologie batterie
  const catlId = await upload(PX(3571576), "ev-charge-batterie-catl.jpg", "Véhicule électrique en charge — technologie batterie CATL 2026");

  // Salon de Pékin — salon automobile, exposition stands
  const salonId = await upload(PX(1340185), "salon-auto-pekin-chine.jpg", "Salon automobile de Pékin 2026 — révolution électrique chinoise");

  // Omoda / Chery / Geely — SUV moderne asiatique
  const omoda_id = await upload(PX(210019), "suv-chinois-omoda-chery-geely.jpg", "Omoda C5, Chery Tiggo, Geely Atlas — SUV chinois 2026");

  console.log("\n🔄 Mise à jour Sanity...\n");

  const updates = [
    { id: "Y7uwyR3TR6B18ICii4mLga", assetId: catlId,   alt: "Batterie CATL 2026 — charge rapide 4 minutes, 1 500 km d'autonomie" },
    { id: "fEgPm0GnAQb0S9IeucR9Fz", assetId: salonId,  alt: "Salon de Pékin 2026 — révolution électrique chinoise" },
    { id: "KOW9SnXoBiNxp6TLs1iHmU", assetId: omoda_id, alt: "Omoda C5, Chery Tiggo 8 Pro, Geely Atlas — comparatif SUV chinois Afrique" },
  ];

  for (const { id, assetId, alt } of updates) {
    await client.patch(id).set({
      mainImage: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt },
    }).commit();
    console.log(`  ✅ ${id}`);
  }

  console.log("\n✅ Terminé !");
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
