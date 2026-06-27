/**
 * Upload car photos from local folders to Sanity CMS
 * Usage: node scripts/upload-photos.mjs
 *
 * Maps local photo folders to Sanity car document IDs,
 * uploads each image as a Sanity asset, then patches the car
 * document's `photos` field with the new references.
 */

import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

// ─── Config ───────────────────────────────────────────────────────────────────
const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const PHOTOS_BASE = "/Users/apple/Documents/Dossier photos voitures chinoises";
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;

// ─── Folder → Car ID mapping ──────────────────────────────────────────────────
// Multiple folders can map to the same car (different colors, versions).
// Photos from all mapped folders will be combined.
const FOLDER_MAP = {
  // BYD
  "BYD LEOPARD 08 luxueuse 07 places ": "car-1",  // TITANIUM 7 (7 places)
  "BYD LEOPARD 8":                        "car-2",  // LÉOPARD 8
  "BYD LEOPARD 8 FLAGSHIP 05 PLACES":    "car-2",

  // Changan
  "Changan Unik":                          "car-3",  // UNI-K
  "Changan Unik Noire ":                   "car-3",
  "CS75 PLUS":                             "car-4",  // CS75 PLUS ULTRA
  "Changan CS 75 plus 2026 03 ecrans":    "car-4",
  "Changan UNIZ 2026 essence":             "car-5",  // UNI-Z
  "Changan Uni z hybrid ":                 "car-5",
  "Changan X5 plus 1039":                  "car-6",  // X5 PLUS
  "Changan X5 plus 919":                   "car-6",
  "Changan CS55 PLUS PHEV 2026":           "car-7",  // CS55
  "Changan CS55 PLUS":                     "car-7",
  "Changan CS55 Plus 2026":               "car-7",

  // Jetour
  "Jetour Dashing 2025 luxueuse":          "car-9",  // DASHING
  "Jetour T2 05 places 2025 noir ":        "car-10", // TRAVELER T2 — 5 Places
  "Jetour T2 05 places Gazoline 2026":    "car-10",
  "Jetour T2 07 places":                   "car-11", // TRAVELER T2 — 7 Places
  "2025 JEtour T2 Gazoline 7 seats":      "car-17", // TRAVELER T2 — 7 Pl. Premium
  "JETOUR X70 L 2026":                     "car-12", // X70 PLUS — 7 Places
  "Jetour G700 II":                        "car-16", // G700 IIIC FULL OPTION

  // GAC
  "GAC E8":                                "gTRUfa5Xcm746AkAPasbE7",
  "GAC GS3":                               "car-14",

  // Other
  "Livan X3 pro":                          "car-15",
};

const IMAGE_MIMES = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".heic": "image/heic",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getImageFiles(folder) {
  try {
    return fs.readdirSync(folder)
      .filter(f => {
        const ext = path.extname(f).toLowerCase();
        return IMAGE_MIMES[ext] !== undefined;
      })
      .map(f => path.join(folder, f));
  } catch {
    return [];
  }
}

async function uploadImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = IMAGE_MIMES[ext] || "image/jpeg";
  const filename = encodeURIComponent(path.basename(filePath));
  const data = readFileSync(filePath);

  const res = await fetch(
    `${API_BASE}/assets/images/${DATASET}?filename=${filename}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": mime,
      },
      body: data,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${path.basename(filePath)}: ${res.status} ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  return json.document._id; // e.g. "image-abc123..."
}

async function patchCarPhotos(carId, assetIds) {
  const photos = assetIds.map((id, i) => ({
    _type: "image",
    _key: `photo-${i}-${id.slice(-8)}`,
    asset: { _type: "reference", _ref: id },
  }));

  const res = await fetch(`${API_BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: carId, set: { photos } } }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Patch failed for ${carId}: ${res.status} ${text.slice(0, 200)}`);
  }
  return await res.json();
}

// Upload in batches to avoid hammering the API
async function uploadBatch(filePaths, batchSize = 4) {
  const results = [];
  for (let i = 0; i < filePaths.length; i += batchSize) {
    const batch = filePaths.slice(i, i + batchSize);
    const ids = await Promise.all(batch.map(uploadImage));
    results.push(...ids);
    process.stdout.write(`  uploaded ${Math.min(i + batchSize, filePaths.length)}/${filePaths.length}\r`);
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Build car → [file paths] map, combining multiple folders per car
  const carFiles = new Map();

  for (const [folder, carId] of Object.entries(FOLDER_MAP)) {
    const folderPath = path.join(PHOTOS_BASE, folder);
    const files = getImageFiles(folderPath);
    if (files.length === 0) {
      console.log(`⚠️  Skipping "${folder}" — no images found`);
      continue;
    }
    if (!carFiles.has(carId)) carFiles.set(carId, []);
    carFiles.get(carId).push(...files);
    console.log(`✓  Mapped ${files.length} photos: "${folder}" → ${carId}`);
  }

  console.log(`\n📦 Processing ${carFiles.size} cars...\n`);

  for (const [carId, files] of carFiles) {
    const uniqueFiles = [...new Set(files)]; // deduplicate (same folder mapped twice)
    console.log(`\n🚗 ${carId} — uploading ${uniqueFiles.length} images...`);
    try {
      const assetIds = await uploadBatch(uniqueFiles);
      console.log(`  ✓ ${assetIds.length} assets uploaded`);
      await patchCarPhotos(carId, assetIds);
      console.log(`  ✓ Car document patched`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
