/**
 * Upload photos for new cars (car-19 to car-29, car-21, etc.)
 * Usage: node scripts/upload-new-cars.mjs
 */

import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = process.env.SANITY_TOKEN;
const PHOTOS_BASE = "/Users/apple/Documents/Dossier photos voitures chinoises/Voitures à importer 200726 2";
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;

// New cars from "Voitures à importer 200726 2" — use prepared/ subfolder
const FOLDER_MAP = [
  { folder: "Changan Eado Plus 2026/prepared", cars: ["car-changan-eado-plus-2026"] },
  { folder: "Wuling Gen 4th/prepared",         cars: ["car-wuling-miniev-4th"] },
  { folder: "MG5 2026/prepared",               cars: ["car-mg5-2026"] },
];

const IMAGE_MIMES = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".heic": "image/heic",
};

function getImageFiles(folder) {
  try {
    return fs.readdirSync(folder)
      .filter(f => IMAGE_MIMES[path.extname(f).toLowerCase()])
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
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": mime },
      body: data,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${path.basename(filePath)}: ${res.status} ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.document._id;
}

async function patchCarPhotos(carId, assetIds) {
  const photos = assetIds.map((id, i) => ({
    _type: "image",
    _key: `photo-${i}-${id.slice(-8)}`,
    asset: { _type: "reference", _ref: id },
  }));

  const res = await fetch(`${API_BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ patch: { id: carId, set: { photos } } }] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Patch failed for ${carId}: ${res.status} ${text.slice(0, 200)}`);
  }
  return await res.json();
}

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

async function main() {
  for (const { folder, cars } of FOLDER_MAP) {
    const folderPath = path.join(PHOTOS_BASE, folder);
    const files = getImageFiles(folderPath);

    if (files.length === 0) {
      console.log(`⚠️  Skipping "${folder}" — no images found`);
      continue;
    }

    console.log(`\n📂 "${folder}" (${files.length} photos) → ${cars.join(", ")}`);

    let assetIds;
    try {
      assetIds = await uploadBatch(files);
      console.log(`\n  ✓ ${assetIds.length} assets uploaded`);
    } catch (err) {
      console.error(`  ✗ Upload error: ${err.message}`);
      continue;
    }

    for (const carId of cars) {
      try {
        await patchCarPhotos(carId, assetIds);
        console.log(`  ✓ Patched ${carId}`);
        // Publish after patching
        const pubRes = await fetch(`${API_BASE}/data/mutate/${DATASET}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ mutations: [{ publish: { id: carId } }] }),
        });
        if (pubRes.ok) console.log(`  ✓ Published ${carId}`);
        else console.warn(`  ⚠️  Publish ${carId}: ${pubRes.status}`);
      } catch (err) {
        console.error(`  ✗ Patch error for ${carId}: ${err.message}`);
      }
    }
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
