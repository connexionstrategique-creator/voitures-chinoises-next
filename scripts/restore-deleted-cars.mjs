/**
 * Restore 8 incorrectly deleted car documents in Sanity
 * Also deletes car-22 (Jetour Conquer - 0 photos)
 *
 * Cars to restore:
 *   car-14  GAC Motor GS3            (5 photos)
 *   car-17  Jetour T2 7 Pl. Premium  (17 photos)
 *   car-18  EXEED STELLAR 400T       (18 photos)
 *   car-19  Geely COOLRAY CVT        (7 photos)
 *   car-20  Geely COOLRAY Manuel     (7 photos)
 *   car-24  Changan CS55 PLUS PHEV   (29 photos)
 *   car-28  Roewe i5 Manuel          (8 photos)
 *   car-29  MG MG5 CVT Deluxe        (15 photos)
 */

import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const API = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;
const PHOTOS_BASE = "/Users/apple/Documents/Dossier photos voitures chinoises";

const IMAGE_MIMES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// ─── Asset lookup: get all Sanity imageAssets ──────────────────────────────
async function getAllAssets() {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  // Use GROQ via POST to avoid URL length limit
  const r = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=*[_type=='sanity.imageAsset']{_id,originalFilename}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  const data = await r.json();
  // Build filename → id map
  const map = {};
  for (const asset of data.result || []) {
    if (asset.originalFilename) {
      map[asset.originalFilename] = asset._id;
    }
  }
  return map;
}

// ─── Upload one image ──────────────────────────────────────────────────────
async function uploadImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = IMAGE_MIMES[ext] || "image/jpeg";
  const filename = encodeURIComponent(path.basename(filePath));
  const data = readFileSync(filePath);

  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/${DATASET}?filename=${filename}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": mime },
      body: data,
    }
  );
  if (!res.ok) throw new Error(`Upload failed for ${path.basename(filePath)}: ${res.status}`);
  const json = await res.json();
  return json.document._id;
}

// ─── Get asset IDs for a folder (using cached map, upload missing) ─────────
async function getAssetIds(folderName, assetMap, opts = {}) {
  const folderPath = path.join(PHOTOS_BASE, folderName);
  let files;
  try {
    files = fs.readdirSync(folderPath)
      .filter(f => IMAGE_MIMES[path.extname(f).toLowerCase()])
      .sort()
      .map(f => ({ name: f, full: path.join(folderPath, f) }));
  } catch {
    console.log(`  ⚠️  Folder not found: ${folderPath}`);
    return [];
  }

  const ids = [];
  for (const { name, full } of files) {
    if (assetMap[name]) {
      ids.push(assetMap[name]);
    } else {
      // Try with space-to-underscore variation
      const alt = name.replace(/ /g, "_");
      if (assetMap[alt]) {
        ids.push(assetMap[alt]);
      } else {
        // Upload it
        console.log(`    Uploading missing: ${name}`);
        const id = await uploadImage(full);
        ids.push(id);
        assetMap[name] = id;
      }
    }
  }
  return ids;
}

// ─── Build photos array ────────────────────────────────────────────────────
function makePhotos(assetIds, firstIndex = 0) {
  // Reorder so the "first" photo is at position 0
  const reordered = [
    assetIds[firstIndex],
    ...assetIds.slice(0, firstIndex),
    ...assetIds.slice(firstIndex + 1),
  ];
  return reordered.map((id, i) => ({
    _type: "image",
    _key: `photo-${i}-${id.slice(-8)}`,
    asset: { _type: "reference", _ref: id },
  }));
}

// ─── Mutation helper ───────────────────────────────────────────────────────
async function mutate(mutations) {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mutation failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return res.json();
}

function specs(arr) {
  return arr.map(([key, value]) => ({
    _type: "spec",
    _key: key.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40),
    key,
    value,
  }));
}

