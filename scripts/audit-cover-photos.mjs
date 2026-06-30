/**
 * Audit cover photos for all car documents in Sanity CMS.
 * Lists each car with its first photo URL (filename) and total photo count.
 *
 * Usage: node scripts/audit-cover-photos.mjs
 */

import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local
loadEnvConfig(projectRoot);

const PROJECT_ID = 't3ow1rmc';
const DATASET = 'production';
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error('ERROR: SANITY_TOKEN is not set. Check your .env.local file.');
  process.exit(1);
}

const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;

async function fetchCars() {
  const query = `*[_type == "car"] | order(_id asc) { _id, brand, model, "firstPhotoUrl": photos[0].asset->url, "totalPhotos": count(photos) }`;
  const url = `${API_BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity query failed: ${res.status} ${res.statusText}\n${text}`);
  }

  const data = await res.json();
  return data.result;
}

function getFilename(url) {
  if (!url) return '(no photo)';
  // Extract just the filename from the Sanity CDN URL
  // Format: https://cdn.sanity.io/images/PROJECT/DATASET/FILENAME-WxH.ext
  const parts = url.split('/');
  return parts[parts.length - 1];
}

async function main() {
  console.log('Fetching all cars from Sanity...\n');

  const cars = await fetchCars();

  if (!cars || cars.length === 0) {
    console.log('No cars found.');
    return;
  }

  console.log(`Found ${cars.length} cars.\n`);
  console.log('='.repeat(100));
  console.log(
    `${'#'.padEnd(4)} ${'ID'.padEnd(24)} ${'Brand + Model'.padEnd(35)} ${'Photos'.padEnd(8)} First Photo Filename`
  );
  console.log('='.repeat(100));

  cars.forEach((car, i) => {
    const num = String(i + 1).padEnd(4);
    const id = (car._id || '').slice(-12).padEnd(24); // last 12 chars of ID
    const label = `${car.brand || '?'} ${car.model || '?'}`.padEnd(35);
    const total = String(car.totalPhotos ?? 0).padEnd(8);
    const filename = getFilename(car.firstPhotoUrl);

    console.log(`${num} ${id} ${label} ${total} ${filename}`);
  });

  console.log('='.repeat(100));
  console.log(`\nTotal: ${cars.length} cars\n`);

  // Also print full URLs for cars whose first photo might not be exterior
  console.log('\n--- Full first-photo URLs ---\n');
  cars.forEach((car, i) => {
    const label = `${car.brand || '?'} ${car.model || '?'}`;
    console.log(`[${i + 1}] ${label}`);
    console.log(`    ID:    ${car._id}`);
    console.log(`    URL:   ${car.firstPhotoUrl || '(none)'}`);
    console.log(`    Photos: ${car.totalPhotos ?? 0}`);
    console.log();
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
