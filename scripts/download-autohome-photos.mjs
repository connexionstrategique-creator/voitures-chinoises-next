/**
 * Download official AutoHome car photos and upload to Sanity CMS.
 *
 * SAFETY: Each car is mapped to ONE specific AutoHome series ID.
 * Photos from one car's series can NEVER mix with another car's series.
 *
 * Usage: node scripts/download-autohome-photos.mjs [--car=car-1] [--dry-run]
 *
 * Options:
 *   --car=car-X   Process only this specific car (default: all)
 *   --dry-run     Download images but don't upload to Sanity
 *   --limit=N     Max photos per car (default: 20)
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { tmpdir } from "os";

// ─── Config ───────────────────────────────────────────────────────────────────
const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;
const AUTOHOME_PIC_BASE = "https://car.autohome.com.cn/pic/series/";
const CDN_PROTO = "https:";

// Temp folder for downloaded images
const TMP_DIR = path.join(tmpdir(), "autohome-photos");

// ─── Car → AutoHome Series ID Mapping ─────────────────────────────────────────
// CRITICAL: Each entry is individually verified. Do NOT reorder or combine.
// Only cars with a confirmed series ID are included — others are explicitly skipped.
const SERIES_MAP = [
  { carId: "car-1",  brand: "BYD",       model: "TITANIUM 7",        seriesId: 8171 },
  // car-2 (BYD LÉOPARD 8): series ID not found — skip
  { carId: "car-3",  brand: "Changan",   model: "UNI-K",              seriesId: 5927 },
  { carId: "car-4",  brand: "Changan",   model: "CS75 PLUS ULTRA",    seriesId: 5179 },
  // car-5 (Changan UNI-Z): series ID not found — skip
  // car-6 (Changan X5 PLUS): series ID not found — skip
  { carId: "car-7",  brand: "Changan",   model: "CS55",               seriesId: 5498 },
  // car-8 (Jetour T1): NOT in Sanity CMS — skip
  { carId: "car-9",  brand: "Jetour",    model: "DASHING",            seriesId: 6291 },
  { carId: "car-10", brand: "Jetour",    model: "TRAVELER T2 — 5P",  seriesId: 6606 },
  { carId: "car-11", brand: "Jetour",    model: "TRAVELER T2 — 7P",  seriesId: 6606 },
  { carId: "car-17", brand: "Jetour",    model: "TRAVELER T2 — 7P Premium", seriesId: 6606 },
  // car-12 (Jetour X70 PLUS): series ID not found — skip
  // car-13 (GAC S7): NOT in Sanity CMS — skip
  { carId: "car-14", brand: "GAC Motor", model: "GS3",                seriesId: 3495 },
  { carId: "car-15", brand: "Livan",     model: "X3 PRO",             seriesId: 6607 },
  // car-16 (G700 IIIC): not listed on AutoHome — skip
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https://") ? https : http;
    proto.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Referer": "https://car.autohome.com.cn/",
      }
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https://") ? https : http;
    proto.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": "https://car.autohome.com.cn/",
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        if (location) return resolve(fetchBuffer(location.startsWith("//") ? CDN_PROTO + location : location));
      }
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

// Extract image CDN URLs from AutoHome series page HTML
function extractImageUrls(html, seriesId) {
  const regex = /\/\/(car[0-9]*\.autoimg\.cn\/cardfs\/product\/[^"]+\.jpg)/g;
  const seen = new Set();
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const path = match[1];
    // Strip the size prefix: "480x360_0_q95_c42_" (or similar) → full size
    // Pattern: SIZE_0_q95_c42_autohomecar__HASH.jpg → autohomecar__HASH.jpg
    const fullPath = path.replace(/^(car[0-9]*\.autoimg\.cn\/cardfs\/product\/.*?\/)([0-9]+x[0-9]+_[^_]+_[^_]+_[^_]+_)(autohomecar__.+\.jpg)$/, "$1$3");
    const fullUrl = CDN_PROTO + "//" + fullPath;
    if (!seen.has(fullPath)) {
      seen.add(fullPath);
      urls.push(fullUrl);
    }
  }

  if (urls.length === 0) {
    console.warn(`  ⚠  No images found in HTML for series ${seriesId}`);
    console.warn(`     (The page may require JavaScript — try: node scripts/check-series.mjs ${seriesId})`);
  }
  return urls;
}

async function downloadImage(url, destPath) {
  const buf = await fetchBuffer(url);
  if (buf.length < 1000) throw new Error(`Tiny response (${buf.length} bytes) — probably an error page`);
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function uploadToSanity(filePath, filename) {
  const data = fs.readFileSync(filePath);
  const mime = "image/jpeg";
  const res = await fetch(
    `${API_BASE}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": mime },
      body: data,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.document._id;
}

async function patchCarPhotos(carId, assetIds) {
  const photos = assetIds.map((id, i) => ({
    _type: "image",
    _key: `ah-photo-${i}-${id.slice(-8)}`,
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

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const targetCar = args.find(a => a.startsWith("--car="))?.split("=")[1];
  const dryRun = args.includes("--dry-run");
  const limitArg = args.find(a => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1]) : 20;

  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  const targets = targetCar
    ? SERIES_MAP.filter(e => e.carId === targetCar)
    : SERIES_MAP;

  if (targets.length === 0) {
    console.error(`❌  Car "${targetCar}" not found in SERIES_MAP or has no series ID.`);
    process.exit(1);
  }

  // Track which series we already processed to avoid re-downloading
  // (Traveler T2 5P, 7P, 7P Premium all share series 6606)
  const processedSeries = new Map(); // seriesId → assetIds[]

  console.log(`\n🚗 AutoHome Photo Downloader — ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`   Cars: ${targets.length} | Limit: ${limit} photos each\n`);

  for (const entry of targets) {
    const { carId, brand, model, seriesId } = entry;
    const label = `${brand} ${model} (${carId}) ← series ${seriesId}`;
    console.log(`\n▶  ${label}`);

    // Check if we already uploaded for this series (shared models like Traveler T2 variants)
    if (processedSeries.has(seriesId) && !dryRun) {
      const cachedIds = processedSeries.get(seriesId);
      console.log(`   ↳ Same series as a previous car — reusing ${cachedIds.length} assets`);
      try {
        await patchCarPhotos(carId, cachedIds);
        console.log(`   ✓ Sanity document ${carId} patched`);
      } catch (err) {
        console.error(`   ✗ Patch failed for ${carId}: ${err.message}`);
      }
      continue;
    }

    // Fetch series page HTML
    const seriesUrl = `${AUTOHOME_PIC_BASE}${seriesId}.html`;
    console.log(`   Fetching ${seriesUrl}...`);
    let html;
    try {
      html = await fetchText(seriesUrl);
    } catch (err) {
      console.error(`   ✗ Failed to fetch series page: ${err.message}`);
      continue;
    }

    const allUrls = extractImageUrls(html, seriesId);
    if (allUrls.length === 0) continue;

    const urls = allUrls.slice(0, limit);
    console.log(`   Found ${allUrls.length} images, using first ${urls.length}`);

    // Download images to temp folder
    const carTmpDir = path.join(TMP_DIR, `${seriesId}`);
    if (!fs.existsSync(carTmpDir)) fs.mkdirSync(carTmpDir, { recursive: true });

    const downloadedFiles = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${seriesId}_${String(i + 1).padStart(3, "0")}_${path.basename(url)}`;
      const destPath = path.join(carTmpDir, filename);

      // Skip if already downloaded
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        downloadedFiles.push(destPath);
        process.stdout.write(`   ✓ ${i + 1}/${urls.length} (cached)\r`);
        continue;
      }

      try {
        const bytes = await downloadImage(url, destPath);
        downloadedFiles.push(destPath);
        process.stdout.write(`   ↓ ${i + 1}/${urls.length} — ${(bytes / 1024).toFixed(0)}KB\r`);
      } catch (err) {
        console.error(`\n   ✗ Failed to download ${url}: ${err.message}`);
      }
    }
    console.log(`\n   Downloaded: ${downloadedFiles.length}/${urls.length} images`);

    if (dryRun) {
      console.log(`   [DRY RUN] Would upload ${downloadedFiles.length} images to Sanity`);
      continue;
    }

    if (downloadedFiles.length === 0) {
      console.error(`   ✗ No images to upload for ${label}`);
      continue;
    }

    // Upload to Sanity
    console.log(`   Uploading to Sanity...`);
    const assetIds = [];
    for (let i = 0; i < downloadedFiles.length; i++) {
      try {
        const id = await uploadToSanity(downloadedFiles[i], path.basename(downloadedFiles[i]));
        assetIds.push(id);
        process.stdout.write(`   ↑ ${i + 1}/${downloadedFiles.length}\r`);
      } catch (err) {
        console.error(`\n   ✗ Upload error: ${err.message}`);
      }
    }
    console.log(`\n   Uploaded: ${assetIds.length} assets`);

    // Patch the car document
    try {
      await patchCarPhotos(carId, assetIds);
      console.log(`   ✓ Sanity document ${carId} patched with ${assetIds.length} photos`);
    } catch (err) {
      console.error(`   ✗ Patch failed for ${carId}: ${err.message}`);
      console.error(`     (Document may not exist in Sanity — check car IDs)`);
      continue;
    }

    // Cache for shared-series cars
    processedSeries.set(seriesId, assetIds);
  }

  console.log("\n✅ Done!\n");

  if (dryRun) {
    console.log("Temp files saved to:", TMP_DIR);
    console.log("Re-run without --dry-run to upload to Sanity.\n");
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