// ─── Car definitions ───────────────────────────────────────────────────────
const CARS = [
  {
    _id: "car-14",
    brand: "GAC Motor",
    model: "GS3",
    year: "2026",
    cat: "suv",
    badge: "pop",
    badgeText: "Populaire",
    featured: false,
    price: "8 300 000",
    color: "#3A3A3A",
    colors: ["Blanc", "Noir", "Gris", "Bleu", "Argent"],
    mini_v1: "5", mini_k1: "places",
    mini_v2: "6", mini_k2: "haut-parleurs",
    mini_v3: "0", mini_k3: "kilomètre",
    desc: "Le GAC GS3 2026 version HT2A est le SUV compact accessible de GAC Motor. Siège conducteur électrique 6 positions, système audio 6 haut-parleurs, contrôle de descente HDC. Disponible en 3 coloris : Argent, Gris Graphène, Gris Clair de Lune.",
    specs: specs([
      ["Moteur", "Essence"],
      ["Places", "5 places"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Sièges", "Conducteur électrique 6 positions"],
      ["Audio", "6 haut-parleurs"],
      ["Couleurs", "Argent, Gris Graphène, Gris Clair de Lune"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "GAC GS3",
    firstPhotoIndex: 0,
    order: 15,
  },
  {
    _id: "car-17",
    brand: "Jetour",
    model: "TRAVELER T2 — 7 Pl. Premium",
    year: "2026",
    cat: "suv",
    badge: "new",
    badgeText: "Full Option",
    featured: false,
    price: "20 744 000",
    color: "#2A1A3A",
    colors: ["Blanc", "Sable", "Noir Highway", "Gris Highway", "Cyan Brumeux"],
    mini_v1: "2.0T", mini_k1: "turbo essence",
    mini_v2: "7", mini_k2: "places",
    mini_v3: "Premium", mini_k3: "finition",
    desc: "Le Jetour Traveler T2 7 places version Premium Full Option. Motorisation 2.0 Turbo, finition supérieure avec équipements additionnels, 3 rangées de sièges. Le grand SUV familial dans sa configuration la plus complète, livré neuf en Afrique francophone.",
    specs: specs([
      ["Moteur", "2.0 Turbo Essence"],
      ["Places", "7 places"],
      ["Finition", "Full Option Premium"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Transmission", "Automatique"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "2025 JEtour T2 Gazoline 7 seats",
    firstPhotoIndex: 0,
    order: 12,
  },
  {
    _id: "car-18",
    brand: "EXEED",
    model: "STELLAR 400T",
    year: "2026",
    cat: "suv",
    badge: "new",
    badgeText: "Nouveau",
    featured: false,
    price: "16 500 000",
    color: "#1A2A4A",
    colors: ["Blanc", "Gris", "Noir", "Bleu"],
    mini_v1: "2.0T", mini_k1: "turbo essence",
    mini_v2: "5", mini_k2: "places",
    mini_v3: "0", mini_k3: "kilomètre",
    desc: "L'EXEED STELLAR 400T est le SUV premium du groupe Chery. Moteur 2.0T puissant, finitions luxueuses, technologie embarquée avancée. Design spectaculaire inspiré de l'aviation, intérieur haut de gamme. Livré neuf 0km vers les ports d'Afrique francophone.",
    specs: specs([
      ["Moteur", "2.0T Turbo Essence"],
      ["Places", "5 places"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Transmission", "Automatique"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "EXEED RX 400 T ",
    firstPhotoIndex: 1, // exterior shot is at index 1 (1573_19.jpg)
    order: 18,
  },
  {
    _id: "car-19",
    brand: "Geely",
    model: "COOLRAY CVT",
    year: "2026",
    cat: "suv",
    badge: "pop",
    badgeText: "Populaire",
    featured: false,
    price: "9 500 000",
    color: "#1A3A5C",
    colors: ["Blanc", "Gris", "Bleu", "Noir", "Rouge"],
    mini_v1: "1.5T", mini_k1: "essence",
    mini_v2: "5", mini_k2: "places",
    mini_v3: "CVT", mini_k3: "boîte auto",
    desc: "Le Geely COOLRAY CVT 2026 est le SUV compact de Geely, technologie Volvo incluse. Moteur 1.5T, boîte CVT fluide, design avant-gardiste et équipements technologiques de pointe. Livré neuf 0km en Afrique francophone.",
    specs: specs([
      ["Moteur", "1.5T Turbo Essence"],
      ["Places", "5 places"],
      ["Boîte", "CVT automatique"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Transmission", "Traction avant"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "Geely Coolray",
    firstPhotoIndex: 0,
    order: 19,
  },
  {
    _id: "car-20",
    brand: "Geely",
    model: "COOLRAY Manuel",
    year: "2026",
    cat: "suv",
    badge: "pop",
    badgeText: "Populaire",
    featured: false,
    price: "8 900 000",
    color: "#2A4A6E",
    colors: ["Blanc", "Gris", "Bleu", "Noir", "Rouge"],
    mini_v1: "1.5T", mini_k1: "essence",
    mini_v2: "5", mini_k2: "places",
    mini_v3: "Manuel", mini_k3: "boîte 6 vit.",
    desc: "Le Geely COOLRAY Manuel 2026 est la version manuelle du SUV compact de Geely. Moteur 1.5T, boîte 6 vitesses manuelle, design moderne et technologies héritées de Volvo. Accessible et fiable, livré neuf 0km en Afrique francophone.",
    specs: specs([
      ["Moteur", "1.5T Turbo Essence"],
      ["Places", "5 places"],
      ["Boîte", "Manuelle 6 vitesses"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Transmission", "Traction avant"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "Geely Coolray",
    firstPhotoIndex: 0,
    order: 20,
  },
  {
    _id: "car-24",
    brand: "Changan",
    model: "CS55 PLUS PHEV",
    year: "2026",
    cat: "hybride",
    badge: "new",
    badgeText: "Hybride",
    featured: false,
    price: "12 800 000",
    color: "#2A5C3A",
    colors: ["Blanc", "Gris", "Noir", "Bleu", "Vert"],
    mini_v1: "PHEV", mini_k1: "hybride rechargeable",
    mini_v2: "5", mini_k2: "places",
    mini_v3: "0", mini_k3: "kilomètre",
    desc: "Le Changan CS55 Plus PHEV 2026 est la version hybride rechargeable du best-seller CS55. Motorisation hybride plug-in alliant économie et performance, design renouvelé et technologies avancées. Livré neuf 0km vers tous les ports d'Afrique francophone.",
    specs: specs([
      ["Moteur", "1.5T Hybride Plug-in PHEV"],
      ["Places", "5 places"],
      ["Type", "Hybride rechargeable"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Transmission", "Automatique E-CVT"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "Changan CS55 PLUS PHEV 2026",
    firstPhotoIndex: 0,
    order: 24,
  },
  {
    _id: "car-28",
    brand: "Roewe",
    model: "i5 Manuel",
    year: "2026",
    cat: "suv",
    badge: "pop",
    badgeText: "Populaire",
    featured: false,
    price: "7 800 000",
    color: "#3A3A5C",
    colors: ["Blanc", "Gris", "Noir", "Bleu", "Argent"],
    mini_v1: "5", mini_k1: "places",
    mini_v2: "Manuel", mini_k2: "boîte 5 vit.",
    mini_v3: "0", mini_k3: "kilomètre",
    desc: "Le Roewe i5 Manuel 2026 est la berline compacte accessible du groupe SAIC. Design moderne, habitacle spacieux, motorisation essence économique avec boîte manuelle. Idéal pour la ville et les trajets quotidiens, livré neuf 0km en Afrique francophone.",
    specs: specs([
      ["Moteur", "Essence"],
      ["Places", "5 places"],
      ["Boîte", "Manuelle 5 vitesses"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "Roewe i5",
    firstPhotoIndex: 0,
    order: 28,
  },
  {
    _id: "car-29",
    brand: "MG",
    model: "MG5 CVT Deluxe",
    year: "2026",
    cat: "suv",
    badge: "pop",
    badgeText: "Populaire",
    featured: false,
    price: "8 500 000",
    color: "#5C1A1A",
    colors: ["Blanc", "Rouge", "Gris", "Noir", "Bleu"],
    mini_v1: "5", mini_k1: "places",
    mini_v2: "CVT", mini_k2: "boîte auto",
    mini_v3: "Deluxe", mini_k3: "finition",
    desc: "La MG5 CVT Deluxe 2026 est la berline sportive de MG. Design dynamique inspiré du motorsport, motorisation essence avec boîte CVT, finition Deluxe bien équipée. Rapport qualité-prix imbattable, livrée neuve 0km en Afrique francophone.",
    specs: specs([
      ["Moteur", "Essence"],
      ["Places", "5 places"],
      ["Boîte", "CVT automatique"],
      ["Finition", "Deluxe"],
      ["Année", "2026"],
      ["Kilométrage", "0 km — Neuf"],
      ["Garantie", "Garantie constructeur"],
    ]),
    folder: "MG5",
    firstPhotoIndex: 0,
    order: 29,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n📦 Loading all Sanity image assets...");
  const assetMap = await getAllAssets();
  console.log(`  ✓ ${Object.keys(assetMap).length} assets indexed\n`);

  // 1. Delete car-22 (0 photos)
  console.log("🗑️  Deleting car-22 (Jetour Conquer, 0 photos)...");
  try {
    await mutate([{ delete: { id: "car-22" } }]);
    console.log("  ✓ Deleted\n");
  } catch (e) {
    console.log(`  ⚠️  car-22 delete: ${e.message}\n`);
  }

  // 2. Restore each deleted car
  for (const car of CARS) {
    console.log(`\n🚗 Restoring ${car._id} — ${car.brand} ${car.model}`);

    // Collect photo asset IDs
    const assetIds = await getAssetIds(car.folder, assetMap);
    console.log(`  Photos found: ${assetIds.length}`);

    if (assetIds.length === 0) {
      console.log(`  ⚠️  No photos found — skipping ${car._id}`);
      continue;
    }

    const photos = makePhotos(assetIds, Math.min(car.firstPhotoIndex, assetIds.length - 1));

    const doc = {
      _id: car._id,
      _type: "car",
      brand: car.brand,
      model: car.model,
      year: car.year,
      cat: car.cat,
      badge: car.badge,
      badgeText: car.badgeText,
      featured: car.featured,
      price: car.price,
      color: car.color,
      colors: car.colors,
      photos,
      specs: car.specs,
      mini_v1: car.mini_v1, mini_k1: car.mini_k1,
      mini_v2: car.mini_v2, mini_k2: car.mini_k2,
      mini_v3: car.mini_v3, mini_k3: car.mini_k3,
      desc: car.desc,
      order: car.order,
    };

    try {
      await mutate([{ createOrReplace: doc }]);
      console.log(`  ✓ ${car._id} restored with ${photos.length} photos`);
    } catch (e) {
      console.error(`  ✗ Failed: ${e.message}`);
    }
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
