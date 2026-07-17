/**
 * Upload BYD SEALION 7 photos (1698type & 1798type) to Sanity CMS
 * Usage: node scripts/upload-sealion7-photos.mjs
 */

import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;

const CARS = [
  {
    carId: "car-byd-sealion7-navigator",
    folder: "/Users/apple/Documents/Dossier photos voitures chinoises/BYD SEALION 7/1698type",
    label: "SEALION 7 Navigator Edition (1698)",
  },
  {
    carId: "car-byd-sealion7-piloteplus",
    folder: "/Users/apple/Documents/Dossier photos voitures chinoises/BYD SEALION 7/1798type ",
    label: "SEALION 7 Édition Pilote+ (1798)",
  },
];

const IMAGE_MIMES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function getImageFiles(folder) {
  return fs.readdirSync(folder)
    .filter(f => IMAGE_MIMES[path.extname(f).toLowerCase()])
    .sort()
    .map(f => path.join(folder, f));
}

async function uploadImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = IMAGE_MIMES[ext] || "image/png";
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
    _key: `p${i}`,
    asset: { _type: "reference", _ref: id },
  }));

  // Patch the draft document (prefixed with "drafts.")
  const draftId = carId.startsWith("drafts.") ? carId : `drafts.${carId}`;

  const res = await fetch(`${API_BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      mutations: [{ patch: { id: draftId, set: { photos } } }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Patch failed for ${carId}: ${res.status} ${text.slice(0, 200)}`);
  }
  return await res.json();
}

async function publishDocument(carId) {
  const res = await fetch(`${API_BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      mutations: [{ publish: { id: carId } }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`  ⚠ Publish warning for ${carId}: ${res.status} ${text.slice(0, 200)}`);
  } else {
    console.log(`  ✓ Published`);
  }
}

async function main() {
  for (const { carId, folder, label } of CARS) {
    console.log(`\n🚗 ${label}`);
    const files = getImageFiles(folder);
    console.log(`  📸 ${files.length} photos trouvées`);

    const assetIds = [];
    for (let i = 0; i < files.length; i += 4) {
      const batch = files.slice(i, i + 4);
      const ids = await Promise.all(batch.map(uploadImage));
      assetIds.push(...ids);
      console.log(`  ✓ ${Math.min(i + 4, files.length)}/${files.length} uploadées`);
    }

    await patchCarPhotos(carId, assetIds);
    console.log(`  ✓ Photos liées au document Sanity`);

    await publishDocument(carId);
  }

  console.log("\n✅ Terminé !");
}

main().catch(console.error);
