import { createClient } from "@sanity/client";
import https from "https";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const client = createClient({ projectId: "t3ow1rmc", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: TOKEN });

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.headers.location) return resolve(download(res.headers.location));
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Pexels: voiture avec chauffeur VTC / taxi moderne
const IMAGE_URL = "https://images.pexels.com/photos/1068949/pexels-photo-1068949.jpeg?auto=compress&cs=tinysrgb&w=1920";

async function main() {
  console.log("Téléchargement de l'image VTC...");
  const buf = await download(IMAGE_URL);
  console.log("Upload vers Sanity...");
  const asset = await client.assets.upload("image", buf, { filename: "vtc-gozem-yango-voiture-2026.jpg", contentType: "image/jpeg" });
  console.log("Asset ID:", asset._id);

  await client.patch("article-vtc-gozem-yango-voitures-chinoises-2026").set({
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Voiture chinoise pour VTC Gozem Yango en Afrique 2026",
    },
  }).commit();

  console.log("✅ Image ajoutée à l'article VTC !");
}

main().catch(console.error);
