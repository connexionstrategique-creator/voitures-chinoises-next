import { createClient } from "@sanity/client";
import { createReadStream, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const client = createClient({
  projectId: "t3ow1rmc",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/CS55 PLUS basic";
const CAR_ID = "car-cs55plus-elite";

async function uploadPhotos() {
  const files = readdirSync(PHOTOS_DIR)
    .filter(f => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()))
    .sort();

  console.log(`Uploading ${files.length} photos...`);
  const assets = [];

  for (const file of files) {
    const path = join(PHOTOS_DIR, file);
    console.log(`  Uploading ${file}...`);
    const asset = await client.assets.upload("image", createReadStream(path), {
      filename: file,
    });
    assets.push({ _type: "image", _key: asset._id.slice(-8), asset: { _type: "reference", _ref: asset._id } });
    console.log(`  ✓ ${file} → ${asset._id}`);
  }

  return assets;
}

async function createCarDocument(photos) {
  const doc = {
    _id: CAR_ID,
    _type: "car",
    brand: "Changan",
    model: "CS55 PLUS Élite",
    price: "9 600 000",
    autohomeId: "ext/72642",
    colors: ["Blanc", "Gris", "Noir", "Bleu"],
    photos,
    tags: null,
    specs: [
      { _key: "s0", key: "— PARAMÈTRES GÉNÉRAUX —", value: "" },
      { _key: "s1", key: "Modèle", value: "Changan CS55 PLUS 2026 — 4e Génération — 1.5T Élite" },
      { _key: "s2", key: "Année de mise sur le marché", value: "2026" },
      { _key: "s3", key: "Carrosserie", value: "SUV compact · 5 portes · 5 places" },
      { _key: "s4", key: "Transmission", value: "Traction avant (FWD)" },
      { _key: "s5", key: "Carburant", value: "Essence 92" },
      { _key: "s6", key: "Masse à vide", value: "1 430 kg" },
      { _key: "s7", key: "Réservoir", value: "51 L" },
      { _key: "s8", key: "Coffre", value: "475 L — sièges rabattus : 1 415 L" },
      { _key: "s9", key: "Garde au sol", value: "188 mm" },
      { _key: "s10", key: "Angle d'attaque / de fuite", value: "20° / 27°" },
      { _key: "s11", key: "— MOTORISATION 1.5T 7DCT —", value: "" },
      { _key: "s12", key: "Moteur", value: "JL473ZQD — BlueCore 1.5T · 4 cylindres en ligne · DOHC" },
      { _key: "s13", key: "Cylindrée", value: "1 494 cm³ (1,5 L)" },
      { _key: "s14", key: "Alimentation", value: "Turbocompressé · injection directe" },
      { _key: "s15", key: "Puissance maximale", value: "141 kW / 192 ch à 5 500 tr/min" },
      { _key: "s16", key: "Couple maximal", value: "310 N·m de 1 500 à 4 000 tr/min" },
      { _key: "s17", key: "Boîte de vitesses", value: "7DCT — double embrayage humide (7 rapports)" },
      { _key: "s18", key: "Vitesse maximale", value: "190 km/h" },
      { _key: "s19", key: "Consommation WLTC", value: "6,9 L/100 km" },
      { _key: "s20", key: "— DIMENSIONS & CHÂSSIS —", value: "" },
      { _key: "s21", key: "Longueur × Largeur × Hauteur", value: "4 550 × 1 868 × 1 675 mm" },
      { _key: "s22", key: "Empattement", value: "2 656 mm" },
      { _key: "s23", key: "Voie avant / arrière", value: "1 600 / 1 600 mm" },
      { _key: "s24", key: "Pneumatiques", value: "225/60 R18 · Jantes alliage aluminium" },
      { _key: "s25", key: "Suspension avant", value: "MacPherson — indépendante" },
      { _key: "s26", key: "Suspension arrière", value: "Multi-bras — indépendante" },
      { _key: "s27", key: "Direction", value: "Assistance électrique" },
      { _key: "s28", key: "Freins avant / arrière", value: "Disques ventilés / Disques" },
      { _key: "s29", key: "Frein de stationnement", value: "Électronique (EPB)" },
      { _key: "s30", key: "Roue de secours", value: "Non pleine mesure — rangée dans le coffre" },
      { _key: "s31", key: "— SÉCURITÉ PASSIVE —", value: "" },
      { _key: "s32", key: "Airbags frontaux", value: "Conducteur + passager avant" },
      { _key: "s33", key: "Airbags latéraux / rideaux", value: "Rangée avant" },
      { _key: "s34", key: "ABS / EBD / ESP", value: "Oui" },
      { _key: "s35", key: "TPMS", value: "Affichage pression pneus" },
      { _key: "s36", key: "ISOFIX", value: "Oui" },
      { _key: "s37", key: "— SÉCURITÉ ACTIVE ADAS L2 —", value: "" },
      { _key: "s38", key: "Caméra 360°", value: "Vue panoramique 360°" },
      { _key: "s39", key: "Radars", value: "3 radars ultrasoniques AV · Radars AR" },
      { _key: "s40", key: "Régulateur adaptatif", value: "ACC pleine plage de vitesse" },
      { _key: "s41", key: "Maintien de voie", value: "Centrage et maintien actif" },
      { _key: "s42", key: "Angles morts", value: "BSM · DOW alerte ouverture porte" },
      { _key: "s43", key: "Freinage urgence", value: "AEB — freinage automatique" },
      { _key: "s44", key: "Stationnement auto.", value: "APA — stationnement automatique · démarrage à distance" },
      { _key: "s45", key: "Aide démarrage en côte", value: "Oui" },
      { _key: "s46", key: "Descente contrôlée", value: "Oui" },
      { _key: "s47", key: "— EXTÉRIEUR & ÉCLAIRAGE —", value: "" },
      { _key: "s48", key: "Phares avant", value: "Full LED — allumage automatique" },
      { _key: "s49", key: "Toit", value: "Toit panoramique — ouverture électrique" },
      { _key: "s50", key: "Rétroviseurs", value: "Réglage électrique · chauffage · rabattement auto" },
      { _key: "s51", key: "Essuie-glaces", value: "Détection de pluie" },
      { _key: "s52", key: "Accès / démarrage", value: "Accès sans clé · démarrage bouton · clé Bluetooth · démarrage à distance" },
      { _key: "s53", key: "Hayon électrique", value: "Capteur de pied · mémoire de position" },
      { _key: "s54", key: "Rétroviseur intérieur", value: "Anti-éblouissement manuel" },
      { _key: "s55", key: "— COCKPIT & CONNECTIVITÉ —", value: "" },
      { _key: "s56", key: "Instrumentation", value: "10,25\" — LCD full digital" },
      { _key: "s57", key: "Écran central", value: "12,8\" — tactile" },
      { _key: "s58", key: "Compatibilité", value: "Apple CarPlay · CarLink · Huawei HiCar" },
      { _key: "s59", key: "IA vocale", value: "«Hello, Xiao'an» — reconnaissance vocale" },
      { _key: "s60", key: "Réseau", value: "4G intégré" },
      { _key: "s61", key: "Charge smartphone", value: "Charge sans fil intégrée" },
      { _key: "s62", key: "Interfaces USB", value: "2× USB/Type-C avant · 1× USB/Type-C arrière" },
      { _key: "s63", key: "Audio", value: "4 haut-parleurs" },
      { _key: "s64", key: "Application mobile", value: "Démarrage à distance · climatisation · localisation" },
      { _key: "s65", key: "— SIÈGES & HABITACLE —", value: "" },
      { _key: "s66", key: "Revêtement", value: "Simili-cuir" },
      { _key: "s67", key: "Siège conducteur", value: "Réglage électrique" },
      { _key: "s68", key: "Siège passager avant", value: "Réglage électrique" },
      { _key: "s69", key: "Sièges arrière", value: "Rabattement proportionnel" },
      { _key: "s70", key: "Climatisation", value: "Automatique · sorties d'air arrière · filtre PM2,5" },
      { _key: "s71", key: "Vitres", value: "Électriques — fermeture one-touch · anti-pincement" },
    ],
  };

  console.log(`\nCreating document ${CAR_ID}...`);
  const result = await client.createOrReplace(doc);
  console.log(`✓ Document created: ${result._id}`);
  return result;
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    console.error("Missing SANITY_TOKEN env variable");
    process.exit(1);
  }

  const photos = await uploadPhotos();
  await createCarDocument(photos);
  console.log("\nDone! Don't forget to publish in Sanity Studio.");
}

main().catch(console.error);
