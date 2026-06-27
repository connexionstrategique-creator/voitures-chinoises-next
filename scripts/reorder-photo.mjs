/**
 * Move photo at position N to first position for a given car.
 * Usage: node scripts/reorder-photo.mjs
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "t3ow1rmc",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Config
const CAR_BRAND = "Jetour";
const CAR_MODEL = "X70 PLUS — 7 Places";
const PHOTO_INDEX = 15; // 16th photo (0-based index)

async function run() {
  // Find the car document
  const car = await client.fetch(
    `*[_type == "car" && brand == $brand && model == $model][0]{ _id, "photos": photos[]{ _key, asset } }`,
    { brand: CAR_BRAND, model: CAR_MODEL }
  );

  if (!car) {
    console.error(`Car not found: ${CAR_BRAND} ${CAR_MODEL}`);
    process.exit(1);
  }

  const photos = car.photos;
  console.log(`Found car ${car._id} with ${photos.length} photos`);

  if (PHOTO_INDEX >= photos.length) {
    console.error(`Photo index ${PHOTO_INDEX} out of range (${photos.length} photos)`);
    process.exit(1);
  }

  // Move photo at PHOTO_INDEX to position 0
  const target = photos[PHOTO_INDEX];
  const reordered = [target, ...photos.filter((_, i) => i !== PHOTO_INDEX)];

  console.log(`Moving photo #${PHOTO_INDEX + 1} to first position...`);

  await client.patch(car._id).set({ photos: reordered }).commit();

  console.log("Done. Photo reordered successfully.");
}

run().catch((err) => { console.error(err); process.exit(1); });
