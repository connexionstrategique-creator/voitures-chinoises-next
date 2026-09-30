import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "t3ow1rmc",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Missing SANITY_TOKEN"); process.exit(1); }

  // 1. UNI-Z PHEV — remove (飞船版) from Finition
  await client.patch("car-changan-uni-z-phev-2026-vaisseau")
    .set({ 'specs[_key=="s3"].value': "Édition Vaisseau — finition supérieure" })
    .commit();
  console.log("✓ UNI-Z patched");

  // 2. Tiggo 8 Pro PHEV — remove Chinese from Fabricant + Finition, add autohomeId
  await client.patch("car-chery-tiggo-8-pro-phev-2025")
    .set({
      'specs[_key=="s2"].value': "Chery Automobile",
      'specs[_key=="s3"].value': "Édition Champion · Finition Prestige",
      autohomeId: "ext/64074",
      autohomeInteriorId: "pano/64074",
    })
    .commit();
  console.log("✓ Tiggo 8 Pro patched + 3D IDs added");

  // 3. Galaxy L7 — remove Chinese from Modèle + Fabricant + Finition
  await client.patch("car-geely-galaxy-l7-2025-em-i")
    .set({
      'specs[_key=="s1"].value': "Geely Galaxy L7 2025 · EM-i 115 km · Édition Explorer",
      'specs[_key=="s2"].value': "Geely Automobile",
      'specs[_key=="s3"].value': "Édition Explorer",
    })
    .commit();
  console.log("✓ Galaxy L7 patched");

  console.log("\nTous les caractères chinois ont été supprimés.");
}

main().catch(console.error);
